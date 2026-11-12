
import { motion } from "framer-motion";
import { Shield, Activity, Zap } from "lucide-react";
import "./CyberCore.css";

const CyberCore = () => {
  return (
    <section className="cyber-core-section">
      <div className="core-grid-bg" />

      <div className="core-heading">
        <div>
          <span className="core-eyebrow">
            <span className="core-live-dot" />
            CENTRAL SECURITY INTELLIGENCE
          </span>
          <h2>CYBER <span>CORE</span></h2>
          <p>All systems converge. Stay one step ahead.</p>
        </div>

        <div className="core-status">
          <Activity size={15} />
          CORE ONLINE
        </div>
      </div>

      <div className="core-stage">
        <div className="core-side-data left-data">
          <span>ENCRYPTION</span>
          <strong>ACTIVE</strong>
          <span>PROTOCOL // AES-256</span>
        </div>

        <div className="core-visual">
          <div className="core-glow" />

          <div className="core-ring core-ring-one" />
          <div className="core-ring core-ring-two" />
          <div className="core-ring core-ring-three" />

          <div className="core-orbit orbit-a">
            <i />
          </div>
          <div className="core-orbit orbit-b">
            <i />
          </div>

          <motion.div
            className="core-cube"
            animate={{ rotateY: 360, rotateX: 360 }}
            transition={{
              duration: 24,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="cube-face face-front">
              <Shield size={42} />
              <span>SECURE</span>
            </div>
            <div className="cube-face face-back" />
            <div className="cube-face face-right" />
            <div className="cube-face face-left" />
            <div className="cube-face face-top" />
            <div className="cube-face face-bottom" />
          </motion.div>

          <div className="core-center-label">
            <Zap size={13} />
            HACKED.EXE
          </div>

          <div className="core-particle particle-one" />
          <div className="core-particle particle-two" />
          <div className="core-particle particle-three" />
          <div className="core-particle particle-four" />
          <div className="core-particle particle-five" />
          <div className="core-particle particle-six" />
        </div>

        <div className="core-side-data right-data">
          <span>THREAT MONITOR</span>
          <strong>SCANNING</strong>
          <span>NETWORK // SIMULATED</span>
        </div>
      </div>

      <div className="core-footer">
        <div>
          <span className="core-live-dot" />
          NEURAL LINK ESTABLISHED
        </div>
        <span>SECURITY ENGINE // V1.0</span>
      </div>
    </section>
  );
};

export default CyberCore;
