// Enhanced Database Service with Live Updates and Real-time Synchronization
import { ReportData, DatabaseReport } from '../types/report';

// Enhanced mock in-memory database with real-time capabilities
const mockReports: DatabaseReport[] = [
  {
    id: 'report_1642534800000',
    type: 'illegal-dumping',
    description: 'Large pile of household waste dumped near the main gate of Kilimani Court apartments',
    location: {
      coordinates: { latitude: -1.292088, longitude: 36.782233 },
      address: 'Kilimani Court, Kilimani Road, Nairobi'
    },
    photoURL: '/Cleankili onsite images-20250809T071256Z-1-001/Cleankili onsite images/Illegal Dumping beside appartment.jpg',
    timestamp: '2024-01-18T14:20:00Z',
    updatedAt: '2024-01-18T14:20:00Z',
    status: 'Pending'
  },
  {
    id: 'report_1642535700000',
    type: 'blocked-drain',
    description: 'Storm drain blocked with plastic bottles and debris causing water to overflow during rain',
    location: {
      coordinates: { latitude: -1.293456, longitude: 36.784567 },
      address: 'Hurlingham Shopping Centre, Argwings Kodhek Road, Nairobi'
    },
    photoURL: '/Cleankili onsite images-20250809T071256Z-1-001/Cleankili onsite images/Clogged Drainage system.jpg',
    timestamp: '2024-01-18T14:35:00Z',
    updatedAt: '2024-01-18T15:10:00Z',
    status: 'In Progress',
    assignedTo: 'Waste Management Team A',
    notes: 'Team dispatched to clear the drain. Expected completion by EOD.'
  },
  {
    id: 'report_1642536600000',
    type: 'littering',
    description: 'Littering near bus stop with waste scattered around the area',
    location: {
      coordinates: { latitude: -1.291789, longitude: 36.783445 },
      address: 'Yaya Centre, Argwings Kodhek Road, Kilimani, Nairobi'
    },
    photoURL: '/Cleankili onsite images-20250809T071256Z-1-001/Cleankili onsite images/Littering on a bust stop.jpg',
    timestamp: '2024-01-18T14:50:00Z',
    updatedAt: '2024-01-18T16:30:00Z',
    status: 'Resolved',
    assignedTo: 'Cleaning Crew B',
    notes: 'Bin emptied and area cleaned. Scheduled for more frequent collection.'
  }
];

// Real-time update listeners - simulates WebSocket/EventSource functionality
type UpdateListener = (reports: DatabaseReport[]) => void;
type NotificationListener = (update: LiveUpdateNotification) => void;

const updateListeners: Set<UpdateListener> = new Set();
const notificationListeners: Set<NotificationListener> = new Set();

interface LiveUpdateNotification {
  id: string;
  type: 'new' | 'status_change' | 'resolved';
  reportId: string;
  message: string;
  timestamp: Date;
  status?: string;
  oldStatus?: string;
}

// Simulated live updates - in production, this would be WebSocket events
let updateInterval: NodeJS.Timeout | null = null;

// Subscribe to real-time updates
export const subscribeToUpdates = (callback: UpdateListener): (() => void) => {
  updateListeners.add(callback);
  
  // Start simulated live updates if this is the first subscriber
  if (updateListeners.size === 1 && !updateInterval) {
    startLiveUpdates();
  }
  
  // Return unsubscribe function
  return () => {
    updateListeners.delete(callback);
    
    // Stop live updates if no more subscribers
    if (updateListeners.size === 0 && updateInterval) {
      clearInterval(updateInterval);
      updateInterval = null;
    }
  };
};

// Subscribe to live notifications
export const subscribeToNotifications = (callback: NotificationListener): (() => void) => {
  notificationListeners.add(callback);
  
  return () => {
    notificationListeners.delete(callback);
  };
};

// Notify all listeners of updates
const notifyListeners = () => {
  const reportsCopy = [...mockReports].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  updateListeners.forEach(listener => listener(reportsCopy));
};

// Notify notification listeners
const notifyNotificationListeners = (notification: LiveUpdateNotification) => {
  notificationListeners.forEach(listener => listener(notification));
};

