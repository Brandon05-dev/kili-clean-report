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
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="text-center py-8 bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 rounded-xl border border-green-200">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 w-14 h-14 rounded-xl flex items-center justify-center shadow-lg">
            <CheckCircle className="w-7 h-7 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 via-green-700 to-teal-700 bg-clip-text text-transparent mb-2">
          Completed Reports
        </h2>
        <p className="text-green-700 font-medium">
          Archive of successfully resolved community reports
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">Total Completed</p>
                <p className="text-3xl font-bold text-emerald-800">{reports.length}</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-100 to-green-100 p-3 rounded-xl shadow-md">
                <CheckCircle className="h-7 w-7 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-teal-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-700 uppercase tracking-wide">Completed Today</p>
                <p className="text-3xl font-bold text-green-800">
                  {getTodayCompletedCount()}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-teal-100 p-3 rounded-xl shadow-md">
                <Calendar className="h-7 w-7 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-cyan-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-700 uppercase tracking-wide">This Week</p>
                <p className="text-3xl font-bold text-teal-800">
                  {getThisWeekCompletedCount()}
                </p>
              </div>
              <div className="bg-gradient-to-br from-teal-100 to-cyan-100 p-3 rounded-xl shadow-md">
                <Award className="h-7 w-7 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600 mx-auto"></div>
            <p className="text-green-700 mt-4 font-medium">Loading completed reports...</p>
          </div>
        </div>
      ) : reports.length === 0 ? (
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Completed Reports Yet</h3>
            <p className="text-gray-600">
              Completed reports will appear here once teams finish their assigned tasks.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <Card 
              key={report.id} 
              className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{report.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{report.description}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-gradient-to-r from-green-400 to-emerald-400 text-white border-0 shadow-sm">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(report)}
                          className="border-green-200 text-green-700 hover:bg-green-50"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-green-100">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-green-600" />
                        <span className="font-medium">{report.location}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <UserPlus className="w-4 h-4 mr-2 text-green-600" />
                        <span className="font-medium">{report.assignedTeam || 'Unassigned'}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-green-600" />
                        <span className="font-medium">
                          {report.completedAt && report.createdAt
                            ? getTimeDifference(report.createdAt, report.completedAt)
                            : 'N/A'
                          } to complete
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-green-600" />
                        <span className="font-medium">
                          {report.completedAt ? formatDate(report.completedAt) : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedReport && (
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="max-w-2xl border-0 shadow-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl text-green-800 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Completed Report Details
              </DialogTitle>
              <DialogDescription className="text-green-600">
                Full information about this resolved community report
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 p-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">{selectedReport.title}</h3>
                <p className="text-gray-700">{selectedReport.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Location</p>
                    <p className="text-gray-900 font-medium">{selectedReport.location}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Category</p>
                    <p className="text-gray-900 font-medium">{selectedReport.category}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Assigned Team</p>
                    <p className="text-gray-900 font-medium">{selectedReport.assignedTeam || 'Not assigned'}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Submitted</p>
                    <p className="text-gray-900 font-medium">{formatDate(selectedReport.createdAt)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Completed</p>
                    <p className="text-gray-900 font-medium">
                      {selectedReport.completedAt ? formatDate(selectedReport.completedAt) : 'Not completed'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Resolution Time</p>
                    <p className="text-gray-900 font-medium">
                      {selectedReport.completedAt && selectedReport.createdAt
                        ? getTimeDifference(selectedReport.createdAt, selectedReport.completedAt)
                        : 'N/A'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {selectedReport.reporterContact && (
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Reporter Contact</p>
                  <p className="text-gray-900 font-medium">{selectedReport.reporterContact}</p>
                </div>
              )}

              <div className="pt-4 border-t border-green-100">
                <Badge className="bg-gradient-to-r from-green-400 to-emerald-400 text-white border-0 shadow-sm">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Report Successfully Completed
                </Badge>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
