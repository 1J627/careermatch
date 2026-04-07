import { useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = `

  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
    --brand: #2563EB; --brand-light: #EFF6FF; --brand-dark: #1E3A8A;
    --accent: #10B981; --surface: #F8FAFC; --border: rgba(15,23,42,0.08); --white: #ffffff;
  }
  body { font-family: 'Pretendard', -apple-system, sans-serif; background: var(--surface); color: #0F172A; }

  .pi-nav { display: flex; align-items: center; justify-content: space-between; padding: 18px 48px; border-bottom: 1px solid var(--border); background: rgba(255,255,255,0.92); backdrop-filter: blur(12px); position: sticky; top: 0; z-index: 100; }
  .pi-logo { font-family: 'Pretendard', sans-serif; font-weight: 800; font-size: 20px; color: var(--brand-dark); }
  .pi-logo span { color: var(--brand); }

  .step-bar { display: flex; align-items: center; gap: 8px; }
  .pi-step { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #94A3B8; font-weight: 500; }
  .pi-step.active { color: var(--brand); }
  .pi-step.done { color: var(--accent); }
  .step-dot { width: 22px; height: 22px; border-radius: 50%; border: 2px solid #E2E8F0; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; }
  .pi-step.active .step-dot { border-color: var(--brand); color: var(--brand); }
  .pi-step.done .step-dot { border-color: var(--accent); background: var(--accent); color: #fff; }
  .step-line { width: 32px; height: 1px; background: #E2E8F0; }

  .pi-main { max-width: 760px; margin: 0 auto; padding: 48px 24px; }
  .page-title { font-family: 'Pretendard', sans-serif; font-weight: 800; font-size: 28px; letter-spacing: -0.5px; margin-bottom: 6px; }
  .page-sub { font-size: 15px; color: #475569; margin-bottom: 40px; }

  .pi-section { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 28px; margin-bottom: 20px; }
  .section-title { font-weight: 700; font-size: 15px; margin-bottom: 4px; display: flex; align-items: center; gap: 8px; }
  .section-icon { width: 28px; height: 28px; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 14px; }
  .icon-blue { background: var(--brand-light); }
  .icon-green { background: #ECFDF5; }
  .icon-purple { background: #F5F3FF; }
  .section-desc { font-size: 13px; color: #64748B; margin-bottom: 20px; margin-left: 36px; }

  .pi-label { display: block; font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px; }
  .pi-input { width: 100%; padding: 10px 14px; border: 1px solid #E2E8F0; border-radius: 9px; font-size: 14px; font-family: inherit; color: #0F172A; background: #fff; outline: none; transition: border 0.2s; }
  .pi-input:focus { border-color: var(--brand); }
  .pi-textarea { width: 100%; padding: 10px 14px; border: 1px solid #E2E8F0; border-radius: 9px; font-size: 14px; font-family: inherit; color: #0F172A; background: #fff; outline: none; transition: border 0.2s; resize: vertical; min-height: 96px; line-height: 1.6; }
  .pi-textarea:focus { border-color: var(--brand); }

  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
  .form-group { margin-bottom: 16px; }

  .tag-input-wrap { display: flex; flex-wrap: wrap; gap: 6px; padding: 8px 10px; border: 1px solid #E2E8F0; border-radius: 9px; background: #fff; min-height: 44px; cursor: text; transition: border 0.2s; }
  .tag-input-wrap:focus-within { border-color: var(--brand); }
  .pi-tag { display: inline-flex; align-items: center; gap: 4px; background: var(--brand-light); color: var(--brand); font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 999px; }
  .pi-tag.green { background: #ECFDF5; color: #059669; }
  .tag-remove { cursor: pointer; opacity: 0.6; font-size: 14px; line-height: 1; background: none; border: none; color: inherit; }
  .tag-remove:hover { opacity: 1; }
  .tag-type-input { border: none; outline: none; font-size: 13px; font-family: inherit; color: #0F172A; background: transparent; min-width: 80px; flex: 1; }

  .exp-card { border: 1px solid #F1F5F9; border-radius: 10px; padding: 16px; margin-bottom: 12px; background: #FAFBFC; }
  .exp-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
  .exp-card-title { font-size: 13px; font-weight: 700; color: #374151; }
  .remove-btn { font-size: 12px; color: #94A3B8; cursor: pointer; background: none; border: none; font-family: inherit; }
  .remove-btn:hover { color: #EF4444; }

  .add-btn { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: var(--brand); cursor: pointer; background: none; border: 1.5px dashed #BFDBFE; border-radius: 9px; padding: 10px 16px; width: 100%; justify-content: center; transition: background 0.2s; }
  .add-btn:hover { background: var(--brand-light); }

  .level-select { display: flex; gap: 8px; flex-wrap: wrap; }
  .level-btn { padding: 6px 14px; border-radius: 999px; font-size: 12px; font-weight: 600; cursor: pointer; border: 1.5px solid #E2E8F0; background: #fff; color: #64748B; transition: all 0.15s; font-family: inherit; }
  .level-btn.selected { background: var(--brand); color: #fff; border-color: var(--brand); }

  .bottom-bar { max-width: 760px; margin: 0 auto; padding: 24px; display: flex; justify-content: space-between; align-items: center; }
  .btn-back { background: transparent; border: 1.5px solid #E2E8F0; color: #374151; padding: 12px 24px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.2s; }
  .btn-back:hover { border-color: var(--brand); color: var(--brand); }
  .btn-next { background: var(--brand); color: #fff; border: none; padding: 12px 32px; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; font-family: inherit; transition: all 0.2s; }
  .btn-next:hover { background: var(--brand-dark); }
  .hint { font-size: 12px; color: #94A3B8; margin-top: 5px; }
`;

function TagInput({ tags, setTags, placeholder, green = false }) {
  const [input, setInput] = useState("");
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      setTags([...tags, input.trim()]);
      setInput("");
    }
  };
  return (
    <div className="tag-input-wrap">
      {tags.map((tag, i) => (
        <span key={i} className={`pi-tag${green ? " green" : ""}`}>
          {tag}
          <button className="tag-remove" onClick={() => setTags(tags.filter((_, j) => j !== i))}>×</button>
        </span>
      ))}
      <input
        className="tag-type-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
    </div>
  );
}

