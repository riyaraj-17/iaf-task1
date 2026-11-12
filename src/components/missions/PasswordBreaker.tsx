
import { useState } from "react";
import { motion } from "framer-motion";
import { LockKeyhole, ShieldCheck, Zap, Lightbulb } from "lucide-react";

interface Props {
  onComplete: () => void;
}

const PasswordBreaker = ({ onComplete }: Props) => {
  const [answer, setAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [hint, setHint] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [message, setMessage] = useState("");

  const passwords = [
    { value: "password123", strength: "WEAK" },
    { value: "riya2006", strength: "WEAK" },
    { value: "12345678", strength: "WEAK" },
    { value: "Tr0ub4dor!92#X", strength: "STRONG" },
  ];

  const checkAnswer = () => {
    if (!answer.trim()) {
      setMessage("Enter a password before submitting.");
      return;
    }

    setAttempts((prev) => prev + 1);

    const correct = answer.trim() === "Tr0ub4dor!92#X";

    if (correct) {
      setCompleted(true);
      setMessage("ACCESS GRANTED. SECURITY CHALLENGE COMPLETED.");
      onComplete();
    } else {
      setMessage("INCORRECT. That password is not the strongest option.");
    }
  };

  return (
    <motion.div
      className="panel password-mission"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="password-header">
        <div className="mission-icon large">
          <LockKeyhole size={25} />
        </div>
        <div>
          <span className="page-eyebrow">MISSION 01 / CRYPTOGRAPHY</span>
          <h2>PASSWORD BREAKER</h2>
          <p>Identify the strongest password to secure the system.</p>
        </div>
      </div>

      <div className="password-objective">
        <span>YOUR OBJECTIVE</span>
        <p>
          Four passwords have been intercepted. Identify the strongest
          password based on length, character variety and unpredictability.
        </p>
      </div>

      <div className="password-options">
        {passwords.map((item, index) => (
          <button
            key={item.value}
            className={`password-option ${
              answer === item.value ? "selected" : ""
            }`}
            onClick={() => {
              if (!completed) {
                setAnswer(item.value);
                setMessage("");
              }
            }}
            disabled={completed}
          >
            <span>0{index + 1}</span>
            <code>{"•".repeat(item.value.length)}</code>
            <span className="password-length">
              {item.value.length} CHARACTERS
            </span>
          </button>
        ))}
      </div>

      <div className="password-input-area">
        <label>SELECTED PASSWORD</label>
        <input
          value={answer}
          onChange={(e) => {
            setAnswer(e.target.value);
            setMessage("");
          }}
          placeholder="Select an option above..."
          disabled={completed}
        />

        <button
          className="launch-button"
          onClick={checkAnswer}
          disabled={completed}
        >
          {completed ? "MISSION COMPLETED" : "VERIFY PASSWORD"}
          <ShieldCheck size={16} />
        </button>
      </div>

      <button
        className="hint-button"
        onClick={() => setHint((prev) => !prev)}
      >
        <Lightbulb size={15} />
        {hint ? "Hide hint" : "Need a hint?"}
      </button>

      {hint && (
        <div className="password-hint">
          Look for a longer password with a mixture of uppercase,
          lowercase, numbers and special characters.
        </div>
      )}

      {message && (
        <div className={`mission-feedback ${completed ? "success" : "error"}`}>
          {message}
        </div>
      )}

      <div className="password-footer">
        <span><Zap size={13} /> REWARD: 250 XP</span>
        <span>ATTEMPTS: {attempts}</span>
      </div>

      {completed && (
        <div className="mission-success">
          <ShieldCheck size={22} />
          <strong>MISSION CLEARED</strong>
          <span>250 XP earned. Well done, agent!</span>
        </div>
      )}
    </motion.div>
  );
};

export default PasswordBreaker;
