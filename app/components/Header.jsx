"use client";

import { useEffect, useState } from 'react';
import { useUser } from '@/providers/UserProvider';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useRouter } from 'next/navigation';
import useAuthModal from '@/hooks/useAuthModal';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
export default function Header() {
  const { supabase } = useSupabase();
  const router = useRouter();
  const { user } = useUser();
  const authModal = useAuthModal();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check error:', error);
        setIsLoading(false);
      }
    };
    checkUser();
  }, [supabase.auth]);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      router.refresh();
      router.push('/');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    authModal.onOpen();
  };

  // shows nothing while checking auth state
  if (isLoading) {
    return null;
  }

  return (
    <header>
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
      <div className="flex h-16 items-center justify-between">
      <div className="flex-1 md:flex md:items-center md:gap-12">
          <Link href="/">
            <img src='/assets/logo.png' alt='logo' className='h-10 w-30' />
          </Link>
      </div>
        {user ? (
          <div className="sm:flex sm:gap-4">
            <button 
              onClick={() => {
                router.push('/dashboard');
              }}
              className="rounded-md px-5 py-2.5 text-sm font-medium text-customYellow hover:text-opacity-70"
            >
              Dashboard
            </button>
            <button 
              onClick={handleLogout}
              disabled={isLoading}
              className="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-customYellow"
            >
              {isLoading ? 'Loading...' : 'Logout'}
            </button>
          </div>
        ) : (
          <div className="sm:flex sm:gap-4">
            <button 
              onClick={handleLogin}
              className="rounded-md bg-customYellow px-5 py-2.5 text-sm font-medium text-white shadow"
            >
              Join
            </button>
{/*             <div className="hidden sm:flex">
              <button 
                onClick={() => {
                  handleLogin();
                }}
                className="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-customYellow"
              >
                Sign Up
              </button>
            </div> */}
          </div>
        )}
      </div>
      </div>
    </header>
  );
}
