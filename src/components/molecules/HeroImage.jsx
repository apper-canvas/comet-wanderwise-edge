import React from 'react';
import { motion } from 'framer-motion';

const HeroImage = ({ src, alt, delay = 0.4 }) => {
  return (
    <motion.div
      className="relative h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden mb-12"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay }}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-surface-900/40 to-transparent"></div>
    </motion.div>
  );
};

export default HeroImage;