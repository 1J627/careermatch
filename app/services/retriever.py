from langchain_core.documents import Document

from app.config import settings
from app.services.vectorstore import load_vectorstore


def retrieve_context(query: str, top_k: int | None = None) -> list[Document]:
    vectorstore = load_vectorstore()
    retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": top_k or settings.top_k}
    )
    docs = retriever.invoke(query)
    return docs


def docs_to_context_text(docs: list[Document]) -> str:
    if not docs:
        return "검색된 참고 문맥이 없습니다."

    lines = []
    for i, doc in enumerate(docs, start=1):
        source = doc.metadata.get("source", "unknown")
        lines.append(f"[문서 {i}] source={source}\n{doc.page_content}")
    return "\n\n".join(lines)