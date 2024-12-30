import React from 'react';
import { 
  ShoppingCartIcon, 
  SparklesIcon, 
  CameraIcon,
  HeartIcon 
} from "@heroicons/react/24/outline";

export default function Features() {
  const features = [
    {
      title: "Smart Inventory Management",
      description: "Easily track, add and update your pantry items in real-time.",
      icon: <ShoppingCartIcon className="h-8 w-8 text-customYellow" />,
    },
    {
      title: "AI-Powered Item Recognition",
      description: "Take a photo and let AI identify your pantry items automatically.",
      icon: <CameraIcon className="h-8 w-8 text-customYellow" />,
    },
    {
      title: "Generate Recipes",
      description: "Generate recipes based on your pantry items and preferences.",
      icon: <SparklesIcon className="h-8 w-8 text-customYellow" />,
    },
    {
      title: "User-Friendly Interface",
      description: "Easy to use and navigate, with a clean and intuitive design.",
      icon: <HeartIcon className="h-8 w-8 text-customYellow" />,
    },
  ];

  return (
    <section className="py-16 bg-white mt-20 mb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Features that make pantry management easier
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Everything you need to keep your pantry organized and efficient
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="relative group"
              >
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 group-hover:bg-customYellow/10 transition-colors duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="mt-8 text-lg font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-4 text-base text-gray-600 text-center">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
