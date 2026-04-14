import { useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;600;700;800&family=Noto+Sans+KR:wght@400;500;700&display=swap');

  * { box-sizing: border-box; }

  :root {
    --bg: #f8fafc;
    --panel: rgba(255,255,255,0.88);
    --ink: #0f172a;
    --muted: #64748b;
    --line: rgba(15, 23, 42, 0.08);
    --brand: #111827;
    --accent: #2563eb;
    --soft-blue: rgba(37,99,235,0.08);
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
    width: min(1240px, calc(100% - 48px));
    margin: 0 auto;
    padding: 56px 0 72px;
  }
  .hero {
    display: grid;
    gap: 34px;
    align-items: start;
  }
  .hero-copy {
    width: 100%;
    max-width: 720px;
  }
  .eyebrow {
    width: fit-content;
    border-radius: 999px;
    background: var(--soft-blue);
    color: var(--accent);
    padding: 8px 12px;
    font-size: 12px;
    font-weight: 800;
    margin-bottom: 16px;
  }
  h1 {
    margin: 0 0 14px;
    font-family: 'Manrope', sans-serif;
    font-size: clamp(36px, 5vw, 58px);
    line-height: 1.03;
    letter-spacing: -0.06em;
  }
  h1 em {
    font-style: normal;
    color: var(--accent);
  }
  .copy {
    margin: 0;
    max-width: 560px;
    color: var(--muted);
    font-size: 16px;
    line-height: 1.75;
  }
  .actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 24px;
    justify-content: center;
  }
  .prompt-shell {
    display: grid;
    gap: 28px;
    width: min(820px, 100%);
  }
  .prompt-card, .mini-card {
    border: 0;
    border-radius: 0;
    background: transparent;
    padding: 0;
  }
  .prompt-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;
    text-align: left;
  }
  .prompt-head strong {
    font-family: 'Manrope', sans-serif;
    font-size: 20px;
    letter-spacing: -0.04em;
  }
  .prompt-head span, .mini-card span {
    color: var(--muted);
    font-size: 13px;
    line-height: 1.7;
  }
  .prompt-box {
    width: 100%;
    min-height: 180px;
    border: 1px solid rgba(15,23,42,0.08);
    outline: 0;
    resize: none;
    border-radius: 28px;
    background: rgba(255,255,255,0.78);
    box-shadow: 0 20px 60px rgba(15, 23, 42, 0.06);
    color: var(--ink);
    font: inherit;
    font-size: 16px;
    line-height: 1.75;
    padding: 22px 24px;
  }
  .prompt-box::placeholder {
    color: #94a3b8;
  }
  .prompt-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    margin-top: 18px;
  }
  .prompt-chips {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .chip {
    border-radius: 999px;
    border: 1px solid rgba(37,99,235,0.12);
    background: var(--soft-blue);
    color: var(--accent);
    padding: 8px 10px;
    font-size: 12px;
    font-weight: 800;
    cursor: pointer;
  }
  .prompt-hint {
    color: var(--muted);
    font-size: 13px;
    text-align: center;
    margin-top: 14px;
  }
  .mini-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
    padding-top: 22px;
    text-align: left;
  }
  .mini-card strong {
    display: block;
    margin-bottom: 8px;
    font-size: 15px;
  }
  .mini-card {
    padding-top: 18px;
    border-top: 1px solid rgba(15,23,42,0.08);
  }

  @media (max-width: 900px) {
    .nav {
      padding: 16px 18px;
    }
    .container {
      width: min(100%, calc(100% - 24px));
    }
    .hero {
      grid-template-columns: 1fr;
      gap: 28px;
    }
    .mini-grid {
      grid-template-columns: 1fr;
    }
    .nav-actions {
      display: none;
    }
  }
`;

const points = [
  {
    title: "실데이터",
    copy: "고용24 기반으로 바로 확인",
  },
  {
    title: "맞춤 추천",
    copy: "내 준비 상태에 맞게 정렬",
  },
  {
    title: "바로 탐색",
    copy: "목록과 추천을 빠르게 오가기",
  },
];

const quickPrompts = [
  "온라인 위주로 들을 수 있는 프로그램",
  "사무행정과 문서작성 역량을 키우고 싶어요",
  "취업 공백이 길어서 면접 준비도 필요해요",
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");

  const handlePromptStart = () => {
    if (prompt.trim()) {
      window.sessionStorage.setItem("careermatch_prompt_draft", prompt.trim());
    } else {
      window.sessionStorage.removeItem("careermatch_prompt_draft");
    }
    navigate("/portfolio");
  };

  return (
    <div className="page">
      <style>{styles}</style>

      <nav className="nav">
        <div className="logo" onClick={() => navigate("/")}>
          Career<span>Match</span>
        </div>
        <div className="nav-actions">
          <button className="btn" onClick={() => navigate("/programs")}>
            프로그램 목록
          </button>
          <button className="btn primary" onClick={handlePromptStart}>
            추천 받기
          </button>
        </div>
      </nav>

      <main className="container">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">CareerMatch</div>
            <h1>내게 맞는 <em>훈련과정과 프로그램</em></h1>
            <p className="copy">
              고용24 실데이터를 바탕으로 지금 단계에 맞는 학습과 취업 준비 경로를 추천합니다.
            </p>
          </div>

          <div className="prompt-shell">
            <div className="prompt-card">
              <div className="prompt-head">
                <strong>원하는 조건을 먼저 적어보세요</strong>
              </div>
              <textarea
                className="prompt-box"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="예: 온라인 위주로 들을 수 있고, 사무행정과 문서작성 역량을 키우고 싶어요. 면접 준비도 함께 되면 좋겠습니다."
              />
              <div className="prompt-footer">
                <div className="prompt-chips">
                  {quickPrompts.map((item) => (
                    <button type="button" className="chip" key={item} onClick={() => setPrompt(item)}>
                      {item}
                    </button>
                  ))}
                </div>
                <button className="btn primary" onClick={handlePromptStart}>
                  이 조건으로 시작
                </button>
              </div>
              <div className="prompt-hint">입력한 문장은 다음 단계에서 참고용으로 이어집니다.</div>
            </div>
            <div className="mini-grid">
              {points.map((point) => (
                <div className="mini-card" key={point.title}>
                  <strong>{point.title}</strong>
                  <span>{point.copy}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
