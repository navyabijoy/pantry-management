import React from 'react'

export default function Footer() {
  return (
    <footer className="bg-gray-50 mt-20">
  <div className="relative mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 lg:pt-24">
    

    <div className="lg:flex lg:items-end lg:justify-between">
      <div>
      <img className="h-8" src="/assets/logo.png" alt="Logo" />

        <p className="mx-auto mt-6 max-w-md text-center leading-relaxed text-gray-500 lg:text-left">
          StockUp helps you manage your pantry smarter. Track inventory, reduce food waste, and discover new recipes with our AI-powered kitchen companion.
        </p>
      </div>

      
    </div>

    <p className="mt-12 text-center text-sm text-gray-500 lg:text-right">
      Copyright &copy; 2024. All rights reserved.
    </p>
  </div>
</footer>
  )
}
