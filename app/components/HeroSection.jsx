"use client"
import React from 'react'
import AuthModal from './AuthModal'
import { useState } from 'react';
import useAuthModal from '@/hooks/useAuthModal';

export default function HeroSection() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const authModal = useAuthModal();

  const handleLogin = () => {
    authModal.onOpen();
  };
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 min-h-screen">
      

      <div className="relative mx-auto max-w-screen-xl px-4 py-12 md:py-20 lg:py-32 min-h-[90vh] flex flex-col lg:flex-row items-center justify-center gap-8">
        <div className="w-full max-w-xl text-center lg:text-left lg:w-1/2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 lg:text-6xl">
            Your kitchen's
            <span className="block mt-2 text-customYellow">best friend!</span>
          </h1>

          <p className="mt-4 md:mt-6 text-base md:text-lg leading-8 text-gray-600">
            Effortlessly manage your pantry with our smart kitchen companion. Track inventory, reduce waste, and transform your kitchen organization.
          </p>

          <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <a
              onClick={handleLogin}
              className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-8 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-gray-900/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer"
            >
              Get Started Free
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>

            {isAuthModalOpen && (
              <AuthModal open={isAuthModalOpen} setOpen={setIsAuthModalOpen} />
            )}
          </div>
        </div>

        <div className="w-full h-full lg:w-1/2">
          <div className="relative mt-8 lg:mt-0">
            <img
              src="/assets/app-screenshot.png"
              alt="App screenshot"
              className="w-full h-full rounded-xl shadow-2xl ring-1 ring-gray-900/10"
              width={2432}
              height={1442}
            />
            <div className="absolute -bottom-6 -left-6 md:-bottom-12 md:-left-12 w-60 md:w-72 rounded-lg bg-white/90 backdrop-blur p-4 md:p-6 shadow-lg ring-1 ring-gray-900/10">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-customYellow flex items-center justify-center">
                  <svg className="h-5 w-5 md:h-6 md:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Smart Inventory</h3>
                  <p className="text-xs md:text-sm text-gray-500">Track your items automatically</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
