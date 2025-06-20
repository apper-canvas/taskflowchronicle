import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import TaskCard from '@/components/molecules/TaskCard';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import Button from '@/components/atoms/Button';
import { taskService } from '@/services';

const Archive = () => {
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadArchivedTasks();
  }, []);

  const loadArchivedTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await taskService.getArchived();
      setArchivedTasks(result);
    } catch (err) {
      setError(err.message || 'Failed to load archived tasks');
      toast.error('Failed to load archived tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (taskId) => {
    try {
      await taskService.restore(taskId);
      setArchivedTasks(prev => prev.filter(task => task.Id !== taskId));
      toast.success('Task restored');
    } catch (err) {
      toast.error('Failed to restore task');
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm('Are you sure you want to permanently delete this task?')) return;
    
    try {
      await taskService.delete(taskId);
      setArchivedTasks(prev => prev.filter(task => task.Id !== taskId));
      toast.success('Task permanently deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm('Are you sure you want to permanently delete all archived tasks?')) return;
    
    try {
      const taskIds = archivedTasks.map(task => task.Id);
      await taskService.bulkDelete(taskIds);
      setArchivedTasks([]);
      toast.success('All archived tasks deleted');
    } catch (err) {
      toast.error('Failed to delete tasks');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">Archive</h1>
        <SkeletonLoader count={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">Archive</h1>
        <ErrorState message={error} onRetry={loadArchivedTasks} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">
          Archive ({archivedTasks.length})
        </h1>
        
        {archivedTasks.length > 0 && (
          <Button
            onClick={handleBulkDelete}
            variant="danger"
            size="sm"
            icon="Trash2"
          >
            Delete All
          </Button>
        )}
      </div>

      {/* Content */}
      {archivedTasks.length === 0 ? (
        <EmptyState
          icon="Archive"
          title="Archive is empty"
          description="Archived tasks will appear here. You can restore or permanently delete them."
        />
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {archivedTasks.map((task, index) => (
              <motion.div
                key={task.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="relative">
                  <TaskCard
                    task={task}
                    onToggleComplete={() => {}} // Disabled for archived tasks
                    onEdit={() => {}} // Disabled for archived tasks
                    onArchive={() => {}} // Disabled for archived tasks
                    onDelete={handleDelete}
                    className="opacity-75"
                  />
                  
                  {/* Restore Button Overlay */}
                  <div className="absolute top-4 right-4">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestore(task.Id);
                      }}
                      variant="ghost"
                      size="sm"
                      icon="RotateCcw"
                      className="bg-white/90 hover:bg-white shadow-sm"
                    >
                      Restore
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default Archive;