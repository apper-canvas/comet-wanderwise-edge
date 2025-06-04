import React from 'react';
import ApperIcon from '../ApperIcon';
import Text from '../atoms/Text';

const MainFeatureTabs = ({ activeTab, onTabClick }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'itinerary', label: 'Itinerary', icon: 'Calendar' },
    { id: 'budget', label: 'Budget', icon: 'DollarSign' }
  ];

  return (
    <div className="border-b border-surface-200 dark:border-surface-700">
      <nav className="flex space-x-8 px-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabClick(tab.id)}
            className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-surface-600 dark:text-surface-300 hover:text-surface-900 dark:hover:text-white'
            }`}
          >
            <ApperIcon name={tab.icon} className="w-4 h-4" />
            <Text variant="subheading">{tab.label}</Text>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default MainFeatureTabs;