function ProjectCard({ proj, index, onChange, onRemove }) {
  return (
    <div className="exp-card">
      <div className="exp-card-header">
        <span className="exp-card-title">프로젝트 {index + 1}</span>
        <button className="remove-btn" onClick={onRemove}>삭제</button>
      </div>
      <div className="form-row">
        <div>
          <label className="pi-label">프로젝트명</label>
          <input className="pi-input" placeholder="예: AI 취업 매칭 플랫폼" value={proj.name} onChange={(e) => onChange({ ...proj, name: e.target.value })} />
        </div>
        <div>
          <label className="pi-label">역할</label>
          <input className="pi-input" placeholder="예: 백엔드 개발, 팀장" value={proj.role} onChange={(e) => onChange({ ...proj, role: e.target.value })} />
        </div>
      </div>
      <div className="form-group">
        <label className="pi-label">기술 스택</label>
        <input className="pi-input" placeholder="예: Python, FastAPI, LangChain" value={proj.stack} onChange={(e) => onChange({ ...proj, stack: e.target.value })} />
      </div>
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="pi-label">주요 성과 / 설명</label>
        <textarea className="pi-textarea" placeholder="어떤 문제를 해결했는지, 어떤 성과를 냈는지 작성해주세요" value={proj.desc} onChange={(e) => onChange({ ...proj, desc: e.target.value })} />
      </div>
    </div>
  );
}

const ENG_LEVELS = ["없음", "기초", "비즈니스", "원어민 수준"];

