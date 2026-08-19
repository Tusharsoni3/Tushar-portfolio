import React from 'react';
import Window from './Window';
import './resumeViewer.scss';

// Custom Download SVG Icon
const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const ResumeViewer = ({ windowsName, setWindowsState, isMinimized, setMinimizedWindows }) => {
  // Point this to the exact name of the PDF file inside your 'public' folder
  const resumeFileName = "Tushar_Soni_Resume.pdf";
  const resumeUrl = `/${resumeFileName}`;

  return (
    <Window 
      windowsName={windowsName} 
      setWindowsState={setWindowsState}
      isMinimized={isMinimized}
      setMinimizedWindows={setMinimizedWindows}
      initialWidth="800px" 
      initialHeight="85vh"
      initialX={250}
      intitialY={40}
    >
      <div className="resume-viewer-container">
        
        {/* Custom Toolbar */}
        <div className="resume-toolbar">
          <span className="file-name">{resumeFileName}</span>
          
          <a href={resumeUrl} download={resumeFileName} className="download-btn">
            <DownloadIcon />
            Download PDF
          </a>
        </div>

        {/* PDF Document Viewer */}
        <div className="pdf-wrapper">
          {/* We pass #toolbar=0 to hide the browser's default PDF toolbar so we can use our custom one */}
          <iframe 
            src={`${resumeUrl}#toolbar=0&navpanes=0&view=FitH`} 
            title="Resume PDF Viewer"
          />
        </div>
        
      </div>
    </Window>
  );
};

export default ResumeViewer;