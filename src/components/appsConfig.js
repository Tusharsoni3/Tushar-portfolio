// Single source of truth for every app that appears in the dock AND the
// "Show Applications" grid, so the two stay in sync automatically.
//
// kind: 'window'   -> opens/focuses one of the app windows (id must match the
//                      matching key in windowsState / minimizedWindows)
// kind: 'external' -> opens an outside link in a new tab
// kind: 'noop'      -> placeholder, not wired up to anything yet

const apps = [
  { id: 'github',   label: 'GitHub',   icon: '/icons/github.webp',   kind: 'external', href: 'https://github.com/Tusharsoni3' },
  { id: 'Terminal', label: 'Terminal', icon: '/icons/terminal.webp', kind: 'window' },
  { id: 'calendar', label: 'Calendar', icon: '/icons/calendar.webp', kind: 'window' },
  { id: 'notes',    label: 'Notes',    icon: '/icons/note.webp',    kind: 'window' },
  { id: 'linkedin', label: 'LinkedIn', icon: '/icons/linkedin.webp', kind: 'external', href: 'https://www.linkedin.com/in/tushar-soni-007613277/' },
  { id: 'mail',     label: 'Mail',     icon: '/icons/gmail.webp',     kind: 'external', href: 'mailto:tstsuhar342@gmail.com' },
  { id: 'aboutme',  label: 'About Me', icon: '/icons/aboutme.svg',  kind: 'window' },
  { id: 'twitter',  label: 'Twitter',  icon: '/icons/x.png',  kind: 'external', href: 'https://x.com/TusharSenp55985' },
  { id: 'resume' , label: 'Resume' ,   icon: '/icons/pdf.png', kind: 'window' }
  // { id: 'resume' , label: 'Resume' ,   icon: '/icons/pdf.png', kind: 'window '}
];

export default apps;