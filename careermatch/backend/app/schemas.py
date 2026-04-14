from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


# ── Portfolio ──────────────────────────────────────────
class ProjectItem(BaseModel):
    name:  str = ""
    role:  str = ""
    stack: str = ""
    desc:  str = ""

class PortfolioCreate(BaseModel):
    skills:     List[str]       = []
    ai_skills:  List[str]       = []
    eng_level:  str             = ""
    school:     str             = ""
    major:      str             = ""
    graduation: str             = ""
    gpa:        str             = ""
    job_tags:   List[str]       = []
    salary:     str             = ""
    intro:      str             = ""
    projects:   List[ProjectItem] = []

class PortfolioResponse(PortfolioCreate):
    id:         int
    created_at: datetime

    class Config:
        from_attributes = True


# ── JobPosting ─────────────────────────────────────────
class JobPostingResponse(BaseModel):
    id:          int
    title:       str
    company:     str
    location:    str
    description: str
    requirements:str
    deadline:    str
    salary:      str

    class Config:
        from_attributes = True


class TrainingProgramResponse(BaseModel):
    id:              int
    title:           str
    provider:        str
    program_type:    str
    category:        str
    location:        str
    summary:         str
    target_audience: str
    skills:          str
    benefits:        str
    schedule:        str
    tuition:         str
    url:             str
    source:          str
    tags:            List[str] = []

    class Config:
        from_attributes = True


# ── Match ──────────────────────────────────────────────
class MatchRequest(BaseModel):
    portfolio_id: int

class MatchResultResponse(BaseModel):
    job:        JobPostingResponse
    score:      float
    skill_score:float
    exp_score:  float
    pref_score: float
    guide:      Optional[str] = None
    questions:  Optional[List[str]] = None

class MatchListResponse(BaseModel):
    total:   int
    results: List[MatchResultResponse]


class ProgramMatchResultResponse(BaseModel):
    id:           int
    program:      TrainingProgramResponse
    score:        float
    skill_score:  float
    growth_score: float
    fit_score:    float
    guide:        Optional[str] = None
    questions:    Optional[List[str]] = None


class ProgramMatchListResponse(BaseModel):
    total:   int
    results: List[ProgramMatchResultResponse]
