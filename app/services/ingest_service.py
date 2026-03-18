import os
from pathlib import Path
from typing import List

from langchain_core.documents import Document

from app.config import settings
from app.services.vectorstore import save_vectorstore


def load_corpus_documents() -> List[Document]:
    corpus_path = Path(settings.corpus_dir)

    if not corpus_path.exists():
        raise FileNotFoundError(f"코퍼스 디렉토리가 없습니다: {settings.corpus_dir}")

    documents: List[Document] = []

    for file_path in corpus_path.glob("*.txt"):
        text = file_path.read_text(encoding="utf-8").strip()
        if not text:
            continue

        chunks = split_text(text, chunk_size=800, overlap=100)

        for idx, chunk in enumerate(chunks):
            documents.append(
                Document(
                    page_content=chunk,
                    metadata={
                        "source": str(file_path.name),
                        "chunk_index": idx
                    }
                )
            )

    return documents


def split_text(text: str, chunk_size: int = 800, overlap: int = 100) -> List[str]:
    chunks = []
    start = 0
    text_len = len(text)

    while start < text_len:
        end = min(start + chunk_size, text_len)
        chunks.append(text[start:end])
        if end == text_len:
            break
        start = max(0, end - overlap)

    return chunks


def rebuild_vector_index() -> dict:
    documents = load_corpus_documents()
    save_vectorstore(documents)

    return {
        "message": "FAISS 인덱스 재생성 완료",
        "document_count": len(documents),
        "corpus_dir": settings.corpus_dir,
        "index_dir": settings.faiss_index_dir,
    }