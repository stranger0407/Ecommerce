import { api } from '@/lib/api';
import { Product, PageResponse } from '@/types';

export const productService = {
  /**
   * Get all products with pagination
   */
  getAllProducts: async (
    page = 0,
    size = 12,
    sortBy = 'id',
    direction = 'ASC'
  ): Promise<PageResponse<Product>> => {
    return api.get<PageResponse<Product>>('/products', {
      params: { page, size, sortBy, direction },
    });
  },

  /**
   * Get product by ID
   */
  getProductById: async (id: number): Promise<Product> => {
    return api.get<Product>(`/products/${id}`);
  },

  /**
   * Search products by keyword
   */
  searchProducts: async (
    keyword: string,
    page = 0,
    size = 12
  ): Promise<PageResponse<Product>> => {
    return api.get<PageResponse<Product>>('/products/search', {
      params: { keyword, page, size },
    });
  },

  /**
   * Get products by category
   */
  getProductsByCategory: async (
    categoryId: number,
    page = 0,
    size = 12
  ): Promise<PageResponse<Product>> => {
    return api.get<PageResponse<Product>>(`/products/category/${categoryId}`, {
      params: { page, size },
    });
  },

  /**
   * Get products by type
   */
  getProductsByType: async (
    type: string,
    page = 0,
    size = 12
  ): Promise<PageResponse<Product>> => {
    return api.get<PageResponse<Product>>('/products/type', {
      params: { type, page, size },
    });
  },

  /**
   * Get featured products
   */
  getFeaturedProducts: async (page = 0, size = 12): Promise<PageResponse<Product>> => {
    return api.get<PageResponse<Product>>('/products/featured', {
      params: { page, size },
    });
  },

  /**
   * Get all brands
   */
  getAllBrands: async (): Promise<string[]> => {
    return api.get<string[]>('/products/brands');
  },

  /**
   * Create a new product (admin only)
   */
  createProduct: async (product: Partial<Product>): Promise<Product> => {
    return api.post<Product>('/products', product);
  },

  /**
   * Update a product (admin only)
   */
  updateProduct: async (id: number, product: Partial<Product>): Promise<Product> => {
    return api.put<Product>(`/products/${id}`, product);
  },

  /**
   * Delete a product (admin only)
   */
  deleteProduct: async (id: number): Promise<void> => {
    return api.delete<void>(`/products/${id}`);
  },
};
