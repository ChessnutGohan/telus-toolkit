"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export default function LoginGate({ children }: { children: React.ReactNode }) {
    const { user, login } = useAuth();
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);

    if (user) return <>{children}</>;

    const handleSubmit = () => {
        const success = login(password);
        if (!success) {
            setError(true);
            setPassword("");
        }
    };

    return (
        <div className="fixed inset-0 bg-ink flex items-center justify-center z-50">
            <div className="border border-line bg-surface p-8 w-full max-w-sm">
                <h1 className="font-display text-xl font-semibold text-ivory mb-1">
                    Console Opérateur
                </h1>
                <p className="font-mono text-xs text-muted mb-6">
                    Entrez votre code d'accès
                </p>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(false); }}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="••••••••"
                    className="w-full bg-ink border border-line px-3 py-2 font-mono text-sm text-ivory placeholder:text-muted focus:outline-none focus:border-signal mb-3"
                    autoFocus
                />
                {error && (
                    <p className="font-mono text-xs text-amber mb-3">
                        Code incorrect — réessaie
                    </p>
                )}
                <button
                    onClick={handleSubmit}
                    className="w-full bg-signal text-ink font-mono text-sm font-semibold py-2 hover:bg-signal/80 transition-colors"
                >
                    ACCÉDER →
                </button>
            </div>
        </div>
    );
}