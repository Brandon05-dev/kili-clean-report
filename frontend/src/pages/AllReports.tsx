import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PublicReports from '@/components/PublicReports';

const AllReports = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="pt-20"> {/* Add padding top to account for fixed header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">All Community Reports</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              View all environmental reports submitted by the Kilimani community. Track the progress and status of each report in real-time.
            </p>
          </div>
          <PublicReports />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AllReports;
