
import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Eye,
  Mail,
  ShieldCheck,
  ShieldAlert,
  Target,
  Zap,
} from "lucide-react";
import "./PhishingDetective.css";

interface PhishingDetectiveProps {
  onComplete: () => void;
}

interface EmailCase {
  sender: string;
  subject: string;
  preview: string;
  message: string;
  link?: string;
  isPhishing: boolean;
  clues: string[];
  explanation: string;
}

const cases: EmailCase[] = [
  {
    sender: "security@paypa1-support.com",
    subject: "URGENT: Your account will be suspended!",
    preview: "Immediate action required to protect your account.",
    message:
      "Dear Customer, we detected suspicious activity on your account. Your account will be permanently suspended in 24 hours. Verify your identity immediately using the link below.",
    link: "http://paypa1-verify.example.com",
    isPhishing: true,
    clues: [
      "The sender uses a misspelled domain: paypa1 instead of paypal.",
      "The email creates urgency and threatens account suspension.",
      "The link uses HTTP instead of HTTPS.",
    ],
    explanation:
      "This is a phishing attempt. Attackers use lookalike domains and urgent threats to trick users into revealing login credentials.",
  },
  {
    sender: "notifications@github.com",
    subject: "Your weekly GitHub activity summary",
    preview: "Here is what happened in your repositories this week.",
    message:
      "Hello! Your weekly activity report is ready. Review your recent contributions, pull requests and repository updates by visiting your GitHub dashboard directly.",
    isPhishing: false,
    clues: [
      "The sender domain matches the official GitHub domain.",
      "The email does not demand sensitive information.",
      "It directs you to access your dashboard normally.",
    ],
    explanation:
      "This is a legitimate-looking notification. Still, always verify the sender and navigate to important accounts directly rather than trusting unexpected links.",
  },
  {
    sender: "hr@company-careers.example.com",
    subject: "Congratulations! You have won a free laptop!",
    preview: "Claim your reward before it expires in 10 minutes.",
    message:
      "Congratulations! You have been specially selected for a free premium laptop. To claim your prize, enter your employee ID, password and banking details using the reward portal.",
    link: "http://free-gift.example.com/claim",
    isPhishing: true,
    clues: [
      "An unexpected prize is used as bait.",
      "The message asks for passwords and banking details.",
      "It pressures you with a short deadline.",
    ],
    explanation:
      "This is a phishing attempt using a fake reward. Legitimate organizations should never ask for your password or banking details to claim a promotional gift.",
  },
  {
    sender: "no-reply@accounts.google.com",
    subject: "New sign-in on your Google Account",
    preview: "Your account was accessed from a new device.",
    message:
      "We noticed a sign-in to your account from a new device. If this was you, no action is needed. If you do not recognize this activity, open your Google Account security settings directly to review your devices.",
    isPhishing: false,
    clues: [
      "The sender uses the official-looking accounts.google.com domain.",
      "The email does not request your password.",
      "It recommends checking account settings directly.",
    ],
    explanation:
      "This is designed as a legitimate security notification. In real situations, verify the sender and visit the official website yourself instead of relying on an email link.",
  },
];

