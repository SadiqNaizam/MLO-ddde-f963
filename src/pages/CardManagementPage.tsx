import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Custom Layout Components
import MainHeader from '@/components/layout/MainHeader';
import CollapsibleSidebar from '@/components/layout/CollapsibleSidebar';
import PageFooter from '@/components/layout/PageFooter';

// Shadcn/ui Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

// Lucide Icons
import { Settings, AlertTriangle, Eye, EyeOff, PlusCircle, ChevronDown, Replace, CreditCard as CreditCardIcon } from 'lucide-react';

// Placeholder data types
interface CardData {
  id: string;
  name: string;
  last4: string;
  expiry: string;
  type: 'Visa Debit' | 'Mastercard Credit' | 'Amex Credit' | 'Other';
  status: 'Active' | 'Locked' | 'Expired' | 'Lost/Stolen';
  cardArtUrl: string;
  fullCardNumber?: string; // For secure display
}

interface TransactionData {
  id: string;
  date: string;
  description: string;
  amount: number;
  currency: string;
}

// Placeholder data
const sampleCards: CardData[] = [
  { id: 'card1', name: 'Primary Debit Card', last4: '1234', expiry: '12/25', type: 'Visa Debit', status: 'Active', cardArtUrl: 'https://placehold.co/300x180/007bff/white?text=VISA&font=roboto', fullCardNumber: '4111222233331234' },
  { id: 'card2', name: 'Platinum Rewards', last4: '5678', expiry: '11/26', type: 'Mastercard Credit', status: 'Active', cardArtUrl: 'https://placehold.co/300x180/ff5f00/white?text=Mastercard&font=roboto', fullCardNumber: '5222333344445678' },
  { id: 'card3', name: 'Business Amex', last4: '9012', expiry: '08/24', type: 'Amex Credit', status: 'Locked', cardArtUrl: 'https://placehold.co/300x180/333333/white?text=AMEX&font=roboto', fullCardNumber: '3777888899999012' },
];

const sampleCardTransactions: Record<string, TransactionData[]> = {
  card1: [
    { id: 'tx1', date: '2024-07-30', description: 'Spotify Subscription', amount: -9.99, currency: 'USD' },
    { id: 'tx2', date: '2024-07-29', description: 'Grocery Store', amount: -75.20, currency: 'USD' },
    { id: 'tx3', date: '2024-07-28', description: 'ATM Withdrawal', amount: -100.00, currency: 'USD' },
  ],
  card2: [
    { id: 'tx4', date: '2024-07-28', description: 'Restaurant Le Gourmet', amount: -150.50, currency: 'USD' },
    { id: 'tx5', date: '2024-07-27', description: 'Flight Tickets', amount: -450.00, currency: 'USD' },
  ],
  card3: [],
};

