import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { registerUser } = useContext(AuthContext);
    const { colors } = useContext(ThemeContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser(name, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', transition: 'all 0.5s ease' }}>
            <div style={{
                background: colors.cardBg,
                padding: '40px',
                borderRadius: '15px',
                boxShadow: `0 8px 30px ${colors.cardBorder}44`,
                width: '380px',
                border: `2px solid ${colors.cardBorder}`,
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px', color: colors.text, fontWeight: '800', letterSpacing: '1px' }}>
                    <span style={{ fontSize: '0.8em', display: 'block', opacity: 0.7 }}>登録</span>
                    JOIN PROTASKER
                </h2>

                {error && (
                    <div style={{
                        background: '#ffebed',
                        color: '#d32f2f',
                        padding: '10px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        fontSize: '14px',
                        textAlign: 'center',
                        border: '1px solid #ffccd5',
                        width: '100%',
                        boxSizing: 'border-box'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ marginBottom: '15px', width: '100%' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: colors.text, fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>Full Name</label>
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: colors.inputBg,
                                border: `1px solid ${colors.inputBorder}`,
                                borderRadius: '8px',
                                color: colors.text,
                                outline: 'none',
                                textAlign: 'center',
                                fontSize: '16px',
                                boxSizing: 'border-box'
                            }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '15px', width: '100%' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: colors.text, fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>Email Address</label>
                        <input
                            type="email"
                            placeholder="your@email.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: colors.inputBg,
                                border: `1px solid ${colors.inputBorder}`,
                                borderRadius: '8px',
                                color: colors.text,
                                outline: 'none',
                                textAlign: 'center',
                                fontSize: '16px',
                                boxSizing: 'border-box'
                            }}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '25px', width: '100%' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: colors.text, fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '14px',
                                background: colors.inputBg,
                                border: `1px solid ${colors.inputBorder}`,
                                borderRadius: '8px',
                                color: colors.text,
                                outline: 'none',
                                textAlign: 'center',
                                fontSize: '16px',
                                boxSizing: 'border-box'
                            }}
                            required
                        />
                    </div>
                    <button type="submit" style={{
                        width: '100%',
                        padding: '14px',
                        background: colors.accent,
                        color: colors.background,
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        boxShadow: `0 4px 15px ${colors.accent}44`,
                        transition: 'transform 0.2s ease',
                        boxSizing: 'border-box'
                    }}
                        onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                    >
                        Create Account
                    </button>
                </form>
                <p style={{ textAlign: 'center', marginTop: '25px', fontSize: '14px', color: colors.text, opacity: 0.8 }}>
                    Already have an account? <Link to="/login" style={{ color: colors.accent, textDecoration: 'none', fontWeight: 'bold' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
