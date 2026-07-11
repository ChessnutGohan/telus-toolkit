"use client"

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { authenticate } from "@/lib/auth";

type AuthContextType = {
    user: string | null;
    login: (password: string) => boolean;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);
const STORAGE_KEY = "telus-toolkit-user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<string | null>(null);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            setUser(saved);
        }
    }, []);

    const login = (password: string): boolean => {
        const name = authenticate(password);
        if (name) {
            setUser(name);
            localStorage.setItem(STORAGE_KEY, name);
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    const value = useMemo(
        () => ({ user, login, logout }),
        [user]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}