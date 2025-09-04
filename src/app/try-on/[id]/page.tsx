'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../../../context/AuthContext';
import LoadingSpinner from '../../../components/LoadingSpinner';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: string;
  images: string[];
  category: string;
  subcategory: string;
  sizes: string[];
  colors: string[];
}

export default function TryOnPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Try-on states
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isCamera, setIsCamera] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`);
        const data = await response.json();
        
        if (data.success) {
          setProduct(data.product);
        } else {
          setError(data.error || 'Product not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchProduct();
    }
  }, [user, router, params.id]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      setCameraStream(stream);
      setIsCamera(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please ensure camera permissions are granted.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCamera(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setCapturing(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const imageData = canvas.toDataURL('image/jpeg');
      setUploadedImage(imageData);
      stopCamera();
    }
    setCapturing(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateTryOn = async () => {
    if (!uploadedImage || !product) {
      alert('Please upload/capture an image first');
      return;
    }

    setGenerating(true);
    try {
      // TODO: Implement actual try-on API call here
      // For now, simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // TODO: Replace with actual API response
      setResultImage('/try-on-result-placeholder.jpg');
      
      alert('Try-on generation completed! (This is a placeholder - API integration pending)');
    } catch (error) {
      console.error('Error generating try-on:', error);
      alert('Failed to generate try-on result');
    } finally {
      setGenerating(false);
    }
  };

  const resetTryOn = () => {
    setUploadedImage(null);
    setResultImage(null);
    setIsCamera(false);
    stopCamera();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <Link 
            href="/"
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-900"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href={`/product/${product._id}`}
            className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
          >
            ← Back to Product
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Virtual Try-On</h1>
          <p className="text-gray-600 mt-2">See how {product.name} looks on you</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="relative h-64 mb-4">
              <Image
                src={product.images[0] || '/placeholder.jpg'}
                alt={product.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            <p className="text-2xl font-bold text-gray-900 mb-3">{product.price}</p>
            <p className="text-gray-600 text-sm mb-4">{product.description}</p>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <span className="font-medium">Category:</span>
                <span className="ml-2">{product.category}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="font-medium">Type:</span>
                <span className="ml-2">{product.subcategory}</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href={`/product/${product._id}`}
                className="w-full bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-black transition-colors text-center block"
              >
                View Product Details
              </Link>
            </div>
          </div>

          {/* Image Capture/Upload */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Your Photo</h3>
            
            {!uploadedImage && !isCamera ? (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-gray-600 mb-4">Upload a photo or take one with your camera</p>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      📁 Upload Photo
                    </button>
                    
                    <button
                      onClick={startCamera}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      📷 Use Camera
                    </button>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-3">
                    Supported formats: JPG, PNG (Max 5MB)
                  </p>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            ) : isCamera ? (
              <div className="space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none">
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                      LIVE
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={capturePhoto}
                    disabled={capturing}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {capturing ? 'Capturing...' : '📸 Capture'}
                  </button>
                  <button
                    onClick={stopCamera}
                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : uploadedImage ? (
              <div className="space-y-4">
                <div className="relative">
                  <Image
                    src={uploadedImage}
                    alt="Uploaded"
                    width={400}
                    height={256}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={generateTryOn}
                    disabled={generating}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    {generating ? (
                      <>
                        <LoadingSpinner size="small" className="mr-2" />
                        Generating...
                      </>
                    ) : (
                      '✨ Generate Try-On'
                    )}
                  </button>
                  <button
                    onClick={resetTryOn}
                    className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    🔄 Reset
                  </button>
                </div>
                
                <p className="text-xs text-gray-500 text-center">
                  AI processing will show how the {product.name} looks on you
                </p>
              </div>
            ) : null}
          </div>

          {/* Result */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Try-On Result</h3>
            
            {!resultImage ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center h-64 flex items-center justify-center">
                <div>
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <p className="text-gray-500">Your try-on result will appear here</p>
                  <p className="text-xs text-gray-400 mt-2">Upload/capture a photo and click generate</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={resultImage}
                    alt="Try-on result"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
                    ✓ Generated
                  </div>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={() => alert('Download feature coming soon!')}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    💾 Download Result
                  </button>
                  
                  <button
                    onClick={() => alert('Share feature coming soon!')}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    📤 Share Result
                  </button>
                  
                  <Link
                    href={`/product/${product._id}`}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-center block"
                  >
                    🛒 Add to Cart
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 How to get the best results:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-blue-800">
            <div className="flex items-start space-x-2">
              <span className="text-blue-600">1️⃣</span>
              <span>Use good lighting for clear photos</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-600">2️⃣</span>
              <span>Stand straight facing the camera</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-600">3️⃣</span>
              <span>Wear fitting clothes for better results</span>
            </div>
            <div className="flex items-start space-x-2">
              <span className="text-blue-600">4️⃣</span>
              <span>Wait for processing to complete</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
