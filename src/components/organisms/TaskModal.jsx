import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import TextArea from "@/components/atoms/TextArea";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { categoryService, taskService } from "@/services";

const TaskModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
task = null,
  parentTask = null
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    priority: 'medium',
    dueDate: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [subtasks, setSubtasks] = useState([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [addingSubtask, setAddingSubtask] = useState(false);
useEffect(() => {
    if (isOpen) {
      loadCategories();
      if (task) {
        setFormData({
          title: task.title || '',
          description: task.description || '',
          categoryId: task.categoryId || '',
          priority: task.priority || 'medium',
          dueDate: task.dueDate || ''
        });
        loadSubtasks();
      } else if (parentTask) {
        setFormData({
          title: '',
          description: '',
          categoryId: parentTask.categoryId || '',
          priority: parentTask.priority || 'medium',
          dueDate: ''
        });
      }
    }
  }, [isOpen, task, parentTask]);

  const loadCategories = async () => {
    try {
      const result = await categoryService.getAll();
      setCategories(result);
    } catch (err) {
      toast.error('Failed to load categories');
    }
};

  const loadSubtasks = async () => {
    if (!task) return;
    try {
      const result = await taskService.getSubtasks(task.Id);
      setSubtasks(result);
    } catch (err) {
      console.error('Failed to load subtasks:', err);
    }
  };

  const addSubtask = async () => {
    if (!newSubtaskTitle.trim() || !task) return;
    
    setAddingSubtask(true);
    try {
      const subtaskData = {
        title: newSubtaskTitle.trim(),
        categoryId: task.categoryId,
        priority: 'medium'
      };
      
      await taskService.createSubtask(task.Id, subtaskData);
      setNewSubtaskTitle('');
      await loadSubtasks();
      toast.success('Subtask added successfully');
    } catch (err) {
      toast.error('Failed to add subtask');
    } finally {
      setAddingSubtask(false);
    }
  };

  const deleteSubtask = async (subtaskId) => {
    if (!confirm('Are you sure you want to delete this subtask?')) return;
    
    try {
      await taskService.delete(subtaskId);
      await loadSubtasks();
      toast.success('Subtask deleted');
    } catch (err) {
      toast.error('Failed to delete subtask');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
try {
      if (task) {
        await taskService.update(task.Id, formData);
        toast.success('Task updated successfully');
      } else if (parentTask) {
        await taskService.createSubtask(parentTask.Id, formData);
        toast.success('Subtask created successfully');
      } else {
        await taskService.create(formData);
        toast.success('Task created successfully');
      }
      
      if (onSave) onSave();
      onClose();
    } catch (err) {
      toast.error(task ? 'Failed to update task' : parentTask ? 'Failed to create subtask' : 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const categoryOptions = categories.map(cat => ({
    value: cat.Id,
    label: cat.name
  }));

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
<div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text-gray-900">
                {task ? 'Edit Task' : parentTask ? 'Add Subtask' : 'Add New Task'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="What needs to be done?"
                error={errors.title}
                autoFocus
              />

              <TextArea
                label="Description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Add more details..."
                rows={3}
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Category"
                  value={formData.categoryId}
                  onChange={(e) => handleChange('categoryId', e.target.value)}
                  options={categoryOptions}
                  placeholder="Select category"
                  error={errors.categoryId}
                />

                <Select
                  label="Priority"
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                  options={priorityOptions}
                />
              </div>

              <Input
                label="Due Date"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleChange('dueDate', e.target.value)}
/>

              {/* Subtasks Section - Only show for existing tasks that are not subtasks themselves */}
              {task && !parentTask && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                      Subtasks ({subtasks.length})
                    </label>
                  </div>
                  
                  {/* Add Subtask */}
                  <div className="flex gap-2">
                    <Input
                      value={newSubtaskTitle}
                      onChange={(e) => setNewSubtaskTitle(e.target.value)}
                      placeholder="Add a subtask..."
                      onKeyPress={(e) => e.key === 'Enter' && addSubtask()}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={addSubtask}
                      loading={addingSubtask}
                      disabled={!newSubtaskTitle.trim()}
                    >
                      <ApperIcon name="Plus" size={16} />
                    </Button>
                  </div>

                  {/* Existing Subtasks */}
                  {subtasks.length > 0 && (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {subtasks.map(subtask => (
                        <div key={subtask.Id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                              {subtask.title}
                            </span>
                            {subtask.completed && (
                              <ApperIcon name="Check" size={14} className="text-green-500" />
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteSubtask(subtask.Id)}
                            className="p-1 text-gray-400 hover:text-error transition-colors"
                          >
                            <ApperIcon name="Trash2" size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  className="flex-1"
                >
                  {task ? 'Update Task' : parentTask ? 'Create Subtask' : 'Create Task'}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TaskModal;