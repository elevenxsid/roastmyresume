import { useState, useRef } from "react";

const ROAST_LEVELS = [
  { id: "mild", label: "😅 Mild", desc: "Gentle nudges" },
  { id: "spicy", label: "🌶️ Spicy", desc: "Brutally honest" },
  { id: "savage", label: "🔥 Savage", desc: "No mercy" },
];

const DEMO_ROAST = `Alright, let's talk about this... interesting document you've submitted as a "resume."

**The Objective Section** — "Seeking a challenging position to utilize my skills." Congratulations, you've written the exact same objective as 4.7 million other freshers. Points for conformity, I suppose.

**Skills Section** — MS Office is listed as a skill. Sir, this is 2025. Listing MS Office is like listing "can breathe air" as a talent. And "good communication skills" — ironic, since this resume is not communicating anything useful.

**Projects** — "College Management System using HTML and CSS." One question: does it manage colleges, or does it manage to confuse the recruiter into skipping you? The answer is both.

**The Photo** — The passport-sized photo in the corner where you look like you're applying for a visa to get hired... recruiters in 2025 are not looking for your face. They're looking for your GitHub.

**Verdict**: This resume is in witness protection — nobody is finding it. But the bones are there. Fix the objective, kill the photo, add numbers to your achievements, and for the love of all things holy, add a LinkedIn. You've got potential. The resume just hasn't heard about it yet. 💀`;

