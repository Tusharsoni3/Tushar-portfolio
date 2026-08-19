import React, { useState, useEffect } from 'react';

const Time = () => {
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setDate(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Added weekday: 'short' to display "Mon", "Tue", etc.
    const day = date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
    });
    
    // Added second: '2-digit' to display seconds alongside hours and minutes
    const time = date.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: false 
    });

    return (
        <div className="center">
            {/* Output will now look like: "Mon Aug 18  13:29:45" */}
            <span className="datetime-text">{day}&nbsp;&nbsp;{time}</span>
        </div>
    );
}

export default Time;