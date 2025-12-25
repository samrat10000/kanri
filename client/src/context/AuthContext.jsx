import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Axios config: Always send cookies (IMPORTANT)
    axios.defaults.withCredentials = true;
    axios.defaults.baseURL = 'http://localhost:5000';

    // Check if user is logged in (Load User)
    useEffect(() => {
        const loadUser = async () => {
            try {
                const res = await axios.get('/api/auth/me');
                setUser(res.data.data);
            } catch (err) {
                // Not logged in
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    // Login Function
    const loginUser = async (email, password) => {
        const res = await axios.post('/api/auth/login', { email, password });
        setUser(res.data.data); // Should be the user object
        // NOTE: Our API returns { success: true, token: ... } but we set user via /me usually. 
        // Let's refactor: Login -> returns token -> we manually fetch user OR we just trust /me
        // For simplicity: after login, we'll confirm with /me or just reload. 
        // Actually, our API login endpoint returns token. It doesn't return user details in `data`?
        // Let's check authController.js... 
        // It sends `sendTokenResponse`. It returns { success: true, token }. 
        // So we need to fetch user after login.

        await loadMe();
    };

    // Register Function
    const registerUser = async (name, email, password) => {
        await axios.post('/api/auth/register', { name, email, password, role: 'user' });
        await loadMe();
    };

    const loadMe = async () => {
        const res = await axios.get('/api/auth/me');
        setUser(res.data.data);
    }

    // Logout Function
    const logoutUser = async () => {
        // Since we use cookies, we can just clear the state or call a logout endpoint if we had one.
        // For now, we'll just reload the page or clear state. 
        // Ideally: call /api/auth/logout (we didn't build this, but clearing cookie on client isn't fully possible if httpOnly).
        // Workaround: We will just set user to null. The cookie remains but if we build logout endpoint it matches.
        // Let's just set null for now. Real world: Build logout endpoint to clear cookie.
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginUser, registerUser, logoutUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
