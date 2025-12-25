import { useState, useEffect } from 'react';

export const SakuraCelebration = ({ onComplete }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [currentQuote, setCurrentQuote] = useState('');
    const [petals, setPetals] = useState([]);

    // Japanese-inspired motivational quotes
    const quotes = [
        { text: '素晴らしい仕事！', romaji: 'Subarashii shigoto!', english: 'Excellent work!' },
        { text: '頑張りました！', romaji: 'Ganbarimashita!', english: 'You did your best!' },
        { text: '完璧！', romaji: 'Kanpeki!', english: 'Perfect!' },
        { text: 'お疲れ様でした！', romaji: 'Otsukaresama deshita!', english: 'Good job, you\'re done!' },
        { text: '素敵です！', romaji: 'Suteki desu!', english: 'Wonderful!' },
        { text: 'やったね！', romaji: 'Yatta ne!', english: 'You did it!' },
        { text: '成功！', romaji: 'Seikou!', english: 'Success!' },
        { text: '最高！', romaji: 'Saikou!', english: 'The best!' },
    ];

    useEffect(() => {
        // Listen for celebration trigger
        const handleCelebration = () => {
            triggerCelebration();
        };

        window.addEventListener('sakuraCelebration', handleCelebration);
        return () => window.removeEventListener('sakuraCelebration', handleCelebration);
    }, []);

    const triggerCelebration = () => {
        // Pick random quote
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        setCurrentQuote(randomQuote);

        // Generate cherry blossom petals
        const newPetals = Array.from({ length: 30 }, (_, i) => ({
            id: i,
            left: Math.random() * 100, // Random horizontal position (%)
            animationDuration: 3 + Math.random() * 2, // 3-5 seconds
            animationDelay: Math.random() * 0.5, // Stagger start
            size: 15 + Math.random() * 10, // 15-25px
        }));

        setPetals(newPetals);
        setIsVisible(true);

        // Play celebration sound
        playCelebrationSound();

        // Hide after animation
        setTimeout(() => {
            setIsVisible(false);
            setPetals([]);
        }, 5000);
    };

    const playCelebrationSound = () => {
        // Gentle wind chime sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();

        // Create a pleasant chord (C major - peaceful, uplifting)
        const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5

        frequencies.forEach((freq, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = freq;
            oscillator.type = 'sine';

            const startTime = audioContext.currentTime + (index * 0.1);
            gainNode.gain.setValueAtTime(0.15, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 1.5);

            oscillator.start(startTime);
            oscillator.stop(startTime + 1.5);
        });
    };

    if (!isVisible) return null;

    return (
        <>
            {/* Overlay */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                zIndex: 99998,
                animation: 'fadeIn 0.3s ease-in',
                pointerEvents: 'none'
            }}>
                {/* Falling Cherry Blossom Petals */}
                {petals.map(petal => (
                    <div
                        key={petal.id}
                        style={{
                            position: 'absolute',
                            left: `${petal.left}%`,
                            top: '-50px',
                            width: `${petal.size}px`,
                            height: `${petal.size}px`,
                            background: 'radial-gradient(circle, #ffb3d9 0%, #ffc0e0 50%, #ff9ac9 100%)',
                            borderRadius: '50% 0 50% 0',
                            opacity: 0.8,
                            animation: `fall ${petal.animationDuration}s linear ${petal.animationDelay}s, sway 2s ease-in-out infinite`,
                            transform: 'rotate(45deg)',
                            boxShadow: '0 2px 4px rgba(255, 105, 180, 0.3)'
                        }}
                    />
                ))}

                {/* Motivational Quote Card */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 240, 245, 0.95) 100%)',
                    padding: '40px 60px',
                    borderRadius: '20px',
                    boxShadow: '0 20px 60px rgba(255, 105, 180, 0.3)',
                    border: '3px solid #ffb3d9',
                    textAlign: 'center',
                    animation: 'popIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                    pointerEvents: 'auto'
                }}>
                    {/* Japanese Text */}
                    <div style={{
                        fontSize: '48px',
                        fontWeight: 'bold',
                        color: '#ff6b9d',
                        marginBottom: '15px',
                        textShadow: '2px 2px 4px rgba(255, 105, 180, 0.2)'
                    }}>
                        {currentQuote.text}
                    </div>

                    {/* Romaji */}
                    <div style={{
                        fontSize: '20px',
                        color: '#666',
                        fontStyle: 'italic',
                        marginBottom: '10px'
                    }}>
                        {currentQuote.romaji}
                    </div>

                    {/* English Translation */}
                    <div style={{
                        fontSize: '24px',
                        color: '#333',
                        fontWeight: '500'
                    }}>
                        {currentQuote.english}
                    </div>

                    {/* Cherry Blossom Emoji */}
                    <div style={{
                        fontSize: '60px',
                        marginTop: '20px'
                    }}>
                        🌸
                    </div>
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes fall {
                    to {
                        top: 110%;
                        opacity: 0;
                    }
                }

                @keyframes sway {
                    0%, 100% {
                        transform: translateX(0) rotate(45deg);
                    }
                    50% {
                        transform: translateX(30px) rotate(90deg);
                    }
                }

                @keyframes popIn {
                    0% {
                        transform: translate(-50%, -50%) scale(0);
                        opacity: 0;
                    }
                    50% {
                        transform: translate(-50%, -50%) scale(1.1);
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 1;
                    }
                }
            `}</style>
        </>
    );
};

// Helper function to trigger celebration from anywhere
export const celebrateSakura = () => {
    window.dispatchEvent(new Event('sakuraCelebration'));
};
