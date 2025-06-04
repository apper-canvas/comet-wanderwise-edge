import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon';

const AppLogo = ({ className = '', animate = false }) => {
  const motionProps = animate ? {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5 }
  } : {};

  return (
    <motion.div
      className={`flex items-center space-x-3 ${className}`}
      {...motionProps}
    >
      <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
        <ApperIcon name="MapPin" className="w-5 h-5 text-white" />
      </div>
      <span className="text-xl font-heading font-bold text-surface-900 dark:text-white">
        Wanderwise
      </span>
    </motion.div>
  );
};

export default AppLogo;