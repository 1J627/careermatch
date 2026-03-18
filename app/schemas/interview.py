from typing import List, Literal
from pydantic import BaseModel, Field

from app.schemas.user_profile import UserProfile


QuestionType = Literal["technical", "project", "behavioral", "company_fit"]


class QuestionGenerateRequest(BaseModel):
    company_name: str = Field(..., description="기업명")
    role_name: str = Field(..., description="직무명")
    job_description: str = Field(..., description="채용공고/JD 원문")
    user_profile: UserProfile


class InterviewQuestion(BaseModel):
    question_text: str = Field(..., description="면접 질문")
    question_type: QuestionType = Field(..., description="질문 분류")
    priority_score: int = Field(..., ge=1, le=10, description="중요도 점수(1~10)")
    rationale: str = Field(..., description="이 질문이 생성된 이유")


class QuestionGenerateResponse(BaseModel):
    company_name: str
    role_name: str
    questions: List[InterviewQuestion]


class AnswerGenerateRequest(BaseModel):
    question_text: str = Field(..., description="면접 질문")
    job_description: str = Field(..., description="채용공고/JD")
    user_profile: UserProfile


class AnswerGenerateResponse(BaseModel):
    question_text: str
    answer_draft: str = Field(..., description="면접 답변 초안")
    answer_strategy: List[str] = Field(..., description="답변 전략")
    improvement_points: List[str] = Field(..., description="보완 포인트")
    used_project_names: List[str] = Field(..., description="답변에 활용된 실제 프로젝트명")