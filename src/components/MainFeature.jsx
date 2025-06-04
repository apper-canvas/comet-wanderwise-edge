import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, addDays, isAfter, isBefore } from 'date-fns'
import ApperIcon from './ApperIcon'
import { tripService, itineraryService, activityService } from '../services'

const MainFeature = () => {
  const [trips, setTrips] = useState([])
  const [selectedTrip, setSelectedTrip] = useState(null)
  const [itineraries, setItineraries] = useState([])
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showNewTripForm, setShowNewTripForm] = useState(false)
  const [showNewActivityForm, setShowNewActivityForm] = useState(false)

  // New trip form state
  const [newTrip, setNewTrip] = useState({
    name: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    destinations: [],
    budget: { total: 0, spent: 0 }
  })

  // New activity form state
  const [newActivity, setNewActivity] = useState({
    name: '',
    location: { name: '', lat: 0, lng: 0 },
    time: '09:00',
    duration: 60,
    cost: 0,
    category: 'sightseeing'
  })

  useEffect(() => {
    loadTrips()
  }, [])

  useEffect(() => {
    if (selectedTrip) {
      loadItineraries(selectedTrip.id)
      loadActivities(selectedTrip.id)
    }
  }, [selectedTrip])

  const loadTrips = async () => {
    setLoading(true)
    try {
      const result = await tripService.getAll()
      setTrips(result || [])
      if (result?.length > 0) {
        setSelectedTrip(result[0])
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadItineraries = async (tripId) => {
    try {
      const result = await itineraryService.getAll()
      const tripItineraries = result?.filter(item => item.tripId === tripId) || []
      setItineraries(tripItineraries)
    } catch (err) {
      console.error('Error loading itineraries:', err)
    }
  }

  const loadActivities = async (tripId) => {
    try {
      const result = await activityService.getAll()
      const tripActivities = result?.filter(activity => 
        itineraries.some(itinerary => 
          itinerary.activities?.includes(activity.id)
        )
      ) || []
      setActivities(tripActivities)
    } catch (err) {
      console.error('Error loading activities:', err)
    }
  }

  const createTrip = async (e) => {
    e.preventDefault()
    
    if (!newTrip.name.trim()) {
      toast.error('Please enter a trip name')
      return
    }

    if (isAfter(new Date(newTrip.startDate), new Date(newTrip.endDate))) {
      toast.error('End date must be after start date')
      return
    }

    try {
      const tripData = {
        ...newTrip,
        status: 'upcoming',
        travelers: [{ id: '1', name: 'You' }],
        destinations: newTrip.destinations.length > 0 ? newTrip.destinations : ['TBD']
      }
      
      const createdTrip = await tripService.create(tripData)
      setTrips(prev => [createdTrip, ...(prev || [])])
      setSelectedTrip(createdTrip)
      setNewTrip({
        name: '',
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
        destinations: [],
        budget: { total: 0, spent: 0 }
      })
      setShowNewTripForm(false)
      toast.success('Trip created successfully!')
    } catch (err) {
      toast.error('Failed to create trip')
    }
  }

  const createActivity = async (e) => {
    e.preventDefault()
    
    if (!newActivity.name.trim()) {
      toast.error('Please enter an activity name')
      return
    }

    if (!selectedTrip) {
      toast.error('Please select a trip first')
      return
    }

    try {
      const activityData = {
        ...newActivity,
        date: format(selectedDate, 'yyyy-MM-dd')
      }
      
      const createdActivity = await activityService.create(activityData)
      setActivities(prev => [createdActivity, ...(prev || [])])
      
      // Create or update itinerary for the selected date
      const dateStr = format(selectedDate, 'yyyy-MM-dd')
      let dayItinerary = itineraries.find(it => it.date === dateStr)
      
      if (dayItinerary) {
        const updatedItinerary = {
          ...dayItinerary,
          activities: [...(dayItinerary.activities || []), createdActivity.id]
        }
        await itineraryService.update(dayItinerary.id, updatedItinerary)
        setItineraries(prev => prev.map(it => it.id === dayItinerary.id ? updatedItinerary : it))
      } else {
        const newItinerary = {
          tripId: selectedTrip.id,
          date: dateStr,
          activities: [createdActivity.id],
          notes: ''
        }
        const createdItinerary = await itineraryService.create(newItinerary)
        setItineraries(prev => [createdItinerary, ...(prev || [])])
      }

      setNewActivity({
        name: '',
        location: { name: '', lat: 0, lng: 0 },
        time: '09:00',
        duration: 60,
        cost: 0,
        category: 'sightseeing'
      })
      setShowNewActivityForm(false)
      toast.success('Activity added successfully!')
    } catch (err) {
      toast.error('Failed to add activity')
    }
  }

  const getDayActivities = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const dayItinerary = itineraries.find(it => it.date === dateStr)
    if (!dayItinerary?.activities) return []
    
    return activities.filter(activity => 
      dayItinerary.activities.includes(activity.id)
    ).sort((a, b) => a.time.localeCompare(b.time))
  }

  const getTripDays = () => {
    if (!selectedTrip) return []
    
    const start = new Date(selectedTrip.startDate)
    const end = new Date(selectedTrip.endDate)
    const days = []
    
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      days.push(new Date(date))
    }
    
    return days
  }

  const calculateTripProgress = () => {
    if (!selectedTrip) return 0
    
    const today = new Date()
    const start = new Date(selectedTrip.startDate)
    const end = new Date(selectedTrip.endDate)
    
    if (isBefore(today, start)) return 0
    if (isAfter(today, end)) return 100
    
    const total = end - start
    const elapsed = today - start
    return Math.round((elapsed / total) * 100)
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-surface-200 dark:bg-surface-700 rounded w-1/3"></div>
          <div className="space-y-4">
            <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-full"></div>
            <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-card overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-surface-200 dark:border-surface-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-heading font-bold text-surface-900 dark:text-white">
              Trip Planner
            </h2>
            <p className="text-surface-600 dark:text-surface-300 mt-1">
              Create and manage your travel itineraries
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {selectedTrip && (
              <select
                value={selectedTrip.id}
                onChange={(e) => {
                  const trip = trips.find(t => t.id === e.target.value)
                  setSelectedTrip(trip)
                }}
                className="px-4 py-2 bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {trips.map(trip => (
                  <option key={trip.id} value={trip.id}>
                    {trip.name}
                  </option>
                ))}
              </select>
            )}
            
            <button
              onClick={() => setShowNewTripForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <ApperIcon name="Plus" className="w-4 h-4" />
              <span className="hidden sm:inline">New Trip</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-surface-200 dark:border-surface-700">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'overview', label: 'Overview', icon: 'BarChart3' },
            { id: 'itinerary', label: 'Itinerary', icon: 'Calendar' },
            { id: 'budget', label: 'Budget', icon: 'DollarSign' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white'
              }`}
            >
              <ApperIcon name={tab.icon} className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
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
                    <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-xl">
                      <div className="flex items-center space-x-3 mb-3">
                        <ApperIcon name="Calendar" className="w-6 h-6 text-primary" />
                        <h3 className="font-heading font-semibold text-surface-900 dark:text-white">
                          Duration
                        </h3>
                      </div>
                      <p className="text-2xl font-bold text-surface-900 dark:text-white">
                        {Math.ceil((new Date(selectedTrip.endDate) - new Date(selectedTrip.startDate)) / (1000 * 60 * 60 * 24))} days
                      </p>
                      <p className="text-sm text-surface-600 dark:text-surface-300 mt-1">
                        {selectedTrip.startDate} - {selectedTrip.endDate}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 p-6 rounded-xl">
                      <div className="flex items-center space-x-3 mb-3">
                        <ApperIcon name="MapPin" className="w-6 h-6 text-secondary" />
                        <h3 className="font-heading font-semibold text-surface-900 dark:text-white">
                          Destinations
                        </h3>
                      </div>
                      <p className="text-2xl font-bold text-surface-900 dark:text-white">
                        {selectedTrip.destinations?.length || 0}
                      </p>
                      <p className="text-sm text-surface-600 dark:text-surface-300 mt-1">
                        {selectedTrip.destinations?.join(', ') || 'No destinations yet'}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-accent/10 to-accent/5 p-6 rounded-xl">
                      <div className="flex items-center space-x-3 mb-3">
                        <ApperIcon name="Activity" className="w-6 h-6 text-accent" />
                        <h3 className="font-heading font-semibold text-surface-900 dark:text-white">
                          Activities
                        </h3>
                      </div>
                      <p className="text-2xl font-bold text-surface-900 dark:text-white">
                        {activities.length}
                      </p>
                      <p className="text-sm text-surface-600 dark:text-surface-300 mt-1">
                        Planned activities
                      </p>
                    </div>
                  </div>

                  <div className="bg-surface-50 dark:bg-surface-900 p-6 rounded-xl">
                    <h3 className="font-heading font-semibold text-surface-900 dark:text-white mb-4">
                      Trip Progress
                    </h3>
                    <div className="w-full bg-surface-200 dark:bg-surface-700 rounded-full h-3 mb-2">
                      <div
                        className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500"
                        style={{ width: `${calculateTripProgress()}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-surface-600 dark:text-surface-300">
                      {calculateTripProgress()}% complete
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <ApperIcon name="PlusCircle" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
                  <h3 className="text-lg font-heading font-semibold text-surface-900 dark:text-white mb-2">
                    No trips yet
                  </h3>
                  <p className="text-surface-600 dark:text-surface-300 mb-6">
                    Create your first trip to start planning your adventure
                  </p>
                  <button
                    onClick={() => setShowNewTripForm(true)}
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Create Your First Trip
                  </button>
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
                    <h3 className="text-lg font-heading font-semibold text-surface-900 dark:text-white">
                      Daily Schedule
                    </h3>
                    <button
                      onClick={() => setShowNewActivityForm(true)}
                      className="flex items-center space-x-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors"
                    >
                      <ApperIcon name="Plus" className="w-4 h-4" />
                      <span>Add Activity</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Date selector */}
                    <div className="lg:col-span-1">
                      <h4 className="font-medium text-surface-900 dark:text-white mb-3">
                        Select Date
                      </h4>
                      <div className="space-y-2">
                        {getTripDays().map(date => {
                          const dayActivities = getDayActivities(date)
                          const isSelected = format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                          
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
                          )
                        })}
                      </div>
                    </div>

                    {/* Activities for selected date */}
                    <div className="lg:col-span-3">
                      <h4 className="font-medium text-surface-900 dark:text-white mb-3">
                        {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                      </h4>
                      
                      <div className="space-y-3">
                        {getDayActivities(selectedDate).map(activity => (
                          <div
                            key={activity.id}
                            className="p-4 bg-surface-50 dark:bg-surface-700 rounded-lg border-l-4 border-primary"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="font-medium text-surface-900 dark:text-white">
                                  {activity.name}
                                </h5>
                                <div className="flex items-center space-x-4 mt-2 text-sm text-surface-600 dark:text-surface-300">
                                  <div className="flex items-center space-x-1">
                                    <ApperIcon name="Clock" className="w-4 h-4" />
                                    <span>{activity.time}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <ApperIcon name="MapPin" className="w-4 h-4" />
                                    <span>{activity.location?.name || 'Location TBD'}</span>
                                  </div>
                                  {activity.cost > 0 && (
                                    <div className="flex items-center space-x-1">
                                      <ApperIcon name="DollarSign" className="w-4 h-4" />
                                      <span>${activity.cost}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                activity.category === 'sightseeing' ? 'bg-blue-100 text-blue-800' :
                                activity.category === 'food' ? 'bg-green-100 text-green-800' :
                                activity.category === 'transport' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-purple-100 text-purple-800'
                              }`}>
                                {activity.category}
                              </span>
                            </div>
                          </div>
                        ))}
                        
                        {getDayActivities(selectedDate).length === 0 && (
                          <div className="text-center py-8 text-surface-500 dark:text-surface-400">
                            <ApperIcon name="Calendar" className="w-8 h-8 mx-auto mb-2" />
                            <p>No activities planned for this day</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <ApperIcon name="Calendar" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
                  <p className="text-surface-600 dark:text-surface-300">
                    Select a trip to view its itinerary
                  </p>
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
                        ${activities.reduce((sum, activity) => sum + (activity.cost || 0), 0)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-surface-50 dark:bg-surface-900 p-6 rounded-xl">
                    <h3 className="font-heading font-semibold text-surface-900 dark:text-white mb-4">
                      Expense Breakdown
                    </h3>
                    
                    <div className="space-y-4">
                      {['sightseeing', 'food', 'transport', 'accommodation'].map(category => {
                        const categoryTotal = activities
                          .filter(activity => activity.category === category)
                          .reduce((sum, activity) => sum + (activity.cost || 0), 0)
                        
                        return (
                          <div key={category} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-3 h-3 rounded-full ${
                                category === 'sightseeing' ? 'bg-blue-500' :
                                category === 'food' ? 'bg-green-500' :
                                category === 'transport' ? 'bg-yellow-500' :
                                'bg-purple-500'
                              }`}></div>
                              <span className="font-medium text-surface-900 dark:text-white capitalize">
                                {category}
                              </span>
                            </div>
                            <span className="font-bold text-surface-900 dark:text-white">
                              ${categoryTotal}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <ApperIcon name="DollarSign" className="w-16 h-16 text-surface-400 mx-auto mb-4" />
                  <p className="text-surface-600 dark:text-surface-300">
                    Select a trip to view its budget
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* New Trip Modal */}
      <AnimatePresence>
        {showNewTripForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowNewTripForm(false)}
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
                  onClick={() => setShowNewTripForm(false)}
                  className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={createTrip} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Trip Name
                  </label>
                  <input
                    type="text"
                    value={newTrip.name}
                    onChange={(e) => setNewTrip(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-surface-700"
                    placeholder="Enter trip name"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={newTrip.startDate}
                      onChange={(e) => setNewTrip(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-surface-700"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={newTrip.endDate}
                      onChange={(e) => setNewTrip(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-surface-700"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Budget
                  </label>
                  <input
                    type="number"
                    value={newTrip.budget.total}
                    onChange={(e) => setNewTrip(prev => ({ 
                      ...prev, 
                      budget: { ...prev.budget, total: parseInt(e.target.value) || 0 }
                    }))}
                    className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-surface-700"
                    placeholder="Enter total budget"
                    min="0"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewTripForm(false)}
                    className="flex-1 px-4 py-2 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Create Trip
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Activity Modal */}
      <AnimatePresence>
        {showNewActivityForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowNewActivityForm(false)}
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
                  onClick={() => setShowNewActivityForm(false)}
                  className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={createActivity} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Activity Name
                  </label>
                  <input
                    type="text"
                    value={newActivity.name}
                    onChange={(e) => setNewActivity(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-surface-700"
                    placeholder="Enter activity name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newActivity.location.name}
                    onChange={(e) => setNewActivity(prev => ({ 
                      ...prev, 
                      location: { ...prev.location, name: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-surface-700"
                    placeholder="Enter location"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Time
                    </label>
                    <input
                      type="time"
                      value={newActivity.time}
                      onChange={(e) => setNewActivity(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-surface-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Duration (min)
                    </label>
                    <input
                      type="number"
                      value={newActivity.duration}
                      onChange={(e) => setNewActivity(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-surface-700"
                      min="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Cost ($)
                    </label>
                    <input
                      type="number"
                      value={newActivity.cost}
                      onChange={(e) => setNewActivity(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-surface-700"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
                      Category
                    </label>
                    <select
                      value={newActivity.category}
                      onChange={(e) => setNewActivity(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-surface-300 dark:border-surface-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-surface-700"
                    >
                      <option value="sightseeing">Sightseeing</option>
                      <option value="food">Food & Dining</option>
                      <option value="transport">Transportation</option>
                      <option value="accommodation">Accommodation</option>
                    </select>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewActivityForm(false)}
                    className="flex-1 px-4 py-2 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors"
                  >
                    Add Activity
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature