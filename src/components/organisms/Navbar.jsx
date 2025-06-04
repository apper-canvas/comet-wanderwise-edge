import React from 'react';
import ApperIcon from '../ApperIcon';
import AppLogo from '../atoms/AppLogo';
import Input from '../atoms/Input';
import IconButton from '../atoms/IconButton';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-surface-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <AppLogo animate />

          <div className="hidden md:flex items-center space-x-6">
            <Input
              type="text"
              placeholder="Search destinations..."
              className="w-64 bg-white/70 border border-surface-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              icon={ApperIcon.Search}
            />
            <IconButton
              icon={darkMode ? "Sun" : "Moon"}
              onClick={toggleDarkMode}
              iconClass="text-surface-600 dark:text-surface-300"
              label="Toggle dark mode"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;