export default function PortfolioInput() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState(["Python", "FastAPI", "React", "LangChain"]);
  const [aiSkills, setAiSkills] = useState(["LLM", "pgvector"]);
  const [engLevel, setEngLevel] = useState("비즈니스");
  const [projects, setProjects] = useState([{ name: "", role: "", stack: "", desc: "" }]);
  const [school, setSchool] = useState("");
  const [major, setMajor] = useState("");
  const [graduation, setGraduation] = useState("");
  const [gpa, setGpa] = useState("");
  const [jobTags, setJobTags] = useState(["백엔드 개발자"]);
  const [salary, setSalary] = useState("");
  const [intro, setIntro] = useState("");

  const addProject = () => {
    if (projects.length >= 5) return;
    setProjects([...projects, { name: "", role: "", stack: "", desc: "" }]);
  };

  const updateProject = (i, val) => setProjects(projects.map((p, j) => j === i ? val : p));
  const removeProject = (i) => setProjects(projects.filter((_, j) => j !== i));

  return (
    <>
      <style>{styles}</style>

      <nav className="pi-nav">
        <div className="pi-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Career<span>Match</span></div>
        <div className="step-bar">
          <div className="pi-step done"><div className="step-dot">✓</div>기본정보</div>
          <div className="step-line" />
          <div className="pi-step active"><div className="step-dot">2</div>포트폴리오</div>
          <div className="step-line" />
          <div className="pi-step"><div className="step-dot">3</div>매칭결과</div>
        </div>
      </nav>

      <main className="pi-main">
        <div className="page-title">포트폴리오를 입력해주세요</div>
        <p className="page-sub">보유 기술과 프로젝트 경험을 입력하면 AI가 분석해 최적의 공고를 찾아드립니다.</p>

        {/* 기술 스택 */}
        <div className="pi-section">
          <div className="section-title">
            <div className="section-icon icon-blue">⚡</div>
            기술 스택
          </div>
          <p className="section-desc">보유한 기술을 입력하고 Enter를 누르세요</p>

          <div className="form-group">
            <label className="pi-label">언어 / 프레임워크</label>
            <TagInput tags={skills} setTags={setSkills} placeholder="입력 후 Enter..." />
            <p className="hint">예: Python, Java, React, Spring Boot, Docker ...</p>
          </div>

          <div className="form-group">
            <label className="pi-label">AI / 데이터</label>
            <TagInput tags={aiSkills} setTags={setAiSkills} placeholder="입력 후 Enter..." green />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="pi-label">영어 실력</label>
            <div className="level-select">
              {ENG_LEVELS.map((lv) => (
                <button key={lv} className={`level-btn${engLevel === lv ? " selected" : ""}`} onClick={() => setEngLevel(lv)}>{lv}</button>
              ))}
            </div>
          </div>
        </div>

        {/* 프로젝트 */}
        <div className="pi-section">
          <div className="section-title">
            <div className="section-icon icon-purple">📁</div>
            프로젝트 경험
          </div>
          <p className="section-desc">대표 프로젝트를 추가하세요 (최대 5개)</p>

          {projects.map((proj, i) => (
            <ProjectCard key={i} proj={proj} index={i} onChange={(val) => updateProject(i, val)} onRemove={() => removeProject(i)} />
          ))}

          {projects.length < 5 && (
            <button className="add-btn" onClick={addProject}>+ 프로젝트 추가</button>
          )}
        </div>

        {/* 학력 */}
        <div className="pi-section">
          <div className="section-title">
            <div className="section-icon icon-green">🎓</div>
            학력 / 경력
          </div>
          <p className="section-desc">학교 또는 인턴/경력 정보를 입력하세요</p>

          <div className="form-row">
            <div>
              <label className="pi-label">학교명</label>
              <input className="pi-input" placeholder="예: 한국대학교" value={school} onChange={(e) => setSchool(e.target.value)} />
            </div>
            <div>
              <label className="pi-label">전공</label>
              <input className="pi-input" placeholder="예: 소프트웨어학과" value={major} onChange={(e) => setMajor(e.target.value)} />
            </div>
          </div>
          <div className="form-row" style={{ marginBottom: 0 }}>
            <div>
              <label className="pi-label">졸업 예정</label>
              <input className="pi-input" placeholder="예: 2025년 2월" value={graduation} onChange={(e) => setGraduation(e.target.value)} />
            </div>
            <div>
              <label className="pi-label">학점 (선택)</label>
              <input className="pi-input" placeholder="예: 3.8 / 4.5" value={gpa} onChange={(e) => setGpa(e.target.value)} />
            </div>
          </div>
        </div>

        {/* 희망 직무 */}
        <div className="pi-section">
          <div className="section-title">
            <div className="section-icon icon-blue">🎯</div>
            희망 직무
          </div>
          <p className="section-desc">어떤 포지션을 찾고 계신가요?</p>

          <div className="form-row">
            <div>
              <label className="pi-label">직군</label>
              <TagInput tags={jobTags} setTags={setJobTags} placeholder="입력 후 Enter..." />
            </div>
            <div>
              <label className="pi-label">희망 연봉 (선택)</label>
              <input className="pi-input" placeholder="예: 4000만원 이상" value={salary} onChange={(e) => setSalary(e.target.value)} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="pi-label">자기소개 (선택)</label>
            <textarea className="pi-textarea" style={{ minHeight: "72px" }} placeholder="간단한 자기소개를 입력하면 자소서 가이드의 품질이 높아집니다." value={intro} onChange={(e) => setIntro(e.target.value)} />
          </div>
        </div>
      </main>

      <div className="bottom-bar">
        <button className="btn-back" onClick={() => navigate('/')}>← 이전</button>
        <button className="btn-next" onClick={() => navigate('/result')}>AI 매칭 시작 →</button>
      </div>
    </>
  );
}
