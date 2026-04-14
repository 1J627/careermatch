from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import ProgramMatchResult, TrainingProgram
from app.schemas import TrainingProgramResponse
from app.services.program_catalog import seed_sample_programs
from app.services.work24_programs import fetch_all_programs


router = APIRouter()


@router.post("/seed")
def seed_programs(db: Session = Depends(get_db)):
    created = seed_sample_programs(db)
    total = db.query(TrainingProgram).count()
    return {"created": created, "total": total}


@router.post("/fetch")
async def fetch_programs(
    limit: int = Query(20, ge=1, le=300),
    region: Optional[str] = Query(None),
    keyword: Optional[str] = Query(None),
    clear_sample: bool = Query(True),
    db: Session = Depends(get_db),
):
    try:
        programs = await fetch_all_programs(page_size=limit, region=region, keyword=keyword)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"고용24 API 호출 실패: {exc}") from exc

    if clear_sample:
        sample_program_ids = [
            row[0]
            for row in db.query(TrainingProgram.id)
            .filter(TrainingProgram.source == "sample")
            .all()
        ]
        if sample_program_ids:
            db.query(ProgramMatchResult).filter(
                ProgramMatchResult.program_id.in_(sample_program_ids)
            ).delete(synchronize_session=False)
            db.query(TrainingProgram).filter(
                TrainingProgram.id.in_(sample_program_ids)
            ).delete(synchronize_session=False)

    existing_ids = {
        row[0]
        for row in db.query(TrainingProgram.external_id).all()
        if row[0]
    }

    saved = 0
    for payload in programs:
        if payload["external_id"] in existing_ids:
            continue
        db.add(TrainingProgram(**payload))
        existing_ids.add(payload["external_id"])
        saved += 1

    db.commit()

    return {
        "fetched": len(programs),
        "saved": saved,
        "total": db.query(TrainingProgram).count(),
    }


@router.get("/", response_model=List[TrainingProgramResponse])
def list_programs(db: Session = Depends(get_db)):
    return (
        db.query(TrainingProgram)
        .order_by(TrainingProgram.created_at.desc(), TrainingProgram.id.desc())
        .all()
    )
