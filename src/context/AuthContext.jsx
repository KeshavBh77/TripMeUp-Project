import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();
const API_BASE = 'http://localhost:8000/TripMeUpApp/users/';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const stored = localStorage.getItem('app_currentUser');
        if (stored) {
            setUser(JSON.parse(stored));
        }
    }, []);

    const register = async (userData) => {
        try {
            const res = await fetch(API_BASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: "include",
                body: JSON.stringify(userData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || 'Registration failed');
            }

            const newUser = await res.json();
            localStorage.setItem('app_currentUser', JSON.stringify(newUser));
            setUser(newUser);
            return newUser;
        } catch (error) {
            throw error;
        }
    };

    const login = async (username, password) => {
        try {
            const res = await fetch(API_BASE, {
                credentials: "include",
            });

            const users = await res.json();

            const found = users.find(
                (u) => u.username === username && u.password === password
            );

            if (!found) {
                throw new Error('Invalid email or password');
            }

            localStorage.setItem('app_currentUser', JSON.stringify(found));
            setUser(found);
            return found;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('app_currentUser');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
