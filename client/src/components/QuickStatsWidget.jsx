import { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export const QuickStatsWidget = ({ tasks, isPopover, onClose }) => {
    const { theme, colors } = useContext(ThemeContext);
    const [isMinimized, setIsMinimized] = useState(false);
    const [streak, setStreak] = useState(0);

    // Filter tasks for Today
    const today = new Date().toDateString();
    const todaysTasks = tasks.filter(t => new Date(t.createdAt).toDateString() === today || new Date(t.updatedAt).toDateString() === today);
    const completedToday = todaysTasks.filter(t => t.status === 'completed').length;
    const totalToday = todaysTasks.length;

    // Completion Rate Logic
    const completionRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;
    const radius = 25;
    const circumference = 2 * Math.PI * radius;
    const dashoffset = circumference - (completionRate / 100) * circumference;

    // Task Flow Logic
    const flow = {
        todo: tasks.filter(t => t.status === 'pending').length,
        inProgress: tasks.filter(t => t.status === 'in-progress').length,
        done: tasks.filter(t => t.status === 'completed').length
    };

    // Priority Pulse Logic (High Priority Count)
    const highPriorityCount = tasks.filter(t => t.priority === 'High' && t.status !== 'completed').length;

    // Best Day Logic
    const getBestDay = () => {
        const dayCounts = {};
        tasks.filter(t => t.status === 'completed').forEach(t => {
            const day = new Date(t.updatedAt).toLocaleDateString('en-US', { weekday: 'short' });
            dayCounts[day] = (dayCounts[day] || 0) + 1;
        });
        const bestDay = Object.keys(dayCounts).reduce((a, b) => dayCounts[a] > dayCounts[b] ? a : b, '-');
        return bestDay === '-' ? 'Today' : bestDay;
    };
    const bestDay = getBestDay();

    // Streak Logic (Existing)
    useEffect(() => {
        const updateStreak = () => {
            // Simple streak persistence (mock implementation based on previous code)
            const currentStreak = parseInt(localStorage.getItem('taskStreak') || '0');
            if (completedToday > 0) {
                // Logic to increment preserved for simplicity
                setStreak(Math.max(currentStreak, 1));
            } else {
                setStreak(currentStreak);
            }
        };
        updateStreak();
    }, [completedToday]);


    return (
        <div style={{
            position: isPopover ? 'relative' : 'fixed',
            bottom: isPopover ? 'auto' : '20px',
            right: isPopover ? 'auto' : '370px',
            zIndex: 9998,
            background: theme === 'light'
                ? 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,248,255,0.9) 100%)'
                : 'linear-gradient(135deg, rgba(30,30,40,0.95) 0%, rgba(20,20,30,0.95) 100%)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: `1px solid ${colors.cardBorder}`,
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            width: isMinimized ? '60px' : '220px',
        }}>
            {/* Header */}
            <div style={{
                padding: '10px 15px',
                background: theme === 'light' ? '#e8f5e9' : '#1b5e20',
                color: theme === 'light' ? '#2e7d32' : '#a5d6a7',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
                borderBottom: `1px solid ${colors.cardBorder}`
            }} onClick={() => setIsMinimized(!isMinimized)}>
                <span>{isMinimized ? '🕯️' : '🕯️ Zen Stats'}</span>
                <span style={{ fontSize: '10px' }}>{isMinimized ? '◀' : '▼'}</span>
            </div>

            {/* Content */}
            {!isMinimized && (
                <div style={{ padding: '15px' }}>

                    {/* Top Row: Completion & Streak */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        {/* Completion Ring */}
                        <div style={{ position: 'relative', width: '60px', height: '60px' }}>
                            <svg width="60" height="60" style={{ transform: 'rotate(-90deg)' }}>
                                <circle cx="30" cy="30" r={radius} fill="transparent" stroke={colors.cardBorder} strokeWidth="4" opacity="0.3" />
                                <circle cx="30" cy="30" r={radius} fill="transparent" stroke="#4caf50" strokeWidth="4"
                                    strokeDasharray={circumference} strokeDashoffset={dashoffset} strokeLinecap="round" />
                            </svg>
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '12px', fontWeight: 'bold', color: colors.text }}>
                                {completionRate}%
                            </div>
                        </div>

                        {/* Streak & Best Day */}
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '10px', opacity: 0.7, color: colors.text }}>CURRENT STREAK</div>
                            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#ff9800' }}>⚡ {streak} Days</div>
                            <div style={{ fontSize: '9px', opacity: 0.5, marginTop: '2px', color: colors.text }}>BEST: {bestDay}</div>
                        </div>
                    </div>

                    {/* Task Flow Bars */}
                    <div style={{ marginBottom: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '5px', color: colors.text, opacity: 0.8 }}>
                            <span>To Do</span>
                            <span>In Flow</span>
                            <span>Done</span>
                        </div>
                        <div style={{ display: 'flex', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ flex: flow.todo, background: colors.cardBorder, transition: 'flex 0.5s' }} />
                            <div style={{ flex: flow.inProgress, background: '#2196f3', transition: 'flex 0.5s' }} />
                            <div style={{ flex: flow.done, background: '#4caf50', transition: 'flex 0.5s' }} />
                        </div>
                    </div>

                    {/* Priority Pulse */}
                    <div style={{
                        padding: '10px',
                        background: theme === 'light' ? 'rgba(255,235,238,0.7)' : 'rgba(183,28,28,0.2)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: '8px', height: '8px', borderRadius: '50%', background: '#f44336',
                                boxShadow: '0 0 8px #f44336', animation: 'pulse 2s infinite'
                            }} />
                            <span style={{ fontSize: '11px', fontWeight: 'bold', color: theme === 'light' ? '#c62828' : '#ef9a9a' }}>High Priority</span>
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: theme === 'light' ? '#c62828' : '#ef9a9a' }}>{highPriorityCount}</span>
                    </div>

                </div>
            )}

            <style>{`
                @keyframes pulse {
                    0% { transform: scale(0.95); opacity: 0.7; }
                    50% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(0.95); opacity: 0.7; }
                }
            `}</style>
        </div>
    );
};
