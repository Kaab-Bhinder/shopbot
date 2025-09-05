// Image paths
export const images = {
  // Banner images - using local images from public folder
  banner1: '/banner-1.jpg',
  banner2: '/banner-2.jpg',
  banner3: '/banner-3.jpg',
  banner4: '/banner-4.jpg',
  
  // Product images - using local images from public folder
  product1: '/product-1.jpg',
  product2: '/product-2.jpg',
  product3: '/product-3.jpg',
  product4: '/product-4.jpg',
  
  // Category images - placeholder images (replace these files in public folder)
  menCategory: '/men-category.jpg',
  womenCategory: '/women-category.jpg',
  
  // Try-on demo images - placeholder images (replace these files in public folder)
  tryonDemo1: '/tryon-demo-1.jpg',
  tryonDemo2: '/tryon-demo-2.jpg',
  tryonDemo3: '/tryon-demo-3.jpg',
};

// Banner data
export const bannerData = [
  {
    id: 1,
    image: images.banner1,
    title: 'FORMAL & CASUAL',
    subtitle: 'SHIRT COLLECTION',
    overlay: 'bg-black bg-opacity-30'
  },
  {
    id: 2,
    image: images.banner2,
    title: 'SUMMER STYLE',
    subtitle: 'NEW ARRIVALS',
    overlay: 'bg-blue-900 bg-opacity-25'
  },
  {
    id: 3,
    image: images.banner3,
    title: 'WINTER COLLECTION',
    subtitle: 'PREMIUM QUALITY',
    overlay: 'bg-gray-900 bg-opacity-35'
  },
  {
    id: 4,
    image: images.banner4,
    title: 'ACCESSORIES',
    subtitle: 'COMPLETE YOUR LOOK',
    overlay: 'bg-purple-900 bg-opacity-30'
  }
];

// Category data
export const categoryData = [
  {
    name: 'MEN',
    image: images.menCategory,
    description: 'Explore our men\'s collection',
    link: '/men',
    bgColor: 'bg-blue-600',
    hoverColor: 'hover:bg-blue-700'
  },
  {
    name: 'WOMEN',
    image: images.womenCategory,
    description: 'Discover women\'s fashion',
    link: '/women',
    bgColor: 'bg-pink-600',
    hoverColor: 'hover:bg-pink-700'
  }
];

// Try-on feature data
// export const tryonFeatureData = [
//   {
//     id: 0,
//     title: 'Virtual Try-On',
//     subtitle: 'See how clothes look on you',
//     description: 'Our AI-powered virtual try-on technology lets you visualize any outfit on your body type before making a purchase. No more guessing games!',
//     icon: '👕',
//     image: images.tryonDemo1,
//     benefits: ['Real-time visualization', 'Accurate body mapping', 'Multiple angles view']
//   },
//   {
//     id: 1,
//     title: 'Smart Sizing',
//     subtitle: 'Perfect fit guaranteed',
//     description: 'Get personalized size recommendations based on your measurements and previous purchases. Our algorithm learns your preferences over time.',
//     icon: '📏',
//     image: images.tryonDemo2,
//     benefits: ['AI size prediction', 'Body measurements', 'Fit history tracking']
//   },
//   {
//     id: 2,
//     title: 'Style Matching',
//     subtitle: 'Discover your perfect look',
//     description: 'Our style AI suggests complete outfits and accessories that match your personal style and the items you\'re trying on.',
//     icon: '🎨',
//     image: images.tryonDemo3,
//     benefits: ['Outfit suggestions', 'Color coordination', 'Style preferences']
//   }
// ];

// SVG icons
export const icons = {
  // Product icons
  tryOn: '👕',
  search: '🔍',
  heart: '❤️',
  cart: '🛒'
};
