import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

// Custom Components
import MainHeader from '@/components/layout/MainHeader';
import CollapsibleSidebar from '@/components/layout/CollapsibleSidebar';
import PageFooter from '@/components/layout/PageFooter';
// RecentTransactionListItem is in layout_info but will be represented by table columns for detailed transaction view

// Shadcn/ui Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Lucide Icons
import { Eye, FileDown, Search, ArrowLeft, Filter } from 'lucide-react';

// Interfaces for data structures
interface Account {
  id: string;
  name: string;
  type: 'Checking' | 'Savings' | 'Credit Card' | 'Loan';
  accountNumber: string; // Masked typically
  balance: number;
  currency: string;
}

interface Transaction {
  id: string;
  accountId: string;
  date: string; // Format: YYYY-MM-DD
  description: string;
  payeePayer: string;
  amount: number;
  currencySymbol: string;
  type: 'income' | 'expense';
  category: string;
  status: 'completed' | 'pending' | 'failed';
}

// Sample Data
const sampleAccounts: Account[] = [
  { id: 'acc_chk_001', name: 'Primary Checking', type: 'Checking', accountNumber: '**** **** **** 1234', balance: 12530.75, currency: 'USD' },
  { id: 'acc_sav_002', name: 'High-Yield Savings', type: 'Savings', accountNumber: '**** **** **** 5678', balance: 85000.00, currency: 'USD' },
  { id: 'acc_cc_003', name: 'Platinum Rewards Card', type: 'Credit Card', accountNumber: '**** **** **** 9012', balance: -1245.50, currency: 'USD' },
  { id: 'acc_loan_004', name: 'Auto Loan', type: 'Loan', accountNumber: '**** **** **** 3456', balance: -15200.00, currency: 'USD' },
];

const sampleTransactions: Transaction[] = [
  // Checking Account Transactions
  { id: 'txn_001', accountId: 'acc_chk_001', date: '2024-07-28', description: 'Salary Deposit', payeePayer: 'Tech Solutions Inc.', amount: 5500.00, currencySymbol: '$', type: 'income', category: 'Income', status: 'completed' },
  { id: 'txn_002', accountId: 'acc_chk_001', date: '2024-07-27', description: 'Online Purchase - E-Shop', payeePayer: 'E-Shop.com', amount: 75.99, currencySymbol: '$', type: 'expense', category: 'Shopping', status: 'completed' },
  { id: 'txn_003', accountId: 'acc_chk_001', date: '2024-07-26', description: 'Utility Bill - City Power', payeePayer: 'City Power Co.', amount: 120.50, currencySymbol: '$', type: 'expense', category: 'Utilities', status: 'pending' },
  { id: 'txn_006', accountId: 'acc_chk_001', date: '2024-07-25', description: 'Restaurant - Dinner', payeePayer: 'The Food Place', amount: 65.00, currencySymbol: '$', type: 'expense', category: 'Food & Dining', status: 'completed' },
  { id: 'txn_007', accountId: 'acc_chk_001', date: '2024-07-24', description: 'ATM Withdrawal', payeePayer: 'Downtown ATM', amount: 100.00, currencySymbol: '$', type: 'expense', category: 'Cash', status: 'completed' },

  // Savings Account Transactions
  { id: 'txn_004', accountId: 'acc_sav_002', date: '2024-07-25', description: 'Interest Earned', payeePayer: 'FinDash Bank', amount: 35.12, currencySymbol: '$', type: 'income', category: 'Interest', status: 'completed' },
  { id: 'txn_008', accountId: 'acc_sav_002', date: '2024-07-20', description: 'Transfer from Checking', payeePayer: 'Primary Checking', amount: 1000.00, currencySymbol: '$', type: 'income', category: 'Transfers', status: 'completed' },

  // Credit Card Transactions
  { id: 'txn_005', accountId: 'acc_cc_003', date: '2024-07-28', description: 'Restaurant - The Grand Diner', payeePayer: 'The Grand Diner', amount: 85.00, currencySymbol: '$', type: 'expense', category: 'Food & Dining', status: 'completed' },
  { id: 'txn_009', accountId: 'acc_cc_003', date: '2024-07-27', description: 'Subscription - Music Stream', payeePayer: 'TuneFlow', amount: 9.99, currencySymbol: '$', type: 'expense', category: 'Entertainment', status: 'completed' },
  { id: 'txn_010', accountId: 'acc_cc_003', date: '2024-07-26', description: 'Payment Received - Thank You', payeePayer: 'Online Payment', amount: 500.00, currencySymbol: '$', type: 'income', category: 'Payments', status: 'completed' }, // Credit card payment

  // Loan Transactions
  { id: 'txn_011', accountId: 'acc_loan_004', date: '2024-07-15', description: 'Monthly Loan Payment', payeePayer: 'Auto Loan Servicing', amount: 350.00, currencySymbol: '$', type: 'expense', category: 'Loan Repayment', status: 'completed' },
];

