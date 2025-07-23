// Mock Database Service - Replace with real database later
import { ReportData, DatabaseReport } from '../types/report';

// Mock in-memory database - Replace with Firebase/MongoDB/Supabase
const mockReports: DatabaseReport[] = [
  {
    id: 'report_1642534800000',
    type: 'illegal-dumping',
    description: 'Large pile of household waste dumped near the main gate of Kilimani Court apartments',
    location: {
      coordinates: { latitude: -1.2921, longitude: 36.7822 },
      address: 'Kilimani Road, near Nakumatt Prestige Plaza'
    },
    photoURL: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=300&h=200&fit=crop',
    timestamp: '2024-01-18T14:20:00Z',
    updatedAt: '2024-01-18T14:20:00Z',
    status: 'Pending'
  },
  {
    id: 'report_1642535700000',
    type: 'blocked-drain',
    description: 'Storm drain blocked with plastic bottles and debris causing water to overflow during rain',
    location: {
      coordinates: { latitude: -1.2935, longitude: 36.7845 },
      address: 'Argwings Kodhek Road, near Shell Petrol Station'
    },
    photoURL: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=300&h=200&fit=crop',
    timestamp: '2024-01-18T14:35:00Z',
    updatedAt: '2024-01-18T15:10:00Z',
    status: 'In Progress',
    assignedTo: 'Waste Management Team A',
    notes: 'Team dispatched to clear the drain. Expected completion by EOD.'
  },
  {
    id: 'report_1642536600000',
    type: 'overflowing-bin',
    description: 'Public waste bin overflowing with garbage scattered around the area',
    location: {
      coordinates: { latitude: -1.2918, longitude: 36.7833 },
      address: 'Yaya Centre parking area'
    },
    photoURL: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
    timestamp: '2024-01-18T14:50:00Z',
    updatedAt: '2024-01-18T16:30:00Z',
    status: 'Resolved',
    assignedTo: 'Cleaning Crew B',
    notes: 'Bin emptied and area cleaned. Scheduled for more frequent collection.'
  }
];

// Mock file upload service
export const uploadPhoto = async (file: File): Promise<string> => {
  // Simulate file upload delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Create a temporary URL for the uploaded file (for demo purposes)
  // In real implementation, upload to Firebase Storage, S3, etc.
  const fileURL = URL.createObjectURL(file);
  
  // Store the file reference for cleanup later
  // In production, this would be handled by your cloud storage service
  return fileURL;
};

// Database operations
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
  
  mockReports[reportIndex] = {
    ...mockReports[reportIndex],
    status,
    notes: notes || mockReports[reportIndex].notes,
    assignedTo: assignedTo || mockReports[reportIndex].assignedTo,
    updatedAt: new Date().toISOString()
  };
  
  // Simulate update delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
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
