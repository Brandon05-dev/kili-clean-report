import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Users, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { DashboardStats } from '@/types/admin';

interface DashboardOverviewProps {
  stats: DashboardStats;
  onNavigate: (view: 'overview' | 'active' | 'completed' | 'teams') => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ stats, onNavigate }) => {
  const statCards = [
    {
      title: 'New / Unassigned Reports',
      value: stats.newReports,
      icon: AlertTriangle,
      color: 'yellow',
      description: 'Reports waiting for assignment',
      action: () => onNavigate('active'),
    },
    {
      title: 'Total Active Reports',
      value: stats.totalActiveReports,
      icon: FileText,
      color: 'blue',
      description: 'Reports currently being worked on',
      action: () => onNavigate('active'),
    },
    {
      title: 'Available Teams',
      value: stats.availableTeams,
      icon: Users,
      color: 'green',
      description: 'Maintenance teams ready for work',
      action: () => onNavigate('teams'),
    },
    {
      title: 'Completed Today',
      value: stats.completedToday,
      icon: CheckCircle,
      color: 'purple',
      description: 'Reports resolved today',
      action: () => onNavigate('completed'),
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'yellow':
        return {
          bg: 'bg-gradient-to-br from-yellow-50 to-amber-50',
          text: 'text-yellow-700',
          border: 'border-yellow-300',
          iconBg: 'bg-gradient-to-br from-yellow-100 to-amber-100',
          accent: 'from-yellow-400 to-amber-400',
        };
      case 'blue':
        return {
          bg: 'bg-gradient-to-br from-emerald-50 to-green-50',
          text: 'text-emerald-700',
          border: 'border-emerald-300',
          iconBg: 'bg-gradient-to-br from-emerald-100 to-green-100',
          accent: 'from-emerald-500 to-green-500',
        };
      case 'green':
        return {
          bg: 'bg-gradient-to-br from-green-50 to-teal-50',
          text: 'text-green-700',
          border: 'border-green-300',
          iconBg: 'bg-gradient-to-br from-green-100 to-teal-100',
          accent: 'from-green-500 to-teal-500',
        };
      case 'purple':
        return {
          bg: 'bg-gradient-to-br from-teal-50 to-cyan-50',
          text: 'text-teal-700',
          border: 'border-teal-300',
          iconBg: 'bg-gradient-to-br from-teal-100 to-cyan-100',
          accent: 'from-teal-500 to-cyan-500',
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-gray-50 to-slate-50',
          text: 'text-gray-700',
          border: 'border-gray-300',
          iconBg: 'bg-gradient-to-br from-gray-100 to-slate-100',
          accent: 'from-gray-500 to-slate-500',
        };
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Welcome Header */}
      <div className="text-center py-12 bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 rounded-2xl border border-green-200">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg relative">
            <BarChart3 className="w-8 h-8 text-white" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-amber-400 rounded-full animate-pulse"></div>
          </div>
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 via-green-700 to-teal-700 bg-clip-text text-transparent mb-3">
          Welcome to Your Command Center
        </h2>
        <p className="text-lg text-green-700 max-w-3xl mx-auto font-medium">
          Manage community reports, assign maintenance teams, and track progress all from this central dashboard.
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {statCards.map((stat, index) => {
          const colors = getColorClasses(stat.color);
          
          return (
            <Card 
              key={index} 
              className={`${colors.border} border-l-4 hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 bg-white/90 backdrop-blur-sm`}
              onClick={stat.action}
            >
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{stat.title}</h3>
                      <div className={`${colors.iconBg} p-3 rounded-xl shadow-md`}>
                        <stat.icon className={`w-6 h-6 ${colors.text}`} />
                      </div>
                    </div>
                    
                    <div className="flex items-baseline space-x-3 mb-3">
                      <span className={`text-4xl font-bold ${colors.text}`}>
                        {stat.value}
                      </span>
                      {stat.value > 0 && (
                        <Badge className={`bg-gradient-to-r ${colors.accent} text-white border-0 shadow-sm`}>
                          Active
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4 font-medium">{stat.description}</p>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`p-0 h-auto ${colors.text} hover:${colors.bg} font-semibold transition-all duration-200`}
                      onClick={(e) => {
                        e.stopPropagation();
                        stat.action();
                      }}
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white rounded-t-lg">
          <CardTitle className="flex items-center text-xl">
            <TrendingUp className="w-6 h-6 mr-3" />
            Quick Actions
          </CardTitle>
          <CardDescription className="text-green-100">Common tasks and workflows</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center space-y-3 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200 group"
              onClick={() => onNavigate('active')}
            >
              <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                <FileText className="w-7 h-7 text-emerald-600" />
              </div>
              <span className="text-sm font-semibold text-emerald-700">Manage Active Reports</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center space-y-3 border-green-200 hover:bg-green-50 hover:border-green-300 transition-all duration-200 group"
              onClick={() => onNavigate('teams')}
            >
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <Users className="w-7 h-7 text-green-600" />
              </div>
              <span className="text-sm font-semibold text-green-700">Manage Teams</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center space-y-3 border-teal-200 hover:bg-teal-50 hover:border-teal-300 transition-all duration-200 group"
              onClick={() => onNavigate('completed')}
            >
              <div className="p-2 bg-teal-100 rounded-lg group-hover:bg-teal-200 transition-colors">
                <CheckCircle className="w-7 h-7 text-teal-600" />
              </div>
              <span className="text-sm font-semibold text-teal-700">View Completed</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
          <CardTitle className="text-xl">System Status</CardTitle>
          <CardDescription className="text-green-100">Current platform health and activity</CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-gray-900 mb-6 text-lg">Workflow Status</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200">
                  <span className="text-sm font-medium text-yellow-800">Reports Pending Assignment</span>
                  <Badge className={`${stats.newReports > 0 ? 
                    "bg-gradient-to-r from-red-400 to-orange-400 text-white" : 
                    "bg-gradient-to-r from-green-400 to-emerald-400 text-white"
                  } shadow-sm`}>
                    {stats.newReports > 0 ? `${stats.newReports} Waiting` : 'All Assigned'}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-4 rounded-lg bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200">
                  <span className="text-sm font-medium text-emerald-800">Team Capacity</span>
                  <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-sm">
                    {stats.availableTeams} Teams Active
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-4 rounded-lg bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200">
                  <span className="text-sm font-medium text-teal-800">Today's Progress</span>
                  <Badge className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-sm">
                    {stats.completedToday} Completed
                  </Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-6 text-lg">Next Steps</h4>
              <div className="space-y-3 text-sm text-gray-700">
                {stats.newReports > 0 ? (
                  <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                    <p className="font-medium text-yellow-800">• Assign {stats.newReports} unassigned report{stats.newReports > 1 ? 's' : ''} to available teams</p>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                    <p className="font-medium text-green-800">• All reports have been assigned to teams</p>
                  </div>
                )}
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                  <p className="font-medium text-emerald-800">• Monitor progress of {stats.totalActiveReports} active report{stats.totalActiveReports !== 1 ? 's' : ''}</p>
                </div>
                <div className="p-3 rounded-lg bg-teal-50 border border-teal-200">
                  <p className="font-medium text-teal-800">• Review completed work and archive resolved reports</p>
                </div>
                {stats.availableTeams === 0 && (
                  <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                    <p className="font-medium text-yellow-800">• Add maintenance teams to handle incoming reports</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
