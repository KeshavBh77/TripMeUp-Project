import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

// API Base URLs for Users and Admins
const API_USER_BASE = 'http://localhost:8000/TripMeUpApp/users/';
const API_ADMIN_BASE = 'http://localhost:8000/TripMeUpApp/admins/';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('app_currentUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const register = async (userData) => {
        try {
            const res = await fetch(API_USER_BASE, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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

    // Generalized login function for user or admin
    const login = async (username, password, isAdmin = false) => {
        try {
            const apiBase = isAdmin ? API_ADMIN_BASE : API_USER_BASE;
            const res = await fetch(apiBase);
            const users = await res.json();

            const found = users.find(
                (u) => u.user.username === username && u.user.password === password
            );

            if (!found) {
                throw new Error(isAdmin ? 'Invalid admin credentials' : 'Invalid email or password');
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
