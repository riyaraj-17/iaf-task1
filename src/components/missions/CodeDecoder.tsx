
import { useState } from "react";
import type { FormEvent } from "react";
import {
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  Lightbulb,
  RotateCcw,
  ShieldCheck,
  Terminal,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";
import "./CodeDecoder.css";

interface CodeDecoderProps {
  onComplete: () => void;
}

const challenges = [
  {
    level: "01",
    title: "THE FIRST SIGNAL",
    encrypted: "FUBSWRJUDSKB",
    answer: "CRYPTOGRAPHY",
    hint: "Every letter has been shifted three places forward.",
    objective: "Decode the hidden cybersecurity keyword.",
  },
  {
    level: "02",
    title: "SECURE TRANSMISSION",
    encrypted: "VHFXULWB",
    answer: "SECURITY",
    hint: "Reverse the Caesar shift by moving each letter three places backward.",
    objective: "Recover the security-related keyword.",
  },
  {
    level: "03",
    title: "FINAL TRANSMISSION",
    encrypted: "PHHW PH DW PLGQLJKW",
    answer: "MEET ME AT MIDNIGHT",
    hint: "Spaces are preserved. Decode each letter using the same three-place shift.",
    objective: "Decode the complete secret message.",
  },
];

export default function CodeDecoder({ onComplete }: CodeDecoderProps) {
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [completed, setCompleted] = useState(false);

  const challenge = challenges[current];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalized = answer.trim().replace(/\s+/g, " ").toUpperCase();

    if (!normalized) {
      setFeedback("ENTER YOUR DECODED MESSAGE FIRST.");
      return;
    }

    if (normalized === challenge.answer) {
      setFeedback("ACCESS GRANTED // MESSAGE DECODED.");

      if (current === challenges.length - 1) {
        setCompleted(true);
        onComplete();
      } else {
        setCurrent((previous) => previous + 1);
        setAnswer("");
        setAttempts(0);
        setShowHint(false);
      }
    } else {
      setAttempts((previous) => previous + 1);
      setFeedback("INCORRECT MESSAGE // TRY AGAIN.");
    }
  };

  const restartGame = () => {
    setCurrent(0);
    setAnswer("");
    setAttempts(0);
    setShowHint(false);
    setFeedback("");
    setCompleted(false);
  };

  return (
    <div className="code-decoder-page">
      {/* 3D BACKGROUND */}
      <div className="decoder-3d-scene" aria-hidden="true">
        <div className="decoder-grid" />
        <div className="decoder-orb decoder-orb-one" />
        <div className="decoder-orb decoder-orb-two" />

        <div className="decoder-holo-ring ring-one" />
        <div className="decoder-holo-ring ring-two" />
        <div className="decoder-holo-ring ring-three" />

        <div className="decoder-particles">
          {Array.from({ length: 22 }).map((_, index) => (
            <span
              key={index}
              style={{
                left: `${(index * 37 + 11) % 100}%`,
                top: `${(index * 53 + 7) % 100}%`,
                animationDelay: `${(index % 7) * -0.8}s`,
                animationDuration: `${5 + (index % 5)}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* GAME CONTENT */}
      {completed ? (
        <section className="decoder-game decoder-complete">
          <div className="decoder-success-icon">
            <Trophy size={38} />
          </div>

          <p className="decoder-eyebrow">MISSION ACCOMPLISHED</p>
          <h2>CODE <span>CRACKED.</span></h2>

          <p className="decoder-description">
            All encrypted transmissions successfully decoded.
            Your performance has been recorded.
          </p>

          <div className="decoder-reward">
            <Zap size={22} />
            <div>
              <strong>+400 XP</strong>
              <span>EXPERIENCE REWARD</span>
            </div>
          </div>

          <div className="decoder-complete-label">
            <CheckCircle2 size={17} />
            ALL 03 CHALLENGES COMPLETED
          </div>

          <button className="decoder-secondary" onClick={restartGame}>
            <RotateCcw size={15} /> PLAY AGAIN
          </button>

          <p className="decoder-note">
            REPLAYING DOES NOT AWARD ADDITIONAL XP.
          </p>
        </section>
      ) : (
        <section className="decoder-game">
          <div className="decoder-top">
            <div className="decoder-game-label">
              <Terminal size={17} />
              ENCRYPTION TERMINAL
            </div>

            <span className="decoder-status">
              <span /> SYSTEM ACTIVE
            </span>
          </div>

          <div className="decoder-progress">
            {challenges.map((item, index) => (
              <div
                key={item.level}
                className={`decoder-progress-step ${
                  index < current
                    ? "done"
                    : index === current
                    ? "current"
                    : ""
                }`}
              >
                <span>{index < current ? "✓" : item.level}</span>
                <div />
              </div>
            ))}
          </div>

          <div className="decoder-challenge-heading">
            <div>
              <p className="decoder-eyebrow">
                CHALLENGE {challenge.level} / 03
              </p>
              <h3>{challenge.title}</h3>
            </div>
            <LockKeyhole size={25} />
          </div>

          <div className="decoder-objective">
            <ShieldCheck size={17} />
            <span>{challenge.objective}</span>
          </div>

          <div className="decoder-cipher-box">
            <span>INTERCEPTED MESSAGE // ENCRYPTED</span>
            <strong>{challenge.encrypted}</strong>
            <small>CAESAR CIPHER // SHIFT UNKNOWN</small>
          </div>

          <form onSubmit={handleSubmit} className="decoder-form">
            <label htmlFor="decoder-answer">
              ENTER DECRYPTED MESSAGE
            </label>

            <input
              id="decoder-answer"
              type="text"
              value={answer}
              onChange={(event) => {
                setAnswer(event.target.value);
                setFeedback("");
              }}
              placeholder="TYPE YOUR ANSWER..."
              autoComplete="off"
              spellCheck={false}
            />

            <button type="submit" className="decoder-submit">
              DECRYPT MESSAGE <ArrowRight size={17} />
            </button>
          </form>

          {feedback && (
            <div
              className={`decoder-feedback ${
                feedback.startsWith("ACCESS") ? "correct" : "incorrect"
              }`}
            >
              {feedback.startsWith("ACCESS") ? (
                <CheckCircle2 size={16} />
              ) : (
                <XCircle size={16} />
              )}
              {feedback}
            </div>
          )}

          <div className="decoder-hint-area">
            <button
              type="button"
              className="decoder-hint-button"
              onClick={() => setShowHint((previous) => !previous)}
            >
              <Lightbulb size={16} />
              {showHint ? "HIDE HINT" : "REQUEST HINT"}
            </button>

            {showHint && (
              <div className="decoder-hint">
                <strong>INTELLIGENCE TIP</strong>
                <p>{challenge.hint}</p>
              </div>
            )}
          </div>

          <div className="decoder-footer">
            <span>ATTEMPTS: {attempts}</span>
            <span>REWARD: +400 XP</span>
          </div>
        </section>
      )}
    </div>
  );
}
