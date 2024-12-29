import React from 'react'

export default function FAQ() {
  return (
    <section className="py-16 bg-white mb-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Frequently Asked Questions
        </h2>
        {/* <p className="mt-4 text-xl text-gray-600">
          Everything you need to keep your pantry organized and efficient
        </p> */}
      </div>
  <div className="space-y-4 mt-10">
  <details className="group [&_summary::-webkit-details-marker]:hidden" >
    <summary
      className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-gray-50 p-4 text-gray-900"
    >
      <h2 className="font-medium">What is StockUp and how does it work?</h2>

      <svg
        className="size-5 shrink-0 transition duration-300 group-open:-rotate-180"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </summary>

    <p className="mt-4 px-4 leading-relaxed text-gray-700">
      StockUp is a smart pantry management app that helps you keep track of your food inventory. Using AI-powered image recognition, you can quickly add items by taking photos. The app helps you monitor expiration dates, generate shopping lists, and even suggests recipes based on your available ingredients.
    </p>
  </details>
  <details className="group [&_summary::-webkit-details-marker]:hidden" >
    <summary
      className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-gray-50 p-4 text-gray-900"
    >
      <h2 className="font-medium">How does the AI image recognition feature work?</h2>

      <svg
        className="size-5 shrink-0 transition duration-300 group-open:-rotate-180"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </summary>

    <p className="mt-4 px-4 leading-relaxed text-gray-700">
      Simply take a photo of your pantry item using your device's camera or upload an existing image. Our AI technology, powered by MobileNet, will automatically identify the item and suggest its name. You can then confirm or modify the details before adding it to your inventory. This makes adding new items quick and effortless!
    </p>
  </details>
  <details className="group [&_summary::-webkit-details-marker]:hidden" >
    <summary
      className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-gray-50 p-4 text-gray-900"
    >
      <h2 className="font-medium">Is my data secure with StockUp?</h2>

      <svg
        className="size-5 shrink-0 transition duration-300 group-open:-rotate-180"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </summary>

    <p className="mt-4 px-4 leading-relaxed text-gray-700">
      Yes, absolutely! We take data security seriously. All your data is encrypted and stored securely using Supabase, a trusted database platform. Your personal information and pantry inventory are only accessible to you through your authenticated account. We never share your data with third parties without your explicit consent.
    </p>
  </details>

  <details className="group [&_summary::-webkit-details-marker]:hidden">
    <summary
      className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-gray-50 p-4 text-gray-900"
    >
      <h2 className="font-medium">Do I need to pay to use StockUp?</h2>

      <svg
        className="size-5 shrink-0 transition duration-300 group-open:-rotate-180"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
    </summary>

    <p className="mt-4 px-4 leading-relaxed text-gray-700">
      No, StockUp is completely free to use! All features including inventory management, AI image recognition, and recipe suggestions are available to everyone at no cost. We are committed to keeping StockUp free and accessible to all users.
    </p>
  </details>

  
  </div>
    </div>
  </section>
  )
}
