import React from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface RecentTransactionListItemProps {
  id: string;
  date: string; // Expected to be a pre-formatted date string
  description: string;
  payeePayer: string; // e.g., "Netflix", "From John Doe"
  amount: number;
  currencySymbol?: string; // Defaults to '$'
  type: 'income' | 'expense';
  status: 'completed' | 'pending' | 'failed';
}

const RecentTransactionListItem: React.FC<RecentTransactionListItemProps> = ({
  id,
  date,
  description,
  payeePayer,
  amount,
  currencySymbol = '$',
  type,
  status,
}) => {
  console.log('RecentTransactionListItem loaded for ID:', id);

  const statusText = status.charAt(0).toUpperCase() + status.slice(1);

  let badgeVariant: "default" | "secondary" | "destructive" = "secondary";
  if (status === 'completed') {
    badgeVariant = 'default'; // e.g., Blue/Primary theme color
  } else if (status === 'pending') {
    badgeVariant = 'secondary'; // e.g., Gray
  } else if (status === 'failed') {
    badgeVariant = 'destructive'; // e.g., Red
  }

  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-slate-50 transition-colors duration-150">
      <div className="flex items-center space-x-3 min-w-0"> {/* min-w-0 for truncate to work in flex */}
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100">
          {type === 'income' ? (
            <ArrowUpRight className="h-4 w-4 text-green-500" aria-label="Income" />
          ) : (
            <ArrowDownLeft className="h-4 w-4 text-red-500" aria-label="Expense" />
          )}
        </div>
        <div className="min-w-0"> {/* min-w-0 for truncate to work */}
          <p className="font-semibold text-sm text-gray-800 truncate" title={description}>
            {description}
          </p>
          <p className="text-xs text-gray-500">
            {payeePayer} &bull; {date}
          </p>
        </div>
      </div>

      <div className="text-right flex-shrink-0 ml-4">
        <p
          className={`font-semibold text-sm ${
            type === 'income' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {type === 'income' ? '+' : '-'}
          {currencySymbol}
          {amount.toFixed(2)}
        </p>
        <Badge variant={badgeVariant} className="text-xs mt-1 px-2 py-0.5">
          {statusText}
        </Badge>
      </div>
    </div>
  );
};

export default RecentTransactionListItem;