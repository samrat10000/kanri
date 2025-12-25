import { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export const ZenHabitTracker = ({ isPopover, onClose }) => {
    const { theme, colors } = useContext(ThemeContext);
    const [isMinimized, setIsMinimized] = useState(false);
    const [habits, setHabits] = useState(() => {
        const saved = localStorage.getItem('zenHabits');
        return saved ? JSON.parse(saved) : [
            { id: 1, text: 'Drink Water', completed: false },
            { id: 2, text: 'Meditate 10m', completed: false },
            { id: 3, text: 'Read 5 Pages', completed: false }
        ];
    });

    useEffect(() => {
        localStorage.setItem('zenHabits', JSON.stringify(habits));
    }, [habits]);

    // Reset habits daily
    useEffect(() => {
        const lastAccess = localStorage.getItem('lastHabitAccess');
        const today = new Date().toDateString();

        if (lastAccess !== today) {
            setHabits(prev => prev.map(h => ({ ...h, completed: false })));
            localStorage.setItem('lastHabitAccess', today);
        }
    }, []);

    const toggleHabit = (id) => {
        setHabits(prev => prev.map(h => {
            if (h.id === id) {
                // Play soft click sound if turning on
                if (!h.completed) {
                    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-water-drop-splash-3363.mp3'); // Fallback or local sound
                    audio.volume = 0.2;
                    audio.play().catch(e => { }); // Silent fail
                }
                return { ...h, completed: !h.completed };
            }
            return h;
        }));
    };

    const addHabit = () => {
        const text = prompt("Enter new habit:");
        if (text) {
            setHabits(prev => [...prev, { id: Date.now(), text, completed: false }]);
        }
    };

    const removeHabit = (id, e) => {
        e.stopPropagation();
        if (window.confirm("Remove this habit?")) {
            setHabits(prev => prev.filter(h => h.id !== id));
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: isMinimized ? '300px' : '600px', // Positioned to left of Stats
            zIndex: 9997,
            background: theme === 'light'
                ? 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,255,240,0.9) 100%)'
                : 'linear-gradient(135deg, rgba(30,40,30,0.95) 0%, rgba(20,30,20,0.95) 100%)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: `1px solid ${colors.cardBorder}`,
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            width: isMinimized ? '60px' : '200px',
            position: isPopover ? 'relative' : 'fixed',
            top: isPopover ? 'auto' : '20px',
            right: isPopover ? 'auto' : '600px',
            zIndex: 9997,
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
                <span>{isMinimized ? '🎍' : '🎍 Zen Rituals'}</span>
                <span style={{ fontSize: '10px' }}>{isMinimized ? '◀' : '▼'}</span>
            </div>

            {/* Content */}
            {!isMinimized && (
                <div style={{ padding: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {habits.map(habit => (
                            <div key={habit.id} onClick={() => toggleHabit(habit.id)} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '8px',
                                borderRadius: '8px',
                                background: habit.completed
                                    ? (theme === 'light' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(76, 175, 80, 0.2)')
                                    : 'transparent',
                                border: `1px solid ${habit.completed ? '#4caf50' : 'transparent'}`,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '14px' }}>{habit.completed ? '🌸' : '🌱'}</span>
                                    <span style={{
                                        fontSize: '12px',
                                        color: colors.text,
                                        textDecoration: habit.completed ? 'line-through' : 'none',
                                        opacity: habit.completed ? 0.6 : 1
                                    }}>{habit.text}</span>
                                </div>
                                <button onClick={(e) => removeHabit(habit.id, e)} style={{
                                    border: 'none', background: 'none', color: colors.text, opacity: 0.3, cursor: 'pointer', fontSize: '10px'
                                }}>×</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {!isMinimized && (
                <button onClick={addHabit} style={{
                    width: '100%',
                    padding: '8px',
                    marginTop: '8px',
                    background: 'transparent',
                    border: `1px dashed ${colors.cardBorder}`,
                    color: colors.text,
                    borderRadius: '8px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    opacity: 0.6
                }}>
                    + New Ritual
                </button>
            )}
        </div>
    );
};
