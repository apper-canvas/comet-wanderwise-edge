import React from 'react';
import ApperIcon from '../ApperIcon';
import Text from '../atoms/Text';

const TripBudgetOverview = ({ selectedTrip, activities }) => {
  if (!selectedTrip) {
    return (
      <div className="text-center py-12">
        <ApperIcon name="DollarSign" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
        <Text>
          Select a trip to view its budget
        </Text>
      </div>
    );
  }

  const getCategoryProgressColor = (category) => {
    switch (category) {
      case 'sightseeing': return 'bg-blue-500';
      case 'food': return 'bg-green-500';
      case 'transport': return 'bg-yellow-500';
      case 'accommodation': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const totalSpent = activities.reduce((sum, activity) => sum + (activity.cost || 0), 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl">
          <h3 className="font-heading font-semibold text-surface-900 dark:text-white mb-3">
            Total Budget
          </h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            ${selectedTrip.budget?.total || 0}
          </p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-6 rounded-xl">
          <h3 className="font-heading font-semibold text-surface-900 dark:text-white mb-3">
            Spent So Far
          </h3>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">
            ${totalSpent}
          </p>
        </div>
      </div>

      <div className="bg-surface-50 dark:bg-surface-900 p-6 rounded-xl">
        <Text variant="cardHeading" className="mb-4">
          Expense Breakdown
        </Text>

        <div className="space-y-4">
          {['sightseeing', 'food', 'transport', 'accommodation'].map(category => {
            const categoryTotal = activities
              .filter(activity => activity.category === category)
              .reduce((sum, activity) => sum + (activity.cost || 0), 0);

            return (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getCategoryProgressColor(category)}`}></div>
                  <Text variant="subheading" className="capitalize">
                    {category}
                  </Text>
                </div>
                <Text variant="subheading">
                  ${categoryTotal}
                </Text>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TripBudgetOverview;