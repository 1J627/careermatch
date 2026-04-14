from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Portfolio(Base):
    __tablename__ = "portfolios"

    id            = Column(Integer, primary_key=True, index=True)
    skills        = Column(JSON, default=[])       # ["Python", "FastAPI", ...]
    ai_skills     = Column(JSON, default=[])       # ["LLM", "pgvector", ...]
    eng_level     = Column(String(50), default="")
    school        = Column(String(100), default="")
    major         = Column(String(100), default="")
    graduation    = Column(String(50), default="")
    gpa           = Column(String(20), default="")
    job_tags      = Column(JSON, default=[])       # ["백엔드 개발자", ...]
    salary        = Column(String(100), default="")
    intro         = Column(Text, default="")
    projects      = Column(JSON, default=[])       # [{name, role, stack, desc}, ...]
    created_at    = Column(DateTime(timezone=True), server_default=func.now())

    match_results = relationship("MatchResult", back_populates="portfolio")
    program_match_results = relationship("ProgramMatchResult", back_populates="portfolio")


class JobPosting(Base):
    __tablename__ = "job_postings"

    id          = Column(Integer, primary_key=True, index=True)
    title       = Column(String(200))
    company     = Column(String(100))
    location    = Column(String(100))
    description = Column(Text)
    requirements= Column(Text)
    preferred   = Column(Text)
    deadline    = Column(String(50))
    salary      = Column(String(100))
    source      = Column(String(50))   # "saramin", "jobkorea" 등
    external_id = Column(String(100), unique=True)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())


class MatchResult(Base):
    __tablename__ = "match_results"

    id           = Column(Integer, primary_key=True, index=True)
    portfolio_id = Column(Integer, ForeignKey("portfolios.id"))
    job_id       = Column(Integer, ForeignKey("job_postings.id"))
    score        = Column(Float)       # 0.0 ~ 100.0
    skill_score  = Column(Float)
    exp_score    = Column(Float)
    pref_score   = Column(Float)
    guide        = Column(Text)        # 자소서 가이드 (LLM 생성)
    questions    = Column(JSON)        # 예상 질문 리스트
    created_at   = Column(DateTime(timezone=True), server_default=func.now())

    portfolio    = relationship("Portfolio", back_populates="match_results")


class TrainingProgram(Base):
    __tablename__ = "training_programs"

    id              = Column(Integer, primary_key=True, index=True)
    title           = Column(String(200))
    provider        = Column(String(120), default="")
    program_type    = Column(String(50), default="training")
    category        = Column(String(100), default="")
    location        = Column(String(120), default="")
    summary         = Column(Text, default="")
    target_audience = Column(Text, default="")
    skills          = Column(Text, default="")
    benefits        = Column(Text, default="")
    schedule        = Column(String(120), default="")
    tuition         = Column(String(120), default="")
    url             = Column(String(255), default="")
    source          = Column(String(50), default="sample")
    external_id     = Column(String(100), unique=True)
    tags            = Column(JSON, default=[])
    created_at      = Column(DateTime(timezone=True), server_default=func.now())

    match_results   = relationship("ProgramMatchResult", back_populates="program")


class ProgramMatchResult(Base):
    __tablename__ = "program_match_results"

    id           = Column(Integer, primary_key=True, index=True)
    portfolio_id = Column(Integer, ForeignKey("portfolios.id"))
    program_id   = Column(Integer, ForeignKey("training_programs.id"))
    score        = Column(Float)
    skill_score  = Column(Float)
    growth_score = Column(Float)
    fit_score    = Column(Float)
    guide        = Column(Text)
    questions    = Column(JSON)
    created_at   = Column(DateTime(timezone=True), server_default=func.now())

    portfolio    = relationship("Portfolio", back_populates="program_match_results")
    program      = relationship("TrainingProgram", back_populates="match_results")
