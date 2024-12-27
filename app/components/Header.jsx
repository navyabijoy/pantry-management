"use client";

import { useRouter } from 'next/navigation';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import useAuthModal from '@/hooks/useAuthModal';
import { useMyUserContext } from '@/hooks/useUser';
import React from 'react';
import { useSelector } from 'react-redux';

export default function Header() {
  const currentUser = useSelector((state) => state.user);
  const authModal = useAuthModal();
  const supabaseClient = useSupabaseClient();
  const { user } = useMyUserContext();
  const router = useRouter(); 

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    router.refresh(); 

    if (error) {
      console.log(error);
    }
  };

  return (
    <header className="bg-white">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="md:flex md:items-center md:gap-12">
            <a className="block text-teal-600" href="#">
              <span className="sr-only">Home</span>
              <img className="h-8" src="./assets/logo.png" alt="Logo" />
            </a>
          </div>

          <div className="hidden md:block">
            <nav aria-label="Global">
              <ul className="flex items-center gap-6 text-sm">
                <li>
                  <a className="text-gray-500 transition hover:text-gray-500/75" href="#">
                    About
                  </a>
                </li>
                <li>
                  <a className="text-gray-500 transition hover:text-gray-500/75" href="#">
                    How it Works
                  </a>
                </li>
                <li>
                  <a className="text-gray-500 transition hover:text-gray-500/75" href="#">
                    Services
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              router.push('/dashboard')
            ) : (
              <>
                <div className="sm:flex sm:gap-4">
                  <button onClick={authModal.onOpen} className="rounded-md bg-customYellow px-5 py-2.5 text-sm font-medium text-white shadow">
                    Login
                  </button>
                  <div className="hidden sm:flex">
                    <button onClick={authModal.onOpen} className="rounded-md bg-gray-100 px-5 py-2.5 text-sm font-medium text-customYellow">
                      Sign Up
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="block md:hidden">
              <button className="rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75">
                <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
