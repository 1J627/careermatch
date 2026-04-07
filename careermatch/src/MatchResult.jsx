import { useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
    --brand: #2563EB; --brand-light: #EFF6FF; --brand-dark: #1E3A8A;
    --accent: #10B981; --surface: #F8FAFC; --border: rgba(15,23,42,0.08); --white: #fff;
  }
  body { font-family: 'Pretendard', -apple-system, sans-serif; background: var(--surface); color: #0F172A; }

  .mr-nav { display: flex; align-items: center; justify-content: space-between; padding: 18px 48px; border-bottom: 1px solid var(--border); background: rgba(255,255,255,0.92); backdrop-filter: blur(12px); position: sticky; top: 0; z-index: 100; }
  .mr-logo { font-family: 'Pretendard', sans-serif; font-weight: 800; font-size: 20px; color: var(--brand-dark); }
  .mr-logo span { color: var(--brand); }
  .step-bar { display: flex; align-items: center; gap: 8px; }
  .pi-step { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #94A3B8; font-weight: 500; }
  .pi-step.done { color: var(--accent); }
  .pi-step.active { color: var(--brand); }
  .step-dot { width: 22px; height: 22px; border-radius: 50%; border: 2px solid #E2E8F0; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; }
  .pi-step.done .step-dot { border-color: var(--accent); background: var(--accent); color: #fff; }
  .pi-step.active .step-dot { border-color: var(--brand); color: var(--brand); }
  .step-line { width: 32px; height: 1px; background: #E2E8F0; }

  .summary-bar { background: var(--brand-dark); color: #fff; padding: 32px 48px; display: flex; align-items: center; justify-content: space-between; }
  .summary-left h1 { font-family: 'Pretendard', sans-serif; font-size: 22px; font-weight: 800; margin-bottom: 4px; }
  .summary-left p { font-size: 14px; opacity: 0.65; }
  .summary-stats { display: flex; gap: 40px; }
  .s-stat { text-align: center; }
  .s-num { font-family: 'Pretendard', sans-serif; font-size: 28px; font-weight: 800; }
  .s-label { font-size: 12px; opacity: 0.6; margin-top: 2px; }

  .main-wrap { max-width: 1100px; margin: 0 auto; padding: 36px 24px; display: grid; grid-template-columns: 1fr 340px; gap: 24px; align-items: start; }

  .filter-bar { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
  .filter-btn { padding: 7px 16px; border-radius: 999px; font-size: 13px; font-weight: 600; cursor: pointer; border: 1.5px solid #E2E8F0; background: #fff; color: #475569; font-family: inherit; transition: all 0.15s; }
  .filter-btn.active { background: var(--brand); color: #fff; border-color: var(--brand); }
  .results-label { font-size: 13px; color: #94A3B8; margin-left: auto; }

  .job-card { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 24px; margin-bottom: 16px; transition: transform 0.2s; cursor: pointer; }
  .job-card:hover { transform: translateY(-2px); }
  .job-card.top { border: 2px solid var(--brand); }
  .top-badge { display: inline-block; background: var(--brand-light); color: var(--brand); font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 999px; margin-bottom: 12px; }
  .job-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px; }
  .job-logo { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 800; color: #fff; flex-shrink: 0; }
  .job-info { flex: 1; margin-left: 12px; }
  .job-title { font-weight: 700; font-size: 15px; margin-bottom: 2px; }
  .job-company { font-size: 13px; color: #64748B; }
  .score-circle { width: 52px; height: 52px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-direction: column; flex-shrink: 0; }
  .score-pct { font-family: 'Pretendard', sans-serif; font-size: 15px; font-weight: 800; line-height: 1; }
  .score-txt { font-size: 9px; font-weight: 600; margin-top: 1px; }
  .score-high { background: #ECFDF5; color: #059669; }
  .score-mid { background: #EFF6FF; color: #2563EB; }

  .job-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px; }
  .j-tag { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 999px; }
  .j-tag-blue { background: var(--brand-light); color: #1E40AF; }
  .j-tag-gray { background: #F1F5F9; color: #475569; }
  .j-tag-green { background: #ECFDF5; color: #065F46; }

  .skill-bars { margin-bottom: 14px; }
  .skill-row { display: flex; align-items: center; gap: 8px; margin-bottom: 7px; }
  .skill-name { font-size: 12px; color: #64748B; width: 90px; flex-shrink: 0; }
  .skill-bg { flex: 1; height: 5px; background: #F1F5F9; border-radius: 999px; overflow: hidden; }
  .skill-fill { height: 100%; border-radius: 999px; }
  .skill-pct-txt { font-size: 11px; font-weight: 700; width: 30px; text-align: right; }

  .job-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 14px; border-top: 1px solid #F1F5F9; }
  .deadline { font-size: 12px; color: #94A3B8; }
  .guide-btn { background: var(--brand); color: #fff; border: none; padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer; font-family: inherit; transition: background 0.2s; }
  .guide-btn:hover { background: var(--brand-dark); }

  .sidebar-card { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 22px; margin-bottom: 16px; }
  .sidebar-title { font-weight: 700; font-size: 14px; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
  .sidebar-icon { width: 24px; height: 24px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 13px; }

  .radar-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .radar-item { text-align: center; padding: 12px 8px; background: #FAFBFC; border-radius: 10px; }
  .radar-score { font-family: 'Pretendard', sans-serif; font-size: 20px; font-weight: 800; color: var(--brand); }
  .radar-label { font-size: 11px; color: #64748B; margin-top: 2px; }

  .missing-list { display: flex; flex-direction: column; gap: 8px; }
  .missing-item { display: flex; align-items: center; justify-content: space-between; padding: 9px 12px; background: #FFF7ED; border-radius: 8px; }
  .missing-name { font-size: 13px; font-weight: 600; color: #92400E; }
  .missing-lv { font-size: 11px; color: #B45309; background: #FEF3C7; padding: 2px 8px; border-radius: 999px; }

  .trend-list { display: flex; flex-direction: column; gap: 8px; }
  .trend-item { display: flex; align-items: center; gap: 10px; }
  .trend-rank { font-size: 12px; font-weight: 700; color: #94A3B8; width: 16px; }
  .trend-name { font-size: 13px; font-weight: 600; flex: 1; }
  .trend-bar-bg { width: 64px; height: 5px; background: #F1F5F9; border-radius: 999px; overflow: hidden; }
  .trend-bar-fill { height: 100%; background: var(--brand); border-radius: 999px; }

  .bottom-bar { max-width: 1100px; margin: 0 auto; padding: 24px; display: flex; align-items: center; }
  .btn-back { background: transparent; border: 1.5px solid #E2E8F0; color: #374151; padding: 12px 24px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; }
  .btn-back:hover { border-color: var(--brand); color: var(--brand); }
`;

const FILTERS = ["전체", "90% 이상", "대기업", "스타트업", "재택 가능"];

const JOBS = [
  {
    top: true,
    logoBg: "#FEE500", logoColor: "#000", logoText: "카카오",
    title: "백엔드 개발자 (AI플랫폼팀)",
    company: "카카오 · 판교 · 정규직",
    score: 92, scoreClass: "score-high",
    tags: [
      { label: "✓ 자격요건 충족", cls: "j-tag-green" },
      { label: "Python", cls: "j-tag-blue" },
      { label: "FastAPI", cls: "j-tag-blue" },
      { label: "LangChain", cls: "j-tag-blue" },
      { label: "우대 4/6", cls: "j-tag-gray" },
    ],
    skills: [
      { name: "기술 스택", pct: 95, color: "#10B981", textColor: "#059669" },
      { name: "직무 경험", pct: 88, color: "#2563EB", textColor: "#2563EB" },
      { name: "우대사항",  pct: 72, color: "#7C3AED", textColor: "#7C3AED" },
    ],
    deadline: "마감 D-12 · 연봉 5,000~7,000만",
  },
  {
    logoBg: "#03C75A", logoColor: "#fff", logoText: "네이버",
    title: "서버 개발자 (클로바)",
    company: "네이버 · 성남 · 정규직",
    score: 87, scoreClass: "score-high",
    tags: [
      { label: "✓ 자격요건 충족", cls: "j-tag-green" },
      { label: "Python", cls: "j-tag-blue" },
      { label: "LLM", cls: "j-tag-blue" },
      { label: "우대 3/5", cls: "j-tag-gray" },
    ],
    skills: [
      { name: "기술 스택", pct: 90, color: "#10B981", textColor: "#059669" },
      { name: "직무 경험", pct: 82, color: "#2563EB", textColor: "#2563EB" },
    ],
    deadline: "마감 D-5 · 연봉 협의",
  },
  {
    logoBg: "#5F2EEA", logoColor: "#fff", logoText: "토스",
    title: "백엔드 엔지니어 (AI팀)",
    company: "토스 · 서울 · 정규직",
    score: 79, scoreClass: "score-mid",
    tags: [
      { label: "Kotlin 경험 필요", cls: "j-tag-gray" },
      { label: "Python", cls: "j-tag-blue" },
      { label: "pgvector", cls: "j-tag-blue" },
      { label: "우대 2/5", cls: "j-tag-gray" },
    ],
    skills: [
      { name: "기술 스택", pct: 78, color: "#2563EB", textColor: "#2563EB" },
      { name: "직무 경험", pct: 80, color: "#2563EB", textColor: "#2563EB" },
    ],
    deadline: "마감 D-20 · 연봉 6,000만+",
  },
];

const RADAR = [
  { score: "95%", label: "기술 스택", color: "#2563EB" },
  { score: "82%", label: "프로젝트",  color: "#2563EB" },
  { score: "70%", label: "우대사항",  color: "#7C3AED" },
  { score: "58%", label: "자격증",    color: "#F59E0B" },
];

const MISSING = [
  { name: "Kotlin",     lv: "기업 요구 높음" },
  { name: "Kubernetes", lv: "우대사항 다수" },
  { name: "AWS",        lv: "우대사항 다수" },
];

const TRENDS = [
  { rank: 1, name: "LangChain",  pct: 90 },
  { rank: 2, name: "RAG",        pct: 80 },
  { rank: 3, name: "FastAPI",    pct: 70 },
  { rank: 4, name: "pgvector",   pct: 55 },
  { rank: 5, name: "Kubernetes", pct: 45 },
];

function JobCard({ job }) {
  return (
    <div className={`job-card${job.top ? " top" : ""}`}>
      {job.top && <div className="top-badge">최고 매칭</div>}
      <div className="job-header">
        <div className="job-logo" style={{ background: job.logoBg, color: job.logoColor }}>{job.logoText}</div>
        <div className="job-info">
          <div className="job-title">{job.title}</div>
          <div className="job-company">{job.company}</div>
        </div>
        <div className={`score-circle ${job.scoreClass}`}>
          <div className="score-pct">{job.score}%</div>
          <div className="score-txt">적합도</div>
        </div>
      </div>
      <div className="job-tags">
        {job.tags.map((t, i) => <span key={i} className={`j-tag ${t.cls}`}>{t.label}</span>)}
      </div>
      <div className="skill-bars">
        {job.skills.map((s, i) => (
          <div className="skill-row" key={i}>
            <span className="skill-name">{s.name}</span>
            <div className="skill-bg"><div className="skill-fill" style={{ width: `${s.pct}%`, background: s.color }} /></div>
            <span className="skill-pct-txt" style={{ color: s.textColor }}>{s.pct}%</span>
          </div>
        ))}
      </div>
      <div className="job-footer">
        <span className="deadline">{job.deadline}</span>
        <button className="guide-btn">자소서 가이드 보기 →</button>
      </div>
    </div>
  );
}

export default function MatchResult() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("전체");

  return (
    <>
      <style>{styles}</style>

      <nav className="mr-nav">
        <div className="mr-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Career<span>Match</span></div>
        <div className="step-bar">
          <div className="pi-step done"><div className="step-dot">✓</div>기본정보</div>
          <div className="step-line" />
          <div className="pi-step done"><div className="step-dot">✓</div>포트폴리오</div>
          <div className="step-line" />
          <div className="pi-step active"><div className="step-dot">3</div>매칭결과</div>
        </div>
      </nav>

      <div className="summary-bar">
        <div className="summary-left">
          <h1>AI 매칭 결과 — 백엔드 개발자</h1>
          <p>포트폴리오 분석 완료 · 총 12,483개 공고 중 최적 매칭 추출</p>
        </div>
        <div className="summary-stats">
          <div className="s-stat"><div className="s-num">247</div><div className="s-label">매칭 공고</div></div>
          <div className="s-stat"><div className="s-num">92%</div><div className="s-label">최고 적합도</div></div>
          <div className="s-stat"><div className="s-num">18</div><div className="s-label">자격요건 충족</div></div>
        </div>
      </div>

      <div className="main-wrap">
        <div>
          <div className="filter-bar">
            {FILTERS.map((f) => (
              <button key={f} className={`filter-btn${activeFilter === f ? " active" : ""}`} onClick={() => setActiveFilter(f)}>{f}</button>
            ))}
            <span className="results-label">247개 결과</span>
          </div>
          {JOBS.map((job, i) => <JobCard key={i} job={job} />)}
        </div>

        <div>
          <div className="sidebar-card">
            <div className="sidebar-title">
              <div className="sidebar-icon" style={{ background: "#EFF6FF" }}>📊</div>
              역량 분석
            </div>
            <div className="radar-wrap">
              {RADAR.map((r, i) => (
                <div className="radar-item" key={i}>
                  <div className="radar-score" style={{ color: r.color }}>{r.score}</div>
                  <div className="radar-label">{r.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-card">
            <div className="sidebar-title">
              <div className="sidebar-icon" style={{ background: "#FFF7ED" }}>⚠️</div>
              보완 추천 스킬
            </div>
            <div className="missing-list">
              {MISSING.map((m, i) => (
                <div className="missing-item" key={i}>
                  <span className="missing-name">{m.name}</span>
                  <span className="missing-lv">{m.lv}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-card">
            <div className="sidebar-title">
              <div className="sidebar-icon" style={{ background: "#ECFDF5" }}>📈</div>
              인기 기술 트렌드
            </div>
            <div className="trend-list">
              {TRENDS.map((t) => (
                <div className="trend-item" key={t.rank}>
                  <span className="trend-rank">{t.rank}</span>
                  <span className="trend-name">{t.name}</span>
                  <div className="trend-bar-bg"><div className="trend-bar-fill" style={{ width: `${t.pct}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bottom-bar">
        <button className="btn-back" onClick={() => navigate('/portfolio')}>← 이전</button>
      </div>
    </>
  );
}
