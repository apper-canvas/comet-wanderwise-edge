import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon';
import IconText from '../atoms/IconText';
import Text from '../atoms/Text';
import Button from '../atoms/Button';
import Card from '../atoms/Card';

const TripCard = ({ trip, index }) => {
  return (
    <motion.div
      className="group bg-white dark:bg-surface-800 rounded-xl shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
        <img
          src={trip.imageUrl || `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&w=400&q=80`}
          alt={trip.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 bg-white/90 dark:bg-surface-800/90 rounded-full text-sm font-medium text-surface-900 dark:text-white backdrop-blur-sm">
            {trip.duration} days
          </span>
        </div>
      </div>
      <div className="p-6">
        <Text variant="cardHeading" className="mb-2">
          {trip.name}
        </Text>
        <div className="flex items-center space-x-4 text-sm text-surface-600 dark:text-surface-300 mb-4">
          <IconText icon="Calendar" text={trip.startDate} />
          <IconText icon="Users" text={trip.travelers?.length || 1} />
        </div>
        <div className="flex items-center justify-between">
          <IconText icon="DollarSign" text={`$${trip.budget?.total || 0}`} iconClass="text-accent" textClass="font-medium text-surface-900 dark:text-white" />
          <Button variant="card">
            View Details
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default TripCard;