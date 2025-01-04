"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from '@supabase/ssr';
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

import Modal from "./Modal";
import useAuthModal from "@/hooks/useAuthModal";
import { Database } from "@/types_db";

const AuthModal = () => {
    // Create supabase client with error handling
    const supabase = createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
    );

    const router = useRouter();
    const { onClose, isOpen } = useAuthModal();

    useEffect(() => {
        let isMounted = true; // Add mounted check to prevent memory leaks

        const checkSession = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                
                if (error) {
                    console.error('Session check error:', error.message);
                    return;
                }

                if (session && isMounted) {
                    router.refresh();
                    onClose();
                }
            } catch (err) {
                console.error('Session check failed:', err);
            }
        };

        // Initial session check
        checkSession();

        // Set up auth state change listener
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && isMounted) {
                router.refresh();
                onClose();
            }
        });

        // Cleanup function
        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, [supabase, router, onClose]);

    const onChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    };

    // Don't render if not open
    if (!isOpen) {
        return null;
    }

    return (
        <Modal
            title="Welcome back"
            description="Login to your account"
            isOpen={isOpen}
            onChange={onChange}
        >
            <Auth
                theme="light"
                providers={["google"]}
                supabaseClient={supabase}
                appearance={{
                    theme: ThemeSupa,
                    variables: {
                        default: {
                            colors: {
                                brand: "#32CD32",
                                brandAccent: "#71806c",
                            },
                        },
                    },
                }}
                redirectTo={typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined}
            />
        </Modal>
    );
};

export default AuthModal;