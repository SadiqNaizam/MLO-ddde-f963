import React, { useState } from 'react';
// import { Link } from 'react-router-dom'; // Not directly used in page content, sidebar handles nav

// Custom Layout Components
import MainHeader from '@/components/layout/MainHeader';
import CollapsibleSidebar from '@/components/layout/CollapsibleSidebar';
import PageFooter from '@/components/layout/PageFooter';

// shadcn/ui Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // For non-react-hook-form forms
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Icons
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

// React Hook Form
import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod"; // Not using Zod for this example
// import * as z from "zod";

// Placeholder data types
interface Account { id: string; name: string; balance: number; currency: string; }
interface Biller { id: string; name: string; }
interface Payee { id: string; name: string; accountNumber: string; bankName: string; }
interface ScheduledTransaction {
  id: string;
  date: string;
  type: 'Transfer' | 'Bill Payment';
  payeeName: string;
  amount: number;
  currency: string;
  frequency: string;
  status: 'Scheduled' | 'Processing' | 'Completed' | 'Failed';
}

// Placeholder data
const userAccounts: Account[] = [
  { id: 'acc1', name: 'Primary Checking (*** 1234)', balance: 5250.75, currency: 'USD' },
  { id: 'acc2', name: 'High-Yield Savings (*** 5678)', balance: 15820.00, currency: 'USD' },
];

const billers: Biller[] = [
  { id: 'biller1', name: 'City Electric & Gas' },
  { id: 'biller2', name: 'AquaFlow Water Services' },
  { id: 'biller3', name: 'ConnectNet ISP' },
  { id: 'biller4', name: 'County Property Tax' },
];

const initialPayees: Payee[] = [
  { id: 'payee1', name: 'John Doe (Contractor)', accountNumber: '1234567890', bankName: 'Global National Bank' },
  { id: 'payee2', name: 'Landlord Property Mgmt', accountNumber: '0987654321', bankName: 'Community First CU' },
];

const initialScheduledTransactions: ScheduledTransaction[] = [
  { id: 'st1', date: 'Next 1st of month', type: 'Bill Payment', payeeName: 'City Electric & Gas', amount: 75.50, currency: 'USD', frequency: 'Monthly', status: 'Scheduled' },
  { id: 'st2', date: 'Next 5th of month', type: 'Transfer', payeeName: 'High-Yield Savings (*** 5678)', amount: 500.00, currency: 'USD', frequency: 'Monthly', status: 'Scheduled' },
  { id: 'st3', date: 'July 15, 2024', type: 'Bill Payment', payeeName: 'ConnectNet ISP', amount: 59.99, currency: 'USD', frequency: 'Monthly', status: 'Completed' },
];

// Form schemas (basic, no Zod)
type TransferFormValues = {
  fromAccount: string;
  toAccount: string; // Could be an account number or a selected payee ID
  amount: string; // String for input, convert to number on submit
  transferType: 'own' | 'domestic' | 'international';
  description?: string;
};

type BillPayFormValues = {
  billerId: string;
  billAccountNumber: string;
  billAmount: string;
  paymentAccountId: string;
};

type PayeeFormValues = {
  payeeName: string;
  payeeAccountNumber: string;
  payeeBankName: string;
};

