import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Download, Calendar, MapPin, AlertTriangle, Clock } from 'lucide-react';

// Mock data for trends and insights
const monthlyReports = [
  { month: 'Sep', reports: 45, resolved: 38 },
  { month: 'Oct', reports: 52, resolved: 47 },
  { month: 'Nov', reports: 38, resolved: 35 },
  { month: 'Dec', reports: 41, resolved: 39 },
  { month: 'Jan', reports: 58, resolved: 42 }
];

const issueTypes = [
  { name: 'Illegal Dumping', value: 35, color: '#ef4444' },
  { name: 'Littering', value: 28, color: '#f97316' },
  { name: 'Blocked Drainage', value: 20, color: '#eab308' },
  { name: 'Air Pollution', value: 12, color: '#22c55e' },
  { name: 'Other', value: 5, color: '#6b7280' }
];

const hotspots = [
  { location: 'Yaya Centre Area', reports: 23, severity: 'high' },
  { location: 'Argwings Kodhek Road', reports: 18, severity: 'high' },
  { location: 'Wood Avenue', reports: 15, severity: 'medium' },
  { location: 'Denis Pritt Road', reports: 12, severity: 'medium' },
  { location: 'Hurlingham', reports: 8, severity: 'low' }
];

const resolutionTimes = [
  { timeRange: '0-24 hours', count: 25, percentage: 42 },
  { timeRange: '1-3 days', count: 20, percentage: 33 },
  { timeRange: '4-7 days', count: 10, percentage: 17 },
  { timeRange: '1-2 weeks', count: 4, percentage: 7 },
  { timeRange: '2+ weeks', count: 1, percentage: 1 }
];

const weeklyTrends = [
  { day: 'Mon', reports: 8, resolved: 6 },
  { day: 'Tue', reports: 12, resolved: 10 },
  { day: 'Wed', reports: 15, resolved: 12 },
  { day: 'Thu', reports: 11, resolved: 9 },
  { day: 'Fri', reports: 14, resolved: 11 },
  { day: 'Sat', reports: 18, resolved: 15 },
  { day: 'Sun', reports: 10, resolved: 8 }
];

const TrendsInsights = () => {
  const [timeRange, setTimeRange] = useState('last3months');
  const [reportType, setReportType] = useState('all');

  const downloadReport = (format) => {
    // Mock download functionality
    console.log(`Downloading report in ${format} format`);
    alert(`Report downloaded as ${format.toUpperCase()} file`);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Trends & Insights</h2>
          <p className="text-gray-600 mt-1">Analytics and patterns in environmental reporting</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last30days">Last 30 Days</SelectItem>
              <SelectItem value="last3months">Last 3 Months</SelectItem>
              <SelectItem value="last6months">Last 6 Months</SelectItem>
              <SelectItem value="lastyear">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">234</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% from last period
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
                <p className="text-2xl font-bold text-gray-900">87%</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5% from last period
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Resolution Time</p>
                <p className="text-2xl font-bold text-gray-900">2.3 days</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <Clock className="h-3 w-3 mr-1" />
                  -0.5 days improvement
                </p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Hotspots</p>
                <p className="text-2xl font-bold text-gray-900">8</p>
                <p className="text-xs text-red-600 flex items-center mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  2 new this week
                </p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <MapPin className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Reports Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Report Trends</CardTitle>
            <CardDescription>Reports received vs resolved over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyReports}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="reports" fill="#3b82f6" name="Reports Received" />
                <Bar dataKey="resolved" fill="#22c55e" name="Reports Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Issue Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Issue Types Distribution</CardTitle>
            <CardDescription>Breakdown of environmental issues reported</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={issueTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {issueTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity Pattern</CardTitle>
            <CardDescription>Report patterns throughout the week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="reports" stroke="#3b82f6" strokeWidth={2} name="Reports" />
                <Line type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2} name="Resolved" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Resolution Time Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Resolution Time Analysis</CardTitle>
            <CardDescription>How quickly issues are resolved</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resolutionTimes.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-blue-500 rounded" style={{ 
                      backgroundColor: `hsl(${220 - index * 20}, 70%, ${60 + index * 5}%)` 
                    }}></div>
                    <span className="text-sm font-medium">{item.timeRange}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{item.count} reports</span>
                    <span className="text-sm font-medium">{item.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hotspots Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Environmental Hotspots</CardTitle>
          <CardDescription>Areas with the highest concentration of reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hotspots.map((hotspot, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{hotspot.location}</h4>
                    <p className="text-sm text-gray-600">{hotspot.reports} reports in last 3 months</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(hotspot.severity)}`}>
                    {hotspot.severity.charAt(0).toUpperCase() + hotspot.severity.slice(1)} Risk
                  </span>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Download Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Analytics Reports</CardTitle>
          <CardDescription>Download detailed analytics in various formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={() => downloadReport('csv')}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Download CSV</span>
            </Button>
            <Button 
              onClick={() => downloadReport('pdf')}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Download PDF Report</span>
            </Button>
            <Button 
              onClick={() => downloadReport('excel')}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Download Excel</span>
            </Button>
            <Button 
              onClick={() => downloadReport('summary')}
              className="bg-green-600 hover:bg-green-700 flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Generate Summary Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrendsInsights;
