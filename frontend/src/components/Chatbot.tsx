import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Sparkles, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatbotProps {
  isAdmin?: boolean;
}

const PUBLIC_RESPONSES = {
  greeting: [
    "Habari! I'm Kili AI, your smart assistant for Clean Kili. Karibu! How can I help keep our beautiful Kilimani clean today?",
    "Hujambo! Welcome to Clean Kili. I'm Kili AI, and I'm here to help you navigate our environmental reporting system. What would you like to know?",
    "Mambo! I'm Kili AI, your friendly neighborhood assistant for all things Clean Kili. Ready to make our community shine?",
    "Jambo! Welcome to Clean Kili! I'm Kili AI, here to help with any questions about keeping our environment clean and green. How can I assist you?",
    "Sawa sawa! I'm Kili AI, your AI companion for Clean Kili. Let's work together to keep our beautiful community spotless!"
  ],
  howToReport: [
    "Reporting is as easy as ordering mandazi! Use our online form, send us a WhatsApp message, or use our multi-channel system. Just describe the issue, add the location, and we'll sort it out haraka!",
    "Sawa! Fill out our simple report form with details about the issue, add a photo if you can, and tell us the exact location. Our team will handle the rest faster than matatu traffic!",
    "You can submit reports through multiple channels - our website, WhatsApp, or mobile app. All methods are user-friendly, just like ordering food from your favorite kibanda!",
    "Easy peasy! Click 'Report Issue', describe what you've seen, add your location (be specific like 'opposite Yaya Centre'), and optionally attach a photo. Tuko ready!"
  ],
  trackReport: [
    "Track your report on our 'All Reports' page - each gets a unique ID like your M-Pesa transaction! You'll see if it's active or completed, real-time updates included.",
    "Check your report status anytime by visiting our reports page. You'll see live updates on all community reports, transparent like our Kenyan sunshine!",
    "Your report gets tracked properly - visit the 'All Reports' section to see progress updates. We keep things transparent, just how we like it!",
    "Each report has its own tracking ID for easy follow-up. Check our reports dashboard for real-time updates - no need to call or text!"
  ],
  emergencyContact: [
    "For emergencies, call the authorities immediately - safety first, always! For non-urgent environmental issues, use our system and we'll respond within 24 hours, guaranteed.",
    "Emergency situations need emergency services first - dial the right numbers! For environmental concerns that aren't urgent, we'll sort you out within one working day.",
    "Life-threatening situations require immediate response from authorities. For other environmental issues, our reporting system ensures quick community action - tuko pamoja!",
    "Always contact emergency services for urgent situations. For environmental concerns, our team responds during business hours - we're committed to our community!"
  ],
  aboutService: [
    "Clean Kili connects our community members with maintenance teams to keep Kilimani and surrounding areas clean and safe. It's about ubuntu - working together!",
    "We help coordinate community cleanup efforts so residents can report issues and track solutions. Teamwork makes the dream work, especially in our neighborhood!",
    "Our platform bridges the gap between residents and maintenance teams, ensuring environmental issues get sorted quickly and efficiently - just how we do things here!",
    "Clean Kili empowers our community to be environmental champions. Report problems, see real results, keep our beautiful area pristine - pamoja tunaweza!"
  ],
  contact: [
    "Reach us through our contact page, WhatsApp, or submit a report directly. We're here 24/7 to help keep our community fresh and clean!",
    "Contact us anytime via our website, WhatsApp, or direct messaging. Our team responds faster than a boda boda in traffic!",
    "Multiple ways to reach us: website contact form, WhatsApp, or direct report submission. Choose what works best for you - tupo hapa!",
    "Get in touch via our contact page for general inquiries, or WhatsApp for quick questions. We're always ready to help our community!"
  ],
  features: [
    "Our platform offers instant reporting, photo uploads, GPS location tracking, status updates, and community-wide visibility - all the tech you need, made simple!",
    "Key features: quick report submission, precise location tagging, photo evidence upload, progress tracking, and team assignment visibility - tech that works for everyone!",
    "Submit reports with photos, track progress, see community issues on our interactive map, get notifications - everything you need in one place!"
  ],
  teamInfo: [
    "Our maintenance teams are local experts specializing in waste management, infrastructure repair, landscaping, and emergency response - they know our area inside out!",
    "We work with dedicated local crews trained in environmental cleanup, waste disposal, and community infrastructure maintenance - real professionals who care!",
    "Professional teams handle different issue types - from litter cleanup to infrastructure repairs, ensuring the right skills for each job. Quality service, guaranteed!"
  ],
  privacy: [
    "Your personal information is protected like your mobile money PIN! We only collect necessary details for report processing and community safety.",
    "We respect your privacy completely - location data is used only for issue resolution, and personal details stay secure and confidential.",
    "Reports can be submitted anonymously if you prefer, though contact info helps us provide updates. Your choice, your privacy!"
  ],
  default: [
    "I'm here to help with all Clean Kili questions! Ask me about reporting issues, tracking reports, or how our system works - let's keep our community clean!",
    "Need help with our reporting system, community initiatives, or getting involved? I've got all the answers you need!",
    "Feel free to ask about submitting reports, checking status, or learning about Clean Kili's mission. I'm your go-to AI assistant!",
    "I can help with reporting procedures, system features, contact info, or general questions about keeping our beautiful community spotless!",
    "Not sure what to ask? Try asking about reporting an issue, tracking a report, contacting our team, or learning about our features!"
  ],
  fallback: [
    "Eh! That's an interesting question, but let me help you with Clean Kili topics instead. I can assist with reporting issues, tracking reports, or learning about our features. What interests you?",
    "Sawa! While I focus on Clean Kili matters, I can definitely help with environmental reporting, community cleanup, or platform features. What would you like to know?",
    "Pole! I might not have that exact info, but I'm excellent at helping with Clean Kili questions! Ask me about reporting, tracking, or our community features.",
    "That's outside my specialty, but I'm your expert for all things Clean Kili! Try asking about report submission, status tracking, or general platform questions.",
    "Haya! Let's focus on what I do best - helping with Clean Kili! Ask me about reporting issues, community features, or how to get involved in keeping our area clean."
  ]
};

