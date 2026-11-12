
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import "./Dashboard.css";

import CyberCore from "../components/CyberCore";
import RookiesAcademy from "../components/RookiesAcademy";
import PasswordBreaker from "../components/missions/PasswordBreaker";
import CodeDecoder from "../components/missions/CodeDecoder";
import PhishingDetective from "../components/missions/PhishingDetective";
import Terminal from "../components/Terminal";
import { playUiSound } from "../utils/uiSounds";

import {
  Activity,
  Award,
  CheckCircle2,
  ChevronRight,
  Fingerprint,
  Gamepad2,
  LockKeyhole,
  LogOut,
  Medal,
  Search,
  Shield,
  ShieldAlert,
  TerminalSquare,
  Trophy,
  Wifi,
  Zap,
  Target,
  ArrowUpRight,
  User,
  Pencil,
  Save,
  X,
  KeyRound,
  Volume2,
  VolumeX,
  BookOpen,
} from "lucide-react";

type View =
  | "dashboard"
  | "rookies"
  | "missions"
  | "terminal"
  | "leaderboard"
  | "achievements"
  | "profile";

interface Mission {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  xp: number;
  description: string;
  objective: string;
}

interface Progress {
  xp: number;
  completed: string[];
  claimedAchievements: string[];
}

interface Agent {
  name: string;
  email: string;
  username: string;
  agentId: string;
}

const missions: Mission[] = [
  {
    id: "01",
    title: "PASSWORD BREAKER",
    category: "CRYPTOGRAPHY",
    difficulty: "EASY",
    xp: 250,
    description:
      "Learn how password strength affects account security. Analyse different password patterns and identify the strongest credential.",
    objective:
      "Identify the strongest password from the available options.",
  },
  {
    id: "02",
    title: "CODE DECODER",
    category: "ENCRYPTION",
    difficulty: "MEDIUM",
    xp: 400,
    description:
      "Explore encryption and decryption. Decode a hidden message using a classical cipher.",
    objective:
      "Decode the encrypted message and uncover the original text.",
  },
  {
    id: "03",
    title: "PHISHING DETECTIVE",
    category: "SOCIAL ENGINEERING",
    difficulty: "MEDIUM",
    xp: 350,
    description:
      "Investigate suspicious emails, identify social-engineering tactics and protect the inbox.",
    objective:
      "Classify each message and uncover the warning signs.",
  },
];

const achievements = [
  {
    id: "first-blood",
    title: "FIRST BLOOD",
    description: "Complete your first game.",
    requirement: "Complete 1 game",
    icon: Target,
    reward: 50,
  },
  {
    id: "code-breaker",
    title: "CODE BREAKER",
    description: "Complete Password Breaker.",
    requirement: "Complete Password Breaker",
    icon: LockKeyhole,
    reward: 75,
  },
  {
    id: "elite-agent",
    title: "ELITE AGENT",
    description: "Earn 500 XP.",
    requirement: "Earn 500 XP",
    icon: Zap,
    reward: 100,
  },
  {
    id: "mission-master",
    title: "MISSION MASTER",
    description: "Complete your first two games.",
    requirement: "Complete 2 games",
    icon: Trophy,
    reward: 150,
  },
  {
    id: "triple-threat",
    title: "TRIPLE THREAT",
    description: "Complete all three cybersecurity games.",
    requirement: "Complete all 3 games",
    icon: Shield,
    reward: 200,
  },
];

const leaderboardData = [
  { name: "GHOST_PROTOCOL", xp: 3250 },
  { name: "ZERO_DAY", xp: 2800 },
  { name: "ROOT_ACCESS", xp: 2450 },
  { name: "NEON_SHADOW", xp: 1900 },
  { name: "CYBER_WOLF", xp: 1500 },
];

