import { api } from '@/lib/api';
import { PageResponse, Order } from '@/types';

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  ordersToday: number;
  revenueToday: number;
  ordersThisMonth: number;
  revenueThisMonth: number;
  ordersByStatus: Record<string, number>;
  dailySales: DailySales[];
  topProducts: TopProduct[];
  salesByCategory: Record<string, number>;
}

export interface DailySales {
  date: string;
  orders: number;
  revenue: number;
}

export interface TopProduct {
  productId: number;
  productName: string;
  quantitySold: number;
  totalRevenue: number;
}

export interface AdminUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  enabled: boolean;
  createdAt: string;
  totalOrders: number;
}

export interface UpdateOrderStatusRequest {
  status: string;
  trackingNumber?: string;
  notes?: string;
}

export const adminService = {
  /**
   * Get dashboard statistics
   */
  getDashboardStats: async (): Promise<DashboardStats> => {
    return api.get<DashboardStats>('/admin/dashboard/stats');
  },

  /**
   * Get all orders (paginated)
   */
  getAllOrders: async (
    page = 0,
    size = 10
  ): Promise<PageResponse<Order>> => {
    return api.get<PageResponse<Order>>('/admin/orders', {
      params: { page, size },
    });
  },

  /**
   * Get orders by status
   */
  getOrdersByStatus: async (
    status: string,
    page = 0,
    size = 10
  ): Promise<PageResponse<Order>> => {
    return api.get<PageResponse<Order>>(`/admin/orders/status/${status}`, {
      params: { page, size },
    });
  },

  /**
   * Search orders
   */
  searchOrders: async (
    keyword: string,
    page = 0,
    size = 10
  ): Promise<PageResponse<Order>> => {
    return api.get<PageResponse<Order>>('/admin/orders/search', {
      params: { keyword, page, size },
    });
  },

  /**
   * Get order by ID
   */
  getOrderById: async (orderId: number): Promise<Order> => {
    return api.get<Order>(`/admin/orders/${orderId}`);
  },

  /**
   * Update order status
   */
  updateOrderStatus: async (
    orderId: number,
    request: UpdateOrderStatusRequest
  ): Promise<Order> => {
    return api.put<Order>(`/admin/orders/${orderId}/status`, request);
  },

  /**
   * Get all users (paginated)
   */
  getAllUsers: async (
    page = 0,
    size = 10
  ): Promise<PageResponse<AdminUser>> => {
    return api.get<PageResponse<AdminUser>>('/admin/users', {
      params: { page, size },
    });
  },
};
