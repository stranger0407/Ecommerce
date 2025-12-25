import { api } from '@/lib/api';
import { Category } from '@/types';

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
};
