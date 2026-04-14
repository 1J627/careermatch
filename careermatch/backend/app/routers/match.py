from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Portfolio, ProgramMatchResult, TrainingProgram
from app.schemas import (
    MatchRequest,
    ProgramMatchListResponse,
    ProgramMatchResultResponse,
    TrainingProgramResponse,
)
from app.services.embedding import cosine_similarity, get_embedding, keyword_similarity
from app.services.guide_generator import generate_guide
from app.services.program_catalog import seed_sample_programs


router = APIRouter()


@router.post("/", response_model=ProgramMatchListResponse)
async def run_matching(req: MatchRequest, db: Session = Depends(get_db)):
    portfolio = db.query(Portfolio).filter(Portfolio.id == req.portfolio_id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")

    if db.query(TrainingProgram).count() == 0:
        seed_sample_programs(db)

    programs = db.query(TrainingProgram).all()
    if not programs:
        return ProgramMatchListResponse(total=0, results=[])

    portfolio_text = _build_portfolio_text(portfolio)
    portfolio_vec = await get_embedding(portfolio_text)
    preferred_types = _preferred_program_types(portfolio)

    scored = []
    for program in programs:
        program_text = _build_program_text(program)
        program_vec = await get_embedding(program_text)

        semantic = cosine_similarity(portfolio_vec, program_vec)
        lexical = keyword_similarity(portfolio_text, program_text)
        base_similarity = semantic * 0.65 + lexical * 0.35 if semantic > 0 else lexical

        skill_score = round(
            _weighted_overlap(
                (portfolio.skills or []) + (portfolio.ai_skills or []),
                f"{program.skills} {' '.join(program.tags or [])} {program.summary}",
            ) * 100,
            1,
        )
        growth_score = round(
            _weighted_overlap(
                portfolio.job_tags or [],
                f"{program.title} {program.summary} {program.benefits} {program.category}",
            ) * 100,
            1,
        )
        fit_score = round(
            _weighted_overlap(
                _portfolio_context_tokens(portfolio),
                f"{program.target_audience} {program.category} {program.location} {program.schedule}",
            ) * 100,
            1,
        )
        type_bonus = _program_type_bonus(program, preferred_types)

        score = round(
            min(
                base_similarity * 100 * 0.45
                + skill_score * 0.3
                + growth_score * 0.15
                + fit_score * 0.1
                + type_bonus,
                100,
            ),
            1,
        )

        scored.append((program, score, skill_score, growth_score, fit_score))

    scored.sort(key=lambda item: item[1], reverse=True)
    top = scored

    results = []
    for program, score, skill_score, growth_score, fit_score in top:
        match = ProgramMatchResult(
            portfolio_id=portfolio.id,
            program_id=program.id,
            score=score,
            skill_score=skill_score,
            growth_score=growth_score,
            fit_score=fit_score,
        )
        db.add(match)
        db.flush()

        results.append(
            ProgramMatchResultResponse(
                id=match.id,
                program=TrainingProgramResponse.model_validate(program),
                score=score,
                skill_score=skill_score,
                growth_score=growth_score,
                fit_score=fit_score,
                guide=match.guide,
                questions=match.questions,
            )
        )

    db.commit()
    return ProgramMatchListResponse(total=len(results), results=results)


@router.post("/{match_id}/guide")
async def get_guide(match_id: int, db: Session = Depends(get_db)):
    match = (
        db.query(ProgramMatchResult)
        .filter(ProgramMatchResult.id == match_id)
        .first()
    )
    if not match:
        raise HTTPException(status_code=404, detail="Match not found")

    portfolio = db.query(Portfolio).filter(Portfolio.id == match.portfolio_id).first()
    program = db.query(TrainingProgram).filter(TrainingProgram.id == match.program_id).first()
    if not portfolio or not program:
        raise HTTPException(status_code=404, detail="Program or portfolio not found")

    guide, questions = await generate_guide(portfolio, program)
    match.guide = guide
    match.questions = questions
    db.commit()

    return {"guide": guide, "questions": questions}


def _build_portfolio_text(portfolio: Portfolio) -> str:
    projects = " ".join(
        f"{p.get('name', '')} {p.get('stack', '')} {p.get('desc', '')}"
        for p in (portfolio.projects or [])
    )
    job_tags = " ".join(portfolio.job_tags or [])
    skills = " ".join((portfolio.skills or []) + (portfolio.ai_skills or []))
    return f"{skills} {job_tags} {portfolio.major or ''} {portfolio.intro or ''} {portfolio.salary or ''} {projects}"


def _build_program_text(program: TrainingProgram) -> str:
    tags = " ".join(program.tags or [])
    return (
        f"{program.title} {program.category} {program.summary} "
        f"{program.target_audience} {program.skills} {program.benefits} {tags}"
    )


def _weighted_overlap(source_tokens, target_text: str) -> float:
    if isinstance(source_tokens, str):
        raw = source_tokens
    else:
        raw = " ".join(token for token in (source_tokens or []) if token)
    return min(keyword_similarity(raw, target_text) * 2.4, 1.0)


def _preferred_program_types(portfolio: Portfolio) -> set[str]:
    text = " ".join(
        [
            " ".join(portfolio.job_tags or []),
            portfolio.intro or "",
            portfolio.salary or "",
        ]
    ).lower()

    preferred = set()
    if any(keyword in text for keyword in ["포트폴리오", "자소서", "면접", "취업", "지원"]):
        preferred.add("capability")
    if any(keyword in text for keyword in ["실무", "현장", "인턴", "병행", "회사"]):
        preferred.add("apprenticeship")
    if any(
        keyword in text
        for keyword in [
            "ai",
            "백엔드",
            "개발",
            "데이터",
            "클라우드",
            "부트캠프",
            "훈련",
            "사무",
            "디자인",
            "회계",
            "행정",
            "마케팅",
            "서비스",
            "기획",
            "상담",
            "복지",
            "자격증",
        ]
    ):
        preferred.add("kdt")
        preferred.add("training")
    return preferred


def _program_type_bonus(program: TrainingProgram, preferred_types: set[str]) -> float:
    if not preferred_types:
        return 0.0
    return 8.0 if program.program_type in preferred_types else 0.0


def _portfolio_context_tokens(portfolio: Portfolio) -> list[str]:
    return [
        portfolio.eng_level or "",
        portfolio.school or "",
        portfolio.major or "",
        portfolio.graduation or "",
        portfolio.salary or "",
        portfolio.intro or "",
        " ".join(_extract_project_roles(portfolio)),
    ]


def _extract_project_roles(portfolio: Portfolio) -> list[str]:
    roles = []
    for project in portfolio.projects or []:
        roles.extend(
            value
            for value in [
                project.get("role", ""),
                project.get("stack", ""),
            ]
            if value
        )
    return roles
