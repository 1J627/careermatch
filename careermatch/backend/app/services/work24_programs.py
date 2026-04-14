from __future__ import annotations

from datetime import date, timedelta
from typing import Any, Dict, List, Optional
import os

import httpx
import xmltodict


WORK24_KDT_URL = "https://www.work24.go.kr/cm/openApi/call/hr/callOpenApiSvcInfo310L01.do"
WORK24_APPRENTICE_URL = "https://www.work24.go.kr/cm/openApi/call/hr/callOpenApiSvcInfo313L01.do"
WORK24_CAPABILITY_URL = "https://www.work24.go.kr/cm/openApi/call/wk/callOpenApiSvcInfo217L01.do"


def get_work24_keys() -> Dict[str, str]:
    return {
        "kdt": os.getenv("WORK24_KDT_API_KEY", "").strip(),
        "apprentice": os.getenv("WORK24_APPRENTICE_API_KEY", "").strip(),
        "capability": os.getenv("WORK24_CAPABILITY_API_KEY", "").strip(),
    }


async def fetch_all_programs(
    page_size: int = 20,
    region: Optional[str] = None,
    keyword: Optional[str] = None,
) -> List[Dict[str, Any]]:
    today = date.today()
    start_date = today.strftime("%Y%m%d")
    end_date = (today + timedelta(days=180)).strftime("%Y%m%d")
    keys = get_work24_keys()
    active_sources = [
        name
        for name in ["kdt", "apprentice", "capability"]
        if keys[name]
    ]
    limits = _split_total_limit(page_size, active_sources)

    results: List[Dict[str, Any]] = []
    if keys["kdt"] and limits["kdt"] > 0:
        results.extend(
            await _fetch_kdt_programs(
                auth_key=keys["kdt"],
                page_size=limits["kdt"],
                start_date=start_date,
                end_date=end_date,
                region=region,
                keyword=keyword,
            )
        )
    if keys["apprentice"] and limits["apprentice"] > 0:
        results.extend(
            await _fetch_apprentice_programs(
                auth_key=keys["apprentice"],
                page_size=limits["apprentice"],
                start_date=start_date,
                end_date=end_date,
                region=region,
                keyword=keyword,
            )
        )
    if keys["capability"] and limits["capability"] > 0:
        results.extend(
            await _fetch_capability_programs(
                auth_key=keys["capability"],
                page_size=limits["capability"],
                start_date=start_date,
            )
        )
    return results


def _split_total_limit(total_limit: int, active_sources: List[str]) -> Dict[str, int]:
    limits = {name: 0 for name in ["kdt", "apprentice", "capability"]}
    if total_limit <= 0 or not active_sources:
        return limits

    base = total_limit // len(active_sources)
    remainder = total_limit % len(active_sources)

    for index, source in enumerate(active_sources):
        limits[source] = base + (1 if index < remainder else 0)

    return limits


async def _fetch_kdt_programs(
    auth_key: str,
    page_size: int,
    start_date: str,
    end_date: str,
    region: Optional[str],
    keyword: Optional[str],
) -> List[Dict[str, Any]]:
    return await _fetch_hrd_paginated(
        url=WORK24_KDT_URL,
        auth_key=auth_key,
        total_limit=page_size,
        start_date=start_date,
        end_date=end_date,
        region=region,
        keyword=keyword,
        category="국민내일배움카드 훈련과정",
        program_type="kdt",
        extra_params={"crseTracseSe": "C0104"},
    )


async def _fetch_apprentice_programs(
    auth_key: str,
    page_size: int,
    start_date: str,
    end_date: str,
    region: Optional[str],
    keyword: Optional[str],
) -> List[Dict[str, Any]]:
    return await _fetch_hrd_paginated(
        url=WORK24_APPRENTICE_URL,
        auth_key=auth_key,
        total_limit=page_size,
        start_date=start_date,
        end_date=end_date,
        region=region,
        keyword=keyword,
        category="일학습병행훈련과정",
        program_type="apprenticeship",
    )


async def _fetch_capability_programs(
    auth_key: str,
    page_size: int,
    start_date: str,
) -> List[Dict[str, Any]]:
    results: List[Dict[str, Any]] = []
    batch_size = min(page_size, 100)
    page = 1

    while len(results) < page_size:
        params = {
            "authKey": auth_key,
            "returnType": "XML",
            "startPage": page,
            "display": batch_size,
            "pgmStdt": start_date,
        }

        data = await _request_xml(WORK24_CAPABILITY_URL, params)
        rows = _ensure_list(_dig(data, ["empPgmSchdInviteList", "empPgmSchdInvite"]))
        mapped = [_map_capability_program(item) for item in rows if isinstance(item, dict)]
        results.extend(mapped)

        if len(mapped) < batch_size:
            break
        page += 1

    return results[:page_size]


