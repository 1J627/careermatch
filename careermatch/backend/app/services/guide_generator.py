from typing import List
import os

from langchain_core.output_parsers import JsonOutputParser
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from pydantic import BaseModel


class GuideOutput(BaseModel):
    guide: str
    questions: List[str]


parser = JsonOutputParser(pydantic_object=GuideOutput)

prompt = PromptTemplate(
    input_variables=[
        "program_title",
        "provider",
        "program_type",
        "summary",
        "target_audience",
        "skills",
        "benefits",
        "portfolio_skills",
        "projects",
        "intro",
    ],
    template="""
당신은 취업 준비생에게 학습 로드맵을 설계해주는 커리어 코치입니다.
아래 프로그램 정보와 지원자 정보를 바탕으로, 왜 이 프로그램이 적합한지와 어떤 준비를 하면 좋은지 정리하세요.

## 추천 프로그램
- 프로그램명: {program_title}
- 운영기관: {provider}
- 유형: {program_type}
- 요약: {summary}
- 추천 대상: {target_audience}
- 주요 역량: {skills}
- 기대 효과: {benefits}

## 지원자 정보
- 기술 스택: {portfolio_skills}
- 프로젝트 경험: {projects}
- 자기소개: {intro}

## 출력 형식 (JSON만 출력)
{{
  "guide": "추천 이유와 준비 로드맵을 4~6문장으로 설명",
  "questions": ["지원 전 점검 질문 1", "지원 전 점검 질문 2", "지원 전 점검 질문 3", "지원 전 점검 질문 4"]
}}
""",
)


def _fallback_guide(portfolio, program) -> tuple[str, List[str]]:
    skills = ", ".join((portfolio.skills or []) + (portfolio.ai_skills or [])) or "보유 기술"
    guide = (
        f"'{program.title}'은 현재 보유한 {skills} 역량을 실전형 결과물로 확장하기 좋은 프로그램입니다. "
        f"특히 {program.skills} 영역을 보완하면서 {program.benefits}까지 함께 준비할 수 있어 취업 준비 흐름에 잘 맞습니다. "
        f"지원 전에는 기존 프로젝트를 프로그램 주제와 연결해 설명할 수 있도록 정리하고, 수강 목표를 2~3개로 구체화해두면 좋습니다."
    )
    questions = [
        "이 프로그램을 통해 가장 먼저 보완하고 싶은 역량은 무엇인가요?",
        "기존 프로젝트 중 프로그램 목표와 가장 잘 연결되는 경험은 무엇인가요?",
        "수료 후 지원하고 싶은 직무나 포지션이 분명한가요?",
        "주당 학습 시간과 과제 수행 시간을 확보할 수 있나요?",
    ]
    return guide, questions


async def generate_guide(portfolio, program) -> tuple[str, List[str]]:
    """포트폴리오와 프로그램 정보를 바탕으로 추천 가이드를 생성합니다."""
    api_key = os.getenv("OPENAI_API_KEY", "").strip()
    if not api_key:
        return _fallback_guide(portfolio, program)

    llm = ChatOpenAI(model="gpt-4o-mini", api_key=api_key)
    chain = prompt | llm | parser
    portfolio_skills = ", ".join((portfolio.skills or []) + (portfolio.ai_skills or []))
    projects = " / ".join(
        f"{p.get('name', '')}: {p.get('desc', '')}"
        for p in (portfolio.projects or [])
    )

    try:
        result = await chain.ainvoke(
            {
                "program_title": program.title,
                "provider": program.provider or "",
                "program_type": program.category or program.program_type or "",
                "summary": program.summary or "",
                "target_audience": program.target_audience or "",
                "skills": program.skills or "",
                "benefits": program.benefits or "",
                "portfolio_skills": portfolio_skills,
                "projects": projects,
                "intro": portfolio.intro or "",
            }
        )
        return result["guide"], result["questions"]
    except Exception:
        return _fallback_guide(portfolio, program)
