import React, { useState, useEffect, useRef } from 'react'
import { Rnd } from 'react-rnd'
import './window.scss'

const NAVBAR_HEIGHT = 30;
const CLOSE_MS = 180;
const MINIMIZE_MS = 300;
const MAXIMIZE_MS = 320;

const Window = ({ 
  children,
  windowsName,
  setWindowsState,
  isMinimized,
  setMinimizedWindows,
  initialWidth="50vw",
  initialHeight="65vh",
  allowResize = false, 
  allowMaximize = true,
  initialX=450,
  intitialY=130,
  initialMaximized = false // <-- 1. Add this new prop
}) => {
  
  // 2. Set the initial window state based on whether it should be maximized
  const [windowState, setWindowState] = useState({
    x: initialMaximized ? 0 : initialX,
    y: initialMaximized ? NAVBAR_HEIGHT : intitialY,
    width: initialMaximized ? window.innerWidth : initialWidth,
    height: initialMaximized ? window.innerHeight - NAVBAR_HEIGHT : initialHeight
  });

  // 3. Initialize isMaximized using the new prop
  const [isMaximized, setIsMaximized] = useState(initialMaximized);
  const [preMaximizeState, setPreMaximizeState] = useState(null);

  const [closing, setClosing] = useState(false);
  const [minimizing, setMinimizing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [maximizeAnimating, setMaximizeAnimating] = useState(false);

  // ... keep the rest of your Window.jsx exactly the same from here down ...
  const wasMinimizedRef = useRef(isMinimized);
  useEffect(() => {
    const wasMinimized = wasMinimizedRef.current;
    wasMinimizedRef.current = isMinimized;

    if (wasMinimized && !isMinimized) {
      setRestoring(true);
      const timer = setTimeout(() => setRestoring(false), MINIMIZE_MS);
      return () => clearTimeout(timer);
    }
  }, [isMinimized]);

  const handleClose = (e) => {
    e.stopPropagation();
    if (closing) return;
    setClosing(true);
    setTimeout(() => {
      setWindowsState(state => ({ ...state, [windowsName]: false }));
    }, CLOSE_MS);
  }

  const handleMinimized = (e) => {
    e.stopPropagation();
    if (minimizing) return;
    setMinimizing(true);
    setTimeout(() => {
      setMinimizedWindows(prev => ({ ...prev, [windowsName]: true }));
      setMinimizing(false);
    }, MINIMIZE_MS);
  }

  const handleMaximize = () => {
    if (!allowMaximize) return;
    setMaximizeAnimating(true);
    
    if (isMaximized) {
      setWindowState(preMaximizeState);
      setIsMaximized(false);
    } else {
      setPreMaximizeState(windowState);
      
      // Update: Window now takes up the entire screen (minus the top navbar)
      // covering the dock on the left.
      setWindowState({
        x: 0,
        y: NAVBAR_HEIGHT,
        width: window.innerWidth,
        height: window.innerHeight - NAVBAR_HEIGHT
      });
      setIsMaximized(true);
    }
    setTimeout(() => setMaximizeAnimating(false), MAXIMIZE_MS);
  }

  return (
    <Rnd 
      size={{ width: windowState.width, height: windowState.height }}
      position={{ x: windowState.x, y: windowState.y }}
      bounds="parent"
      enableResizing={allowResize}
      onDragStop={(e, d) => {
        if (!isMaximized) {
            setWindowState(prev => ({ ...prev, x: d.x, y: d.y }));
        }
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        if (!isMaximized) {
          setWindowState({
            width: ref.style.width,
            height: ref.style.height,
            ...position,
          });
        }
      }}
      disableDragging={isMaximized}
      dragHandleClassName="navbar"
      cancel=".dots"
      className={`rnd-shell ${maximizeAnimating ? 'rnd-animating' : ''}`}
      style={{ 
        display: (isMinimized && !minimizing) ? 'none' : 'block',
        // Update: Force a z-index of 100 when maximized so it covers the dock (z-index: 90)
        zIndex: isMaximized ? 100 : undefined 
      }}
    >
      <div className={`windows ${isMaximized ? 'maximized' : ''} ${closing ? 'closing' : ''} ${minimizing ? 'minimizing' : ''} ${restoring ? 'restoring' : ''}`}>
        <div className="navbar" onDoubleClick={allowMaximize ? handleMaximize : undefined}>
          
          <div className="title"><p>{windowsName}</p></div>

          <div className='dots'>
            <div className="dot grey" onClick={handleMinimized}>
                <span className='minimize-icon'>&#8212;</span>
            </div>

           <div
              className={`dot grey ${!allowMaximize ? 'disabled' : ''}`}
              onClick={allowMaximize ? handleMaximize : undefined}
            >
                <span className='full-icon'>&#9633;</span>
            </div>

            <div className='dot orange' onClick={handleClose}>
              <span className='close-icon'>✕</span>
            </div>
          </div>
        </div>
        
        <div className="main-content">
          {children}
        </div>
      </div>
    </Rnd>
  )
}

export default Window