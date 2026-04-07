import { useNavigate } from "react-router-dom";

const styles = `

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --brand: #2563EB;
    --brand-light: #EFF6FF;
    --brand-dark: #1E3A8A;
    --accent: #10B981;
    --text-primary: #0F172A;
    --text-secondary: #475569;
    --text-muted: #94A3B8;
    --surface: #F8FAFC;
    --border: rgba(15,23,42,0.08);
    --white: #ffffff;
  }

  body { font-family: 'Pretendard', -apple-system, sans-serif; background: var(--white); color: var(--text-primary); overflow-x: hidden; }

  nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 48px;
    border-bottom: 1px solid var(--border);
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(12px);
    position: sticky; top: 0; z-index: 100;
  }
  .logo { font-family: 'Pretendard', sans-serif; font-weight: 800; font-size: 22px; color: var(--brand-dark); letter-spacing: -0.5px; }
  .logo span { color: var(--brand); }
  .nav-links { display: flex; gap: 32px; align-items: center; }
  .nav-links a { font-size: 14px; color: var(--text-secondary); text-decoration: none; font-weight: 500; transition: color 0.2s; }
  .nav-links a:hover { color: var(--text-primary); }
  .nav-cta {
    background: var(--brand); color: #fff; border: none;
    padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 600;
    cursor: pointer; font-family: inherit; transition: background 0.2s, transform 0.1s;
  }
  .nav-cta:hover { background: var(--brand-dark); transform: translateY(-1px); }

  .hero {
    padding: 88px 48px 80px;
    max-width: 1100px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;
  }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--brand-light); color: var(--brand);
    font-size: 12px; font-weight: 600; padding: 5px 12px; border-radius: 999px;
    margin-bottom: 20px; letter-spacing: 0.3px;
  }
  .hero-badge::before {
    content: ''; width: 6px; height: 6px; border-radius: 50%;
    background: var(--accent); display: inline-block;
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }

  h1 {
    font-family: 'Pretendard', sans-serif; font-weight: 800;
    font-size: clamp(32px, 4vw, 48px); line-height: 1.15;
    color: var(--text-primary); margin-bottom: 20px; letter-spacing: -1px;
  }
  h1 em { font-style: normal; color: var(--brand); }
  .hero-desc { font-size: 17px; line-height: 1.75; color: var(--text-secondary); margin-bottom: 36px; }
  .hero-btns { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
  .btn-primary {
    background: var(--brand); color: #fff; border: none;
    padding: 14px 28px; border-radius: 10px; font-size: 15px; font-weight: 600;
    cursor: pointer; font-family: inherit; transition: all 0.2s;
  }
  .btn-primary:hover { background: var(--brand-dark); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(37,99,235,0.25); }
  .btn-secondary {
    background: transparent; color: var(--text-primary);
    border: 1.5px solid var(--border);
    padding: 13px 24px; border-radius: 10px; font-size: 15px; font-weight: 500;
    cursor: pointer; font-family: inherit; transition: all 0.2s;
  }
  .btn-secondary:hover { border-color: var(--brand); color: var(--brand); }

  .hero-visual {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 20px; padding: 28px;
    animation: floatUp 0.8s ease-out;
  }
  @keyframes floatUp { from{opacity:0;transform:translateY(20px);} to{opacity:1;transform:translateY(0);} }

  .match-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
  .match-avatar {
    width: 40px; height: 40px; border-radius: 10px;
    background: linear-gradient(135deg, #2563EB, #7C3AED);
    display: flex; align-items: center; justify-content: center; font-size: 18px;
  }
  .match-title { font-weight: 600; font-size: 14px; }
  .match-sub { font-size: 12px; color: var(--text-muted); }

  .match-score-big {
    text-align: center; padding: 20px 0;
    border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
    margin-bottom: 20px;
  }
  .score-num { font-family: 'Pretendard', sans-serif; font-size: 56px; font-weight: 800; color: var(--accent); line-height: 1; }
  .score-label { font-size: 12px; color: var(--text-muted); margin-top: 4px; }

  .skill-bars { display: flex; flex-direction: column; gap: 10px; }
  .skill-row { display: flex; align-items: center; gap: 10px; }
  .skill-name { font-size: 12px; color: var(--text-secondary); width: 80px; flex-shrink: 0; }
  .skill-bar-bg { flex: 1; height: 6px; background: #E2E8F0; border-radius: 999px; overflow: hidden; }
  .skill-bar-fill { height: 100%; border-radius: 999px; background: var(--brand); }
  .skill-pct { font-size: 11px; font-weight: 600; color: var(--text-secondary); width: 32px; text-align: right; }

  .match-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 16px; }
  .tag { background: var(--brand-light); color: var(--brand); font-size: 11px; font-weight: 500; padding: 4px 10px; border-radius: 999px; }
  .tag.green { background: #ECFDF5; color: #059669; }

  .stats-bar {
    background: var(--text-primary); color: #fff;
    display: flex; flex-wrap: wrap; justify-content: center; gap: 40px 80px; padding: 36px 48px;
  }
  .stat-item { text-align: center; min-width: 100px; }
  .stat-num { font-family: 'Pretendard', sans-serif; font-size: 28px; font-weight: 800; white-space: nowrap; }
  .stat-desc { font-size: 13px; color: rgba(255,255,255,0.55); margin-top: 4px; white-space: nowrap; }

  .features { padding: 96px 48px; max-width: 1100px; margin: 0 auto; }
  .section-label { font-size: 12px; font-weight: 600; color: var(--brand); letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 12px; }
  .section-title { font-family: 'Pretendard', sans-serif; font-size: 34px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 48px; max-width: 480px; line-height: 1.25; }
  .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .feat-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 28px;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .feat-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.06); }
  .feat-icon { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px; margin-bottom: 16px; }
  .icon-blue { background: var(--brand-light); }
  .icon-green { background: #ECFDF5; }
  .icon-purple { background: #F5F3FF; }
  .feat-title { font-weight: 700; font-size: 16px; margin-bottom: 10px; }
  .feat-desc { font-size: 14px; color: var(--text-secondary); line-height: 1.7; }

  .how { background: var(--surface); padding: 96px 48px; }
  .how-inner { max-width: 1100px; margin: 0 auto; }
  .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; margin-top: 48px; position: relative; }
  .steps::before {
    content: ''; position: absolute;
    top: 28px; left: calc(16.6% + 16px); right: calc(16.6% + 16px);
    height: 1px; background: var(--border);
  }
  .step { text-align: center; }
  .step-num {
    width: 56px; height: 56px; border-radius: 50%;
    background: var(--white); border: 2px solid var(--brand);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Pretendard', sans-serif; font-size: 18px; font-weight: 800;
    color: var(--brand); margin: 0 auto 20px; position: relative; z-index: 1;
  }
  .step-title { font-weight: 700; font-size: 16px; margin-bottom: 8px; }
  .step-desc { font-size: 14px; color: var(--text-secondary); line-height: 1.7; }

  .cta-section { padding: 96px 48px; text-align: center; background: var(--brand-dark); color: #fff; }
  .cta-section h2 { font-family: 'Pretendard', sans-serif; font-size: 36px; font-weight: 800; margin-bottom: 16px; letter-spacing: -0.5px; }
  .cta-section p { font-size: 17px; opacity: 0.7; margin-bottom: 36px; }
  .btn-white {
    background: #fff; color: var(--brand-dark);
    padding: 14px 32px; border-radius: 10px; font-size: 15px; font-weight: 700;
    cursor: pointer; border: none; font-family: inherit; transition: transform 0.2s; display: inline-block;
  }
  .btn-white:hover { transform: translateY(-2px); }

  footer { padding: 32px 48px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
  .footer-logo { font-family: 'Pretendard', sans-serif; font-weight: 800; font-size: 16px; color: var(--text-secondary); }
  .footer-logo span { color: var(--brand); }
  footer p { font-size: 13px; color: var(--text-muted); }

  /* ── Tablet (≤ 900px) ── */
  @media (max-width: 900px) {
    nav { padding: 16px 24px; }

    .hero {
      grid-template-columns: 1fr;
      padding: 60px 24px 48px;
      gap: 40px;
    }

    .features { padding: 64px 24px; }
    .features-grid { grid-template-columns: 1fr 1fr; }

    .how { padding: 64px 24px; }
    .steps { grid-template-columns: 1fr 1fr; }
    .steps::before { display: none; }

    .cta-section { padding: 64px 24px; }

    footer { padding: 24px 24px; }
  }

  /* ── Mobile (≤ 600px) ── */
  @media (max-width: 600px) {
    nav { padding: 14px 20px; }
    .nav-links { gap: 16px; }
    .nav-links a { display: none; }

    .hero { padding: 48px 20px 40px; gap: 32px; }
    .hero-desc { font-size: 15px; }
    .hero-btns { flex-direction: column; align-items: stretch; }
    .btn-primary, .btn-secondary { text-align: center; }

    .stats-bar { gap: 28px 40px; padding: 28px 20px; }
    .stat-num { font-size: 22px; }

    .features { padding: 56px 20px; }
    .features-grid { grid-template-columns: 1fr; }
    .section-title { font-size: 26px; }

    .how { padding: 56px 20px; }
    .steps { grid-template-columns: 1fr; gap: 24px; }

    .cta-section { padding: 56px 20px; }
    .cta-section h2 { font-size: 26px; }
    .cta-section p { font-size: 15px; }

    footer { flex-direction: column; gap: 8px; text-align: center; padding: 24px 20px; }
  }
`;

