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
      'bg-gradient-to-br from-slate-50 to-gray-50 text-slate-800 border-slate-200',
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">Total Teams</p>
                <p className="text-3xl font-bold text-emerald-800">{teams.length}</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-100 to-green-100 p-3 rounded-xl shadow-md">
                <Users className="h-7 w-7 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-teal-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-green-700 uppercase tracking-wide">Active Teams</p>
                <p className="text-3xl font-bold text-green-800">{getActiveTeamsCount()}</p>
              </div>
              <div className="bg-gradient-to-br from-green-100 to-teal-100 p-3 rounded-xl shadow-md">
                <UserCheck className="h-7 w-7 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-cyan-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-teal-700 uppercase tracking-wide">Specializations</p>
                <p className="text-3xl font-bold text-teal-800">{new Set(teams.map(t => t.specialty)).size}</p>
              </div>
              <div className="bg-gradient-to-br from-teal-100 to-cyan-100 p-3 rounded-xl shadow-md">
                <Settings className="h-7 w-7 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Teams Grid */}
      {teams.length === 0 ? (
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-green-600 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Teams Added Yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first maintenance team to start managing community reports efficiently.
            </p>
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Team
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team, index) => (
            <Card 
              key={team.id} 
              className={`border-0 shadow-lg transition-all duration-200 hover:shadow-xl transform hover:scale-105 ${getTeamColor(index)}`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold">{team.name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      className={`${team.isActive 
                        ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-white' 
                        : 'bg-gradient-to-r from-gray-400 to-slate-400 text-white'
                      } border-0 shadow-sm`}
                    >
                      {team.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTeam(team.id, team.name)}
                      className="p-1 h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium opacity-80">Specialty</p>
                    <p className="text-sm font-semibold">{team.specialty}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium opacity-80">Team ID</p>
                    <p className="text-xs font-mono font-semibold bg-white/50 px-2 py-1 rounded">{team.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium opacity-80">Created</p>
                    <p className="text-xs font-semibold">
                      {new Date(team.dateCreated).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tips Section */}
      {teams.length > 0 && (
        <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center text-xl">
              <AlertTriangle className="w-6 h-6 mr-3" />
              Team Management Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-700">
              <div>
                <h4 className="font-bold text-gray-900 mb-4 text-lg">Team Assignment</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Teams appear in the assignment dropdown when managing active reports
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Match team specialties to report types for best results
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Teams can be assigned to multiple reports simultaneously
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-gray-900 mb-4 text-lg">Team Management</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Deleting a team will unassign them from current reports
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Create specialized teams for different types of issues
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    Team names should be unique and descriptive
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
