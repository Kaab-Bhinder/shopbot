import { useState, useEffect, useCallback } from 'react';

interface Product {
  _id: string;
  name: string;
  price: string;
  image: string;
  sex: 'Men' | 'Women';
  category: 'Formal' | 'Casual' | 'Accessories' | 'Footwear';
  subcategory: string;
  isFeatured?: boolean;
  isNew?: boolean;
  
  // Additional fields for enhanced functionality
  description?: string;
  originalPrice?: number;
  images?: string[];
  category_slug?: string;
  subcategory_slug?: string;
  isOnSale?: boolean;
  discountPercentage?: number;
  rating?: number;
  numReviews?: number;
  isNewArrival?: boolean;
  stock?: number;
  sizes?: string[];
  colors?: string[];
  material?: string;
  care?: string;
  tags?: string[];
}

interface UseProductsOptions {
  category?: string;
  category_slug?: string;
  subcategory?: string;
  subcategory_slug?: string;
  sex?: 'Men' | 'Women';
  isNewArrival?: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  isOnSale?: boolean;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  refetch: () => void;
  setPage: (page: number) => void;
}

export const useProducts = (options: UseProductsOptions = {}): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const fetchProducts = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      if (options.category) params.append('category', options.category);
      if (options.category_slug) params.append('category_slug', options.category_slug);
      if (options.subcategory) params.append('subcategory', options.subcategory);
      if (options.subcategory_slug) params.append('subcategory_slug', options.subcategory_slug);
      if (options.sex) params.append('sex', options.sex);
      if (options.isNewArrival) params.append('isNewArrival', 'true');
      if (options.isFeatured) params.append('isFeatured', 'true');
      if (options.isNew) params.append('isNew', 'true');
      if (options.isOnSale) params.append('isOnSale', 'true');
      if (options.minPrice) params.append('minPrice', options.minPrice.toString());
      if (options.maxPrice) params.append('maxPrice', options.maxPrice.toString());
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.sortBy) params.append('sortBy', options.sortBy);
      if (options.sortOrder) params.append('sortOrder', options.sortOrder);
      
      params.append('page', page.toString());

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.products);
        setPagination(data.pagination);
        setCurrentPage(page);
      } else {
        setError(data.error || 'Failed to fetch products');
      }
    } catch {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [
    options.category,
    options.category_slug,
    options.subcategory,
    options.subcategory_slug,
    options.sex,
    options.isNewArrival,
    options.isFeatured,
    options.isNew,
    options.isOnSale,
    options.minPrice,
    options.maxPrice,
    options.limit,
    options.sortBy,
    options.sortOrder,
  ]);

  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  const refetch = () => {
    fetchProducts(currentPage);
  };

  const setPage = (page: number) => {
    fetchProducts(page);
  };

  return {
    products,
    loading,
    error,
    pagination,
    refetch,
    setPage,
  };
};
