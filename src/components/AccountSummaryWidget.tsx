import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpCircle, ArrowDownCircle, MinusCircle, Wallet, PiggyBank, CreditCardIcon, Briefcase, Landmark } from 'lucide-react';

type AccountType = 'Checking' | 'Savings' | 'Credit Card' | 'Investment' | 'Loan';

interface AccountSummaryWidgetProps {
  accountId: string;
  accountName: string;
  accountType: AccountType;
  balance: number;
  currencyCode?: string; // e.g., "USD", "EUR"
  trend?: 'up' | 'down' | 'neutral';
  lastUpdated?: string; // e.g., "As of 5:00 PM"
}

const AccountSummaryWidget: React.FC<AccountSummaryWidgetProps> = ({
  accountId,
  accountName,
  accountType,
  balance,
  currencyCode = 'USD',
  trend = 'neutral',
  lastUpdated,
}) => {
  console.log('AccountSummaryWidget loaded for account:', accountName);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { // Consider making locale dynamic if needed
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getAccountIcon = (type: AccountType) => {
    switch (type) {
      case 'Checking':
        return <Wallet className="h-6 w-6 text-blue-600" />;
      case 'Savings':
        return <PiggyBank className="h-6 w-6 text-green-600" />;
      case 'Credit Card':
        return <CreditCardIcon className="h-6 w-6 text-orange-600" />;
      case 'Investment':
        return <Briefcase className="h-6 w-6 text-purple-600" />;
      case 'Loan':
        return <Landmark className="h-6 w-6 text-red-600" />; // Or another suitable icon
      default:
        return <Wallet className="h-6 w-6 text-gray-500" />;
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <ArrowUpCircle className="h-5 w-5 text-green-500" />;
      case 'down':
        return <ArrowDownCircle className="h-5 w-5 text-red-500" />;
      case 'neutral':
        return <MinusCircle className="h-5 w-5 text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-sm shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getAccountIcon(accountType)}
            <div>
              <CardTitle className="text-lg font-semibold text-gray-800">{accountName}</CardTitle>
              <p className="text-xs text-gray-500">{accountType} Account</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow space-y-3 pt-2 pb-4">
        <div className="text-3xl font-bold text-gray-900">
          {formatCurrency(balance)}
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          {getTrendIcon()}
          <span>
            {trend === 'up' ? 'Trending up' : trend === 'down' ? 'Trending down' : 'Stable'}
            {lastUpdated && <span className="text-xs text-gray-400 ml-1">({lastUpdated})</span>}
          </span>
        </div>
        {/* Placeholder for a mini-chart if desired in future */}
        {/* <div className="h-16 bg-gray-100 rounded-md flex items-center justify-center text-sm text-gray-400">
          Mini-chart placeholder
        </div> */}
      </CardContent>

      <CardFooter className="border-t pt-4 pb-4">
        <Button asChild variant="outline" className="w-full text-blue-600 border-blue-600 hover:bg-blue-50 hover:text-blue-700">
          <Link to="/accounts-management">
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AccountSummaryWidget;