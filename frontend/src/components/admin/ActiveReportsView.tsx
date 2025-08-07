import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, 
  Clock, 
  User, 
  Eye, 
  UserPlus, 
  CheckCircle,
  AlertTriangle,
  Calendar
} from 'lucide-react';
import { adminDashboardService } from '@/services/adminDashboard';
import { AdminReport, MaintenanceTeam } from '@/types/admin';

interface ActiveReportsViewProps {
  onDataChange: () => void;
}

export const ActiveReportsView: React.FC<ActiveReportsViewProps> = ({ onDataChange }) => {
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [teams, setTeams] = useState<MaintenanceTeam[]>([]);
  const [selectedReport, setSelectedReport] = useState<AdminReport | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);

  // Load data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [activeReports, availableTeams] = await Promise.all([
        adminDashboardService.getActiveReports(),
        Promise.resolve(adminDashboardService.getTeams())
      ]);
      setReports(activeReports);
      setTeams(availableTeams);
    } catch (error) {
      console.error('Error loading active reports data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleViewDetails = (report: AdminReport) => {
    setSelectedReport(report);
    setSelectedTeamId('');
    setIsDetailModalOpen(true);
  };

  const handleAssignTeam = async () => {
    if (selectedReport && selectedTeamId) {
      setIsAssigning(true);
      try {
        const success = await adminDashboardService.assignTeam(selectedReport.id, selectedTeamId);
        if (success) {
          await loadData();
          onDataChange();
          setIsDetailModalOpen(false);
          setSelectedReport(null);
          setSelectedTeamId('');
        }
      } catch (error) {
        console.error('Error assigning team:', error);
      } finally {
        setIsAssigning(false);
      }
    }
  };

  const handleMarkComplete = async (reportId: string) => {
    if (window.confirm('Are you sure you want to mark this report as completed?')) {
      try {
        const success = await adminDashboardService.markReportCompleted(reportId);
        if (success) {
          await loadData();
          onDataChange();
          setIsDetailModalOpen(false);
          setSelectedReport(null);
        }
      } catch (error) {
        console.error('Error marking report complete:', error);
      }
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

  const getStatusBadge = (report: AdminReport) => {
    if (!report.assignedTeam) {
      return (
        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Unassigned
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-green-600 border-green-600">
        <Clock className="w-3 h-3 mr-1" />
        In Progress
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Active Reports</h2>
        <p className="text-gray-600 mt-1">
          Manage ongoing reports and assign them to maintenance teams
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Active</p>
                <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unassigned</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {reports.filter(r => !r.assignedTeam).length}
                </p>
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
                <p className="text-2xl font-bold text-green-600">
                  {reports.filter(r => r.assignedTeam).length}
                </p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <UserPlus className="h-6 w-6 text-green-600" />
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
            <p className="text-gray-500 mt-2">Loading reports...</p>
          </div>
        </div>
      ) : reports.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Reports</h3>
            <p className="text-gray-600">
              All reports have been completed! Great work by your maintenance teams.
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
                      {getStatusBadge(report)}
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
                        {formatDate(report.timestamp)}
                      </div>
                      {report.assignedTeam && (
                        <div className="flex items-center">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Assigned to {report.assignedTeam}
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
                        className="w-20 h-20 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(report)}
                    className="flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </Button>
                  
                  <div className="flex space-x-2">
                    {!report.assignedTeam && (
                      <Button
                        size="sm"
                        onClick={() => handleViewDetails(report)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Assign Team
                      </Button>
                    )}
                    
                    {report.assignedTeam && (
                      <Button
                        size="sm"
                        onClick={() => handleMarkComplete(report.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark Complete
                      </Button>
                    )}
                  </div>
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
            <DialogTitle>Report Details</DialogTitle>
            <DialogDescription>
              View and manage this community report
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
                  {getStatusBadge(selectedReport)}
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
                
                {selectedReport.assignedTeam && (
                  <div>
                    <h4 className="font-medium text-gray-900">Assigned Team</h4>
                    <p className="text-gray-600">{selectedReport.assignedTeam}</p>
                  </div>
                )}
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600">{selectedReport.description}</p>
              </div>
              
              {/* Team Assignment */}
              {!selectedReport.assignedTeam && (
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-medium text-gray-900">Assign to Team</h4>
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a maintenance team..." />
                        </SelectTrigger>
                        <SelectContent>
                          {teams.filter(t => t.isActive).map((team) => (
                            <SelectItem key={team.id} value={team.id}>
                              {team.name} - {team.specialty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      onClick={handleAssignTeam}
                      disabled={!selectedTeamId || isAssigning}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isAssigning ? 'Assigning...' : 'Assign Team'}
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Complete Action */}
              {selectedReport.assignedTeam && (
                <div className="pt-4 border-t">
                  <Button
                    onClick={() => handleMarkComplete(selectedReport.id)}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark as Completed
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
