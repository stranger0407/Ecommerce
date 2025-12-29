import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Package, 
  Settings, 
  Shield, 
  Bell,
  ChevronRight,
  Edit3,
  Plus,
  Trash2,
  Eye,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import axios from 'axios';
import { Button, Badge, Spinner } from '@/components/ui';

interface Order {
  id: number;
  orderNumber: string;
  createdAt: string;
  status: string;
  total: number;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
}

interface Address {
  id: number;
  name: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

const Profile = () => {
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get('tab') as 'profile' | 'orders' | 'addresses' | 'settings' | null;
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'settings'>(tabFromUrl || 'profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
  });

  // Sample addresses for demo
  const [addresses] = useState<Address[]>([]);

  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/orders/my-orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put('/api/users/profile', profileData);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: 'default' | 'info' | 'warning' | 'success' | 'danger'; icon: any; label: string }> = {
      PENDING: { color: 'warning', icon: Clock, label: 'Pending' },
      CONFIRMED: { color: 'info', icon: CheckCircle, label: 'Confirmed' },
      PROCESSING: { color: 'info', icon: Package, label: 'Processing' },
      SHIPPED: { color: 'info', icon: Truck, label: 'Shipped' },
      DELIVERED: { color: 'success', icon: CheckCircle, label: 'Delivered' },
      CANCELLED: { color: 'danger', icon: XCircle, label: 'Cancelled' },
    };
    return configs[status] || { color: 'default' as const, icon: AlertCircle, label: status };
  };

  const tabs = [
    { id: 'profile' as const, name: 'Profile', icon: User },
    { id: 'orders' as const, name: 'Orders', icon: Package },
    { id: 'addresses' as const, name: 'Addresses', icon: MapPin },
    { id: 'settings' as const, name: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="container-custom">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600 mt-1">Manage your profile, orders, and preferences</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              {/* User Info */}
              <div className="text-center mb-6 pb-6 border-b border-gray-100">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <span className="text-2xl font-bold text-white">
                    {user?.firstName?.[0]?.toUpperCase()}{user?.lastName?.[0]?.toUpperCase()}
                  </span>
                </div>
                <h2 className="font-semibold text-lg text-gray-900">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-sm text-gray-500">{user?.email}</p>
                <div className="mt-3">
                  <Badge variant="success">Verified Account</Badge>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className={`h-5 w-5 mr-3 ${activeTab === tab.id ? 'text-primary-600' : 'text-gray-400'}`} />
                        <span className="font-medium">{tab.name}</span>
                      </div>
                      <ChevronRight className={`h-4 w-4 ${activeTab === tab.id ? 'text-primary-600' : 'text-gray-300'}`} />
                    </button>
                  );
                })}
              </nav>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                  <p className="text-xs text-gray-500">Total Orders</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{addresses.length}</p>
                  <p className="text-xs text-gray-500">Addresses</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                  <p className="text-sm text-gray-500 mt-1">Update your personal details</p>
                </div>
                <form onSubmit={handleProfileUpdate} className="p-8 space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                        className="input-field"
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                        className="input-field"
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="inline h-4 w-4 mr-1" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      disabled
                      className="input-field bg-gray-50 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="inline h-4 w-4 mr-1" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="input-field"
                      placeholder="+91 12345 67890"
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button type="submit" isLoading={saving}>
                      <Edit3 className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900">Order History</h2>
                  <p className="text-sm text-gray-500 mt-1">View and track your orders</p>
                </div>
                <div className="p-8">
                  {loading ? (
                    <div className="flex justify-center py-12">
                      <Spinner size="lg" />
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
                      <Link to="/products">
                        <Button>Browse Products</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => {
                        const statusConfig = getStatusConfig(order.status);
                        const StatusIcon = statusConfig.icon;
                        return (
                          <div 
                            key={order.id} 
                            className="border border-gray-200 rounded-xl p-6 hover:border-primary-200 hover:shadow-md transition-all"
                          >
                            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                              <div>
                                <h3 className="font-semibold text-lg text-gray-900">
                                  Order #{order.orderNumber}
                                </h3>
                                <p className="text-sm text-gray-500 flex items-center mt-1">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </p>
                              </div>
                              <Badge variant={statusConfig.color}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusConfig.label}
                              </Badge>
                            </div>
                            
                            <div className="border-t border-gray-100 pt-4">
                              {order.items.slice(0, 2).map((item, index) => (
                                <div key={index} className="flex justify-between py-2 text-sm">
                                  <span className="text-gray-700">
                                    {item.productName} × {item.quantity}
                                  </span>
                                  <span className="font-medium text-gray-900">
                                    ₹{item.price.toLocaleString('en-IN')}
                                  </span>
                                </div>
                              ))}
                              {order.items.length > 2 && (
                                <p className="text-sm text-gray-500 py-2">
                                  +{order.items.length - 2} more items
                                </p>
                              )}
                            </div>
                            
                            <div className="border-t border-gray-100 pt-4 mt-4 flex flex-wrap justify-between items-center gap-4">
                              <div>
                                <span className="text-sm text-gray-500">Order Total</span>
                                <p className="text-xl font-bold text-primary-600">
                                  ₹{order.total.toLocaleString('en-IN')}
                                </p>
                              </div>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Saved Addresses</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage your delivery addresses</p>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                  </Button>
                </div>
                <div className="p-8">
                  {addresses.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MapPin className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved addresses</h3>
                      <p className="text-gray-500 mb-6">Add an address for faster checkout</p>
                      <Button variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Address
                      </Button>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {addresses.map((address) => (
                        <div 
                          key={address.id}
                          className={`border rounded-xl p-5 relative ${
                            address.isDefault ? 'border-primary-300 bg-primary-50' : 'border-gray-200'
                          }`}
                        >
                          {address.isDefault && (
                            <Badge variant="success" className="absolute top-4 right-4">
                              Default
                            </Badge>
                          )}
                          <h4 className="font-semibold text-gray-900 mb-2">{address.name}</h4>
                          <p className="text-sm text-gray-600">
                            {address.street}<br />
                            {address.city}, {address.state} {address.postalCode}<br />
                            {address.country}
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            <Phone className="inline h-3 w-3 mr-1" />
                            {address.phone}
                          </p>
                          <div className="mt-4 flex gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Security Settings */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-primary-600" />
                      Security
                    </h2>
                  </div>
                  <div className="p-8 space-y-4">
                    <div className="flex justify-between items-center py-4 border-b border-gray-100">
                      <div>
                        <h4 className="font-medium text-gray-900">Password</h4>
                        <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                      </div>
                      <Button variant="outline" size="sm">Change Password</Button>
                    </div>
                    <div className="flex justify-between items-center py-4">
                      <div>
                        <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-500">Add an extra layer of security</p>
                      </div>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      <Bell className="h-5 w-5 mr-2 text-primary-600" />
                      Notifications
                    </h2>
                  </div>
                  <div className="p-8 space-y-4">
                    {[
                      { name: 'Order Updates', description: 'Get notified about your order status' },
                      { name: 'Promotions', description: 'Receive deals and special offers' },
                      { name: 'Newsletter', description: 'Weekly product updates and tips' },
                    ].map((notification, index) => (
                      <div key={index} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0">
                        <div>
                          <h4 className="font-medium text-gray-900">{notification.name}</h4>
                          <p className="text-sm text-gray-500">{notification.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
