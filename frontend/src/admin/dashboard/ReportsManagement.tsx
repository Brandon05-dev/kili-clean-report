import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  MapPin, 
  Calendar, 
  Filter, 
  Search, 
  Download,
  CheckCircle,
  Clock,
  AlertTriangle,
  MoreHorizontal,
  Edit,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DatabaseReport, ReportStats } from '@/types/report';
import { getAllReports, updateReportStatus, deleteReport, getReportStats } from '@/services/liveDatabase';
import { toast } from '@/hooks/use-toast';

const ReportsManagement = () => {
  const [reports, setReports] = useState<DatabaseReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<DatabaseReport[]>([]);
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<DatabaseReport | null>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: '' as 'Pending' | 'In Progress' | 'Resolved' | '',
    notes: '',
    assignedTo: ''
  });
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    dateRange: 'all'
  });

  // Load reports and stats
  useEffect(() => {
    loadData();
  }, []);

  // Apply filters
  useEffect(() => {
    const applyFilters = () => {
      let filtered = reports;

      // Status filter
      if (filters.status !== 'all') {
        filtered = filtered.filter(report => 
          report.status.toLowerCase().replace(' ', '-') === filters.status
        );
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(report =>
          report.description.toLowerCase().includes(searchLower) ||
          report.location.address.toLowerCase().includes(searchLower) ||
          report.type.toLowerCase().includes(searchLower) ||
          report.id.toLowerCase().includes(searchLower)
        );
      }

      // Date range filter
      if (filters.dateRange !== 'all') {
        const now = new Date();
        const cutoffDate = new Date();
        
        switch (filters.dateRange) {
          case 'today':
            cutoffDate.setHours(0, 0, 0, 0);
            break;
          case 'week':
            cutoffDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            cutoffDate.setMonth(now.getMonth() - 1);
            break;
        }
        
        filtered = filtered.filter(report => 
          new Date(report.timestamp) >= cutoffDate
        );
      }

      setFilteredReports(filtered);
    };

    applyFilters();
  }, [reports, filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reportsData, statsData] = await Promise.all([
        getAllReports(),
        getReportStats()
      ]);
      setReports(reportsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load reports data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (reportId: string, status: 'Pending' | 'In Progress' | 'Resolved', notes?: string, assignedTo?: string) => {
    try {
      await updateReportStatus(reportId, status, notes, assignedTo);
      await loadData(); // Refresh data
      toast({
        title: "Status updated",
        description: `Report status changed to ${status}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update report status.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        await deleteReport(reportId);
        await loadData(); // Refresh data
        toast({
          title: "Report deleted",
          description: "The report has been permanently removed.",
        });
      } catch (error) {
        console.error('Error deleting report:', error);
        toast({
          title: "Error",
          description: "Failed to delete report.",
          variant: "destructive",
        });
      }
    }
  };

  const openUpdateDialog = (report: DatabaseReport) => {
    setSelectedReport(report);
    setUpdateData({
      status: report.status,
      notes: report.notes || '',
      assignedTo: report.assignedTo || ''
    });
    setIsUpdateDialogOpen(true);
  };

  const handleUpdateSubmit = async () => {
    if (!selectedReport || !updateData.status) return;

    try {
      await updateReportStatus(
        selectedReport.id,
        updateData.status,
        updateData.notes,
        updateData.assignedTo
      );
      await loadData();
      setIsUpdateDialogOpen(false);
      toast({
        title: "Report updated",
        description: "Report details have been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating report:', error);
      toast({
        title: "Error",
        description: "Failed to update report.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><AlertTriangle className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'In Progress':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800"><Clock className="w-3 h-3 mr-1" />In Progress</Badge>;
      case 'Resolved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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

  const exportReports = () => {
    const csvContent = [
      ['ID', 'Type', 'Description', 'Location', 'Status', 'Assigned To', 'Created', 'Updated'],
      ...filteredReports.map(report => [
        report.id,
        report.type,
        report.description,
        report.location.address,
        report.status,
        report.assignedTo || '',
        report.timestamp,
        report.updatedAt
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cleankili-reports-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reports</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                </div>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
                </div>
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Reports Management</span>
            <div className="flex gap-2">
              <Button onClick={exportReports} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-60">
              <Input
                placeholder="Search reports..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full"
              />
            </div>
            
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={filters.dateRange} onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last Week</SelectItem>
                <SelectItem value="month">Last Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reports Table */}
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {filteredReports.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No reports found matching your filters.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReports.map((report) => (
                    <Card key={report.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col lg:flex-row">
                          {/* Image */}
                          <div className="lg:w-48 h-48 lg:h-auto">
                            {report.photoURL ? (
                              <img
                                src={report.photoURL}
                                alt={`Report ${report.id}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  console.error('Image failed to load:', report.photoURL);
                                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <div className="text-center text-gray-500">
                                  <Eye className="h-8 w-8 mx-auto mb-2" />
                                  <p className="text-sm">No image</p>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-lg">{report.id}</h3>
                                  {getStatusBadge(report.status)}
                                </div>
                                <p className="text-sm text-gray-600 mb-1">
                                  Type: {report.type.replace('-', ' ').toUpperCase()}
                                </p>
                                <p className="text-gray-800 mb-3">{report.description}</p>
                              </div>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openUpdateDialog(report)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Update Status
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => window.open(`https://maps.google.com/?q=${report.location.coordinates?.latitude},${report.location.coordinates?.longitude}`, '_blank')}>
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    View on Map
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteReport(report.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center text-gray-600">
                                <MapPin className="h-4 w-4 mr-2" />
                                {report.location.address}
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Calendar className="h-4 w-4 mr-2" />
                                {formatDate(report.timestamp)}
                              </div>
                              {report.assignedTo && (
                                <div className="text-gray-600">
                                  <strong>Assigned to:</strong> {report.assignedTo}
                                </div>
                              )}
                              {report.notes && (
                                <div className="text-gray-600">
                                  <strong>Notes:</strong> {report.notes}
                                </div>
                              )}
                            </div>
                            
                            {/* Quick Actions */}
                            <div className="flex gap-2 mt-4">
                              {report.status === 'Pending' && (
                                <Button 
                                  size="sm" 
                                  onClick={() => handleStatusUpdate(report.id, 'In Progress')}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  Start Progress
                                </Button>
                              )}
                              {report.status === 'In Progress' && (
                                <Button 
                                  size="sm" 
                                  onClick={() => handleStatusUpdate(report.id, 'Resolved')}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Mark Resolved
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Update Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Report Status</DialogTitle>
            <DialogDescription>
              Update the status and details for report {selectedReport?.id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <Select 
                value={updateData.status} 
                onValueChange={(value: 'Pending' | 'In Progress' | 'Resolved') => 
                  setUpdateData(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Assigned To</label>
              <Input
                value={updateData.assignedTo}
                onChange={(e) => setUpdateData(prev => ({ ...prev, assignedTo: e.target.value }))}
                placeholder="Enter team or person name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Notes</label>
              <Textarea
                value={updateData.notes}
                onChange={(e) => setUpdateData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Add any additional notes or updates..."
                rows={3}
              />
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button onClick={handleUpdateSubmit} className="flex-1">
                Update Report
              </Button>
              <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportsManagement;
