import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-900 dark:to-surface-800 flex items-center justify-center px-4">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="MapPin" className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-6xl font-heading font-bold text-surface-900 dark:text-white mb-4">
            404
          </h1>
          <h2 className="text-2xl font-heading font-semibold text-surface-700 dark:text-surface-300 mb-4">
            Looks like you're off the beaten path!
          </h2>
          <p className="text-surface-600 dark:text-surface-400 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist. Let's get you back to planning your next adventure.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            <ApperIcon name="Home" className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound