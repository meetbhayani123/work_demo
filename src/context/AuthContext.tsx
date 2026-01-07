'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
    codeVerifier: string | null;
    saveCodeVerifier: (verifier: string | null) => void;
    saveUser: (user: any) => void;
    saveClient: (client: any) => void;
    saveCompany: (company: any) => void;
    saveDomain: (domain: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [codeVerifier, setCodeVerifier] = useState<string | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('pkce_code_verifier');
        if (stored) setCodeVerifier(stored);
    }, []);

    const saveCodeVerifier = (verifier: string | null) => {
        if (verifier) {
            localStorage.setItem('pkce_code_verifier', verifier);
            setCodeVerifier(verifier);
        } else {
            localStorage.removeItem('pkce_code_verifier');
            setCodeVerifier(null);
        }
    };

    const saveUser = (user: any) => {
        localStorage.setItem('auth_user', JSON.stringify(user));
    };

    const saveClient = (client: any) => {
        localStorage.setItem('auth_client', JSON.stringify(client));
    };

    const saveCompany = (company: any) => {
        localStorage.setItem('auth_company', JSON.stringify(company));
    };

    const saveDomain = (domain: any) => {
        localStorage.setItem('auth_domain', JSON.stringify(domain));
    };

    return (
        <AuthContext.Provider value={{
            codeVerifier,
            saveCodeVerifier,
            saveUser,
            saveClient,
            saveCompany,
            saveDomain
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
