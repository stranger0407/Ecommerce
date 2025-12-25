import { api } from '@/lib/api';
import { Cart, AddToCartRequest } from '@/types';

export const cartService = {
  /**
   * Get current user's cart
   */
  getCart: async (): Promise<Cart> => {
    return api.get<Cart>('/cart');
  },

  /**
   * Add item to cart
   */
  addToCart: async (data: AddToCartRequest): Promise<Cart> => {
    return api.post<Cart>('/cart/items', data);
  },

  /**
   * Update cart item quantity
   */
  updateCartItem: async (itemId: number, quantity: number): Promise<Cart> => {
    return api.put<Cart>(`/cart/items/${itemId}`, null, {
      params: { quantity },
    });
  },

  /**
   * Remove item from cart
   */
  removeFromCart: async (itemId: number): Promise<Cart> => {
    return api.delete<Cart>(`/cart/items/${itemId}`);
  },

  /**
   * Clear entire cart
   */
  clearCart: async (): Promise<Cart> => {
    return api.delete<Cart>('/cart');
  },
};