const skills = [
  { name: "Python/FastAPI", pct: 95, color: "#2563EB" },
  { name: "LangChain", pct: 88, color: "#2563EB" },
  { name: "Vector DB", pct: 80, color: "#7C3AED" },
  { name: "React", pct: 72, color: "#10B981" },
];

const features = [
  {
    icon: "🔍",
    iconClass: "icon-blue",
    title: "실시간 채용공고 수집",
    desc: "공식 OpenAPI를 통해 수만 건의 채용공고를 실시간으로 수집하고, AI가 이해하기 쉬운 구조화된 데이터로 변환합니다.",
  },
  {
    icon: "🎯",
    iconClass: "icon-green",
    title: "의미론적 매칭 엔진",
    desc: "벡터 임베딩 기술로 단순 키워드를 넘어 맥락과 의미를 파악해 진짜 적합한 공고를 찾아드립니다.",
  },
  {
    icon: "✍️",
    iconClass: "icon-purple",
    title: "자소서 & 면접 가이드",
    desc: "선택한 공고에 최적화된 STAR 기법 자소서 작성 전략과 예상 면접 질문을 즉시 생성합니다.",
  },
];

const stats = [
  { num: "50,000+", desc: "실시간 채용공고" },
  { num: "92%", desc: "매칭 정확도" },
  { num: "3분", desc: "평균 분석 시간" },
  { num: "2,400+", desc: "합격 성공 사례" },
];

