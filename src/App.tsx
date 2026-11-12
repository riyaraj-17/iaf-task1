
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  ShieldAlert,
  Terminal,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";

import MatrixRain from "./components/MatrixRain";
import CyberScene from "./components/CyberScene";
import AuthPanel from "./components/AuthPanel";
import DashboardPage from "./pages/Dashboard";

type AuthMode = "login" | "signup";

function Landing({
  onAuthOpen,
  sound,
  onSoundToggle,
}: {
  onAuthOpen: (mode: AuthMode) => void;
  sound: boolean;
  onSoundToggle: () => void;
}) {
  return (
    <main className="landing">
      {/* Background effects */}
      <div className="landing-background">
        <CyberScene />
        <MatrixRain />
        <div className="scanlines" />
        <div className="noise-overlay" />
      </div>

      {/* Navigation */}
      <header className="topbar">
        <div className="brand">
          <span className="brand-icon">H/</span>
          <span>
            HACKED<span className="green">.exe</span>
          </span>
        </div>

        <div className="top-status">
          <span className="status-dot" />
          SYSTEM ONLINE
        </div>

        <div className="landing-auth-actions">
          <button
            type="button"
            className="landing-login"
            onClick={() => onAuthOpen("login")}
          >
            LOGIN
          </button>

          <button
            type="button"
            className="landing-signup"
            onClick={() => onAuthOpen("signup")}
          >
            SIGN UP
          </button>

          <button
            type="button"
            className="sound-button"
            onClick={onSoundToggle}
            aria-label="Toggle sound"
          >
            {sound ? <Volume2 size={17} /> : <VolumeX size={17} />}
            <span>SOUND {sound ? "ON" : "OFF"}</span>
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="eyebrow">
            <span className="pulse-dot" />
            CLASSIFIED // RESTRICTED ACCESS
          </div>

          <div className="hero-title-wrap">
            <div className="title-shadow">HACKED.exe</div>

            <h1 className="hero-title" data-text="HACKED.exe">
              HACKED<span>.exe</span>
            </h1>
          </div>

          <div className="hero-subtitle">
            <span className="line" />
            THE SYSTEM HAS BEEN COMPROMISED.
            <span className="line" />
          </div>

          {/* Terminal */}
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="terminal-controls">
                <i />
                <i />
                <i />
              </div>

              <span>root@mainframe:~</span>
              <Terminal size={14} />
            </div>

            <div className="terminal-content">
              <p><span>[ 01 ]</span> Initializing HACKED.exe...</p>
              <p><span>[ 02 ]</span> Establishing secure connection...</p>
              <p><span>[ 03 ]</span> Scanning network nodes...</p>
              <p>
                <span>[ 04 ]</span>
                <b className="red"> Unauthorized access detected.</b>
              </p>
              <p className="terminal-success">
                <span>[ 05 ]</span>
                Mainframe access awaiting authorization_
                <i className="cursor-blink" />
              </p>
            </div>
          </div>

          {/* Breach alert */}
          <motion.div
            className="breach-alert"
            animate={{ opacity: [1, 0.55, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ShieldAlert size={20} />

            <div>
              <strong>CRITICAL SYSTEM BREACH</strong>
              <small>YOUR SYSTEM IS NO LONGER SAFE.</small>
            </div>

            <span className="alert-code">ERR_009</span>
          </motion.div>

          {/* Enter button */}
          <motion.button
            type="button"
            className="enter-button"
            onClick={() => onAuthOpen("login")}
            whileHover={{ scale: 1.025 }}
            whileTap={{ scale: 0.97 }}
          >
            <Zap size={18} />
            ENTER THE MAINFRAME
            <ArrowUpRight size={19} />
          </motion.button>

          <div className="hero-footnote">
            <span>PRESS TO INITIATE</span>
            <span>ENCRYPTION: AES-256</span>
            <span>BUILD 2026.11</span>
          </div>
        </motion.div>
      </section>

      <footer className="landing-footer">
        <span>HACKED.exe // CYBERSECURITY SIMULATION</span>
        <span>UNAUTHORIZED PERSONNEL WILL BE TRACED</span>
      </footer>
    </main>
  );
}

export default function App() {
  const [entered, setEntered] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [sound, setSound] = useState(false);

  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const handleAuthSuccess = (username: string) => {
    localStorage.setItem("hacked_display_name", username);
    setAuthOpen(false);
    setEntered(true);
  };

  return (
    <AnimatePresence mode="wait">
      {!entered ? (
        <motion.div
          key="landing"
          className="app-landing"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.05,
            filter: "blur(12px)",
          }}
          transition={{ duration: 0.7 }}
        >
          <Landing
            onAuthOpen={openAuth}
            sound={sound}
            onSoundToggle={() => setSound((previous) => !previous)}
          />

          {/* Authentication stays above the landing page */}
          <AnimatePresence>
            {authOpen && (
              <motion.div
                key="auth-wrapper"
                className="auth-wrapper"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <AuthPanel
                  initialMode={authMode}
                  onClose={() => setAuthOpen(false)}
                  onSuccess={handleAuthSuccess}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          key="dashboard"
          initial={{
            opacity: 0,
            scale: 0.95,
            filter: "blur(8px)",
          }}
          animate={{
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
          }}
          transition={{ duration: 0.8 }}
        >
          <DashboardPage />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
