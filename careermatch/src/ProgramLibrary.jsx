import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8000";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Noto+Sans+KR:wght@400;500;700&display=swap');

  * { box-sizing: border-box; }

  :root {
    --bg: #f8fafc;
    --panel: rgba(255,255,255,0.88);
    --ink: #0f172a;
    --muted: #64748b;
    --line: rgba(15, 23, 42, 0.08);
    --soft: #f1f5f9;
    --soft-blue: rgba(37,99,235,0.08);
    --brand: #111827;
    --accent: #2563eb;
    --shadow: 0 18px 60px rgba(15, 23, 42, 0.08);
  }

  body {
    margin: 0;
    font-family: 'Noto Sans KR', sans-serif;
    background:
      radial-gradient(circle at top left, rgba(37,99,235,0.08), transparent 26%),
      linear-gradient(180deg, #f8fafc 0%, #ffffff 42%, #f8fafc 100%);
    color: var(--ink);
  }

  .page { min-height: 100vh; }
  .nav {
    position: sticky;
    top: 0;
    z-index: 20;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 28px;
    border-bottom: 1px solid var(--line);
    background: rgba(255,255,255,0.78);
    backdrop-filter: blur(14px);
  }
  .logo {
    font-family: 'Manrope', sans-serif;
    font-size: 24px;
    font-weight: 800;
    letter-spacing: -0.04em;
    cursor: pointer;
  }
  .logo span { color: var(--accent); }
  .nav-actions {
    display: flex;
    gap: 10px;
  }
  .btn {
    border-radius: 14px;
    padding: 11px 15px;
    font: inherit;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    border: 1px solid #dbe3ef;
    background: white;
    color: #334155;
  }
  .btn.primary {
    background: var(--brand);
    color: white;
    border-color: var(--brand);
  }
  .container {
    width: min(1180px, calc(100% - 32px));
    margin: 0 auto;
    padding: 28px 0 40px;
  }
  .hero, .toolbar, .card, .stat {
    border: 1px solid var(--line);
    background: var(--panel);
    border-radius: 28px;
    box-shadow: var(--shadow);
    backdrop-filter: blur(10px);
  }
  .hero {
    padding: 28px;
    margin-bottom: 16px;
  }
  .eyebrow {
    width: fit-content;
    border-radius: 999px;
    background: var(--soft-blue);
    color: var(--accent);
    padding: 8px 12px;
    font-size: 12px;
    font-weight: 800;
    margin-bottom: 14px;
  }
  .hero h1 {
    margin: 0 0 10px;
    font-family: 'Manrope', sans-serif;
    font-size: clamp(32px, 5vw, 46px);
    line-height: 1.06;
    letter-spacing: -0.05em;
  }
  .hero p {
    margin: 0;
    max-width: 620px;
    color: var(--muted);
    line-height: 1.7;
    font-size: 15px;
  }
  .status {
    margin-top: 14px;
    color: #0f766e;
    font-size: 14px;
    font-weight: 700;
  }
  .toolbar {
    padding: 18px;
    display: grid;
    grid-template-columns: 1fr 220px auto auto;
    gap: 12px;
    margin-bottom: 16px;
  }
  .input, .select {
    width: 100%;
    border-radius: 16px;
    border: 1px solid #dbe3ef;
    background: rgba(255,255,255,0.92);
    padding: 13px 14px;
    font: inherit;
    color: var(--ink);
    outline: none;
  }
  .stats {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 12px;
    margin-bottom: 16px;
  }
  .stat {
    padding: 18px;
  }
  .stat strong {
    display: block;
    font-family: 'Manrope', sans-serif;
    font-size: 30px;
    margin-bottom: 6px;
    letter-spacing: -0.05em;
  }
  .stat span {
    color: var(--muted);
    font-size: 12px;
  }
  .list {
    display: grid;
    gap: 14px;
  }
  .card {
    padding: 22px;
  }
  .row {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    align-items: flex-start;
  }
  .title {
    font-size: 19px;
    font-weight: 800;
    letter-spacing: -0.03em;
    margin-bottom: 6px;
  }
  .meta {
    color: var(--muted);
    font-size: 13px;
    line-height: 1.7;
  }
  .source {
    border-radius: 999px;
    background: #eff6ff;
    color: #1d4ed8;
    padding: 8px 12px;
    font-size: 12px;
    font-weight: 800;
    white-space: nowrap;
  }
  .summary {
    margin: 14px 0;
    color: #334155;
    line-height: 1.8;
    font-size: 14px;
  }
  .tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-bottom: 14px;
  }
  .tag {
    border-radius: 999px;
    background: var(--soft);
    color: #334155;
    padding: 7px 10px;
    font-size: 12px;
    font-weight: 700;
  }
  .tag.category {
    background: rgba(15,118,110,0.10);
    color: #0f766e;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    align-items: center;
    padding-top: 14px;
    border-top: 1px solid #edf2f7;
    flex-wrap: wrap;
  }
  .footer-text {
    color: var(--muted);
    font-size: 12px;
    line-height: 1.7;
  }
  .link {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    border: 1px solid #dbe3ef;
    background: white;
    color: #334155;
    border-radius: 14px;
    padding: 10px 14px;
    font-size: 13px;
    font-weight: 700;
  }
  .loading, .error, .empty {
    text-align: center;
    color: var(--muted);
    padding: 56px 20px;
  }
  .pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-top: 18px;
    flex-wrap: wrap;
  }
  .page-info {
    color: var(--muted);
    font-size: 13px;
  }
  .page-actions {
    display: flex;
    gap: 10px;
  }

  @media (max-width: 960px) {
    .nav {
      padding: 16px 18px;
    }
    .nav-actions {
      display: none;
    }
    .container {
      width: min(100%, calc(100% - 24px));
    }
    .toolbar, .stats {
      grid-template-columns: 1fr;
    }
  }
