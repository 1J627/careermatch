import os
from typing import List

from langchain_community.vectorstores import FAISS
from langchain_core.documents import Document

from app.config import settings
from app.services.embeddings import get_embeddings


def save_vectorstore(documents: List[Document]) -> None:
    if not documents:
        raise ValueError("벡터스토어에 저장할 문서가 없습니다.")

    embeddings = get_embeddings()
    vectorstore = FAISS.from_documents(documents, embeddings)

    os.makedirs(settings.faiss_index_dir, exist_ok=True)
    vectorstore.save_local(settings.faiss_index_dir)


def load_vectorstore() -> FAISS:
    embeddings = get_embeddings()

    if not os.path.exists(settings.faiss_index_dir):
        raise FileNotFoundError(
            f"FAISS 인덱스가 없습니다. 먼저 /interview/ingest/rebuild 를 실행하세요. 경로: {settings.faiss_index_dir}"
        )

    return FAISS.load_local(
        settings.faiss_index_dir,
        embeddings,
        allow_dangerous_deserialization=True
    )