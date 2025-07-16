
import React from 'react';
import { Users, CheckCircle, MapPin, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const StatsSection = () => {
  const stats = [
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      value: '247',
      label: 'Active Reporters',
      description: 'Community members helping'
    },
    {
      icon: <MapPin className="h-8 w-8 text-blue-600" />,
      value: '89',
      label: 'Total Reports',
      description: 'Issues reported this month'
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-emerald-600" />,
      value: '67',
      label: 'Issues Resolved',
      description: 'Problems cleaned up'
    },
    {
      icon: <Clock className="h-8 w-8 text-orange-600" />,
      value: '2.3 days',
      label: 'Average Response',
      description: 'Time to address issues'
    }
  ];

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Community Impact</h2>
          <p className="text-lg text-gray-600">Together, we're making a real difference in Kilimani</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-green-200 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-2xl w-fit mx-auto mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-lg font-semibold text-green-700 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
