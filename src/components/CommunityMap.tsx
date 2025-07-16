
import React, { useState } from 'react';
import { MapPin, Eye, Clock, CheckCircle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Mock data for reports
const mockReports = [
  {
    id: 1,
    type: 'Illegal Dumping',
    status: 'pending',
    location: 'Yaya Centre Area',
    date: '2 hours ago',
    description: 'Large pile of construction waste dumped near the shopping center',
    image: '/placeholder.svg'
  },
  {
    id: 2,
    type: 'Blocked Drain',
    status: 'in-progress',
    location: 'Argwings Kodhek Road',
    date: '1 day ago',
    description: 'Storm drain completely blocked causing flooding',
    image: '/placeholder.svg'
  },
  {
    id: 3,
    type: 'Litter',
    status: 'cleared',
    location: 'Galana Plaza',
    date: '3 days ago',
    description: 'Scattered plastic waste around the plaza entrance',
    image: '/placeholder.svg'
  },
  {
    id: 4,
    type: 'Overflowing Bin',
    status: 'pending',
    location: 'Wood Avenue',
    date: '5 hours ago',
    description: 'Public bin overflowing onto the sidewalk',
    image: '/placeholder.svg'
  }
];

const CommunityMap = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'in-progress':
        return <Eye className="h-4 w-4" />;
      case 'cleared':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'cleared':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const filteredReports = selectedFilter === 'all' 
    ? mockReports 
    : mockReports.filter(report => report.status === selectedFilter);

  return (
    <section className="py-12 bg-gradient-to-br from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Community Reports</h2>
          <p className="text-lg text-gray-600">See what's happening in your neighborhood</p>
        </div>

        {/* Map Placeholder */}
        <Card className="mb-8 border-green-200 shadow-xl overflow-hidden">
          <div className="relative h-96 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-800 mb-2">Interactive Map Coming Soon</h3>
              <p className="text-green-700">See all community reports pinned on an interactive map</p>
            </div>
            
            {/* Mock pins scattered across the map */}
            <div className="absolute top-20 left-1/4">
              <div className="map-pin pending animate-pulse"></div>
            </div>
            <div className="absolute top-32 right-1/3">
              <div className="map-pin in-progress"></div>
            </div>
            <div className="absolute bottom-24 left-1/2">
              <div className="map-pin cleared"></div>
            </div>
            <div className="absolute top-40 right-1/4">
              <div className="map-pin pending animate-pulse"></div>
            </div>
          </div>
        </Card>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <Button
            variant={selectedFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('all')}
            className="rounded-full"
          >
            <Filter className="mr-2 h-4 w-4" />
            All Reports
          </Button>
          <Button
            variant={selectedFilter === 'pending' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('pending')}
            className="rounded-full"
          >
            <Clock className="mr-2 h-4 w-4" />
            Pending
          </Button>
          <Button
            variant={selectedFilter === 'in-progress' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('in-progress')}
            className="rounded-full"
          >
            <Eye className="mr-2 h-4 w-4" />
            In Progress
          </Button>
          <Button
            variant={selectedFilter === 'cleared' ? 'default' : 'outline'}
            onClick={() => setSelectedFilter('cleared')}
            className="rounded-full"
          >
            <CheckCircle className="mr-2 h-4 w-4" />
            Cleared
          </Button>
        </div>

        {/* Reports List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <Card key={report.id} className="border-green-200 hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{report.type}</CardTitle>
                  <Badge className={`${getStatusColor(report.status)} border`}>
                    {getStatusIcon(report.status)}
                    <span className="ml-1 capitalize">{report.status.replace('-', ' ')}</span>
                  </Badge>
                </div>
                <CardDescription className="flex items-center text-green-700">
                  <MapPin className="h-4 w-4 mr-1" />
                  {report.location}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
                    <span className="text-gray-500">Photo placeholder</span>
                  </div>
                  <p className="text-sm text-gray-600">{report.description}</p>
                  <p className="text-xs text-gray-500">{report.date}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunityMap;
