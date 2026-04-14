from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import JobPosting
from app.schemas import JobPostingResponse
from typing import Any, Dict, List, Optional
import httpx
import xmltodict
import os

router = APIRouter()

WORK24_API_KEY = os.getenv("WORK24_API_KEY", "")
WORK24_URL = "https://www.work24.go.kr/cm/openApi/call/wk/callOpenApiSvcInfo210L01.do"


def _extract_wanted_list(data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """고용24 XML 응답에서 공고 목록을 최대한 유연하게 추출한다."""
    candidates: List[Any] = [data]

    while candidates:
        current = candidates.pop(0)
        if isinstance(current, dict):
            wanted = current.get("wanted")
            if isinstance(wanted, list):
                return [item for item in wanted if isinstance(item, dict)]
            if isinstance(wanted, dict):
                return [wanted]
            candidates.extend(current.values())
        elif isinstance(current, list):
            candidates.extend(current)

    return []


def _extract_api_error(data: Dict[str, Any]) -> Optional[str]:
    """고용24 XML 응답에서 에러 메시지를 최대한 유연하게 추출한다."""
    candidates: List[Any] = [data]

    while candidates:
        current = candidates.pop(0)
        if isinstance(current, dict):
            error = current.get("error")
            if isinstance(error, str) and error.strip():
                return error.strip()
            candidates.extend(current.values())
        elif isinstance(current, list):
            candidates.extend(current)

    return None


@router.get("/", response_model=List[JobPostingResponse])
def list_jobs(
    keyword: str = Query("백엔드"),
    limit:   int = Query(20, le=100),
    db: Session = Depends(get_db)
):
    """DB에 저장된 채용공고 목록 반환"""
    jobs = db.query(JobPosting).limit(limit).all()
    return jobs


@router.post("/fetch")
async def fetch_jobs_from_work24(
    keyword:  str = "백엔드",
    limit:    int = 100,
    career:   str = "N",    # N: 신입, E: 경력, Z: 무관
    education: str = "05",  # 05: 대졸
    db: Session = Depends(get_db)
):
    """고용24 OpenAPI에서 채용공고를 가져와 DB에 저장"""
    if not WORK24_API_KEY:
        return {"error": "WORK24_API_KEY가 .env에 설정되지 않았습니다."}

    params = {
        "authKey":    WORK24_API_KEY,
        "callTp":     "L",
        "returnType": "XML",
        "startPage":  1,
        "display":    min(limit, 100),
        "keyword":    keyword,
        "career":     career,
        "education":  education,
    }

    async with httpx.AsyncClient(timeout=30) as client:
        res = await client.get(WORK24_URL, params=params)

    if res.status_code != 200:
        return {"error": f"API 호출 실패: {res.status_code}", "raw": res.text[:300]}

    # XML → dict 변환
    try:
        data = xmltodict.parse(res.text)
    except Exception as e:
        return {"error": f"XML 파싱 실패: {str(e)}", "raw": res.text[:300]}

    api_error = _extract_api_error(data)
    if api_error:
        return {"error": api_error, "raw": res.text[:300]}

    wanted_list = _extract_wanted_list(data)

    if not wanted_list:
        return {"fetched": 0, "saved": 0, "message": "공고 없음", "raw": res.text[:300]}

    saved = 0
    for job in wanted_list:
        external_id = job.get("wantedAuthNo", "")
        if not external_id:
            continue

        # 이미 저장된 공고 스킵
        exists = db.query(JobPosting).filter(
            JobPosting.external_id == external_id
        ).first()
        if exists:
            continue

        new_job = JobPosting(
            title        = job.get("title", ""),
            company      = job.get("company", ""),
            location     = job.get("region", ""),
            description  = job.get("title", ""),
            requirements = job.get("career", ""),
            preferred    = job.get("holidayTpNm", ""),
            deadline     = job.get("closeDt", ""),
            salary       = job.get("sal", ""),
            source       = "work24",
            external_id  = external_id,
        )
        db.add(new_job)
        saved += 1

    db.commit()
    return {
        "fetched": len(wanted_list),
        "saved":   saved,
        "message": f"{saved}개 새 공고 저장 완료"
    }
