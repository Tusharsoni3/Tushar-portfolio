import React, { useState, useEffect, useRef } from 'react'
import Window from './Window'
import './terminal.scss'

const Cli = ({ windowsName,
              setWindowsState,
              isMinimized,
              setMinimizedWindows }) => {

    const scrollRef = useRef(null);
    const inputRef = useRef(null); 

    // Converted to JSX so we can style the command names
    const welcomeMessage = (
      <div>
        <br />
        <div>Hello! Welcome to my interactive portfolio. You can navigate through my work experience, skills, and projects using terminal commands.</div>
        <br />
        <div>Type 'help' to see all available commands, or try:</div>
        <div><span className="help-cmd">about</span>{`        - Who am I?`}</div>
        <div><span className="help-cmd">skills</span>{`       - My tech stack`}</div>
        <div><span className="help-cmd">projects</span>{`     - Check out my work`}</div>
        <div><span className="help-cmd">experience</span>{`   - Learn about my professional background`}</div>
        <div><span className="help-cmd">contact</span>{`      - Get in touch with me`}</div>
        <div><span className="help-cmd">github</span>{`       - Check out my github profile`}</div>
        <div><span className="help-cmd">resume</span>{`       - Download my resume`}</div>
        <div><span className="help-cmd">clear</span>{`        - Clear terminal`}</div>
        <br />
      </div>
    );

  const fileSystem = {
    'about.txt': () => 'Final-year CS student and backend engineer, focused on backend systems, Creating scalable System  ,infrastructure, and API design (Node.js, Go , TypeScript , JavaScript).',
    'skills.txt': () => `Backend: Node.js, Express, Golang , TypeScript , JavaScript \nDatabases: PostgreSQL, MongoDB, Redis\nInfra: Docker, AWS\nFrontend: React, JS/TS, SCSS\n`,
    'projects.txt': () => `1. GateX - self-hosted API gateway (rate limiting, JWT auth, analytics dashboard)\n2. EncryptedChat - E2EE real-time chat app (AES-256-GCM, Socket.io)\n3. Multiplayer Game Backend Platform - mini PlayFab-style microservices (in progress)\n4. This portfolio - interactive OS-style UI\n\nType 'project <name>' for details.`,
    'contact.txt': () => `Email: tstushar342@gmail.com\nLinkedIn: linkedin.com/in/tushar-soni-852978405\nGitHub: github.com/tusharsoni3\nLocation: Bhopal, India`,
    'experience.txt': () => ` currently building production-grade projects (GateX, EncryptedChat, and an in-progress multiplayer game backend platform) and prepping for campus placements via DSA practice.`,
  };

  const projectDetails = {
    gatex: `GateX: A production-grade API Gateway built from scratch. Developers register their backend services, get an API key, and all traffic flows through GateX — which handles authentication, rate limiting, request forwarding, async logging, and real-time analytics automatically.\n\nStack: Express 5, Drizzle ORM, Neon DB, Redis. Features: sliding-window rate limiting, async logging pipeline, API key generation & caching, React analytics dashboard.\n`,
    encryptedchat: `JettMessage: A real-time, end-to-end encrypted chat application focused on reliable message delivery and a responsive messaging experience. Combines WebSocket-based real-time transport with at-least-once delivery semantics, end-to-end encryption, presence tracking, and offline message queuing.\n\nStack: Web Crypto API (E2EE), RSA-OAEP key exchange, Socket.io, BullMQ offline queuing, Redis TTL-based presence, Google OAuth (Passport.js).`,
    gamebackend: `Multiplayer Game Backend Platform (in progress): A mini PlayFab/GameSparks-style backend, built as 4 microservices — Player, Matchmaking, Game Session, and Leaderboard — in Node.js and Go, communicating over gRPC. Redis handles distributed locks and leaderboard ranking.\n\nStatus: architecture and schema finalized, actively building.`
  };

  const commands = {
    about: { fn: () => fileSystem['about.txt']() },
    skills: { fn: () => fileSystem['skills.txt']() },
    projects: { fn: () => fileSystem['projects.txt']() },
    project: {
      fn: (name) => projectDetails[name?.toLowerCase()] || `Unknown project. Try: gatex, encryptedchat, gamebackend`
    },
    experience: { fn: () => fileSystem['experience.txt']() },
    arch: { fn: () => `I use Arch Linux (btw). I customize my workflow heavily using tiling window managers and custom dotfiles.` },
    contact: { fn: () => fileSystem['contact.txt']() },
    github: { fn: () => { window.open('https://github.com/tusharsoni3', '_blank'); return 'Opening GitHub...'; } },
    echo: { fn: (...args) => args.join(' ') },
    whoami: { fn: () => 'Your friendly neighborhood Developer Tushar ' },
    sudo: { fn: () => 'tushar is not in the sudoers file. This incident will be reported.' },
    ls: { fn: () => Object.keys(fileSystem).join('  ') },
    cat: {
      fn: (filename) => {
        if (!filename) return 'usage: cat <filename>';
        const content = fileSystem[filename] || fileSystem[`${filename}.txt`];
        return content ? content() : `cat: ${filename}: No such file or directory`;
      }
    },
    history: {
      fn: () => history.filter(line => typeof line === 'string' && line.startsWith('tushar@ubuntu')).join('\n') || 'No commands yet.'
    },
    // Converted to JSX to colorize command names
    help: {
      fn: () => (
        <div>
          <br />
          <div>Available commands:</div>
          <div>-------------------</div>
          <div><span className="help-cmd">about</span>{`        - Who am I?`}</div>
          <div><span className="help-cmd">skills</span>{`       - My tech stack`}</div>
          <div><span className="help-cmd">projects</span>{`     - Check out my work`}</div>
          <div><span className="help-cmd">project</span>{`      - Details on a specific project (e.g. project gatex)`}</div>
          <div><span className="help-cmd">experience</span>{`   - Learn about my professional background`}</div>
          <div><span className="help-cmd">arch</span>{`         - My system config`}</div>
          <div><span className="help-cmd">contact</span>{`      - Get in touch with me`}</div>
          <div><span className="help-cmd">github</span>{`       - Check out my github profile`}</div>
          <div><span className="help-cmd">resume</span>{`       - Download my resume`}</div>
          <div><span className="help-cmd">whoami</span>{`       - Who's logged in`}</div>
          <div><span className="help-cmd">ls</span>{`           - List files`}</div>
          <div><span className="help-cmd">cat</span>{`          - Read a file (e.g. cat about.txt)`}</div>
          <div><span className="help-cmd">history</span>{`      - Show command history`}</div>
          <div><span className="help-cmd">clear</span>{`        - Clear terminal`}</div>
          <br />
        </div>
      )
    },
    clear: { fn: 'clear' }
  };

  const [history, setHistory] = useState([welcomeMessage]);
  const [input, setInput] = useState('');

   useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const parts = input.trim().split(' ');
      const commandName = parts[0].toLowerCase();
      const args = parts.slice(1);
      
      let response = '';

      if (commands[commandName]) {
        if (commandName === 'clear') {
          setHistory([]);
          setInput('');
          return;
        }
        response = commands[commandName].fn(...args);
      } else if (input.trim() === '') {
        response = '';
      } else {
        response = `Command not found: ${commandName}. Type 'help' for assistance.`;
      }

      setHistory([...history, `tushar@ubuntu:~$ ${input}`, response]);
      setInput('');
    }
  };

  return (
    <Window  windowsName={windowsName} setWindowsState={setWindowsState} isMinimized={isMinimized}
      setMinimizedWindows={setMinimizedWindows}>
      <div className='console' onClick={() => inputRef.current?.focus()}>
        <div className="terminal-body" ref={scrollRef}>
          {history.map((line, i) => {
            if (typeof line === 'string' && line.startsWith('tushar@ubuntu:~$')) {
              const cmd = line.substring(16);
              return (
                <div key={i} className="terminal-line">
                  <span className="prompt-user">tushar@ubuntu</span>:<span className="prompt-dir">~</span>$ {cmd}
                </div>
              );
            }
            return <div key={i} className="terminal-line">{line}</div>;
          })}
          
          <div className="input-area">
            <span className="prompt-user">tushar@ubuntu</span>:<span className="prompt-dir">~</span>$&nbsp;
            <input 
              ref={inputRef}
              autoFocus
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleCommand}
              autoComplete="off"
              className="cli-input"
              style={{ 
               background: 'transparent',
                border: 'none', 
                color: 'inherit', 
                outline: 'none', 
                flex: 1,
                fontFamily: 'inherit',
                fontSize: 'inherit',
              }}
            />
          </div>
        </div>
      </div>
    </Window>
  );
};

export default Cli;