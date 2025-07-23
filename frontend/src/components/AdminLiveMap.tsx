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
  CheckCircle,
  Shield,
  Users,
  FileText,
  Download,
  Filter,
  Edit3,
  Trash2
} from 'lucide-react';
import { getAllReports, updateReportStatus, deleteReport } from '../services/liveDatabase';
import { DatabaseReport } from '../types/report';

interface FilterState {
  search: string;
  status: string;
  dateRange: string;
  type: string;
  assignedTo: string;
}

interface LiveStats {
  pending: number;
  inProgress: number;
  resolved: number;
  total: number;
}

type ConnectionStatus = 'connected' | 'connecting' | 'disconnected';

export default function AdminLiveMap() {
  const [reports, setReports] = useState<DatabaseReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<DatabaseReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showLegend, setShowLegend] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('connecting');
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const [liveStats, setLiveStats] = useState<LiveStats>({ pending: 0, inProgress: 0, resolved: 0, total: 0 });
  const [selectedReport, setSelectedReport] = useState<DatabaseReport | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
    dateRange: 'all',
    type: 'all',
    assignedTo: 'all'
  });

  // Auto-refresh interval for admin dashboard
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (autoRefresh) {
      interval = setInterval(async () => {
        try {
          const data = await getAllReports();
          setReports(data);
          setLastUpdateTime(new Date());
          console.log(`[AdminLiveMap] Auto-refresh: ${data.length} reports loaded`);
        } catch (error) {
          console.error('Auto-refresh failed:', error);
        }
      }, 30000); // Refresh every 30 seconds for admin
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoRefresh]);

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setConnectionStatus('connecting');
        setLoading(true);
        
        const data = await getAllReports();
        setReports(data);
        setConnectionStatus('connected');
        setLoading(false);
        setLastUpdateTime(new Date());
        
        console.log(`[AdminLiveMap] Loaded ${data.length} reports`);
      } catch (error) {
        console.error('Failed to initialize admin live data:', error);
        setConnectionStatus('disconnected');
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  // Update live stats when reports change
  useEffect(() => {
    const stats = reports.reduce((acc, report) => {
      acc.total++;
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
    }, { pending: 0, inProgress: 0, resolved: 0, total: 0 });
    
    setLiveStats(stats);
  }, [reports]);

  // Filter reports based on current filters
  useEffect(() => {
    let filtered = [...reports];

    // Text search
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(report => 
        report.description.toLowerCase().includes(searchTerm) ||
        report.location.address.toLowerCase().includes(searchTerm) ||
        report.type.toLowerCase().includes(searchTerm) ||
        report.id.toLowerCase().includes(searchTerm) ||
        (report.assignedTo && report.assignedTo.toLowerCase().includes(searchTerm))
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(report => 
        report.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(report => report.type === filters.type);
    }

    // Assigned to filter
    if (filters.assignedTo !== 'all') {
      if (filters.assignedTo === 'unassigned') {
        filtered = filtered.filter(report => !report.assignedTo);
      } else {
        filtered = filtered.filter(report => report.assignedTo === filters.assignedTo);
      }
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

  const handleStatusChange = async (reportId: string, newStatus: string) => {
    try {
      const updatedReport = await updateReportStatus(reportId, newStatus as 'Pending' | 'In Progress' | 'Resolved');
      if (updatedReport) {
        setReports(prev => prev.map(r => r.id === reportId ? updatedReport : r));
        console.log(`Report ${reportId} status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error('Failed to update report status:', error);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      try {
        const success = await deleteReport(reportId);
        if (success) {
          setReports(prev => prev.filter(r => r.id !== reportId));
          console.log(`Report ${reportId} deleted successfully`);
        }
      } catch (error) {
        console.error('Failed to delete report:', error);
      }
    }
  };

  const exportReports = () => {
    const csvContent = [
      ['ID', 'Type', 'Description', 'Location', 'Status', 'Assigned To', 'Date Created', 'Last Updated'],
      ...filteredReports.map(report => [
        report.id,
        getReportTypeLabel(report.type),
        report.description.replace(/,/g, ';'),
        report.location.address.replace(/,/g, ';'),
        report.status,
        report.assignedTo || 'Unassigned',
        formatDate(report.timestamp),
        formatDate(report.updatedAt)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `community-reports-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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

  const getUniqueAssignees = () => {
    const assignees = new Set<string>();
    reports.forEach(report => {
      if (report.assignedTo) {
        assignees.add(report.assignedTo);
      }
    });
    return Array.from(assignees);
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Admin Header Section */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto max-w-full sm:max-w-7xl md:max-w-8xl lg:max-w-[90rem] xl:max-w-[110rem] 2xl:max-w-screen-2xl px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-4 sm:py-6 md:py-8 lg:py-10 xl:py-12 2xl:py-16">
          {/* Title and Admin Stats */}
          <div className="flex flex-col xl:flex-row gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-16 items-start xl:items-center justify-between mb-4 sm:mb-6 md:mb-8 lg:mb-10 xl:mb-12">
            {/* Admin Title */}
            <div className="flex-1 w-full xl:w-auto">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-3 sm:mb-4 md:mb-5">
                <div className="p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 2xl:p-8 bg-blue-100 rounded-lg sm:rounded-xl shadow-sm">
                  <Shield className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 xl:h-14 xl:w-14 2xl:h-16 2xl:w-16 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-gray-900 leading-tight">
                    Admin Live Reports Map
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-gray-600 mt-1 sm:mt-2 leading-relaxed">
                    Administrative control panel for community environmental reports
                  </p>
                </div>
              </div>
              
              {/* Status Information */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl">
                <div className="flex items-center gap-1 sm:gap-2 text-gray-700">
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6" />
                  <span className="font-medium">
                    Viewing {filteredReports.length} of {reports.length} reports
                  </span>
                </div>
                
                <div className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-xs sm:text-sm md:text-base font-medium ${
                  connectionStatus === 'connected' 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : connectionStatus === 'connecting' 
                    ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' 
                    : 'bg-red-100 text-red-700 border border-red-200'
                }`}>
                  <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3 lg:w-4 lg:h-4 rounded-full ${
                    connectionStatus === 'connected' ? 'bg-green-500 animate-pulse' : 
                    connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
                  }`}></span>
                  {connectionStatus === 'connected' ? 'System Online' : 
                   connectionStatus === 'connecting' ? 'Connecting...' : 'System Offline'}
                </div>
                
                {connectionStatus === 'connected' && (
                  <div className="flex items-center gap-1 text-xs sm:text-sm md:text-base text-gray-500">
                    <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
                    <span>Last updated: {lastUpdateTime.toLocaleTimeString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Admin Statistics */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 2xl:p-12 border border-gray-200 w-full xl:w-auto xl:min-w-[400px] 2xl:min-w-[500px]">
              <div className="text-center mb-2 sm:mb-3 md:mb-4 lg:mb-5">
                <h3 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-semibold text-gray-700">System Statistics</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10">
                <div className="text-center">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 2xl:h-8 2xl:w-8 text-gray-600" />
                    <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-gray-900">{liveStats.total}</span>
                  </div>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-600 font-medium">Total</p>
                </div>
                <div className="text-center">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 2xl:h-8 2xl:w-8 text-yellow-600" />
                    <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-yellow-600">{liveStats.pending}</span>
                  </div>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-600 font-medium">Pending</p>
                </div>
                <div className="text-center">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 2xl:h-8 2xl:w-8 text-blue-600" />
                    <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-blue-600">{liveStats.inProgress}</span>
                  </div>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-600 font-medium">In Progress</p>
                </div>
                <div className="text-center">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 2xl:h-8 2xl:w-8 text-green-600" />
                    <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-green-600">{liveStats.resolved}</span>
                  </div>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-600 font-medium">Resolved</p>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Filter Controls */}
          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 md:p-6">
            <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 md:gap-6 items-start lg:items-end justify-between mb-3 sm:mb-4 md:mb-6">
              {/* Search */}
              <div className="flex-1 w-full lg:max-w-md xl:max-w-lg">
                <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                  Search Reports
                </label>
                <div className="relative">
                  <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-gray-400" />
                  <Input
                    placeholder="Search by ID, location, description, or assignee..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="pl-8 sm:pl-10 md:pl-12 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm md:text-base"
                  />
                </div>
              </div>

              {/* Admin Controls */}
              <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`${autoRefresh ? 'bg-green-50 border-green-300 text-green-700' : 'bg-gray-50'} text-xs sm:text-sm`}
                >
                  <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                  {autoRefresh ? 'Auto-Refresh' : 'Paused'}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportReports}
                  className="border-gray-300 text-xs sm:text-sm"
                >
                  <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Export CSV
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLegend(!showLegend)}
                  className="border-gray-300 text-xs sm:text-sm"
                >
                  <Info className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Legend
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                  Status Filter
                </label>
                <Select 
                  value={filters.status} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger className="border-gray-300 text-xs sm:text-sm">
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

              {/* Type Filter */}
              <div>
                <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                  Report Type
                </label>
                <Select 
                  value={filters.type} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger className="border-gray-300 text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="illegal-dumping">Illegal Dumping</SelectItem>
                    <SelectItem value="blocked-drain">Blocked Drain</SelectItem>
                    <SelectItem value="overflowing-bin">Overflowing Bin</SelectItem>
                    <SelectItem value="broken-streetlight">Broken Streetlight</SelectItem>
                    <SelectItem value="pothole">Pothole</SelectItem>
                    <SelectItem value="graffiti">Graffiti</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Assignee Filter */}
              <div>
                <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                  Assigned To
                </label>
                <Select 
                  value={filters.assignedTo} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, assignedTo: value }))}
                >
                  <SelectTrigger className="border-gray-300 text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Assignees</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {getUniqueAssignees().map(assignee => (
                      <SelectItem key={assignee} value={assignee}>{assignee}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range Filter */}
              <div>
                <label className="block text-xs sm:text-sm md:text-base font-medium text-gray-700 mb-1 sm:mb-2">
                  Time Period
                </label>
                <Select 
                  value={filters.dateRange} 
                  onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}
                >
                  <SelectTrigger className="border-gray-300 text-xs sm:text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="1">Today</SelectItem>
                    <SelectItem value="7">Last 7 Days</SelectItem>
                    <SelectItem value="30">Last 30 Days</SelectItem>
                    <SelectItem value="90">Last 90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto max-w-full sm:max-w-7xl md:max-w-8xl lg:max-w-[90rem] xl:max-w-[110rem] 2xl:max-w-screen-2xl px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-4 sm:py-6 md:py-8 lg:py-12 xl:py-16 2xl:py-20">
        <div className="relative">
          {loading ? (
            <div className="flex items-center justify-center h-64 sm:h-80 md:h-96 lg:h-[30rem] xl:h-[40rem] 2xl:h-[50rem] bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
              <div className="text-center px-4">
                <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 lg:h-24 lg:w-24 xl:h-32 xl:w-32 2xl:h-40 2xl:w-40 border-b-4 border-blue-600 mx-auto mb-4 sm:mb-6 md:mb-8 lg:mb-10"></div>
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-semibold text-gray-900 mb-2 sm:mb-3">Loading Admin Dashboard</h3>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-gray-600">Fetching latest system data...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Administrative Map Placeholder */}
              <div className="bg-gradient-to-br from-blue-50 to-green-50 border-2 border-dashed border-blue-300 rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 2xl:p-20 text-center mb-4 sm:mb-6 md:mb-8 lg:mb-12 xl:mb-16 shadow-sm">
                <div className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-4xl mx-auto">
                  <div className="bg-white rounded-full p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 2xl:p-12 inline-block mb-3 sm:mb-4 md:mb-6 lg:mb-8 shadow-sm">
                    <MapPin className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-16 lg:w-16 xl:h-20 xl:w-20 2xl:h-24 2xl:w-24 text-blue-600" />
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold text-blue-800 mb-2 sm:mb-3 md:mb-4 lg:mb-5 xl:mb-6">Administrative Map View</h3>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-blue-700 mb-4 sm:mb-6 md:mb-8 lg:mb-10 xl:mb-12 leading-relaxed">
                    Enhanced map interface with administrative controls for managing community reports.
                    Zoom, filter, and manage reports with advanced tools.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 lg:gap-5 justify-center">
                    <Button 
                      onClick={() => window.open('https://maps.google.com/?q=Kilimani,Nairobi', '_blank')}
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-sm text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl px-4 sm:px-6 md:px-8 lg:px-10 py-2 sm:py-3 md:py-4 lg:py-5"
                    >
                      <Navigation className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-2" />
                      Open Map View
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => window.open('https://earth.google.com', '_blank')}
                      className="w-full sm:w-auto border-blue-300 text-blue-600 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl px-4 sm:px-6 md:px-8 lg:px-10 py-2 sm:py-3 md:py-4 lg:py-5"
                    >
                      <Eye className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-2" />
                      Satellite View
                    </Button>
                  </div>
                </div>
              </div>

              {/* Reports Section */}
              {filteredReports.length === 0 ? (
                <div className="text-center py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
                  <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto px-4">
                    <div className="bg-gray-100 rounded-full p-3 sm:p-4 md:p-6 inline-block mb-3 sm:mb-4 md:mb-6">
                      <Filter className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-16 lg:w-16 text-gray-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">No Reports Match Filters</h3>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-600 leading-relaxed">
                      No reports found matching your current filter criteria. Try adjusting your filters or check back later.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6 md:space-y-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
                    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-gray-900">
                      Reports Management ({filteredReports.length} filtered)
                    </h3>
                    <div className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600">
                      Last updated: {lastUpdateTime.toLocaleTimeString()}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
                    {filteredReports.map((report) => (
                      <Card key={report.id} className="hover:shadow-xl transition-all duration-300 border-gray-200 bg-white overflow-hidden group">
                        <div className="relative">
                          {report.photoURL && (
                            <div className="relative h-32 sm:h-40 md:h-48 lg:h-56 xl:h-64 overflow-hidden">
                              <img 
                                src={report.photoURL} 
                                alt="Report" 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                }}
                              />
                              <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                                {getStatusBadge(report.status)}
                              </div>
                              <div className="absolute top-2 sm:top-3 left-2 sm:left-3">
                                <Badge variant="secondary" className="bg-black/70 text-white border-none text-xs sm:text-sm">
                                  ID: {report.id.split('_')[1]?.slice(-4) || 'N/A'}
                                </Badge>
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 sm:p-3 md:p-4">
                                <p className="text-white text-xs sm:text-sm md:text-base font-medium">
                                  {getReportTypeLabel(report.type)}
                                </p>
                              </div>
                            </div>
                          )}
                          
                          <CardContent className="p-3 sm:p-4 md:p-6">
                            <div className="space-y-2 sm:space-y-3 md:space-y-4">
                              {/* Description */}
                              <p className="text-xs sm:text-sm md:text-base text-gray-800 leading-relaxed line-clamp-3">
                                {report.description}
                              </p>

                              {/* Location and Date */}
                              <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                                <div className="flex items-center">
                                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0 text-blue-600" />
                                  <span className="line-clamp-1 font-medium">{report.location.address}</span>
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0 text-gray-400" />
                                  <span>{formatDate(report.timestamp)}</span>
                                </div>
                                <div className="flex items-center">
                                  <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0 text-green-500" />
                                  <span>Assigned: <span className="font-medium">{report.assignedTo || 'Unassigned'}</span></span>
                                </div>
                              </div>

                              {/* Admin Notes */}
                              {report.notes && (
                                <div className="pt-2 sm:pt-3 border-t border-gray-100">
                                  <p className="text-xs sm:text-sm text-gray-700 bg-blue-50 p-2 sm:p-3 rounded-lg">
                                    <span className="font-medium text-blue-800">Admin Notes:</span><br />
                                    {report.notes}
                                  </p>
                                </div>
                              )}

                              {/* Status Actions */}
                              <div className="pt-2 sm:pt-3 border-t border-gray-100">
                                <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                                  <span className="text-xs sm:text-sm font-medium text-gray-700">Quick Actions:</span>
                                </div>
                                <div className="grid grid-cols-2 gap-1 sm:gap-2">
                                  <Select 
                                    value={report.status} 
                                    onValueChange={(value) => handleStatusChange(report.id, value)}
                                  >
                                    <SelectTrigger className="text-xs h-8">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Pending">Pending</SelectItem>
                                      <SelectItem value="In Progress">In Progress</SelectItem>
                                      <SelectItem value="Resolved">Resolved</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteReport(report.id)}
                                    className="text-red-600 border-red-300 hover:bg-red-50 h-8 text-xs"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>

                              {/* Admin Action Buttons */}
                              <div className="grid grid-cols-2 gap-1 sm:gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openGoogleMaps(report)}
                                  className="border-blue-600 text-blue-600 hover:bg-blue-50 h-8 text-xs"
                                >
                                  <Navigation className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedReport(report)}
                                  className="border-gray-600 text-gray-600 hover:bg-gray-50 h-8 text-xs"
                                >
                                  <Edit3 className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                              </div>
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

          {/* Floating Admin Legend */}
          {showLegend && (
            <Card className="absolute top-4 right-4 w-72 sm:w-80 md:w-96 z-50 shadow-xl bg-white/95 backdrop-blur-sm border-gray-200">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-sm sm:text-base md:text-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                    Admin Control Legend
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
              <CardContent className="pt-0 space-y-3 sm:space-y-4">
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-yellow-500 border-2 border-white shadow-sm"></div>
                    <div>
                      <span className="font-medium">Pending Reports</span>
                      <p className="text-xs text-gray-600">Require immediate attention</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-blue-500 border-2 border-white shadow-sm"></div>
                    <div>
                      <span className="font-medium">In Progress</span>
                      <p className="text-xs text-gray-600">Currently being worked on</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
                    <div>
                      <span className="font-medium">Resolved</span>
                      <p className="text-xs text-gray-600">Completed successfully</p>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 sm:pt-3 border-t border-gray-100">
                  <h4 className="font-medium text-gray-800 mb-1 sm:mb-2 text-xs sm:text-sm">Admin Features:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Status updates via dropdown</li>
                    <li>• Export reports to CSV</li>
                    <li>• Advanced filtering options</li>
                    <li>• Real-time auto-refresh (30s)</li>
                    <li>• Direct map integration</li>
                  </ul>
                </div>
                
                <div className="pt-2 sm:pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1 sm:gap-2 text-xs text-gray-600">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-500 rounded-full animate-pulse"></span>
                    <span>Admin updates every 30 seconds</span>
                  </div>
                  {connectionStatus === 'connected' && (
                    <p className="text-xs text-gray-500 mt-1">
                      Last sync: {lastUpdateTime.toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
