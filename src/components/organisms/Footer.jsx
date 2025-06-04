import React from 'react';
import AppLogo from '../atoms/AppLogo';
import Text from '../atoms/Text';

const Footer = () => {
  return (
    <footer className="bg-surface-900 dark:bg-surface-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <AppLogo className="mb-4 md:mb-0" />
          <Text className="text-surface-400 text-center md:text-right" variant="body">
            © 2024 Wanderwise. Making travel planning effortless.
          </Text>
        </div>
      </div>
    </footer>
  );
};

export default Footer;