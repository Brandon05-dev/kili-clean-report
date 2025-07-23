import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Filter, 
  Calendar, 
  MapPin, 
  Search, 
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  Camera,
  RefreshCw,
  Legend as LegendIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DatabaseReport } from '@/types/report';
import { getAllReports } from '@/services/database';

// Fix Leaflet default icons issue with Webpack
delete (L.Icon.Default.prototype as unknown as { _getIconUrl: string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons for different statuses
const createStatusIcon = (status: string, reportType: string) => {
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'pending': return '#f59e0b'; // yellow
      case 'in progress': return '#3b82f6'; // blue
      case 'resolved': return '#10b981'; // green
      default: return '#6b7280'; // gray
    }
  };

  const getTypeIcon = () => {
    switch (reportType) {
      case 'illegal-dumping': return '🗑️';
      case 'blocked-drain': return '🚰';
      case 'overflowing-bin': return '♻️';
      case 'broken-streetlight': return '💡';
      case 'pothole': return '🕳️';
      case 'graffiti': return '🎨';
      default: return '📍';
    }
  };

  return L.divIcon({
    html: `
      <div style="
        background-color: ${getStatusColor()};
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        color: white;
      ">
        ${getTypeIcon()}
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

// Map component for centering and search functionality
const MapController = ({ center, searchLocation }: { center: [number, number], searchLocation: string }) => {
  const map = useMap();

  useEffect(() => {
    if (searchLocation && searchLocation.length > 3) {
      // Simple geocoding simulation - in production, use a real geocoding service
      const nairobi = [-1.2921, 36.7822];
      map.setView(nairobi as [number, number], 15);
    }
  }, [searchLocation, map]);

  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);

  return null;
};

const LiveCommunityMap = () => {
  const [reports, setReports] = useState<DatabaseReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<DatabaseReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<DatabaseReport | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    search: ''
  });
  const [mapCenter] = useState<[number, number]>([-1.2921, 36.7822]); // Kilimani, Nairobi
  const [showLegend, setShowLegend] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load reports on component mount
  useEffect(() => {
    loadReports();
    
    // Set up auto-refresh if enabled
    if (autoRefresh) {
      intervalRef.current = setInterval(loadReports, 30000); // Refresh every 30 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefresh]);

  // Filter reports when filters change
  useEffect(() => {
    const filterReports = () => {
      let filtered = [...reports];

      // Filter by status
      if (filters.status !== 'all') {
        filtered = filtered.filter(report => 
          report.status.toLowerCase() === filters.status.toLowerCase()
        );
      }

      // Filter by date range
      if (filters.dateRange !== 'all') {
        const now = new Date();
        const cutoffDate = new Date();
        
        switch (filters.dateRange) {
          case '7days':
            cutoffDate.setDate(now.getDate() - 7);
            break;
          case '30days':
            cutoffDate.setDate(now.getDate() - 30);
            break;
          case '90days':
            cutoffDate.setDate(now.getDate() - 90);
            break;
        }
        
        filtered = filtered.filter(report => 
          new Date(report.timestamp) >= cutoffDate
        );
      }

      // Filter by search
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filtered = filtered.filter(report =>
          report.description.toLowerCase().includes(searchTerm) ||
          report.location.address.toLowerCase().includes(searchTerm) ||
          report.type.toLowerCase().includes(searchTerm)
        );
      }

      setFilteredReports(filtered);
    };

    filterReports();
  }, [reports, filters]);

  const loadReports = async () => {
    try {
      const reportsData = await getAllReports();
      setReports(reportsData);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
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

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
    if (!autoRefresh) {
      loadReports(); // Refresh immediately when enabling
    }
  };

  return (
    <div className="w-full h-screen bg-gray-50" id="live-map">
      {/* Header Controls */}
      <div className="bg-white shadow-sm border-b p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Title */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-green-600" />
                Live Community Reports Map
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Real-time view of environmental issues in Kilimani • 
                Showing {filteredReports.length} of {reports.length} reports
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-3 items-center">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search reports or locations..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10 w-64"
                />
              </div>

              {/* Status Filter */}
              <Select 
                value={filters.status} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>

              {/* Date Range Filter */}
              <Select 
                value={filters.dateRange} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>

              {/* Auto Refresh Toggle */}
              <Button
                variant={autoRefresh ? "default" : "outline"}
                size="sm"
                onClick={toggleAutoRefresh}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
                Auto Refresh
              </Button>

              {/* Legend Toggle */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLegend(!showLegend)}
                className="flex items-center gap-2"
              >
                <LegendIcon className="h-4 w-4" />
                Legend
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative flex-1 h-full">
        {loading ? (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading community reports...</p>
            </div>
          </div>
        ) : (
          <MapContainer
            center={mapCenter}
            zoom={13}
            className="h-full w-full"
            scrollWheelZoom={true}
          >
            <MapController center={mapCenter} searchLocation={filters.search} />
            
            {/* Map Tiles */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Clustered Markers */}
            <MarkerClusterGroup
              chunkedLoading
              maxClusterRadius={50}
              spiderfyOnMaxZoom={true}
              showCoverageOnHover={false}
            >
              {filteredReports.map((report) => (
                report.location.coordinates && (
                  <Marker
                    key={report.id}
                    position={[
                      report.location.coordinates.latitude,
                      report.location.coordinates.longitude
                    ]}
                    icon={createStatusIcon(report.status, report.type)}
                  >
                    <Popup maxWidth={350} className="custom-popup">
                      <div className="p-2">
                        {/* Status Badge */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-green-600">
                            {getReportTypeLabel(report.type)}
                          </span>
                          {getStatusBadge(report.status)}
                        </div>

                        {/* Image */}
                        {report.photoURL && (
                          <div className="mb-3">
                            <img
                              src={report.photoURL}
                              alt="Report"
                              className="w-full h-32 object-cover rounded-lg"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        )}

                        {/* Description */}
                        <p className="text-gray-800 text-sm mb-3 line-clamp-3">
                          {report.description}
                        </p>

                        {/* Details */}
                        <div className="space-y-2 text-xs text-gray-600">
                          <div className="flex items-center">
                            <MapPin className="h-3 w-3 mr-2 flex-shrink-0" />
                            <span className="line-clamp-1">{report.location.address}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-2 flex-shrink-0" />
                            <span>{formatDate(report.timestamp)}</span>
                          </div>
                          {report.assignedTo && (
                            <div className="flex items-center">
                              <Eye className="h-3 w-3 mr-2 flex-shrink-0" />
                              <span>Assigned to: {report.assignedTo}</span>
                            </div>
                          )}
                        </div>

                        {/* Notes */}
                        {report.notes && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-xs text-gray-600">
                              <strong>Admin Notes:</strong> {report.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                )
              ))}
            </MarkerClusterGroup>
          </MapContainer>
        )}

        {/* Legend */}
        {showLegend && (
          <Card className="absolute top-4 right-4 w-64 z-50 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <LegendIcon className="h-4 w-4" />
                Map Legend
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-white shadow-sm"></div>
                  <span>Pending Reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-sm"></div>
                  <span>In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
                  <span>Resolved</span>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-gray-500">
                    Click markers for details • Map updates every 30 seconds
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Card */}
        <Card className="absolute bottom-4 left-4 z-50 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>{reports.filter(r => r.status === 'Pending').length} Pending</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>{reports.filter(r => r.status === 'In Progress').length} In Progress</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>{reports.filter(r => r.status === 'Resolved').length} Resolved</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LiveCommunityMap;
