import { useState, useEffect, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export const BrainDumpNotepad = ({ isPopover, onClose }) => {
    const { theme, colors } = useContext(ThemeContext);
    const [isMinimized, setIsMinimized] = useState(false);
    const [note, setNote] = useState(() => localStorage.getItem('zenNote') || '');

    useEffect(() => {
        localStorage.setItem('zenNote', note);
    }, [note]);

    return (
        <div style={{
            position: 'fixed',
            top: '20px',
            right: isMinimized ? '380px' : '820px', // Positioned to left of Habits
            zIndex: 9996,
            background: theme === 'light'
                ? 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,250,250,0.8) 100%)'
                : 'linear-gradient(135deg, rgba(20,20,30,0.9) 0%, rgba(10,10,20,0.9) 100%)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: `1px solid ${colors.cardBorder}`,
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            width: isMinimized ? '60px' : '220px',
            height: isMinimized ? 'auto' : '300px',
            position: isPopover ? 'relative' : 'fixed',
            top: isPopover ? 'auto' : '20px',
            right: isPopover ? 'auto' : '820px',
            zIndex: 9996,
        }}>
            {/* Header */}
            <div style={{
                padding: '10px 15px',
                background: theme === 'light' ? '#f3e5f5' : '#4a148c',
                color: theme === 'light' ? '#6a1b9a' : '#e1bee7',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
                borderBottom: `1px solid ${colors.cardBorder}`
            }} onClick={() => setIsMinimized(!isMinimized)}>
                <span>{isMinimized ? '🕯️' : '🕯️ Brain Dump'}</span>
                <span style={{ fontSize: '10px' }}>{isMinimized ? '◀' : '▼'}</span>
            </div>

            {/* Content */}
            {!isMinimized && (
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Clear your mind..."
                    style={{
                        width: '100%',
                        height: '100%',
                        background: 'transparent',
                        border: 'none',
                        resize: 'none',
                        padding: '15px',
                        outline: 'none',
                        color: colors.text,
                        fontFamily: 'inherit',
                        fontSize: '13px',
                        lineHeight: '1.5'
                    }}
                />
            )}
        </div>
    );
};