const PhishingDetective = ({
  onComplete,
}: PhishingDetectiveProps) => {
  const [currentCase, setCurrentCase] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<
    boolean | null
  >(null);
  const [submitted, setSubmitted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [showClues, setShowClues] = useState(false);

  const activeCase = cases[currentCase];
  const correct = selectedAnswer === activeCase.isPhishing;

  const submitAnswer = () => {
    if (selectedAnswer === null || submitted) return;

    setSubmitted(true);

    if (correct) {
      setScore((previous) => previous + 1);
    }
  };

  const nextCase = () => {
    if (currentCase === cases.length - 1) {
      setFinished(true);
      onComplete();
      return;
    }

    setCurrentCase((previous) => previous + 1);
    setSelectedAnswer(null);
    setSubmitted(false);
    setShowClues(false);
  };

  const restartGame = () => {
    setCurrentCase(0);
    setScore(0);
    setSelectedAnswer(null);
    setSubmitted(false);
    setFinished(false);
    setShowClues(false);
  };

  if (finished) {
    const percentage = Math.round((score / cases.length) * 100);

    return (
      <div className="phishing-game">
        <div className="phishing-result">
          <div className="phishing-result-icon">
            <ShieldCheck size={42} />
          </div>

          <p className="phishing-eyebrow">
            INVESTIGATION COMPLETE
          </p>

          <h2>CASE FILE CLOSED.</h2>

          <div className="phishing-score">
            {score}<span>/{cases.length}</span>
          </div>

          <p className="phishing-result-message">
            {percentage === 100
              ? "PERFECT DETECTION. YOU MISSED NOTHING."
              : percentage >= 50
                ? "GOOD WORK, AGENT. KEEP SHARPENING YOUR SKILLS."
                : "INVESTIGATION NEEDS IMPROVEMENT. TRAIN AGAIN."}
          </p>

          <div className="phishing-result-stat">
            <span>ACCURACY</span>
            <strong>{percentage}%</strong>
          </div>

          <button
            className="phishing-primary-button"
            onClick={restartGame}
          >
            <Target size={16} />
            REPLAY INVESTIGATION
          </button>

          <p className="phishing-complete-note">
            GAME COMPLETED // XP REWARD PROCESSED
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="phishing-game">
      <div className="phishing-game-header">
        <div>
          <p className="phishing-eyebrow">
            <span className="phishing-live-dot" />
            LIVE INVESTIGATION
          </p>

          <h2>PHISHING DETECTIVE</h2>

          <p>Inspect the evidence. Identify the threat.</p>
        </div>

        <div className="phishing-score-chip">
          <Zap size={15} />
          SCORE: {score}
        </div>
      </div>

      <div className="phishing-progress">
        {cases.map((_, index) => (
          <div
            key={index}
            className={`phishing-progress-segment ${
              index < currentCase
                ? "done"
                : index === currentCase
                  ? "active"
                  : ""
            }`}
          />
        ))}
      </div>

      <div className="phishing-case-label">
        <span>CASE FILE 0{currentCase + 1}</span>
        <span>
          {currentCase + 1} / {cases.length}
        </span>
      </div>

      <section className="phishing-email">
        <div className="phishing-email-top">
          <div className="phishing-email-icon">
            <Mail size={21} />
          </div>

          <div>
            <span>INCOMING MESSAGE</span>
            <strong>EMAIL INVESTIGATION</strong>
          </div>

          <Eye size={19} className="phishing-eye-icon" />
        </div>

        <div className="phishing-email-details">
          <div>
            <span>FROM</span>
            <strong>{activeCase.sender}</strong>
          </div>

          <div>
            <span>SUBJECT</span>
            <strong>{activeCase.subject}</strong>
          </div>

          <div>
            <span>PREVIEW</span>
            <p>{activeCase.preview}</p>
          </div>
        </div>

        <div className="phishing-email-body">
          {activeCase.message}

          {activeCase.link && (
            <div className="phishing-link">
              <AlertTriangle size={14} />
              <span>{activeCase.link}</span>
            </div>
          )}
        </div>
      </section>

      <button
        className="phishing-clue-button"
        onClick={() => setShowClues((previous) => !previous)}
      >
        <Eye size={16} />
        {showClues ? "HIDE INVESTIGATION NOTES" : "VIEW INVESTIGATION NOTES"}
      </button>

      {showClues && (
        <div className="phishing-clues">
          <p>INVESTIGATION NOTES</p>

          {activeCase.clues.map((clue, index) => (
            <div key={index}>
              <span>0{index + 1}</span>
              {clue}
            </div>
          ))}
        </div>
      )}

      <div className="phishing-question">
        <p className="phishing-eyebrow">AGENT DECISION REQUIRED</p>
        <h3>Is this email a phishing attempt?</h3>

        <div className="phishing-answer-grid">
          <button
            className={`phishing-answer ${
              selectedAnswer === true ? "selected-danger" : ""
            }`}
            disabled={submitted}
            onClick={() => setSelectedAnswer(true)}
          >
            <ShieldAlert size={21} />
            <span>PHISHING</span>
            <small>Malicious / Suspicious</small>
          </button>

          <button
            className={`phishing-answer ${
              selectedAnswer === false ? "selected-safe" : ""
            }`}
            disabled={submitted}
            onClick={() => setSelectedAnswer(false)}
          >
            <ShieldCheck size={21} />
            <span>LEGITIMATE</span>
            <small>Appears trustworthy</small>
          </button>
        </div>
      </div>

      {submitted && (
        <div
          className={`phishing-feedback ${
            correct ? "correct" : "incorrect"
          }`}
        >
          {correct ? (
            <CheckCircle2 size={20} />
          ) : (
            <AlertTriangle size={20} />
          )}

          <div>
            <strong>
              {correct ? "CORRECT DETECTION" : "INCORRECT ANALYSIS"}
            </strong>

            <p>{activeCase.explanation}</p>
          </div>
        </div>
      )}

      <div className="phishing-actions">
        {!submitted ? (
          <button
            className="phishing-primary-button"
            disabled={selectedAnswer === null}
            onClick={submitAnswer}
          >
            SUBMIT ANALYSIS
            <ArrowRight size={16} />
          </button>
        ) : (
          <button
            className="phishing-primary-button"
            onClick={nextCase}
          >
            {currentCase === cases.length - 1
              ? "FINISH INVESTIGATION"
              : "NEXT CASE"}
            <ArrowRight size={16} />
          </button>
        )}
      </div>

      <p className="phishing-disclaimer">
        TRAINING SIMULATION // ALL EMAILS AND DOMAINS ARE EXAMPLES.
      </p>
    </div>
  );
};

export default PhishingDetective;
