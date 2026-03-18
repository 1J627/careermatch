from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI(title="JobCompass AI Service")


# -----------------------------
# 기본 라우터
# -----------------------------
@app.get("/")
def root():
    return {"message": "JobCompass AI FastAPI server is running"}


@app.get("/health")
def health():
    return {"status": "ok"}


# -----------------------------
# 요청/응답 스키마
# -----------------------------
class Project(BaseModel):
    title: str
    description: str
    role: str
    tech_stack: List[str]
    achievements: List[str]


class UserProfile(BaseModel):
    name: str
    desired_role: str
    skills: List[str]
    portfolio_summary: str
    projects: List[Project]


class QuestionGenerateRequest(BaseModel):
    company_name: str
    role_name: str
    job_description: str
    user_profile: UserProfile


# -----------------------------
# 질문 생성 API
# -----------------------------
@app.post("/questions/generate")
def generate_questions(req: QuestionGenerateRequest):
    questions = []

    # 1. 기술 기반 질문
    for skill in req.user_profile.skills[:3]:
        questions.append({
            "question_type": "technical",
            "question_text": f"{skill}를 활용한 프로젝트 경험을 설명해주세요.",
            "reason": f"사용자 보유 기술인 {skill}이(가) 중요 역량으로 판단됩니다.",
            "priority_score": 8.5
        })

    # 2. 프로젝트 기반 질문
    for project in req.user_profile.projects[:2]:
        questions.append({
            "question_type": "project",
            "question_text": f"{project.title} 프로젝트에서 가장 어려웠던 문제와 해결 과정을 설명해주세요.",
            "reason": "사용자의 실제 프로젝트 경험을 확인하기 위한 질문입니다.",
            "priority_score": 9.0
        })

    # 3. 기업 적합 질문
    questions.append({
        "question_type": "company_fit",
        "question_text": f"{req.company_name}의 {req.role_name} 직무에 지원한 이유는 무엇인가요?",
        "reason": "지원 동기와 직무 적합성을 확인하기 위한 질문입니다.",
        "priority_score": 8.8
    })

    return {
        "company_name": req.company_name,
        "role_name": req.role_name,
        "questions": questions
    }