import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Users, UserPlus, Clock, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';

// Mock data for teams and assignments
const teams = [
  {
    id: 1,
    name: 'Clean Team Alpha',
    members: ['John Kamau', 'Mary Wanjiku', 'Peter Ochieng'],
    specialty: 'Waste Collection',
    status: 'available',
    currentAssignments: 2
  },
  {
    id: 2,
    name: 'Green Squad Beta',
    members: ['Sarah Njeri', 'David Mwangi'],
    specialty: 'Drainage Cleaning',
    status: 'busy',
    currentAssignments: 4
  },
  {
    id: 3,
    name: 'Eco Warriors',
    members: ['Grace Akinyi', 'James Kipkorir', 'Lucy Wambui'],
    specialty: 'General Cleanup',
    status: 'available',
    currentAssignments: 1
  }
];

const assignments = [
  {
    id: 1,
    reportId: 1,
    title: 'Illegal Dumping Cleanup',
    location: 'Kilimani, Near Yaya Centre',
    assignedTo: 'Clean Team Alpha',
    assignedBy: 'Admin User',
    dueDate: '2024-01-20',
    priority: 'high',
    status: 'assigned',
    estimatedDuration: '4 hours',
    assignedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    reportId: 2,
    title: 'Road Littering Cleanup',
    location: 'Kilimani, Argwings Kodhek Road',
    assignedTo: 'Green Squad Beta',
    assignedBy: 'Team Lead',
    dueDate: '2024-01-18',
    priority: 'medium',
    status: 'in-progress',
    estimatedDuration: '2 hours',
    assignedAt: '2024-01-14T14:20:00Z'
  },
  {
    id: 3,
    reportId: 5,
    title: 'E-waste Disposal',
    location: 'Kilimani, Denis Pritt Road',
    assignedTo: 'Eco Warriors',
    assignedBy: 'Admin User',
    dueDate: '2024-01-19',
    priority: 'medium',
    status: 'completed',
    estimatedDuration: '3 hours',
    assignedAt: '2024-01-11T11:20:00Z'
  }
];

const pendingReports = [
  {
    id: 4,
    type: 'Air Pollution',
    location: 'Kilimani, Hurlingham',
    description: 'Strong chemical smell from construction site',
    priority: 'high',
    reportedAt: '2024-01-12T16:45:00Z'
  },
  {
    id: 6,
    type: 'Blocked Drainage',
    location: 'Kilimani, Ring Road',
    description: 'Storm drain blocked with debris',
    priority: 'high',
    reportedAt: '2024-01-16T08:30:00Z'
  }
];

const AssignManage = () => {
  const [teamList, setTeamList] = useState(teams);
  const [assignmentList, setAssignmentList] = useState(assignments);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedReport, setSelectedReport] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [estimatedDuration, setEstimatedDuration] = useState('');

  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getTeamStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-red-100 text-red-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const assignTask = () => {
    if (selectedTeam && selectedReport && dueDate) {
      const newAssignment = {
        id: assignmentList.length + 1,
        reportId: parseInt(selectedReport),
        title: pendingReports.find(r => r.id === parseInt(selectedReport))?.type + ' Cleanup',
        location: pendingReports.find(r => r.id === parseInt(selectedReport))?.location,
        assignedTo: teamList.find(t => t.id === parseInt(selectedTeam))?.name,
        assignedBy: 'Admin User',
        dueDate: format(dueDate, 'yyyy-MM-dd'),
        priority: pendingReports.find(r => r.id === parseInt(selectedReport))?.priority,
        status: 'assigned',
        estimatedDuration: estimatedDuration || 'TBD',
        assignedAt: new Date().toISOString()
      };
      
      setAssignmentList([...assignmentList, newAssignment]);
      
      // Update team's current assignments count
      setTeamList(teamList.map(team => 
        team.id === parseInt(selectedTeam) 
          ? { ...team, currentAssignments: team.currentAssignments + 1 }
          : team
      ));
      
      // Reset form
      setSelectedTeam('');
      setSelectedReport('');
      setDueDate(null);
      setEstimatedDuration('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Assign & Manage Teams</h2>
          <p className="text-gray-600 mt-1">Coordinate cleanup teams and track assignments</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Assign Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign New Task</DialogTitle>
                <DialogDescription>
                  Assign a cleanup task to an available team
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Select Report</Label>
                  <Select value={selectedReport} onValueChange={setSelectedReport}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a pending report" />
                    </SelectTrigger>
                    <SelectContent>
                      {pendingReports.map(report => (
                        <SelectItem key={report.id} value={report.id.toString()}>
                          {report.type} - {report.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Select Team</Label>
                  <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a team" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamList.filter(team => team.status === 'available').map(team => (
                        <SelectItem key={team.id} value={team.id.toString()}>
                          {team.name} ({team.specialty}) - {team.currentAssignments} active
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={setDueDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Estimated Duration</Label>
                  <Input
                    placeholder="e.g., 2 hours, 1 day"
                    value={estimatedDuration}
                    onChange={(e) => setEstimatedDuration(e.target.value)}
                  />
                </div>

                <Button onClick={assignTask} className="w-full" disabled={!selectedTeam || !selectedReport || !dueDate}>
                  Assign Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Users className="h-4 w-4 mr-2" />
            Manage Teams
          </Button>
        </div>
      </div>

      {/* Teams Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {teamList.map((team) => (
          <Card key={team.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{team.name}</CardTitle>
                  <CardDescription>{team.specialty}</CardDescription>
                </div>
                <Badge className={getTeamStatusColor(team.status)}>
                  {team.status.charAt(0).toUpperCase() + team.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Team Members:</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {team.members.map((member, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {member}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Active Assignments:</span>
                  <span className="font-medium">{team.currentAssignments}</span>
                </div>
                <div className="pt-2">
                  <Button size="sm" variant="outline" className="w-full">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Current Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Current Assignments</CardTitle>
          <CardDescription>Track progress of assigned cleanup tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignmentList.map((assignment) => (
              <div key={assignment.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {assignment.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {assignment.assignedTo}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Due: {assignment.dueDate}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`flex items-center gap-1 text-sm ${getPriorityColor(assignment.priority)}`}>
                      <AlertTriangle className="h-4 w-4" />
                      {assignment.priority.charAt(0).toUpperCase() + assignment.priority.slice(1)}
                    </div>
                    <Badge className={getStatusColor(assignment.status)}>
                      {assignment.status.replace('-', ' ').split(' ').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="text-sm text-gray-600">
                    Estimated Duration: {assignment.estimatedDuration}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                    {assignment.status === 'assigned' && (
                      <Button size="sm" variant="outline">
                        Start Task
                      </Button>
                    )}
                    {assignment.status === 'in-progress' && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Unassigned Reports</CardTitle>
          <CardDescription>Reports waiting for team assignment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pendingReports.map((report) => (
              <div key={report.id} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{report.type}</h4>
                  <p className="text-sm text-gray-600">{report.location}</p>
                  <p className="text-xs text-gray-500 mt-1">{report.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`text-sm ${getPriorityColor(report.priority)}`}>
                    {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)} Priority
                  </div>
                  <Button size="sm" variant="outline">
                    Assign Team
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {assignmentList.filter(a => a.status === 'assigned').length}
            </div>
            <div className="text-sm text-gray-600">Tasks Assigned</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {assignmentList.filter(a => a.status === 'in-progress').length}
            </div>
            <div className="text-sm text-gray-600">In Progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {assignmentList.filter(a => a.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {teamList.filter(t => t.status === 'available').length}
            </div>
            <div className="text-sm text-gray-600">Teams Available</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AssignManage;
