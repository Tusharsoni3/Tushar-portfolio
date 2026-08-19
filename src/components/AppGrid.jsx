import React, { useEffect, useState } from 'react'
import './appgrid.scss'
import apps from './appsConfig'

// Keep in sync with app-grid-out's duration in appgrid.scss
const EXIT_MS = 160;

const AppGrid = ({ visible, onClose, onLaunch }) => {

  // Lag the actual unmount behind `visible` so the fade/scale-out animation
  // has time to finish before the overlay disappears from the DOM.
  const [shouldRender, setShouldRender] = useState(visible);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      setClosing(false);
      return;
    }
    if (!shouldRender) return; 
    setClosing(true);
    const timer = setTimeout(() => {
      setShouldRender(false);
      setClosing(false);
    }, EXIT_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // Esc closes it, same as GNOME's activities overview
  useEffect(() => {
    if (!visible) return;
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [visible, onClose]);

  if (!shouldRender) return null;

  return (
    <div className={`app-grid-overlay ${closing ? 'closing' : ''}`} onClick={onClose}>
      <div className="app-grid" onClick={(e) => e.stopPropagation()}>
        {apps.map((app, index) => (
          <button
            key={app.id}
            className="app-tile"
            style={{ '--tile-index': index }}
            onClick={() => { onLaunch(app); onClose(); }}
          >
            <span className="tile-icon"><img src={app.icon} alt="" /></span>
            <span className="tile-label">{app.label}</span>
          </button>
        ))}
      </div>

      <div className="page-dots">
        <span className="page-dot active"></span>
      </div>
    </div>
  );
};

export default AppGrid;