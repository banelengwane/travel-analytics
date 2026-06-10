import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/axiosClient";

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    loginUser: (credentials: object) => Promise<void>;
    logoutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // check if the user is already logged in when the app boots up
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                const response = await api.get('/auth/me'); // simple route returning user data if cookie is valid
                setUser(response.data.user);
            } catch {
                setUser(null);
            } finally {
                setLoading(false)
            }
        };
        checkAuthStatus()
    }, []);

    const loginUser = async (credentials: object) => {
        const response = await api.post('/auth/login', credentials);
        setUser(response.data.user);
    }

    const logoutUser = async () => {
        await api.post('/auth/logout'); //backend clears the cookie wrapper
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, loginUser, logoutUser }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) throw new Error('useAuth must be called inside an AuthProvider wrapper');
    return context;
};