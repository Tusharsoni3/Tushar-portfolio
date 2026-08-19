import React, { useState, useRef, useEffect } from 'react';
import Window from './Window';
import './calendar.scss';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAY_LETTERS = DAY_NAMES.map(d => d[0]);
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WINDOW_WIDTH = 920;
const WINDOW_HEIGHT = 640;

const isSameDate = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const getMonthCells = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const gridStart = new Date(year, month, 1 - firstOfMonth.getDay());

  return Array.from({ length: 42 }, (_, i) =>
    new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i)
  );
};

const getWeekCells = (date) => {
  const sunday = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
  return Array.from({ length: 7 }, (_, i) =>
    new Date(sunday.getFullYear(), sunday.getMonth(), sunday.getDate() + i)
  );
};

const getWeekNumber = (date) => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - startOfYear) / 86400000);
  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
};

const ChevronIcon = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={`chevron-icon ${className}`}>
    <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MonthViewIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1.2" />
    <rect x="14" y="3" width="7" height="7" rx="1.2" />
    <rect x="3" y="14" width="7" height="7" rx="1.2" />
    <rect x="14" y="14" width="7" height="7" rx="1.2" />
  </svg>
);

const WeekViewIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="8" width="18" height="8" rx="1.2" />
  </svg>
);

