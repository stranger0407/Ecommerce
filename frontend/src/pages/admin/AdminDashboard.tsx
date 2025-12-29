import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService, DashboardStats } from '@/services/adminService';
import { Spinner } from '@/components/ui';

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError('Failed to load dashboard statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error}</p>
        <button onClick={loadStats} className="mt-4 btn-primary">
          Retry
        </button>
      </div>
    );
  }

  if (!stats) return null;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: ProductIcon,
      color: 'from-blue-500 to-blue-600',
      link: '/admin/products',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: OrderIcon,
      color: 'from-green-500 to-green-600',
      link: '/admin/orders',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: UserIcon,
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: RevenueIcon,
      color: 'from-amber-500 to-amber-600',
    },
  ];

  const todayCards = [
    {
      title: "Today's Orders",
      value: stats.ordersToday,
      subtext: `${stats.ordersThisMonth} this month`,
    },
    {
      title: "Today's Revenue",
      value: formatCurrency(stats.revenueToday),
      subtext: `${formatCurrency(stats.revenueThisMonth)} this month`,
    },
  ];

  // Calculate max for chart scaling
  const maxRevenue = Math.max(...stats.dailySales.map((d) => d.revenue), 1);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-gray-400 mt-1">
          Welcome back! Here's what's happening with your store.
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200 group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm">{card.title}</p>
                <p className="text-2xl font-bold text-white mt-2">{card.value}</p>
              </div>
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                <card.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            {card.link && (
              <Link
                to={card.link}
                className="mt-4 text-sm text-primary-400 hover:text-primary-300 inline-flex items-center gap-1"
              >
                View Details →
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {todayCards.map((card, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-2xl p-6 border border-gray-700"
          >
            <p className="text-gray-400 text-sm">{card.title}</p>
            <p className="text-3xl font-bold text-white mt-2">{card.value}</p>
            <p className="text-gray-500 mt-2 text-sm">{card.subtext}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-6">
            Revenue (Last 7 Days)
          </h3>
          <div className="space-y-4">
            {stats.dailySales.map((day, index) => (
              <div key={index} className="flex items-center gap-4">
                <span className="text-gray-400 text-sm w-16">{day.date}</span>
                <div className="flex-1 h-8 bg-gray-700 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-lg transition-all duration-500"
                    style={{
                      width: `${(day.revenue / maxRevenue) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-white text-sm font-medium w-24 text-right">
                  {formatCurrency(day.revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-6">
            Orders by Status
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.ordersByStatus).map(([status, count]) => (
              <div
                key={status}
                className="flex items-center justify-between p-3 bg-gray-700/50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}
                  />
                  <span className="text-gray-300 capitalize">
                    {status.toLowerCase().replace('_', ' ')}
                  </span>
                </div>
                <span className="text-white font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products & Category Sales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-6">
            Top Selling Products
          </h3>
          {stats.topProducts.length > 0 ? (
            <div className="space-y-4">
              {stats.topProducts.map((product, index) => (
                <div
                  key={product.productId}
                  className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-primary-600/20 text-primary-400 flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-white font-medium truncate max-w-[200px]">
                        {product.productName}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {product.quantitySold} units sold
                      </p>
                    </div>
                  </div>
                  <span className="text-green-400 font-semibold">
                    {formatCurrency(product.totalRevenue)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No sales data yet</p>
          )}
        </div>

        {/* Sales by Category */}
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-6">
            Sales by Category
          </h3>
          {Object.keys(stats.salesByCategory).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(stats.salesByCategory)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([category, revenue], _index) => {
                  const maxCatRevenue = Math.max(
                    ...Object.values(stats.salesByCategory)
                  );
                  const percentage = (revenue / maxCatRevenue) * 100;

                  return (
                    <div key={category}>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-300">{category}</span>
                        <span className="text-white font-medium">
                          {formatCurrency(revenue)}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No category data yet</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/admin/products"
            className="flex flex-col items-center justify-center p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors"
          >
            <ProductIcon className="w-8 h-8 text-blue-400 mb-2" />
            <span className="text-gray-300 text-sm">Add Product</span>
          </Link>
          <Link
            to="/admin/categories"
            className="flex flex-col items-center justify-center p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors"
          >
            <CategoryIcon className="w-8 h-8 text-purple-400 mb-2" />
            <span className="text-gray-300 text-sm">Add Category</span>
          </Link>
          <Link
            to="/admin/orders"
            className="flex flex-col items-center justify-center p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors"
          >
            <OrderIcon className="w-8 h-8 text-green-400 mb-2" />
            <span className="text-gray-300 text-sm">View Orders</span>
          </Link>
          <Link
            to="/"
            className="flex flex-col items-center justify-center p-4 bg-gray-700/50 rounded-xl hover:bg-gray-700 transition-colors"
          >
            <StoreIcon className="w-8 h-8 text-amber-400 mb-2" />
            <span className="text-gray-300 text-sm">View Store</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Helper function for status colors
const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-500',
    CONFIRMED: 'bg-blue-500',
    PROCESSING: 'bg-indigo-500',
    SHIPPED: 'bg-purple-500',
    DELIVERED: 'bg-green-500',
    CANCELLED: 'bg-red-500',
    REFUNDED: 'bg-gray-500',
  };
  return colors[status] || 'bg-gray-500';
};

// Icon Components
const ProductIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const OrderIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const RevenueIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CategoryIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const StoreIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

export default AdminDashboard;
