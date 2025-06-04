import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'
import { tripService } from '../services'

const Home = () => {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const loadTrips = async () => {
      setLoading(true)
      try {
        const result = await tripService.getAll()
        setTrips(result || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadTrips()
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const upcomingTrips = trips.filter(trip => trip.status === 'upcoming').slice(0, 3)

  return (
    <div className="min-h-screen">
      {/* Hero Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-surface-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="MapPin" className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-heading font-bold text-surface-900 dark:text-white">
                Wanderwise
              </span>
            </motion.div>

            <div className="hidden md:flex items-center space-x-6">
              <div className="relative">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                  type="text"
                  placeholder="Search destinations..."
                  className="pl-10 pr-4 py-2 w-64 bg-white/70 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              >
                <ApperIcon name={darkMode ? "Sun" : "Moon"} className="w-5 h-5 text-surface-600 dark:text-surface-300" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10"></div>
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-surface-900 dark:text-white mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Plan Your Perfect
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent block">
                Adventure
              </span>
            </motion.h1>
            <motion.p 
              className="text-lg sm:text-xl text-surface-600 dark:text-surface-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Create detailed itineraries, collaborate with friends, track budgets, and discover amazing destinations all in one place.
            </motion.p>
          </div>

          {/* Hero Image */}
          <motion.div 
            className="relative h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden mb-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <img
              src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Beautiful mountain landscape"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-900/40 to-transparent"></div>
          </motion.div>
        </div>
      </section>

      {/* Main Feature Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <MainFeature />
        </div>
      </section>

      {/* Upcoming Trips Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-surface-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-surface-900 dark:text-white">
              Your Upcoming Adventures
            </h2>
            <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
              <ApperIcon name="Plus" className="w-4 h-4" />
              <span className="hidden sm:inline">New Trip</span>
            </button>
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
              <p className="text-surface-600 dark:text-surface-300">{error}</p>
            </div>
          ) : upcomingTrips.length === 0 ? (
            <div className="text-center py-12">
              <ApperIcon name="Compass" className="w-12 h-12 text-surface-400 mx-auto mb-4" />
              <p className="text-surface-600 dark:text-surface-300">No upcoming trips yet. Start planning your next adventure!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingTrips.map((trip, index) => (
                <motion.div
                  key={trip.id}
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
                    <h3 className="text-lg font-heading font-semibold text-surface-900 dark:text-white mb-2">
                      {trip.name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-surface-600 dark:text-surface-300 mb-4">
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Calendar" className="w-4 h-4" />
                        <span>{trip.startDate}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Users" className="w-4 h-4" />
                        <span>{trip.travelers?.length || 1}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="DollarSign" className="w-4 h-4 text-accent" />
                        <span className="font-medium text-surface-900 dark:text-white">
                          ${trip.budget?.total || 0}
                        </span>
                      </div>
                      <button className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-surface-900 dark:text-white mb-4">
              Everything You Need to Plan
            </h2>
            <p className="text-lg text-surface-600 dark:text-surface-300 max-w-2xl mx-auto">
              From initial inspiration to detailed itineraries, Wanderwise has all the tools to make your trip planning effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "Calendar",
                title: "Interactive Planning",
                description: "Drag-and-drop itinerary builder with real-time collaboration"
              },
              {
                icon: "DollarSign",
                title: "Budget Tracking",
                description: "Monitor expenses and split costs with travel companions"
              },
              {
                icon: "Map",
                title: "Route Optimization",
                description: "Visualize your journey with integrated maps and directions"
              },
              {
                icon: "Users",
                title: "Group Collaboration",
                description: "Plan together with real-time updates and shared access"
              },
              {
                icon: "Star",
                title: "Local Recommendations",
                description: "Discover hidden gems and popular attractions"
              },
              {
                icon: "Smartphone",
                title: "Offline Access",
                description: "Access your plans anywhere, even without internet"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="p-6 bg-white dark:bg-surface-800 rounded-xl shadow-card hover:shadow-elevated transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                  <ApperIcon name={feature.icon} className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-surface-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-surface-600 dark:text-surface-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-900 dark:bg-surface-950 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="MapPin" className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-heading font-bold">Wanderwise</span>
            </div>
            <p className="text-surface-400 text-center md:text-right">
              © 2024 Wanderwise. Making travel planning effortless.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home