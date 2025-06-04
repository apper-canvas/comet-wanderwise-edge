import React from 'react';
import { motion } from 'framer-motion';
import HeroImage from '../molecules/HeroImage';
import Text from '../atoms/Text';

const HeroSection = () => {
  return (
    <section className="relative pt-16 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10"></div>
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Text variant="heroHeading" animate>
            Plan Your Perfect
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent block">
              Adventure
            </span>
          </Text>
          <Text animate delay={0.2} className="max-w-3xl mx-auto">
            Create detailed itineraries, collaborate with friends, track budgets, and discover amazing destinations all in one place.
          </Text>
        </div>

        <HeroImage
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Beautiful mountain landscape"
        />
      </div>
    </section>
  );
};

export default HeroSection;