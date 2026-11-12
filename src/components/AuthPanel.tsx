
import { useState } from "react";
import {
  X,
  Eye,
  EyeOff,
  RefreshCw,
  ShieldCheck,
  Fingerprint,
  UserRound,
} from "lucide-react";

type AuthPanelProps = {
  onClose: () => void;
  onSuccess: (username: string) => void;
  initialMode: "login" | "signup";
};

type Account = {
  name: string;
  email: string;
  password: string;
  username: string;
};

const prefixes = [
  "VOID",
  "GHOST",
  "NEON",
  "SHADOW",
  "ZERO",
  "CYBER",
  "PHANTOM",
  "CRYPTIC",
  "DARK",
  "GLITCH",
];

const suffixes = [
  "PHANTOM",
  "BYTE",
  "REAPER",
  "TRACE",
  "ROOT",
  "HUNTER",
  "PROTOCOL",
  "NEXUS",
  "WRAITH",
  "404",
];

function generateUsername() {
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  const number = Math.floor(10 + Math.random() * 90);

  return `${prefix}_${suffix}_${number}`;
}

export default function AuthPanel({
  onClose,
  onSuccess,
  initialMode,
}: AuthPanelProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState(generateUsername());
  const [customUsername, setCustomUsername] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const switchMode = (next: "login" | "signup") => {
    setMode(next);
    setError("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("All required fields must be completed.");
      return;
    }

    const accounts: Account[] = JSON.parse(
      localStorage.getItem("hacked_accounts") || "[]"
    );

    if (mode === "signup") {
      if (!name.trim()) {
        setError("Enter your agent name.");
        return;
      }

      if (password.length < 6) {
        setError("Password must contain at least 6 characters.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      if (accounts.some((account) => account.email === email.trim().toLowerCase())) {
        setError("An account with this email already exists.");
        return;
      }

      const finalUsername = username.trim().toUpperCase();

      if (!/^[A-Z0-9_.-]{3,24}$/.test(finalUsername)) {
        setError("Username must be 3–24 characters and use letters, numbers, . _ or -.");
        return;
      }

      if (accounts.some((account) => account.username === finalUsername)) {
        setError("This agent identity is already taken. Generate another.");
        return;
      }

      const newAccount: Account = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        username: finalUsername,
      };

      accounts.push(newAccount);
      localStorage.setItem("hacked_accounts", JSON.stringify(accounts));
      localStorage.setItem("hacked_current_agent", JSON.stringify({
        name: newAccount.name,
        email: newAccount.email,
        username: newAccount.username,
      }));

      onSuccess(finalUsername);
    } else {
      const account = accounts.find(
        (item) =>
          item.email === email.trim().toLowerCase() &&
          item.password === password
      );

      if (!account) {
        setError("Invalid credentials. Check your email and password.");
        return;
      }

      localStorage.setItem("hacked_current_agent", JSON.stringify({
        name: account.name,
        email: account.email,
        username: account.username,
      }));

      onSuccess(account.username);
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-card">
        <button className="auth-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className="auth-heading">
          <div className="auth-symbol">
            <Fingerprint size={28} />
          </div>
          <span className="auth-eyebrow">SECURE ACCESS PROTOCOL</span>
          <h2>
            {mode === "login" ? "WELCOME BACK," : "CREATE YOUR"}
            <br />
            <span>{mode === "login" ? "AGENT." : "IDENTITY."}</span>
          </h2>
          <p>
            {mode === "login"
              ? "Your next mission is waiting."
              : "Every legend starts with an identity."}
          </p>
        </div>

        <div className="auth-tabs">
          <button
            className={mode === "login" ? "active login-tab" : ""}
            onClick={() => switchMode("login")}
            type="button"
          >
            LOGIN
          </button>
          <button
            className={mode === "signup" ? "active signup-tab" : ""}
            onClick={() => switchMode("signup")}
            type="button"
          >
            SIGN UP
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <>
              <label>AGENT NAME</label>
              <div className="auth-input">
                <UserRound size={17} />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
            </>
          )}

          <label>EMAIL ADDRESS</label>
          <div className="auth-input">
            <span>@</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="agent@mainframe.net"
              required
            />
          </div>

          <label>PASSWORD</label>
          <div className="auth-input">
            <ShieldCheck size={17} />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>

          {mode === "signup" && (
            <>
              <label>CONFIRM PASSWORD</label>
              <div className="auth-input">
                <ShieldCheck size={17} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                />
              </div>

              <label>YOUR AGENT CODENAME</label>
              <div className="username-generator">
                <Fingerprint size={18} />
                <input
                  value={username}
                  readOnly={!customUsername}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <button
                  type="button"
                  title="Generate another identity"
                  onClick={() => {
                    setUsername(generateUsername());
                    setCustomUsername(false);
                  }}
                >
                  <RefreshCw size={17} />
                </button>
              </div>

              <button
                type="button"
                className="custom-username"
                onClick={() => setCustomUsername(!customUsername)}
              >
                {customUsername ? "USE GENERATED IDENTITY" : "CUSTOMIZE USERNAME"}
              </button>
            </>
          )}

          {error && <div className="auth-error">{error}</div>}

          <button
            className={`auth-submit ${mode === "login" ? "submit-green" : "submit-pink"}`}
            type="submit"
          >
            {mode === "login" ? "ACCESS MAINFRAME" : "CREATE AGENT IDENTITY"}
            <span>↗</span>
          </button>
        </form>

        <p className="auth-footnote">
          {mode === "login"
            ? "NEW TO THE NETWORK? "
            : "ALREADY AN AGENT? "}
          <button
            type="button"
            onClick={() => switchMode(mode === "login" ? "signup" : "login")}
          >
            {mode === "login" ? "CREATE ACCOUNT" : "LOGIN"}
          </button>
        </p>
      </div>
    </div>
  );
}
