import taskService from './taskService';
import { startOfDay, startOfWeek, isAfter, isSameDay, parseISO } from 'date-fns';

// Utility function to add delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const statsService = {
  async getUserStats() {
    await delay(200);
    const tasks = await taskService.getAll();
    const now = new Date();
    const today = startOfDay(now);
    const weekStart = startOfWeek(now);

    const totalTasks = tasks.filter(t => !t.archived).length;
    const completedTasks = tasks.filter(t => t.completed && !t.archived);
    
    const completedToday = completedTasks.filter(t => 
      t.completedAt && isSameDay(parseISO(t.completedAt), today)
    ).length;

    const completedThisWeek = completedTasks.filter(t => 
      t.completedAt && isAfter(parseISO(t.completedAt), weekStart)
    ).length;

    // Calculate streak
    let streak = 0;
    let currentDate = startOfDay(now);
    
    while (streak < 365) { // Max 365 days to prevent infinite loop
      const dayCompletions = completedTasks.filter(t => 
        t.completedAt && isSameDay(parseISO(t.completedAt), currentDate)
      );
      
      if (dayCompletions.length > 0) {
        streak++;
        currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000); // Previous day
      } else {
        break;
      }
    }

    const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

    return {
      totalTasks,
      completedToday,
      completedThisWeek,
      streak,
      completionRate
    };
  },

  async getWeeklyStats() {
    await delay(300);
    const tasks = await taskService.getAll();
    const now = new Date();
    const weekStart = startOfWeek(now);
    
    const dailyStats = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart.getTime() + i * 24 * 60 * 60 * 1000);
      const completed = tasks.filter(t => 
        t.completed && t.completedAt && isSameDay(parseISO(t.completedAt), day)
      ).length;
      
      dailyStats.push({
        date: day.toISOString(),
        completed,
        dayName: day.toLocaleDateString('en-US', { weekday: 'short' })
      });
    }

    return dailyStats;
  },

  async getPriorityBreakdown() {
    await delay(250);
    const tasks = await taskService.getAll();
    const activeTasks = tasks.filter(t => !t.completed && !t.archived);
    
    const breakdown = {
      urgent: activeTasks.filter(t => t.priority === 'urgent').length,
      high: activeTasks.filter(t => t.priority === 'high').length,
      medium: activeTasks.filter(t => t.priority === 'medium').length,
      low: activeTasks.filter(t => t.priority === 'low').length
    };

    return breakdown;
  }
};

export default statsService;