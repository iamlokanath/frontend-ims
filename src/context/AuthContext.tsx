// @ts-check
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'super_admin' | 'admin' | 'user';
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<User>;
    register: (userData: any) => Promise<User>; // TODO: Define specific type for userData
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            checkUser();
        } else {
            setLoading(false);
        }
    }, []);

    const checkUser = async () => {
        try {
            const response = await axios.get<User>('http://localhost:5000/api/auth/me');
            setUser(response.data);
        } catch (error) {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string): Promise<User> => {
        const response = await axios.post<{ token: string } & User>('http://localhost:5000/api/auth/login', {
            email,
            password
        });
        const { token, ...userData } = response.data;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
        return userData;
    };

    const register = async (userData: any): Promise<User> => { // TODO: Define specific type for userData
        const response = await axios.post<{ token: string } & User>('http://localhost:5000/api/auth/register', userData);
        const { token, ...user } = response.data;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);
        return user;
    };

    const logout = (): void => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 