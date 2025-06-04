import React from 'react';
import Text from '../atoms/Text';
import FeatureCard from '../molecules/FeatureCard';

const featuresData = [
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
];

const FeatureGrid = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Text variant="sectionHeading" className="mb-4">
            Everything You Need to Plan
          </Text>
          <Text variant="body" className="max-w-2xl mx-auto">
            From initial inspiration to detailed itineraries, Wanderwise has all the tools to make your trip planning effortless.
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;