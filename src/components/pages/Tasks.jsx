import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TaskList from '@/components/organisms/TaskList';
import SearchBar from '@/components/molecules/SearchBar';
import CategorySidebar from '@/components/organisms/CategorySidebar';
import TaskModal from '@/components/organisms/TaskModal';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Tasks = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Listen for task updates from quick add button
  useEffect(() => {
    const handleTaskUpdate = () => {
      setRefreshKey(prev => prev + 1);
    };

    window.addEventListener('taskUpdated', handleTaskUpdate);
    return () => window.removeEventListener('taskUpdated', handleTaskUpdate);
  }, []);

  const handleTaskUpdate = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleEditTask = (task = null) => {
    setEditingTask(task);
    setShowAddModal(true);
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setEditingTask(null);
  };

  const handleTaskSaved = () => {
    handleModalClose();
    handleTaskUpdate();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-gray-200 bg-surface">
<div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-display font-bold text-gray-900">
            Tasks
          </h1>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => handleEditTask()}
              icon="Plus"
              size="md"
              variant="primary"
              className="md:hidden shadow-md hover:shadow-lg font-medium px-4 py-2 text-white bg-primary hover:bg-primary/90 transition-all duration-200"
            >
              Create Task
            </Button>
            <Button
              onClick={() => handleEditTask()}
              icon="Plus"
              size="md"
              variant="primary"
              className="hidden md:flex shadow-md hover:shadow-lg font-medium px-6 py-2.5 text-white bg-primary hover:bg-primary/90 transition-all duration-200"
            >
              Create New Task
            </Button>
          </div>
        </div>
        
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search tasks..."
          className="max-w-md"
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Category Sidebar */}
        <div className="hidden lg:block w-80 border-r border-gray-200 bg-surface overflow-y-auto">
          <CategorySidebar
            activeCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Mobile Category Filter */}
            <div className="lg:hidden mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Category</h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All Tasks
                </button>
                {/* Add category buttons dynamically here if needed */}
              </div>
            </div>

            {/* Task List */}
            <TaskList
              key={refreshKey}
              filter={selectedCategory}
              searchQuery={searchQuery}
              onTaskUpdate={handleTaskUpdate}
              onEditTask={handleEditTask}
            />
          </div>
        </div>
      </div>

      {/* Task Modal */}
      {showAddModal && (
        <TaskModal
          isOpen={showAddModal}
          onClose={handleModalClose}
          onSave={handleTaskSaved}
          task={editingTask}
        />
      )}
    </motion.div>
  );
};

export default Tasks;