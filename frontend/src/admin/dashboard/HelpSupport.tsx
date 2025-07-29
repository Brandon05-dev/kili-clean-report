import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle, BookOpen, Mail, Phone, Download, ExternalLink, MessageSquare } from 'lucide-react';

const HelpSupport = () => {
  const quickGuides = [
    {
      title: 'Getting Started with CleanKili Admin',
      description: 'Learn the basics of navigating and using the admin dashboard',
      duration: '5 min read',
      type: 'guide'
    },
    {
      title: 'Managing Environmental Reports',
      description: 'Step-by-step guide to processing and updating report statuses',
      duration: '8 min read',
      type: 'guide'
    },
    {
      title: 'Team Assignment Best Practices',
      description: 'How to effectively assign tasks and manage cleanup teams',
      duration: '6 min read',
      type: 'guide'
    },
    {
      title: 'Understanding Analytics & Trends',
      description: 'Make data-driven decisions using the insights dashboard',
      duration: '10 min read',
      type: 'guide'
    }
  ];

  const faqs = [
    {
      question: 'How do I assign a report to a cleanup team?',
      answer: 'Go to the "Assign & Manage" tab, select an unassigned report, choose an available team, set a due date, and click "Assign Task".'
    },
    {
      question: 'What should I do if a report status is stuck?',
      answer: 'Check the "Status Updates" tab to add progress notes or contact the assigned team directly. You can also reassign the task if needed.'
    },
    {
      question: 'How can I export analytics data?',
      answer: 'In the "Trends & Insights" tab, use the export buttons to download data in CSV, PDF, or Excel format.'
    },
    {
      question: 'How do I add a new admin user?',
      answer: 'In the "Admin Actions" tab, click "Add New Admin", fill in their details, assign a role, and they\'ll receive an email invitation.'
    },
    {
      question: 'What permissions do different roles have?',
      answer: 'Super Admins have full access, Team Leads can manage teams and assignments, Field Coordinators can update statuses, and Data Analysts can view reports and analytics.'
    }
  ];

  const contactInfo = [
    {
      type: 'Email',
      value: 'support@cleankili.org',
      description: 'General support and inquiries',
      icon: Mail
    },
    {
      type: 'Emergency Hotline',
      value: '+254-700-CLEAN (25326)',
      description: 'Urgent environmental issues',
      icon: Phone
    },
    {
      type: 'Technical Support',
      value: 'tech@cleankili.org',
      description: 'System issues and bugs',
      icon: MessageSquare
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Help & Support</h2>
          <p className="text-gray-600 mt-1">Resources and assistance for CleanKili administrators</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-green-600 hover:bg-green-700">
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Manual
          </Button>
        </div>
      </div>

      {/* Quick Start Guide */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Quick Start Guide
          </CardTitle>
          <CardDescription>Essential resources to get you started</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickGuides.map((guide, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <h4 className="font-medium text-gray-900 mb-2">{guide.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{guide.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-blue-600">{guide.duration}</span>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Read Guide
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>Get in touch with our support team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactInfo.map((contact, index) => {
              const IconComponent = contact.icon;
              return (
                <div key={index} className="text-center p-4 border rounded-lg">
                  <div className="flex justify-center mb-3">
                    <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <IconComponent className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">{contact.type}</h4>
                  <p className="text-lg font-semibold text-green-600 mb-1">{contact.value}</p>
                  <p className="text-sm text-gray-600">{contact.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Frequently Asked Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>Common questions and their answers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                <h4 className="font-medium text-gray-900 mb-2">{faq.question}</h4>
                <p className="text-sm text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>Current status of CleanKili services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium">Main Dashboard</span>
              </div>
              <span className="text-sm text-green-600">Operational</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium">Report Processing</span>
              </div>
              <span className="text-sm text-green-600">Operational</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium">Analytics Engine</span>
              </div>
              <span className="text-sm text-green-600">Operational</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="font-medium">Email Notifications</span>
              </div>
              <span className="text-sm text-yellow-600">Maintenance</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources & Documentation */}
      <Card>
        <CardHeader>
          <CardTitle>Resources & Documentation</CardTitle>
          <CardDescription>Additional resources for CleanKili administrators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Download className="h-6 w-6" />
              <span>User Manual</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <BookOpen className="h-6 w-6" />
              <span>API Documentation</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <ExternalLink className="h-6 w-6" />
              <span>Video Tutorials</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <MessageSquare className="h-6 w-6" />
              <span>Community Forum</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Procedures */}
      <Card className="border-l-4 border-l-red-500">
        <CardHeader>
          <CardTitle className="text-red-700">Emergency Procedures</CardTitle>
          <CardDescription>What to do in case of urgent environmental issues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2">🚨 Immediate Health Hazards</h4>
              <p className="text-sm text-red-700 mb-2">
                Chemical spills, toxic fumes, or contaminated water sources
              </p>
              <p className="text-sm text-red-600 font-medium">
                Call Emergency Hotline: +254-700-25326 immediately
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Infrastructure Damage</h4>
              <p className="text-sm text-yellow-700 mb-2">
                Damaged waste facilities, major drainage blockages, or equipment failure
              </p>
              <p className="text-sm text-yellow-600 font-medium">
                Contact: tech@cleankili.org within 2 hours
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">ℹ️ System Issues</h4>
              <p className="text-sm text-blue-700 mb-2">
                Dashboard not loading, data not syncing, or login problems
              </p>
              <p className="text-sm text-blue-600 font-medium">
                Email: support@cleankili.org with error details
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <Card>
        <CardContent className="p-4 text-center">
          <p className="text-sm text-gray-600 mb-2">
            CleanKili Admin Dashboard v2.1.0 • Last updated: January 2024
          </p>
          <p className="text-xs text-gray-500">
            For technical issues, include your browser version and any error messages when contacting support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpSupport;
