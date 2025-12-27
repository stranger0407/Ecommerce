import { useEffect, useState } from 'react';
import { categoryService } from '@/services/categoryService';
import { Category } from '@/types';
import { Spinner } from '@/components/ui';

interface CategoryFormData {
  name: string;
  description: string;
  imageUrl: string;
  parentId: string;
  active: boolean;
}

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    imageUrl: '',
    parentId: '',
    active: true,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (err) {
      setError('Failed to load categories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      imageUrl: '',
      parentId: '',
      active: true,
    });
    setShowModal(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      imageUrl: category.imageUrl || '',
      parentId: category.parentId?.toString() || '',
      active: category.active,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const categoryData = {
        name: formData.name,
        description: formData.description,
        imageUrl: formData.imageUrl,
        parentId: formData.parentId ? parseInt(formData.parentId) : null,
        active: formData.active,
      };

      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, categoryData);
        setSuccessMessage('Category updated successfully!');
      } else {
        await categoryService.createCategory(categoryData);
        setSuccessMessage('Category created successfully!');
      }

      setShowModal(false);
      loadCategories();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Failed to save category');
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      await categoryService.deleteCategory(id);
      setSuccessMessage('Category deleted successfully!');
      loadCategories();
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError('Failed to delete category. Make sure no products are using it.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-gray-400">Manage product categories</p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
          <PlusIcon className="w-5 h-5" />
          Add Category
        </button>
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

      {/* Categories Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden hover:border-gray-600 transition-colors"
            >
              {/* Image */}
              <div className="h-40 bg-gray-700 relative">
                {category.imageUrl ? (
                  <img
                    src={category.imageUrl}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <CategoryIcon className="w-16 h-16 text-gray-600" />
                  </div>
                )}
                {/* Status Badge */}
                <span
                  className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                    category.active
                      ? 'bg-green-900/80 text-green-400'
                      : 'bg-red-900/80 text-red-400'
                  }`}
                >
                  {category.active ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-4 min-h-[40px]">
                  {category.description || 'No description'}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(category)}
                    className="flex-1 px-4 py-2 bg-gray-700 text-gray-300 rounded-xl hover:bg-gray-600 hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <EditIcon className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="px-4 py-2 bg-red-600/20 text-red-400 rounded-xl hover:bg-red-600/30 transition-colors"
                  >
                    <DeleteIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <div className="col-span-full text-center py-12">
              <CategoryIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No categories found</p>
              <button onClick={openAddModal} className="mt-4 btn-primary">
                Create First Category
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Parent Category
                </label>
                <select
                  value={formData.parentId}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">None (Root Category)</option>
                  {categories
                    .filter((c) => c.id !== editingCategory?.id)
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <span className="text-gray-300">Active</span>
              </label>

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingCategory ? 'Update' : 'Create'}
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

const CategoryIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

export default AdminCategories;
