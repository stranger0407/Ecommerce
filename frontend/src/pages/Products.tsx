import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Grid3X3,
  LayoutList,
  Server,
} from 'lucide-react';
import { Product, Category } from '@/types';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import ProductCard from '@/components/ProductCard';
import { Button, Input, LoadingOverlay, Badge } from '@/components/ui';

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';
type ViewMode = 'grid' | 'list';

const PRODUCT_TYPES = [
  { value: 'SERVER', label: 'Servers' },
  { value: 'DESKTOP_COMPUTER', label: 'Desktop Computers' },
  { value: 'LAPTOP', label: 'Laptops' },
  { value: 'WORKSTATION', label: 'Workstations' },
  { value: 'COMPONENT', label: 'Components' },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
];

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  // Filter states
  const [selectedType, setSelectedType] = useState<string>(searchParams.get('type') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState<string>(searchParams.get('brand') || '');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Load categories and brands on mount
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [categoriesData, brandsData] = await Promise.all([
          categoryService.getAllCategories(),
          productService.getAllBrands(),
        ]);
        setCategories(categoriesData);
        setBrands(brandsData);
      } catch (error) {
        console.error('Error loading filters:', error);
      }
    };
    loadFilters();
  }, []);

  // Load products when filters change
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const keyword = searchParams.get('search');
        const type = searchParams.get('type');
        const category = searchParams.get('category');

        let response;
        if (keyword) {
          response = await productService.searchProducts(keyword, page, 12);
        } else if (type) {
          response = await productService.getProductsByType(type, page, 12);
        } else if (category) {
          response = await productService.getProductsByCategory(parseInt(category), page, 12);
        } else {
          response = await productService.getAllProducts(page, 12, getSortField(), getSortDirection());
        }

        setProducts(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [page, searchParams, sortBy]);

  const getSortField = () => {
    switch (sortBy) {
      case 'price-asc':
      case 'price-desc':
        return 'price';
      case 'name-asc':
      case 'name-desc':
        return 'name';
      default:
        return 'createdAt';
    }
  };

  const getSortDirection = () => {
    return sortBy.endsWith('-asc') ? 'ASC' : 'DESC';
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ search: searchQuery.trim() });
    } else {
      setSearchParams({});
    }
    setPage(0);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
    setPage(0);
  };

  const clearAllFilters = () => {
    setSearchParams({});
    setSelectedType('');
    setSelectedCategory('');
    setSelectedBrand('');
    setPriceRange({ min: '', max: '' });
    setSearchQuery('');
    setPage(0);
  };

  const hasActiveFilters = useMemo(() => {
    return selectedType || selectedCategory || selectedBrand || searchParams.get('search');
  }, [selectedType, selectedCategory, selectedBrand, searchParams]);

  // Filter products client-side for brand and stock
  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    if (selectedBrand) {
      result = result.filter(p => p.brand === selectedBrand);
    }
    
    if (inStockOnly) {
      result = result.filter(p => p.stockQuantity > 0);
    }

    if (priceRange.min) {
      result = result.filter(p => p.price >= parseFloat(priceRange.min));
    }
    if (priceRange.max) {
      result = result.filter(p => p.price <= parseFloat(priceRange.max));
    }

    return result;
  }, [products, selectedBrand, inStockOnly, priceRange]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="container-custom py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <form onSubmit={handleSearch} className="w-full lg:w-auto lg:flex-1 lg:max-w-md">
              <div className="relative">
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search servers, computers, components..."
                  leftIcon={<Search className="h-5 w-5" />}
                  className="pr-20"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Controls */}
            <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                  showFilters ? 'bg-primary-50 border-primary-200 text-primary-600' : 'hover:bg-gray-50'
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                {hasActiveFilters && (
                  <span className="bg-primary-600 text-white text-xs px-1.5 py-0.5 rounded-full">!</span>
                )}
              </button>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="appearance-none bg-white border rounded-lg px-4 py-2 pr-10 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {/* View Toggle */}
              <div className="hidden sm:flex items-center border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'}`}
                >
                  <Grid3X3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-primary-50 text-primary-600' : 'hover:bg-gray-50'}`}
                >
                  <LayoutList className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`
              fixed lg:static inset-0 z-50 lg:z-auto
              w-80 lg:w-72 flex-shrink-0
              bg-white lg:bg-transparent
              transform lg:transform-none transition-transform duration-300
              ${showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
              ${showFilters ? 'block' : 'hidden lg:block'}
            `}
          >
            <div className="h-full overflow-y-auto lg:overflow-visible p-6 lg:p-0">
              {/* Mobile Header */}
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button onClick={() => setShowFilters(false)}>
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Active Filters */}
                {hasActiveFilters && (
                  <div className="bg-white rounded-xl border p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">Active Filters</h3>
                      <button
                        onClick={clearAllFilters}
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {searchParams.get('search') && (
                        <Badge variant="info">
                          Search: {searchParams.get('search')}
                          <button onClick={() => handleFilterChange('search', '')} className="ml-1">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                      {selectedType && (
                        <Badge variant="info">
                          {PRODUCT_TYPES.find(t => t.value === selectedType)?.label}
                          <button onClick={() => { setSelectedType(''); handleFilterChange('type', ''); }} className="ml-1">
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Product Type */}
                <div className="bg-white rounded-xl border p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Product Type</h3>
                  <div className="space-y-2">
                    {PRODUCT_TYPES.map((type) => (
                      <label
                        key={type.value}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          name="productType"
                          checked={selectedType === type.value}
                          onChange={() => {
                            setSelectedType(type.value);
                            handleFilterChange('type', type.value);
                          }}
                          className="text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-600 group-hover:text-gray-900">
                          {type.label}
                        </span>
                      </label>
                    ))}
                    {selectedType && (
                      <button
                        onClick={() => {
                          setSelectedType('');
                          handleFilterChange('type', '');
                        }}
                        className="text-sm text-primary-600 hover:text-primary-700 mt-2"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Categories */}
                {categories.length > 0 && (
                  <div className="bg-white rounded-xl border p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <label
                          key={category.id}
                          className="flex items-center gap-2 cursor-pointer group"
                        >
                          <input
                            type="radio"
                            name="category"
                            checked={selectedCategory === category.id.toString()}
                            onChange={() => {
                              setSelectedCategory(category.id.toString());
                              handleFilterChange('category', category.id.toString());
                            }}
                            className="text-primary-600 focus:ring-primary-500"
                          />
                          <span className="text-sm text-gray-600 group-hover:text-gray-900">
                            {category.name}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Brands */}
                {brands.length > 0 && (
                  <div className="bg-white rounded-xl border p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Brand</h3>
                    <select
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">All Brands</option>
                      {brands.map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Price Range */}
                <div className="bg-white rounded-xl border p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Price Range</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Stock Status */}
                <div className="bg-white rounded-xl border p-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="rounded text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">In Stock Only</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Overlay for mobile */}
          {showFilters && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowFilters(false)}
            />
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {searchParams.get('search')
                    ? `Search results for "${searchParams.get('search')}"`
                    : selectedType
                    ? PRODUCT_TYPES.find((t) => t.value === selectedType)?.label
                    : 'All Products'}
                </h1>
                <p className="text-gray-500 mt-1">
                  {totalElements} products found
                </p>
              </div>
            </div>

            {loading ? (
              <LoadingOverlay message="Loading products..." />
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border">
                <Server className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <Button onClick={clearAllFilters}>Clear All Filters</Button>
              </div>
            ) : (
              <>
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }
                >
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                    >
                      Previous
                    </Button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i;
                        } else if (page < 3) {
                          pageNum = i;
                        } else if (page > totalPages - 3) {
                          pageNum = totalPages - 5 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                              page === pageNum
                                ? 'bg-primary-600 text-white'
                                : 'hover:bg-gray-100 text-gray-600'
                            }`}
                          >
                            {pageNum + 1}
                          </button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={page >= totalPages - 1}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
