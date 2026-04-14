import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8000";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Noto+Sans+KR:wght@400;500;700&display=swap');

  * { box-sizing: border-box; }

  :root {
    --bg: #f8fafc;
    --panel: rgba(255,255,255,0.86);
    --panel-strong: #ffffff;
    --ink: #0f172a;
    --muted: #64748b;
    --line: rgba(15, 23, 42, 0.08);
    --soft: #f1f5f9;
    --soft-blue: rgba(37,99,235,0.08);
    --brand: #111827;
    --accent: #2563eb;
    --danger: #dc2626;
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
  .stepbar {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--muted);
    font-size: 13px;
  }
  .step {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 999px;
    background: rgba(255,255,255,0.76);
    border: 1px solid rgba(15,23,42,0.05);
  }
  .step.active {
    color: var(--ink);
    background: var(--soft-blue);
    border-color: rgba(37,99,235,0.16);
  }
  .step-dot {
    width: 24px;
    height: 24px;
    border-radius: 999px;
    display: grid;
    place-items: center;
    background: var(--soft);
    font-size: 12px;
    font-weight: 800;
  }
  .step.active .step-dot {
    background: var(--brand);
    color: white;
  }
  .container {
    width: min(1040px, calc(100% - 32px));
    margin: 0 auto;
    padding: 28px 0 40px;
  }
  .hero {
    display: grid;
    grid-template-columns: 1.15fr 0.85fr;
    gap: 16px;
    margin-bottom: 16px;
  }
  .hero-card, .aside-card, .section-card {
    border: 1px solid var(--line);
    border-radius: 28px;
    background: var(--panel);
    box-shadow: var(--shadow);
    backdrop-filter: blur(10px);
  }
  .hero-card {
    padding: 32px;
  }
  .hero-card h1 {
    margin: 0 0 10px;
    font-family: 'Manrope', sans-serif;
    font-size: clamp(34px, 5vw, 50px);
    line-height: 1.05;
    letter-spacing: -0.06em;
  }
  .hero-card p {
    margin: 0;
    color: var(--muted);
    line-height: 1.8;
    font-size: 15px;
  }
  .eyebrow {
    width: fit-content;
    border-radius: 999px;
    background: var(--soft-blue);
    color: var(--accent);
    padding: 8px 12px;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.02em;
    margin-bottom: 16px;
  }
  .aside-card {
    padding: 24px;
    display: grid;
    gap: 12px;
  }
  .aside-item {
    border-radius: 20px;
    background: rgba(255,255,255,0.76);
    border: 1px solid rgba(15,23,42,0.05);
    padding: 16px;
  }
  .aside-item strong {
    display: block;
    font-size: 15px;
    margin-bottom: 6px;
  }
  .aside-item span {
    color: var(--muted);
    font-size: 13px;
    line-height: 1.7;
  }
  .error {
    margin-bottom: 16px;
    padding: 14px 16px;
    border-radius: 18px;
    background: rgba(220,38,38,0.08);
    border: 1px solid rgba(220,38,38,0.14);
    color: var(--danger);
    font-size: 14px;
  }
  .sections {
    display: grid;
    gap: 14px;
  }
  .section-card {
    padding: 24px;
  }
  .section-head {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    align-items: start;
    margin-bottom: 18px;
  }
  .section-head h2 {
    margin: 0 0 6px;
    font-family: 'Manrope', sans-serif;
    font-size: 22px;
    letter-spacing: -0.04em;
  }
  .section-head p {
    margin: 0;
    color: var(--muted);
    font-size: 14px;
    line-height: 1.7;
  }
  .badge {
    border-radius: 999px;
    background: var(--soft);
    color: var(--muted);
    padding: 8px 12px;
    font-size: 12px;
    font-weight: 700;
    white-space: nowrap;
  }
  .grid-2 {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }
  .field {
    display: grid;
    gap: 8px;
  }
  .label {
    font-size: 13px;
    font-weight: 700;
    color: #334155;
  }
  .input, .textarea {
    width: 100%;
    border-radius: 16px;
    border: 1px solid #dbe3ef;
    background: rgba(255,255,255,0.92);
    padding: 13px 14px;
    font: inherit;
    color: var(--ink);
    outline: none;
  }
  .input:focus, .textarea:focus, .tag-wrap:focus-within {
    border-color: rgba(37,99,235,0.35);
    box-shadow: 0 0 0 4px rgba(37,99,235,0.08);
  }
  .textarea {
    min-height: 108px;
    resize: vertical;
    line-height: 1.7;
  }
  .hint {
    color: var(--muted);
    font-size: 12px;
    line-height: 1.6;
  }
  .tag-wrap {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    border: 1px solid #dbe3ef;
    background: rgba(255,255,255,0.92);
    border-radius: 16px;
    padding: 10px;
    min-height: 54px;
  }
  .tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border-radius: 999px;
    background: #eff6ff;
    color: #1d4ed8;
    padding: 7px 10px;
    font-size: 12px;
    font-weight: 700;
  }
  .tag.secondary {
    background: #ecfeff;
    color: #0f766e;
  }
  .tag button {
    border: none;
    background: transparent;
    color: inherit;
    cursor: pointer;
    font: inherit;
    padding: 0;
  }
  .tag-input {
    flex: 1;
    min-width: 160px;
    border: none;
    outline: none;
    font: inherit;
    background: transparent;
    color: var(--ink);
    padding: 6px;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .chip {
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
  .chip.active {
    background: var(--brand);
    color: white;
    border-color: var(--brand);
  }
  .project-card {
    border: 1px solid #e5eaf2;
    border-radius: 22px;
    background: rgba(248,250,252,0.86);
    padding: 18px;
  }
  .project-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 14px;
  }
  .project-title {
    font-size: 14px;
    font-weight: 800;
  }
  .ghost-btn, .primary-btn {
    border-radius: 16px;
    padding: 13px 16px;
    font: inherit;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
  }
  .ghost-btn {
    border: 1px solid #dbe3ef;
    background: white;
    color: #334155;
  }
  .primary-btn {
    border: 1px solid var(--brand);
    background: var(--brand);
    color: white;
  }
  .add-btn {
    margin-top: 14px;
    width: 100%;
    border: 1px dashed #cbd5e1;
    background: rgba(255,255,255,0.72);
    color: #334155;
    border-radius: 18px;
    padding: 14px;
    font: inherit;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
  }
  .footer-actions {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    margin-top: 18px;
  }

  @media (max-width: 960px) {
    .nav {
      padding: 16px 18px;
    }
    .stepbar {
      display: none;
    }
    .container {
      width: min(100%, calc(100% - 24px));
    }
    .hero {
      grid-template-columns: 1fr;
    }
    .grid-2, .footer-actions {
      grid-template-columns: 1fr;
      display: grid;
    }
  }
`;

function TagInput({ tags, setTags, placeholder, secondary = false }) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const trimmed = input.trim();
    if (!trimmed || tags.includes(trimmed)) return;
    setTags([...tags, trimmed]);
    setInput("");
  };

  return (
    <div className="tag-wrap">
      {tags.map((tag) => (
        <span className={`tag${secondary ? " secondary" : ""}`} key={tag}>
          {tag}
          <button onClick={() => setTags(tags.filter((item) => item !== tag))}>×</button>
        </span>
      ))}
      <input
        className="tag-input"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            addTag();
          }
        }}
        onBlur={addTag}
        placeholder={placeholder}
      />
    </div>
  );
}

function ProjectCard({ project, index, onChange, onRemove }) {
  return (
    <div className="project-card">
      <div className="project-head">
        <div className="project-title">활동·프로젝트 {index + 1}</div>
        <button className="ghost-btn" onClick={onRemove}>
          삭제
        </button>
      </div>
      <div className="grid-2">
        <div className="field">
          <label className="label">활동명 / 프로젝트명</label>
          <input
            className="input"
            value={project.name}
            placeholder="예: 교내 홍보 프로젝트, 쇼핑몰 운영 개선, 앱 제작"
            onChange={(event) => onChange({ ...project, name: event.target.value })}
          />
        </div>
        <div className="field">
          <label className="label">내 역할</label>
          <input
            className="input"
            value={project.role}
            placeholder="예: 기획, 운영, 디자인, 분석, 상담, 개발"
            onChange={(event) => onChange({ ...project, role: event.target.value })}
          />
        </div>
      </div>
      <div className="field" style={{ marginTop: "14px" }}>
        <label className="label">사용 도구 / 역량</label>
        <input
          className="input"
          value={project.stack}
          placeholder="예: Excel, Figma, 문서작성, SQL, Python, 고객응대"
          onChange={(event) => onChange({ ...project, stack: event.target.value })}
        />
      </div>
      <div className="field" style={{ marginTop: "14px" }}>
        <label className="label">주요 성과 / 설명</label>
        <textarea
          className="textarea"
          value={project.desc}
          placeholder="무엇을 했고, 어떤 역량을 보여줄 수 있는지 적어주세요."
          onChange={(event) => onChange({ ...project, desc: event.target.value })}
        />
      </div>
    </div>
  );
}

const levelOptions = ["없음", "기초", "비즈니스", "원어민 수준"];

export default function PortfolioInput() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [extraSkills, setExtraSkills] = useState([]);
  const [engLevel, setEngLevel] = useState("비즈니스");
  const [projects, setProjects] = useState([{ name: "", role: "", stack: "", desc: "" }]);
  const [school, setSchool] = useState("");
  const [major, setMajor] = useState("");
  const [graduation, setGraduation] = useState("");
  const [gpa, setGpa] = useState("");
  const [jobTags, setJobTags] = useState([]);
  const [salary, setSalary] = useState("");
  const [intro, setIntro] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/api/portfolio/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills,
          ai_skills: extraSkills,
          eng_level: engLevel,
          school,
          major,
          graduation,
          gpa,
          job_tags: jobTags,
          salary,
          intro,
          projects,
        }),
      });

      if (!response.ok) {
        throw new Error("입력 정보를 저장하지 못했습니다.");
      }

      const data = await response.json();
      navigate("/result", { state: { portfolioId: data.id } });
    } catch (err) {
      setError("백엔드 서버와 연결하지 못했어요. 저장 상태를 확인한 뒤 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <style>{styles}</style>

      <nav className="nav">
        <div className="logo" onClick={() => navigate("/")}>
          Career<span>Match</span>
        </div>
        <div className="stepbar">
          <div className="step">
            <span className="step-dot">1</span>
            안내
          </div>
          <div className="step active">
            <span className="step-dot">2</span>
            준비 상태 입력
          </div>
          <div className="step">
            <span className="step-dot">3</span>
            추천 결과
          </div>
        </div>
      </nav>

      <main className="container">
        <section className="hero">
          <div className="hero-card">
            <div className="eyebrow">Preparation Profile</div>
            <h1>지금 상태를 편하게 적어주세요.</h1>
            <p>
              모든 칸을 완벽하게 채울 필요는 없습니다. 현재 가진 역량, 최근 경험, 원하는 방향만
              적어도 프로그램 추천에 충분히 활용할 수 있어요.
            </p>
          </div>
          <aside className="aside-card">
            <div className="aside-item">
              <strong>누구를 위한 입력 폼인가요?</strong>
              <span>학생, 취준생, 이직 준비자, 직무 전환 준비자처럼 다양한 상황을 고려했습니다.</span>
            </div>
            <div className="aside-item">
              <strong>무엇을 추천하나요?</strong>
              <span>국민내일배움카드 과정, 일학습병행훈련, 취업역량 강화프로그램을 함께 비교합니다.</span>
            </div>
            <div className="aside-item">
              <strong>어떻게 활용되나요?</strong>
              <span>입력한 역량, 관심 키워드, 참여 조건을 기반으로 추천 순서와 가이드 문구를 만듭니다.</span>
            </div>
          </aside>
        </section>

        {error && <div className="error">{error}</div>}

        <section className="sections">
          <article className="section-card">
            <div className="section-head">
              <div>
                <h2>보유 역량</h2>
                <p>기술뿐 아니라 도구, 자격, 강점, 익숙한 업무 방식도 모두 괜찮습니다.</p>
              </div>
              <div className="badge">핵심 정보</div>
            </div>
            <div className="grid-2">
              <div className="field">
                <label className="label">핵심 역량 / 도구</label>
                <TagInput
                  tags={skills}
                  setTags={setSkills}
                  placeholder="예: 문서작성, Excel, 발표, 고객응대, SQL"
                />
                <div className="hint">실무 도구, 소프트 스킬, 업무 강점을 자유롭게 적어주세요.</div>
              </div>
              <div className="field">
                <label className="label">추가 역량 / 자격</label>
                <TagInput
                  tags={extraSkills}
                  setTags={setExtraSkills}
                  placeholder="예: 컴활, GTQ, 데이터분석, 외국어, 마케팅 경험"
                  secondary
                />
                <div className="hint">자격증, 수료 경험, 특화 역량처럼 보완 정보가 있으면 도움이 됩니다.</div>
              </div>
            </div>
            <div className="field" style={{ marginTop: "16px" }}>
              <label className="label">외국어 / 커뮤니케이션 준비도</label>
              <div className="chips">
                {levelOptions.map((option) => (
                  <button
                    key={option}
                    className={`chip${engLevel === option ? " active" : ""}`}
                    onClick={() => setEngLevel(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </article>

          <article className="section-card">
            <div className="section-head">
              <div>
                <h2>활동 경험</h2>
                <p>프로젝트가 아니어도 괜찮아요. 인턴, 동아리, 아르바이트, 운영 경험도 좋은 근거가 됩니다.</p>
              </div>
              <div className="badge">최대 5개</div>
            </div>
            {projects.map((project, index) => (
              <div key={index} style={{ marginBottom: index === projects.length - 1 ? "0" : "14px" }}>
                <ProjectCard
                  project={project}
                  index={index}
                  onChange={(nextProject) =>
                    setProjects(projects.map((item, itemIndex) => (itemIndex === index ? nextProject : item)))
                  }
                  onRemove={() => setProjects(projects.filter((_, itemIndex) => itemIndex !== index))}
                />
              </div>
            ))}
            {projects.length < 5 && (
              <button
                className="add-btn"
                onClick={() => setProjects([...projects, { name: "", role: "", stack: "", desc: "" }])}
              >
                + 활동 경험 추가하기
              </button>
            )}
          </article>

          <article className="section-card">
            <div className="section-head">
              <div>
                <h2>현재 준비 상태</h2>
                <p>지금의 배경과 방향을 알수록 더 적절한 프로그램으로 좁혀집니다.</p>
              </div>
              <div className="badge">선택 입력 가능</div>
            </div>
            <div className="grid-2">
              <div className="field">
                <label className="label">학교 / 교육기관 / 최근 소속</label>
                <input
                  className="input"
                  value={school}
                  placeholder="예: 한국대학교, OO직업전문학교, 최근 근무처"
                  onChange={(event) => setSchool(event.target.value)}
                />
              </div>
              <div className="field">
                <label className="label">전공 / 희망 분야</label>
                <input
                  className="input"
                  value={major}
                  placeholder="예: 경영, 디자인, 행정, 데이터, 마케팅, 사회복지"
                  onChange={(event) => setMajor(event.target.value)}
                />
              </div>
              <div className="field">
                <label className="label">졸업 / 수료 / 경력 시점</label>
                <input
                  className="input"
                  value={graduation}
                  placeholder="예: 2025년 2월 졸업, 2024년 수료, 경력 2년"
                  onChange={(event) => setGraduation(event.target.value)}
                />
              </div>
              <div className="field">
                <label className="label">성적 / 자격 / 참고사항</label>
                <input
                  className="input"
                  value={gpa}
                  placeholder="예: 컴활 1급, GTQ 1급, 3.8 / 4.5"
                  onChange={(event) => setGpa(event.target.value)}
                />
              </div>
            </div>
          </article>

          <article className="section-card">
            <div className="section-head">
              <div>
                <h2>학습 목표 / 참여 조건</h2>
                <p>관심 분야와 원하는 운영 방식을 적어두면 추천 품질이 더 좋아집니다.</p>
              </div>
              <div className="badge">추천 반영</div>
            </div>
            <div className="grid-2">
              <div className="field">
                <label className="label">관심 분야 / 목표 키워드</label>
                <TagInput
                  tags={jobTags}
                  setTags={setJobTags}
                  placeholder="예: 사무행정, 사회복지, 웹디자인, 취업면접 준비"
                />
                <div className="hint">직무명, 배우고 싶은 역량, 자격증 준비, 취업 준비 목적을 적어주세요.</div>
              </div>
              <div className="field">
                <label className="label">참여 조건 / 선호 방식</label>
                <input
                  className="input"
                  value={salary}
                  placeholder="예: 온라인 병행, 주말 가능, 실습 중심, 자격증 대비"
                  onChange={(event) => setSalary(event.target.value)}
                />
                <div className="hint">시간대, 수업 방식, 실습 여부처럼 꼭 반영됐으면 하는 조건을 적어주세요.</div>
              </div>
            </div>
            <div className="field" style={{ marginTop: "16px" }}>
              <label className="label">현재 고민 / 준비 상황</label>
              <textarea
                className="textarea"
                value={intro}
                placeholder="예: 취업 준비를 다시 시작하는 단계라 직무를 구체화하고 실무 경험을 쌓을 수 있는 프로그램을 찾고 있습니다."
                onChange={(event) => setIntro(event.target.value)}
              />
            </div>
          </article>
        </section>

        <div className="footer-actions">
          <button className="ghost-btn" onClick={() => navigate("/")}>
            ← 이전으로
          </button>
          <button className="primary-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "분석 중..." : "추천 결과 보기"}
          </button>
        </div>
      </main>
    </div>
  );
}
