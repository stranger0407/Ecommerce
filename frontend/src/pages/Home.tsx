import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Server,
  Laptop,
  Monitor,
  Cpu,
  Shield,
  Truck,
  HeadphonesIcon,
  Award,
  ArrowRight,
  ChevronRight,
  Star,
  Zap,
} from 'lucide-react';
import { Product, Category } from '@/types';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import ProductCard from '@/components/ProductCard';
import { Button, LoadingOverlay } from '@/components/ui';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          productService.getFeaturedProducts(0, 8),
          categoryService.getAllCategories(),
        ]);
        setFeaturedProducts(productsResponse.content);
        setCategories(categoriesResponse);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getCategoryIcon = (name: string) => {
    const icons: Record<string, React.ReactNode> = {
      Servers: <Server className="h-10 w-10" />,
      'Desktop Computers': <Monitor className="h-10 w-10" />,
      Laptops: <Laptop className="h-10 w-10" />,
      Components: <Cpu className="h-10 w-10" />,
    };
    return icons[name] || <Cpu className="h-10 w-10" />;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container-custom relative z-10">
          <div className="py-24 md:py-32 lg:py-40">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span>Enterprise-Grade Solutions</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  Power Your Business with
                  <span className="bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
                    {' '}Premium Hardware
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
                  From high-performance servers to cutting-edge workstations, we provide 
                  enterprise-grade computing solutions that drive your success.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Link to="/products">
                    <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                      Explore Products
                    </Button>
                  </Link>
                  <Link to="/contact">
                    <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                      Contact Sales
                    </Button>
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-wrap items-center gap-6 mt-12 pt-8 border-t border-white/20">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-400" />
                    <span className="text-sm text-gray-300">Secure Payments</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-blue-400" />
                    <span className="text-sm text-gray-300">Free Shipping</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-400" />
                    <span className="text-sm text-gray-300">Warranty Included</span>
                  </div>
                </div>
              </div>

              {/* Hero Image/Stats */}
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary-500 to-cyan-500 rounded-3xl blur-3xl opacity-20"></div>
                  <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                    <img 
                      src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop" 
                      alt="Server Hardware" 
                      className="rounded-xl shadow-2xl w-full"
                    />
                    
                    {/* Floating Stats Cards */}
                    <div className="absolute -left-8 top-1/4 bg-white rounded-xl shadow-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-lg">
                          <Star className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">4.9</p>
                          <p className="text-xs text-gray-500">Customer Rating</p>
                        </div>
                      </div>
                    </div>

                    <div className="absolute -right-8 bottom-1/4 bg-white rounded-xl shadow-xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary-100 p-2 rounded-lg">
                          <Server className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">500+</p>
                          <p className="text-xs text-gray-500">Products</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of enterprise computing solutions designed for every business need
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.length > 0 ? (
              categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-4 rounded-2xl text-primary-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                      {getCategoryIcon(category.name)}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{category.description}</p>
                  </div>
                </Link>
              ))
            ) : (
              <>
                <Link
                  to="/products?type=SERVER"
                  className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-4 rounded-2xl text-primary-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Server className="h-10 w-10" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Servers</h3>
                    <p className="text-sm text-gray-500">Enterprise rack & tower servers</p>
                  </div>
                </Link>

                <Link
                  to="/products?type=DESKTOP_COMPUTER"
                  className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-4 rounded-2xl text-primary-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Monitor className="h-10 w-10" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Desktops</h3>
                    <p className="text-sm text-gray-500">Professional workstations</p>
                  </div>
                </Link>

                <Link
                  to="/products?type=LAPTOP"
                  className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-4 rounded-2xl text-primary-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Laptop className="h-10 w-10" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Laptops</h3>
                    <p className="text-sm text-gray-500">Business & gaming laptops</p>
                  </div>
                </Link>

                <Link
                  to="/products?type=COMPONENT"
                  className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-4 rounded-2xl text-primary-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Cpu className="h-10 w-10" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">Components</h3>
                    <p className="text-sm text-gray-500">Upgrades & accessories</p>
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Featured Products
              </h2>
              <p className="text-gray-600">
                Handpicked selections for optimal performance
              </p>
            </div>
            <Link 
              to="/products" 
              className="inline-flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700 transition-colors"
            >
              View All Products
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>

          {loading ? (
            <LoadingOverlay message="Loading products..." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!loading && featuredProducts.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <Server className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No featured products available</p>
            </div>
          )}
        </div>
      </section>

      {/* Features/Benefits Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Mahalaxmi?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We're committed to providing the best enterprise computing solutions with unmatched service
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Genuine Products</h3>
              <p className="text-gray-400">
                100% authentic products directly from authorized distributors
              </p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Fast Delivery</h3>
              <p className="text-gray-400">
                Free express shipping on orders above ₹50,000
              </p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Warranty Support</h3>
              <p className="text-gray-400">
                Comprehensive manufacturer warranty on all products
              </p>
            </div>

            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <HeadphonesIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Expert Support</h3>
              <p className="text-gray-400">
                Technical assistance from certified professionals
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-16 border-t border-gray-800">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary-400 mb-2">15+</div>
              <div className="text-gray-400">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary-400 mb-2">10K+</div>
              <div className="text-gray-400">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary-400 mb-2">500+</div>
              <div className="text-gray-400">Products</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary-400 mb-2">24/7</div>
              <div className="text-gray-400">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your IT Infrastructure?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Get in touch with our team of experts for customized solutions tailored to your business needs
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/products">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                Browse Products
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                Request a Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
