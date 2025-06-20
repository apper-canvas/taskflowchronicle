import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import TaskModal from "@/components/organisms/TaskModal";
const QuickAddButton = () => {
  const [showModal, setShowModal] = useState(false);

const handleTaskAdded = () => {
    setShowModal(false);
    // Trigger refresh of parent components
    try {
      if (typeof window !== 'undefined' && window.CustomEvent) {
        window.dispatchEvent(new CustomEvent('taskUpdated'));
      }
    } catch (error) {
      console.warn('Failed to dispatch taskUpdated event:', error);
    }
  };

  return (
    <>
<motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <Button
            onClick={() => setShowModal(true)}
            variant="primary"
            size="lg"
            icon="Plus"
            className="rounded-full w-16 h-16 shadow-2xl hover:shadow-3xl border-2 border-white/20 backdrop-blur-sm bg-primary/90 hover:bg-primary text-white font-semibold transition-all duration-300"
          />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse"></div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <TaskModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onSave={handleTaskAdded}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default QuickAddButton;