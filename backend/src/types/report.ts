export interface LocationData {
  coordinates: {
    latitude: number;
    longitude: number;
  } | null;
  address: string;
}

export interface ReportData {
  id: string;
  type: string;
  description: string;
  location: LocationData;
  photo: File;
  timestamp: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
}

export interface DatabaseReport extends Omit<ReportData, 'photo'> {
  photoURL: string;
  notes?: string;
  assignedTo?: string;
  updatedAt: string;
}

export interface ReportStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
  resolvedPercentage: number;
}
