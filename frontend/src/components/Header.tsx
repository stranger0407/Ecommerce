import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, 
  LogOut, 
  Search, 
  Menu, 
  X, 
  ChevronDown,
  Server,
  Package,
  Phone,
  Info,
  Home,
  UserCircle
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useEffect, useState } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { cart, fetchCart } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart().catch(() => {});
    }
  }, [isAuthenticated, fetchCart]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: Phone },
  ];

  const isActivePath = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header 
        className={`bg-white sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? 'shadow-md' : 'shadow-sm'
        }`}
      >
        {/* Top Bar */}
        <div className="bg-gray-900 text-gray-300 py-2 hidden md:block">
          <div className="container-custom flex justify-between items-center text-xs">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Phone className="h-3 w-3 mr-1" />
                +91 1234567890
              </span>
              <span>|</span>
              <span>support@mahalaxmi.com</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>🚚 Free shipping on orders over ₹50,000</span>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
                <Server className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-gray-900">Mahalaxmi</span>
                <span className="text-xl font-light text-primary-600 ml-1">Enterprise</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActivePath(link.path)
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md mx-6">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search servers, computers..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
                />
                <Search className="absolute left-3.5 top-3 h-5 w-5 text-gray-400" />
              </form>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-2">
              {/* Mobile Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Search className="h-5 w-5 text-gray-700" />
              </button>

              {isAuthenticated ? (
                <>
                  {/* Cart */}
                  <Link
                    to="/cart"
                    className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ShoppingCart className="h-6 w-6 text-gray-700" />
                    {cart && cart.itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                        {cart.itemCount > 99 ? '99+' : cart.itemCount}
                      </span>
                    )}
                  </Link>

                  {/* User Menu */}
                  <div className="relative group">
                    <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary-600">
                          {user?.firstName?.[0]?.toUpperCase() || 'U'}
                        </span>
                      </div>
                      <span className="hidden md:inline text-gray-700 font-medium">
                        {user?.firstName}
                      </span>
                      <ChevronDown className="hidden md:block h-4 w-4 text-gray-500" />
                    </button>
                    
                    {/* Dropdown */}
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <UserCircle className="h-4 w-4 mr-3" />
                        My Profile
                      </Link>
                      <Link
                        to="/profile?tab=orders"
                        className="flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Package className="h-4 w-4 mr-3" />
                        My Orders
                      </Link>
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="hidden sm:inline-flex px-4 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="md:hidden border-t border-gray-100 p-4 bg-white">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search servers, computers..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                autoFocus
              />
              <Search className="absolute left-3.5 top-3 h-5 w-5 text-gray-400" />
            </form>
          </div>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <Link to="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
              <Server className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">Mahalaxmi</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActivePath(link.path)
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {!isAuthenticated && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 space-y-2">
            <Link
              to="/login"
              className="block w-full py-2.5 text-center border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="block w-full py-2.5 text-center bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
            >
              Create Account
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