`;

const categories = [
  "전체",
  "국민내일배움카드 훈련과정",
  "일학습병행훈련과정",
  "구직자취업역량 강화프로그램",
];

function readableError(err, fallback) {
  if (err instanceof TypeError) {
    return "백엔드 서버에 연결하지 못했습니다. `backend` 서버가 실행 중인지 확인해주세요.";
  }
  return err?.message || fallback;
}

function fallbackLink(program) {
  return program.url || "https://www.work24.go.kr";
}

const PAGE_SIZE = 10;

export default function ProgramLibrary() {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("전체");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [statusText, setStatusText] = useState("");

  const loadPrograms = async ({ showLoading = true } = {}) => {
    if (showLoading) setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/programs/`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || data.error || "프로그램 목록을 불러오지 못했습니다.");
      }
      setPrograms(data);
      setPage(1);
    } catch (err) {
      setError(readableError(err, "프로그램 목록을 불러오는 중 오류가 발생했습니다."));
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const refreshPrograms = async ({ showLoading = false } = {}) => {
    if (showLoading) setLoading(true);
    setFetching(true);
    setError("");
    setStatusText("");
    setPrograms([]);
    setPage(1);

    try {
      const response = await fetch(`${API_BASE}/api/programs/fetch?limit=300&clear_sample=true`, {
        method: "POST",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || data.error || "고용24 데이터 갱신에 실패했습니다.");
      }
      await loadPrograms({ showLoading: false });
      setStatusText(`고용24 실데이터 ${data.total}개를 불러왔습니다.`);
    } catch (err) {
      setError(readableError(err, "고용24 데이터 갱신 중 오류가 발생했습니다."));
    } finally {
      setFetching(false);
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    refreshPrograms({ showLoading: true });
  }, []);

  const filteredPrograms = useMemo(() => {
    return programs.filter((program) => {
      const byCategory = category === "전체" || program.category === category;
      const term = search.trim().toLowerCase();
      const haystack = [
        program.title,
        program.provider,
        program.summary,
        program.location,
        ...(program.tags || []),
      ]
        .join(" ")
        .toLowerCase();
      return byCategory && (!term || haystack.includes(term));
    });
  }, [programs, search, category]);

  useEffect(() => {
    setPage(1);
  }, [search, category]);

  const totalPages = Math.max(1, Math.ceil(filteredPrograms.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pagedPrograms = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredPrograms.slice(start, start + PAGE_SIZE);
  }, [filteredPrograms, currentPage]);

  const counts = useMemo(() => {
    return programs.reduce(
      (acc, program) => {
        acc.total += 1;
        acc[program.category] = (acc[program.category] || 0) + 1;
        return acc;
      },
      { total: 0 },
    );
  }, [programs]);

  const sourceLabel =
    programs.length > 0 && programs.every((program) => program.source === "work24")
      ? "work24"
      : programs.length > 0
        ? "mixed"
        : "-";

  return (
    <div className="page">
      <style>{styles}</style>

      <nav className="nav">
        <div className="logo" onClick={() => navigate("/")}>
          Career<span>Match</span>
        </div>
        <div className="nav-actions">
          <button className="btn" onClick={() => navigate("/portfolio")}>
            추천 받기
          </button>
          <button className="btn primary" onClick={() => refreshPrograms()} disabled={fetching}>
            {fetching ? "불러오는 중..." : "고용24 새로 불러오기"}
          </button>
        </div>
      </nav>

      <main className="container">
        <section className="hero">
          <div className="eyebrow">Program Library</div>
          <h1>고용24 프로그램을 한 화면에서 정리해볼 수 있어요.</h1>
          <p>실데이터를 불러온 뒤 검색과 필터로 바로 좁혀볼 수 있습니다.</p>
          {statusText && <div className="status">{statusText}</div>}
        </section>

        <section className="toolbar">
          <input
            className="input"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="프로그램명, 운영기관, 키워드로 검색"
          />
          <select className="select" value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <button className="btn" onClick={() => loadPrograms()}>
            목록 새로고침
          </button>
          <button className="btn primary" onClick={() => refreshPrograms()} disabled={fetching}>
            {fetching ? "갱신 중..." : "실데이터 다시 받기"}
          </button>
        </section>

        <section className="stats">
          <article className="stat">
            <strong>{counts.total || 0}</strong>
            <span>전체 프로그램</span>
          </article>
          <article className="stat">
            <strong>{sourceLabel}</strong>
            <span>현재 데이터 출처</span>
          </article>
          <article className="stat">
            <strong>{counts["국민내일배움카드 훈련과정"] || 0}</strong>
            <span>내일배움카드</span>
          </article>
          <article className="stat">
            <strong>{counts["일학습병행훈련과정"] || 0}</strong>
            <span>일학습병행</span>
          </article>
          <article className="stat">
            <strong>{counts["구직자취업역량 강화프로그램"] || 0}</strong>
            <span>취업역량</span>
          </article>
        </section>

        {loading && <div className="loading">고용24 프로그램을 불러오는 중입니다...</div>}
        {!loading && error && (
          <div className="error">
            {error}
            <br />
            백엔드 실행 예시: `cd /Users/wonjaechoi/coding/careermatch/backend && DATABASE_URL=sqlite:///./careermatch.db python3 -m uvicorn main:app --reload`
          </div>
        )}
        {!loading && !error && filteredPrograms.length === 0 && (
          <div className="empty">조건에 맞는 프로그램이 없습니다.</div>
        )}

        {!loading && !error && filteredPrograms.length > 0 && (
          <section className="list">
            {pagedPrograms.map((program) => (
              <article className="card" key={`${program.source}-${program.id}`}>
                <div className="row">
                  <div>
                    <div className="title">{program.title}</div>
                    <div className="meta">
                      {program.provider || "운영기관 정보 없음"} · {program.location || "위치 정보 없음"}
                      <br />
                      {program.schedule || "일정 정보 없음"} · {program.tuition || "비용 정보 없음"}
                    </div>
                  </div>
                  <div className="source">{program.source}</div>
                </div>

                <p className="summary">{program.summary || "요약 정보가 없습니다."}</p>

                <div className="tags">
                  <span className="tag category">{program.category}</span>
                  {(program.tags || []).slice(0, 5).map((tag) => (
                    <span className="tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="footer">
                  <div className="footer-text">
                    대상: {program.target_audience || "정보 없음"}
                    <br />
                    {program.url ? "상세 링크 제공" : "직접 링크 미제공"}
                  </div>
                  <a className="link" href={fallbackLink(program)} target="_blank" rel="noreferrer">
                    {program.url ? "프로그램 보러가기" : "고용24 이동"}
                  </a>
                </div>
              </article>
            ))}
            <div className="pagination">
              <div className="page-info">
                {filteredPrograms.length}개 중 {(currentPage - 1) * PAGE_SIZE + 1}-
                {Math.min(currentPage * PAGE_SIZE, filteredPrograms.length)}개 표시
              </div>
              <div className="page-actions">
                <button
                  className="btn"
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  이전
                </button>
                <button
                  className="btn"
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  다음
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
