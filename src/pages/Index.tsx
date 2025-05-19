
import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Layout from '@/components/layout/Layout';
import HeroBanner from '@/components/home/HeroBanner';
import CategorySection from '@/components/home/CategorySection';
import TrendingProducts from '@/components/home/TrendingProducts';
import NewArrivals from '@/components/home/NewArrivals';
import PromoBanner from '@/components/home/PromoBanner';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  // Set up and clean up GSAP ScrollTrigger
  useEffect(() => {
    // Re-register ScrollTrigger to ensure it's available
    if (!ScrollTrigger.isRegistered()) {
      gsap.registerPlugin(ScrollTrigger);
    }
    
    // Clean up ScrollTrigger instances when component unmounts
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <Layout>
      {/* Hero Banner */}
      <HeroBanner />
      
      {/* Category Section */}
      <CategorySection />
      
      {/* Trending Products */}
      <TrendingProducts />
      
      {/* Promo Banner */}
      <PromoBanner />
      
      {/* New Arrivals */}
      <NewArrivals />
    </Layout>
  );
};

export default Index;
