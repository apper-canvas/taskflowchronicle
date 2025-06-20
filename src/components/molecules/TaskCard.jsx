import { motion } from 'framer-motion';
import { format, parseISO, isToday, isPast } from 'date-fns';
import Checkbox from '@/components/atoms/Checkbox';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const TaskCard = ({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete,
  onArchive,
  className = '' 
}) => {
  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    const date = parseISO(dateString);
    if (isToday(date)) return 'Today';
    return format(date, 'MMM dd');
  };

  const getDueDateColor = (dateString) => {
    if (!dateString) return 'text-gray-500';
    const date = parseISO(dateString);
    if (isToday(date)) return 'text-warning';
    if (isPast(date)) return 'text-error';
    return 'text-gray-500';
  };

  const handleToggleComplete = () => {
    if (onToggleComplete) {
      onToggleComplete(task.Id, !task.completed);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2, boxShadow: '0 8px 25px rgba(0,0,0,0.1)' }}
      className={`
        bg-surface rounded-xl p-4 border border-gray-100 shadow-sm 
        transition-all duration-200 group cursor-pointer
        ${task.completed ? 'opacity-75' : ''}
        ${className}
      `}
      onClick={() => onEdit && onEdit(task)}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
            className="mt-1"
          />
        </div>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className={`
                font-medium text-gray-900 line-clamp-2 break-words
                ${task.completed ? 'line-through text-gray-500' : ''}
              `}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`
                  text-sm mt-1 line-clamp-2 break-words
                  ${task.completed ? 'text-gray-400' : 'text-gray-600'}
                `}>
                  {task.description}
                </p>
              )}
            </div>

            {/* Priority Badge */}
            <Badge variant={task.priority} size="xs">
              {task.priority}
            </Badge>
          </div>

          {/* Task Meta */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              {/* Category */}
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {task.categoryId}
              </span>
              
              {/* Due Date */}
              {task.dueDate && (
                <span className={`text-xs flex items-center gap-1 ${getDueDateColor(task.dueDate)}`}>
                  <ApperIcon name="Calendar" size={12} />
                  {formatDueDate(task.dueDate)}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onArchive && onArchive(task.Id);
                }}
                className="p-1 text-gray-400 hover:text-warning transition-colors"
                title="Archive"
              >
                <ApperIcon name="Archive" size={14} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete && onDelete(task.Id);
                }}
                className="p-1 text-gray-400 hover:text-error transition-colors"
                title="Delete"
              >
                <ApperIcon name="Trash2" size={14} />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;