export type TerminalContext = {
  name: string;
  username: string;
  xp: number;
  completed: number;
  totalMissions: number;
};

const commands = [
  "help",
  "whoami",
  "profile",
  "status",
  "missions",
  "achievements",
  "scan",
  "history",
  "matrix",
  "about",
  "pwd",
  "ls",
  "date",
  "echo",
  "clear",
];

export function executeTerminalCommand(
  input: string,
  context: TerminalContext
): string {
  const trimmed = input.trim();

  if (!trimmed) return "";

  const [command, ...args] = trimmed.split(" ");
  const argument = args.join(" ");

  switch (command.toLowerCase()) {
    case "help":
      return `
╔══════════════════════════════════════╗
       HACKED.EXE — COMMAND DIRECTORY
╚══════════════════════════════════════╝

  SYSTEM
  whoami          Identify current agent
  status          System status
  date            Current system date
  pwd             Current directory
  ls              List files

  OPERATIONS
  missions        View available missions
  achievements   View achievement progress
  scan            Run security diagnostics
  history         View command history

  UTILITIES
  echo <text>     Print a message
  matrix          Enter the Matrix
  profile         View agent profile
  clear           Clear terminal

  about           About HACKED.EXE
`;

    case "whoami":
      return `
╔══════════════════════════════════════╗
              AGENT IDENTIFIED
╚══════════════════════════════════════╝

  NAME       : ${context.name}
  USERNAME   : @${context.username}
  CLEARANCE  : ROOKIE AGENT
  STATUS     : ACTIVE
  ACCESS     : AUTHORIZED
`;

    case "profile":
      return `
[ AGENT PROFILE ]

Name       : ${context.name}
Username   : @${context.username}
Experience : ${context.xp} XP
Missions   : ${context.completed}/${context.totalMissions}
`;

    case "status":
      return `
[ SYSTEM DIAGNOSTICS ]

Core status       : ONLINE
Network           : CONNECTED
Firewall          : ACTIVE
Threat detection  : ENABLED
Agent             : ${context.username}
Experience        : ${context.xp} XP

All systems operational.
`;

    case "missions":
      return `
[ MISSION DATABASE ]

01  PASSWORD BREAKER
02  CODE DECODER
03  PHISHING DETECTIVE

Completed missions: ${context.completed}/${context.totalMissions}

Mission database synchronized.
`;

    case "achievements":
      return `
[ ACHIEVEMENT TRACKER ]

Total XP          : ${context.xp}
Completed missions: ${context.completed}
Remaining missions: ${Math.max(
        0,
        context.totalMissions - context.completed
      )}

Keep completing missions to unlock achievements.
`;

    case "scan":
      return `
[ INITIATING SECURITY SCAN ]

> Checking system integrity...
> Scanning network interfaces...
> Inspecting firewall...
> Checking suspicious processes...
> Analyzing access permissions...

[ SCAN COMPLETE ]

No critical vulnerabilities detected.
System integrity: STABLE
`;

    case "matrix":
      return `
01001000 01000001 01000011 01001011
01000101 01000100 00101110 01000101
01011000 01000101

Wake up, ${context.username}.
The system is watching.
`;

    case "history":
      return "Command history is maintained by the terminal session.";

    case "pwd":
      return "/root/hacked-exe";

    case "ls":
      return `
drwxr-xr-x  system/
drwxr-xr-x  missions/
drwxr-xr-x  rookies/
-rwxr-xr-x  security.exe
-rw-r--r--  agent.config
`;

    case "date":
      return new Date().toString();

    case "echo":
      return argument || "Usage: echo <message>";

    case "about":
      return `
HACKED.EXE
GLOBAL CYBERSECURITY TRAINING SYSTEM

Train your skills.
Understand vulnerabilities.
Think like a defender.

Version: 1.0.0
`;

    case "sudo":
      return `
ACCESS DENIED.

This incident has been logged.
Unauthorized privilege escalation detected.
`;

    case "secret":
      return `
[ HIDDEN MESSAGE UNLOCKED ]

Curiosity is your greatest weapon.
Keep exploring, Agent.
`;

    case "clear":
      return "__CLEAR__";

    default:
      return `
COMMAND NOT RECOGNIZED: ${command}

Type 'help' to see available commands.
`;
  }
}