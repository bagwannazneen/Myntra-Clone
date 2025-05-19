
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsDarkMode } from '@/lib/store/themeSlice';
import Header from './Header';
import Footer from './Footer';
import CartSidebar from '../cart/CartSidebar';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isDarkMode = useSelector(selectIsDarkMode);
  
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    // Set up GSAP ScrollTrigger for page sections
    const sections = document.querySelectorAll('.animate-on-scroll');
    
    sections.forEach((section) => {
      gsap.fromTo(
        section,
        { 
          y: 50, 
          opacity: 0 
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top bottom-=100",
            toggleActions: "play none none none",
          },
        }
      );
    });

    return () => {
      // Clean up ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className={`min-h-screen flex flex-col theme-transition ${isDarkMode ? 'dark' : ''}`}>
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <CartSidebar />
      <Footer />
    </div>
  );
};

export default Layout;
