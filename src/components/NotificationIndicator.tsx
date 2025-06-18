import React from 'react';
import { Bell, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import NotificationItem from '@/components/NotificationItem'; // Assuming this component exists

// Define the structure of a Notification object
export interface Notification {
  id: string;
  type: 'alert' | 'update' | 'transaction' | 'message' | 'info' | 'warning' | 'success' | 'error';
  title: string;
  description: string;
  timestamp: string; // e.g., "5m ago", "July 26, 2024"
  isRead: boolean;
  link?: string; // e.g., '/transfers-and-payments/123'
}

// Define props for NotificationItem based on its assumed functionality
// This helps in passing the correct props from NotificationIndicator
// In a real scenario, NotificationItem would export its own props interface.
interface AssumedNotificationItemProps {
  id: string;
  type: Notification['type'];
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  link?: string;
  onMarkAsRead?: (id: string) => void;
  onView?: (notification: { id: string; link?: string }) => void;
}

interface NotificationIndicatorProps {
  notifications: Notification[];
  onMarkNotificationAsRead?: (id: string) => void;
  onViewNotification?: (notification: Notification) => void;
  onViewAll?: () => void;
  onMarkAllAsRead?: () => void;
}

const NotificationIndicator: React.FC<NotificationIndicatorProps> = ({
  notifications,
  onMarkNotificationAsRead,
  onViewNotification,
  onViewAll,
  onMarkAllAsRead,
}) => {
  console.log('NotificationIndicator loaded');

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationItemView = (notification: Notification) => {
    if (onViewNotification) {
      onViewNotification(notification);
    }
    // Optionally mark as read on view
    if (!notification.isRead && onMarkNotificationAsRead) {
      onMarkNotificationAsRead(notification.id);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
            </span>
          )}
          <span className="sr-only">Open notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 md:w-96 p-0" align="end">
        <div className="flex items-center justify-between p-3 px-4 border-b">
          <h3 className="text-md font-semibold">
            Notifications
            {unreadCount > 0 && <span className="text-sm text-muted-foreground ml-1">({unreadCount} unread)</span>}
          </h3>
          {unreadCount > 0 && onMarkAllAsRead && (
            <Button variant="ghost" size="sm" onClick={onMarkAllAsRead} className="text-xs">
              <Check className="mr-1 h-3 w-3" /> Mark all as read
            </Button>
          )}
        </div>
        
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            You have no new notifications.
          </div>
        ) : (
          <ScrollArea className="h-[300px] max-h-[60vh]">
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  id={notification.id}
                  type={notification.type}
                  title={notification.title}
                  description={notification.description}
                  timestamp={notification.timestamp}
                  isRead={notification.isRead}
                  link={notification.link}
                  // Pass action handlers to NotificationItem
                  // These are assumed props for NotificationItem
                  onMarkAsRead={onMarkNotificationAsRead ? () => onMarkNotificationAsRead(notification.id) : undefined}
                  onView={onViewNotification ? () => handleNotificationItemView(notification) : undefined}
                />
              ))}
            </div>
          </ScrollArea>
        )}

        {notifications.length > 0 && onViewAll && (
          <>
            <Separator />
            <div className="p-2 text-center">
              <Button variant="link" size="sm" className="w-full" onClick={onViewAll}>
                View all notifications
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default NotificationIndicator;