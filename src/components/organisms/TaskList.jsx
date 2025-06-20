import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import TaskCard from '@/components/molecules/TaskCard';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import { taskService } from '@/services';

const TaskList = ({ 
  filter = 'all', 
  searchQuery = '', 
  onTaskUpdate,
  onEditTask 
}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTasks();
  }, [filter]);

  useEffect(() => {
    if (searchQuery) {
      handleSearch();
    } else {
      loadTasks();
    }
  }, [searchQuery]);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      let result;
      if (filter === 'completed') {
        result = await taskService.getCompleted();
      } else if (filter === 'all') {
        result = await taskService.getAll();
        result = result.filter(t => !t.archived);
      } else {
        result = await taskService.getByCategory(filter);
      }
      setTasks(result);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadTasks();
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const result = await taskService.search(searchQuery);
      setTasks(result);
    } catch (err) {
      setError(err.message || 'Search failed');
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (taskId, completed) => {
    try {
      await taskService.update(taskId, { completed });
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.Id === taskId ? { ...task, completed } : task
        )
      );
      
      if (onTaskUpdate) onTaskUpdate();
      toast.success(completed ? 'Task completed!' : 'Task reopened');
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleArchive = async (taskId) => {
    try {
      await taskService.archive(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.Id !== taskId));
      if (onTaskUpdate) onTaskUpdate();
      toast.success('Task archived');
    } catch (err) {
      toast.error('Failed to archive task');
    }
  };

  const handleDelete = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await taskService.delete(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.Id !== taskId));
      if (onTaskUpdate) onTaskUpdate();
      toast.success('Task deleted');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  if (loading) {
    return <SkeletonLoader count={5} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadTasks} />;
  }

  if (tasks.length === 0) {
    if (searchQuery) {
      return (
        <EmptyState
          icon="Search"
          title="No results found"
          description={`No tasks found matching "${searchQuery}"`}
        />
      );
    }
    
    return (
      <EmptyState
        icon="CheckSquare"
        title="No tasks yet"
        description="Create your first task to get started with your productivity journey"
        actionLabel="Add Task"
        onAction={() => onEditTask && onEditTask()}
      />
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {tasks.map((task, index) => (
          <motion.div
            key={task.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ delay: index * 0.05 }}
          >
            <TaskCard
              task={task}
              onToggleComplete={handleToggleComplete}
              onEdit={onEditTask}
              onArchive={handleArchive}
              onDelete={handleDelete}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TaskList;