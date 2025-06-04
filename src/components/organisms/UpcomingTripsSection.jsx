import React from 'react';
import ApperIcon from '../ApperIcon';
import Text from '../atoms/Text';
import Button from '../atoms/Button';
import TripCard from '../molecules/TripCard';

const UpcomingTripsSection = ({ trips, loading, error }) => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-surface-800/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Text variant="heading">
            Your Upcoming Adventures
          </Text>
          <Button>
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span className="hidden sm:inline">New Trip</span>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-surface-200 dark:bg-surface-700 rounded-xl h-48"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <ApperIcon name="AlertTriangle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <Text>{error}</Text>
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-12">
            <ApperIcon name="Compass" className="w-12 h-12 text-surface-400 mx-auto mb-4" />
            <Text>No upcoming trips yet. Start planning your next adventure!</Text>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip, index) => (
              <TripCard key={trip.id} trip={trip} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingTripsSection;