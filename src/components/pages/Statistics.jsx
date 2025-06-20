import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ProgressRing from '@/components/molecules/ProgressRing';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import ApperIcon from '@/components/ApperIcon';
import { statsService } from '@/services';

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [priorityBreakdown, setPriorityBreakdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAllStats();
  }, []);

  const loadAllStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const [userStats, weekly, priority] = await Promise.all([
        statsService.getUserStats(),
        statsService.getWeeklyStats(),
        statsService.getPriorityBreakdown()
      ]);
      
      setStats(userStats);
      setWeeklyStats(weekly);
      setPriorityBreakdown(priority);
    } catch (err) {
      setError(err.message || 'Failed to load statistics');
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">Statistics</h1>
        <SkeletonLoader count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">Statistics</h1>
        <ErrorState message={error} onRetry={loadAllStats} />
      </div>
    );
  }

  if (!stats) return null;

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: '#FF6B6B',
      high: '#FFE66D',
      medium: '#4A90E2',
      low: '#4ECDC4'
    };
    return colors[priority] || '#8B85F0';
  };

  const maxWeeklyTasks = Math.max(...weeklyStats.map(day => day.completed), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 space-y-8"
    >
      {/* Header */}
      <h1 className="text-2xl font-display font-bold text-gray-900">
        Statistics
      </h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ y: -4 }}
          className="bg-surface rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <ApperIcon name="CheckSquare" size={24} className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTasks}</p>
              <p className="text-sm text-gray-500">Total Tasks</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-surface rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
              <ApperIcon name="CheckCircle" size={24} className="text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.completedToday}</p>
              <p className="text-sm text-gray-500">Completed Today</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-surface rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
              <ApperIcon name="Flame" size={24} className="text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.streak}</p>
              <p className="text-sm text-gray-500">Day Streak</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -4 }}
          className="bg-surface rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-4">
            <ProgressRing
              progress={stats.completionRate}
              size={48}
              strokeWidth={4}
              color="#5B4FE9"
            />
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.completionRate}%</p>
              <p className="text-sm text-gray-500">Completion Rate</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
            This Week's Activity
          </h3>
          
          <div className="space-y-4">
            {weeklyStats.map((day, index) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-12 text-sm text-gray-600 font-medium">
                  {day.dayName}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(day.completed / maxWeeklyTasks) * 100}%` }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
                <div className="w-8 text-sm text-gray-900 font-medium text-right">
                  {day.completed}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Priority Breakdown */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-surface rounded-xl p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-display font-semibold text-gray-900 mb-4">
            Tasks by Priority
          </h3>
          
          {priorityBreakdown && (
            <div className="space-y-4">
              {Object.entries(priorityBreakdown).map(([priority, count], index) => (
                <motion.div
                  key={priority}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getPriorityColor(priority) }}
                    />
                    <span className="font-medium text-gray-900 capitalize">
                      {priority}
                    </span>
                  </div>
                  <span className="text-gray-600 font-medium">{count}</span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Statistics;