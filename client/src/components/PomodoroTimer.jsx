import { useState, useEffect, useContext, useRef } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { celebrateSakura } from './SakuraCelebration';

export const PomodoroTimer = ({ isPopover, onClose }) => {
    const { theme, colors } = useContext(ThemeContext);
    const [isExpanded, setIsExpanded] = useState(true);
    const [isRunning, setIsRunning] = useState(false);
    const [mode, setMode] = useState('standard'); // standard, deep, quick
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isWorkSession, setIsWorkSession] = useState(true);
    const [completedSessions, setCompletedSessions] = useState(0);
    const [intention, setIntention] = useState('');
    const [tempIntention, setTempIntention] = useState('');
    const intervalRef = useRef(null);
    const audioRef = useRef(new Audio('/sounds/bell.mp3'));

    // Zen Modes Configuration
    const zenModes = {
        standard: { work: 25, break: 5, label: 'Standard Zen' },
        deep: { work: 50, break: 10, label: 'Deep Focus' },
        quick: { work: 15, break: 3, label: 'Quick Burst' }
    };

    // Timer logic
    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            handleSessionComplete();
        }

        return () => clearInterval(intervalRef.current);
    }, [isRunning, timeLeft]);

    const handleSessionComplete = () => {
        setIsRunning(false);
        audioRef.current.play().catch(e => console.log("Audio play error", e));

        if (isWorkSession) {
            setCompletedSessions(prev => prev + 1);
            setIsWorkSession(false);
            setTimeLeft(zenModes[mode].break * 60);
            celebrateSakura();
            if (Notification.permission === 'granted') new Notification('🌸 Session Complete', { body: 'Take a mindful breath.', icon: '🌸' });
        } else {
            setIsWorkSession(true);
            setTimeLeft(zenModes[mode].work * 60);
            if (Notification.permission === 'granted') new Notification('🍃 Break Over', { body: 'Ready to flow again?', icon: '🍃' });
        }
    };

    const handleStart = () => {
        if (Notification.permission === 'default') Notification.requestPermission();
        if (tempIntention) setIntention(tempIntention);
        setIsRunning(true);
    };

    const handleModeChange = (newMode) => {
        setMode(newMode);
        setIsWorkSession(true);
        setIsRunning(false);
        setTimeLeft(zenModes[newMode].work * 60);
    };

    const handleReset = () => {
        setIsRunning(false);
        setIsWorkSession(true);
        setTimeLeft(zenModes[mode].work * 60);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Circular Progress Logic
    const totalTime = isWorkSession ? zenModes[mode].work * 60 : zenModes[mode].break * 60;
    const progress = ((totalTime - timeLeft) / totalTime) * 100;
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const dashoffset = circumference - (progress / 100) * circumference;

    return (
        <div style={{
            position: isPopover ? 'relative' : 'fixed',
            bottom: isPopover ? 'auto' : '20px',
            left: isPopover ? 'auto' : '20px',
            zIndex: 9999,
            background: theme === 'light'
                ? 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'
                : 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
            borderRadius: '15px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            border: `2px solid ${theme === 'light' ? '#64b5f6' : '#42a5f5'}`,
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            width: '300px',
        }}>
            {/* Header */}
            <div style={{
                padding: '10px 15px',
                background: theme === 'light' ? '#64b5f6' : '#42a5f5',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontWeight: 'bold',
                fontSize: '13px'
            }}>
                <span onClick={() => setIsExpanded(!isExpanded)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    ꩜ Pomodoro Zen <span style={{ fontSize: '10px', opacity: 0.8 }}>{isExpanded ? '▼' : '▶'}</span>
                </span>
                <span onClick={onClose} style={{ cursor: 'pointer', fontSize: '18px', lineHeight: 0.5 }}>˗</span>
            </div>

            {/* Minimized State */}
            {!isExpanded && (
                <div style={{ padding: '12px 15px', textAlign: 'center', color: colors.text }}>
                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{formatTime(timeLeft)}</div>
                    <div style={{ fontSize: '11px', opacity: 0.8 }}>{isWorkSession ? '✧ Focus' : '🫧 Break'}</div>
                </div>
            )}

            {/* Expanded State */}
            {isExpanded && (
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                    {/* Mode Selector */}
                    {!isRunning && (
                        <div style={{ display: 'flex', gap: '5px', marginBottom: '15px', width: '100%', justifyContent: 'center' }}>
                            {Object.entries(zenModes).map(([key, val]) => (
                                <button key={key}
                                    onClick={() => handleModeChange(key)}
                                    style={{
                                        padding: '4px 8px', fontSize: '10px', borderRadius: '12px',
                                        border: 'none', cursor: 'pointer',
                                        background: mode === key ? (theme === 'light' ? '#fff' : 'rgba(255,255,255,0.2)') : 'transparent',
                                        color: colors.text, opacity: mode === key ? 1 : 0.6, fontWeight: 'bold'
                                    }}>
                                    {val.label}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Progress Ring & Timer */}
                    <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '15px' }}>
                        <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
                            <circle cx="60" cy="60" r={radius} fill="transparent" stroke={colors.cardBorder} strokeWidth="6" opacity="0.3" />
                            <circle cx="60" cy="60" r={radius} fill="transparent" stroke={isWorkSession ? '#ff9800' : '#4caf50'} strokeWidth="6"
                                strokeDasharray={circumference} strokeDashoffset={dashoffset} strokeLinecap="round"
                                style={{ transition: 'stroke-dashoffset 1s linear' }} />
                        </svg>
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                            textAlign: 'center', color: colors.text
                        }}>
                            <div style={{ fontSize: '28px', fontWeight: 'bold', fontFamily: 'monospace' }}>{formatTime(timeLeft)}</div>
                            <div style={{ fontSize: '10px', opacity: 0.7 }}>{isWorkSession ? 'FOCUS' : 'BREAK'}</div>
                        </div>
                    </div>

                    {/* Intention Input/Display */}
                    <div style={{ width: '100%', marginBottom: '15px', textAlign: 'center' }}>
                        {!isRunning ? (
                            <input
                                type="text"
                                placeholder="What is your one goal?"
                                value={tempIntention}
                                onChange={(e) => setTempIntention(e.target.value)}
                                style={{
                                    width: '90%', padding: '8px', borderRadius: '8px', border: `1px solid ${colors.cardBorder}`,
                                    background: 'rgba(255,255,255,0.1)', color: colors.text, textAlign: 'center', outline: 'none'
                                }}
                            />
                        ) : (
                            <div style={{ fontSize: '14px', fontWeight: 'bold', color: colors.text }}>
                                {intention || "Stay Present ✨"}
                            </div>
                        )}
                    </div>

                    {/* Control Buttons */}
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {!isRunning ? (
                            <button onClick={handleStart} style={{
                                padding: '8px 24px', borderRadius: '20px', border: 'none', background: '#4caf50',
                                color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px'
                            }}>▷ Start</button>
                        ) : (
                            <button onClick={() => setIsRunning(false)} style={{
                                padding: '8px 24px', borderRadius: '20px', border: 'none', background: '#ff9800',
                                color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px'
                            }}>▯▯ Pause</button>
                        )}
                        <button onClick={handleReset} style={{
                            padding: '8px', borderRadius: '50%', border: `1px solid ${colors.cardBorder}`,
                            background: 'transparent', color: colors.text, cursor: 'pointer', fontSize: '16px'
                        }}>↻</button>
                    </div>

                    {/* Mini Stats */}
                    <div style={{ marginTop: '15px', fontSize: '12px', color: colors.text, opacity: 0.8 }}>
                        Session Sakuras: {'🌸'.repeat(completedSessions) || '...'}
                    </div>
                </div>
            )}
        </div>
    );
};
