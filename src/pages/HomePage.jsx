import { useState, useEffect } from 'react';
import PageLayout from '../components/templates/PageLayout';
import HeroSection from '../components/organisms/HeroSection';
import UpcomingTripsSection from '../components/organisms/UpcomingTripsSection';
import FeatureGrid from '../components/organisms/FeatureGrid';
import TripPlannerTemplate from '../components/templates/TripPlannerTemplate';
import { tripService, itineraryService, activityService } from '../services';
import { format, addDays, isAfter, isBefore } from 'date-fns';
import { toast } from 'react-toastify';

const HomePage = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const [selectedTrip, setSelectedTrip] = useState(null);
  const [itineraries, setItineraries] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showNewTripForm, setShowNewTripForm] = useState(false);
  const [showNewActivityForm, setShowNewActivityForm] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const tripResult = await tripService.getAll();
        setTrips(tripResult || []);
        if (tripResult?.length > 0) {
          setSelectedTrip(tripResult[0]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedTrip) {
      loadItineraries(selectedTrip.id);
      loadActivities(selectedTrip.id);
      setSelectedDate(new Date(selectedTrip.startDate)); // Set selected date to trip start date
    }
  }, [selectedTrip]);

  const loadItineraries = async (tripId) => {
    try {
      const result = await itineraryService.getAll();
      const tripItineraries = result?.filter(item => item.tripId === tripId) || [];
      setItineraries(tripItineraries);
    } catch (err) {
      console.error('Error loading itineraries:', err);
    }
  };

  const loadActivities = async (tripId) => {
    try {
      const allActivities = await activityService.getAll();
      // Filter activities that are part of any itinerary for the selected trip
      const tripActivities = allActivities?.filter(activity =>
        itineraries.some(itinerary =>
          itinerary.activities?.includes(activity.id)
        )
      ) || [];
      setActivities(tripActivities);
    } catch (err) {
      console.error('Error loading activities:', err);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleTripChange = (e) => {
    const trip = trips.find(t => t.id === e.target.value);
    setSelectedTrip(trip);
  };

  const handleNewTripSubmit = async (newTripData) => {
    try {
      const tripData = {
        ...newTripData,
        status: 'upcoming',
        travelers: [{ id: '1', name: 'You' }],
        destinations: newTripData.destinations.length > 0 ? newTripData.destinations : ['TBD']
      };

      const createdTrip = await tripService.create(tripData);
      setTrips(prev => [createdTrip, ...(prev || [])]);
      setSelectedTrip(createdTrip);
      setShowNewTripForm(false);
      toast.success('Trip created successfully!');
    } catch (err) {
      toast.error('Failed to create trip');
    }
  };

  const handleNewActivitySubmit = async (newActivityData) => {
    if (!selectedTrip) {
      toast.error('Please select a trip first');
      return;
    }

    try {
      const activityData = {
        ...newActivityData,
        date: format(selectedDate, 'yyyy-MM-dd')
      };

      const createdActivity = await activityService.create(activityData);
      setActivities(prev => [createdActivity, ...(prev || [])]);

      // Create or update itinerary for the selected date
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      let dayItinerary = itineraries.find(it => it.date === dateStr && it.tripId === selectedTrip.id);

      if (dayItinerary) {
        const updatedItinerary = {
          ...dayItinerary,
          activities: [...(dayItinerary.activities || []), createdActivity.id]
        };
        await itineraryService.update(dayItinerary.id, updatedItinerary);
        setItineraries(prev => prev.map(it => it.id === dayItinerary.id ? updatedItinerary : it));
      } else {
        const newItinerary = {
          tripId: selectedTrip.id,
          date: dateStr,
          activities: [createdActivity.id],
          notes: ''
        };
        const createdItinerary = await itineraryService.create(newItinerary);
        setItineraries(prev => [createdItinerary, ...(prev || [])]);
      }

      setShowNewActivityForm(false);
      toast.success('Activity added successfully!');
    } catch (err) {
      toast.error('Failed to add activity');
    }
  };

  const getDayActivities = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayItinerary = itineraries.find(it => it.date === dateStr && it.tripId === selectedTrip?.id);
    if (!dayItinerary?.activities) return [];

    return activities.filter(activity =>
      dayItinerary.activities.includes(activity.id)
    ).sort((a, b) => a.time.localeCompare(b.time));
  };

  const getTripDays = () => {
    if (!selectedTrip) return [];

    const start = new Date(selectedTrip.startDate);
    const end = new Date(selectedTrip.endDate);
    const days = [];

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      days.push(new Date(date));
    }

    return days;
  };

  const calculateTripProgress = () => {
    if (!selectedTrip) return 0;

    const today = new Date();
    const start = new Date(selectedTrip.startDate);
    const end = new Date(selectedTrip.endDate);

    if (isBefore(today, start)) return 0;
    if (isAfter(today, end)) return 100;

    const total = end - start;
    const elapsed = today - start;
    return Math.round((elapsed / total) * 100);
  };

  const upcomingTrips = trips.filter(trip => trip.status === 'upcoming').slice(0, 3);

  return (
    <PageLayout darkMode={darkMode} toggleDarkMode={toggleDarkMode}>
      <HeroSection />

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <TripPlannerTemplate
            trips={trips}
            selectedTrip={selectedTrip}
            loading={loading}
            error={error}
            activeTab={activeTab}
            selectedDate={selectedDate}
            showNewTripForm={showNewTripForm}
            showNewActivityForm={showNewActivityForm}
            handleTripChange={handleTripChange}
            handleTabClick={setActiveTab}
            handleNewTripSubmit={handleNewTripSubmit}
            handleNewActivitySubmit={handleNewActivitySubmit}
            handleCloseNewTripForm={() => setShowNewTripForm(false)}
            handleCloseNewActivityForm={() => setShowNewActivityForm(false)}
            handleShowNewTripForm={() => setShowNewTripForm(true)}
            handleShowNewActivityForm={() => setShowNewActivityForm(true)}
            getDayActivities={getDayActivities}
            getTripDays={getTripDays}
            calculateTripProgress={calculateTripProgress}
            itineraries={itineraries} // Pass itineraries down
            activities={activities}   // Pass activities down
            setSelectedDate={setSelectedDate}
          />
        </div>
      </section>

      <UpcomingTripsSection trips={upcomingTrips} loading={loading} error={error} />
      <FeatureGrid />
    </PageLayout>
  );
};

export default HomePage;