const ADMIN_RESPONSES = {
  greeting: [
    "Mambo Admin! I'm Kili AI, ready to help you manage the Clean Kili dashboard efficiently. What administrative task can I assist with today?",
    "Habari Admin! I'm here to help you navigate all admin features smoothly. How can I make your work easier today?",
    "Sawa Admin! Welcome to your dashboard. I'm Kili AI, your intelligent assistant for managing reports and coordinating teams. What do you need help with?",
    "Jambo Admin! Access confirmed. I'm Kili AI and I can guide you through report management, team coordination, or system analytics. Ready to get things done?",
    "Hujambo Admin! I'm Kili AI, here to help you manage the Clean Kili system like a pro. What would you like to tackle first?"
  ],
  manageReports: [
    "Use the Active Reports tab to view pending issues - it's all organized nicely! You can assign teams, update status, or mark reports as completed. Simple and effective!",
    "The Active Reports section shows all pending reports where you can assign maintenance teams and track progress. Use filters to find specific issues quickly - very organized!",
    "Report management is centralized in your dashboard - click any active report to assign teams, add notes, update status, or mark as resolved. Everything at your fingertips!",
    "Access the Active Reports panel to see all pending issues. Sort by priority, location, or type to manage your workflow efficiently - works like a charm!"
  ],
  assignTeams: [
    "Team assignment is straightforward! Go to Active Reports, click on a report, then select the best team from the dropdown. Match specialties to issue types for optimal results.",
    "Easy process: open any active report and choose from available maintenance teams. Each team has specialties listed - match them properly for best outcomes!",
    "Select a report from Active Reports, then use the team dropdown to assign the most suitable crew based on their expertise. Smart matching leads to better results!",
    "Click on any report and choose from available teams in the assignment dropdown. Consider team specialties and current workload for efficient assignment."
  ],
  viewStats: [
    "Your Dashboard Overview displays key metrics: new reports, active reports, available teams, and today's completed reports. Quick snapshot of daily activity - very useful!",
    "The dashboard shows real-time statistics including report counts, team availability, and completion rates. Perfect for monitoring overall system performance!",
    "Key metrics are prominently displayed: daily report volume, team utilization, completion rates, and response times. Great for performance monitoring!",
    "Monitor system health through the statistics panel showing report trends, team efficiency, and community engagement. Data-driven management at its best!"
  ],
  manageTeams: [
    "Teams Management section lets you add new teams, update information, activate/deactivate teams, and manage specialties. Full control over your workforce!",
    "Team management gives you complete control - add teams, modify details, set availability, and track active status. Everything you need in one place!",
    "Access Teams Management to add new crews, update contact information, set specialties, and control team availability for assignments. Comprehensive management!",
    "Manage your workforce effectively: add teams, update skills, set availability, and track performance metrics. Professional team coordination made easy!"
  ],
  reportFilters: [
    "Filter options help you sort reports by type, location, status, or assigned team. Makes finding specific reports much easier and faster!",
    "Filtering helps organize your workflow perfectly - sort by status to see what needs attention, or filter by location to focus on specific areas.",
    "Apply filters to view reports by category, urgency, location, or team assignment. Streamlines your management workflow significantly!",
    "Customize your view with filters: sort by date, priority, location, or team to focus on what needs immediate attention. Very efficient!"
  ],
  completedReports: [
    "Completed Reports section shows all resolved issues with completion dates and assigned teams. Perfect for tracking team performance and resolution times!",
    "Review completed reports to monitor response times, team efficiency, and community impact. Valuable data for improving service delivery!",
    "Analyze completed reports for performance insights: average resolution time, team efficiency, and community satisfaction metrics. Data-driven improvement!",
    "Use the Completed Reports archive to generate performance reports, track trends, and identify areas for process improvement. Strategic management tool!"
  ],
  analytics: [
    "Access detailed analytics to track report trends, team performance, response times, and community engagement patterns. Comprehensive insights for better decisions!",
    "Analytics dashboard provides insights into peak reporting times, common issue types, and resolution efficiency. Perfect for strategic planning!",
    "Review performance metrics including average response time, completion rates, team utilization, and community satisfaction scores. Professional analytics!"
  ],
  notifications: [
    "Set up notifications for new reports, team assignments, or urgent issues to stay informed about critical activities. Never miss important updates!",
    "Configure alert preferences to receive updates about high-priority reports, team status changes, or system issues. Stay in the loop always!",
    "Customize notification settings to get real-time updates on reports needing immediate attention or escalation. Smart notification management!"
  ],
  default: [
    "I can help with admin tasks like managing reports, assigning teams, viewing statistics, or navigating the dashboard. What would you like assistance with?",
    "As your admin assistant, I can guide you through report management, team assignments, dashboard features, or system navigation. How can I help?",
    "I'm here for all admin functions: report handling, team management, statistics review, and dashboard navigation. What interests you most?",
    "Available admin functions: report management, team coordination, analytics review, system settings, and performance monitoring. What can I assist with?",
    "Admin support for: dashboard navigation, report processing, team management, data analysis, and system optimization. Ready to help!"
  ],
  fallback: [
    "Sawa! I focus on Clean Kili admin functions. I can help with report management, team coordination, dashboard navigation, or system analytics. What would you like to explore?",
    "That's outside my admin expertise, but I can assist with managing reports, coordinating teams, reviewing statistics, or optimizing workflows. What interests you?",
    "I specialize in admin tasks for Clean Kili. Ask me about report management, team assignments, dashboard features, or performance analytics!",
    "My expertise covers admin functions like report processing, team management, system analytics, and dashboard navigation. How can I help?",
    "I'm designed to help with Clean Kili administration. Ask me about managing reports, teams, statistics, or any dashboard features you'd like to explore!"
  ]
};

// Suggested questions for users
const PUBLIC_SUGGESTIONS = [
  "How do I report an issue?",
  "How can I track my report?",
  "What contact options are available?",
  "What features does Clean Kili offer?",
  "How do maintenance teams work?",
  "Is my information private?"
];

const ADMIN_SUGGESTIONS = [
  "How do I manage reports?",
  "How do I assign teams?",
  "Where can I view statistics?",
  "How do I manage teams?",
  "How do I filter reports?",
  "How do I view completed reports?",
  "Where are the analytics?",
  "How do I set notifications?"
];

export const Chatbot: React.FC<ChatbotProps> = ({ isAdmin = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const responses = isAdmin ? ADMIN_RESPONSES : PUBLIC_RESPONSES;
  const suggestions = isAdmin ? ADMIN_SUGGESTIONS : PUBLIC_SUGGESTIONS;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addBotMessage = useCallback((text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isBot: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    setIsTyping(false);
  }, []);

  const addUserMessage = (text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting when chatbot is first opened
      const greetingMessages = responses.greeting;
      const randomGreeting = greetingMessages[Math.floor(Math.random() * greetingMessages.length)];
      
      setTimeout(() => {
        addBotMessage(randomGreeting);
        // Show suggestions after greeting
        setTimeout(() => {
          setShowSuggestions(true);
        }, 1000);
      }, 500);
    }
  }, [isOpen, messages.length, responses.greeting, addBotMessage]);

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Check for specific keywords and return appropriate responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('greeting')) {
      return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
    }
    
    if (isAdmin) {
      // Admin-specific responses with fallback to default
      const adminResponses = responses as typeof ADMIN_RESPONSES;
      
      if ((message.includes('report') && (message.includes('manage') || message.includes('view'))) || 
          message.includes('manage reports')) {
        return adminResponses.manageReports[Math.floor(Math.random() * adminResponses.manageReports.length)];
      }
      if ((message.includes('team') && message.includes('assign')) || 
          message.includes('assign teams') || message.includes('assignment')) {
        return adminResponses.assignTeams[Math.floor(Math.random() * adminResponses.assignTeams.length)];
      }
      if (message.includes('stat') || message.includes('dashboard') || 
          message.includes('overview') || message.includes('metrics')) {
        return adminResponses.viewStats[Math.floor(Math.random() * adminResponses.viewStats.length)];
      }
      if ((message.includes('team') && (message.includes('manage') || message.includes('add'))) || 
          message.includes('manage teams') || message.includes('team management')) {
        return adminResponses.manageTeams[Math.floor(Math.random() * adminResponses.manageTeams.length)];
      }
      if (message.includes('filter') || message.includes('sort') || 
          message.includes('search') || message.includes('find')) {
        return adminResponses.reportFilters[Math.floor(Math.random() * adminResponses.reportFilters.length)];
      }
      if (message.includes('completed') || message.includes('finished') || 
          message.includes('resolved') || message.includes('closed')) {
        return adminResponses.completedReports[Math.floor(Math.random() * adminResponses.completedReports.length)];
      }
      if (message.includes('analytic') || message.includes('data') || 
          message.includes('performance') || message.includes('trend')) {
        return adminResponses.analytics[Math.floor(Math.random() * adminResponses.analytics.length)];
      }
      if (message.includes('notification') || message.includes('alert') || 
          message.includes('reminder') || message.includes('update')) {
        return adminResponses.notifications[Math.floor(Math.random() * adminResponses.notifications.length)];
      }
    } else {
      // Public-specific responses with fallback to default
      const publicResponses = responses as typeof PUBLIC_RESPONSES;
      
      if ((message.includes('report') && (message.includes('how') || message.includes('submit'))) || 
          message.includes('create report') || message.includes('new report') || 
          message.includes('reporting') || message.includes('file report')) {
        return publicResponses.howToReport[Math.floor(Math.random() * publicResponses.howToReport.length)];
      }
      if (message.includes('track') || message.includes('status') || 
          message.includes('check') || message.includes('progress') || 
          message.includes('follow up') || message.includes('update')) {
        return publicResponses.trackReport[Math.floor(Math.random() * publicResponses.trackReport.length)];
      }
      if (message.includes('emergency') || message.includes('urgent') || 
          message.includes('critical') || message.includes('serious') || 
          message.includes('danger')) {
        return publicResponses.emergencyContact[Math.floor(Math.random() * publicResponses.emergencyContact.length)];
      }
      if (message.includes('about') || message.includes('what is') || 
          message.includes('service') || message.includes('clean kili') || 
          message.includes('platform') || message.includes('mission')) {
        return publicResponses.aboutService[Math.floor(Math.random() * publicResponses.aboutService.length)];
      }
      if (message.includes('contact') || message.includes('reach') || 
          message.includes('phone') || message.includes('email') || 
          message.includes('whatsapp') || message.includes('get in touch')) {
        return publicResponses.contact[Math.floor(Math.random() * publicResponses.contact.length)];
      }
      if (message.includes('feature') || message.includes('function') || 
          message.includes('capability') || message.includes('what can') || 
          message.includes('options') || message.includes('tools')) {
        return publicResponses.features[Math.floor(Math.random() * publicResponses.features.length)];
      }
      if (message.includes('team') || message.includes('maintenance') || 
          message.includes('crew') || message.includes('worker') || 
          message.includes('staff') || message.includes('personnel')) {
        return publicResponses.teamInfo[Math.floor(Math.random() * publicResponses.teamInfo.length)];
      }
      if (message.includes('privacy') || message.includes('private') || 
          message.includes('security') || message.includes('personal') || 
          message.includes('data') || message.includes('anonymous')) {
        return publicResponses.privacy[Math.floor(Math.random() * publicResponses.privacy.length)];
      }
    }
    
    // Enhanced fuzzy matching for out-of-scope questions
    const keywords = message.split(' ').filter(word => word.length > 3);
    let bestMatch = '';
    let maxMatches = 0;
    
    // Try to find the best matching response category
    Object.entries(responses).forEach(([key, responseArray]) => {
      if (key === 'default' || key === 'fallback') return;
      
      let matches = 0;
      keywords.forEach(keyword => {
        if (key.toLowerCase().includes(keyword) || 
            responseArray.some(resp => resp.toLowerCase().includes(keyword))) {
          matches++;
        }
      });
      
      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = key;
      }
    });
    
    // If we found a good match, use it
    if (maxMatches > 0 && bestMatch) {
      const responseArray = (responses as Record<string, string[]>)[bestMatch];
      return responseArray[Math.floor(Math.random() * responseArray.length)];
    }
    
    // If no specific match found, try fallback responses first, then default
    const fallbackResponses = (responses as Record<string, string[]>).fallback;
    if (fallbackResponses && fallbackResponses.length > 0) {
      return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    }
    
    // Final fallback to default responses
    return responses.default[Math.floor(Math.random() * responses.default.length)];
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    addUserMessage(inputValue);
    setInputValue('');
    setIsTyping(true);
    setShowSuggestions(false); // Hide suggestions after first message

    // Simulate bot thinking time
    setTimeout(() => {
      const response = getBotResponse(inputValue);
      addBotMessage(response);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
    // Auto-send the suggestion
    setTimeout(() => {
      addUserMessage(suggestion);
      setIsTyping(true);
      setTimeout(() => {
        const response = getBotResponse(suggestion);
        addBotMessage(response);
      }, 1000 + Math.random() * 1000);
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Widget */}
      {isOpen && (
        <Card className="w-80 h-96 mb-4 shadow-2xl border-0 bg-white rounded-2xl transform animate-in slide-in-from-bottom-5 duration-300">
          <CardHeader className="pb-2 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white rounded-t-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2 font-semibold">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-200 via-amber-200 to-orange-200 flex items-center justify-center shadow-inner border-2 border-yellow-300/50">
                    <Sparkles className="h-5 w-5 text-amber-600 animate-pulse" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full animate-ping shadow-lg"></div>
                  <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-300 rounded-full animate-bounce [animation-delay:0.5s]"></div>
                </div>
                {isAdmin ? 'Kili AI - Admin Assistant' : 'Kili AI - Your Smart Helper'}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleChatbot}
                className="h-6 w-6 p-0 text-white hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4 flex flex-col h-full bg-gray-50">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-2 ${
                    message.isBot ? 'justify-start' : 'justify-end'
                  } transform animate-in slide-in-from-bottom-2 duration-200`}
                >
                  {message.isBot && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-50 flex items-center justify-center flex-shrink-0 border-2 border-amber-200 shadow-lg relative">
                      <Sparkles className="h-4 w-4 text-amber-600" />
                      <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] p-3 rounded-2xl text-sm shadow-sm transition-all duration-200 hover:shadow-md ${
                      message.isBot
                        ? 'bg-white text-gray-800 border border-emerald-100'
                        : 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white shadow-lg'
                    }`}
                  >
                    {message.text}
                  </div>
                  {!message.isBot && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <User className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-start gap-2 animate-in slide-in-from-bottom-2 duration-200">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-50 flex items-center justify-center flex-shrink-0 border-2 border-amber-200 shadow-lg relative">
                    <Sparkles className="h-4 w-4 text-amber-600" />
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-emerald-100">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
              {/* Suggested Questions */}
              {showSuggestions && messages.length > 0 && (
                <div className="space-y-2 animate-in slide-in-from-bottom-2 duration-300">
                  <div className="text-xs text-gray-500 font-medium px-1">Suggested questions:</div>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.slice(0, 3).map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200 transition-colors duration-200 hover:shadow-sm"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Container */}
            <div className="flex gap-2 bg-white p-2 rounded-xl border border-emerald-200 shadow-sm">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message... (Andika ujumbe wako...)"
                className="flex-1 text-sm border-0 bg-transparent focus:ring-0 focus:outline-none placeholder:text-gray-400"
              />
              <Button
                onClick={handleSendMessage}
                size="sm"
                disabled={!inputValue.trim() || isTyping}
                className="px-3 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white rounded-lg shadow-sm transition-all duration-200 hover:shadow-md disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Button */}
      <Button
        onClick={toggleChatbot}
        className={`rounded-full w-14 h-14 shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 ${
          isAdmin 
            ? 'bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:via-green-700 hover:to-teal-700' 
            : 'bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:via-green-600 hover:to-teal-600'
        } ${isOpen ? 'rotate-180' : 'animate-bounce [animation-duration:2s] [animation-iteration-count:infinite]'}`}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white transition-transform duration-200" />
        ) : (
          <div className="relative">
            <MessageCircle className="h-6 w-6 text-white transition-transform duration-200" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full animate-pulse shadow-lg"></div>
            <div className="absolute top-1 right-1">
              <Sparkles className="h-3 w-3 text-yellow-200 animate-pulse [animation-delay:0.3s]" />
            </div>
          </div>
        )}
      </Button>
    </div>
  );
};
