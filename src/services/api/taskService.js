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
    return tasks.filter(t => t.categoryId === categoryId && !t.archived).map(t => ({ ...t }));
  },

  async getCompleted() {
    await delay(250);
    return tasks.filter(t => t.completed && !t.archived).map(t => ({ ...t }));
  },

  async getArchived() {
    await delay(250);
    return tasks.filter(t => t.archived).map(t => ({ ...t }));
  },

  async search(query) {
    await delay(200);
    const lowercaseQuery = query.toLowerCase();
    return tasks.filter(t => 
      !t.archived && (
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
      archived: false
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
  }
};

export default taskService;