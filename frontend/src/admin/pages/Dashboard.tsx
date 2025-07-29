
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReportsOverview from '@/components/dashboard/ReportsOverview';
import ReportsManagement from '@/components/dashboard/ReportsManagement';
import StatusUpdates from '@/components/dashboard/StatusUpdates';
import AssignManage from '@/components/dashboard/AssignManage';
import TrendsInsights from '@/components/dashboard/TrendsInsights';
import AdminActions from '@/components/dashboard/AdminActions';
import HelpSupport from '@/components/dashboard/HelpSupport';
import AdminLiveMap from '@/components/AdminLiveMap';
import { Shield, BarChart3, Users, FileText, Settings, HelpCircle, Download, UserPlus, CheckCircle, LogOut, Database, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('reports');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const tabs = [
    { id: 'reports', label: 'Reports Overview', icon: FileText, component: ReportsOverview },
    { id: 'livemap', label: 'Live Map Control', icon: MapPin, component: AdminLiveMap },
    { id: 'management', label: 'Reports Management', icon: Database, component: ReportsManagement },
    { id: 'status', label: 'Status Updates', icon: BarChart3, component: StatusUpdates },
    { id: 'assign', label: 'Assign & Manage', icon: Users, component: AssignManage },
    { id: 'trends', label: 'Trends & Insights', icon: BarChart3, component: TrendsInsights },
    { id: 'admin', label: 'Admin Actions', icon: Settings, component: AdminActions },
    { id: 'help', label: 'Help & Support', icon: HelpCircle, component: HelpSupport },
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || ReportsOverview;

  // Mock handlers for CTA buttons
  const handleViewReports = () => {
    setActiveTab('management');  // Changed to the new reports management tab
  };

  const handleAssignTask = () => {
    setActiveTab('assign');
  };

  const handleMarkResolved = () => {
    setActiveTab('status');
    alert('Navigate to Status Updates to mark reports as resolved');
  };

  const handleDownloadReport = () => {
    setActiveTab('trends');
    alert('Navigate to Trends & Insights to download analytics reports');
  };

  const handleAddNewAdmin = () => {
    setActiveTab('admin');
    alert('Navigate to Admin Actions to add new administrators');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* User Info and Logout */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-green-100">Logged in as</p>
              <p className="text-xl font-semibold">{user?.fullName}</p>
              <p className="text-green-200 text-sm">{user?.role} • {user?.email}</p>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="border-white text-white hover:bg-white hover:text-green-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-12 w-12 mr-3" />
              <h1 className="text-4xl font-bold">Admin Dashboard — CleanKili</h1>
            </div>
            <p className="text-xl mb-6 opacity-90">
              Welcome to your control center for a cleaner, safer Kilimani.
            </p>
            <p className="text-lg opacity-80 max-w-4xl mx-auto mb-8">
              This secure administrative interface allows authorized waste teams, County officers, 
              and community managers to efficiently manage environmental reports, coordinate cleanup 
              efforts, and track community impact across Kilimani. Every action taken here contributes 
              to a cleaner, healthier environment for our community.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                onClick={handleViewReports}
                size="lg"
                className="bg-white text-green-700 hover:bg-gray-100"
              >
                <FileText className="h-5 w-5 mr-2" />
                View Reports
              </Button>
              <Button 
                onClick={handleAssignTask}
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-700"
              >
                <Users className="h-5 w-5 mr-2" />
                Assign Task
              </Button>
              <Button 
                onClick={handleMarkResolved}
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-700"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Mark as Resolved
              </Button>
              <Button 
                onClick={handleDownloadReport}
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-700"
              >
                <Download className="h-5 w-5 mr-2" />
                Download Report
              </Button>
              <Button 
                onClick={handleAddNewAdmin}
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-green-700"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Add New Admin
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ActiveComponent />
      </main>

      {/* Footer Note */}
      <div className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-1 text-yellow-400 mb-4">
              <Shield className="h-5 w-5" />
              <span className="text-sm font-medium">SECURE ADMINISTRATIVE ACCESS</span>
            </div>
            <p className="text-sm text-gray-300 max-w-3xl mx-auto">
              ⚠️ This dashboard is for official use only. Unauthorized access is prohibited. 
              All activity is logged for security and accountability purposes. If you encounter 
              any technical issues, please contact support@cleankili.org immediately.
            </p>
            <div className="border-t border-gray-700 pt-6 mt-6">
              <p className="text-lg text-green-400 font-medium">
                💚 Together, we make Kilimani cleaner and healthier — every report resolved is a safer street for everyone.
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Thank you for your dedication to environmental stewardship and community service.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
