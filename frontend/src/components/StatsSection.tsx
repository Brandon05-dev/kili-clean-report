
import React, { useState, useEffect, useCallback } from 'react';
import { Users, CheckCircle, MapPin, Clock, RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { getAllReports } from '../services/liveDatabase';
import { DatabaseReport } from '../types/report';

const StatsSection = () => {
  const [stats, setStats] = useState({
    totalReports: 0,
    resolvedIssues: 0,
    averageResponse: '0 days'
  });
  const [previousStats, setPreviousStats] = useState({
    totalReports: 0,
    resolvedIssues: 0,
    averageResponse: '0 days'
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Calculate trend for a stat
  const getTrend = (current: number, previous: number) => {
    if (previous === 0) return 'neutral';
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'neutral';
  };

  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-600" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-600" />;
      default:
        return <Minus className="h-3 w-3 text-gray-400" />;
    }
  };

  // Calculate statistics from live data
  const calculateStats = useCallback((reports: DatabaseReport[]) => {
    if (!reports || reports.length === 0) {
      return {
        totalReports: 0,
        resolvedIssues: 0,
        averageResponse: '0 days'
      };
    }

    // Total reports
    const totalReports = reports.length;

    // Resolved issues
    const resolvedIssues = reports.filter(r => r.status.toLowerCase() === 'resolved').length;

    // Calculate average response time
    const resolvedReports = reports.filter(r => r.status.toLowerCase() === 'resolved');
    let averageResponse = '0 days';
    
    if (resolvedReports.length > 0) {
      const totalResponseTime = resolvedReports.reduce((sum, report) => {
        const created = new Date(report.timestamp);
        const updated = new Date(report.updatedAt);
        const diffHours = Math.abs(updated.getTime() - created.getTime()) / (1000 * 60 * 60);
        return sum + diffHours;
      }, 0);
      
      const avgHours = totalResponseTime / resolvedReports.length;
      if (avgHours < 24) {
        averageResponse = `${Math.round(avgHours)}h`;
      } else {
        const avgDays = avgHours / 24;
        averageResponse = `${avgDays.toFixed(1)} days`;
      }
    }

    return {
      totalReports,
      resolvedIssues,
      averageResponse
    };
  }, []);

  // Fetch and update statistics
  const updateStats = useCallback(async () => {
    try {
      const reports = await getAllReports();
      const newStats = calculateStats(reports);
      
      // Store previous stats for trend calculation
      setPreviousStats(stats);
      setStats(newStats);
      setLastUpdated(new Date());
      setLoading(false);
      console.log(`[StatsSection] Stats updated: ${reports.length} reports processed`);
    } catch (error) {
      console.error('Failed to update stats:', error);
      setLoading(false);
    }
  }, [calculateStats, stats]);

  // Auto-refresh effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    // Initial load
    updateStats();

    if (autoRefresh) {
      // Auto-refresh every 15 seconds
      interval = setInterval(() => {
        updateStats();
      }, 15000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoRefresh, updateStats]);

  const displayStats = [
    {
      icon: <MapPin className="h-8 w-8 text-blue-600" />,
      value: loading ? '...' : stats.totalReports.toString(),
      label: 'Total Reports',
      description: 'Issues reported overall',
      trend: getTrend(stats.totalReports, previousStats.totalReports)
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-emerald-600" />,
      value: loading ? '...' : stats.resolvedIssues.toString(),
      label: 'Issues Resolved',
      description: 'Problems cleaned up',
      trend: getTrend(stats.resolvedIssues, previousStats.resolvedIssues)
    },
    {
      icon: <Clock className="h-8 w-8 text-orange-600" />,
      value: loading ? '...' : stats.averageResponse,
      label: 'Average Response',
      description: 'Time to address issues',
      trend: 'neutral' // Response time trend is more complex, keeping neutral for now
    }
  ];

  return (
    <section className="py-12 2xl:py-16 3xl:py-20 4xl:py-24 5xl:py-28 bg-white">
      <div className="max-w-7xl 2xl:max-w-8xl 3xl:max-w-[90rem] 4xl:max-w-[110rem] 5xl:max-w-[140rem] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 3xl:px-20 4xl:px-24">
        <div className="text-center mb-12 2xl:mb-16 3xl:mb-20 4xl:mb-24">
          <div className="flex items-center justify-center gap-3 2xl:gap-4 3xl:gap-5 mb-4 2xl:mb-6 3xl:mb-8">
            <h2 className="text-3xl 2xl:text-4xl 3xl:text-5xl 4xl:text-6xl 5xl:text-7xl font-bold text-gray-900">Community Impact</h2>
            <div className="flex items-center gap-2 2xl:gap-3">
              <RefreshCw 
                className={`h-5 w-5 2xl:h-6 2xl:w-6 3xl:h-7 3xl:w-7 4xl:h-8 4xl:w-8 5xl:h-10 5xl:w-10 ${autoRefresh && !loading ? 'animate-spin text-green-600' : 'text-gray-400'}`} 
              />
              <span className="text-sm 2xl:text-base 3xl:text-lg 4xl:text-xl 5xl:text-2xl text-gray-500">Live Updates</span>
            </div>
          </div>
          <p className="text-lg 2xl:text-xl 3xl:text-2xl 4xl:text-3xl 5xl:text-4xl text-gray-600 max-w-4xl 2xl:max-w-5xl 3xl:max-w-6xl 4xl:max-w-7xl 5xl:max-w-8xl mx-auto">
            Together, we're making a real difference in Kilimani
          </p>
          <div className="mt-3 2xl:mt-4 3xl:mt-5 text-sm 2xl:text-base 3xl:text-lg 4xl:text-xl 5xl:text-2xl text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()} • Auto-refresh every 15 seconds
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 2xl:gap-8 3xl:gap-10 4xl:gap-12 5xl:gap-16 max-w-6xl 2xl:max-w-7xl 3xl:max-w-8xl mx-auto">
          {displayStats.map((stat, index) => (
            <Card key={index} className="border-green-200 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              <CardContent className="p-6 2xl:p-8 3xl:p-10 4xl:p-12 5xl:p-16 text-center">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 2xl:p-6 3xl:p-8 4xl:p-10 rounded-2xl 2xl:rounded-3xl 3xl:rounded-4xl w-fit mx-auto mb-4 2xl:mb-6 3xl:mb-8">
                  <div className="scale-100 2xl:scale-110 3xl:scale-125 4xl:scale-150 5xl:scale-175">
                    {stat.icon}
                  </div>
                </div>
                <div className={`text-3xl 2xl:text-4xl 3xl:text-5xl 4xl:text-6xl 5xl:text-7xl font-bold mb-1 2xl:mb-2 3xl:mb-3 transition-all duration-300 ${
                  loading ? 'text-gray-400 animate-pulse' : 'text-gray-900'
                }`}>
                  {stat.value}
                </div>
                <div className="flex items-center justify-center gap-2 2xl:gap-3 mb-1 2xl:mb-2">
                  <div className="text-lg 2xl:text-xl 3xl:text-2xl 4xl:text-3xl 5xl:text-4xl font-semibold text-green-700">{stat.label}</div>
                  {!loading && (
                    <div className="scale-100 2xl:scale-110 3xl:scale-125 4xl:scale-150">
                      {getTrendIcon(stat.trend)}
                    </div>
                  )}
                </div>
                <div className="text-sm 2xl:text-base 3xl:text-lg 4xl:text-xl 5xl:text-2xl text-gray-600">{stat.description}</div>
                
                {/* Real-time pulse indicator */}
                {autoRefresh && !loading && (
                  <div className="absolute top-2 right-2 2xl:top-3 2xl:right-3 3xl:top-4 3xl:right-4">
                    <span className="flex h-2 w-2 2xl:h-3 2xl:w-3 3xl:h-4 3xl:w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 2xl:h-3 2xl:w-3 3xl:h-4 3xl:w-4 bg-green-500"></span>
                    </span>
                  </div>
                )}
                
                {/* Loading overlay */}
                {loading && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 2xl:h-8 2xl:w-8 3xl:h-10 3xl:w-10 4xl:h-12 4xl:w-12 border-b-2 border-green-600"></div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Auto-refresh status indicator */}
        <div className="mt-8 2xl:mt-12 3xl:mt-16 text-center">
          <div className="inline-flex items-center gap-2 2xl:gap-3 px-4 py-2 2xl:px-6 2xl:py-3 3xl:px-8 3xl:py-4 bg-green-50 border border-green-200 rounded-full text-sm 2xl:text-base 3xl:text-lg 4xl:text-xl">
            <span className={`w-2 h-2 2xl:w-3 2xl:h-3 3xl:w-4 3xl:h-4 rounded-full ${autoRefresh ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
            <span className="text-green-700 font-medium">
              {autoRefresh ? 'Real-time updates active' : 'Updates paused'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
