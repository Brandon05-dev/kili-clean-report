
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, Filter, MapPin, Calendar, User, AlertTriangle } from 'lucide-react';

// Mock data for demonstration
const mockReports = [
  {
    id: 1,
    type: 'Illegal Dumping',
    location: 'Kigali City Center, Near Market',
    description: 'Large pile of construction waste dumped behind the market area',
    status: 'pending',
    priority: 'high',
    reportedBy: 'John Doe',
    reportedAt: '2024-01-15T10:30:00Z',
    images: ['photo1.jpg']
  },
  {
    id: 2,
    type: 'Littering',
    location: 'Nyarugenge District, Main Road',
    description: 'Scattered plastic bottles and food containers along the roadside',
    status: 'in-progress',
    priority: 'medium',
    reportedBy: 'Jane Smith',
    reportedAt: '2024-01-14T14:20:00Z',
    images: ['photo2.jpg']
  },
  {
    id: 3,
    type: 'Blocked Drainage',
    location: 'Gasabo District, Residential Area',
    description: 'Drainage system blocked with plastic waste causing water accumulation',
    status: 'cleared',
    priority: 'high',
    reportedBy: 'Mary Johnson',
    reportedAt: '2024-01-13T09:15:00Z',
    images: ['photo3.jpg']
  },
  {
    id: 4,
    type: 'Air Pollution',
    location: 'Kicukiro District, Industrial Zone',
    description: 'Strong chemical smell and visible smoke from nearby factory',
    status: 'pending',
    priority: 'high',
    reportedBy: 'Robert Wilson',
    reportedAt: '2024-01-12T16:45:00Z',
    images: []
  }
];

const Dashboard = () => {
  const [reports, setReports] = useState(mockReports);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cleared': return 'bg-green-100 text-green-800 border-green-200';
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

  const updateStatus = (reportId: number, newStatus: string) => {
    setReports(reports.map(report => 
      report.id === reportId ? { ...report, status: newStatus } : report
    ));
  };

  const filteredReports = reports.filter(report => {
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesSearch = report.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statsData = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    inProgress: reports.filter(r => r.status === 'in-progress').length,
    cleared: reports.filter(r => r.status === 'cleared').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Cleaning Team Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage environmental reports and cleanup operations</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{statsData.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-600">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{statsData.pending}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{statsData.inProgress}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Cleared</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{statsData.cleared}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
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
                  <SelectItem value="cleared">Cleared</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card>
          <CardHeader>
            <CardTitle>Environmental Reports</CardTitle>
            <CardDescription>
              Manage and track cleanup operations for reported environmental issues
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
                      <Select
                        value={report.status}
                        onValueChange={(value) => updateStatus(report.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="cleared">Cleared</SelectItem>
                        </SelectContent>
                      </Select>
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
      </div>
    </div>
  );
};

export default Dashboard;
