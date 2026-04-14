from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Portfolio
from app.schemas import PortfolioCreate, PortfolioResponse

router = APIRouter()


@router.post("/", response_model=PortfolioResponse)
def create_portfolio(data: PortfolioCreate, db: Session = Depends(get_db)):
    portfolio = Portfolio(
        skills     = data.skills,
        ai_skills  = data.ai_skills,
        eng_level  = data.eng_level,
        school     = data.school,
        major      = data.major,
        graduation = data.graduation,
        gpa        = data.gpa,
        job_tags   = data.job_tags,
        salary     = data.salary,
        intro      = data.intro,
        projects   = [p.model_dump() for p in data.projects],
    )
    db.add(portfolio)
    db.commit()
    db.refresh(portfolio)
    return portfolio


@router.get("/{portfolio_id}", response_model=PortfolioResponse)
def get_portfolio(portfolio_id: int, db: Session = Depends(get_db)):
    portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    return portfolio


@router.put("/{portfolio_id}", response_model=PortfolioResponse)
def update_portfolio(portfolio_id: int, data: PortfolioCreate, db: Session = Depends(get_db)):
    portfolio = db.query(Portfolio).filter(Portfolio.id == portfolio_id).first()
    if not portfolio:
        raise HTTPException(status_code=404, detail="Portfolio not found")
    for key, value in data.model_dump().items():
        if key == "projects":
            setattr(portfolio, key, [p if isinstance(p, dict) else p.model_dump() for p in value])
        else:
            setattr(portfolio, key, value)
    db.commit()
    db.refresh(portfolio)
    return portfolio
