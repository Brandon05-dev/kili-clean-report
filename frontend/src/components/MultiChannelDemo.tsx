import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, Phone, Smartphone, MapPin, Camera, Clock, CheckCircle, XCircle } from 'lucide-react';

const MultiChannelDemo = () => {
  const [formData, setFormData] = useState({
    location: '',
    description: '',
    priority: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [connectivity, setConnectivity] = useState(null);
  const [testingChannel, setTestingChannel] = useState('');

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const submitReport = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          coordinates: { lat: -1.2864, lng: 36.8172 }, // Sample Nairobi coordinates
          reportedBy: 'Demo User'
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testConnectivity = async () => {
    setTestingChannel('connectivity');
    try {
      const response = await fetch('/api/test-connectivity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setConnectivity(data);
    } catch (error) {
      setConnectivity({ success: false, error: error.message });
    } finally {
      setTestingChannel('');
    }
  };

  const testDailySummary = async () => {
    setTestingChannel('summary');
    try {
      const response = await fetch('/api/test-daily-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setTestingChannel('');
    }
  };

  const testAlert = async () => {
    setTestingChannel('alert');
    try {
      const response = await fetch('/api/test-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setTestingChannel('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3">
              <MessageSquare className="h-8 w-8" />
              <Phone className="h-8 w-8" />
              CleanKili Multi-Channel Alert System
            </CardTitle>
            <CardDescription className="text-green-100 text-lg">
              Real-time WhatsApp & SMS Alerts + AI-Powered Daily Summaries
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Report Submission Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Submit Environmental Report
              </CardTitle>
              <CardDescription>
                This will trigger immediate WhatsApp + SMS alerts to all admins
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Kenyatta Avenue, Nairobi"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the environmental issue..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="priority">Priority Level</Label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              
              <Button 
                onClick={submitReport} 
                disabled={loading || !formData.location || !formData.description}
                className="w-full"
              >
                {loading ? 'Sending Alerts...' : 'Submit Report & Send Alerts'}
              </Button>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>GPS: -1.2864, 36.8172 (Nairobi CBD)</span>
              </div>
            </CardContent>
          </Card>

          {/* Testing Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                System Testing
              </CardTitle>
              <CardDescription>
                Test connectivity and functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              {/* Connectivity Test */}
              <div>
                <Button 
                  onClick={testConnectivity}
                  disabled={testingChannel === 'connectivity'}
                  variant="outline"
                  className="w-full"
                >
                  {testingChannel === 'connectivity' ? 'Testing...' : 'Test WhatsApp & SMS Connectivity'}
                </Button>
                
                {connectivity && (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        WhatsApp
                      </span>
                      <Badge variant={connectivity.results?.whatsapp ? "default" : "destructive"}>
                        {connectivity.results?.whatsapp ? "Connected" : "Failed"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        SMS
                      </span>
                      <Badge variant={connectivity.results?.sms ? "default" : "destructive"}>
                        {connectivity.results?.sms ? "Connected" : "Failed"}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>

              <Separator />
              
              {/* Test Alert */}
              <Button 
                onClick={testAlert}
                disabled={testingChannel === 'alert'}
                variant="outline"
                className="w-full"
              >
                {testingChannel === 'alert' ? 'Sending...' : 'Send Test Alert'}
              </Button>
              
              <Separator />
              
              {/* Test Daily Summary */}
              <Button 
                onClick={testDailySummary}
                disabled={testingChannel === 'summary'}
                variant="outline"
                className="w-full"
              >
                {testingChannel === 'summary' ? 'Generating...' : 'Test Daily Summary'}
              </Button>
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Auto-scheduled: Daily at 11:59 PM</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Display */}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                Operation Result
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                <AlertDescription>
                  <pre className="whitespace-pre-wrap text-sm">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle>📱 Multi-Channel Alert System Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  WhatsApp Alerts (Primary)
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Rich formatting with emojis</li>
                  <li>• Photo attachments supported</li>
                  <li>• GPS coordinates with map links</li>
                  <li>• Short links for easy access</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  SMS Alerts (Fallback)
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Concise text format</li>
                  <li>• Works on any phone</li>
                  <li>• Short links for details</li>
                  <li>• Maximum reliability</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">🤖 AI Daily Summaries</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• OpenAI GPT-4 powered insights</li>
                  <li>• Issue categorization & trends</li>
                  <li>• Hotspot identification</li>
                  <li>• Actionable recommendations</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">🔗 Smart Features</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• TinyURL short link generation</li>
                  <li>• Automatic fallback system</li>
                  <li>• Delivery status tracking</li>
                  <li>• Multi-admin support</li>
                </ul>
              </div>
            </div>
            
            <Separator />
            
            <div className="text-center text-sm text-gray-600">
              <p>🔧 Configure your Twilio credentials in <code>.env</code> file to enable real notifications</p>
              <p>💰 Estimated cost: ~$3-10/month for full operation</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MultiChannelDemo;
