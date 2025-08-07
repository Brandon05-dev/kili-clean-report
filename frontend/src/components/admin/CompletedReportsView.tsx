import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  CheckCircle, 
  MapPin, 
  Clock, 
  User, 
  Eye, 
  UserPlus,
  Calendar,
  Award
} from 'lucide-react';
import { adminDashboardService } from '@/services/adminDashboard';
import { AdminReport } from '@/types/admin';

export const CompletedReportsView: React.FC = () => {
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<AdminReport | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const completedReports = await adminDashboardService.getCompletedReports();
        setReports(completedReports);
      } catch (error) {
        console.error('Error loading completed reports:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleViewDetails = (report: AdminReport) => {
    setSelectedReport(report);
    setIsDetailModalOpen(true);
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

  const getTimeDifference = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffInMs = endDate.getTime() - startDate.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInDays > 0) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''}`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''}`;
    } else {
      return 'Less than 1 hour';
    }
  };

  const getTodayCompletedCount = () => {
    const today = new Date().toDateString();
    return reports.filter(r => 
      r.completedAt && 
      new Date(r.completedAt).toDateString() === today
    ).length;
  };

  const getThisWeekCompletedCount = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return reports.filter(r => 
      r.completedAt && 
      new Date(r.completedAt) >= oneWeekAgo
    ).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Completed Reports</h2>
        <p className="text-gray-600 mt-1">
          Archive of successfully resolved community reports
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Completed</p>
                <p className="text-2xl font-bold text-green-600">{reports.length}</p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-green-600">
                  {getTodayCompletedCount()}
                </p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-purple-600">
                  {getThisWeekCompletedCount()}
                </p>
              </div>
              <div className="bg-purple-100 p-2 rounded-lg">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading completed reports...</p>
          </div>
        </div>
      ) : reports.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Completed Reports Yet</h3>
            <p className="text-gray-600">
              Completed reports will appear here once teams finish their work.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{report.type}</h3>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{report.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {report.location}
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Reported by {report.submittedBy}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Submitted: {formatDate(report.timestamp)}
                      </div>
                      {report.completedAt && (
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Completed: {formatDate(report.completedAt)}
                        </div>
                      )}
                      {report.assignedTeam && (
                        <div className="flex items-center">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Handled by {report.assignedTeam}
                        </div>
                      )}
                      {report.completedAt && (
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Resolved in {getTimeDifference(report.timestamp, report.completedAt)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Photo thumbnail */}
                  {report.photoURL && (
                    <div className="ml-4 flex-shrink-0">
                      <img
                        src={report.photoURL}
                        alt="Report"
                        className="w-20 h-20 object-cover rounded-lg border opacity-75"
                      />
                    </div>
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex items-center justify-end mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(report)}
                    className="flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Completed Report Details</DialogTitle>
            <DialogDescription>
              Review this successfully resolved community report
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-6">
              {/* Photo */}
              {selectedReport.photoURL && (
                <div className="w-full">
                  <img
                    src={selectedReport.photoURL}
                    alt="Report"
                    className="w-full h-64 object-cover rounded-lg border"
                  />
                </div>
              )}
              
              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900">Type</h4>
                  <p className="text-gray-600">{selectedReport.type}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Status</h4>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completed
                  </Badge>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Location</h4>
                  <p className="text-gray-600">{selectedReport.location}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Submitted By</h4>
                  <p className="text-gray-600">{selectedReport.submittedBy}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Reported On</h4>
                  <p className="text-gray-600">{formatDate(selectedReport.timestamp)}</p>
                </div>
                
                {selectedReport.completedAt && (
                  <div>
                    <h4 className="font-medium text-gray-900">Completed On</h4>
                    <p className="text-gray-600">{formatDate(selectedReport.completedAt)}</p>
                  </div>
                )}
                
                {selectedReport.assignedTeam && (
                  <div>
                    <h4 className="font-medium text-gray-900">Handled By</h4>
                    <p className="text-gray-600">{selectedReport.assignedTeam}</p>
                  </div>
                )}
                
                {selectedReport.completedAt && (
                  <div>
                    <h4 className="font-medium text-gray-900">Resolution Time</h4>
                    <p className="text-gray-600">
                      {getTimeDifference(selectedReport.timestamp, selectedReport.completedAt)}
                    </p>
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600">{selectedReport.description}</p>
              </div>
              
              {/* Success Message */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <h4 className="font-medium text-green-900">Successfully Resolved</h4>
                </div>
                <p className="text-green-700 text-sm mt-1">
                  This report has been completed and archived. The community issue has been successfully addressed.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
