'use client';

import Image from 'next/image';
import Link from 'next/link';
import { categoryData } from '../assets/assets';
import { useState } from 'react';

const CategorySelection = () => {
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});

  const handleImageError = (imagePath: string) => {
    setImageErrors(prev => ({ ...prev, [imagePath]: true }));
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Style</h2>
          <p className="text-lg text-gray-600">Select your category to start shopping</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {categoryData.map((category) => (
            <Link 
              key={category.name} 
              href={category.link}
              className="group block"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-105">
                {/* Category Image */}
                <div className="relative h-96 bg-gray-200">
                  {!imageErrors[category.image] ? (
                    <Image
                      src={category.image}
                      alt={`${category.name} category - Browse ${category.name.toLowerCase()} clothing collection`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={() => handleImageError(category.image)}
                      priority={true}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                      <div className="text-white text-center">
                        <h3 className="text-4xl font-bold mb-2">{category.name}</h3>
                        <p className="text-lg opacity-90">Image placeholder</p>
                        <p className="text-sm opacity-75 mt-2">Replace {category.image} in public folder</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-8">
                    <h3 className="text-5xl font-bold mb-4 tracking-wider">{category.name}</h3>
                    <p className="text-xl mb-6 opacity-90">{category.description}</p>
                    
                    {/* CTA Button */}
                    <div className={`${category.bgColor} ${category.hoverColor} px-8 py-4 rounded-full font-semibold text-lg transition-colors duration-300 transform group-hover:scale-110`}>
                      SHOP NOW
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySelection;
