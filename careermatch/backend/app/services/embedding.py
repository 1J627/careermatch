from openai import AsyncOpenAI
import numpy as np
import os
import re

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))


async def get_embedding(text: str) -> list[float]:
    """텍스트를 OpenAI Embedding 벡터로 변환합니다."""
    text = text.replace("\n", " ").strip()
    if not text:
        return []
    if not os.getenv("OPENAI_API_KEY", "").strip():
        return []

    try:
        response = await client.embeddings.create(
            input=text,
            model="text-embedding-3-small",
        )
        return response.data[0].embedding
    except Exception:
        return []


def cosine_similarity(vec_a: list[float], vec_b: list[float]) -> float:
    """두 벡터의 코사인 유사도를 계산합니다. (0.0 ~ 1.0)"""
    if not vec_a or not vec_b:
        return 0.0
    a = np.array(vec_a)
    b = np.array(vec_b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return float(np.dot(a, b) / (norm_a * norm_b))


def keyword_similarity(text_a: str, text_b: str) -> float:
    """간단한 키워드 겹침 기반 유사도 계산."""
    tokens_a = set(re.findall(r"[A-Za-z0-9가-힣+#.]+", text_a.lower()))
    tokens_b = set(re.findall(r"[A-Za-z0-9가-힣+#.]+", text_b.lower()))
    if not tokens_a or not tokens_b:
        return 0.0

    overlap = tokens_a & tokens_b
    return len(overlap) / len(tokens_a | tokens_b)