const createAgentId = () =>
  `HX-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

const getAgent = (): Agent => {
  try {
    const saved = localStorage.getItem("hacked_current_agent");

    if (saved) {
      const parsed = JSON.parse(saved);

      const agent: Agent = {
        name: parsed.name || "UNKNOWN AGENT",
        email: parsed.email || "",
        username:
          parsed.username ||
          parsed.name?.replace(/\s+/g, "_").toUpperCase() ||
          "AGENT_01",
        agentId: parsed.agentId || createAgentId(),
      };

      localStorage.setItem(
        "hacked_current_agent",
        JSON.stringify({ ...parsed, ...agent })
      );

      return agent;
    }
  } catch (error) {
    console.error("Could not load agent profile:", error);
  }

  return {
    name: "UNKNOWN AGENT",
    email: "",
    username: "AGENT_01",
    agentId: "HX-GUEST01",
  };
};

const getSavedProgress = (): Progress => {
  try {
    const saved = localStorage.getItem("hacked_progress");

    if (saved) {
      const data = JSON.parse(saved);

      const completed = Array.isArray(data.completed)
        ? missions
            .filter((mission) => data.completed.includes(mission.id))
            .map((mission) => mission.id)
        : [];

      return {
        xp: Math.max(0, Number(data.xp) || 0),
        completed,
        claimedAchievements: Array.isArray(data.claimedAchievements)
          ? data.claimedAchievements
          : [],
      };
    }
  } catch (error) {
    console.error("Could not load progress:", error);
  }

  return {
    xp: 0,
    completed: [],
    claimedAchievements: [],
  };
};

const DashboardPage = () => {
  const [activeView, setActiveView] = useState<View>("dashboard");

  const [agent, setAgent] = useState<Agent>(() => getAgent());

  const [progress, setProgress] = useState<Progress>(() =>
    getSavedProgress()
  );

  const [selectedMission, setSelectedMission] = useState<string | null>(
    null
  );

  const [searchQuery, setSearchQuery] = useState("");

  // SOUND SYSTEM
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      return localStorage.getItem("hacked_sound_enabled") !== "false";
    } catch {
      return true;
    }
  });

  const soundEnabledRef = useRef(soundEnabled);
  const previousCompletedRef = useRef<string[]>(progress.completed);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;

    try {
      localStorage.setItem(
        "hacked_sound_enabled",
        String(soundEnabled)
      );
    } catch (error) {
      console.error("Could not save sound preference:", error);
    }
  }, [soundEnabled]);

  const handleSoundToggle = () => {
    const nextState = !soundEnabledRef.current;

    soundEnabledRef.current = nextState;
    setSoundEnabled(nextState);

    if (nextState) {
      void playUiSound("toggle");
    }
  };

  useEffect(() => {
    const previous = previousCompletedRef.current;

    const newlyCompleted = progress.completed.some(
      (id) => !previous.includes(id)
    );

    if (newlyCompleted && soundEnabledRef.current) {
      void playUiSound("success");
    }

    previousCompletedRef.current = progress.completed;
  }, [progress.completed]);

  // PROFILE STATE
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(agent.name);
  const [profileUsername, setProfileUsername] = useState(agent.username);
  const [showPasswordInfo, setShowPasswordInfo] = useState(false);

  // AGENT STATS
  const totalXP = progress.xp;
  const completedCount = progress.completed.length;
  const totalGames = missions.length;
  const totalAchievements = achievements.length;

  const level = Math.floor(totalXP / 500) + 1;
  const currentLevelXP = totalXP % 500;
  const levelProgress = (currentLevelXP / 500) * 100;

  const rank =
    totalXP >= 1000
      ? "ELITE HACKER"
      : totalXP >= 500
        ? "CYBER OPERATIVE"
        : "ROOKIE";

  const activeMission = missions.find(
    (mission) => mission.id === selectedMission
  );

  const isCompleted = (id: string) =>
    progress.completed.includes(id);

  const isAchievementUnlocked = (
    id: string,
    current: Progress
  ) => {
    switch (id) {
      case "first-blood":
        return current.completed.length >= 1;
      case "code-breaker":
        return current.completed.includes("01");
      case "elite-agent":
        return current.xp >= 500;
      case "mission-master":
        return current.completed.length >= 2;
      case "triple-threat":
        return current.completed.length >= 3;
      default:
        return false;
    }
  };

  const unlockedAchievements = achievements.filter((item) =>
    isAchievementUnlocked(item.id, progress)
  );

  const getAchievementProgress = (id: string) => {
    switch (id) {
      case "first-blood":
        return {
          current: Math.min(completedCount, 1),
          max: 1,
        };
      case "code-breaker":
        return {
          current: isCompleted("01") ? 1 : 0,
          max: 1,
        };
      case "elite-agent":
        return {
          current: Math.min(totalXP, 500),
          max: 500,
        };
      case "mission-master":
        return {
          current: Math.min(completedCount, 2),
          max: 2,
        };
      case "triple-threat":
        return {
          current: Math.min(completedCount, 3),
          max: 3,
        };
      default:
        return { current: 0, max: 1 };
    }
  };

  // AUTOMATIC ACHIEVEMENT XP
  useEffect(() => {
    setProgress((previous) => {
      const newlyUnlocked = achievements.filter((item) => {
        if (previous.claimedAchievements.includes(item.id)) {
          return false;
        }

        return isAchievementUnlocked(item.id, previous);
      });

      if (newlyUnlocked.length === 0) {
        return previous;
      }

      const bonusXP = newlyUnlocked.reduce(
        (total, item) => total + item.reward,
        0
      );

      const updated: Progress = {
        ...previous,
        xp: previous.xp + bonusXP,
        claimedAchievements: [
          ...previous.claimedAchievements,
          ...newlyUnlocked.map((item) => item.id),
        ],
      };

      try {
        localStorage.setItem(
          "hacked_progress",
          JSON.stringify(updated)
        );
      } catch (error) {
        console.error("Could not save achievement rewards:", error);
      }

      return updated;
    });
  }, [progress.xp, progress.completed.length]);

  // COMPLETE A GAME
  const completeMission = (id: string) => {
    setProgress((previous) => {
      if (previous.completed.includes(id)) {
        return previous;
      }

      const mission = missions.find((item) => item.id === id);

      if (!mission) {
        return previous;
      }

      const updated: Progress = {
        ...previous,
        xp: previous.xp + mission.xp,
        completed: [...previous.completed, id],
      };

      try {
        localStorage.setItem(
          "hacked_progress",
          JSON.stringify(updated)
        );
      } catch (error) {
        console.error("Could not save progress:", error);
      }

      return updated;
    });
  };

  const openMission = (id: string) => {
    setSelectedMission(id);
    setActiveView("missions");
  };

  const handleLogout = () => {
    localStorage.removeItem("hacked_current_agent");
    window.location.reload();
  };

  // SAVE PROFILE
  const saveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanName = profileName.trim();
    const cleanUsername = profileUsername
      .trim()
      .replace(/\s+/g, "_")
      .toUpperCase();

    if (!cleanName || !cleanUsername) {
      return;
    }

    const updatedAgent: Agent = {
      ...agent,
      name: cleanName,
      username: cleanUsername,
    };

    try {
      const existing = JSON.parse(
        localStorage.getItem("hacked_current_agent") || "{}"
      );

      localStorage.setItem(
        "hacked_current_agent",
        JSON.stringify({
          ...existing,
          ...updatedAgent,
        })
      );

      setAgent(updatedAgent);
      setIsEditingProfile(false);
    } catch (error) {
      console.error("Could not save profile:", error);
      alert("Could not save profile. Please try again.");
    }
  };

  const cancelProfileEdit = () => {
    setProfileName(agent.name);
    setProfileUsername(agent.username);
    setIsEditingProfile(false);
  };

  const filteredMissions = missions.filter((mission) =>
    `${mission.title} ${mission.category}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const navItems: {
    label: string;
    view: View;
    icon: typeof Activity;
  }[] = [
    { label: "OVERVIEW", view: "dashboard", icon: Activity },
    { label: "ROOKIES", view: "rookies", icon: BookOpen },
    { label: "GAMES", view: "missions", icon: Gamepad2 },
    { label: "TERMINAL", view: "terminal", icon: TerminalSquare },
    { label: "LEADERBOARD", view: "leaderboard", icon: Trophy },
    { label: "ACHIEVEMENTS", view: "achievements", icon: Award },
    { label: "AGENT PROFILE", view: "profile", icon: User },
  ];

  return (
    <div
      className="mainframe"
      onClickCapture={(event) => {
        if (!soundEnabledRef.current) return;

        const target = event.target;

        if (
          target instanceof Element &&
          target.closest("button, [role='button']")
        ) {
          if (target.closest(".sound-toggle")) return;

          void playUiSound("click");
        }
      }}
    >
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-icon">
            <Shield size={24} />
          </div>

          <div>
            <h2>
              HACKED<span>.exe</span>
            </h2>
            <p>CYBER TRAINING SYSTEM</p>
          </div>
        </div>

        <div className="sidebar-section-label">MAIN MENU</div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.view}
                className={`nav-item ${
                  activeView === item.view ? "active" : ""
                }`}
                onClick={() => {
                  setActiveView(item.view);
                  setSelectedMission(null);
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>

                {item.view === "missions" && (
                  <span className="nav-count">
                    {completedCount}/{totalGames}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-agent">
          <div className="agent-avatar">
            <Fingerprint size={22} />
          </div>

          <div className="agent-info">
            <strong>{agent.username}</strong>
            <span>
              LEVEL {level} // {rank}
            </span>
          </div>
        </div>

        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={17} />
          <span>SIGN OUT</span>
        </button>
      </aside>

      <main className="main-content">
        <header className="command-topbar">
          <div className="topbar-location">
            <span className="status-dot" />
            <span>SECURE CONNECTION</span>
            <ChevronRight size={14} />
            <span>{activeView.toUpperCase()}</span>
          </div>

          <div className="topbar-right">
            <button
              type="button"
              className={`sound-toggle ${
                soundEnabled ? "sound-on" : "sound-off"
              }`}
              onClick={handleSoundToggle}
              aria-label={
                soundEnabled ? "Mute sounds" : "Enable sounds"
              }
              title={soundEnabled ? "Sound ON" : "Sound OFF"}
              aria-pressed={soundEnabled}
            >
              {soundEnabled ? (
                <Volume2 size={17} />
              ) : (
                <VolumeX size={17} />
              )}
              <span>
                {soundEnabled ? "SOUND ON" : "SOUND OFF"}
              </span>
            </button>

            <div className="connection-status">
              <Wifi size={15} />
              SYSTEM ONLINE
            </div>

            <div className="topbar-agent">
              <User size={16} />
              {agent.name}
            </div>
          </div>
        </header>

        <div className="page-content">
          {/* DASHBOARD OVERVIEW */}
          {activeView === "dashboard" && (
            <>
              <div className="welcome-row">
                <div>
                  <p className="eyebrow">
                    <span className="status-dot" />
                    OPERATIVE COMMAND CENTER
                  </p>

                  <h1>
                    Welcome back, <span>{agent.name}</span>
                  </h1>

                  <p className="muted">
                    Your next challenge is waiting. Keep learning, keep evolving.
                  </p>
                </div>

                <div className="rank-chip">
                  <ShieldAlert size={16} />
                  {rank}
                </div>
              </div>

              <section className="cyber-core-section">
                <div className="cyber-core-info">
                  <p className="eyebrow">
                    <span className="status-dot" />
                    CENTRAL SYSTEM // ONLINE
                  </p>

                  <h2>
                    CYBER <span>CORE</span>
                  </h2>

                  <p>
                    Your interactive cybersecurity training hub.
                    Complete games, earn XP and evolve into an elite operative.
                  </p>

                  <div className="core-status">
                    <span>● CORE ACTIVE</span>
                    <span>LEVEL {level}</span>
                    <span>{totalXP} XP</span>
                  </div>
                </div>

                <div className="cyber-core-visual">
                  <CyberCore />
                </div>
              </section>

              <section className="agent-banner">
                <div className="agent-banner-content">
                  <div className="banner-tag">
                    <Zap size={14} />
                    AGENT PROFILE
                  </div>

                  <h2>LEVEL {level} OPERATIVE</h2>

                  <p>
                    You have earned {totalXP} experience points.
                    Complete games to unlock your next level.
                  </p>

                  <div className="xp-progress-info">
                    <span>LEVEL {level} PROGRESS</span>
                    <span>{currentLevelXP} / 500 XP</span>
                  </div>

                  <div className="xp-track">
                    <div
                      className="xp-fill"
                      style={{ width: `${levelProgress}%` }}
                    />
                  </div>
                </div>

                <div className="banner-level">
                  <Fingerprint size={48} />
                  <strong>{String(level).padStart(2, "0")}</strong>
                  <span>AGENT LEVEL</span>
                </div>
              </section>

              <section className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <Zap size={20} />
                  </div>
                  <p>TOTAL EXPERIENCE</p>
                  <h2>{totalXP.toLocaleString()}</h2>
                  <span>XP EARNED</span>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <Target size={20} />
                  </div>
                  <p>GAMES COMPLETED</p>
                  <h2>{String(completedCount).padStart(2, "0")}</h2>
                  <span>OUT OF {String(totalGames).padStart(2, "0")} GAMES</span>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <Trophy size={20} />
                  </div>
                  <p>CURRENT RANK</p>
                  <h2 className="stat-rank">{rank}</h2>
                  <span>BASED ON YOUR XP</span>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <Award size={20} />
                  </div>
                  <p>ACHIEVEMENTS</p>
                  <h2>{unlockedAchievements.length}</h2>
                  <span>BADGES UNLOCKED</span>
                </div>
              </section>

              <div className="dashboard-grid">
                <section className="panel missions-panel">
                  <div className="panel-heading">
                    <div>
                      <p className="eyebrow">TRAINING PROGRAM</p>
                      <h2>Your Games</h2>
                    </div>

                    <button
                      className="text-action"
                      onClick={() => setActiveView("missions")}
                    >
                      VIEW ALL <ArrowUpRight size={15} />
                    </button>
                  </div>

                  <div className="mission-list">
                    {missions.map((mission) => (
                      <div className="mission-row" key={mission.id}>
                        <div className="mission-number">
                          {mission.id}
                        </div>

                        <div className="mission-row-info">
                          <strong>{mission.title}</strong>
                          <span>
                            {mission.category} // {mission.difficulty}
                          </span>
                        </div>

                        <div className="mission-xp">
                          +{mission.xp} XP
                        </div>

                        {isCompleted(mission.id) ? (
                          <CheckCircle2
                            className="completed-icon"
                            size={19}
                          />
                        ) : (
                          <button
                            className="icon-action"
                            onClick={() => openMission(mission.id)}
                            aria-label={`Open ${mission.title}`}
                          >
                            <ChevronRight size={19} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                <section className="panel profile-panel">
                  <div className="panel-heading">
                    <div>
                      <p className="eyebrow">OPERATIVE DETAILS</p>
                      <h2>Agent Profile</h2>
                    </div>
                    <Fingerprint size={22} />
                  </div>

                  <div className="profile-avatar">
                    <Shield size={36} />
                  </div>

                  <h3>{agent.username}</h3>
                  <p className="muted">{agent.email}</p>

                  <div className="profile-divider" />

                  <div className="profile-detail">
                    <span>AGENT LEVEL</span>
                    <strong>{level}</strong>
                  </div>

                  <div className="profile-detail">
                    <span>EXPERIENCE</span>
                    <strong>{totalXP} XP</strong>
                  </div>

                  <div className="profile-detail">
                    <span>GAMES</span>
                    <strong>{completedCount}/{totalGames}</strong>
                  </div>

                  <div className="profile-detail">
                    <span>STATUS</span>
                    <strong className="online-text">ACTIVE</strong>
                  </div>

                  <button
                    className="text-action"
                    onClick={() => setActiveView("profile")}
                  >
                    VIEW FULL PROFILE <ArrowUpRight size={15} />
                  </button>
                </section>
              </div>
            </>
          )}

          {/* ROOKIES ACADEMY */}
          {activeView === "rookies" && (
            <>
              <div className="welcome-row">
                <div>
                  <p className="eyebrow">
                    <span className="status-dot" />
                    BEGINNER TRAINING PROGRAM
                  </p>

                  <h1>
                    Rookie <span>Academy</span>
                  </h1>

                  <p className="muted">
                    Start with the basics. Build your cybersecurity knowledge.
                  </p>
                </div>

                <div className="rank-chip">
                  <BookOpen size={16} />
                  LEVEL 01 // BEGINNER
                </div>
              </div>

              <RookiesAcademy />

              <section className="panel rookies-footer">
                <BookOpen size={22} />

                <div>
                  <strong>READY TO LEVEL UP?</strong>
                  <p className="muted">
                    Once you're familiar with the basics, test your
                    knowledge in the Game Zone.
                  </p>
                </div>

                <button
                  className="launch-button"
                  onClick={() => setActiveView("missions")}
                >
                  EXPLORE GAMES <ArrowUpRight size={15} />
                </button>
              </section>
            </>
          )}

          {/* GAMES */}
          {activeView === "missions" && (
            <>
              <div className="welcome-row">
                <div>
                  <p className="eyebrow">TRAINING OPERATIONS</p>
                  <h1>
                    Game <span>Zone</span>
                  </h1>
                  <p className="muted">
                    Choose a challenge and earn experience points.
                  </p>
                </div>

                <div className="rank-chip">
                  <Gamepad2 size={16} />
                  {completedCount}/{totalGames} COMPLETED
                </div>
              </div>

              {activeMission ? (
                <section className="mission-detail panel">
                  <button
                    className="text-action back-action"
                    onClick={() => setSelectedMission(null)}
                  >
                    ← BACK TO GAMES
                  </button>

                  <div className="detail-number">
                    GAME {activeMission.id}
                  </div>

                  <h2>{activeMission.title}</h2>

                  <div className="detail-meta">
                    <span>{activeMission.category}</span>
                    <span>{activeMission.difficulty}</span>
                    <span>+{activeMission.xp} XP</span>
                  </div>

                  <p className="detail-description">
                    {activeMission.description}
                  </p>

                  <div className="mission-objective">
                    <Target size={20} />
                    <div>
                      <strong>GAME OBJECTIVE</strong>
                      <p>{activeMission.objective}</p>
                    </div>
                  </div>

                  {isCompleted(activeMission.id) ? (
                    <div className="launch-message">
                      <CheckCircle2 size={21} />
                      GAME COMPLETED. XP REWARD CLAIMED.
                    </div>
                  ) : activeMission.id === "01" ? (
                    <PasswordBreaker
                      onComplete={() => completeMission("01")}
                    />
                  ) : activeMission.id === "02" ? (
                    <CodeDecoder
                      onComplete={() => completeMission("02")}
                    />
                  ) : (
                    <PhishingDetective
                      onComplete={() => completeMission("03")}
                    />
                  )}
                </section>
              ) : (
                <>
                  <div className="mission-search">
                    <Search size={18} />

                    <input
                      placeholder="Search games..."
                      value={searchQuery}
                      onChange={(event) =>
                        setSearchQuery(event.target.value)
                      }
                    />

                    <span>{filteredMissions.length} GAMES</span>
                  </div>

                  <div className="mission-card-grid">
                    {filteredMissions.map((mission) => (
                      <article
                        className="mission-card"
                        key={mission.id}
                      >
                        <div className="mission-card-top">
                          <span>GAME {mission.id}</span>

                          {isCompleted(mission.id) ? (
                            <CheckCircle2
                              className="completed-icon"
                              size={19}
                            />
                          ) : (
                            <span className="mission-available">
                              AVAILABLE
                            </span>
                          )}
                        </div>

                        <h3>{mission.title}</h3>

                        <p>{mission.description}</p>

                        <div className="mission-card-meta">
                          <span>{mission.category}</span>
                          <span>{mission.difficulty}</span>
                        </div>

                        <div className="mission-card-footer">
                          <strong>+{mission.xp} XP</strong>

                          <button
                            className="launch-button"
                            onClick={() => openMission(mission.id)}
                          >
                            {isCompleted(mission.id)
                              ? "REVIEW"
                              : "PLAY GAME"}

                            <ArrowUpRight size={15} />
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>

                  {filteredMissions.length === 0 && (
                    <div className="panel empty-state">
                      <Search size={28} />
                      <h3>NO GAMES FOUND</h3>
                      <p>Try searching with another keyword.</p>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* TERMINAL */}
          {activeView === "terminal" && (
            <>
              <div className="welcome-row">
                <div>
                  <p className="eyebrow">SYSTEM INTERFACE</p>
                  <h1>
                    Agent <span>Terminal</span>
                  </h1>
                  <p className="muted">
                    A simulated command-line environment.
                  </p>
                </div>

                <div className="rank-chip">
                  <TerminalSquare size={16} />
                  LOCAL SIMULATION
                </div>
              </div>

              <Terminal
                agent={agent}
                level={level}
                rank={rank}
                totalXP={totalXP}
                completedCount={completedCount}
                totalGames={totalGames}
                missions={missions.map((mission) => ({
                  id: mission.id,
                  title: mission.title,
                  xp: mission.xp,
                  completed: isCompleted(mission.id),
                }))}
                achievements={achievements.map((item) => ({
                  title: item.title,
                  reward: item.reward,
                  unlocked: isAchievementUnlocked(item.id, progress),
                }))}
              />
            </>
          )}

          {/* LEADERBOARD */}
          {activeView === "leaderboard" && (
            <>
              <div className="welcome-row">
                <div>
                  <p className="eyebrow">
                    GLOBAL AGENT RANKINGS
                  </p>

                  <h1>
                    Cyber <span>Leaderboard</span>
                  </h1>

                  <p className="muted">
                    Compete, earn XP and climb the rankings.
                  </p>
                </div>

                <div className="rank-chip">
                  <Trophy size={16} />
                  TOP AGENTS
                </div>
              </div>

              <section className="panel leaderboard-panel">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">TOP OPERATIVES</p>
                    <h2>Agent Rankings</h2>
                  </div>

                  <Trophy size={23} />
                </div>

                {leaderboardData.map((item, index) => (
                  <div className="leaderboard-row" key={item.name}>
                    <div className="leaderboard-rank">
                      #{index + 1}
                    </div>

                    <div className="leaderboard-agent-icon">
                      <Fingerprint size={20} />
                    </div>

                    <div className="leaderboard-agent">
                      <strong>{item.name}</strong>
                      <span>CYBER OPERATIVE</span>
                    </div>

                    <strong className="leaderboard-xp">
                      {item.xp.toLocaleString()} XP
                    </strong>
                  </div>
                ))}

                <div className="leaderboard-row current-agent-row">
                  <div className="leaderboard-rank">YOU</div>

                  <div className="leaderboard-agent-icon">
                    <User size={20} />
                  </div>

                  <div className="leaderboard-agent">
                    <strong>{agent.username}</strong>
                    <span>YOUR CURRENT PROFILE</span>
                  </div>

                  <strong className="leaderboard-xp">
                    {totalXP.toLocaleString()} XP
                  </strong>
                </div>

                <p className="demo-disclaimer">
                  DEMO LEADERBOARD // OTHER AGENT SCORES ARE SAMPLE DATA.
                </p>
              </section>
            </>
          )}

          {/* AGENT PROFILE */}
          {activeView === "profile" && (
            <>
              <div className="welcome-row">
                <div>
                  <p className="eyebrow">
                    OPERATIVE IDENTITY // VERIFIED
                  </p>

                  <h1>
                    Agent <span>Profile</span>
                  </h1>

                  <p className="muted">
                    Manage your identity and track your progress.
                  </p>
                </div>

                <div className="rank-chip">
                  <Fingerprint size={16} />
                  {rank}
                </div>
              </div>

              <section className="panel agent-profile-page">
                <div className="agent-profile-heading">
                  <div className="profile-avatar">
                    <Shield size={36} />
                  </div>

                  <div className="agent-profile-title">
                    <p className="eyebrow">ACTIVE OPERATIVE</p>
                    <h2>{agent.username}</h2>
                    <p className="muted">
                      {agent.email || "EMAIL NOT PROVIDED"}
                    </p>
                  </div>

                  <span className="online-text">● ACTIVE</span>
                </div>

                <div className="profile-divider" />

                {isEditingProfile ? (
                  <form
                    onSubmit={saveProfile}
                    className="agent-edit-form"
                  >
                    <h3>EDIT IDENTITY</h3>

                    <label htmlFor="profile-name">FULL NAME</label>
                    <input
                      id="profile-name"
                      type="text"
                      value={profileName}
                      onChange={(event) =>
                        setProfileName(event.target.value)
                      }
                      placeholder="Enter your full name"
                      maxLength={60}
                      required
                    />

                    <label htmlFor="profile-username">USERNAME</label>
                    <input
                      id="profile-username"
                      type="text"
                      value={profileUsername}
                      onChange={(event) =>
                        setProfileUsername(event.target.value)
                      }
                      placeholder="Enter your username"
                      maxLength={30}
                      required
                    />

                    <div className="profile-actions">
                      <button
                        type="submit"
                        className="launch-button"
                      >
                        <Save size={15} />
                        SAVE CHANGES
                      </button>

                      <button
                        type="button"
                        className="text-action"
                        onClick={cancelProfileEdit}
                      >
                        <X size={15} />
                        CANCEL
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="agent-profile-details">
                    <div className="profile-detail">
                      <span>FULL NAME</span>
                      <strong>{agent.name}</strong>
                    </div>

                    <div className="profile-detail">
                      <span>USERNAME</span>
                      <strong>{agent.username}</strong>
                    </div>

                    <div className="profile-detail">
                      <span>EMAIL</span>
                      <strong>{agent.email || "NOT PROVIDED"}</strong>
                    </div>

                    <div className="profile-detail">
                      <span>AGENT ID</span>
                      <strong>{agent.agentId}</strong>
                    </div>

                    <button
                      className="launch-button profile-edit-button"
                      onClick={() => {
                        setProfileName(agent.name);
                        setProfileUsername(agent.username);
                        setIsEditingProfile(true);
                      }}
                    >
                      <Pencil size={15} />
                      EDIT PROFILE
                    </button>
                  </div>
                )}
              </section>

              <section className="stats-grid profile-stats">
                <div className="stat-card">
                  <div className="stat-icon">
                    <Zap size={20} />
                  </div>
                  <p>TOTAL EXPERIENCE</p>
                  <h2>{totalXP.toLocaleString()}</h2>
                  <span>XP EARNED</span>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <Fingerprint size={20} />
                  </div>
                  <p>AGENT LEVEL</p>
                  <h2>{level}</h2>
                  <span>CURRENT LEVEL</span>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <Trophy size={20} />
                  </div>
                  <p>GAMES COMPLETED</p>
                  <h2>{completedCount}/{totalGames}</h2>
                  <span>TRAINING PROGRESS</span>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">
                    <Award size={20} />
                  </div>
                  <p>ACHIEVEMENTS</p>
                  <h2>{unlockedAchievements.length}</h2>
                  <span>BADGES UNLOCKED</span>
                </div>
              </section>

              <section className="panel password-settings">
                <div className="password-settings-heading">
                  <div>
                    <p className="eyebrow">ACCOUNT SECURITY</p>
                    <h2>
                      <KeyRound size={20} />
                      Password Settings
                    </h2>
                    <p className="muted">
                      Manage your account credentials.
                    </p>
                  </div>

                  <button
                    className="text-action"
                    onClick={() =>
                      setShowPasswordInfo(!showPasswordInfo)
                    }
                  >
                    {showPasswordInfo ? "CLOSE" : "CHANGE PASSWORD"}
                    <ArrowUpRight size={15} />
                  </button>
                </div>

                {showPasswordInfo && (
                  <div className="password-info">
                    <p>
                      Password changes are not connected yet. Your
                      current project needs a backend authentication
                      endpoint to securely verify your current password
                      and save a new one.
                    </p>
                    <p>
                      No password is stored or changed by this demo
                      profile page.
                    </p>
                  </div>
                )}
              </section>

              <section className="panel profile-achievements">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">OPERATIVE MILESTONES</p>
                    <h2>Your Badges</h2>
                  </div>

                  <Award size={22} />
                </div>

                {unlockedAchievements.length === 0 ? (
                  <p className="muted">
                    No achievements unlocked yet. Complete a game to
                    earn your first badge.
                  </p>
                ) : (
                  <div className="profile-badge-list">
                    {unlockedAchievements.map((item) => {
                      const Icon = item.icon;

                      return (
                        <div
                          className="profile-badge"
                          key={item.id}
                        >
                          <Icon size={19} />
                          <span>{item.title}</span>
                          <CheckCircle2 size={16} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            </>
          )}

          {/* ACHIEVEMENTS */}
          {activeView === "achievements" && (
            <>
              <div className="welcome-row">
                <div>
                  <p className="eyebrow">
                    OPERATIVE MILESTONES
                  </p>

                  <h1>
                    Your <span>Achievements</span>
                  </h1>

                  <p className="muted">
                    Complete challenges, unlock badges and earn bonus XP.
                  </p>
                </div>

                <div className="rank-chip">
                  <Medal size={16} />
                  {unlockedAchievements.length}/{totalAchievements} UNLOCKED
                </div>
              </div>

              <section className="achievement-summary panel">
                <div>
                  <p className="eyebrow">ACHIEVEMENT COLLECTION</p>

                  <h2>
                    {unlockedAchievements.length}{" "}
                    <span>/ {totalAchievements}</span>
                  </h2>

                  <p className="muted">Badges unlocked</p>
                </div>

                <div className="achievement-total-progress">
                  <div className="xp-progress-info">
                    <span>COLLECTION PROGRESS</span>

                    <strong>
                      {Math.round(
                        (unlockedAchievements.length /
                          totalAchievements) *
                          100
                      )}
                      %
                    </strong>
                  </div>

                  <div className="xp-track">
                    <div
                      className="xp-fill"
                      style={{
                        width: `${
                          (unlockedAchievements.length /
                            totalAchievements) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </section>

              <div className="achievement-grid">
                {achievements.map((item) => {
                  const Icon = item.icon;

                  const unlocked = unlockedAchievements.some(
                    (achievement) => achievement.id === item.id
                  );

                  const achievementProgress =
                    getAchievementProgress(item.id);

                  const percentage = Math.round(
                    (achievementProgress.current /
                      achievementProgress.max) *
                      100
                  );

                  return (
                    <article
                      className={`achievement-card ${
                        unlocked ? "unlocked" : "locked"
                      }`}
                      key={item.id}
                    >
                      <div className="achievement-card-header">
                        <div className="achievement-icon">
                          <Icon size={28} />
                        </div>

                        <span
                          className={`achievement-status ${
                            unlocked ? "earned" : ""
                          }`}
                        >
                          {unlocked ? "UNLOCKED" : "LOCKED"}
                        </span>
                      </div>

                      <div className="achievement-content">
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </div>

                      <div className="achievement-progress">
                        <div className="achievement-progress-label">
                          <span>{item.requirement}</span>

                          <strong>
                            {achievementProgress.current}/
                            {achievementProgress.max}
                          </strong>
                        </div>

                        <div className="achievement-progress-track">
                          <div
                            className="achievement-progress-fill"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>

                      <div className="achievement-reward">
                        <span>
                          <Zap size={15} />
                          XP REWARD
                        </span>

                        <strong>+{item.reward} XP</strong>
                      </div>

                      {unlocked && (
                        <div className="achievement-unlocked-overlay">
                          <CheckCircle2 size={16} />
                          REWARD CLAIMED
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
