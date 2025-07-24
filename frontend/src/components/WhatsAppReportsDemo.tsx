import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Camera, Send, Clock, Users, BarChart3 } from "lucide-react";

const BACKEND_URL = 'http://localhost:3000';

interface ReportData {
  location: string;
  description: string;
  photo?: File;
  coordinates?: { lat: number; lng: number };
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export const WhatsAppReportsDemo: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData>({
    location: '',
    description: '',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [stats, setStats] = useState<any>(null);

  // Get user's location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setReportData(prev => ({
            ...prev,
            coordinates: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }));
          setMessage({ type: 'success', text: 'Location captured successfully!' });
        },
        (error) => {
          setMessage({ type: 'error', text: 'Failed to get location. Please enable location services.' });
        }
      );
    } else {
      setMessage({ type: 'error', text: 'Geolocation is not supported by this browser.' });
    }
  };

  // Handle photo upload
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setMessage({ type: 'error', text: 'Photo must be less than 10MB' });
        return;
      }
      setReportData(prev => ({ ...prev, photo: file }));
      setMessage({ type: 'success', text: 'Photo selected successfully!' });
    }
  };

  // Submit report (triggers WhatsApp alert)
  const submitReport = async () => {
    if (!reportData.location || !reportData.description) {
      setMessage({ type: 'error', text: 'Please fill in location and description' });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('location', reportData.location);
      formData.append('description', reportData.description);
      formData.append('priority', reportData.priority);
      
      if (reportData.coordinates) {
        formData.append('coordinates', JSON.stringify(reportData.coordinates));
      }
      
      if (reportData.photo) {
        formData.append('photo', reportData.photo);
      }

      const response = await fetch(`${BACKEND_URL}/api/reports`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        setMessage({ 
          type: 'success', 
          text: '✅ Report submitted! WhatsApp alerts sent to admins.' 
        });
        
        // Reset form
        setReportData({
          location: '',
          description: '',
          priority: 'medium'
        });
        
        // Refresh stats
        fetchStats();
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Failed to submit report' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please check backend connection.' });
    } finally {
      setLoading(false);
    }
  };

  // Test daily summary
  const testDailySummary = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/test-daily-summary`, {
        method: 'POST'
      });

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: '📊 Daily summary generated and sent via WhatsApp!' 
        });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.error || 'Failed to send daily summary' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please check backend connection.' });
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/reports/stats/overview`);
      if (response.ok) {
        const result = await response.json();
        setStats(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  // Load stats on component mount
  React.useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-green-600">📱 CleanKili WhatsApp Alerts</h1>
        <p className="text-gray-600">Real-time environmental reporting with instant WhatsApp notifications</p>
      </div>

      {/* Alert Message */}
      {message && (
        <Alert className={message.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}>
          <AlertDescription className={message.type === 'success' ? 'text-green-700' : 'text-red-700'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Report Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Submit Environmental Report
            </CardTitle>
            <CardDescription>
              This will trigger immediate WhatsApp alerts to all admin numbers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="flex gap-2">
                <Input
                  id="location"
                  placeholder="e.g., Kenyatta Avenue, Nairobi"
                  value={reportData.location}
                  onChange={(e) => setReportData(prev => ({ ...prev, location: e.target.value }))}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon"
                  onClick={getCurrentLocation}
                  title="Get current location"
                >
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
              {reportData.coordinates && (
                <p className="text-sm text-green-600">
                  📍 GPS: {reportData.coordinates.lat.toFixed(4)}, {reportData.coordinates.lng.toFixed(4)}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the environmental issue..."
                value={reportData.description}
                onChange={(e) => setReportData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <select
                id="priority"
                className="w-full p-2 border rounded-md"
                value={reportData.priority}
                onChange={(e) => setReportData(prev => ({ ...prev, priority: e.target.value as any }))}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {/* Photo Upload */}
            <div className="space-y-2">
              <Label htmlFor="photo">Photo (Optional)</Label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  id="photo"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('photo')?.click()}
                  className="flex items-center gap-2"
                >
                  <Camera className="h-4 w-4" />
                  {reportData.photo ? 'Photo Selected' : 'Add Photo'}
                </Button>
                {reportData.photo && (
                  <span className="text-sm text-green-600">{reportData.photo.name}</span>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <Button 
              onClick={submitReport} 
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Submitting...' : '📱 Submit Report & Send WhatsApp Alert'}
            </Button>
          </CardContent>
        </Card>

        {/* Controls & Stats */}
        <div className="space-y-6">
          {/* Daily Summary Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Daily Summary
              </CardTitle>
              <CardDescription>
                Test the automated daily summary (normally runs at 11:59 PM)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={testDailySummary} 
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                {loading ? 'Generating...' : '📊 Send Daily Summary Now'}
              </Button>
            </CardContent>
          </Card>

          {/* Statistics */}
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="font-bold text-lg text-blue-600">{stats.total}</div>
                    <div className="text-blue-700">Total Reports</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="font-bold text-lg text-green-600">{stats.todayReports}</div>
                    <div className="text-green-700">Today</div>
                  </div>
                  <div className="text-center p-2 bg-yellow-50 rounded">
                    <div className="font-bold text-lg text-yellow-600">{stats.pending}</div>
                    <div className="text-yellow-700">Pending</div>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded">
                    <div className="font-bold text-lg text-purple-600">{stats.resolved}</div>
                    <div className="text-purple-700">Resolved</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Features Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                System Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="text-green-500">✅</span>
                <span>Real-time WhatsApp alerts to admins</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500">✅</span>
                <span>Daily AI-powered summaries at 11:59 PM</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500">✅</span>
                <span>GPS location tracking</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500">✅</span>
                <span>Photo attachments with reports</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500">✅</span>
                <span>Priority levels and smart categorization</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-500">✅</span>
                <span>Delivery status tracking</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <strong>1. Configure Environment:</strong> Copy <code>.env.example</code> to <code>.env</code> and add your API keys
          </div>
          <div>
            <strong>2. Twilio WhatsApp:</strong> Sign up at twilio.com and get WhatsApp API credentials
          </div>
          <div>
            <strong>3. Firebase:</strong> Create project at console.firebase.google.com and enable Firestore
          </div>
          <div>
            <strong>4. OpenAI (Optional):</strong> Get API key from platform.openai.com for AI insights
          </div>
          <div>
            <strong>5. Admin Numbers:</strong> Add admin phone numbers in format: +254700000000,+254700000001
          </div>
          <div className="text-gray-600">
            💡 The backend is running on localhost:3000. Make sure all services are properly configured for full functionality.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppReportsDemo;
