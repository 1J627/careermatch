from fastapi import FastAPI

from app.api.health import router as health_router
from app.api.interview import router as interview_router

app = FastAPI(
    title="JobCompass AI Service",
    version="1.0.0",
    description="LangChain + RAG 기반 면접 질문/답변 생성 서비스"
)


@app.get("/")
def root():
    return {
        "message": "JobCompass AI Service is running",
        "docs": "/docs"
    }


app.include_router(health_router)
app.include_router(interview_router)