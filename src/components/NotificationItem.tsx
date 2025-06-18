import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Info,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  BellRing,
  ArrowRightLeft,
  ShieldCheck,
  LucideIcon,
} from 'lucide-react';

export type NotificationType = 'info' | 'warning' | 'error' | 'success' | 'update' | 'transaction' | 'security';

interface NotificationItemProps {
  id: string | number;
  type: NotificationType;
  message: string;
  timestamp: string; // e.g., "2 hours ago", "2024-07-27 10:00 AM"
  isRead?: boolean;
  onMarkAsRead?: (id: string | number) => void;
  action?: {
    text: string;
    to?: string; // For navigation using react-router-dom Link
    onClick?: () => void; // For other custom actions
  };
}

const typeStyles: Record<NotificationType, { Icon: LucideIcon; iconColor: string; bgColor: string }> = {
  info: { Icon: Info, iconColor: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-800' },
  warning: { Icon: AlertTriangle, iconColor: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-100 dark:bg-yellow-800' },
  error: { Icon: XCircle, iconColor: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-800' },
  success: { Icon: CheckCircle2, iconColor: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-800' },
  update: { Icon: BellRing, iconColor: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-800' },
  transaction: { Icon: ArrowRightLeft, iconColor: 'text-cyan-600 dark:text-cyan-400', bgColor: 'bg-cyan-100 dark:bg-cyan-800' },
  security: { Icon: ShieldCheck, iconColor: 'text-indigo-600 dark:text-indigo-400', bgColor: 'bg-indigo-100 dark:bg-indigo-800' },
};

const NotificationItem: React.FC<NotificationItemProps> = ({
  id,
  type,
  message,
  timestamp,
  isRead = false,
  onMarkAsRead,
  action,
}) => {
  console.log(`NotificationItem loaded for id: ${id}, type: ${type}`);

  const { Icon, iconColor, bgColor } = typeStyles[type] || typeStyles.info;

  return (
    <div
      className={`flex items-start p-3 space-x-3 border-b border-gray-200 dark:border-gray-700 transition-colors duration-150
        ${isRead ? 'bg-gray-50 dark:bg-gray-800/30 opacity-70 hover:bg-gray-100 dark:hover:bg-gray-700/50' : 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/60'}`}
    >
      {/* Icon */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${bgColor}`}>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </div>

      {/* Content */}
      <div className="flex-grow min-w-0">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 break-words">
          {message}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {timestamp}
        </p>
      </div>

      {/* Actions */}
      {(action || (onMarkAsRead && !isRead)) && (
        <div className="flex-shrink-0 ml-auto pl-2 flex flex-col items-end space-y-1">
          {action && (
            action.to ? (
              <Button variant="link" size="sm" asChild className="text-xs h-auto p-0 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                <Link to={action.to}>{action.text}</Link>
              </Button>
            ) : action.onClick ? (
              <Button variant="link" size="sm" onClick={action.onClick} className="text-xs h-auto p-0 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                {action.text}
              </Button>
            ) : null
          )}
          {onMarkAsRead && !isRead && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering parent onClick if any
                onMarkAsRead(id);
              }}
              className="text-xs h-auto p-1 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              aria-label="Mark as read"
            >
              Mark as read
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationItem;