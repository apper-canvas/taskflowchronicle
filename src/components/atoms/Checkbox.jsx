import { motion } from 'framer-motion';
import { useState } from 'react';

const Checkbox = ({ 
  checked = false, 
  onChange, 
  disabled = false,
  className = '',
  ...props 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleChange = (e) => {
    if (disabled) return;
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 400);
    
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="relative">
      <motion.input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        className={`task-checkbox ${className}`}
        animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.4, ease: "easeOut" }}
        {...props}
      />
      {checked && isAnimating && (
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: [0, 1.5, 0], rotate: [0, 180, 360] }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="w-full h-full rounded-full bg-success/20 animate-confetti" />
        </motion.div>
      )}
    </div>
  );
};

export default Checkbox;