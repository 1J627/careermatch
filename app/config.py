from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    openai_api_key: str = Field(alias="OPENAI_API_KEY")
    openai_model: str = Field(default="gpt-4.1-mini", alias="OPENAI_MODEL")
    embedding_model: str = Field(default="text-embedding-3-small", alias="EMBEDDING_MODEL")
    faiss_index_dir: str = Field(default="faiss_index", alias="FAISS_INDEX_DIR")
    corpus_dir: str = Field(default="data/interview_corpus", alias="CORPUS_DIR")
    top_k: int = Field(default=4, alias="TOP_K")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()