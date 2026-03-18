from pathlib import Path

from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI

from app.config import settings
from app.schemas.interview import AnswerGenerateRequest, AnswerGenerateResponse


PROMPT_PATH = Path("app/prompts/answer_prompt.txt")


def _format_user_profile_text(request: AnswerGenerateRequest) -> str:
    profile = request.user_profile
    project_lines = []

    for p in profile.projects:
        project_lines.append(
            f"- 프로젝트명: {p.name}\n"
            f"  설명: {p.description}\n"
            f"  기술스택: {', '.join(p.tech_stack) if p.tech_stack else '없음'}\n"
            f"  역할: {p.role or '미기재'}\n"
            f"  성과: {', '.join(p.achievements) if p.achievements else '없음'}"
        )

    return (
        f"이름: {profile.name or '미기재'}\n"
        f"희망직무: {profile.target_role or '미기재'}\n"
        f"기술스택: {', '.join(profile.skills) if profile.skills else '없음'}\n"
        f"경험요약: {profile.experience_summary or '미기재'}\n"
        f"프로젝트:\n" + ("\n".join(project_lines) if project_lines else "- 없음")
    )


def generate_answer(request: AnswerGenerateRequest) -> AnswerGenerateResponse:
    prompt_text = PROMPT_PATH.read_text(encoding="utf-8")
    prompt = PromptTemplate.from_template(prompt_text)

    llm = ChatOpenAI(
        model=settings.openai_model,
        api_key=settings.openai_api_key,
        temperature=0.4,
    )

    structured_llm = llm.with_structured_output(AnswerGenerateResponse)

    chain = prompt | structured_llm

    response = chain.invoke({
        "question_text": request.question_text,
        "job_description": request.job_description,
        "user_profile_text": _format_user_profile_text(request),
    })

    response.question_text = request.question_text
    return response