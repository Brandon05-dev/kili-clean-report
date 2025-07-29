import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { CheckCircle, Clock, Upload, MessageSquare, Camera, FileText } from 'lucide-react';

// Mock data for active reports
const activeReports = [
  {
    id: 1,
    type: 'Illegal Dumping',
    location: 'Kilimani, Near Yaya Centre',
    description: 'Large pile of construction waste dumped behind shopping center',
    status: 'pending',
    priority: 'high',
    reportedBy: 'John Mwangi',
    reportedAt: '2024-01-15T10:30:00Z',
    notes: [],
    assignedTo: null,
    images: ['before1.jpg']
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
    notes: [
      { date: '2024-01-14', author: 'Clean Team Alpha', message: 'Started cleanup operation at 2:00 PM' }
    ],
    assignedTo: 'Clean Team Alpha',
    images: ['before2.jpg']
  }
];

const StatusUpdates = () => {
  const [reports, setReports] = useState(activeReports);
  const [selectedReport, setSelectedReport] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const updateReportStatus = (reportId, status, note = '') => {
    setReports(reports.map(report => {
      if (report.id === reportId) {
        const updatedNotes = note ? [
          ...report.notes,
          {
            date: new Date().toISOString().split('T')[0],
            author: 'Admin User',
            message: note
          }
        ] : report.notes;
        
        return {
          ...report,
          status,
          notes: updatedNotes
        };
      }
      return report;
    }));
  };

  const addNote = (reportId, note) => {
    setReports(reports.map(report => {
      if (report.id === reportId) {
        return {
          ...report,
          notes: [
            ...report.notes,
            {
              date: new Date().toISOString().split('T')[0],
              author: 'Admin User',
              message: note
            }
          ]
        };
      }
      return report;
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-red-100 text-red-800 border-red-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleQuickUpdate = (reportId, status) => {
    const statusMessages = {
      'in-progress': 'Cleanup operation has been initiated.',
      'resolved': 'Issue has been successfully resolved and area cleaned.',
      'pending': 'Report status reset to pending for review.'
    };
    
    updateReportStatus(reportId, status, statusMessages[status]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Status Updates</h2>
          <p className="text-gray-600 mt-1">Update report status and add progress notes</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <MessageSquare className="h-4 w-4 mr-2" />
            Bulk Update
          </Button>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Export Updates
          </Button>
        </div>
      </div>

      {/* Active Reports for Status Updates */}
      <div className="grid gap-6">
        {reports.map((report) => (
          <Card key={report.id} className="border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{report.type}</CardTitle>
                  <CardDescription className="mt-1">
                    📍 {report.location} • Reported by {report.reportedBy}
                  </CardDescription>
                  <p className="text-sm text-gray-600 mt-2">{report.description}</p>
                </div>
                <Badge className={getStatusColor(report.status)}>
                  {report.status.replace('-', ' ').split(' ').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* Current Assignment */}
              {report.assignedTo && (
                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                  <p className="text-sm font-medium text-blue-900">
                    👥 Assigned to: {report.assignedTo}
                  </p>
                </div>
              )}

              {/* Progress Notes */}
              {report.notes.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Progress Notes:</h4>
                  <div className="space-y-2">
                    {report.notes.map((note, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-start">
                          <p className="text-sm text-gray-700">{note.message}</p>
                          <div className="text-xs text-gray-500 ml-2">
                            {note.author} • {note.date}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickUpdate(report.id, 'in-progress')}
                  disabled={report.status === 'in-progress'}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <Clock className="h-4 w-4 mr-1" />
                  Mark In Progress
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleQuickUpdate(report.id, 'resolved')}
                  disabled={report.status === 'resolved'}
                  className="text-green-600 hover:text-green-700"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Mark Resolved
                </Button>
                
                {/* Detailed Update Modal */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Add Update
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Update Report Status</DialogTitle>
                      <DialogDescription>
                        Add notes and update the status of this environmental report.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="status">New Status</Label>
                        <Select value={newStatus} onValueChange={setNewStatus}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select new status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="note">Progress Note</Label>
                        <Textarea
                          id="note"
                          placeholder="Add details about the progress or resolution..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label>Upload Photos (Before/After)</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG up to 10MB each
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={() => {
                            if (newStatus) {
                              updateReportStatus(report.id, newStatus, newNote);
                              setNewNote('');
                              setNewStatus('');
                            } else if (newNote) {
                              addNote(report.id, newNote);
                              setNewNote('');
                            }
                          }}
                          className="flex-1"
                        >
                          Update Report
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Image Upload Section */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Upload className="h-4 w-4" />
                  <span>Upload before/after photos to document progress</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Update Summary</CardTitle>
          <CardDescription>Recent status update activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {reports.filter(r => r.status === 'in-progress').length}
              </div>
              <div className="text-sm text-blue-700">Currently In Progress</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {reports.filter(r => r.status === 'resolved').length}
              </div>
              <div className="text-sm text-green-700">Resolved Today</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {reports.reduce((acc, r) => acc + r.notes.length, 0)}
              </div>
              <div className="text-sm text-yellow-700">Total Updates Added</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatusUpdates;
