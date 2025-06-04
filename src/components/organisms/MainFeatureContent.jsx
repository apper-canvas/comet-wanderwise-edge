import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '../ApperIcon';
import Text from '../atoms/Text';
import Button from '../atoms/Button';
import TripMetricCard from '../molecules/TripMetricCard';
import { format } from 'date-fns';

const MainFeatureContent = ({
  activeTab,
  selectedTrip,
  activities,
  itineraries,
  setShowNewTripForm,
  setShowNewActivityForm,
  selectedDate,
  setSelectedDate,
  getDayActivities,
  getTripDays,
  calculateTripProgress,
}) => {
  const getCategoryColor = (category) => {
    switch (category) {
      case 'sightseeing': return 'bg-blue-100 text-blue-800';
      case 'food': return 'bg-green-100 text-green-800';
      case 'transport': return 'bg-yellow-100 text-yellow-800';
      case 'accommodation': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryProgressColor = (category) => {
    switch (category) {
      case 'sightseeing': return 'bg-blue-500';
      case 'food': return 'bg-green-500';
      case 'transport': return 'bg-yellow-500';
      case 'accommodation': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6">
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {selectedTrip ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <TripMetricCard
                    icon="Calendar"
                    iconColor="text-primary"
                    title="Duration"
                    value={`${Math.ceil((new Date(selectedTrip.endDate) - new Date(selectedTrip.startDate)) / (1000 * 60 * 60 * 24))} days`}
                    subText={`${selectedTrip.startDate} - ${selectedTrip.endDate}`}
                    gradientFrom="from-primary/10"
                    gradientTo="to-primary/5"
                  />
                  <TripMetricCard
                    icon="MapPin"
                    iconColor="text-secondary"
                    title="Destinations"
                    value={selectedTrip.destinations?.length || 0}
                    subText={selectedTrip.destinations?.join(', ') || 'No destinations yet'}
                    gradientFrom="from-secondary/10"
                    gradientTo="to-secondary/5"
                  />
                  <TripMetricCard
                    icon="Activity"
                    iconColor="text-accent"
                    title="Activities"
                    value={activities.length}
                    subText="Planned activities"
                    gradientFrom="from-accent/10"
                    gradientTo="to-accent/5"
                  />
                </div>

                <div className="bg-surface-50 dark:bg-surface-900 p-6 rounded-xl">
                  <Text variant="cardHeading" className="mb-4">
                    Trip Progress
                  </Text>
                  <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-3 mb-2">
                    <div
                      className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500"
                      style={{ width: `${calculateTripProgress()}%` }}
                    ></div>
                  </div>
                  <Text variant="small">
                    {calculateTripProgress()}% complete
                  </Text>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <ApperIcon name="PlusCircle" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
                <Text variant="cardHeading" className="mb-2">
                  No trips yet
                </Text>
                <Text className="mb-6">
                  Create your first trip to start planning your adventure
                </Text>
                <Button onClick={() => setShowNewTripForm(true)} className="px-6 py-3">
                  Create Your First Trip
                </Button>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'itinerary' && (
          <motion.div
            key="itinerary"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {selectedTrip ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
                  <Text variant="cardHeading">
                    Daily Schedule
                  </Text>
                  <Button onClick={() => setShowNewActivityForm(true)} variant="secondary">
                    <ApperIcon name="Plus" className="w-4 h-4" />
                    <span>Add Activity</span>
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Date selector */}
                  <div className="lg:col-span-1">
                    <Text variant="subheading" className="mb-3">
                      Select Date
                    </Text>
                    <div className="space-y-2">
                      {getTripDays().map(date => {
                        const dayActivities = getDayActivities(date);
                        const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');

                        return (
                          <button
                            key={format(date, 'yyyy-MM-dd')}
                            onClick={() => setSelectedDate(date)}
                            className={`w-full p-3 rounded-lg text-left transition-colors ${
                              isSelected
                                ? 'bg-primary text-white'
                                : 'bg-surface-50 dark:bg-surface-700 hover:bg-surface-100 dark:hover:bg-surface-600'
                            }`}
                          >
                            <div className="font-medium">
                              {format(date, 'MMM d')}
                            </div>
                            <div className={`text-sm ${isSelected ? 'text-primary-light' : 'text-surface-500'}`}>
                              {dayActivities.length} activities
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Activities for selected date */}
                  <div className="lg:col-span-3">
                    <Text variant="subheading" className="mb-3">
                      {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </Text>

                    <div className="space-y-3">
                      {getDayActivities(selectedDate).map(activity => (
                        <div
                          key={activity.id}
                          className="p-4 bg-surface-50 dark:bg-surface-700 rounded-lg border-l-4 border-primary"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <Text variant="subheading">
                                {activity.name}
                              </Text>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-surface-600 dark:text-surface-300">
                                <ApperIcon name="Clock" className="w-4 h-4" />
                                <span>{activity.time}</span>
                                <ApperIcon name="MapPin" className="w-4 h-4" />
                                <span>{activity.location?.name || 'Location TBD'}</span>
                                {activity.cost > 0 && (
                                  <>
                                    <ApperIcon name="DollarSign" className="w-4 h-4" />
                                    <span>${activity.cost}</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(activity.category)}`}>
                              {activity.category}
                            </span>
                          </div>
                        </div>
                      ))}

                      {getDayActivities(selectedDate).length === 0 && (
                        <div className="text-center py-8 text-surface-500 dark:text-surface-400">
                          <ApperIcon name="Calendar" className="w-8 h-8 mx-auto mb-2" />
                          <Text>No activities planned for this day</Text>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <ApperIcon name="Calendar" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
                <Text>
                  Select a trip to view its itinerary
                </Text>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'budget' && (
          <motion.div
            key="budget"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {selectedTrip ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TripMetricCard
                    title="Total Budget"
                    value={`$${selectedTrip.budget?.total || 0}`}
                    gradientFrom="from-green-50"
                    gradientTo="to-green-100 dark:from-green-900/20 dark:to-green-800/20"
                    iconColor="text-green-600"
                    icon="DollarSign"
                  />
                  <TripMetricCard
                    title="Spent So Far"
                    value={`$${activities.reduce((sum, activity) => sum + (activity.cost || 0), 0)}`}
                    gradientFrom="from-red-50"
                    gradientTo="to-red-100 dark:from-red-900/20 dark:to-red-800/20"
                    iconColor="text-red-600"
                    icon="DollarSign"
                  />
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
            ) : (
              <div className="text-center py-12">
                <ApperIcon name="DollarSign" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
                <Text>
                  Select a trip to view its budget
                </Text>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainFeatureContent;