import { useEffect, useState } from 'react';
import { adminService, UpdateOrderStatusRequest } from '@/services/adminService';
import { Order, PageResponse } from '@/types';
import { Spinner } from '@/components/ui';

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadOrders();
  }, [page, statusFilter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      let data: PageResponse<Order>;
      
      if (statusFilter) {
        data = await adminService.getOrdersByStatus(statusFilter, page, 10);
      } else {
        data = await adminService.getAllOrders(page, 10);
      }
      
      setOrders(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadOrders();
      return;
    }
    try {
      setLoading(true);
      const data = await adminService.searchOrders(searchTerm, 0, 10);
      setOrders(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      const request: UpdateOrderStatusRequest = { status: newStatus };
      await adminService.updateOrderStatus(orderId, request);
      setSuccessMessage('Order status updated!');
      loadOrders();
      if (selectedOrder?.id === orderId) {
        const updated = await adminService.getOrderById(orderId);
        setSelectedOrder(updated);
      }
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const orderStatuses = [
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
    'REFUNDED',
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-900/50 text-yellow-400 border-yellow-500/30',
      CONFIRMED: 'bg-blue-900/50 text-blue-400 border-blue-500/30',
      PROCESSING: 'bg-indigo-900/50 text-indigo-400 border-indigo-500/30',
      SHIPPED: 'bg-purple-900/50 text-purple-400 border-purple-500/30',
      DELIVERED: 'bg-green-900/50 text-green-400 border-green-500/30',
      CANCELLED: 'bg-red-900/50 text-red-400 border-red-500/30',
      REFUNDED: 'bg-gray-900/50 text-gray-400 border-gray-500/30',
    };
    return colors[status] || 'bg-gray-900/50 text-gray-400';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'text-yellow-400',
      PAID: 'text-green-400',
      FAILED: 'text-red-400',
      REFUNDED: 'text-gray-400',
    };
    return colors[status] || 'text-gray-400';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <p className="text-gray-400">Manage customer orders</p>
      </div>

      {/* Messages */}
      {successMessage && (
        <div className="bg-green-900/50 border border-green-500 text-green-400 px-4 py-3 rounded-xl">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-400 px-4 py-3 rounded-xl">
          {error}
          <button onClick={() => setError(null)} className="float-right">
            ×
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Search by order number or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button onClick={handleSearch} className="btn-secondary">
            Search
          </button>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(0);
          }}
          className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Statuses</option>
          {orderStatuses.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0) + status.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                    Order
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                    Payment
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-700/30">
                    <td className="px-6 py-4">
                      <p className="text-white font-mono text-sm">
                        {order.orderNumber}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {order.items?.length || 0} items
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-300">
                        {order.shippingAddress?.city || 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-white font-medium">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={getPaymentStatusColor(order.paymentStatus)}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium border ${getStatusColor(
                          order.status
                        )} bg-transparent focus:outline-none cursor-pointer`}
                      >
                        {orderStatuses.map((status) => (
                          <option
                            key={status}
                            value={status}
                            className="bg-gray-800 text-white"
                          >
                            {status.charAt(0) + status.slice(1).toLowerCase()}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-4 py-2 text-sm text-primary-400 hover:text-primary-300 hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No orders found</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-700">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
              >
                Previous
              </button>
              <span className="text-gray-400">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page >= totalPages - 1}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">Order Details</h2>
                <p className="text-gray-400 font-mono text-sm">
                  {selectedOrder.orderNumber}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status & Payment */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700/50 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Order Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="bg-gray-700/50 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Payment Status</p>
                  <span
                    className={`font-medium ${getPaymentStatusColor(
                      selectedOrder.paymentStatus
                    )}`}
                  >
                    {selectedOrder.paymentStatus}
                  </span>
                  {selectedOrder.paymentMethod && (
                    <p className="text-gray-500 text-xs mt-1">
                      via {selectedOrder.paymentMethod.replace('_', ' ')}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 bg-gray-700/30 rounded-xl p-4"
                    >
                      <img
                        src={item.product?.imageUrls?.[0] || '/placeholder.png'}
                        alt={item.product?.name}
                        className="w-16 h-16 rounded-lg object-cover bg-gray-700"
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium">
                          {item.product?.name}
                        </p>
                        <p className="text-gray-400 text-sm">
                          Qty: {item.quantity} × {formatCurrency(item.price)}
                        </p>
                      </div>
                      <p className="text-white font-medium">
                        {formatCurrency(item.subtotal)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-gray-700/30 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatCurrency(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Tax (GST)</span>
                  <span>{formatCurrency(selectedOrder.tax)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span>
                  <span>{formatCurrency(selectedOrder.shippingCost)}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-gray-600">
                  <span>Total</span>
                  <span>{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>

              {/* Shipping Address */}
              {selectedOrder.shippingAddress && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Shipping Address
                  </h3>
                  <div className="bg-gray-700/30 rounded-xl p-4">
                    <p className="text-gray-300">
                      {selectedOrder.shippingAddress.street}
                    </p>
                    <p className="text-gray-300">
                      {selectedOrder.shippingAddress.city},{' '}
                      {selectedOrder.shippingAddress.state}{' '}
                      {selectedOrder.shippingAddress.postalCode}
                    </p>
                    <p className="text-gray-300">
                      {selectedOrder.shippingAddress.country}
                    </p>
                  </div>
                </div>
              )}

              {/* Tracking */}
              {selectedOrder.trackingNumber && (
                <div className="bg-gray-700/30 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Tracking Number</p>
                  <p className="text-white font-mono">
                    {selectedOrder.trackingNumber}
                  </p>
                </div>
              )}

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="bg-gray-700/30 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">Notes</p>
                  <p className="text-gray-300">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Update Status */}
              <div className="border-t border-gray-700 pt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Update Status
                </label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    handleStatusUpdate(selectedOrder.id, e.target.value)
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {orderStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0) + status.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Icons
const CloseIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default AdminOrders;