const TransfersAndPaymentsPage = () => {
  console.log('TransfersAndPaymentsPage loaded');

  const [payees, setPayees] = useState<Payee[]>(initialPayees);
  const [scheduledTransactions, setScheduledTransactions] = useState<ScheduledTransaction[]>(initialScheduledTransactions);

  const [isAddPayeeDialogOpen, setIsAddPayeeDialogOpen] = useState(false);
  const [isEditPayeeDialogOpen, setIsEditPayeeDialogOpen] = useState(false);
  const [editingPayee, setEditingPayee] = useState<Payee | null>(null);

  const transferForm = useForm<TransferFormValues>({
    defaultValues: { fromAccount: '', toAccount: '', amount: '', transferType: 'domestic', description: '' },
  });

  const billPayForm = useForm<BillPayFormValues>({
    defaultValues: { billerId: '', billAccountNumber: '', billAmount: '', paymentAccountId: '' },
  });
  
  const addPayeeForm = useForm<PayeeFormValues>({
    defaultValues: { payeeName: '', payeeAccountNumber: '', payeeBankName: '' }
  });

  const editPayeeForm = useForm<PayeeFormValues>();


  const onTransferSubmit = (data: TransferFormValues) => {
    console.log('Transfer submitted:', data);
    alert(`Transfer initiated for $${data.amount} from ${data.fromAccount} to ${data.toAccount}. (Placeholder)`);
    transferForm.reset();
  };

  const onBillPaySubmit = (data: BillPayFormValues) => {
    console.log('Bill payment submitted:', data);
    const selectedBiller = billers.find(b => b.id === data.billerId);
    alert(`Bill payment for ${selectedBiller?.name} of $${data.billAmount} initiated. (Placeholder)`);
    billPayForm.reset();
  };

  const onAddPayeeSubmit = (data: PayeeFormValues) => {
    console.log('Add payee:', data);
    const newPayee: Payee = { ...data, id: `payee${payees.length + 1}`};
    setPayees(prev => [...prev, newPayee]);
    alert(`Payee "${data.payeeName}" added. (Placeholder)`);
    addPayeeForm.reset();
    setIsAddPayeeDialogOpen(false);
  };
  
  const openEditPayeeDialog = (payee: Payee) => {
    setEditingPayee(payee);
    editPayeeForm.reset({ // Pre-fill edit form
        payeeName: payee.name,
        payeeAccountNumber: payee.accountNumber,
        payeeBankName: payee.bankName
    });
    setIsEditPayeeDialogOpen(true);
  };

  const onEditPayeeSubmit = (data: PayeeFormValues) => {
    if (!editingPayee) return;
    console.log('Edit payee:', data);
    setPayees(prev => prev.map(p => p.id === editingPayee.id ? { ...editingPayee, ...data } : p));
    alert(`Payee "${data.payeeName}" updated. (Placeholder)`);
    setIsEditPayeeDialogOpen(false);
    setEditingPayee(null);
  };

  const handleDeletePayee = (payeeId: string) => {
    if (window.confirm("Are you sure you want to delete this payee? This action cannot be undone.")) {
      setPayees(prev => prev.filter(p => p.id !== payeeId));
      alert(`Payee deleted. (Placeholder)`);
    }
  };
  
  const handleDeleteScheduledTransaction = (txId: string) => {
    if (window.confirm("Are you sure you want to delete this scheduled transaction?")) {
      setScheduledTransactions(prev => prev.filter(tx => tx.id !== txId));
      alert(`Scheduled transaction deleted. (Placeholder)`);
    }
  };


  return (
    <div className="flex h-screen bg-muted/40">
      <CollapsibleSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <MainHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Transfers & Payments</h1>
            <p className="text-sm text-muted-foreground">
              Manage your funds, pay bills, and set up recurring transactions with ease.
            </p>
          </div>

          <Tabs defaultValue="make-transfer" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-1.5 mb-6">
              <TabsTrigger value="make-transfer">Make a Transfer</TabsTrigger>
              <TabsTrigger value="pay-bills">Pay Bills</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="payees">Manage Payees</TabsTrigger>
            </TabsList>

            {/* Make a Transfer Tab */}
            <TabsContent value="make-transfer">
              <Card>
                <CardHeader>
                  <CardTitle>New Fund Transfer</CardTitle>
                  <CardDescription>Securely transfer funds between your accounts or to external recipients.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...transferForm}>
                    <form onSubmit={transferForm.handleSubmit(onTransferSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField control={transferForm.control} name="fromAccount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>From Account</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select source account" /></SelectTrigger></FormControl>
                                <SelectContent>
                                  {userAccounts.map(acc => (
                                    <SelectItem key={acc.id} value={acc.id}>
                                      {acc.name} - ${acc.balance.toFixed(2)} {acc.currency}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )} />
                        <FormField control={transferForm.control} name="toAccount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>To Account / Payee</FormLabel>
                              {/* Could be a combined Select or an Input with autocomplete */}
                              <FormControl><Input {...field} placeholder="Enter account number or select payee" /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                      </div>
                      <FormField control={transferForm.control} name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount (USD)</FormLabel>
                            <FormControl><Input type="number" {...field} placeholder="0.00" step="0.01" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      <FormField control={transferForm.control} name="transferType"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Transfer Type</FormLabel>
                            <FormControl>
                              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col sm:flex-row sm:space-x-4 sm:space-y-0 space-y-1">
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl><RadioGroupItem value="own" /></FormControl>
                                  <FormLabel className="font-normal">Own Account</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl><RadioGroupItem value="domestic" /></FormControl>
                                  <FormLabel className="font-normal">Domestic</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-2 space-y-0">
                                  <FormControl><RadioGroupItem value="international" /></FormControl>
                                  <FormLabel className="font-normal">International</FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      <FormField control={transferForm.control} name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description (Optional)</FormLabel>
                            <FormControl><Textarea {...field} placeholder="E.g., Monthly rent, Payment for services" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      <Button type="submit" className="w-full md:w-auto">Initiate Transfer</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Pay Bills Tab */}
            <TabsContent value="pay-bills">
              <Card>
                <CardHeader>
                  <CardTitle>Pay a Bill</CardTitle>
                  <CardDescription>Settle your bills quickly and easily from your accounts.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...billPayForm}>
                    <form onSubmit={billPayForm.handleSubmit(onBillPaySubmit)} className="space-y-6">
                       <FormField control={billPayForm.control} name="billerId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Select Biller</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Choose a biller" /></SelectTrigger></FormControl>
                              <SelectContent>
                                {billers.map(b => (<SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )} />
                      <FormField control={billPayForm.control} name="billAccountNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Account Number with Biller</FormLabel>
                            <FormControl><Input {...field} placeholder="Enter your account number for this biller" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      <FormField control={billPayForm.control} name="billAmount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount (USD)</FormLabel>
                            <FormControl><Input type="number" {...field} placeholder="0.00" step="0.01" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      <FormField control={billPayForm.control} name="paymentAccountId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pay From Account</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select account to pay from" /></SelectTrigger></FormControl>
                              <SelectContent>
                                {userAccounts.map(acc => (
                                  <SelectItem key={acc.id} value={acc.id}>
                                    {acc.name} - ${acc.balance.toFixed(2)} {acc.currency}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )} />
                      <Button type="submit" className="w-full md:w-auto">Pay Bill</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Scheduled Transactions Tab */}
            <TabsContent value="scheduled">
              <Card>
                <CardHeader>
                  <CardTitle>Scheduled Transactions</CardTitle>
                  <CardDescription>View and manage your upcoming and recurring payments.</CardDescription>
                </CardHeader>
                <CardContent>
                  {scheduledTransactions.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date/Frequency</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Payee/Biller/To Account</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {scheduledTransactions.map(tx => (
                          <TableRow key={tx.id}>
                            <TableCell>{tx.date} ({tx.frequency})</TableCell>
                            <TableCell>{tx.type}</TableCell>
                            <TableCell>{tx.payeeName}</TableCell>
                            <TableCell className="text-right">${tx.amount.toFixed(2)} {tx.currency}</TableCell>
                            <TableCell>{tx.status}</TableCell>
                            <TableCell className="text-right space-x-1">
                              <Button variant="ghost" size="icon" onClick={() => alert(`Editing ${tx.id} (placeholder)`)} title="Edit">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteScheduledTransaction(tx.id)} title="Delete">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No scheduled transactions found.</p>
                  )}
                </CardContent>
                 <CardFooter className="flex justify-end border-t pt-4">
                    <Button variant="outline"><PlusCircle className="mr-2 h-4 w-4" /> Schedule New Transaction</Button>
                  </CardFooter>
              </Card>
            </TabsContent>

            {/* Manage Payees Tab */}
            <TabsContent value="payees">
              <Card>
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                        <CardTitle>Manage Payees</CardTitle>
                        <CardDescription>Add, edit, or remove your saved payees for quick transfers.</CardDescription>
                    </div>
                    <DialogTrigger asChild>
                        <Button onClick={() => { addPayeeForm.reset(); setIsAddPayeeDialogOpen(true); }} className="w-full sm:w-auto">
                            <PlusCircle className="mr-2 h-4 w-4" /> Add New Payee
                        </Button>
                    </DialogTrigger>
                </CardHeader>
                <CardContent>
                  {payees.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Payee Name</TableHead>
                          <TableHead>Account Number</TableHead>
                          <TableHead>Bank</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payees.map(payee => (
                          <TableRow key={payee.id}>
                            <TableCell className="font-medium">{payee.name}</TableCell>
                            <TableCell>...{payee.accountNumber.slice(-4)}</TableCell> {/* Masked for display */}
                            <TableCell>{payee.bankName}</TableCell>
                            <TableCell className="text-right space-x-1">
                              <Button variant="ghost" size="icon" onClick={() => openEditPayeeDialog(payee)} title="Edit">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeletePayee(payee.id)} title="Delete">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                     <p className="text-muted-foreground text-center py-8">No payees found. Add a new payee to get started.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
        <PageFooter />
      </div>

      {/* Add Payee Dialog */}
      <Dialog open={isAddPayeeDialogOpen} onOpenChange={setIsAddPayeeDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Payee</DialogTitle>
            <DialogDescription>Enter the details of the new payee. Click save when you're done.</DialogDescription>
          </DialogHeader>
          <Form {...addPayeeForm}>
            <form onSubmit={addPayeeForm.handleSubmit(onAddPayeeSubmit)} className="space-y-4 py-2">
                <FormField control={addPayeeForm.control} name="payeeName" rules={{ required: "Payee name is required." }}
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Payee Name</FormLabel>
                        <FormControl><Input {...field} placeholder="E.g., John Smith or Company Inc." /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )} />
                <FormField control={addPayeeForm.control} name="payeeAccountNumber" rules={{ required: "Account number is required." }}
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Account Number</FormLabel>
                        <FormControl><Input {...field} placeholder="Payee's bank account number" /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )} />
                <FormField control={addPayeeForm.control} name="payeeBankName" rules={{ required: "Bank name is required." }}
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Bank Name</FormLabel>
                        <FormControl><Input {...field} placeholder="Name of the payee's bank" /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )} />
                <DialogFooter className="pt-2">
                    <Button type="button" variant="outline" onClick={() => setIsAddPayeeDialogOpen(false)}>Cancel</Button>
                    <Button type="submit">Save Payee</Button>
                </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Payee Dialog */}
      {editingPayee && (
        <Dialog open={isEditPayeeDialogOpen} onOpenChange={setIsEditPayeeDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Edit Payee: {editingPayee.name}</DialogTitle>
                <DialogDescription>Update the details for this payee. Click save when you're done.</DialogDescription>
            </DialogHeader>
            <Form {...editPayeeForm}>
                <form onSubmit={editPayeeForm.handleSubmit(onEditPayeeSubmit)} className="space-y-4 py-2">
                    <FormField control={editPayeeForm.control} name="payeeName" rules={{ required: "Payee name is required." }}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Payee Name</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )} />
                    <FormField control={editPayeeForm.control} name="payeeAccountNumber" rules={{ required: "Account number is required." }}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Account Number</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )} />
                    <FormField control={editPayeeForm.control} name="payeeBankName" rules={{ required: "Bank name is required." }}
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bank Name</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )} />
                    <DialogFooter className="pt-2">
                        <Button type="button" variant="outline" onClick={() => setIsEditPayeeDialogOpen(false)}>Cancel</Button>
                        <Button type="submit">Save Changes</Button>
                    </DialogFooter>
                </form>
            </Form>
            </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TransfersAndPaymentsPage;