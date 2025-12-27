import { useEffect, useState } from 'react';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { Product, Category } from '@/types';
import { Spinner } from '@/components/ui';

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    brand: '',
    model: '',
    type: 'DESKTOP_COMPUTER' as Product['type'],
    categoryId: '',
    imageUrls: [''],
    active: true,
    featured: false,
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [page]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts(page, 10, 'id', 'DESC');
      setProducts(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadProducts();
      return;
    }
    try {
      setLoading(true);
      const data = await productService.searchProducts(searchTerm, 0, 10);
      setProducts(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stockQuantity: '',
      brand: '',
      model: '',
      type: 'DESKTOP_COMPUTER' as Product['type'],
      categoryId: categories[0]?.id?.toString() || '',
      imageUrls: [''],
      active: true,
      featured: false,
    });
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stockQuantity: product.stockQuantity.toString(),
      brand: product.brand,
      model: product.model,
      type: product.type,
      categoryId: product.category?.id?.toString() || '',
      imageUrls: product.imageUrls?.length ? product.imageUrls : [''],
      active: product.active,
      featured: product.featured,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
        brand: formData.brand,
        model: formData.model,
        type: formData.type as Product['type'],
        categoryId: parseInt(formData.categoryId),
        imageUrls: formData.imageUrls.filter((url) => url.trim()),
        active: formData.active,
        featured: formData.featured,
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, productData);
        setSuccessMessage('Product updated successfully!');
      } else {
        await productService.createProduct(productData);
        setSuccessMessage('Product created successfully!');
      }

      setShowModal(false);
      loadProducts();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Failed to save product');
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await productService.deleteProduct(id);
      setSuccessMessage('Product deleted successfully!');
      loadProducts();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  const addImageUrl = () => {
    setFormData({ ...formData, imageUrls: [...formData.imageUrls, ''] });
  };

  const updateImageUrl = (index: number, value: string) => {
    const newUrls = [...formData.imageUrls];
    newUrls[index] = value;
    setFormData({ ...formData, imageUrls: newUrls });
  };

  const removeImageUrl = (index: number) => {
    const newUrls = formData.imageUrls.filter((_, i) => i !== index);
    setFormData({ ...formData, imageUrls: newUrls.length ? newUrls : [''] });
  };

  const productTypes = [
    'SERVER',
    'DESKTOP_COMPUTER',
    'LAPTOP',
    'WORKSTATION',
    'COMPONENT',
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-gray-400">Manage your product inventory</p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Success/Error Messages */}
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

      {/* Search */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button onClick={handleSearch} className="btn-secondary">
          Search
        </button>
      </div>

      {/* Products Table */}
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
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">
                    Stock
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
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-700/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={product.imageUrls?.[0] || '/placeholder.png'}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover bg-gray-700"
                        />
                        <div>
                          <p className="text-white font-medium truncate max-w-[200px]">
                            {product.name}
                          </p>
                          <p className="text-gray-400 text-sm">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {product.category?.name || '-'}
                    </td>
                    <td className="px-6 py-4 text-white font-medium">
                      ₹{product.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`${
                          product.stockQuantity > 10
                            ? 'text-green-400'
                            : product.stockQuantity > 0
                            ? 'text-yellow-400'
                            : 'text-red-400'
                        }`}
                      >
                        {product.stockQuantity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.active
                            ? 'bg-green-900/50 text-green-400'
                            : 'bg-red-900/50 text-red-400'
                        }`}
                      >
                        {product.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <EditIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <DeleteIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Brand *
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    min="0"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) =>
                      setFormData({ ...formData, stockQuantity: e.target.value })
                    }
                    required
                    min="0"
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Model
                  </label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {productTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    required
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image URLs */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image URLs
                </label>
                {formData.imageUrls.map((url, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => updateImageUrl(index, e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeImageUrl(index)}
                      className="px-3 py-2 bg-red-600/30 text-red-400 rounded-xl hover:bg-red-600/50"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="text-primary-400 text-sm hover:underline"
                >
                  + Add another image
                </button>
              </div>

              {/* Toggles */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) =>
                      setFormData({ ...formData, active: e.target.checked })
                    }
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-gray-300">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) =>
                      setFormData({ ...formData, featured: e.target.checked })
                    }
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-gray-300">Featured</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Icons
const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const EditIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const DeleteIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export default AdminProducts;
