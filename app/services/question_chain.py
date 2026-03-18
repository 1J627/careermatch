from pathlib import Path

from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI

from app.config import settings
from app.schemas.interview import (
    InterviewQuestion,
    QuestionGenerateRequest,
    QuestionGenerateResponse,
)
from app.services.retriever import retrieve_context, docs_to_context_text


PROMPT_PATH = Path("app/prompts/question_prompt.txt")


def _format_user_profile_text(request: QuestionGenerateRequest) -> str:
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


def generate_questions(request: QuestionGenerateRequest) -> QuestionGenerateResponse:
    retrieval_query = (
        f"company={request.company_name}, role={request.role_name}, "
        f"jd={request.job_description}, skills={','.join(request.user_profile.skills)}"
    )

    docs = retrieve_context(retrieval_query)
    retrieved_context = docs_to_context_text(docs)

    prompt_text = PROMPT_PATH.read_text(encoding="utf-8")
    prompt = PromptTemplate.from_template(prompt_text)

    llm = ChatOpenAI(
        model=settings.openai_model,
        api_key=settings.openai_api_key,
        temperature=0.3,
    )

    structured_llm = llm.with_structured_output(QuestionGenerateResponse)

    chain = prompt | structured_llm

    response = chain.invoke({
        "company_name": request.company_name,
        "role_name": request.role_name,
        "job_description": request.job_description,
        "user_profile_text": _format_user_profile_text(request),
        "retrieved_context": retrieved_context,
    })

    # 모델이 company_name/role_name을 누락하거나 틀릴 가능성 방어
    response.company_name = request.company_name
    response.role_name = request.role_name

    # 질문 수 보정
    if len(response.questions) > 6:
        response.questions = response.questions[:6]

    return response