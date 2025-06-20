import categoryData from '../mockData/categories.json';
import taskService from './taskService';

// Utility function to add delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory data store
let categories = [...categoryData];

const categoryService = {
  async getAll() {
    await delay(250);
    // Update task counts
    const tasks = await taskService.getAll();
    const updatedCategories = categories.map(category => ({
      ...category,
      taskCount: tasks.filter(t => t.categoryId === category.Id && !t.archived && !t.completed).length
    }));
    return updatedCategories;
  },

  async getById(id) {
    await delay(200);
    const category = categories.find(c => c.Id === id);
    if (!category) {
      throw new Error(`Category with ID ${id} not found`);
    }
    return { ...category };
  },

  async create(categoryData) {
    await delay(300);
    const maxId = categories.length > 0 ? Math.max(...categories.map(c => parseInt(c.Id))) : 0;
    const newCategory = {
      Id: (maxId + 1).toString(),
      name: categoryData.name,
      color: categoryData.color || '#8B85F0',
      icon: categoryData.icon || 'Folder',
      taskCount: 0
    };
    categories.push(newCategory);
    return { ...newCategory };
  },

  async update(id, updateData) {
    await delay(300);
    const index = categories.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error(`Category with ID ${id} not found`);
    }
    
    const updatedCategory = {
      ...categories[index],
      ...updateData,
      Id: categories[index].Id // Prevent ID modification
    };
    
    categories[index] = updatedCategory;
    return { ...updatedCategory };
  },

  async delete(id) {
    await delay(250);
    const index = categories.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error(`Category with ID ${id} not found`);
    }
    const deletedCategory = categories.splice(index, 1)[0];
    return { ...deletedCategory };
  }
};

export default categoryService;