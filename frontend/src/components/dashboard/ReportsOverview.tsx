import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, Filter, MapPin, Calendar, User, AlertTriangle, Eye, Map } from 'lucide-react';

// Mock data for demonstration
const mockReports = [
  {
    id: 1,
    type: 'Illegal Dumping',
    location: 'Kilimani, Near Yaya Centre',
    description: 'Large pile of construction waste dumped behind shopping center',
    status: 'pending',
    priority: 'high',
    reportedBy: 'John Mwangi',
    reportedAt: '2024-01-15T10:30:00Z',
    images: ['photo1.jpg'],
    coordinates: { lat: -1.3031, lng: 36.7870 }
  },
  {
    id: 2,
    type: 'Littering',
    location: 'Kilimani, Argwings Kodhek Road',
    description: 'Scattered plastic bottles and food containers along busy roadside',
    status: 'in-progress',
    priority: 'medium',
    reportedBy: 'Jane Wanjiku',
    reportedAt: '2024-01-14T14:20:00Z',
    images: ['photo2.jpg'],
    coordinates: { lat: -1.3000, lng: 36.7850 }
  },
  {
    id: 3,
    type: 'Blocked Drainage',
    location: 'Kilimani, Wood Avenue',
    description: 'Drainage system blocked with plastic waste causing water accumulation',
    status: 'resolved',
    priority: 'high',
    reportedBy: 'Mary Njeri',
    reportedAt: '2024-01-13T09:15:00Z',
    images: ['photo3.jpg'],
    coordinates: { lat: -1.2950, lng: 36.7900 }
  },
  {
    id: 4,
    type: 'Air Pollution',
    location: 'Kilimani, Hurlingham',
    description: 'Strong chemical smell and visible smoke from nearby construction site',
    status: 'pending',
    priority: 'high',
    reportedBy: 'Robert Kiprotich',
    reportedAt: '2024-01-12T16:45:00Z',
    images: [],
    coordinates: { lat: -1.2980, lng: 36.7820 }
  },
  {
    id: 5,
    type: 'Illegal Dumping',
    location: 'Kilimani, Denis Pritt Road',
    description: 'Electronic waste improperly disposed near residential area',
    status: 'in-progress',
    priority: 'medium',
    reportedBy: 'Sarah Wangari',
    reportedAt: '2024-01-11T11:20:00Z',
    images: ['photo5.jpg'],
    coordinates: { lat: -1.2920, lng: 36.7880 }
  }
];

const ReportsOverview = () => {
  const [reports, setReports] = useState(mockReports);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'map'

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800 border-red-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    const matchesSearch = report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  const statsData = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    inProgress: reports.filter(r => r.status === 'in-progress').length,
    resolved: reports.filter(r => r.status === 'resolved').length
  };

  const reportTypes = [...new Set(reports.map(r => r.type))];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">{statsData.total}</div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Pending Action</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{statsData.pending}</div>
            <p className="text-xs text-gray-500 mt-1">Requires immediate attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-600">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{statsData.inProgress}</div>
            <p className="text-xs text-gray-500 mt-1">Being worked on</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{statsData.resolved}</div>
            <p className="text-xs text-gray-500 mt-1">Completed successfully</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Search
              </CardTitle>
              <CardDescription>Filter and search through environmental reports</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('table')}
              >
                <Eye className="h-4 w-4 mr-1" />
                Table
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
              >
                <Map className="h-4 w-4 mr-1" />
                Map View
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by location, type, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {reportTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reports Display */}
      {viewMode === 'table' ? (
        <Card>
          <CardHeader>
            <CardTitle>Environmental Reports</CardTitle>
            <CardDescription>
              Detailed view of all environmental reports in Kilimani area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Details</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Reporter</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{report.type}</div>
                        <div className="text-sm text-gray-600 mt-1 max-w-xs">
                          {report.description}
                        </div>
                        {report.images.length > 0 && (
                          <div className="text-xs text-blue-600 mt-1">
                            📷 {report.images.length} image(s)
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        {report.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        {report.reportedBy}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {new Date(report.reportedAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-center gap-1 text-sm font-medium ${getPriorityColor(report.priority)}`}>
                        <AlertTriangle className="h-4 w-4" />
                        {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(report.status)}>
                        {report.status.replace('-', ' ').split(' ').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">View</Button>
                        <Button size="sm" variant="outline">Edit</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredReports.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No reports found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Map View</CardTitle>
            <CardDescription>
              Geographic visualization of reports across Kilimani
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <Map className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Interactive map view would be implemented here</p>
                <p className="text-sm text-gray-400 mt-2">
                  Showing {filteredReports.length} reports on the map
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Button className="bg-green-600 hover:bg-green-700">
          <Eye className="h-4 w-4 mr-2" />
          View Reports
        </Button>
        <Button variant="outline">
          <Search className="h-4 w-4 mr-2" />
          Advanced Search
        </Button>
        <Button variant="outline">
          📊 Export Data
        </Button>
        <Button variant="outline">
          📱 Send Alert
        </Button>
      </div>
    </div>
  );
};

export default ReportsOverview;