// Simulate live updates (in production, this would be real-time events)
const startLiveUpdates = () => {
  updateInterval = setInterval(() => {
    // Simulate random status changes
    if (Math.random() < 0.1) { // 10% chance of status change
      const pendingReports = mockReports.filter(r => r.status === 'Pending');
      const inProgressReports = mockReports.filter(r => r.status === 'In Progress');
      
      if (pendingReports.length > 0 && Math.random() < 0.5) {
        // Move a pending report to in progress
        const report = pendingReports[Math.floor(Math.random() * pendingReports.length)];
        const oldStatus = report.status;
        report.status = 'In Progress';
        report.updatedAt = new Date().toISOString();
        report.assignedTo = 'Cleanup Team ' + String.fromCharCode(65 + Math.floor(Math.random() * 3)); // A, B, or C
        report.notes = 'Team dispatched to address the issue.';
        
        console.log(`🔄 Live Update: Report ${report.id} moved to In Progress`);
        
        // Send notification
        notifyNotificationListeners({
          id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'status_change',
          reportId: report.id,
          message: `Report ${report.id.slice(-6)} moved to In Progress`,
          timestamp: new Date(),
          status: report.status,
          oldStatus
        });
        
        notifyListeners();
      } else if (inProgressReports.length > 0 && Math.random() < 0.3) {
        // Move an in progress report to resolved
        const report = inProgressReports[Math.floor(Math.random() * inProgressReports.length)];
        const oldStatus = report.status;
        report.status = 'Resolved';
        report.updatedAt = new Date().toISOString();
        report.notes = 'Issue successfully resolved by the assigned team.';
        
        console.log(`✅ Live Update: Report ${report.id} resolved!`);
        
        // Send notification
        notifyNotificationListeners({
          id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'resolved',
          reportId: report.id,
          message: `Report ${report.id.slice(-6)} has been resolved!`,
          timestamp: new Date(),
          status: report.status,
          oldStatus
        });
        
        notifyListeners();
      }
    }
    
    // Simulate new reports occasionally
    if (Math.random() < 0.05) { // 5% chance of new report
      const newReport = generateRandomReport();
      mockReports.unshift(newReport);
      
      console.log(`🆕 Live Update: New report ${newReport.id} submitted!`);
      
      // Send notification
      notifyNotificationListeners({
        id: `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'new',
        reportId: newReport.id,
        message: `New ${newReport.type.replace('-', ' ')} report submitted`,
        timestamp: new Date(),
        status: newReport.status
      });
      
      notifyListeners();
    }
  }, 5000); // Check every 5 seconds for updates
};

// Generate a random report for simulation
const generateRandomReport = (): DatabaseReport => {
  const types = ['illegal-dumping', 'blocked-drain', 'overflowing-bin', 'broken-streetlight', 'pothole'];
  const locations = [
    { lat: -1.292088, lng: 36.782233, address: 'Kilimani Court, Kilimani Road, Nairobi' },
    { lat: -1.293456, lng: 36.784567, address: 'Hurlingham Shopping Centre, Argwings Kodhek Road, Nairobi' },
    { lat: -1.291789, lng: 36.783445, address: 'Yaya Centre, Argwings Kodhek Road, Kilimani, Nairobi' },
    { lat: -1.294234, lng: 36.785123, address: 'Kileleshwa Mall, Kileleshwa Road, Nairobi' },
    { lat: -1.290876, lng: 36.781945, address: 'Lavington Green Shopping Centre, Hatheru Road, Nairobi' },
    { lat: -1.296534, lng: 36.787821, address: 'Sarit Centre, Westlands, Nairobi' },
    { lat: -1.288945, lng: 36.780334, address: 'Upper Hill Medical Centre, Ralph Bunche Road, Nairobi' },
    { lat: -1.295423, lng: 36.783267, address: 'Kasarani Sports Complex, Thika Road, Nairobi' }
  ];
  
  const descriptions = [
    'Waste materials scattered across the sidewalk area',
    'Drainage system blocked with debris and litter',
    'Public bin overflowing with household waste',
    'Street lighting not functioning properly',
    'Road surface damaged requiring immediate attention'
  ];
  
  const type = types[Math.floor(Math.random() * types.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];
  const description = descriptions[Math.floor(Math.random() * descriptions.length)];
  
  // Array of local images to randomly select from
  const localImages = [
    '/Cleankili onsite images-20250809T071256Z-1-001/Cleankili onsite images/Illegal Dumping beside appartment.jpg',
    '/Cleankili onsite images-20250809T071256Z-1-001/Cleankili onsite images/Clogged Drainage system.jpg',
    '/Cleankili onsite images-20250809T071256Z-1-001/Cleankili onsite images/Clogged Drainage opposite Yaya centre.jpg',
    '/Cleankili onsite images-20250809T071256Z-1-001/Cleankili onsite images/Duping on the walk path.jpg',
    '/Cleankili onsite images-20250809T071256Z-1-001/Cleankili onsite images/Littering on a bust stop.jpg',
    '/Cleankili onsite images-20250809T071256Z-1-001/Cleankili onsite images/Citizen Digital snippet.jpg'
  ];
  
  return {
    id: `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    description,
    location: {
      coordinates: { latitude: location.lat, longitude: location.lng },
      address: location.address
    },
    photoURL: localImages[Math.floor(Math.random() * localImages.length)],
    timestamp: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'Pending'
  };
};

// Enhanced file upload service
export const uploadPhoto = async (file: File): Promise<string> => {
  // Simulate file upload delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Create a temporary URL for the uploaded file (for demo purposes)
  const fileURL = URL.createObjectURL(file);
  return fileURL;
};

// Enhanced database operations with real-time notifications
export const saveReport = async (reportData: ReportData, photoURL: string): Promise<DatabaseReport> => {
  const newReport: DatabaseReport = {
    ...reportData,
    photoURL,
    updatedAt: new Date().toISOString()
  };
  
  // Add to mock database
  mockReports.unshift(newReport);
  
  // Simulate save delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Notify live update listeners
  console.log(`📝 New Report Submitted: ${newReport.id}`);
  notifyListeners();
  
  return newReport;
};

export const getAllReports = async (): Promise<DatabaseReport[]> => {
  // Simulate fetch delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockReports].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

export const updateReportStatus = async (
  reportId: string, 
  status: 'Pending' | 'In Progress' | 'Resolved',
  notes?: string,
  assignedTo?: string
): Promise<DatabaseReport | null> => {
  const reportIndex = mockReports.findIndex(r => r.id === reportId);
  
  if (reportIndex === -1) {
    throw new Error('Report not found');
  }
  
  const oldStatus = mockReports[reportIndex].status;
  
  mockReports[reportIndex] = {
    ...mockReports[reportIndex],
    status,
    notes: notes || mockReports[reportIndex].notes,
    assignedTo: assignedTo || mockReports[reportIndex].assignedTo,
    updatedAt: new Date().toISOString()
  };
  
  // Simulate update delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Notify live update listeners
  console.log(`🔄 Status Update: Report ${reportId} changed from ${oldStatus} to ${status}`);
  notifyListeners();
  
  return mockReports[reportIndex];
};

export const deleteReport = async (reportId: string): Promise<boolean> => {
  const reportIndex = mockReports.findIndex(r => r.id === reportId);
  
  if (reportIndex === -1) {
    return false;
  }
  
  mockReports.splice(reportIndex, 1);
  
  // Simulate delete delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Notify live update listeners
  console.log(`🗑️ Report Deleted: ${reportId}`);
  notifyListeners();
  
  return true;
};

export const getReportStats = async () => {
  const total = mockReports.length;
  const pending = mockReports.filter(r => r.status === 'Pending').length;
  const inProgress = mockReports.filter(r => r.status === 'In Progress').length;
  const resolved = mockReports.filter(r => r.status === 'Resolved').length;
  
  return {
    total,
    pending,
    inProgress,
    resolved,
    resolvedPercentage: total > 0 ? Math.round((resolved / total) * 100) : 0
  };
};

// Get real-time status counts
export const getLiveStats = () => {
  const total = mockReports.length;
  const pending = mockReports.filter(r => r.status === 'Pending').length;
  const inProgress = mockReports.filter(r => r.status === 'In Progress').length;
  const resolved = mockReports.filter(r => r.status === 'Resolved').length;
  
  return { total, pending, inProgress, resolved };
};
