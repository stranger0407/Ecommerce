import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import Badge from './ui/Badge';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
}

const ProductCard = ({ product, showAddToCart = true }: ProductCardProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await addToCart(product.id, 1);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const isOutOfStock = product.stockQuantity === 0;
  const isLowStock = product.stockQuantity > 0 && product.stockQuantity <= 5;

  return (
    <Link
      to={`/products/${product.id}`}
      className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-primary-200 transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {product.imageUrls && product.imageUrls[0] ? (
          <img
            src={product.imageUrls[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <svg
              className="w-16 h-16 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.featured && (
            <Badge variant="info" size="sm">
              Featured
            </Badge>
          )}
          {isOutOfStock && (
            <Badge variant="danger" size="sm">
              Out of Stock
            </Badge>
          )}
          {isLowStock && (
            <Badge variant="warning" size="sm">
              Only {product.stockQuantity} left
            </Badge>
          )}
        </div>

        {/* Quick Add Button */}
        {showAddToCart && !isOutOfStock && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary-600 hover:text-white"
            title="Add to Cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Brand */}
        <p className="text-xs font-medium text-primary-600 uppercase tracking-wide mb-1">
          {product.brand}
        </p>

        {/* Name */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>

        {/* Type Badge */}
        <div className="mb-3">
          <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product.type.replace('_', ' ')}
          </span>
        </div>

        {/* Price & Stock */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-gray-900">
              ₹{product.price.toLocaleString('en-IN')}
            </p>
          </div>
          {!isOutOfStock && (
            <span className="text-xs text-green-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              In Stock
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
