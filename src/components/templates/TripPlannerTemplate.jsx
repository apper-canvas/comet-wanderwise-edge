import React from 'react';
import MainFeatureHeader from '../organisms/MainFeatureHeader';
import MainFeatureTabs from '../organisms/MainFeatureTabs';
import MainFeatureContent from '../organisms/MainFeatureContent';
import CreateTripForm from '../organisms/CreateTripForm';
import AddActivityForm from '../organisms/AddActivityForm';
import Card from '../atoms/Card';
import ApperIcon from '../ApperIcon';
import Text from '../atoms/Text';

const TripPlannerTemplate = ({
  trips,
  selectedTrip,
  loading,
  error,
  activeTab,
  selectedDate,
  showNewTripForm,
  showNewActivityForm,
  handleTripChange,
  handleTabClick,
  handleNewTripSubmit,
  handleNewActivitySubmit,
  handleCloseNewTripForm,
  handleCloseNewActivityForm,
  handleShowNewTripForm,
  handleShowNewActivityForm,
  getDayActivities,
  getTripDays,
  calculateTripProgress,
}) => {
  if (loading) {
    return (
      <Card className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded w-1/3"></div>
          <div className="space-y-4">
            <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-full"></div>
            <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-2/3"></div>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <ApperIcon name="AlertTriangle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <Text>{error}</Text>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <MainFeatureHeader
        trips={trips}
        selectedTrip={selectedTrip}
        onTripChange={handleTripChange}
        onNewTripClick={handleShowNewTripForm}
      />
      <MainFeatureTabs
        activeTab={activeTab}
        onTabClick={handleTabClick}
      />
      <MainFeatureContent
        activeTab={activeTab}
        selectedTrip={selectedTrip}
        activities={activities}
        itineraries={itineraries}
        setShowNewTripForm={handleShowNewTripForm}
        setShowNewActivityForm={handleShowNewActivityForm}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        getDayActivities={getDayActivities}
        getTripDays={getTripDays}
        calculateTripProgress={calculateTripProgress}
      />

      <CreateTripForm
        show={showNewTripForm}
        onClose={handleCloseNewTripForm}
        onSubmit={handleNewTripSubmit}
      />
      <AddActivityForm
        show={showNewActivityForm}
        onClose={handleCloseNewActivityForm}
        onSubmit={handleNewActivitySubmit}
      />
    </Card>
  );
};

export default TripPlannerTemplate;