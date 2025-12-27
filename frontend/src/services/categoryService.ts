import { api } from '@/lib/api';
import { Category } from '@/types';

interface CategoryData {
  name: string;
  description?: string;
  imageUrl?: string;
  parentId?: number | null;
  active?: boolean;
}

export const categoryService = {
  /**
   * Get all active categories
   */
  getAllCategories: async (): Promise<Category[]> => {
    return api.get<Category[]>('/categories');
  },

  /**
   * Get all root categories
   */
  getRootCategories: async (): Promise<Category[]> => {
    return api.get<Category[]>('/categories/root');
  },

  /**
   * Get category by ID
   */
  getCategoryById: async (id: number): Promise<Category> => {
    return api.get<Category>(`/categories/${id}`);
  },

  /**
   * Get subcategories of a parent category
   */
  getSubcategories: async (parentId: number): Promise<Category[]> => {
    return api.get<Category[]>(`/categories/${parentId}/subcategories`);
  },

  /**
   * Create a new category (admin only)
   */
  createCategory: async (data: CategoryData): Promise<Category> => {
    return api.post<Category>('/categories', data);
  },

  /**
   * Update a category (admin only)
   */
  updateCategory: async (id: number, data: CategoryData): Promise<Category> => {
    return api.put<Category>(`/categories/${id}`, data);
  },

  /**
   * Delete a category (admin only)
   */
  deleteCategory: async (id: number): Promise<void> => {
    return api.delete<void>(`/categories/${id}`);
  },
};

