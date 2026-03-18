from fastapi import APIRouter, HTTPException

from app.schemas.interview import (
    AnswerGenerateRequest,
    AnswerGenerateResponse,
    QuestionGenerateRequest,
    QuestionGenerateResponse,
)
from app.services.answer_chain import generate_answer
from app.services.ingest_service import rebuild_vector_index
from app.services.question_chain import generate_questions

router = APIRouter(prefix="/interview", tags=["interview"])


@router.post("/ingest/rebuild")
def rebuild_index():
    try:
        return rebuild_vector_index()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/questions/generate", response_model=QuestionGenerateResponse)
def questions_generate(payload: QuestionGenerateRequest):
    try:
        return generate_questions(payload)
    except FileNotFoundError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"질문 생성 실패: {str(e)}")


@router.post("/answers/generate", response_model=AnswerGenerateResponse)
def answers_generate(payload: AnswerGenerateRequest):
    try:
        return generate_answer(payload)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"답변 생성 실패: {str(e)}")