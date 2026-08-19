import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import Window from './Window'; // Assumes you have this from your OS portfolio
import './notes.scss';

// --- ICONS ---
const TrashIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>;
const MoonIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>;
const SunIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>;
const PlusIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const FileIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>;

const NoteApp = ({ windowsName, setWindowsState, isMinimized, setMinimizedWindows }) => {

  const [theme, setTheme] = useState('dark');
  const [openTabs, setOpenTabs] = useState([1]);

  const [notes, setNotes] = useState([
    { 
      id: 1, 
      title: "Meet Tushar Soni", 
    content: [
    { id: 101, text: "Hi, I’m Tushar. While I am self-taught in full-stack development, my true expertise lies in architecting and building highly scalable backend systems. I hold a  Bachelor's degree in Computer Science, I am passionate about crafting elegant, streamlined solutions. I leverage a versatile tech stack including modern AI tools to solve complex problems effectively. I thrive on tackling tough technical challenges. Ultimately, I am a highly driven engineer on a continuous journey to set new benchmarks of excellence in the industry.", type: 'p' },
    { id: 107, text: "Currently working with Cloud, DevOps, AI, and Golang", type: 'p' },
  ]
    },
    { 
      id: 2, 
      title: "My Projects", 
      content: [
        { id: 202, text: " GateX ", type: 'bullet' },
        { id: 203, text: " Jett Messages", type: 'bullet' },
        { id: 204, text: " Aura Search ", type: 'bullet' },
        { id: 205, text: " Spwan Point ", type: 'bullet' },
      ] 
    }
  ]);

  const [activeNoteId, setActiveNoteId] = useState(1);
  const [focusId, setFocusId] = useState(null); 

  const activeNote = notes.find(n => n.id === activeNoteId) || notes[0];

  const openNote = (id) => {
    if (!openTabs.includes(id)) {
      setOpenTabs([...openTabs, id]);
    }
    setActiveNoteId(id);
  };

  const closeTab = (e, id) => {
    e.stopPropagation();
    const newTabs = openTabs.filter(t => t !== id);
    setOpenTabs(newTabs);
    if (activeNoteId === id) {
      setActiveNoteId(newTabs.length > 0 ? newTabs[newTabs.length - 1] : null);
    }
  };

  const createNewNote = () => {
    const newId = Date.now();
    const newNote = { 
      id: newId, 
      title: "Untitled Note", 
      content: [{ id: Date.now() + 1, text: "", type: 'p' }] 
    };
    setNotes([...notes, newNote]);
    setOpenTabs([...openTabs, newId]);
    setActiveNoteId(newId);
  };

  const deleteActiveNote = () => {
    const filtered = notes.filter(n => n.id !== activeNoteId);
    setNotes(filtered);
    const newTabs = openTabs.filter(t => t !== activeNoteId);
    setOpenTabs(newTabs);
    setActiveNoteId(newTabs.length > 0 ? newTabs[0] : (filtered.length > 0 ? filtered[0].id : null));
  };

  const updateTitle = (val) => {
    setNotes(notes.map(n => n.id === activeNoteId ? { ...n, title: val } : n));
  };

  const updateBlock = (lineId, updates) => {
    const updatedContent = activeNote.content.map(line => 
      line.id === lineId ? { ...line, ...updates } : line
    );
    setNotes(notes.map(n => n.id === activeNoteId ? { ...n, content: updatedContent } : n));
  };

  const handleKeyDown = (e, index, line) => {
    // Enter creates a new block below
    if (e.key === 'Enter') {
      e.preventDefault();
      // If pressing enter on an empty bullet, turn it into a paragraph
      if (line.type === 'bullet' && line.text === '') {
        updateBlock(line.id, { type: 'p' });
        return;
      }
      
      // Auto-continue bullets
      const newType = line.type === 'bullet' ? 'bullet' : 'p';
      const newLine = { id: Date.now(), text: "", type: newType };
      const newContent = [...activeNote.content];
      newContent.splice(index + 1, 0, newLine); 
      setNotes(notes.map(n => n.id === activeNoteId ? { ...n, content: newContent } : n));
      setFocusId(newLine.id); 
    }
    
    // Backspace logic for removing formatting or deleting blocks
    if (e.key === 'Backspace') {
      if (line.text === '') {
        e.preventDefault();
        // If it's formatted, revert to paragraph first
        if (line.type !== 'p') {
            updateBlock(line.id, { type: 'p' });
        } else if (activeNote.content.length > 1) {
            // Delete block if it's already a paragraph
            const prevLineId = activeNote.content[index - 1] ? activeNote.content[index - 1].id : null;
            const newContent = activeNote.content.filter(l => l.id !== line.id);
            setNotes(notes.map(n => n.id === activeNoteId ? { ...n, content: newContent } : n));
            if (prevLineId) setFocusId(prevLineId);
        }
      }
    }
  };

  return (
    <Window 
      windowsName={windowsName} 
      setWindowsState={setWindowsState}
      isMinimized={isMinimized}
      setMinimizedWindows={setMinimizedWindows}
      initialWidth="50vw"
      initialHeight="80vh"
      initialX={200}
      intitialY={100}
    >
      <div className="note-app-container" data-theme={theme}>
        
        {/* VAULT SIDEBAR */}
        <div className="sidebar">
          <div className="vault-header">
            <span>Portfolio Vault</span>
            <button onClick={createNewNote} title="New Note"><PlusIcon/></button>
          </div>
          <div className="note-list">
            {notes.map(note => (
              <div 
                key={note.id} 
                className={`note-item ${note.id === activeNoteId ? 'active' : ''}`}
                onClick={() => openNote(note.id)}
              >
                <FileIcon /> {note.title || "Untitled Note"}
              </div>
            ))}
          </div>
        </div>

        {/* EDITOR AREA */}
        <div className="editor-area">
          
          {/* TABS BAR */}
          <div className="tabs-bar">
            {openTabs.map(tabId => {
              const tabNote = notes.find(n => n.id === tabId);
              if (!tabNote) return null;
              return (
                <div 
                  key={tabId} 
                  className={`tab ${activeNoteId === tabId ? 'active' : ''}`}
                  onClick={() => setActiveNoteId(tabId)}
                >
                  {tabNote.title || "Untitled"}
                  <span className="close-tab" onClick={(e) => closeTab(e, tabId)}>×</span>
                </div>
              );
            })}
          </div>

          <div className="toolbar">
            <div className="group">
              <button onClick={deleteActiveNote} title="Delete Note"><TrashIcon /></button>
              <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} title="Toggle Theme">
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
              </button>
            </div>
          </div>

          {activeNote ? (
            <div className="paper">
              <input 
                className="note-title-input"
                placeholder="Untitled Note"
                value={activeNote.title}
                onChange={(e) => updateTitle(e.target.value)}
              />

              {activeNote.content.map((line, index) => (
                <Block 
                  key={line.id} 
                  line={line} 
                  index={index}
                  updateBlock={updateBlock} 
                  handleKeyDown={handleKeyDown}
                  shouldFocus={focusId === line.id}
                  setFocusId={setFocusId}
                />
              ))}
            </div>
          ) : (
            <div style={{ margin: 'auto', color: 'var(--text-muted)' }}>
              Select a note or create a new one to start writing.
            </div>
          )}
        </div>
      </div>
    </Window>
  );
};

