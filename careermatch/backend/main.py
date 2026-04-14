from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import match, portfolio, programs

app = FastAPI(title="CareerMatch API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(portfolio.router, prefix="/api/portfolio", tags=["portfolio"])
app.include_router(programs.router,  prefix="/api/programs",  tags=["programs"])
app.include_router(match.router,     prefix="/api/match",     tags=["match"])

@app.get("/")
def root():
    return {"message": "CareerMatch API is running"}

from app.database import Base, engine
from app import models

Base.metadata.create_all(bind=engine)