const CalendarApp = ({ windowsName, setWindowsState, isMinimized, setMinimizedWindows }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month'); 
  const [hoveredCol, setHoveredCol] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerDate, setPickerDate] = useState(new Date());

  const pickerRef = useRef(null);
  const today = new Date();
  const centeredX = Math.max(40, (window.innerWidth - WINDOW_WIDTH) / 2);

  useEffect(() => {
    if (!pickerOpen) return;

    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setPickerOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setPickerOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [pickerOpen]);

  const goToToday = () => setCurrentDate(new Date());

  const togglePicker = () => {
    setPickerOpen(prev => {
      if (!prev) setPickerDate(new Date(currentDate));
      return !prev;
    });
  };

  const shiftPickerMonth = (direction) => {
    setPickerDate(prev => new Date(prev.getFullYear(), prev.getMonth() + direction, 1));
  };

  const shiftPickerYear = (direction) => {
    setPickerDate(prev => new Date(prev.getFullYear() + direction, prev.getMonth(), 1));
  };

  const selectPickerDate = (date) => {
    setCurrentDate(date);
    setPickerOpen(false);
  };

  const navigate = (direction) => {
    setCurrentDate(prev => {
      if (view === 'month') {
        return new Date(prev.getFullYear(), prev.getMonth() + direction, 1);
      }
      const next = new Date(prev);
      next.setDate(next.getDate() + direction * 7);
      return next;
    });
  };

  const cells = view === 'month' ? getMonthCells(currentDate) : getWeekCells(currentDate);

  const pickerCells = getMonthCells(pickerDate);
  const pickerWeeks = Array.from({ length: 6 }, (_, w) => pickerCells.slice(w * 7, w * 7 + 7));

  return (
    <Window
      windowsName={windowsName}
      setWindowsState={setWindowsState}
      isMinimized={isMinimized}
      setMinimizedWindows={setMinimizedWindows}
      initialWidth={`${WINDOW_WIDTH}px`}
      initialHeight={`${WINDOW_HEIGHT}px`}
      allowResize={true}
      allowMaximize={true}
      initialX={centeredX}
      intitialY={70}
    >
      <div className="calendar-app">

        <div className="calendar-toolbar">
          <div className="month-select-wrap" ref={pickerRef}>
            <button
              className={`month-select ${pickerOpen ? 'active' : ''}`}
              onClick={togglePicker}
              title="Choose a Date"
            >
              <span>{MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
              <ChevronIcon className={pickerOpen ? 'up' : ''} />
            </button>

            {pickerOpen && (
              <div className="date-picker-popover">
                <div className="picker-header">
                  <div className="picker-nav">
                    <button className="picker-nav-btn" onClick={() => shiftPickerMonth(-1)} title="Previous month">
                      <ChevronIcon className="left" />
                    </button>
                    <span className="picker-label">{MONTH_NAMES[pickerDate.getMonth()]}</span>
                    <button className="picker-nav-btn" onClick={() => shiftPickerMonth(1)} title="Next month">
                      <ChevronIcon className="right" />
                    </button>
                  </div>

                  <div className="picker-nav">
                    <button className="picker-nav-btn" onClick={() => shiftPickerYear(-1)} title="Previous year">
                      <ChevronIcon className="left" />
                    </button>
                    <span className="picker-label">{pickerDate.getFullYear()}</span>
                    <button className="picker-nav-btn" onClick={() => shiftPickerYear(1)} title="Next year">
                      <ChevronIcon className="right" />
                    </button>
                  </div>
                </div>

                <div className="picker-weekdays">
                  <span className="picker-week-num-header" />
                  {WEEKDAY_LETTERS.map((letter, i) => <span key={i}>{letter}</span>)}
                </div>

                <div className="picker-grid">
                  {pickerWeeks.map((week, wi) => {
                    const isCurrentRow = week.some(d => isSameDate(d, today));
                    return (
                      <div className={`picker-row ${isCurrentRow ? 'current-row' : ''}`} key={wi}>
                        <span className="picker-week-num">{getWeekNumber(week[0])}</span>
                        {week.map(cellDate => {
                          const inMonth = cellDate.getMonth() === pickerDate.getMonth();
                          const isToday = isSameDate(cellDate, today);
                          const isSelected = isSameDate(cellDate, currentDate);
                          return (
                            <button
                              key={cellDate.toISOString()}
                              className={[
                                'picker-day',
                                inMonth ? '' : 'muted',
                                isToday ? 'today' : '',
                                isSelected && !isToday ? 'selected' : ''
                              ].join(' ').trim()}
                              onClick={() => selectPickerDate(cellDate)}
                            >
                              {cellDate.getDate()}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="weekdays-row">
          {DAY_NAMES.map(day => <div key={day} className="weekday">{day}</div>)}
        </div>

        <div className={`dates-grid ${view}`}>
          {cells.map((cellDate, idx) => {
            const isCurrentMonth = cellDate.getMonth() === currentDate.getMonth();
            const isToday = isSameDate(cellDate, today);
            const isFirstOfMonth = cellDate.getDate() === 1;
            const showMonthPill = isFirstOfMonth && !isCurrentMonth;
            
            // Birthday Logic: August (7) 27th
            const isBirthday = cellDate.getMonth() === 7 && cellDate.getDate() === 27;
            const colIndex = idx % 7;

            return (
              <div
                key={cellDate.toISOString()}
                className={`day-cell ${isCurrentMonth ? '' : 'other-month'} ${colIndex === hoveredCol ? 'col-hover' : ''}`}
                onMouseEnter={() => setHoveredCol(colIndex)}
                onMouseLeave={() => setHoveredCol(null)}
              >
                {showMonthPill ? (
                  <span className="month-pill">{MONTH_NAMES[cellDate.getMonth()]}</span>
                ) : (
                  <span className={`day-number ${isToday ? 'today' : ''}`}>{cellDate.getDate()}</span>
                )}
                
                {/* Embedded Birthday Bookmark */}
                {isBirthday && (
                  <div style={{
                    marginTop: '8px',
                    display: 'inline-block',
                    fontSize: '11px',
                    fontWeight: '700',
                    color: '#e95420',
                    backgroundColor: 'rgba(233, 84, 32, 0.15)',
                    padding: '3px 7px',
                    borderRadius: '4px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    userSelect: 'none'
                  }}>
                    Wish me Bdy,Coffee is best gift 
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="calendar-footer">
          <div className="footer-left">
            <div className="stepper">
              <button className="stepper-btn" onClick={() => navigate(-1)} title="Previous">
                <ChevronIcon className="up" />
              </button>
              <button className="stepper-btn" onClick={() => navigate(1)} title="Next">
                <ChevronIcon />
              </button>
            </div>

            <button className="today-btn" onClick={goToToday}>Today</button>
          </div>

          <div className="view-toggle">
            <button className={`view-btn ${view === 'month' ? 'active' : ''}`} onClick={() => setView('month')}>
              <MonthViewIcon /> Month
            </button>
            <button className={`view-btn ${view === 'week' ? 'active' : ''}`} onClick={() => setView('week')}>
              <WeekViewIcon /> Week
            </button>
          </div>
        </div>

      </div>
    </Window>
  );
};

export default CalendarApp;