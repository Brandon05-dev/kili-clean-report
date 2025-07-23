import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Plus, 
  X,
  Bell
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface LiveUpdate {
  id: string;
  type: 'new' | 'status_change' | 'resolved';
  reportId: string;
  message: string;
  timestamp: Date;
  status?: string;
  oldStatus?: string;
}

interface LiveUpdateNotificationProps {
  updates: LiveUpdate[];
  onDismiss: (id: string) => void;
  onDismissAll: () => void;
}

const LiveUpdateNotification: React.FC<LiveUpdateNotificationProps> = ({
  updates,
  onDismiss,
  onDismissAll
}) => {
  const [visible, setVisible] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Show new updates
    updates.forEach(update => {
      if (!visible.has(update.id)) {
        setVisible(prev => new Set([...prev, update.id]));
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
          setVisible(prev => {
            const newSet = new Set(prev);
            newSet.delete(update.id);
            return newSet;
          });
          onDismiss(update.id);
        }, 5000);
      }
    });
  }, [updates, visible, onDismiss]);

  const getUpdateIcon = (type: string, status?: string) => {
    switch (type) {
      case 'new':
        return <Plus className="h-4 w-4 text-blue-600" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'status_change':
        return status === 'In Progress' ? 
          <Clock className="h-4 w-4 text-yellow-600" /> : 
          <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getUpdateColor = (type: string, status?: string) => {
    switch (type) {
      case 'new':
        return 'border-l-blue-500 bg-blue-50';
      case 'resolved':
        return 'border-l-green-500 bg-green-50';
      case 'status_change':
        return status === 'In Progress' ? 
          'border-l-yellow-500 bg-yellow-50' : 
          'border-l-orange-500 bg-orange-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const visibleUpdates = updates.filter(update => visible.has(update.id));

  if (visibleUpdates.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {visibleUpdates.length > 1 && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismissAll}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Dismiss All
          </Button>
        </div>
      )}
      
      {visibleUpdates.map((update) => (
        <Card
          key={update.id}
          className={`border-l-4 shadow-lg transition-all duration-300 ease-in-out transform ${
            visible.has(update.id) ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          } ${getUpdateColor(update.type, update.status)}`}
        >
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {getUpdateIcon(update.type, update.status)}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Live Update
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {update.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {update.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setVisible(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(update.id);
                    return newSet;
                  });
                  onDismiss(update.id);
                }}
                className="text-gray-400 hover:text-gray-600 h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default LiveUpdateNotification;
