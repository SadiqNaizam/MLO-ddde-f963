import React from 'react';
import { Link } from 'react-router-dom';

// Custom Layout Components
import MainHeader from '@/components/layout/MainHeader';
import CollapsibleSidebar from '@/components/layout/CollapsibleSidebar';
import PageFooter from '@/components/layout/PageFooter';

// Custom Widget/Item Components
import AccountSummaryWidget from '@/components/AccountSummaryWidget';
import RecentTransactionListItem from '@/components/RecentTransactionListItem';
import SpendingAnalysisWidget from '@/components/SpendingAnalysisWidget';

// Shadcn/ui Components
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Placeholder Data
const accountSummaries = [
  { accountId: 'acc_chk_001', accountName: 'Primary Checking', accountType: 'Checking' as const, balance: 12540.75, currencyCode: 'USD', trend: 'up' as const, lastUpdated: 'Today 2:30 PM' },
  { accountId: 'acc_sav_002', accountName: 'High-Yield Savings', accountType: 'Savings' as const, balance: 85320.10, currencyCode: 'USD', trend: 'neutral' as const, lastUpdated: 'Today 1:00 PM' },
  { accountId: 'acc_cc_003', accountName: 'Platinum Rewards Card', accountType: 'Credit Card' as const, balance: -1250.45, currencyCode: 'USD', trend: 'down' as const, lastUpdated: 'Yesterday 8:00 AM' },
  { accountId: 'acc_inv_004', accountName: 'Growth Portfolio', accountType: 'Investment' as const, balance: 23750.00, currencyCode: 'USD', trend: 'up' as const, lastUpdated: 'Today 3:00 PM' },
];

const recentTransactions = [
  { id: 'txn_001', date: 'July 26, 2024', description: 'Spotify Subscription', payeePayer: 'Spotify AB', amount: 9.99, currencySymbol: '$', type: 'expense' as const, status: 'completed' as const },
  { id: 'txn_002', date: 'July 25, 2024', description: 'Salary Deposit', payeePayer: 'Tech Solutions Inc.', amount: 2500.00, currencySymbol: '$', type: 'income' as const, status: 'completed' as const },
  { id: 'txn_003', date: 'July 24, 2024', description: 'Online Groceries', payeePayer: 'World Foods Market', amount: 75.50, currencySymbol: '$', type: 'expense' as const, status: 'completed' as const },
  { id: 'txn_004', date: 'July 23, 2024', description: 'Transfer to Savings Account', payeePayer: 'Internal Transfer', amount: 500.00, currencySymbol: '$', type: 'expense' as const, status: 'pending' as const },
  { id: 'txn_005', date: 'July 22, 2024', description: 'Restaurant Dinner', payeePayer: 'The Italian Place', amount: 62.30, currencySymbol: '$', type: 'expense' as const, status: 'completed' as const },
];

const DashboardOverviewPage = () => {
  console.log('DashboardOverviewPage loaded');

  // Note: MainHeader internally renders NotificationIndicator.
  // NotificationIndicator would fetch its own data or use context in a real app.
  // For this generation, it will use its default state (likely empty notifications).

  return (
    <div className="flex h-screen bg-muted/40 dark:bg-gray-950">
      <CollapsibleSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <MainHeader />
        <ScrollArea className="flex-1">
          <main className="p-4 py-6 sm:px-6 md:p-6 lg:p-8 space-y-6">
            {/* Welcome Section */}
            <section>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
                Welcome Back, User!
              </h1>
              <p className="text-muted-foreground mt-1">
                Here's your financial snapshot at a glance.
              </p>
            </section>

            {/* Account Summaries Section */}
            <section aria-labelledby="account-overview-title">
              <h2 id="account-overview-title" className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Account Overview
              </h2>
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {accountSummaries.map((account) => (
                  <AccountSummaryWidget
                    key={account.accountId}
                    accountId={account.accountId}
                    accountName={account.accountName}
                    accountType={account.accountType}
                    balance={account.balance}
                    currencyCode={account.currencyCode}
                    trend={account.trend}
                    lastUpdated={account.lastUpdated}
                  />
                ))}
              </div>
            </section>

            {/* Recent Transactions & Spending Analysis Section */}
            <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Recent Transactions */}
              <div className="lg:col-span-3">
                <Card className="shadow-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
                    <Button variant="link" size="sm" asChild className="text-primary">
                      <Link to="/accounts-management">View All</Link>
                    </Button>
                  </CardHeader>
                  <CardContent className="p-0">
                    {recentTransactions.length > 0 ? (
                      <div className="divide-y divide-border">
                        {recentTransactions.slice(0, 5).map((transaction) => ( // Show up to 5 recent transactions
                          <RecentTransactionListItem
                            key={transaction.id}
                            id={transaction.id}
                            date={transaction.date}
                            description={transaction.description}
                            payeePayer={transaction.payeePayer}
                            amount={transaction.amount}
                            currencySymbol={transaction.currencySymbol}
                            type={transaction.type}
                            status={transaction.status}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="p-6 text-sm text-center text-muted-foreground">
                        No recent transactions to display.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Spending Analysis */}
              <div className="lg:col-span-2">
                <SpendingAnalysisWidget 
                  title="Spending Breakdown"
                  description="Your spending habits by category for the selected period."
                />
              </div>
            </section>
            
            {/* Quick Actions Section */}
            <section aria-labelledby="quick-actions-title">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle id="quick-actions-title" className="text-lg font-semibold">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-3">
                  <Button variant="outline" asChild>
                    <Link to="/transfers-and-payments">Make a Transfer</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/transfers-and-payments">Pay a Bill</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/card-management">Manage Cards</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/accounts-management">View Accounts</Link>
                  </Button>
                </CardContent>
              </Card>
            </section>

          </main>
          <PageFooter />
        </ScrollArea>
      </div>
    </div>
  );
};

export default DashboardOverviewPage;