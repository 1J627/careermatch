import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
    --success: #0f766e;
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
    align-items: center;
    justify-content: space-between;
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
  .nav-note {
    color: var(--muted);
    font-size: 13px;
  }
  .container {
    width: min(1180px, calc(100% - 32px));
    margin: 0 auto;
    padding: 28px 0 40px;
  }
  .hero {
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    gap: 16px;
    margin-bottom: 16px;
  }
  .hero-card, .stat-grid, .panel, .result-card {
    border: 1px solid var(--line);
    border-radius: 28px;
    background: var(--panel);
    box-shadow: var(--shadow);
    backdrop-filter: blur(10px);
  }
  .hero-card {
    padding: 30px;
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
  .hero-card h1 {
    margin: 0 0 10px;
    font-family: 'Manrope', sans-serif;
    font-size: clamp(32px, 5vw, 46px);
    line-height: 1.06;
    letter-spacing: -0.05em;
  }
  .hero-card p {
    margin: 0;
    color: var(--muted);
    line-height: 1.7;
    font-size: 15px;
  }
  .stat-grid {
    padding: 18px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  .stat {
    border-radius: 20px;
    background: rgba(255,255,255,0.78);
    border: 1px solid rgba(15,23,42,0.05);
    padding: 16px;
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
    line-height: 1.6;
  }
  .layout {
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    gap: 16px;
  }
  .panel {
    padding: 20px;
  }
  .panel-head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
  }
  .panel-head h2 {
    margin: 0 0 6px;
    font-family: 'Manrope', sans-serif;
    font-size: 24px;
    letter-spacing: -0.04em;
  }
  .panel-head p {
    margin: 0;
    color: var(--muted);
    font-size: 14px;
    line-height: 1.7;
  }
  .filters {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .filter {
    border: 1px solid #dbe3ef;
    background: white;
    color: var(--muted);
    border-radius: 999px;
    padding: 9px 12px;
    font: inherit;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
  }
  .filter.active {
    background: var(--brand);
    color: white;
    border-color: var(--brand);
  }
  .result-list {
    display: grid;
    gap: 14px;
  }
  .result-card {
    padding: 22px;
  }
  .result-card.top {
    border-color: rgba(37,99,235,0.24);
  }
  .badge {
    display: inline-flex;
    margin-bottom: 10px;
    border-radius: 999px;
    background: #eff6ff;
    color: #1d4ed8;
    padding: 7px 10px;
    font-size: 12px;
    font-weight: 800;
  }
  .row {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    align-items: flex-start;
  }
  .title {
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.04em;
    margin-bottom: 6px;
  }
  .meta {
    color: var(--muted);
    font-size: 13px;
    line-height: 1.7;
  }
  .score {
    min-width: 76px;
    height: 76px;
    border-radius: 24px;
    display: grid;
    place-items: center;
    background: linear-gradient(135deg, #111827, #2563eb);
    color: white;
    text-align: center;
  }
  .score strong {
    display: block;
    font-family: 'Manrope', sans-serif;
    font-size: 24px;
    line-height: 1;
  }
  .score span {
    font-size: 11px;
    opacity: 0.82;
  }
  .summary {
    margin: 14px 0;
    color: #334155;
    line-height: 1.8;
    font-size: 14px;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
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
  .tag.primary {
    background: rgba(15,118,110,0.10);
    color: #0f766e;
  }
  .meters {
    display: grid;
    gap: 10px;
  }
  .meter-row {
    display: grid;
    grid-template-columns: 88px 1fr 40px;
    gap: 10px;
    align-items: center;
    color: var(--muted);
    font-size: 12px;
  }
  .meter-bar {
    height: 8px;
    border-radius: 999px;
    background: #e2e8f0;
    overflow: hidden;
  }
  .meter-fill {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, #2563eb, #0f766e);
  }
  .footer {
    display: flex;
    justify-content: space-between;
    gap: 14px;
    align-items: center;
    padding-top: 14px;
    margin-top: 16px;
    border-top: 1px solid #edf2f7;
    flex-wrap: wrap;
  }
  .footer-text {
    color: var(--muted);
    font-size: 12px;
    line-height: 1.7;
  }
  .actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .btn, .link-btn {
    border-radius: 14px;
    padding: 10px 14px;
    font: inherit;
    font-size: 13px;
    font-weight: 700;
  }
  .btn {
    border: 1px solid #dbe3ef;
    background: white;
    color: #334155;
    cursor: pointer;
  }
  .btn.primary {
    border-color: var(--brand);
    background: var(--brand);
    color: white;
  }
  .link-btn {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    border: 1px solid #dbe3ef;
    background: white;
    color: #334155;
  }
  .guide {
    margin-top: 14px;
    border-radius: 20px;
    background: rgba(248,250,252,0.88);
    border: 1px solid rgba(15,23,42,0.05);
    padding: 16px;
  }
  .guide h3 {
    margin: 0 0 8px;
    font-size: 15px;
  }
  .guide p {
    margin: 0 0 10px;
    color: #334155;
    line-height: 1.8;
    font-size: 14px;
  }
  .guide ul {
    margin: 0;
    padding-left: 18px;
    color: var(--muted);
    font-size: 13px;
    line-height: 1.8;
  }
  .mini-grid {
    display: grid;
    gap: 12px;
  }
  .mini-card {
    border-radius: 22px;
    background: rgba(248,250,252,0.88);
    border: 1px solid rgba(15,23,42,0.05);
    padding: 18px;
  }
  .mini-card h3 {
    margin: 0 0 10px;
    font-size: 17px;
  }
  .mini-card strong {
    display: block;
    margin-bottom: 6px;
    font-size: 14px;
  }
  .mini-card p, .mini-card span {
    color: var(--muted);
    font-size: 13px;
    line-height: 1.7;
  }
  .mini-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .loading, .error, .empty {
    text-align: center;
    color: var(--muted);
    padding: 56px 20px;
  }

  @media (max-width: 960px) {
    .nav {
      padding: 16px 18px;
    }
    .container {
      width: min(100%, calc(100% - 24px));
    }
    .hero, .layout {
      grid-template-columns: 1fr;
    }
    .stat-grid {
      grid-template-columns: 1fr;
    }
  }
`;

const filters = [
  { key: "all", label: "전체" },
  { key: "국민내일배움카드 훈련과정", label: "내일배움카드" },
  { key: "일학습병행훈련과정", label: "일학습병행" },
  { key: "구직자취업역량 강화프로그램", label: "취업역량" },
];

function programTypeLabel(category) {
  return category || "추천 프로그램";
}

function programAction(program) {
  return {
    href: program.url || "https://www.work24.go.kr",
    label: program.url ? "프로그램 보러가기" : "고용24 이동",
  };
}

function ProgramCard({ item, isTop, loadingGuideId, onGuideClick }) {
  const action = programAction(item.program);

  return (
    <article className={`result-card${isTop ? " top" : ""}`}>
      {isTop && <div className="badge">가장 잘 맞는 추천</div>}
      <div className="row">
        <div>
          <div className="title">{item.program.title}</div>
          <div className="meta">
            {item.program.provider || "운영기관 정보 없음"} · {item.program.location || "위치 정보 없음"}
            <br />
            {programTypeLabel(item.program.category)} · {item.program.schedule || "일정 정보 없음"}
          </div>
        </div>
        <div className="score">
          <div>
            <strong>{Math.round(item.score)}</strong>
            <span>적합도</span>
          </div>
        </div>
      </div>

      <p className="summary">{item.program.summary}</p>

      <div className="tags">
        <span className="tag primary">{item.program.program_type}</span>
        {(item.program.tags || []).slice(0, 4).map((tag) => (
          <span className="tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>

      <div className="meters">
        <div className="meter-row">
          <span>기술 적합</span>
          <div className="meter-bar"><div className="meter-fill" style={{ width: `${item.skill_score}%` }} /></div>
          <strong>{Math.round(item.skill_score)}</strong>
        </div>
        <div className="meter-row">
          <span>성장 효과</span>
          <div className="meter-bar"><div className="meter-fill" style={{ width: `${item.growth_score}%` }} /></div>
          <strong>{Math.round(item.growth_score)}</strong>
        </div>
        <div className="meter-row">
          <span>준비도</span>
          <div className="meter-bar"><div className="meter-fill" style={{ width: `${item.fit_score}%` }} /></div>
          <strong>{Math.round(item.fit_score)}</strong>
        </div>
      </div>

      <div className="footer">
        <div className="footer-text">
          대상: {item.program.target_audience || "정보 없음"}
          <br />
          비용: {item.program.tuition || "정보 없음"}
        </div>
        <div className="actions">
          <a className="link-btn" href={action.href} target="_blank" rel="noreferrer">
            {action.label}
          </a>
          <button className="btn primary" onClick={() => onGuideClick(item.id)} disabled={loadingGuideId === item.id}>
            {loadingGuideId === item.id ? "생성 중..." : "추천 이유 보기"}
          </button>
        </div>
      </div>

      {item.guide && (
        <div className="guide">
          <h3>추천 이유와 준비 로드맵</h3>
          <p>{item.guide}</p>
          {item.questions?.length > 0 && (
            <ul>
              {item.questions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </article>
  );
}

export default function MatchResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const portfolioId = location.state?.portfolioId;

  const [filter, setFilter] = useState("all");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingGuideId, setLoadingGuideId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!portfolioId) {
      setLoading(false);
      setError("포트폴리오 정보가 없어 다시 입력이 필요합니다.");
      return;
    }

    const runMatch = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`${API_BASE}/api/match/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ portfolio_id: portfolioId }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.detail || data.error || "추천 결과를 불러오지 못했습니다.");
        }
        setResults(data.results || []);
      } catch (err) {
        setError(err.message || "추천 결과를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    runMatch();
  }, [portfolioId]);

  const filteredResults =
    filter === "all" ? results : results.filter((item) => item.program.category === filter);

  const topResult = filteredResults[0];
  const recommendedTags = [...new Set(filteredResults.flatMap((item) => item.program.tags || []))].slice(0, 6);
  const capabilityPrograms = filteredResults
    .filter((item) => item.program.category === "구직자취업역량 강화프로그램")
    .slice(0, 3);

  const handleGuideClick = async (matchId) => {
    setLoadingGuideId(matchId);
    try {
      const response = await fetch(`${API_BASE}/api/match/${matchId}/guide`, { method: "POST" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || data.error || "가이드를 생성하지 못했습니다.");
      }

      setResults((current) =>
        current.map((item) =>
          item.id === matchId
            ? { ...item, guide: data.guide, questions: data.questions || [] }
            : item,
        ),
      );
    } catch (err) {
      setError(err.message || "가이드 생성 중 오류가 발생했습니다.");
    } finally {
      setLoadingGuideId(null);
    }
  };

  return (
    <div className="page">
      <style>{styles}</style>

      <nav className="nav">
        <div className="logo" onClick={() => navigate("/")}>
          Career<span>Match</span>
        </div>
        <div className="nav-note">추천 결과는 입력한 준비 상태를 기반으로 정렬됩니다.</div>
      </nav>

      <main className="container">
        <section className="hero">
          <div className="hero-card">
            <div className="eyebrow">Recommendation Results</div>
            <h1>지금 단계에 맞는 프로그램을 바로 비교해보세요.</h1>
            <p>입력한 정보 기준으로 추천을 정렬했고, 필요하면 이유와 준비 포인트까지 펼쳐볼 수 있습니다.</p>
          </div>
          <div className="stat-grid">
            <div className="stat">
              <strong>{results.length || 0}</strong>
              <span>추천 프로그램 수</span>
            </div>
            <div className="stat">
              <strong>{topResult ? `${Math.round(topResult.score)}점` : "-"}</strong>
              <span>최고 적합도</span>
            </div>
            <div className="stat">
              <strong>{topResult ? programTypeLabel(topResult.program.category) : "-"}</strong>
              <span>우선 추천 유형</span>
            </div>
            <div className="stat">
              <strong>{recommendedTags[0] || "-"}</strong>
              <span>가장 많이 보인 키워드</span>
            </div>
          </div>
        </section>

        <section className="layout">
          <div className="panel">
            <div className="panel-head">
              <div>
                <h2>추천 프로그램</h2>
                <p>필터를 바꿔가며 유형별로 비교할 수 있습니다.</p>
              </div>
              <div className="filters">
                {filters.map((item) => (
                  <button
                    key={item.key}
                    className={`filter${filter === item.key ? " active" : ""}`}
                    onClick={() => setFilter(item.key)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {loading && <div className="loading">추천 결과를 불러오는 중입니다...</div>}
            {!loading && error && <div className="error">{error}</div>}
            {!loading && !error && filteredResults.length === 0 && (
              <div className="empty">조건에 맞는 추천 결과가 없습니다.</div>
            )}

            {!loading && !error && filteredResults.length > 0 && (
              <div className="result-list">
                {filteredResults.map((item, index) => (
                  <ProgramCard
                    key={item.id}
                    item={item}
                    isTop={index === 0}
                    loadingGuideId={loadingGuideId}
                    onGuideClick={handleGuideClick}
                  />
                ))}
              </div>
            )}
          </div>

          <aside className="panel">
            <div className="panel-head">
              <div>
                <h2>보조 정보</h2>
                <p>결과를 빠르게 읽을 수 있도록 핵심만 모았습니다.</p>
              </div>
            </div>
            <div className="mini-grid">
              <div className="mini-card">
                <h3>추천 키워드</h3>
                <div className="tags">
                  {recommendedTags.length > 0 ? (
                    recommendedTags.map((tag) => (
                      <span className="tag" key={tag}>
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span>아직 추출된 키워드가 없습니다.</span>
                  )}
                </div>
              </div>

              <div className="mini-card">
                <h3>취업역량 프로그램</h3>
                {capabilityPrograms.length > 0 ? (
                  capabilityPrograms.map((item) => (
                    <div key={item.id} style={{ marginBottom: "12px" }}>
                      <strong>{item.program.title}</strong>
                      <span>{item.program.summary}</span>
                    </div>
                  ))
                ) : (
                  <span>현재 필터 기준으로 취업역량 프로그램이 없습니다.</span>
                )}
              </div>

              <div className="mini-card">
                <h3>다음 액션</h3>
                <p>상세 페이지를 본 뒤 추천 이유를 열어보면 우선순위를 훨씬 쉽게 정할 수 있습니다.</p>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