const Block = ({ line, index, updateBlock, handleKeyDown, shouldFocus, setFocusId }) => {
  const textAreaRef = useRef(null);

  const resize = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto'; 
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px'; 
    }
  };

  useLayoutEffect(() => resize(), [line.text]);

  useEffect(() => {
    if (shouldFocus && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [shouldFocus]);

  const handleTextChange = (e) => {
    let val = e.target.value;
    let newType = line.type;

    // MARKDOWN AUTO-FORMATTING LOGIC
    if (val.startsWith('# ')) { val = val.substring(2); newType = 'h1'; }
    else if (val.startsWith('## ')) { val = val.substring(3); newType = 'h2'; }
    else if (val.startsWith('### ')) { val = val.substring(4); newType = 'h3'; }
    else if (val.startsWith('- ')) { val = val.substring(2); newType = 'bullet'; }
    else if (val.startsWith('> ')) { val = val.substring(2); newType = 'quote'; }

    updateBlock(line.id, { text: val, type: newType });
  };

  return (
    <div className="block">
      {line.type === 'bullet' && <div className="bullet-icon">•</div>}
      {line.type === 'quote' && <div className="quote-line"></div>}
      
      <textarea
        ref={textAreaRef}
        className={`type-${line.type}`}
        value={line.text}
        onChange={handleTextChange}
        onKeyDown={(e) => handleKeyDown(e, index, line)}
        onFocus={() => setFocusId(line.id)}
        placeholder={index === 0 && line.text === "" ? "Type '#' for H1, '-' for bullet..." : ""}
        rows={1}
      />
    </div>
  );
};

export default NoteApp;