async def _fetch_hrd_paginated(
    url: str,
    auth_key: str,
    total_limit: int,
    start_date: str,
    end_date: str,
    region: Optional[str],
    keyword: Optional[str],
    category: str,
    program_type: str,
    extra_params: Optional[Dict[str, Any]] = None,
) -> List[Dict[str, Any]]:
    results: List[Dict[str, Any]] = []
    batch_size = min(total_limit, 100)
    page = 1

    while len(results) < total_limit:
        params = {
            "authKey": auth_key,
            "returnType": "XML",
            "outType": "1",
            "pageNum": page,
            "pageSize": batch_size,
            "srchTraStDt": start_date,
            "srchTraEndDt": end_date,
            "sort": "ASC",
            "sortCol": "2",
        }
        if extra_params:
            params.update(extra_params)
        if region:
            params["srchTraArea1"] = region
        if keyword:
            params["srchTraProcessNm"] = keyword

        data = await _request_xml(url, params)
        rows = _ensure_list(_dig(data, ["HRDNet", "srchList", "scn_list"]))
        mapped = [
            _map_hrd_program(item, category, program_type)
            for item in rows
            if isinstance(item, dict)
        ]
        results.extend(mapped)

        if len(mapped) < batch_size:
            break
        page += 1

    return results[:total_limit]


async def _request_xml(url: str, params: Dict[str, Any]) -> Dict[str, Any]:
    async with httpx.AsyncClient(timeout=30) as client:
        response = await client.get(url, params=params)
    response.raise_for_status()
    data = xmltodict.parse(response.text)
    error = _find_error(data)
    if error:
        raise ValueError(error)
    return data


def _find_error(data: Any) -> Optional[str]:
    queue = [data]
    while queue:
        current = queue.pop(0)
        if isinstance(current, dict):
            if "error" in current and isinstance(current["error"], str):
                return current["error"]
            queue.extend(current.values())
        elif isinstance(current, list):
            queue.extend(current)
    return None


def _ensure_list(value: Any) -> List[Any]:
    if value is None:
        return []
    if isinstance(value, list):
        return value
    return [value]


def _dig(data: Dict[str, Any], path: List[str]) -> Any:
    current: Any = data
    for key in path:
        if not isinstance(current, dict):
            return None
        current = current.get(key)
    return current


def _map_hrd_program(item: Dict[str, Any], category: str, program_type: str) -> Dict[str, Any]:
    title = _text(item, "title")
    provider = _text(item, "subTitle") or _text(item, "title")
    start = _format_date(_text(item, "traStartDate"))
    end = _format_date(_text(item, "traEndDate"))
    tags = _split_tags(f"{_text(item, 'title')} {_text(item, 'subTitle')} {_text(item, 'ncsCd')} {_text(item, 'certificate')}")
    external_id = f"work24-{category}-{_text(item, 'trprId')}-{_text(item, 'trprDegr')}".replace(" ", "")

    return {
        "title": title,
        "provider": provider,
        "program_type": program_type,
        "category": category,
        "location": _text(item, "address"),
        "summary": _text(item, "contents") or title,
        "target_audience": _text(item, "trainTarget"),
        "skills": " ".join(filter(None, [_text(item, "ncsCd"), _text(item, "certificate")])),
        "benefits": _text(item, "titleIcon"),
        "schedule": " ~ ".join(filter(None, [start, end])),
        "tuition": _text(item, "realMan") or _text(item, "courseMan"),
        "url": _text(item, "titleLink") or _text(item, "subTitleLink"),
        "source": "work24",
        "external_id": external_id,
        "tags": tags,
    }


def _map_capability_program(item: Dict[str, Any]) -> Dict[str, Any]:
    start = _format_date(_text(item, "pgmStdt"))
    end = _format_date(_text(item, "pgmEndt"))
    open_time = _text(item, "openTime")
    operation_time = _text(item, "operationTime")
    schedule = " / ".join(filter(None, [" ~ ".join(filter(None, [start, end])), open_time, operation_time]))
    title = " - ".join(filter(None, [_text(item, "pgmNm"), _text(item, "pgmSubNm")]))
    tags = _split_tags(f"{_text(item, 'pgmNm')} {_text(item, 'pgmSubNm')} {_text(item, 'pgmTarget')}")
    external_id = f"work24-capability-{_text(item, 'orgNm')}-{_text(item, 'pgmNm')}-{_text(item, 'pgmStdt')}".replace(" ", "")

    return {
        "title": title or _text(item, "pgmNm"),
        "provider": _text(item, "orgNm"),
        "program_type": "capability",
        "category": "구직자취업역량 강화프로그램",
        "location": _text(item, "openPlcCont"),
        "summary": _text(item, "pgmTarget") or _text(item, "pgmNm"),
        "target_audience": _text(item, "pgmTarget"),
        "skills": _text(item, "pgmNm"),
        "benefits": "고용센터 프로그램",
        "schedule": schedule,
        "tuition": "무료",
        "url": "",
        "source": "work24",
        "external_id": external_id,
        "tags": tags,
    }


def _format_date(value: str) -> str:
    if len(value) == 8 and value.isdigit():
        return f"{value[:4]}-{value[4:6]}-{value[6:]}"
    return value


def _text(item: Dict[str, Any], key: str) -> str:
    value = item.get(key, "")
    if value is None:
        return ""
    return str(value).strip()


def _split_tags(raw: str) -> List[str]:
    tokens = [part.strip() for part in raw.replace("/", " ").replace(",", " ").split() if part.strip()]
    seen: List[str] = []
    for token in tokens:
        if token not in seen:
            seen.append(token)
        if len(seen) >= 6:
            break
    return seen
