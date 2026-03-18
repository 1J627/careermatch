from typing import List, Optional
from pydantic import BaseModel, Field


class ProjectItem(BaseModel):
    name: str = Field(..., description="프로젝트명")
    description: str = Field(..., description="프로젝트 설명")
    tech_stack: List[str] = Field(default_factory=list, description="사용 기술")
    role: Optional[str] = Field(default=None, description="담당 역할")
    achievements: List[str] = Field(default_factory=list, description="성과/결과")


class UserProfile(BaseModel):
    name: Optional[str] = Field(default=None, description="사용자 이름")
    target_role: Optional[str] = Field(default=None, description="희망 직무")
    skills: List[str] = Field(default_factory=list, description="기술 스택")
    experience_summary: Optional[str] = Field(default=None, description="경험 요약")
    projects: List[ProjectItem] = Field(default_factory=list, description="프로젝트 목록")