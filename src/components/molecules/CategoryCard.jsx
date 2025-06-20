import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const CategoryCard = ({ 
  category, 
  isActive = false, 
  onClick, 
  className = '' 
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick && onClick(category)}
      className={`
        p-4 rounded-xl border-l-4 cursor-pointer transition-all duration-200
        ${isActive 
          ? 'bg-white shadow-md border-l-primary' 
          : 'bg-gray-50 hover:bg-white hover:shadow-sm border-l-gray-200'
        }
        ${className}
      `}
      style={{
        borderLeftColor: isActive ? category.color : undefined
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
            style={{ backgroundColor: category.color }}
          >
            <ApperIcon name={category.icon} size={16} />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{category.name}</h3>
            <p className="text-xs text-gray-500">
              {category.taskCount} {category.taskCount === 1 ? 'task' : 'tasks'}
            </p>
          </div>
        </div>
        
        {category.taskCount > 0 && (
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
            style={{ backgroundColor: category.color }}
          >
            {category.taskCount}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CategoryCard;