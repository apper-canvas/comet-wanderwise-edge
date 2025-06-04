import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import ApperIcon from '../ApperIcon';
import FormField from '../molecules/FormField';
import Button from '../atoms/Button';

const AddActivityForm = ({ show, onClose, onSubmit }) => {
  const [newActivity, setNewActivity] = useState({
    name: '',
    location: { name: '', lat: 0, lng: 0 },
    time: '09:00',
    duration: 60,
    cost: 0,
    category: 'sightseeing'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'location') {
      setNewActivity(prev => ({ ...prev, location: { ...prev.location, name: value } }));
    } else {
      setNewActivity(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newActivity);
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
            className="bg-white dark:bg-surface-800 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-heading font-semibold text-surface-900 dark:text-white">
                Add Activity
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
                label="Activity Name"
                name="name"
                value={newActivity.name}
                onChange={handleChange}
                placeholder="Enter activity name"
                required
              />
              <FormField
                label="Location"
                name="location"
                value={newActivity.location.name}
                onChange={handleChange}
                placeholder="Enter location"
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Time"
                  type="time"
                  name="time"
                  value={newActivity.time}
                  onChange={handleChange}
                />
                <FormField
                  label="Duration (min)"
                  type="number"
                  name="duration"
                  value={newActivity.duration}
                  onChange={handleChange}
                  min="0"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Cost ($)"
                  type="number"
                  name="cost"
                  value={newActivity.cost}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
                <FormField
                  label="Category"
                  type="select"
                  name="category"
                  value={newActivity.category}
                  onChange={handleChange}
                  options={[
                    { value: 'sightseeing', label: 'Sightseeing' },
                    { value: 'food', label: 'Food & Dining' },
                    { value: 'transport', label: 'Transportation' },
                    { value: 'accommodation', label: 'Accommodation' }
                  ]}
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <Button type="button" onClick={onClose} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" variant="secondary" className="flex-1">
                  Add Activity
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddActivityForm;