import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 3, className = '' }) => {
  const staggerInitial = { opacity: 0, y: 20 };
  const staggerAnimate = { opacity: 1, y: 0 };
  const getStaggerTransition = (index) => ({ delay: index * 0.1 });

  return (
    <div className={`space-y-4 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          initial={staggerInitial}
          animate={staggerAnimate}
          transition={getStaggerTransition(i)}
          className="bg-surface rounded-xl p-4 shadow-sm"
        >
          <div className="animate-pulse">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-gray-200 rounded mt-1" />
              <div className="flex-1 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                  <div className="w-12 h-5 bg-gray-200 rounded-full" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-4 bg-gray-200 rounded-full" />
                  <div className="w-20 h-4 bg-gray-200 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SkeletonLoader;