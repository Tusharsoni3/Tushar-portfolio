import { useState, useEffect } from 'react' // <-- Add useEffect here
import './app.scss'
import Dock from './components/Dock'
import Navbar from './components/Navbar'
import Terminal from './components/Cli'
import Calendar from './components/Calendar'
import NoteApp from './components/Notes'
import AboutMe from './components/AboutMe'
import AppGrid from './components/AppGrid'
import ResumeViewer from './components/ResumeViewer'

function App() {
  // --- F11 Message State & Timer ---
  const [showF11Msg, setShowF11Msg] = useState(true);

  useEffect(() => {
    // Hide the message after 5 seconds
    const timer = setTimeout(() => {
      setShowF11Msg(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);
  // ---------------------------------

  const [windowsState, setWindowsState] = useState({
    github: false,
    notes: false,
    resume: false,
    spotify: false,
    Terminal: true,
    calendar: false,
    aboutme: false
  })

  const [minimizedWindows, setMinimizedWindows] = useState({
    Terminal: false,
    calendar: false,
    spotify: false,
    aboutme: false,
    resume: false
  })

  const [showAppGrid, setShowAppGrid] = useState(false)

  const handleLaunch = (app) => {
    if (app.kind === 'window') {
      setWindowsState(s => ({ ...s, [app.id]: true }))
      setMinimizedWindows(s => ({ ...s, [app.id]: false }))
    } else if (app.kind === 'external') {
      window.open(app.href, '_blank')
    }
  }

  return (
    <main>
      {/* --- F11 Toast Message --- */}
      <div className={`f11-toast ${!showF11Msg ? 'fade-out' : ''}`}>
        Press <strong>F11</strong> for the full OS experience
      </div>

      <Dock 
        windowsState={windowsState} 
        setWindowsState={setWindowsState} 
        minimizedWindows={minimizedWindows}
        setMinimizedWindows={setMinimizedWindows}
        showAppGrid={showAppGrid}
        setShowAppGrid={setShowAppGrid}
      />
      <Navbar/>

      <AppGrid
        visible={showAppGrid}
        onClose={() => setShowAppGrid(false)}
        onLaunch={handleLaunch}
      />

      {windowsState.Terminal && (
        <Terminal 
          windowsName="Terminal" 
          setWindowsState={setWindowsState}
          isMinimized={minimizedWindows.Terminal}
          setMinimizedWindows={setMinimizedWindows}
        />
      )}

      {windowsState.notes && (
        <NoteApp
          windowsName="notes" 
          setWindowsState={setWindowsState}
          isMinimized={minimizedWindows.notes}
          setMinimizedWindows={setMinimizedWindows}
        />
      )}

      {windowsState.calendar && (
        <Calendar
          windowsName="calendar" 
          setWindowsState={setWindowsState}
          isMinimized={minimizedWindows.calendar}
          setMinimizedWindows={setMinimizedWindows}
        />
      )}

      {windowsState.aboutme && (
        <AboutMe
          windowsName="aboutme" 
          setWindowsState={setWindowsState}
          isMinimized={minimizedWindows.aboutme}
          setMinimizedWindows={setMinimizedWindows}
        />
      )}

      {windowsState.resume && (
        <ResumeViewer
          windowsName="resume" 
          setWindowsState={setWindowsState}
          isMinimized={minimizedWindows.resume} 
          setMinimizedWindows={setMinimizedWindows}
        />
      )}
    </main>
  )
}

export default App