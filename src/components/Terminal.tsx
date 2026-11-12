
import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { ArrowUpRight, TerminalSquare } from "lucide-react";

interface Agent {
  name: string;
  email: string;
  username: string;
  agentId: string;
}

interface TerminalMission {
  id: string;
  title: string;
  xp: number;
  completed: boolean;
}

interface TerminalAchievement {
  title: string;
  reward: number;
  unlocked: boolean;
}

interface TerminalProps {
  agent: Agent;
  level: number;
  rank: string;
  totalXP: number;
  completedCount: number;
  totalGames: number;
  missions: TerminalMission[];
  achievements: TerminalAchievement[];
}

const Terminal = ({
  agent,
  level,
  rank,
  totalXP,
  completedCount,
  totalGames,
  missions,
  achievements,
}: TerminalProps) => {
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [output, setOutput] = useState<string[]>([
    "HACKED.EXE SECURE TERMINAL",
    "VERSION 1.0.0 // LOCAL SIMULATION",
    "CONNECTION ESTABLISHED.",
    "",
    "WELCOME BACK, OPERATIVE.",
    "TYPE 'help' TO EXPLORE AVAILABLE COMMANDS.",
    "",
  ]);

  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const element = outputRef.current;
    if (element) element.scrollTop = element.scrollHeight;
  }, [output]);

  const executeCommand = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const rawCommand = input.trim();
    if (!rawCommand) return;

    const [command, ...args] = rawCommand.split(/\s+/);
    const cmd = command.toLowerCase();
    const argumentText = args.join(" ");

    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const prompt = `[${timestamp}] agent@hacked.exe:~$ ${rawCommand}`;

    const updatedHistory = [...commandHistory, rawCommand];
    setCommandHistory(updatedHistory);
    setHistoryIndex(-1);
    setInput("");

    let response: string[] = [];

    switch (cmd) {
      case "help":
        response = [
          "AVAILABLE COMMANDS",
          "────────────────────────────────────────",
          "help          Show available commands",
          "whoami        Display current agent",
          "profile       View agent profile",
          "status        Display system status",
          "missions      List training games",
          "achievements  View achievement status",
          "scan          Run simulated security scan",
          "history       Show previous commands",
          "date          Display date and time",
          "pwd           Show current directory",
          "ls            List virtual directory",
          "echo <text>   Print a message",
          "matrix        Enter the Matrix",
          "sudo          Request elevated access",
          "secret        Discover a hidden message",
          "clear         Clear terminal output",
          "about         About HACKED.EXE",
          "────────────────────────────────────────",
        ];
        break;

      case "whoami":
        response = [
          "IDENTITY VERIFIED",
          `AGENT NAME : ${agent.name}`,
          `USERNAME   : ${agent.username}`,
          `LEVEL      : ${level}`,
          `RANK       : ${rank}`,
        ];
        break;

      case "profile":
        response = [
          "AGENT PROFILE",
          `NAME       : ${agent.name}`,
          `USERNAME   : ${agent.username}`,
          `EMAIL      : ${agent.email || "NOT PROVIDED"}`,
          `AGENT ID   : ${agent.agentId}`,
          `EXPERIENCE : ${totalXP} XP`,
          `LEVEL      : ${level}`,
          `RANK       : ${rank}`,
          `GAMES      : ${completedCount}/${totalGames}`,
        ];
        break;

      case "status":
        response = [
          "SYSTEM STATUS",
          "────────────────────────────────────────",
          "CONNECTION       : SECURE",
          "TERMINAL         : ONLINE",
          "SIMULATION       : ACTIVE",
          `AGENT LEVEL      : ${level}`,
          `TOTAL XP         : ${totalXP}`,
          `GAMES COMPLETED  : ${completedCount}/${totalGames}`,
          `ACHIEVEMENTS     : ${achievements.filter((a) => a.unlocked).length}/${achievements.length}`,
          "────────────────────────────────────────",
        ];
        break;

      case "missions":
        response = [
          "TRAINING GAME DIRECTORY",
          "────────────────────────────────────────",
          ...missions.map(
            (mission) =>
              `${mission.id} // ${mission.title} // ${
                mission.completed ? "COMPLETED" : "AVAILABLE"
              } // ${mission.xp} XP`
          ),
        ];
        break;

      case "achievements":
        response = [
          "ACHIEVEMENT STATUS",
          "────────────────────────────────────────",
          ...achievements.map(
            (item) =>
              `${item.unlocked ? "[UNLOCKED]" : "[LOCKED]"} ${item.title} // +${item.reward} XP`
          ),
        ];
        break;

      case "scan":
        response = [
          "INITIALIZING SIMULATED SECURITY SCAN...",
          "",
          "[OK] Local training environment checked",
          "[OK] Terminal interface responsive",
          "[OK] Agent session active",
          "[OK] Training modules accessible",
          "[INFO] No external network scan performed",
          "",
          "SIMULATION COMPLETE. NO THREATS DETECTED.",
        ];
        break;

      case "history":
        response = updatedHistory.map(
          (item, index) => `${index + 1}  ${item}`
        );
        break;

      case "date":
        response = [new Date().toString()];
        break;

      case "pwd":
        response = ["/hacked.exe/agent"];
        break;

      case "ls":
        response = [
          "DIRECTORY CONTENTS",
          "missions/",
          "achievements/",
          "profile/",
          "terminal/",
          "README.txt",
        ];
        break;

      case "echo":
        response = [argumentText || ""];
        break;

      case "matrix":
        response = [
          "INITIALIZING THE MATRIX...",
          "01001000 01000001 01000011 01001011",
          "01000101 01000100 00101110 01000101",
          "",
          "WAKE UP, AGENT.",
          "THE SYSTEM IS WATCHING.",
          "WELCOME TO THE MATRIX.",
        ];
        break;

      case "sudo":
        response = [
          "ACCESS REQUEST RECEIVED.",
          "AUTHENTICATION REQUIRED...",
          "ACCESS DENIED.",
          "NICE TRY, ROOKIE. ;)",
        ];
        break;

      case "secret":
        response = [
          "CLASSIFIED MESSAGE",
          "",
          "THE BEST FIREWALL IS AN INFORMED HUMAN.",
          "KEEP LEARNING. STAY UNTRACEABLE.",
          "— HACKED.EXE",
        ];
        break;

      case "about":
        response = [
          "HACKED.EXE CYBER TRAINING SYSTEM",
          "An interactive cybersecurity learning environment.",
          "Practice security concepts through games and simulations.",
          "VERSION: 1.0.0 // MODE: LOCAL DEMO",
        ];
        break;

      case "clear":
        setOutput([]);
        inputRef.current?.focus();
        return;

      default:
        response = [
          `COMMAND NOT FOUND: ${rawCommand}`,
          "TYPE 'help' TO SEE AVAILABLE COMMANDS.",
        ];
    }

    setOutput((previous) => [...previous, prompt, ...response, ""]);
    inputRef.current?.focus();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (commandHistory.length === 0) return;

      const nextIndex =
        historyIndex === -1
          ? commandHistory.length - 1
          : Math.max(0, historyIndex - 1);

      setHistoryIndex(nextIndex);
      setInput(commandHistory[nextIndex]);
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (historyIndex === -1) return;

      const nextIndex = historyIndex + 1;

      if (nextIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInput("");
      } else {
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      }
    }
  };

  return (
    <section className="panel terminal-page">
      <div className="terminal-header">
        <div className="terminal-lights">
          <span />
          <span />
          <span />
        </div>

        <span className="terminal-title">
          <TerminalSquare size={14} />
          HACKED.EXE // TERMINAL
        </span>

        <span className="terminal-live">
          <span className="status-dot" />
          ONLINE
        </span>
      </div>

      <div
        className="terminal-output"
        ref={outputRef}
        onClick={() => inputRef.current?.focus()}
        role="log"
        aria-live="polite"
      >
        {output.map((line, index) => (
          <p key={`${index}-${line}`}>{line || "\u00A0"}</p>
        ))}
      </div>

      <form className="terminal-input-row" onSubmit={executeCommand}>
        <span className="terminal-prompt">agent@hacked.exe:~$</span>

        <input
          ref={inputRef}
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            setHistoryIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Enter command..."
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          aria-label="Terminal command input"
        />

        <button type="submit" disabled={!input.trim()}>
          EXECUTE <ArrowUpRight size={15} />
        </button>
      </form>

      <p className="demo-disclaimer">
        SIMULATED TERMINAL // NO EXTERNAL NETWORK ACCESS.
      </p>
    </section>
  );
};

export default Terminal;
