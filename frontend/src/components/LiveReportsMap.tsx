import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MapPin, 
  Calendar, 
  Eye, 
  RefreshCw, 
  Search, 
  Navigation, 
  Info,
  AlertTriangle,
  Clock,
  CheckCircle
} from 'lucide-react';
import { getAllReports, getLiveStats } from '../services/liveDatabase';
import { DatabaseReport } from '../types/report';

interface FilterState {
  search: string;
  status: string;
  dateRange: string;
}

interface LiveStats {
  pending: number;
  inProgress: number;
  resolved: number;
}

type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

export default function LiveCommunityMap() {
  const [reports, setReports] = useState<DatabaseReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<DatabaseReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showLegend, setShowLegend] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const [liveStats, setLiveStats] = useState<LiveStats>({ pending: 0, inProgress: 0, resolved: 0 });
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
    dateRange: 'all'
  });

  // Initialize data and subscription
  useEffect(() => {
    const initializeData = async () => {
      try {
        setConnectionStatus('connecting');
        setLoading(true);
        
        // Get all reports
        const data = await getAllReports();
        setReports(data);
        setConnectionStatus('connected');
        setLoading(false);
        setLastUpdateTime(new Date());
        
        console.log(`[LiveReportsMap] Loaded ${data.length} reports`);
      } catch (error) {
        console.error('Failed to initialize live data:', error);
        setConnectionStatus('disconnected');
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Update live stats when reports change
  useEffect(() => {
    const stats = reports.reduce((acc, report) => {
      switch (report.status.toLowerCase()) {
        case 'pending':
          acc.pending++;
          break;
        case 'in progress':
          acc.inProgress++;
          break;
        case 'resolved':
          acc.resolved++;
          break;
      }
      return acc;
    }, { pending: 0, inProgress: 0, resolved: 0 });
    
    setLiveStats(stats);
  }, [reports]);

  // Helper functions for weekly refresh status
  const getWeeklyRefreshStatus = () => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    
    // Check if we're in the refresh window (Monday 00:00 to Sunday 23:59)
    const isInRefreshPeriod = currentDay >= 1 || currentDay === 0; // Always true, but kept for clarity
    
    return {
      isInPeriod: isInRefreshPeriod && autoRefresh,
      currentDay,
      dayName: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentDay]
    };
  };

  const getWeekEndTime = () => {
    const now = new Date();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    
    if (currentDay === 0) {
      // If it's Sunday, the period ends today at 11:59 PM
      const endOfSunday = new Date(now);
      endOfSunday.setHours(23, 59, 59, 999);
      return endOfSunday.toLocaleDateString() + ' 11:59 PM';
    } else {
      // Calculate next Sunday
      const daysUntilSunday = 7 - currentDay;
      const nextSunday = new Date(now);
      nextSunday.setDate(now.getDate() + daysUntilSunday);
      return nextSunday.toLocaleDateString() + ' 11:59 PM';
    }
  };

  const weeklyStatus = getWeeklyRefreshStatus();
  const isWeeklyRefreshActive = weeklyStatus.isInPeriod;

  // Weekly Auto-Refresh: Monday 12:00 AM to Sunday 11:59 PM
  useEffect(() => {
    const setupWeeklyRefresh = () => {
      const now = new Date();
      const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      // Check if we're in the refresh window (Monday 00:00 to Sunday 23:59)
      // Since Monday = 1 and Sunday = 0, we need to handle this specially
      const isInRefreshPeriod = currentDay >= 1 || currentDay === 0; // Monday to Sunday (always true for now)
      
      if (isInRefreshPeriod && autoRefresh) {
        // Calculate next Monday 12:00 AM
        const nextMonday = new Date(now);
        const daysUntilMonday = currentDay === 0 ? 1 : (8 - currentDay); // Days until next Monday
        nextMonday.setDate(now.getDate() + daysUntilMonday);
        nextMonday.setHours(0, 0, 0, 0);
        
        // Calculate next Sunday 11:59 PM
        const nextSunday = new Date(nextMonday);
        nextSunday.setDate(nextMonday.getDate() + 6);
        nextSunday.setHours(23, 59, 59, 999);
        
        console.log(`[LiveReportsMap] Weekly refresh period: ${nextMonday.toLocaleString()} to ${nextSunday.toLocaleString()}`);
        
        // Set up refresh interval every 5 minutes during the week
        const refreshInterval = setInterval(async () => {
          const refreshTime = new Date();
          const refreshDay = refreshTime.getDay();
          const refreshHour = refreshTime.getHours();
          
          // Check if still in refresh period (Monday 00:00 to Sunday 23:59)
          const stillInPeriod = refreshDay >= 1 || (refreshDay === 0 && refreshHour < 24);
          
          if (stillInPeriod && autoRefresh) {
            try {
              console.log(`[LiveReportsMap] Weekly auto-refresh triggered at ${refreshTime.toLocaleString()}`);
              const data = await getAllReports();
              setReports(data);
              setLastUpdateTime(refreshTime);
              setConnectionStatus('connected');
            } catch (error) {
              console.error('[LiveReportsMap] Weekly refresh failed:', error);
              setConnectionStatus('disconnected');
            }
          } else {
            console.log(`[LiveReportsMap] Outside weekly refresh period, stopping auto-refresh`);
            clearInterval(refreshInterval);
          }
        }, 5 * 60 * 1000); // Refresh every 5 minutes
        
        return () => {
          clearInterval(refreshInterval);
        };
      }
      
      return () => {}; // No cleanup needed if not in refresh period
    };

    const cleanup = setupWeeklyRefresh();
    
    // Also set up a daily check to restart the weekly refresh if needed
    const dailyCheck = setInterval(() => {
      const checkTime = new Date();
      const checkDay = checkTime.getDay();
      const checkHour = checkTime.getHours();
      const checkMinute = checkTime.getMinutes();
      
      // Check if it's Monday 00:00 (start of new refresh cycle)
      if (checkDay === 1 && checkHour === 0 && checkMinute === 0) {
        console.log('[LiveReportsMap] Starting new weekly refresh cycle');
        cleanup(); // Clean up old interval
        setupWeeklyRefresh(); // Start new cycle
      }
    }, 60 * 1000); // Check every minute
    
    return () => {
      cleanup();
      clearInterval(dailyCheck);
    };
  }, [autoRefresh]);

  // Filter reports based on current filters
  useEffect(() => {
    let filtered = [...reports];

    // Text search
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(report => 
        report.description.toLowerCase().includes(searchTerm) ||
        report.location.address.toLowerCase().includes(searchTerm) ||
        report.type.toLowerCase().includes(searchTerm)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(report => 
        report.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    // Date range filter
    if (filters.dateRange !== 'all') {
      const days = parseInt(filters.dateRange);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      
      filtered = filtered.filter(report => 
        new Date(report.timestamp) >= cutoffDate
      );
    }

    setFilteredReports(filtered);
  }, [reports, filters]);

  const getLiveStatsFromReports = (reportsList: DatabaseReport[] = reports): LiveStats => {
    return reportsList.reduce((stats, report) => {
      switch (report.status.toLowerCase()) {
        case 'pending':
          stats.pending++;
          break;
        case 'in progress':
          stats.inProgress++;
          break;
        case 'resolved':
          stats.resolved++;
          break;
      }
      return stats;
    }, { pending: 0, inProgress: 0, resolved: 0 });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Pending': { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: AlertTriangle },
      'In Progress': { color: 'bg-blue-100 text-blue-800 border-blue-300', icon: Clock },
      'Resolved': { color: 'bg-green-100 text-green-800 border-green-300', icon: CheckCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config?.icon || AlertTriangle;

    return (
      <Badge className={`${config?.color || 'bg-gray-100 text-gray-800'} flex items-center gap-1 border`}>
        <IconComponent className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getReportTypeLabel = (type: string) => {
    const typeLabels = {
      'illegal-dumping': 'Illegal Dumping',
      'blocked-drain': 'Blocked Drain',
      'overflowing-bin': 'Overflowing Bin',
      'broken-streetlight': 'Broken Streetlight',
      'pothole': 'Pothole',
      'graffiti': 'Graffiti',
      'other': 'Other'
    };
    return typeLabels[type as keyof typeof typeLabels] || type;
  };

  const openGoogleMaps = (report: DatabaseReport) => {
    if (report.location.coordinates) {
      const { latitude, longitude } = report.location.coordinates;
      
      // Create a more precise Google Maps URL with zoom and exact coordinates
      const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}&zoom=18`;
      
      console.log(`Opening Google Maps for report ${report.id}:`);
      console.log(`Coordinates: ${latitude}, ${longitude}`);
      console.log(`Address: ${report.location.address}`);
      console.log(`URL: ${url}`);
      
      window.open(url, '_blank');
    } else {
      console.warn(`No coordinates available for report ${report.id}`);
      
      // Fallback to address search if coordinates are not available
      const addressQuery = encodeURIComponent(report.location.address);
      const fallbackUrl = `https://www.google.com/maps/search/?api=1&query=${addressQuery}`;
      
      console.log(`Fallback to address search: ${fallbackUrl}`);
      window.open(fallbackUrl, '_blank');
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50" id="live-map">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Title and Status Row */}
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-6">
            {/* Title and Description */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-green-100 rounded-xl shadow-sm">
                  <MapPin className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Live Community Reports Map
                  </h2>
                  <p className="text-lg text-gray-600 mt-1">
                    Real-time environmental monitoring for Kilimani Community
                  </p>
                </div>
              </div>
              
              {/* Status Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <Eye className="h-4 w-4" />
                  <span className="font-medium">
                    Showing {filteredReports.length} of {reports.length} reports
                  </span>
                </div>
                
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                  connectionStatus === 'connected' 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : connectionStatus === 'connecting' 
                    ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' 
                    : 'bg-red-100 text-red-700 border border-red-200'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' : 
                    connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
                  }`}></span>
                  {connectionStatus === 'connected' ? 'Live Updates Active' : 
                   connectionStatus === 'connecting' ? 'Connecting...' : 'Connection Lost'}
                </div>

                {/* Weekly Refresh Status */}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                  weeklyStatus.isInPeriod && autoRefresh
                    ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${
                    weeklyStatus.isInPeriod && autoRefresh ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'
                  }`}></span>
                  {weeklyStatus.isInPeriod && autoRefresh ? 'Weekly Auto-Refresh' : 'Auto-Refresh Paused'}
                </div>
                
                {connectionStatus === 'connected' && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <RefreshCw className="h-3 w-3" />
                    <span>Last updated: {lastUpdateTime.toLocaleTimeString()}</span>
                  </div>
                )}

                {/* Weekly Schedule Info */}
                {weeklyStatus.isInPeriod && autoRefresh && (
                  <div className="flex items-center gap-1 text-xs text-blue-600">
                    <Calendar className="h-3 w-3" />
                    <span>Next refresh in ~{weeklyStatus.nextRefreshIn} min</span>
                  </div>
                )}
              </div>
            </div>

            {/* Live Statistics */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-gray-200">
              <div className="text-center mb-3">
                <h3 className="text-sm font-semibold text-gray-700">Live Statistics</h3>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-2xl font-bold text-yellow-600">{liveStats.pending}</span>
                  </div>
                  <p className="text-xs text-gray-600 font-medium">Pending</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-2xl font-bold text-blue-600">{liveStats.inProgress}</span>
                  </div>
                  <p className="text-xs text-gray-600 font-medium">In Progress</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-2xl font-bold text-green-600">{liveStats.resolved}</span>
                  </div>
                  <p className="text-xs text-gray-600 font-medium">Resolved</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Reports
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by location, description, or type..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-10 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Filter Controls */}
              <div className="flex flex-wrap gap-4 items-end">
                {/* Status Filter */}
                <div className="min-w-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status Filter
                  </label>
                  <Select 
                    value={filters.status} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger className="w-40 border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date Range Filter */}
                <div className="min-w-0">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Period
                  </label>
                  <Select 
                    value={filters.dateRange} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}
                  >
                    <SelectTrigger className="w-36 border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="7">Last 7 Days</SelectItem>
                      <SelectItem value="30">Last 30 Days</SelectItem>
                      <SelectItem value="90">Last 90 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Control Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAutoRefresh(!autoRefresh)}
                    className={`${autoRefresh ? 'bg-green-50 border-green-300 text-green-700' : 'bg-gray-50'}`}
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                    {autoRefresh ? 'Live' : 'Paused'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowLegend(!showLegend)}
                    className="border-gray-300"
                  >
                    <Info className="h-4 w-4 mr-2" />
                    Legend
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative">
          {loading ? (
            <div className="flex items-center justify-center h-96 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-6"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Community Reports</h3>
                <p className="text-gray-600">Fetching the latest environmental data...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Interactive Map Placeholder */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-dashed border-green-300 rounded-xl p-8 text-center mb-8 shadow-sm">
                <div className="max-w-md mx-auto">
                  <div className="bg-white rounded-full p-4 inline-block mb-4 shadow-sm">
                    <MapPin className="h-12 w-12 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-800 mb-3">Interactive Map Coming Soon!</h3>
                  <p className="text-green-700 mb-6 leading-relaxed">
                    This will display an interactive Leaflet map with all report locations plotted as pins.
                    For now, view all reports below with their detailed information.
                  </p>
                  <Button 
                    onClick={() => window.open('https://maps.google.com/?q=Kilimani,Nairobi', '_blank')}
                    className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    View Kilimani on Google Maps
                  </Button>
                </div>
              </div>

              {/* Reports Section */}
              {filteredReports.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="max-w-md mx-auto">
                    <div className="bg-gray-100 rounded-full p-4 inline-block mb-4">
                      <Eye className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">No Reports Found</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {filters.status === 'all' 
                        ? 'No reports have been submitted yet. Be the first to report an environmental issue!' 
                        : `No reports with status "${filters.status}" found. Try adjusting your filters.`}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">
                      Community Reports ({filteredReports.length})
                    </h3>
                    <div className="text-sm text-gray-600">
                      Updated {lastUpdateTime.toLocaleTimeString()}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredReports.map((report) => (
                      <Card key={report.id} className="hover:shadow-xl transition-all duration-300 border-gray-200 bg-white overflow-hidden group">
                        <div className="relative">
                          {report.photoURL && (
                            <div className="relative h-48 overflow-hidden">
                              <img 
                                src={report.photoURL} 
                                alt="Report" 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                              <div className="absolute top-3 right-3">
                                {getStatusBadge(report.status)}
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                <p className="text-white text-sm font-medium">
                                  {getReportTypeLabel(report.type)}
                                </p>
                              </div>
                            </div>
                          )}
                          
                          <CardContent className="p-6">
                            <div className="space-y-4">
                              {/* Description */}
                              <p className="text-gray-800 leading-relaxed line-clamp-3">
                                {report.description}
                              </p>

                              {/* Location and Date */}
                              <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-green-600" />
                                  <span className="line-clamp-1 font-medium">{report.location.address}</span>
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400" />
                                  <span>{formatDate(report.timestamp)}</span>
                                </div>
                                {report.assignedTo && (
                                  <div className="flex items-center">
                                    <Eye className="h-4 w-4 mr-2 flex-shrink-0 text-blue-500" />
                                    <span>Assigned to: <span className="font-medium">{report.assignedTo}</span></span>
                                  </div>
                                )}
                              </div>

                              {/* Admin Notes */}
                              {report.notes && (
                                <div className="pt-3 border-t border-gray-100">
                                  <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded-lg">
                                    <span className="font-medium text-blue-800">Admin Notes:</span><br />
                                    {report.notes}
                                  </p>
                                </div>
                              )}

                              {/* Action Button */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openGoogleMaps(report)}
                                className="w-full border-green-600 text-green-600 hover:bg-green-50 hover:border-green-700 transition-colors"
                              >
                                <Navigation className="h-4 w-4 mr-2" />
                                View on Map
                              </Button>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Floating Legend */}
          {showLegend && (
            <Card className="absolute top-4 right-4 w-72 z-50 shadow-xl bg-white/95 backdrop-blur-sm border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Info className="h-5 w-5 text-green-600" />
                    Status Legend
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowLegend(false)}
                    className="h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-white shadow-sm"></div>
                    <div>
                      <span className="font-medium">Pending Reports</span>
                      <p className="text-xs text-gray-600">Awaiting attention</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-sm"></div>
                    <div>
                      <span className="font-medium">In Progress</span>
                      <p className="text-xs text-gray-600">Being worked on</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
                    <div>
                      <span className="font-medium">Resolved</span>
                      <p className="text-xs text-gray-600">Issue completed</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-gray-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span>Live updates every 5 seconds</span>
                  </div>
                  {connectionStatus === 'connected' && (
                    <p className="text-xs text-gray-500 mt-1">
                      Last sync: {lastUpdateTime.toLocaleTimeString()}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <RefreshCw className={`h-3 w-3 ${isWeeklyRefreshActive ? 'animate-spin text-blue-500' : 'text-gray-400'}`} />
                    <span className={isWeeklyRefreshActive ? 'text-blue-600 font-medium' : 'text-gray-500'}>
                      Weekly Auto-Refresh
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 pl-5">
                    {isWeeklyRefreshActive 
                      ? `Active until ${getWeekEndTime()}`
                      : `Starts Monday 12:00 AM`
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
