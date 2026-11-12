
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Eye,
  Globe,
  Network,
  ShieldAlert,
  TerminalSquare,
  Lock,
  Zap,
} from "lucide-react";

import "./RookiesAcademy.css";

const modules = [
  {
    number: "01",
    title: "CYBERSECURITY BASICS",
    icon: ShieldAlert,
    description: "Understand how digital systems and information are protected.",
    topics: ["CIA Triad", "Threats", "Vulnerabilities", "Authentication"],
    lessons: [
      {
        heading: "What is Cybersecurity?",
        body: "Cybersecurity is the practice of protecting computers, networks, applications and data from unauthorised access, damage or attacks.",
        example: "Using multi-factor authentication to protect your email account is a simple cybersecurity practice.",
      },
      {
        heading: "The CIA Triad",
        body: "The CIA Triad is a fundamental security model consisting of Confidentiality, Integrity and Availability.",
        example: "Confidentiality keeps information private. Integrity prevents unauthorised changes. Availability ensures systems remain accessible.",
      },
      {
        heading: "Threats and Vulnerabilities",
        body: "A threat is something that could cause harm. A vulnerability is a weakness that could be exploited.",
        example: "A weak password is a vulnerability. Someone attempting to guess it is a threat.",
      },
    ],
    question: "What does the C in the CIA Triad stand for?",
    options: ["Connectivity", "Confidentiality", "Control", "Cryptography"],
    answer: "Confidentiality",
  },
  {
    number: "02",
    title: "NETWORKING 101",
    icon: Network,
    description: "Discover how devices communicate across networks.",
    topics: ["IP Addresses", "DNS", "Ports", "TCP / UDP"],
    lessons: [
      {
        heading: "What is a Network?",
        body: "A computer network is a group of connected devices that communicate and share information or resources.",
        example: "Your laptop and phone connected to the same Wi-Fi network are part of a local network.",
      },
      {
        heading: "IP Addresses",
        body: "An IP address is a numerical identifier used to identify a device or network interface and help route information.",
        example: "An IPv4 address looks like 192.168.1.10.",
      },
      {
        heading: "DNS and Ports",
        body: "DNS translates domain names into IP addresses. Ports help identify which service or application should receive network traffic.",
        example: "When you visit a website, DNS helps locate its server. HTTPS commonly uses port 443.",
      },
    ],
    question: "What does DNS primarily do?",
    options: [
      "Encrypt files",
      "Translate domain names into IP addresses",
      "Remove viruses",
      "Create passwords",
    ],
    answer: "Translate domain names into IP addresses",
  },
  {
    number: "03",
    title: "LINUX ESSENTIALS",
    icon: TerminalSquare,
    description: "Learn the basic commands used in Linux environments.",
    topics: ["Navigation", "Files", "Directories", "Commands"],
    lessons: [
      {
        heading: "Meet Linux",
        body: "Linux is an open-source operating system widely used in servers, development environments and cybersecurity.",
        example: "Many security professionals use Linux distributions such as Ubuntu and Kali Linux.",
      },
      {
        heading: "Navigation Commands",
        body: "Commands help you navigate and interact with the filesystem.",
        example: "pwd displays your current directory. ls lists files. cd changes directories.",
      },
      {
        heading: "Working with Files",
        body: "Linux provides commands to create, read and search files.",
        example: "mkdir creates a directory. cat displays file contents. grep searches text for matching patterns.",
      },
    ],
    question: "Which command displays your current directory?",
    options: ["ls", "cd", "pwd", "mkdir"],
    answer: "pwd",
  },
  {
    number: "04",
    title: "WEB SECURITY",
    icon: Globe,
    description: "Explore the security foundations behind websites.",
    topics: ["HTTPS", "Cookies", "Sessions", "XSS"],
    lessons: [
      {
        heading: "HTTP vs HTTPS",
        body: "HTTP transfers web information. HTTPS protects communication using TLS encryption.",
        example: "A secure website typically uses an HTTPS address and a valid certificate.",
      },
      {
        heading: "Cookies and Sessions",
        body: "Cookies store small pieces of information in a browser. Sessions help applications maintain a user's authenticated state.",
        example: "A website may use a session to keep you signed in while navigating between pages.",
      },
      {
        heading: "Common Web Vulnerabilities",
        body: "Cross-site scripting (XSS) involves injecting malicious scripts into pages viewed by other users. SQL injection involves manipulating database queries through unsafe input handling.",
        example: "Developers reduce these risks through input validation, output encoding and parameterised database queries.",
      },
    ],
    question: "Which protocol helps encrypt website communication?",
    options: ["FTP", "HTTP", "HTTPS", "DNS"],
    answer: "HTTPS",
  },
  {
    number: "05",
    title: "THREAT AWARENESS",
    icon: Eye,
    description: "Recognise common attacks and suspicious online behaviour.",
    topics: ["Phishing", "Malware", "Social Engineering", "Safety"],
    lessons: [
      {
        heading: "Understanding Phishing",
        body: "Phishing is a social-engineering technique in which attackers impersonate trusted organisations to trick people into revealing information or taking unsafe actions.",
        example: "An unexpected email asking you to verify your bank account through an unfamiliar link may be phishing.",
      },
      {
        heading: "Malware",
        body: "Malware is software designed to harm systems, steal information or perform unwanted activities.",
        example: "Ransomware can lock files and demand payment for their recovery.",
      },
      {
        heading: "Stay Alert",
        body: "Be cautious with unexpected attachments, suspicious links, urgent requests and messages asking for passwords or verification codes.",
        example: "Instead of clicking an email link, visit the organisation's official website directly.",
      },
    ],
    question: "What is the safest response to a suspicious email link?",
    options: [
      "Click it immediately",
      "Forward it to everyone",
      "Enter your password",
      "Verify the sender and visit the official website directly",
    ],
    answer: "Verify the sender and visit the official website directly",
  },
];

