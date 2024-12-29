"use client";

import Modal from "./Modal";
// import { Auth } from "@supabase/auth-ui-react";
// import { ThemeSupa } from "@supabase/auth-ui-shared";
import useAuthModal from "@/hooks/useAuthModal";
// import { useSupabase } from '@/providers/SupabaseProvider';
// import { Database } from "@/types_db";
import { useCallback, useState } from "react";
import { login, signup } from "@/app/login/actions";
// import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const AuthModal = () => {
    // const { supabase } = useSupabase();
    const { onClose, isOpen } = useAuthModal();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState<'login' | 'signup'>('login');
    // const router = useRouter();

    const handleClose = useCallback(() => {
        onClose();
    }, [onClose]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        
        const formData = new FormData(e.currentTarget);
        
        try {
            let response;
            if (mode === 'login') {
                response = await login(formData);
            } else {
                response = await signup(formData);
            }

            if (response?.error) {
                toast.error(response.error);
                return;
            }

            handleClose();
            toast.success(mode === 'login' ? 'Logged in successfully!' : 'Account created successfully!');
            
            if (response?.url) {
                window.location.href = response.url;
            }
        } catch (error: any) {
            console.error('Auth error:', error);
            toast.error(error?.message || 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            title="Welcome"
            description={mode === 'login' ? "Login to your account" : "Create an account"}
            isOpen={isOpen}
            onChange={handleClose}
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="rounded-md border p-2"
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-md border p-2"
                />
                <button 
                    type="submit"
                    disabled={isLoading}
                    className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
                >
                    {isLoading ? 'Loading...' : (mode === 'login' ? 'Login' : 'Sign Up')}
                </button>
                <button
                    type="button"
                    onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                    className="text-sm text-gray-600"
                >
                    {mode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Login'}
                </button>
            </form>
        </Modal>
    );
};

export default AuthModal;
