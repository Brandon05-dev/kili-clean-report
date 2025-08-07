
import React from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ReportForm from '@/components/ReportForm';
import LiveReportsMap from '@/components/LiveReportsMap';
import StatsSection from '@/components/StatsSection';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const Index = () => {
  return (
    <div>
      <Header />
      <HeroSection />
      <ReportForm />
      <LiveReportsMap />
      <StatsSection />
      <Footer />
    </div>
  );
};

export default Index;
