import React, { useState, useEffect } from "react";
import {
  Terminal,
  Database,
  Server,
  ExternalLink,
  PlayCircle,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import Window from "./Window";
import "./aboutme.scss";

const AboutMe = ({
  windowsName,
  setWindowsState,
  isMinimized,
  setMinimizedWindows,
}) => {
  // --- Theme State ---
  const [theme, setTheme] = useState("light");

  // --- Typing Animation Logic ---
  const line1 =
    "I'm a backend engineer focused on infrastructure, APIs, and systems that hold up under real traffic.";
  const line2 =
    "From building a self-hosted API gateway to architecting a microservices game backend over gRPC, I care about what's happening under the hood, not just whether the demo works.";
  const [charIndex1, setCharIndex1] = useState(0);
  const [charIndex2, setCharIndex2] = useState(0);
  const [typingComplete, setTypingComplete] = useState(false);

  useEffect(() => {
    if (charIndex1 < line1.length) {
      const timeout = setTimeout(() => setCharIndex1((prev) => prev + 1), 25);
      return () => clearTimeout(timeout);
    } else if (charIndex1 === line1.length && charIndex2 === 0) {
      const timeout = setTimeout(() => setCharIndex2(1), 300); // Pause between lines
      return () => clearTimeout(timeout);
    } else if (charIndex2 > 0 && charIndex2 <= line2.length) {
      const timeout = setTimeout(() => setCharIndex2((prev) => prev + 1), 25);
      return () => clearTimeout(timeout);
    } else if (charIndex2 > line2.length) {
      setTypingComplete(true);
    }
  }, [charIndex1, charIndex2, line1.length, line2.length]);

  const skills = [
    "Node.js",
    "Go",
    "PostgreSQL",
    "MongoDB",
    "React",
    "TypeScript",
    "JavaScript",
    "Docker",
    "Linux",
    "Git",
    "Redis",
    "gRPC",
  ];

  const projects = [
    {
      id: 1,
      title: "GateX — Self-Hosted API Gateway",
      desc: "A production-grade API Gateway built from scratch. Developers register their backend services, get an API key, and all traffic flows through GateX — which handles authentication, rate limiting, request forwarding, async logging, and real-time analytics automatically.",
      tags: ["Node.js", "PostgreSQL", "Drizzle", "Redis"],
      github: "https://github.com/Tusharsoni3/Api_gateway",
      live: "",
      video: "",
    },
    {
      id: 2,
      title: "EncryptedChat (JettMessage)",
      desc: "Real-time, end-to-end encrypted chat with WebSocket-based delivery, at-least-once delivery via client-side idempotency keys, Redis-backed presence, and a BullMQ offline message queue.",
      tags: ["Node.js", "React", "Redis", "BullMQ", "PostgreSQL"],
      github: "https://github.com/Tusharsoni3/JettMessage",
      live: "",
      video: "",
    },
    {
      id: 3,
      title: "Spawn Point",
      desc: "A backend platform for solo game developers — handling authentication, leaderboards, and ELO-based matchmaking as independent microservices.",
      tags: ["Go", "Node.js", "Microservices", "gRPC", "Docker"],
      github: "https://github.com/Tusharsoni3/SpawnPoint-",
      live: "",
      video: "",
    },
  ];

  // ... top of AboutMe.jsx remains the same ...

  return (
    <Window
      windowsName={windowsName}
      setWindowsState={setWindowsState}
      isMinimized={isMinimized}
      setMinimizedWindows={setMinimizedWindows}
      initialMaximized={true}
      allowMaximize={false}
    >
      <section className="about-section" data-theme={theme}>
        {/* Decorative Grid Texture */}
        <div className="about-section__bg-grid"></div>

        {/* ... rest of the component ... */}
        {/* Main Ubuntu-style Window Container */}
        <div className="terminal-window">
          {/* Window Header */}
          <div className="terminal-window__header">
            <div className="controls">
              <div className="dot dot--close"></div>
              <div className="dot dot--min"></div>
              <div className="dot dot--max"></div>
            </div>
            <span className="title">tushar@system: ~/about</span>
            <button
              className="theme-toggle-btn"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? "DARK MODE" : "LIGHT MODE"}
            </button>
          </div>

          {/* Window Body */}
          <div className="terminal-window__body">
            {/* --- SECTION 1: BIO & SYSTEM INFO --- */}
            <div className="hero-section">
              {/* Left Column: Terminal / Bio */}
              <div className="bio-content">
                <div className="hero-title">
                  <h1>
                    <span className="highlight-box"></span>
                    <span>Bonjour </span>
                  </h1>
                  <h2>
                    I build <span className="text-accent">Scalable</span>{" "}
                    backend systems.
                  </h2>
                </div>

                {/* Dynamic Terminal Window */}
                <div className="cli-box">
                  <div className="sticker">RAW & UNFILTERED</div>

                  <p className="cli-line">
                    <span className="prompt">{">"}</span>
                    {line1.substring(0, charIndex1)}
                  </p>

                  <p className="cli-line">
                    {charIndex2 > 0 && (
                      <>
                        <span className="prompt">{">"}</span>
                        {line2.substring(0, charIndex2 - 1)}
                      </>
                    )}
                  </p>

                  <p className="cli-line">
                    <span className="prompt">{">"}</span>
                    <span className={`cursor ${typingComplete ? "blink" : ""}`}>
                      _
                    </span>
                  </p>
                </div>
              </div>

              {/* Right Column: Tech Stack "Neofetch" Output */}
              <div className="neofetch-panel">
                <h3 className="neofetch-panel__title">System Specs</h3>

                <div className="spec-list">
                  <div className="spec-item">
                    <div className="icon-box icon-box--server">
                      <Server />
                    </div>
                    <div className="spec-text">
                      <p className="label">Core Runtime</p>
                      <p className="value">Go, Node.js</p>
                    </div>
                  </div>

                  <div className="spec-item">
                    <div className="icon-box icon-box--db">
                      <Database />
                    </div>
                    <div className="spec-text">
                      <p className="label">Data Layer</p>
                      <p className="value">PostgreSQL, Drizzle</p>
                    </div>
                  </div>
                </div>

                {/* Interactive "Action" Badges */}
                <div className="action-badges">
                  {["Backend", "System Config", "Algorithms"].map((tag) => (
                    <span key={tag} className="badge">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* --- SECTION 2: SKILLS --- */}
            <div className="skills-section">
              <h3>Tech Arsenal</h3>
              <div className="skills-grid">
                {skills.map((skill) => (
                  <div key={skill} className="skill-badge">
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            {/* --- SECTION 3: PROJECTS --- */}
            <div className="projects-section">
              <h3>Featured Builds</h3>
              <div className="projects-grid">
                {projects.map((project) => (
                  <div key={project.id} className="project-card">
                    <div className="card-header">{project.title}</div>
                    <div className="card-body">{project.desc}</div>
                    <div className="card-footer">
                      {project.tags.map((tag) => (
                        <span key={tag} className="tech-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {(project.github || project.live || project.video) && (
                      <div className="card-links">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link-btn"
                          >
                            <FaGithub size={14} /> Code
                          </a>
                        )}
                        {project.live && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link-btn"
                          >
                            <ExternalLink size={14} /> Live
                          </a>
                        )}
                        {project.video && (
                          <a
                            href={project.video}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link-btn"
                          >
                            <PlayCircle size={14} /> Demo
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Window>
  );
};

export default AboutMe;
