"use client";

import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
import { Database } from '@/types_db';

const SupabaseContext = createContext<any>(null);

export default function SupabaseProvider({ 
    children 
}: { 
    children: React.ReactNode 
}) {
    const [supabase] = useState(() => createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    ));
    const router = useRouter();

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_OUT') {
                // Only refresh the page on sign out
                router.refresh();
            }
        });

        return () => subscription.unsubscribe();
    }, [supabase, router]);

    return (
        <SupabaseContext.Provider value={{ supabase }}>
            {children}
        </SupabaseContext.Provider>
    );
}

export const useSupabase = () => {
    const context = useContext(SupabaseContext);
    if (context === null) {
        throw new Error('useSupabase must be used within a SupabaseProvider');
    }
    return context;
};