const CardManagementPage = () => {
  console.log('CardManagementPage loaded');
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [isControlsDialogOpen, setIsControlsDialogOpen] = useState(false);
  const [isViewDetailsDialogOpen, setIsViewDetailsDialogOpen] = useState(false);
  const [showFullCardNumber, setShowFullCardNumber] = useState(false);

  const handleOpenDialog = (dialogSetter: React.Dispatch<React.SetStateAction<boolean>>, card: CardData) => {
    setSelectedCard(card);
    dialogSetter(true);
  };
  
  const handleCloseDialog = (dialogSetter: React.Dispatch<React.SetStateAction<boolean>>) => {
    dialogSetter(false);
    setSelectedCard(null); // Clear selected card when any dialog closes
    setShowFullCardNumber(false); // Reset sensitive data display
  };


  return (
    <div className="flex min-h-screen w-full bg-muted/40 dark:bg-black">
      <CollapsibleSidebar />
      <div className="flex flex-col flex-1">
        <MainHeader />
        <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8 md:p-6">
          <header className="mb-6 pt-4 md:pt-0">
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl text-foreground">Card Management</h1>
            <p className="text-sm text-muted-foreground">
              Manage your debit and credit cards, view transactions, and set card controls.
            </p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {sampleCards.map((card) => (
              <Card key={card.id} className="flex flex-col shadow-md hover:shadow-lg transition-shadow bg-card text-card-foreground">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{card.name}</CardTitle>
                    <Badge variant={card.status === 'Active' ? 'default' : (card.status === 'Locked' ? 'secondary' : 'destructive')}>
                      {card.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Ending in **** {card.last4}</p>
                  <p className="text-xs text-muted-foreground">Expires: {card.expiry}</p>
                </CardHeader>
                <CardContent className="flex-grow">
                   <img src={card.cardArtUrl} alt={`${card.type} card art`} className="w-full aspect-[16/10] object-cover rounded-md mb-4"/>
                   <p className="text-sm font-medium text-muted-foreground">{card.type}</p>
                </CardContent>
                <CardFooter className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:justify-end pt-4 border-t">
                  <Button variant="outline" size="sm" onClick={() => handleOpenDialog(setIsViewDetailsDialogOpen, card)}>View Details</Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">Actions <ChevronDown className="ml-1 h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleOpenDialog(setIsControlsDialogOpen, card)}>
                        <Settings className="mr-2 h-4 w-4" /> Manage Controls
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => alert('Request Replacement functionality TBD.')}>
                        <Replace className="mr-2 h-4 w-4" /> Request Replacement
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleOpenDialog(setIsReportDialogOpen, card)} 
                        className="text-red-600 focus:text-red-500 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/50"
                      >
                        <AlertTriangle className="mr-2 h-4 w-4" /> Report Lost/Stolen
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
            <Card className="flex flex-col items-center justify-center border-2 border-dashed border-border hover:border-primary transition-colors bg-card text-card-foreground p-6">
                <CreditCardIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <CardTitle className="text-lg text-center mb-2">Add New Card</CardTitle>
                <CardDescription className="text-sm text-muted-foreground text-center mb-4">
                    Securely link a new debit or credit card to your account.
                </CardDescription>
                <Button variant="outline" size="lg" onClick={() => alert('Add new card functionality TBD')}>
                    <PlusCircle className="mr-2 h-5 w-5" /> Add Card
                </Button>
            </Card>
          </section>

          {/* Report Lost/Stolen Dialog */}
          <Dialog open={isReportDialogOpen} onOpenChange={(open) => !open && handleCloseDialog(setIsReportDialogOpen)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Report Card: {selectedCard?.name}</DialogTitle>
                <DialogDescription>
                  Reporting your card <span className="font-semibold">{selectedCard?.type} ending in {selectedCard?.last4}</span> as lost or stolen will immediately block it and a replacement process may be initiated. Are you sure you want to proceed?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => handleCloseDialog(setIsReportDialogOpen)}>Cancel</Button>
                <Button variant="destructive" onClick={() => { alert(`Card ${selectedCard?.name} reported!`); handleCloseDialog(setIsReportDialogOpen); }}>Confirm Report</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Manage Controls Dialog */}
          <Dialog open={isControlsDialogOpen} onOpenChange={(open) => !open && handleCloseDialog(setIsControlsDialogOpen)}>
             <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Manage Controls: {selectedCard?.name}</DialogTitle>
                    <DialogDescription>
                        Adjust limits and permissions for your card ending in {selectedCard?.last4}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="spendingLimit" className="text-sm font-medium">Daily Spending Limit ($)</Label>
                        <Input id="spendingLimit" type="number" defaultValue="5000" placeholder="e.g., 5000" />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                            <Label htmlFor="onlineTransactions" className="text-sm font-medium">Online Transactions</Label>
                            <p className="text-xs text-muted-foreground">Allow or block payments on websites and apps.</p>
                        </div>
                        <Switch id="onlineTransactions" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                         <div className="space-y-0.5">
                            <Label htmlFor="contactlessPayments" className="text-sm font-medium">Contactless Payments</Label>
                            <p className="text-xs text-muted-foreground">Enable or disable tap-to-pay functionality.</p>
                        </div>
                        <Switch id="contactlessPayments" defaultChecked />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="travelNotice" className="text-sm font-medium">Travel Notice (Destination)</Label>
                        <Input id="travelNotice" placeholder="e.g., Spain, France (Optional)" />
                         <p className="text-xs text-muted-foreground">Inform us of upcoming travel to avoid service interruptions.</p>
                    </div>
                </div>
                <DialogFooter className="mt-2">
                    <Button variant="outline" onClick={() => handleCloseDialog(setIsControlsDialogOpen)}>Cancel</Button>
                    <Button type="submit" onClick={() => { alert(`Controls for ${selectedCard?.name} updated!`); handleCloseDialog(setIsControlsDialogOpen);}}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* View Card Details Dialog */}
           <Dialog open={isViewDetailsDialogOpen} onOpenChange={(open) => !open && handleCloseDialog(setIsViewDetailsDialogOpen)}>
            <DialogContent className="sm:max-w-lg md:max-w-2xl lg:max-w-3xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Details for: {selectedCard?.name}</DialogTitle>
                    <DialogDescription>
                        View full card information and recent transaction history for card ending in {selectedCard?.last4}.
                    </DialogDescription>
                </DialogHeader>
                <ScrollArea className="flex-grow pr-6 -mr-6 my-4">
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Card Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex justify-between"><span>Card Type:</span> <strong className="text-foreground">{selectedCard?.type}</strong></div>
                                <div className="flex justify-between"><span>Card Network:</span> <strong className="text-foreground">{selectedCard?.type.split(' ')[0]}</strong></div>
                                <div className="flex justify-between items-center">
                                    <span>Full Card Number:</span>
                                    <div className="flex items-center gap-2">
                                        <strong className="text-foreground font-mono tracking-wider">
                                          {showFullCardNumber ? selectedCard?.fullCardNumber?.replace(/(\d{4})/g, '$1 ').trim() : `**** **** **** ${selectedCard?.last4}`}
                                        </strong>
                                        <Button variant="ghost" size="icon" onClick={() => setShowFullCardNumber(!showFullCardNumber)} aria-label={showFullCardNumber ? "Hide card number" : "Show card number"}>
                                            {showFullCardNumber ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex justify-between"><span>Expiry Date:</span> <strong className="text-foreground">{selectedCard?.expiry}</strong></div>
                                <div className="flex justify-between"><span>CVV/CVC:</span> <strong className="text-foreground">{showFullCardNumber ? '123' : '***'}</strong></div>
                                <div className="flex justify-between"><span>Status:</span> <Badge variant={selectedCard?.status === 'Active' ? 'default' : (selectedCard?.status === 'Locked' ? 'secondary' : 'destructive')}>{selectedCard?.status}</Badge></div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Recent Transactions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {selectedCard && sampleCardTransactions[selectedCard.id]?.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[100px]">Date</TableHead>
                                                <TableHead>Description</TableHead>
                                                <TableHead className="text-right">Amount</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {sampleCardTransactions[selectedCard.id].map(tx => (
                                                <TableRow key={tx.id}>
                                                    <TableCell className="text-xs">{tx.date}</TableCell>
                                                    <TableCell className="font-medium">{tx.description}</TableCell>
                                                    <TableCell className={`text-right font-semibold ${tx.amount < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                                                        {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <p className="text-muted-foreground text-center py-8 text-sm">No transactions found for this card in the selected period.</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </ScrollArea>
                <DialogFooter className="pt-4 mt-auto border-t">
                    <Button variant="outline" onClick={() => handleCloseDialog(setIsViewDetailsDialogOpen)}>Close</Button>
                </DialogFooter>
            </DialogContent>
          </Dialog>

        </main>
        <PageFooter />
      </div>
    </div>
  );
};

export default CardManagementPage;