const steps = [
  {
    num: "1",
    title: "포트폴리오 입력",
    desc: "기술 스택, 프로젝트 경험, 보유 스킬을 자유롭게 입력하세요.",
  },
  {
    num: "2",
    title: "AI 매칭 분석",
    desc: "AI가 수만 건의 공고와 비교해 적합도 점수를 산출합니다.",
  },
  {
    num: "3",
    title: "맞춤 전략 확인",
    desc: "이력서 작성 가이드와 예상 질문으로 합격률을 높이세요.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <>
      <style>{styles}</style>

      {/* NAV */}
      <nav>
        <div className="logo">
          Career<span>Match</span>
        </div>
        <div className="nav-links">
          <a href="#">기능</a>
          <a href="#">사용 방법</a>
          <a href="#">가격</a>
          <button className="nav-cta" onClick={() => navigate('/portfolio')}>무료로 시작하기</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div>
          <div className="hero-badge">AI 기반 취업 매칭 플랫폼</div>
          <h1>
            내 역량에 <em>딱 맞는</em> 채용공고만 골라드립니다
          </h1>
          <p className="hero-desc">
            포트폴리오를 입력하면 AI가 수천 개의 채용공고를 분석해 적합도를
            수치로 보여주고, 맞춤형 자소서 가이드까지 제공합니다.
          </p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => navigate('/portfolio')}>포트폴리오 분석 시작 →</button>
            <button className="btn-secondary" onClick={() => navigate('/portfolio')}>데모 보기</button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="match-header">
            <div className="match-avatar">💼</div>
            <div>
              <div className="match-title">백엔드 개발자 · 카카오</div>
              <div className="match-sub">AI 매칭 결과</div>
            </div>
          </div>
          <div className="match-score-big">
            <div className="score-num">92%</div>
            <div className="score-label">직무 적합도 점수</div>
          </div>
          <div className="skill-bars">
            {skills.map((s) => (
              <div className="skill-row" key={s.name}>
                <span className="skill-name">{s.name}</span>
                <div className="skill-bar-bg">
                  <div
                    className="skill-bar-fill"
                    style={{ width: `${s.pct}%`, background: s.color }}
                  />
                </div>
                <span className="skill-pct">{s.pct}%</span>
              </div>
            ))}
          </div>
          <div className="match-tags">
            <span className="tag green">✓ 자격요건 충족</span>
            <span className="tag">우대사항 4/6</span>
            <span className="tag">자소서 가이드 보기</span>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-bar">
        {stats.map((s) => (
          <div className="stat-item" key={s.desc}>
            <div className="stat-num">{s.num}</div>
            <div className="stat-desc">{s.desc}</div>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <section className="features">
        <div className="section-label">핵심 기능</div>
        <h2 className="section-title">단순 키워드 검색은 이제 그만</h2>
        <div className="features-grid">
          {features.map((f) => (
            <div className="feat-card" key={f.title}>
              <div className={`feat-icon ${f.iconClass}`}>{f.icon}</div>
              <div className="feat-title">{f.title}</div>
              <p className="feat-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how">
        <div className="how-inner">
          <div className="section-label">사용 방법</div>
          <h2 className="section-title">3단계로 완성하는 취업 전략</h2>
          <div className="steps">
            {steps.map((s) => (
              <div className="step" key={s.num}>
                <div className="step-num">{s.num}</div>
                <div className="step-title">{s.title}</div>
                <p className="step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>지금 바로 시작해보세요</h2>
        <p>포트폴리오 입력 3분 만에 나에게 맞는 공고를 찾아드립니다</p>
        <button className="btn-white" onClick={() => navigate('/portfolio')}>무료로 분석 시작하기 →</button>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">
          Career<span>Match</span>
        </div>
        <p>© 2025 CareerMatch. 소프트웨어 캡스톤 디자인 프로젝트</p>
      </footer>
    </>
  );
}
