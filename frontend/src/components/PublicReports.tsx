import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Filter, Eye, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DatabaseReport } from '@/types/report';
import { getAllReports } from '@/services/liveDatabase';

const PublicReports = () => {
  const [reports, setReports] = useState<DatabaseReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<DatabaseReport[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    const filterReports = () => {
      let filtered = [...reports];
      
      if (statusFilter !== 'all') {
        filtered = filtered.filter(report => 
          report.status.toLowerCase() === statusFilter.toLowerCase()
        );
      }
      
      setFilteredReports(filtered);
    };
    
    filterReports();
  }, [reports, statusFilter]);

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
      'Pending': { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
      'In Progress': { color: 'bg-blue-100 text-blue-800', icon: Clock },
      'Resolved': { color: 'bg-green-100 text-green-800', icon: CheckCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config?.icon || AlertTriangle;

    return (
      <Badge className={`${config?.color || 'bg-gray-100 text-gray-800'} flex items-center gap-1`}>
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

  if (loading) {
    return (
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading reports...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-white" id="reports">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Community Reports</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Stay updated on environmental issues in our community and track their resolution progress.
          </p>
        </div>

        {/* Filter Section */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reports</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-sm text-gray-600">
            Showing {filteredReports.length} of {reports.length} reports
          </div>
        </div>

        {/* Reports Grid */}
        {filteredReports.length === 0 ? (
          <div className="text-center py-12">
            <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reports Found</h3>
            <p className="text-gray-600">
              {statusFilter === 'all' 
                ? 'No reports have been submitted yet.' 
                : `No reports with status "${statusFilter}" found.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report) => (
              <Card key={report.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-0">
                  {/* Image */}
                  <div className="h-48 overflow-hidden">
                    {report.photoURL ? (
                      <img
                        src={report.photoURL}
                        alt={`Report ${report.id}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Eye className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-green-600">
                        {getReportTypeLabel(report.type)}
                      </span>
                      {getStatusBadge(report.status)}
                    </div>

                    <p className="text-gray-800 text-sm mb-4 line-clamp-3">
                      {report.description}
                    </p>

                    <div className="space-y-2 text-xs text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-2 flex-shrink-0" />
                        <span className="line-clamp-1">{report.location.address}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-2 flex-shrink-0" />
                        <span>{formatDate(report.timestamp)}</span>
                      </div>
                    </div>

                    {(report.assignedTo || report.notes) && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        {report.assignedTo && (
                          <p className="text-xs text-gray-600">
                            <strong>Assigned to:</strong> {report.assignedTo}
                          </p>
                        )}
                        {report.notes && (
                          <p className="text-xs text-gray-600 mt-1">
                            <strong>Notes:</strong> {report.notes}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* View More Button */}
        {filteredReports.length > 0 && (
          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              className="border-green-600 text-green-600 hover:bg-green-50"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Back to Top
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicReports;
