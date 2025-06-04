import React from 'react';
import ApperIcon from '../ApperIcon';
import Text from '../atoms/Text';

const TripMetricCard = ({ icon, iconColor, title, value, subText, gradientFrom, gradientTo }) => {
  return (
    <div className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} p-6 rounded-xl`}>
      <div className="flex items-center space-x-3 mb-3">
        <ApperIcon name={icon} className={`w-6 h-6 ${iconColor}`} />
        <Text variant="cardHeading">{title}</Text>
      </div>
      <Text variant="stat">{value}</Text>
      <Text variant="statSmall" className="mt-1">
        {subText}
      </Text>
    </div>
  );
};

export default TripMetricCard;