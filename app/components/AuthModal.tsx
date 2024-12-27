"use client";

import Modal from "./Modal";
import { useRouter } from "next/navigation";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import useAuthModal from "@/hooks/useAuthModal";
import { useEffect } from "react";
import { createBrowserClient } from '@supabase/ssr'
import { Database } from "@/types_db";

const AuthModal = () => {
    const supabase = createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const router = useRouter();
    const { onClose, isOpen } = useAuthModal();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                router.refresh(); 
                onClose();
            }
        };
        
        checkSession();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN') {
                router.refresh(); 
                onClose();
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase, router, onClose]);

    const onChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    };

    return (
        <Modal
            title="Welcome back"
            description="Login to your account"
            isOpen={isOpen}
            onChange={onChange}
        >
            <Auth
                theme="light"
                providers={["github", "google"]}
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
            />
        </Modal>
    );
};

export default AuthModal;