export default function RoastMyResume() {
  const [step, setStep] = useState("landing"); // landing | upload | roasting | result | paywall
  const [roastLevel, setRoastLevel] = useState("spicy");
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("");
  const [roastResult, setRoastResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const [copied, setCopied] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setResumeText(e.target.result);
    reader.readAsText(file);
    setStep("upload");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const callRoastAPI = async () => {
    setLoading(true);
    setStep("roasting");

    const levelInstructions = {
      mild: "Be gently humorous and constructive. Point out flaws with warmth and encouragement.",
      spicy: "Be brutally honest with sharp humor. Don't spare feelings but keep it insightful.",
      savage: "Absolutely roast this resume with savage comedy. Be merciless, funny, and devastatingly accurate. Channel Gordon Ramsay reviewing a bad dish.",
    };

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are RoastBot — a brutally funny resume roaster for Indian job seekers. You roast resumes with sharp wit, pop culture references, and genuinely useful career advice hidden inside the jokes. You know the Indian job market deeply — TCS, Infosys, fresher culture, MBA rage, "good at MS Office", etc. Always end with 3 actual actionable tips labeled "Redemption Arc:" ${levelInstructions[roastLevel]} Format with bold headers using **text** syntax. Keep it under 350 words.`,
          messages: [
            {
              role: "user",
              content: resumeText
                ? `Roast this resume at ${roastLevel} level:\n\n${resumeText.slice(0, 3000)}`
                : `Roast a generic Indian fresher resume (Computer Science, no real projects, lists MS Office as skill, has an objective statement, has a passport photo). Level: ${roastLevel}`,
            },
          ],
        }),
      });

      const data = await response.json();
      const text = data.content?.find((b) => b.type === "text")?.text || DEMO_ROAST;
      setRoastResult(text);
      setStep("result");
    } catch {
      setRoastResult(DEMO_ROAST);
      setStep("result");
    } finally {
      setLoading(false);
    }
  };

  const formatRoast = (text) => {
    return text.split("\n").map((line, i) => {
      const bold = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
      return <p key={i} className="roast-line" dangerouslySetInnerHTML={{ __html: bold }} />;
    });
  };

  const copyRoast = () => {
    navigator.clipboard.writeText(roastResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --fire: #FF4500;
          --ember: #FF8C00;
          --ash: #1a1a1a;
          --smoke: #2d2d2d;
          --paper: #F5F0E8;
          --cream: #FFF8F0;
          --char: #111;
        }

        body { background: var(--ash); font-family: 'DM Sans', sans-serif; }

        .app {
          min-height: 100vh;
          background: var(--ash);
          color: var(--paper);
          position: relative;
          overflow: hidden;
        }

        /* Animated fire bg */
        .fire-bg {
          position: fixed;
          inset: 0;
          background: radial-gradient(ellipse at 50% 120%, rgba(255,69,0,0.15) 0%, transparent 60%),
                      radial-gradient(ellipse at 20% 80%, rgba(255,140,0,0.08) 0%, transparent 40%),
                      radial-gradient(ellipse at 80% 90%, rgba(255,69,0,0.08) 0%, transparent 40%);
          pointer-events: none;
          animation: flicker 4s ease-in-out infinite alternate;
        }

        @keyframes flicker {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.8; }
        }

        .container {
          position: relative;
          z-index: 1;
          max-width: 680px;
          margin: 0 auto;
          padding: 40px 20px 80px;
        }

        /* HEADER */
        .header { text-align: center; margin-bottom: 48px; }

        .badge {
          display: inline-block;
          background: rgba(255,69,0,0.15);
          border: 1px solid rgba(255,69,0,0.4);
          color: var(--ember);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 6px 16px;
          border-radius: 100px;
          margin-bottom: 20px;
        }

        .logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(52px, 12vw, 88px);
          line-height: 0.9;
          background: linear-gradient(135deg, #FF4500 0%, #FF8C00 50%, #FFD700 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 2px;
          text-shadow: none;
          filter: drop-shadow(0 0 30px rgba(255,69,0,0.4));
        }

        .tagline {
          font-size: 16px;
          color: rgba(245,240,232,0.6);
          margin-top: 12px;
          font-style: italic;
        }

        .price-pill {
          display: inline-block;
          background: linear-gradient(135deg, var(--fire), var(--ember));
          color: white;
          font-weight: 700;
          font-size: 13px;
          padding: 5px 14px;
          border-radius: 100px;
          margin-top: 14px;
        }

        /* CARD */
        .card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 32px;
          backdrop-filter: blur(10px);
          margin-bottom: 20px;
          transition: all 0.3s ease;
        }

        .section-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          letter-spacing: 1.5px;
          color: var(--ember);
          margin-bottom: 16px;
        }

        /* ROAST LEVEL */
        .level-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 24px;
        }

        .level-btn {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          padding: 14px 8px;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s ease;
          color: var(--paper);
        }

        .level-btn:hover {
          border-color: var(--fire);
          background: rgba(255,69,0,0.08);
        }

        .level-btn.active {
          border-color: var(--fire);
          background: rgba(255,69,0,0.15);
          box-shadow: 0 0 20px rgba(255,69,0,0.2);
        }

        .level-emoji { font-size: 24px; display: block; margin-bottom: 6px; }
        .level-name { font-weight: 600; font-size: 13px; }
        .level-desc { font-size: 11px; color: rgba(245,240,232,0.5); margin-top: 2px; }

        /* DROP ZONE */
        .drop-zone {
          border: 2px dashed rgba(255,140,0,0.3);
          border-radius: 16px;
          padding: 40px 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-bottom: 16px;
        }

        .drop-zone:hover, .drop-zone.drag-over {
          border-color: var(--fire);
          background: rgba(255,69,0,0.06);
        }

        .drop-icon { font-size: 40px; margin-bottom: 12px; }
        .drop-title { font-weight: 600; font-size: 16px; color: var(--paper); }
        .drop-sub { font-size: 13px; color: rgba(245,240,232,0.45); margin-top: 6px; }

        .file-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,140,0,0.1);
          border: 1px solid rgba(255,140,0,0.3);
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 13px;
          color: var(--ember);
          margin-bottom: 16px;
        }

        /* TEXTAREA */
        .paste-area {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 14px;
          color: var(--paper);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          resize: vertical;
          outline: none;
          transition: border-color 0.2s;
          min-height: 80px;
        }

        .paste-area:focus { border-color: rgba(255,140,0,0.4); }
        .paste-area::placeholder { color: rgba(245,240,232,0.3); }

        /* BUTTON */
        .cta-btn {
          width: 100%;
          background: linear-gradient(135deg, #FF4500, #FF8C00);
          border: none;
          border-radius: 14px;
          padding: 18px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          letter-spacing: 2px;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 30px rgba(255,69,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 40px rgba(255,69,0,0.5);
        }

        .cta-btn:active { transform: translateY(0); }
        .cta-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        .sec-btn {
          width: 100%;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 14px;
          padding: 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          color: rgba(245,240,232,0.6);
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 10px;
        }

        .sec-btn:hover {
          border-color: rgba(255,255,255,0.3);
          color: var(--paper);
        }

        /* LOADING */
        .loading-screen {
          text-align: center;
          padding: 60px 20px;
        }

        .fire-loader {
          font-size: 64px;
          animation: burn 0.8s ease-in-out infinite alternate;
          display: block;
          margin-bottom: 24px;
        }

        @keyframes burn {
          0% { transform: scale(1) rotate(-3deg); filter: brightness(1); }
          100% { transform: scale(1.1) rotate(3deg); filter: brightness(1.3); }
        }

        .loading-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 32px;
          letter-spacing: 2px;
          color: var(--ember);
          margin-bottom: 8px;
        }

        .loading-sub {
          font-size: 14px;
          color: rgba(245,240,232,0.5);
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        /* RESULT */
        .roast-card {
          background: rgba(255,69,0,0.05);
          border: 1px solid rgba(255,69,0,0.2);
          border-radius: 16px;
          padding: 28px;
          margin-bottom: 20px;
          position: relative;
          overflow: hidden;
        }

        .roast-card::before {
          content: '🔥';
          position: absolute;
          top: -10px;
          right: -10px;
          font-size: 80px;
          opacity: 0.06;
        }

        .roast-line {
          font-size: 14px;
          line-height: 1.7;
          color: rgba(245,240,232,0.85);
          margin-bottom: 8px;
        }

        .roast-line strong {
          color: var(--ember);
          font-weight: 600;
        }

        .action-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-top: 20px;
        }

        .action-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          padding: 14px;
          color: var(--paper);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .action-btn:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.25);
        }

        .action-btn.primary {
          background: rgba(255,69,0,0.15);
          border-color: rgba(255,69,0,0.4);
          color: var(--ember);
        }

        /* PAYWALL */
        .paywall {
          background: linear-gradient(135deg, rgba(255,69,0,0.1), rgba(255,140,0,0.08));
          border: 1px solid rgba(255,140,0,0.3);
          border-radius: 20px;
          padding: 32px;
          text-align: center;
        }

        .paywall-emoji { font-size: 48px; margin-bottom: 16px; display: block; }
        .paywall-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          letter-spacing: 1.5px;
          color: var(--paper);
          margin-bottom: 8px;
        }
        .paywall-sub { font-size: 14px; color: rgba(245,240,232,0.6); margin-bottom: 24px; }

        .price-display {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 56px;
          background: linear-gradient(135deg, var(--fire), var(--ember));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
          margin-bottom: 4px;
        }

        .price-note { font-size: 12px; color: rgba(245,240,232,0.4); margin-bottom: 24px; }

        /* SOCIAL PROOF */
        .social-proof {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 13px;
          color: rgba(245,240,232,0.5);
          margin-top: 20px;
        }

        .avatars { display: flex; }
        .avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid var(--ash);
          background: linear-gradient(135deg, var(--fire), var(--ember));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          margin-left: -8px;
          color: white;
          font-weight: 700;
        }

        .avatar:first-child { margin-left: 0; }

        /* SHARE STRIP */
        .share-strip {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .share-text { font-size: 13px; color: rgba(245,240,232,0.6); }
        .share-text strong { color: var(--paper); }

        .share-btns { display: flex; gap: 8px; }

        .share-btn {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 8px 14px;
          font-size: 12px;
          font-weight: 600;
          color: var(--paper);
          cursor: pointer;
          transition: all 0.2s;
        }

        .share-btn:hover { background: rgba(255,255,255,0.12); }

        /* BLUR OVERLAY for paywall preview */
        .blurred { filter: blur(6px); pointer-events: none; user-select: none; }

        .divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.07);
          margin: 24px 0;
        }

        input[type="file"] { display: none; }

        @media (max-width: 480px) {
          .level-grid { grid-template-columns: repeat(3,1fr); gap: 8px; }
          .card { padding: 20px; }
          .action-row { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="app">
        <div className="fire-bg" />
        <div className="container">

          {/* HEADER */}
          <header className="header">
            <div className="badge">🔥 India's #1 Resume Roaster</div>
            <div className="logo">ROASTMY<br />RESUME</div>
            <p className="tagline">Your resume is bad. We'll tell you exactly why. Hilariously.</p>
            <div className="price-pill">₹49 only · Instant · Brutally Honest</div>
          </header>

          {/* LANDING */}
          {step === "landing" && (
            <>
              <div className="card">
                <div className="section-title">CHOOSE YOUR SUFFERING</div>
                <div className="level-grid">
                  {ROAST_LEVELS.map((l) => (
                    <button
                      key={l.id}
                      className={`level-btn ${roastLevel === l.id ? "active" : ""}`}
                      onClick={() => setRoastLevel(l.id)}
                    >
                      <span className="level-emoji">{l.label.split(" ")[0]}</span>
                      <div className="level-name">{l.label.split(" ").slice(1).join(" ")}</div>
                      <div className="level-desc">{l.desc}</div>
                    </button>
                  ))}
                </div>

                <input
                  type="file"
                  ref={fileRef}
                  accept=".txt,.pdf,.doc,.docx"
                  onChange={(e) => handleFile(e.target.files[0])}
                />

                <div
                  className={`drop-zone ${dragOver ? "drag-over" : ""}`}
                  onClick={() => fileRef.current.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >
                  <div className="drop-icon">📄</div>
                  <div className="drop-title">Drop your resume here</div>
                  <div className="drop-sub">PDF, DOC, TXT · or paste text below</div>
                </div>

                <textarea
                  className="paste-area"
                  placeholder="...or paste your resume text directly here (name, skills, experience, etc.)"
                  value={resumeText}
                  onChange={(e) => { setResumeText(e.target.value); if (e.target.value) setStep("upload"); }}
                  rows={3}
                />
              </div>

              <button className="cta-btn" onClick={() => setStep("upload")}>
                <span>🔥</span> ROAST MY RESUME
              </button>

              <div className="social-proof" style={{marginTop: 20}}>
                <div className="avatars">
                  {["R","P","A","S","K"].map((l,i) => <div key={i} className="avatar">{l}</div>)}
                </div>
                <span>2,847 resumes roasted this week</span>
              </div>
            </>
          )}

          {/* UPLOAD/CONFIRM STEP */}
          {step === "upload" && (
            <>
              <div className="card">
                <div className="section-title">READY TO BURN?</div>

                {fileName && (
                  <div className="file-chip">📎 {fileName}</div>
                )}

                <textarea
                  className="paste-area"
                  placeholder="Paste your resume text here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  rows={6}
                />

                <hr className="divider" />

                <div className="section-title" style={{fontSize: 16, marginBottom: 10}}>ROAST LEVEL</div>
                <div className="level-grid">
                  {ROAST_LEVELS.map((l) => (
                    <button
                      key={l.id}
                      className={`level-btn ${roastLevel === l.id ? "active" : ""}`}
                      onClick={() => setRoastLevel(l.id)}
                    >
                      <span className="level-emoji">{l.label.split(" ")[0]}</span>
                      <div className="level-name">{l.label.split(" ").slice(1).join(" ")}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button className="cta-btn" onClick={callRoastAPI}>
                <span>🔥</span> ROAST IT NOW
              </button>
              <button className="sec-btn" onClick={() => setStep("landing")}>← Back</button>
            </>
          )}

          {/* ROASTING SCREEN */}
          {step === "roasting" && (
            <div className="loading-screen">
              <span className="fire-loader">🔥</span>
              <div className="loading-title">ROASTING IN PROGRESS...</div>
              <p className="loading-sub">Our AI is reading your "skills" section. It's crying.</p>
            </div>
          )}

          {/* RESULT */}
          {step === "result" && (
            <>
              <div className="card" style={{marginBottom: 16}}>
                <div className="section-title">THE VERDICT IS IN 💀</div>

                {paid ? (
                  <div className="roast-card">
                    {formatRoast(roastResult)}
                  </div>
                ) : (
                  <>
                    {/* Free preview - first ~200 chars */}
                    <div className="roast-card">
                      {formatRoast(roastResult.slice(0, 280) + "...")}
                    </div>

                    <div className="paywall">
                      <span className="paywall-emoji">🔒</span>
                      <div className="paywall-title">UNLOCK FULL ROAST</div>
                      <p className="paywall-sub">The spiciest parts are still cooking. Pay ₹49 to see the complete roast + your 3-point Redemption Arc to fix your resume.</p>
                      <div className="price-display">₹49</div>
                      <p className="price-note">One-time · Instant access · No subscription</p>
                      <button className="cta-btn" onClick={() => setPaid(true)}>
                        💳 Pay ₹49 & Unlock Full Roast
                      </button>
                      <p style={{fontSize: 11, color: "rgba(245,240,232,0.3)", marginTop: 12}}>
                        UPI · Cards · Net Banking · Wallets
                      </p>
                    </div>
                  </>
                )}

                {paid && (
                  <div className="action-row">
                    <button className="action-btn primary" onClick={copyRoast}>
                      {copied ? "✅ Copied!" : "📋 Copy Roast"}
                    </button>
                    <button className="action-btn" onClick={() => { setStep("landing"); setResumeText(""); setFileName(""); setPaid(false); }}>
                      🔄 Roast Again
                    </button>
                  </div>
                )}
              </div>

              {paid && (
                <div className="share-strip">
                  <div className="share-text">
                    <strong>Got roasted?</strong> Share the pain 😂
                  </div>
                  <div className="share-btns">
                    <button className="share-btn">🐦 X</button>
                    <button className="share-btn">📸 Insta</button>
                    <button className="share-btn">💬 WhatsApp</button>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </>
  );
}
