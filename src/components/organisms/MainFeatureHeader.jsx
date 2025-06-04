import React from 'react';
import ApperIcon from '../ApperIcon';
import Text from '../atoms/Text';
import Button from '../atoms/Button';
import Select from '../atoms/Select';

const MainFeatureHeader = ({ trips, selectedTrip, onTripChange, onNewTripClick }) => {
  return (
    <div className="p-6 border-b border-surface-200 dark:border-surface-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div>
          <Text variant="heading">
            Trip Planner
          </Text>
          <Text className="mt-1">
            Create and manage your travel itineraries
          </Text>
        </div>

        <div className="flex items-center space-x-3">
          {selectedTrip && (
            <Select
              value={selectedTrip.id}
              onChange={onTripChange}
              options={trips.map(trip => ({ value: trip.id, label: trip.name }))}
            />
          )}

          <Button onClick={onNewTripClick}>
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span className="hidden sm:inline">New Trip</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MainFeatureHeader;