const RookiesAcademy = () => {
  const [selected, setSelected] = useState<number | null>(null);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [completed, setCompleted] = useState<string[]>(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("hacked_rookies_progress") || "[]"
      );
      return Array.isArray(saved) ? saved : [];
    } catch {
      return [];
    }
  });
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      "hacked_rookies_progress",
      JSON.stringify(completed)
    );
  }, [completed]);

  const activeModule = selected === null ? null : modules[selected];
  const activeLesson = activeModule?.lessons[lessonIndex];
  const progress = Math.round((completed.length / modules.length) * 100);

  const finishModule = () => {
    if (!activeModule) return;

    setCompleted((previous) =>
      previous.includes(activeModule.number)
        ? previous
        : [...previous, activeModule.number]
    );

    setSelected(null);
    setLessonIndex(0);
    setAnswer("");
    setChecked(false);
  };

  if (activeModule && activeLesson) {
    const isLastLesson =
      lessonIndex === activeModule.lessons.length - 1;

    return (
      <section className="rookie-academy">
        <button
          className="rookie-back"
          onClick={() => {
            setSelected(null);
            setLessonIndex(0);
            setAnswer("");
            setChecked(false);
          }}
        >
          <ArrowLeft size={16} /> BACK TO ACADEMY
        </button>

        <div className="rookie-lesson panel">
          <div className="rookie-lesson-top">
            <span>MODULE {activeModule.number}</span>
            <span>
              LESSON {lessonIndex + 1}/{activeModule.lessons.length}
            </span>
          </div>

          <div className="rookie-lesson-progress">
            <div
              style={{
                width: `${
                  ((lessonIndex + 1) /
                    activeModule.lessons.length) *
                  100
                }%`,
              }}
            />
          </div>

          <h2>{activeModule.title}</h2>
          <p className="eyebrow">YOUR LEARNING SESSION</p>

          <div className="rookie-lesson-content">
            <h3>{activeLesson.heading}</h3>
            <p>{activeLesson.body}</p>

            <div className="rookie-example">
              <strong>REAL-WORLD EXAMPLE</strong>
              <p>{activeLesson.example}</p>
            </div>
          </div>

          {!isLastLesson ? (
            <button
              className="launch-button"
              onClick={() => setLessonIndex((previous) => previous + 1)}
            >
              NEXT LESSON <ArrowRight size={16} />
            </button>
          ) : (
            <div className="rookie-quiz">
              <div className="rookie-quiz-heading">
                <Zap size={19} />
                <strong>KNOWLEDGE CHECK</strong>
              </div>

              <h3>{activeModule.question}</h3>

              <div className="rookie-options">
                {activeModule.options.map((option) => (
                  <button
                    key={option}
                    disabled={checked}
                    className={`rookie-option ${
                      answer === option ? "selected" : ""
                    } ${
                      checked && option === activeModule.answer
                        ? "correct"
                        : ""
                    }`}
                    onClick={() => setAnswer(option)}
                  >
                    {option}
                    {checked && option === activeModule.answer && (
                      <CheckCircle2 size={17} />
                    )}
                  </button>
                ))}
              </div>

              {checked && (
                <p className={answer === activeModule.answer ? "quiz-correct" : "quiz-wrong"}>
                  {answer === activeModule.answer
                    ? "CORRECT. KNOWLEDGE VERIFIED."
                    : `NOT QUITE. THE CORRECT ANSWER IS: ${activeModule.answer}`}
                </p>
              )}

              {!checked ? (
                <button
                  className="launch-button"
                  disabled={!answer}
                  onClick={() => setChecked(true)}
                >
                  CHECK ANSWER <ArrowRight size={16} />
                </button>
              ) : answer === activeModule.answer ? (
                <button
                  className="launch-button"
                  onClick={finishModule}
                >
                  COMPLETE MODULE <CheckCircle2 size={16} />
                </button>
              ) : (
                <button
                  className="launch-button"
                  onClick={() => {
                    setAnswer("");
                    setChecked(false);
                  }}
                >
                  TRY AGAIN <ArrowRight size={16} />
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="rookie-academy">
      <div className="rookie-progress-panel panel">
        <div>
          <p className="eyebrow">YOUR LEARNING PROGRESS</p>
          <h2>{completed.length} / 5 MODULES COMPLETED</h2>
          <p className="muted">
            Every lesson brings you one step closer to becoming an elite agent.
          </p>
        </div>

        <div className="rookie-progress-number">{progress}%</div>

        <div className="rookie-lesson-progress">
          <div style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="rookie-module-grid">
        {modules.map((module, index) => {
          const Icon = module.icon;
          const done = completed.includes(module.number);

          return (
            <article className="rookie-module-card" key={module.number}>
              <div className="rookie-module-top">
                <span>MODULE {module.number}</span>
                {done ? (
                  <CheckCircle2 className="completed-icon" size={20} />
                ) : (
                  <Icon size={21} />
                )}
              </div>

              <h3>{module.title}</h3>
              <p>{module.description}</p>

              <div className="rookie-topic-list">
                {module.topics.map((topic) => (
                  <span key={topic}>{topic}</span>
                ))}
              </div>

              <button
                className="launch-button"
                onClick={() => {
                  setSelected(index);
                  setLessonIndex(0);
                  setAnswer("");
                  setChecked(false);
                }}
              >
                {done ? "REVISIT MODULE" : "START LEARNING"}
                <ArrowRight size={16} />
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default RookiesAcademy;
