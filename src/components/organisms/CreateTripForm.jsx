import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import ApperIcon from '../ApperIcon';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';
import { format, addDays, isAfter } from 'date-fns';
import { toast } from 'react-toastify';

const CreateTripForm = ({ show, onClose, onSubmit }) => {
  const [newTrip, setNewTrip] = useState({
    name: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    destinations: [],
    budget: { total: 0, spent: 0 }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'budgetTotal') {
      setNewTrip(prev => ({ ...prev, budget: { ...prev.budget, total: parseInt(value) || 0 } }));
    } else {
      setNewTrip(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newTrip.name.trim()) {
      toast.error('Please enter a trip name');
      return;
    }

    if (isAfter(new Date(newTrip.startDate), new Date(newTrip.endDate))) {
      toast.error('End date must be after start date');
      return;
    }

    onSubmit(newTrip);
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-surface-800 rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-heading font-semibold text-surface-900 dark:text-white">
                Create New Trip
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
              >
                <ApperIcon name="X" className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                label="Trip Name"
                name="name"
                type="text"
                value={newTrip.name}
                onChange={handleChange}
                placeholder="Enter trip name"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={newTrip.startDate}
                  onChange={handleChange}
                  required
                />
                <FormField
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={newTrip.endDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <FormField
                label="Budget"
                name="budgetTotal"
                type="number"
                value={newTrip.budget.total}
                onChange={handleChange}
                placeholder="Enter total budget"
                min="0"
              />

              <div className="flex space-x-3 pt-4">
                <Button type="button" onClick={onClose} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Create Trip
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateTripForm;