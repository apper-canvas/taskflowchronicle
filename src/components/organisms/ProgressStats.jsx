import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProgressRing from '@/components/molecules/ProgressRing';
import ApperIcon from '@/components/ApperIcon';
import { statsService } from '@/services';

const ProgressStats = () => {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedToday: 0,
    completedThisWeek: 0,
    streak: 0,
    completionRate: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const result = await statsService.getUserStats();
      setStats(result);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  };

  // Refresh stats when component mounts or updates
  useEffect(() => {
    const interval = setInterval(loadStats, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-6">
        <div className="animate-pulse">
          <div className="w-16 h-16 bg-gray-200 rounded-full" />
        </div>
        <div className="flex gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="w-12 h-8 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-6"
    >
      {/* Progress Ring */}
      <div className="hidden sm:block">
        <ProgressRing
          progress={stats.completionRate}
          size={64}
          strokeWidth={6}
          color="#5B4FE9"
        />
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4">
        {/* Today */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-center"
        >
          <div className="flex items-center gap-1 text-success">
            <ApperIcon name="CheckCircle" size={16} />
            <span className="font-bold text-lg">{stats.completedToday}</span>
          </div>
          <p className="text-xs text-gray-500">Today</p>
        </motion.div>

        {/* Week */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-center"
        >
          <div className="flex items-center gap-1 text-info">
            <ApperIcon name="Calendar" size={16} />
            <span className="font-bold text-lg">{stats.completedThisWeek}</span>
          </div>
          <p className="text-xs text-gray-500">This Week</p>
        </motion.div>

        {/* Streak */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="text-center"
        >
          <div className="flex items-center gap-1 text-warning">
            <ApperIcon name="Flame" size={16} />
            <span className="font-bold text-lg">{stats.streak}</span>
          </div>
          <p className="text-xs text-gray-500">Day Streak</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProgressStats;