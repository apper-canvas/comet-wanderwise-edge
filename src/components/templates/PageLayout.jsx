import React from 'react';
import Navbar from '../organisms/Navbar';
import Footer from '../organisms/Footer';

const PageLayout = ({ children, darkMode, toggleDarkMode }) => {
  return (
    <div className="min-h-screen">
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;