# CareerMatch

고용24 실데이터를 기반으로 훈련과정과 취업역량 프로그램을 추천하는 프로젝트입니다.

## 구성

- 프론트엔드: React + Vite
- 백엔드: FastAPI
- 데이터베이스: PostgreSQL
- 외부 데이터: 고용24 Open API

## 팀원용 실행 순서

### 1. 저장소 받기

```bash
git clone <repo-url>
cd careermatch
```

### 2. PostgreSQL 준비

로컬 PostgreSQL 서버가 실행 중이어야 합니다.

`careermatch` 데이터베이스를 하나 만듭니다.

```bash
createdb careermatch
```

이미 DB가 있으면 이 단계는 건너뛰어도 됩니다.

### 3. 백엔드 환경변수 설정

백엔드 폴더에서 예시 파일을 복사해 `.env`를 만듭니다.

```bash
cd backend
cp .env.example .env
```

그 다음 `.env`에서 본인 환경에 맞게 아래 값을 수정합니다.

- `DATABASE_URL`
- `OPENAI_API_KEY`
- `WORK24_*` API 키

`OPENAI_API_KEY`는 없어도 기본 추천 기능은 동작합니다.

### 4. 백엔드 가상환경 생성

프로젝트 권장 파이썬 버전은 `3.12.7`입니다.

```bash
cd backend
/Users/wonjaechoi/.pyenv/versions/3.12.7/bin/python -m venv .venv
.venv/bin/pip install -r requirements.txt
```

다른 팀원은 본인 컴퓨터의 Python 3.12 경로를 사용하면 됩니다.

예:

```bash
python3.12 -m venv .venv
.venv/bin/pip install -r requirements.txt
```

### 5. 백엔드 실행

```bash
cd backend
.venv/bin/uvicorn main:app --reload
```

정상 실행되면 아래 주소가 열립니다.

- [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 6. 프론트엔드 실행

새 터미널에서:

```bash
cd /Users/wonjaechoi/coding/careermatch
npm install
npm run dev
```

프론트 주소:

- [http://localhost:5173](http://localhost:5173)

## 데이터는 어떻게 채워지나

이 프로젝트는 GitHub에 코드만 올라갑니다.
로컬 PostgreSQL 안에 들어 있는 데이터는 같이 올라가지 않습니다.

즉 팀원이 새로 실행하면:

- 테이블 구조는 코드로 자동 생성됨
- 실제 프로그램 데이터는 비어 있을 수 있음
- `/programs` 페이지에서 `실데이터 다시 받기`를 누르면 고용24 API에서 다시 채워짐

## OpenAI API 관련

OpenAI API 키가 없어도 아래 기능은 사용할 수 있습니다.

- 프로그램 목록 조회
- 고용24 실데이터 불러오기
- 기본 추천 결과 보기

OpenAI API 키가 있으면 아래 기능을 확장할 수 있습니다.

- 추천 이유 생성
- LangChain 기반 자유문장 해석

## 자주 생기는 문제

### 백엔드 연결 실패

`/programs` 페이지에서 `백엔드 서버에 연결하지 못했습니다`가 뜨면:

```bash
cd backend
.venv/bin/uvicorn main:app --reload
```

부터 다시 확인합니다.

### PostgreSQL 연결 문제

`.env`의 `DATABASE_URL`이 본인 PostgreSQL 계정과 비밀번호에 맞는지 확인합니다.

예:

```env
DATABASE_URL=postgresql://postgres:1234@localhost:5432/careermatch
```

### 실데이터 fetch 중 500 에러

백엔드를 최신 코드로 다시 실행한 뒤 `/programs`에서 `실데이터 다시 받기`를 다시 누릅니다.

## 권장 작업 방식

- `.env`는 Git에 올리지 않기
- 기능 작업은 브랜치에서 진행하기
- PostgreSQL 데이터는 각자 로컬에서 생성하고, 고용24에서 다시 불러오기
