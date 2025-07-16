
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ReportForm from '@/components/ReportForm';
import CommunityMap from '@/components/CommunityMap';
import StatsSection from '@/components/StatsSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <div id="report">
        <ReportForm />
      </div>
      <div id="map">
        <CommunityMap />
      </div>
      <div id="stats">
        <StatsSection />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
