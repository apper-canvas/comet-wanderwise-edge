import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon';
import Card from '../atoms/Card';
import Text from '../atoms/Text';

const FeatureCard = ({ icon, title, description, delay = 0 }) => {
  return (
    <motion.div
      className="p-6 bg-white dark:bg-surface-800 rounded-xl shadow-card hover:shadow-elevated transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
        <ApperIcon name={icon} className="w-6 h-6 text-white" />
      </div>
      <Text variant="cardHeading" className="mb-2">
        {title}
      </Text>
      <Text>{description}</Text>
    </motion.div>
  );
};

export default FeatureCard;