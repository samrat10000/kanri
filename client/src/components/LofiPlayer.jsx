import { useState, useContext, useRef, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export const LofiPlayer = ({ isPopover, onClose }) => {
    const { theme, colors } = useContext(ThemeContext);
    const [isExpanded, setIsExpanded] = useState(true);
    const [currentStation, setCurrentStation] = useState(0);

    // Ambience Control State
    const [ambience, setAmbience] = useState({
        rain: false,
        fire: false,
        night: false,
        bird: false,
        wind: false,
        thunder: false
    });

    // Audio Refs
    const audioRefs = {
        rain: useRef(null),
        fire: useRef(null),
        night: useRef(null),
        bird: useRef(null),
        wind: useRef(null),
        thunder: useRef(null)
    };

    // Toggle Ambience
    const toggleAmbience = (type) => {
        const audioEl = audioRefs[type].current;
        if (!audioEl) return;

        const newState = !ambience[type];
        setAmbience(prev => ({ ...prev, [type]: newState }));

        if (newState) {
            audioEl.volume = 0.5; // Default volume
            audioEl.play().catch(e => console.error("Audio play error:", e));
        } else {
            audioEl.pause();
        }
    };

    // Curated lofi YouTube streams
    const lofiStreams = [
        { name: '💮 Tokyo Lofi', id: 'jfKfPfyJRdk', emoji: '💮' },
        { name: '🏮 Anime Chill', id: '4xDzrJKXOOY', emoji: '🏮' },
        { name: '🕯️ Sakura Beats', id: 'DWcJFNfaw9c', emoji: '🕯️' },
        { name: '🎹 Ghibli Piano', id: '0GK2eC8k6F0', emoji: '🎹' },
        { name: '🎷 Jazz Cafe', id: 'fEvM-OUbaKs', emoji: '🎷' },
        { name: '📼 Synthwave', id: '4xDzrJKXOOY', emoji: '📼' },
        { name: '🍜 Noodle Shop', id: '7NOSDKb0HlU', emoji: '🍜' },
        { name: '💤 Sleepy Lofi', id: 'DWcJFNfaw9c', emoji: '💤' },
        { name: '🌲 Forest Vibes', id: 'K3QzO7H79F0', emoji: '🌲' }
    ];

    const currentStream = lofiStreams[currentStation];

    return (
        <div style={{
            position: isPopover ? 'relative' : 'fixed',
            bottom: isPopover ? 'auto' : '20px',
            right: isPopover ? 'auto' : '20px',
            zIndex: 9999,
            background: theme === 'light'
                ? 'linear-gradient(135deg, #ffeef8 0%, #ffe4f1 100%)'
                : 'linear-gradient(135deg, #2a1a2e 0%, #1a1a2e 100%)',
            borderRadius: '15px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            border: `2px solid ${theme === 'light' ? '#ffb3d9' : '#ff6b9d'}`,
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            width: '320px',
        }}>
            {/* Hidden Audio Elements for Ambience - Using Refs */}
            <audio ref={audioRefs.rain} loop>
                <source src="/sounds/rain.ogg" type="audio/ogg" />
            </audio>
            <audio ref={audioRefs.fire} loop>
                <source src="/sounds/fire.ogg" type="audio/ogg" />
            </audio>
            <audio ref={audioRefs.night} loop>
                <source src="/sounds/night.ogg" type="audio/ogg" />
            </audio>
            <audio ref={audioRefs.bird} loop>
                <source src="/sounds/bird.ogg" type="audio/ogg" />
            </audio>
            <audio ref={audioRefs.wind} loop>
                <source src="/sounds/wind.ogg" type="audio/ogg" />
            </audio>
            <audio ref={audioRefs.thunder} loop>
                <source src="/sounds/thunder.ogg" type="audio/ogg" />
            </audio>

            {/* Header Bar */}
            <div style={{
                padding: '10px 15px',
                background: theme === 'light' ? '#ffb3d9' : '#ff6b9d',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontWeight: 'bold',
                fontSize: '13px'
            }}>
                <span onClick={() => setIsExpanded(!isExpanded)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    𓏢 Lofi Radio <span style={{ fontSize: '10px', opacity: 0.8 }}>{isExpanded ? '▼' : '▶'}</span>
                </span>
                <span onClick={onClose} style={{ cursor: 'pointer', fontSize: '18px', lineHeight: 0.5 }}>˗</span>
            </div>

            {/* Expanded State */}
            {isExpanded && (
                <div style={{ padding: '15px' }}>
                    {/* YouTube Embed */}
                    <div style={{
                        position: 'relative',
                        paddingBottom: '56.25%',
                        height: 0,
                        overflow: 'hidden',
                        borderRadius: '8px',
                        marginBottom: '15px',
                        background: 'black'
                    }}>
                        <iframe
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                border: 'none'
                            }}
                            src={`https://www.youtube.com/embed/${currentStream.id}?autoplay=1&controls=1&modestbranding=1`}
                            title="Lofi Radio"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>

                    {/* Ambience Mixer */}
                    <div style={{ marginBottom: '15px', padding: '10px', background: colors.cardBg, borderRadius: '8px', border: `1px solid ${colors.cardBorder}` }}>
                        <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '8px', opacity: 0.7 }}>AMBIENCE MIXER 🎧</div>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between', overflowX: 'auto', paddingBottom: '5px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            <AmbienceButton type="rain" icon="☔" label="Rain" active={ambience.rain} onClick={() => toggleAmbience('rain')} colors={colors} />
                            <AmbienceButton type="fire" icon="🕯️" label="Fire" active={ambience.fire} onClick={() => toggleAmbience('fire')} colors={colors} />
                            <AmbienceButton type="night" icon="🌙" label="Night" active={ambience.night} onClick={() => toggleAmbience('night')} colors={colors} />
                            <AmbienceButton type="bird" icon="🕊️" label="Birds" active={ambience.bird} onClick={() => toggleAmbience('bird')} colors={colors} />
                            <AmbienceButton type="wind" icon="🍃" label="Wind" active={ambience.wind} onClick={() => toggleAmbience('wind')} colors={colors} />
                            <AmbienceButton type="thunder" icon="🌩️" label="Thunder" active={ambience.thunder} onClick={() => toggleAmbience('thunder')} colors={colors} />
                        </div>
                    </div>

                    {/* Station Selector */}
                    <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '5px', opacity: 0.7 }}>STATIONS</div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '5px',
                        maxHeight: '120px',
                        overflowY: 'auto'
                    }}>
                        {lofiStreams.map((stream, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentStation(index)}
                                style={{
                                    padding: '6px',
                                    background: currentStation === index
                                        ? (theme === 'light' ? '#ffb3d9' : '#ff6b9d')
                                        : colors.cardBg,
                                    color: currentStation === index ? 'white' : colors.text,
                                    border: `1px solid ${colors.cardBorder}`,
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '11px',
                                    textAlign: 'left',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                                title={stream.name}
                            >
                                {stream.emoji} {stream.name.split(' ').slice(1).join(' ')}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Helper Component for Ambience Buttons
const AmbienceButton = ({ type, icon, label, active, onClick, colors }) => (
    <button
        onClick={onClick}
        style={{
            flex: '0 0 auto',
            padding: '8px 12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            background: active ? colors.accent : 'transparent',
            border: `1px solid ${colors.cardBorder}`,
            borderRadius: '6px',
            cursor: 'pointer',
            minWidth: '50px',
            color: active ? colors.background : colors.text,
            transition: 'all 0.2s'
        }}
        title={`Toggle ${label}`}
    >
        <span style={{ fontSize: '16px' }}>{icon}</span>
        {/* <span style={{fontSize: '9px'}}>{label}</span> */}
    </button>
);
