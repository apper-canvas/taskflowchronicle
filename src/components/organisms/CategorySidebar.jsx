import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import CategoryCard from '@/components/molecules/CategoryCard';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import { categoryService } from '@/services';

const CategorySidebar = ({ activeCategory, onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await categoryService.getAll();
      setCategories(result);
    } catch (err) {
      setError(err.message || 'Failed to load categories');
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    if (onCategorySelect) {
      onCategorySelect(category.Id);
    }
  };

  if (loading) {
    return (
      <div className="p-4 space-y-3">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
        <SkeletonLoader count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorState message={error} onRetry={loadCategories} />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-4">Categories</h3>
      
      {/* All Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-3"
      >
        <CategoryCard
          category={{
            Id: 'all',
            name: 'All Tasks',
            color: '#8B85F0',
            icon: 'List',
            taskCount: categories.reduce((sum, cat) => sum + cat.taskCount, 0)
          }}
          isActive={activeCategory === 'all'}
          onClick={() => onCategorySelect && onCategorySelect('all')}
        />
      </motion.div>

      {/* Categories List */}
      <div className="space-y-3">
        {categories.map((category, index) => (
          <motion.div
            key={category.Id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <CategoryCard
              category={category}
              isActive={activeCategory === category.Id}
              onClick={handleCategoryClick}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CategorySidebar;