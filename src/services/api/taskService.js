import taskData from '../mockData/tasks.json';

// Utility function to add delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory data store
let tasks = [...taskData];

const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.Id === parseInt(id, 10));
    if (!task) {
      throw new Error(`Task with ID ${id} not found`);
    }
    return { ...task };
  },

async getByCategory(categoryId) {
    await delay(250);
    return tasks.filter(t => t.categoryId === categoryId && !t.archived && !t.parentId).map(t => ({ ...t }));
  },

async getCompleted() {
    await delay(250);
    return tasks.filter(t => t.completed && !t.archived && !t.parentId).map(t => ({ ...t }));
  },

  async getArchived() {
    await delay(250);
    return tasks.filter(t => t.archived).map(t => ({ ...t }));
  },

async search(query) {
    await delay(200);
    const lowercaseQuery = query.toLowerCase();
    return tasks.filter(t => 
      !t.archived && !t.parentId && (
        t.title.toLowerCase().includes(lowercaseQuery) ||
        t.description.toLowerCase().includes(lowercaseQuery)
      )
    ).map(t => ({ ...t }));
  },

async create(taskData) {
    await delay(300);
    const maxId = tasks.length > 0 ? Math.max(...tasks.map(t => t.Id)) : 0;
    const newTask = {
      Id: maxId + 1,
      title: taskData.title,
      description: taskData.description || '',
      categoryId: taskData.categoryId || 'personal',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      archived: false,
      parentId: taskData.parentId || null
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, updateData) {
    await delay(300);
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error(`Task with ID ${id} not found`);
    }
    
    const updatedTask = {
      ...tasks[index],
      ...updateData,
      Id: tasks[index].Id // Prevent ID modification
    };
    
// Handle completion
    if (updateData.completed && !tasks[index].completed) {
      updatedTask.completedAt = new Date().toISOString();
    } else if (!updateData.completed && tasks[index].completed) {
      updatedTask.completedAt = null;
    }
    
    // Handle subtask completion cascading
    if (updateData.completed !== undefined && tasks[index].parentId) {
      const parentTask = tasks.find(t => t.Id === tasks[index].parentId);
      if (parentTask) {
        const siblings = tasks.filter(t => t.parentId === parentTask.Id);
        const completedSiblings = siblings.filter(t => t.Id === updatedTask.Id ? updateData.completed : t.completed);
        
        // Auto-complete parent if all subtasks are completed
        if (completedSiblings.length === siblings.length && siblings.length > 0) {
          const parentIndex = tasks.findIndex(t => t.Id === parentTask.Id);
          if (parentIndex !== -1 && !tasks[parentIndex].completed) {
            tasks[parentIndex] = { ...tasks[parentIndex], completed: true, completedAt: new Date().toISOString() };
          }
        }
      }
    }
    
    tasks[index] = updatedTask;
    return { ...updatedTask };
  },

  async delete(id) {
    await delay(250);
    const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
    if (index === -1) {
      throw new Error(`Task with ID ${id} not found`);
    }
    const deletedTask = tasks.splice(index, 1)[0];
    return { ...deletedTask };
  },

  async archive(id) {
    await delay(250);
    return await this.update(id, { archived: true });
  },

  async restore(id) {
    await delay(250);
    return await this.update(id, { archived: false });
  },

  async bulkDelete(ids) {
    await delay(400);
    const deletedTasks = [];
    ids.forEach(id => {
      const index = tasks.findIndex(t => t.Id === parseInt(id, 10));
      if (index !== -1) {
        deletedTasks.push({ ...tasks[index] });
        tasks.splice(index, 1);
      }
});
    return deletedTasks;
  },

  async getSubtasks(parentId) {
    await delay(200);
    const parentIdInt = parseInt(parentId, 10);
    return tasks.filter(t => t.parentId === parentIdInt && !t.archived).map(t => ({ ...t }));
  },

  async createSubtask(parentId, taskData) {
    await delay(300);
    const parentIdInt = parseInt(parentId, 10);
    const parentTask = tasks.find(t => t.Id === parentIdInt);
    if (!parentTask) {
      throw new Error(`Parent task with ID ${parentId} not found`);
    }
    
    const maxId = tasks.length > 0 ? Math.max(...tasks.map(t => t.Id)) : 0;
    const newSubtask = {
      Id: maxId + 1,
      title: taskData.title,
      description: taskData.description || '',
      categoryId: taskData.categoryId || parentTask.categoryId,
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate || null,
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      archived: false,
      parentId: parentIdInt
    };
    tasks.push(newSubtask);
    return { ...newSubtask };
  }
};

export default taskService;