// Helper function to format currency
const formatCurrency = (value: number, currencyCode: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const AccountsManagementPage: React.FC = () => {
  console.log('AccountsManagementPage loaded');

  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
  const [isStatementDialogOpen, setIsStatementDialogOpen] = useState(false);

  const transactionsForSelectedAccount = useMemo(() => {
    if (!selectedAccount) return [];
    return sampleTransactions.filter(t => t.accountId === selectedAccount.id);
  }, [selectedAccount]);

  const filteredTransactions = useMemo(() => {
    return transactionsForSelectedAccount
      .filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.payeePayer.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(t => filterType === 'all' || t.type === filterType)
      .filter(t => filterStatus === 'all' || t.status === filterStatus);
  }, [transactionsForSelectedAccount, searchTerm, filterType, filterStatus]);

  const handleViewDetails = (account: Account) => {
    setSelectedAccount(account);
  };

  const handleBackToAccounts = () => {
    setSelectedAccount(null);
    setSearchTerm('');
    setFilterType('all');
    setFilterStatus('all');
  };
  
  const getStatusBadgeVariant = (status: Transaction['status']): "default" | "secondary" | "destructive" => {
    if (status === 'completed') return 'default'; // Using default for success/completed
    if (status === 'pending') return 'secondary';
    if (status === 'failed') return 'destructive';
    return 'secondary';
  };


  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
      <MainHeader />
      <div className="flex flex-1 overflow-hidden">
        <CollapsibleSidebar />
        <ScrollArea className="flex-1">
          <main className="p-4 md:p-6 lg:p-8 space-y-6">
            {!selectedAccount ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Your Accounts</CardTitle>
                  <CardDescription>Overview of all your registered accounts.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Account Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Account Number</TableHead>
                        <TableHead className="text-right">Balance</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sampleAccounts.map((account) => (
                        <TableRow key={account.id}>
                          <TableCell className="font-medium">{account.name}</TableCell>
                          <TableCell>{account.type}</TableCell>
                          <TableCell className="text-muted-foreground">{account.accountNumber}</TableCell>
                          <TableCell className="text-right">{formatCurrency(account.balance, account.currency)}</TableCell>
                          <TableCell className="text-center">
                            <Button variant="outline" size="sm" onClick={() => handleViewDetails(account)}>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ) : (
              <>
                <Button variant="outline" onClick={handleBackToAccounts} className="mb-4">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Accounts List
                </Button>

                <Card>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                            <CardTitle className="text-2xl">{selectedAccount.name}</CardTitle>
                            <CardDescription>
                                {selectedAccount.type} Account ({selectedAccount.accountNumber}) - Balance: 
                                <span className="font-semibold"> {formatCurrency(selectedAccount.balance, selectedAccount.currency)}</span>
                            </CardDescription>
                        </div>
                        <Button onClick={() => setIsStatementDialogOpen(true)}>
                            <FileDown className="mr-2 h-4 w-4" /> Download Statement
                        </Button>
                    </div>
                  </CardHeader>
                  {/* Optional: Could add more account specific details here */}
                </Card>
                
                <Separator />

                <Card>
                  <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>Detailed list of transactions for {selectedAccount.name}.</CardDescription>
                    <div className="mt-4 flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-grow">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search transactions..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-8 w-full"
                        />
                      </div>
                      <Select value={filterType} onValueChange={(value) => setFilterType(value as any)}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                          <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="income">Income</SelectItem>
                          <SelectItem value="expense">Expense</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as any)}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                           <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {filteredTransactions.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Payee/Payer</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="text-center">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTransactions.map((txn) => (
                          <TableRow key={txn.id}>
                            <TableCell>{new Date(txn.date).toLocaleDateString()}</TableCell>
                            <TableCell className="font-medium">{txn.description}</TableCell>
                            <TableCell className="text-muted-foreground">{txn.payeePayer}</TableCell>
                            <TableCell className="text-muted-foreground">{txn.category}</TableCell>
                            <TableCell 
                              className={`text-right font-semibold ${txn.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                            >
                              {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount, selectedAccount.currency)}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant={getStatusBadgeVariant(txn.status)}>{txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <p>No transactions match your current filters.</p>
                        </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
            <PageFooter />
          </main>
        </ScrollArea>
      </div>

      <Dialog open={isStatementDialogOpen} onOpenChange={setIsStatementDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Download Statement</DialogTitle>
            <DialogDescription>
              Select the period for your account statement for {selectedAccount?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {/* Placeholder for statement options, e.g., date range picker */}
            <p className="text-sm text-muted-foreground">
              Statement download options (e.g., date range, format) would appear here. For now, this is a placeholder.
            </p>
            <Select defaultValue="last30">
                <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="last30">Last 30 Days</SelectItem>
                    <SelectItem value="last90">Last 90 Days</SelectItem>
                    <SelectItem value="custom">Custom Range (Not Implemented)</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatementDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => { alert('Downloading statement (placeholder)...'); setIsStatementDialogOpen(false); }}>Download</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountsManagementPage;