from sqlalchemy.orm import Session
from app.models import TrainingProgram


SAMPLE_PROGRAMS = [
    {
        "title": "AI 서비스 백엔드 개발자 양성과정",
        "provider": "국민내일배움카드 훈련센터",
        "program_type": "kdt",
        "category": "국민내일배움카드 훈련과정",
        "location": "서울 · 온라인 병행",
        "summary": "Python, FastAPI, 데이터베이스, 클라우드 배포를 중심으로 실무형 백엔드 개발 역량을 기르는 과정입니다.",
        "target_audience": "백엔드 개발 직무를 준비하는 구직자, 프로젝트 경험을 실전 포트폴리오로 확장하고 싶은 학습자",
        "skills": "Python FastAPI SQL PostgreSQL Docker REST API AWS",
        "benefits": "실전 프로젝트, 포트폴리오 코칭, 취업 컨설팅",
        "schedule": "12주 · 주 5일",
        "tuition": "국비지원",
        "url": "",
        "source": "sample",
        "external_id": "sample-kdt-backend-001",
        "tags": ["백엔드", "Python", "FastAPI", "포트폴리오"],
    },
    {
        "title": "생성형 AI 애플리케이션 개발 부트캠프",
        "provider": "디지털 신기술 훈련기관",
        "program_type": "kdt",
        "category": "국민내일배움카드 훈련과정",
        "location": "판교 · 온라인 병행",
        "summary": "LLM, 프롬프트 엔지니어링, RAG, 벡터DB를 활용해 생성형 AI 서비스를 구현하는 훈련과정입니다.",
        "target_audience": "AI 서비스 개발자, LLM 프로젝트 경험을 강화하고 싶은 취업 준비생",
        "skills": "LLM LangChain RAG pgvector Python FastAPI OpenAI",
        "benefits": "기업 연계 프로젝트, 코드 리뷰, 취업 포트폴리오 완성",
        "schedule": "10주 · 주 5일",
        "tuition": "국비지원",
        "url": "",
        "source": "sample",
        "external_id": "sample-kdt-ai-002",
        "tags": ["생성형AI", "LLM", "RAG", "LangChain"],
    },
    {
        "title": "클라우드 네이티브 엔지니어 일학습병행 과정",
        "provider": "일학습병행 운영기관",
        "program_type": "apprenticeship",
        "category": "일학습병행훈련과정",
        "location": "경기 성남",
        "summary": "기업 현장 실무와 병행해 Docker, Kubernetes, CI/CD 기반의 클라우드 운영 역량을 쌓는 과정입니다.",
        "target_audience": "실무 경험과 교육을 동시에 원하는 취업 준비생, 운영/인프라까지 역량을 확장하고 싶은 개발자",
        "skills": "Docker Kubernetes AWS Linux CI/CD Monitoring",
        "benefits": "현장 실무 경험, 멘토링, 훈련수당",
        "schedule": "16주 · 기업 실습 병행",
        "tuition": "기업연계 지원",
        "url": "",
        "source": "sample",
        "external_id": "sample-apprentice-cloud-003",
        "tags": ["클라우드", "Kubernetes", "인프라", "실무형"],
    },
    {
        "title": "데이터 분석 기반 서비스 기획·개발 과정",
        "provider": "국민내일배움카드 훈련센터",
        "program_type": "training",
        "category": "국민내일배움카드 훈련과정",
        "location": "부산 · 온라인",
        "summary": "SQL, Python, 데이터 시각화, 제품 지표 분석을 바탕으로 서비스 개선 역량을 강화하는 과정입니다.",
        "target_audience": "데이터 기반 의사결정 역량을 갖춘 개발자나 서비스 직무로 확장하고 싶은 구직자",
        "skills": "Python SQL Pandas Dashboard Data Analysis",
        "benefits": "실무 데이터 과제, 발표 코칭, 취업 멘토링",
        "schedule": "8주 · 주 4일",
        "tuition": "국비지원",
        "url": "",
        "source": "sample",
        "external_id": "sample-data-service-004",
        "tags": ["데이터분석", "SQL", "Python", "서비스기획"],
    },
    {
        "title": "청년 구직자 취업역량 강화 프로그램",
        "provider": "고용센터 취업지원팀",
        "program_type": "capability",
        "category": "구직자취업역량 강화프로그램",
        "location": "전국 고용센터",
        "summary": "자기소개서, 면접, 직무분석, 지원전략 수립을 중심으로 구직 준비도를 높이는 프로그램입니다.",
        "target_audience": "입사 지원 전략이 필요한 청년 구직자, 자기소개서와 면접 준비를 체계화하고 싶은 사람",
        "skills": "자소서 면접 직무분석 지원전략 커뮤니케이션",
        "benefits": "1:1 컨설팅, 모의면접, 자기소개서 첨삭",
        "schedule": "2주 · 주 2회",
        "tuition": "무료",
        "url": "",
        "source": "sample",
        "external_id": "sample-capability-005",
        "tags": ["취업지원", "자소서", "면접", "청년"],
    },
    {
        "title": "AI 개발자 취업 포트폴리오 완성 프로그램",
        "provider": "고용24 연계 프로그램",
        "program_type": "capability",
        "category": "구직자취업역량 강화프로그램",
        "location": "온라인",
        "summary": "프로젝트 정리, 기술 스택 스토리텔링, 성과 수치화, 면접 답변 구조화를 통해 취업 준비물을 완성합니다.",
        "target_audience": "프로젝트는 있지만 전달력이 부족한 개발자, AI·백엔드 포트폴리오를 정리하고 싶은 지원자",
        "skills": "포트폴리오 자소서 면접 스토리텔링 프로젝트 정리",
        "benefits": "포트폴리오 피드백, 자기소개서 첨삭, 발표 연습",
        "schedule": "3주 · 주 2회",
        "tuition": "무료",
        "url": "",
        "source": "sample",
        "external_id": "sample-capability-006",
        "tags": ["포트폴리오", "AI개발자", "자소서", "면접"],
    },
]


def seed_sample_programs(db: Session) -> int:
    existing_ids = {
        row[0]
        for row in db.query(TrainingProgram.external_id).all()
        if row[0]
    }
    created = 0

    for payload in SAMPLE_PROGRAMS:
        if payload["external_id"] in existing_ids:
            continue
        db.add(TrainingProgram(**payload))
        created += 1

    if created:
        db.commit()

    return created
