'use client';

import { useEffect } from 'react';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useUser } from '@/providers/UserProvider';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { supabase } = useSupabase();
  const { setUser } = useUser();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setUser(null);
      }
    };
    
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, setUser]);

  return <>{children}</>;
}