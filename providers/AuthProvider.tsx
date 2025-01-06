'use client';

import { useEffect } from 'react';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useUser } from '@/providers/UserProvider';
import { Session } from '@supabase/supabase-js';

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
      } = supabase.auth.onAuthStateChange((
        _event: 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED',
        session: Session | null
      ) => {
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