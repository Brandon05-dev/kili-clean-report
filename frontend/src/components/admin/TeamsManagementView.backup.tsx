import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Users, 
  Plus, 
  Trash2, 
  Settings, 
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import { adminDashboardService } from '@/services/adminDashboard';
import { MaintenanceTeam } from '@/types/admin';

interface TeamsManagementViewProps {
  onDataChange: () => void;
}

export const TeamsManagementView: React.FC<TeamsManagementViewProps> = ({ onDataChange }) => {
  const [teams, setTeams] = useState<MaintenanceTeam[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: '',
    specialty: ''
  });
  const [error, setError] = useState('');

  // Load data
  const loadData = () => {
    setTeams(adminDashboardService.getTeams());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddTeam = () => {
    if (!newTeam.name.trim() || !newTeam.specialty.trim()) {
      setError('Please fill in all fields');
      return;
    }

    const success = adminDashboardService.addTeam(newTeam.name.trim(), newTeam.specialty.trim());
    
    if (success) {
      loadData();
      onDataChange();
      setIsAddModalOpen(false);
      setNewTeam({ name: '', specialty: '' });
      setError('');
    } else {
      setError('A team with this name already exists');
    }
  };

  const handleDeleteTeam = (teamId: string, teamName: string) => {
    if (window.confirm(`Are you sure you want to delete "${teamName}"? This will unassign them from any current reports.`)) {
      const success = adminDashboardService.deleteTeam(teamId);
      if (success) {
        loadData();
        onDataChange();
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setNewTeam(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const getTeamColor = (index: number) => {
    const colors = [
      'bg-gradient-to-br from-emerald-50 to-green-50 text-emerald-800 border-emerald-200',
      'bg-gradient-to-br from-green-50 to-teal-50 text-green-800 border-green-200',
      'bg-gradient-to-br from-teal-50 to-cyan-50 text-teal-800 border-teal-200',
      'bg-gradient-to-br from-yellow-50 to-amber-50 text-yellow-800 border-yellow-200',
      'bg-pink-100 text-pink-800 border-pink-200',
      'bg-indigo-100 text-indigo-800 border-indigo-200',
    ];
    return colors[index % colors.length];
  };

  const getActiveTeamsCount = () => {
    return teams.filter(t => t.isActive).length;
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="text-center py-8 bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 rounded-xl border border-green-200">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 w-14 h-14 rounded-xl flex items-center justify-center shadow-lg">
            <Users className="w-7 h-7 text-white" />
          </div>
        </div>
        <div className="flex justify-between items-center max-w-4xl mx-auto px-6">
          <div className="text-left">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 via-green-700 to-teal-700 bg-clip-text text-transparent mb-2">
              Teams Management
            </h2>
            <p className="text-green-700 font-medium">
              Manage maintenance teams available for assignment
            </p>
          </div>
          
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Add New Team
              </Button>
            </DialogTrigger>
            <DialogContent className="border-0 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl text-green-800">Add New Maintenance Team</DialogTitle>
                <DialogDescription className="text-green-600">
                  Create a new team to handle community reports
                </DialogDescription>
              </DialogHeader>
            
            <div className="space-y-4 p-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}
              
              <div>
                <Label htmlFor="team-name">Team Name</Label>
                <Input
                  id="team-name"
                  value={newTeam.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Roads Crew, Sanitation Team"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="team-specialty">Specialty</Label>
                <Input
                  id="team-specialty"
                  value={newTeam.specialty}
                  onChange={(e) => handleInputChange('specialty', e.target.value)}
                  placeholder="e.g., Road maintenance and debris removal"
                  className="mt-1"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="border-gray-300"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddTeam}
                  className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
                >
                  Add Team
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="team-specialty">Specialty</Label>
                <Input
                  id="team-specialty"
                  value={newTeam.specialty}
                  onChange={(e) => handleInputChange('specialty', e.target.value)}
                  placeholder="e.g., Road maintenance and debris removal"
                  className="mt-1"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setNewTeam({ name: '', specialty: '' });
                    setError('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddTeam}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Add Team
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Teams</p>
                <p className="text-2xl font-bold text-gray-900">{teams.length}</p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Teams</p>
                <p className="text-2xl font-bold text-green-600">
                  {getActiveTeamsCount()}
                </p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Team Capacity</p>
                <p className="text-2xl font-bold text-purple-600">
                  {getActiveTeamsCount() > 0 ? 'Available' : 'None'}
                </p>
              </div>
              <div className="bg-purple-100 p-2 rounded-lg">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teams List */}
      {teams.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Teams Created Yet</h3>
            <p className="text-gray-600 mb-4">
              Create maintenance teams to assign to community reports.
            </p>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Team
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teams.map((team, index) => (
            <Card key={team.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                      <Badge className={getTeamColor(index)}>
                        <UserCheck className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{team.specialty}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Settings className="w-4 h-4 mr-1" />
                        Maintenance Team
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteTeam(team.id, team.name)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Team Status */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status</span>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Available for Assignment
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Team Management Tips */}
      {teams.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-green-600" />
              Team Management Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Team Assignment</h4>
                <ul className="space-y-1">
                  <li>• Teams appear in the assignment dropdown when managing active reports</li>
                  <li>• Match team specialties to report types for best results</li>
                  <li>• Teams can be assigned to multiple reports simultaneously</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Team Management</h4>
                <ul className="space-y-1">
                  <li>• Deleting a team will unassign them from current reports</li>
                  <li>• Create specialized teams for different types of issues</li>
                  <li>• Team names should be unique and descriptive</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
