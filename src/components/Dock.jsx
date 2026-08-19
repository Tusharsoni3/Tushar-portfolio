import React, { useState } from 'react'
import './dock.scss'
import apps from './appsConfig'

const BOUNCE_MS = 500;

const Dock = ({ windowsState, setWindowsState, setMinimizedWindows, showAppGrid, setShowAppGrid }) => {

  // Which icon is currently playing its "launching" bounce
  const [bouncingId, setBouncingId] = useState(null);

  const handleClick = (app) => {
    setBouncingId(app.id);
    setTimeout(() => {
      setBouncingId(current => (current === app.id ? null : current));
    }, BOUNCE_MS);

    if (app.kind === 'window') {
      setWindowsState(s => ({ ...s, [app.id]: true }));
      setMinimizedWindows(s => ({ ...s, [app.id]: false }));
    } else if (app.kind === 'external') {
      window.open(app.href, '_blank');
    }
  };

  return (
    <footer className='dock'>
      <div className="dock-apps">
        {apps.map(app => (
          <div
            key={app.id}
            className={`icon ${bouncingId === app.id ? 'bounce' : ''}`}
            onClick={() => handleClick(app)}
          >
            <span className="dock-tooltip">{app.label}</span>
            <img src={app.icon} alt={app.label} />
            {app.kind === 'window' && windowsState[app.id] && <div className="dot"></div>}
          </div>
        ))}
      </div>

      {/* Show Applications */}
      <div
        className={`icon show-apps ${showAppGrid ? 'active' : ''}`}
        onClick={() => setShowAppGrid(v => !v)}
      >
        <span className="dock-tooltip">Show Applications</span>
        <img src="/icons/ubuntu.webp" alt="Show Applications" />
      </div>
    </footer>
  )
}

export default Dock