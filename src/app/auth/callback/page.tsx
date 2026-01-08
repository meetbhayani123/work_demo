'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { decodeJwt } from 'jose';
import { setTokens } from '@/utils/token';

export default function AuthCallback() {
    const router = useRouter();
    const params = useSearchParams();

    const code = params.get('code');
    const error = params.get('error');

    const [title, setTitle] = useState('Logging in...');
    const [authReady, setAuthReady] = useState(false);

    const {
        saveUser,
        codeVerifier,
        saveCodeVerifier,
    } = useAuth();

    // Clear verifier once used (or on unmount, but effect runs once)
    useEffect(() => {
        // We need the verifier for the exchange, so don't clear it immediately if we need it in the effect
        // But typically you clear after success.
    }, []);

    const exchangeCodeForToken = useCallback(async () => {
        if (!code) return null;

        // We need the verifier from context (which is loaded from localStorage)
        // Note: useAuth provides codeVerifier state.

        // Safety check: if codeVerifier is null, we might need to wait or it's lost.
        const storedVerifier = localStorage.getItem('pkce_code_verifier');
        if (!storedVerifier) {
            throw new Error('No code verifier found');
        }

        const formData = new URLSearchParams();
        formData.append('grant_type', 'authorization_code');
        formData.append('code', code);
        formData.append('code_verifier', storedVerifier);
        // redirect_uri is unused in my backend but standard requires it
        formData.append('redirect_uri', 'http://localhost:3000/auth/callback');

        const res = await axios.post(
            '/api/auth/token',
            formData,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        return res.data;
    }, [code]);

    useEffect(() => {
        if (error) {
            setTitle('Login Failed');
            return;
        }
        if (!code) {
            // If no code, maybe just visiting the page?
            return;
        }

        (async () => {
            try {
                const tokenJson = await exchangeCodeForToken();
                console.log('Token Response:', tokenJson);

                const { access_token, refresh_token, id_token } = tokenJson;

                setTokens(access_token, refresh_token);

                if (id_token) {
                    const claims = decodeJwt(id_token);
                    saveUser(claims);
                }

                // Clear verifier
                saveCodeVerifier(null);

                setTitle('Logged in. Redirecting...');
                setAuthReady(true);
            } catch (err) {
                console.error(err);
                setTitle('Login Error');
            }
        })();
    }, [code, error, exchangeCodeForToken, saveCodeVerifier, saveUser]);

    useEffect(() => {
        if (authReady) {
            router.push('/dashboard');
        }
    }, [authReady, router]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-2xl font-bold">{title}</h1>
        </div>
    );
}
