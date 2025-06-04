import React from 'react';
import { motion } from 'framer-motion';

const Text = ({ children, className = '', variant = 'body', animate = false, delay = 0 }) => {
  const baseClasses = 'text-surface-600 dark:text-surface-300';
  
  const variantClasses = {
    body: 'text-lg sm:text-xl',
    small: 'text-sm',
    caption: 'text-xs',
    subheading: 'font-medium',
    heading: 'text-2xl sm:text-3xl font-heading font-bold text-surface-900 dark:text-white',
    heroHeading: 'text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-surface-900 dark:text-white',
    sectionHeading: 'text-3xl sm:text-4xl font-heading font-bold text-surface-900 dark:text-white',
    cardHeading: 'text-lg font-heading font-semibold text-surface-900 dark:text-white',
    stat: 'text-2xl font-bold text-surface-900 dark:text-white',
    statSmall: 'text-sm text-surface-600 dark:text-surface-300',
    largeStat: 'text-3xl font-bold',
    emptyState: 'text-surface-600 dark:text-surface-300',
  };

  const Component = animate ? motion.p : 'p';
  const motionProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay }
  } : {};

  if (variant === 'heroHeading') {
    return (
      <motion.h1
        className={`${variantClasses[variant]} ${className}`}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {children}
      </motion.h1>
    );
  }

  if (variant === 'sectionHeading') {
    return (
      <h2 className={`${variantClasses[variant]} ${className}`}>
        {children}
      </h2>
    );
  }

  if (variant === 'cardHeading') {
    return (
      <h3 className={`${variantClasses[variant]} ${className}`}>
        {children}
      </h3>
    );
  }

  if (variant === 'heading') {
    return (
      <h2 className={`${variantClasses[variant]} ${className}`}>
        {children}
      </h2>
    )
  }

  return (
    <Component className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...motionProps}>
      {children}
    </Component>
  );
};

export default Text;