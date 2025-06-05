
'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import PageHeader from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { HandCoins, UserSearch, Eye, MoreHorizontal, Printer } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrency } from '@/contexts/currency-context';

interface CustomerDebt {
  id: string;
  customerName: string;
  totalDebtUSD: number; 
  lastPayment: string;
  status: string;
}

const initialCustomerDebts: CustomerDebt[] = [
  { id: 'D001', customerName: 'Ahmed Ali', totalDebtUSD: 150.75, lastPayment: '2024-07-10', status: 'Overdue' },
  { id: 'D002', customerName: 'Fatima K.', totalDebtUSD: 75.00, lastPayment: '2024-07-19', status: 'Pending' },
  { id: 'D003', customerName: 'Omar Z.', totalDebtUSD: 0.00, lastPayment: '2024-07-19', status: 'Paid' }, 
  { id: 'D004', customerName: 'Layla M.', totalDebtUSD: 250.00, lastPayment: '2024-06-25', status: 'Overdue' },
  { id: 'D005', customerName: 'Youssef H.', totalDebtUSD: 30.50, lastPayment: '2024-07-15', status: 'Pending' },
];

export default function DebtsPage() {
  const t = useTranslations('DebtsPage');
  const tg = useTranslations('General');
  const { formatCurrency, selectedCurrency, convertToSelectedCurrency } = useCurrency();
  const [customerDebts, setCustomerDebts] = React.useState<CustomerDebt[]>(initialCustomerDebts);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = React.useState(false);
  const [selectedDebt, setSelectedDebt] = React.useState<CustomerDebt | null>(null);
  const [paymentAmount, setPaymentAmount] = React.useState('');


  const handleOpenPaymentModal = (debt: CustomerDebt) => {
    setSelectedDebt(debt);
    setPaymentAmount(convertToSelectedCurrency(debt.totalDebtUSD).toFixed(selectedCurrency.code === 'IQD' ? 0 : 2));
    setIsPaymentModalOpen(true);
  };
  
  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedDebt(null);
    setPaymentAmount('');
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Paid': return 'default'; 
      case 'Pending': return 'secondary'; 
      case 'Overdue': return 'destructive'; 
      default: return 'outline';
    }
  };
  
  const getStatusTranslation = (status: string) => {
    if (status === 'Paid') return t('statusPaid');
    if (status === 'Pending') return t('statusPending');
    if (status === 'Overdue') return t('statusOverdue');
    return status;
  }


  return (
    <>
      <PageHeader
        title={t('title')}
        description={t('description')}
        actions={
          <div className="flex gap-2">
            <Input type="search" placeholder={t('searchCustomersPlaceholder')} className="max-w-xs" />
            <Button variant="outline"><UserSearch className="mr-2 h-4 w-4" /> {t('filterButton')}</Button>
            <Button variant="default"><Printer className="mr-2 h-4 w-4" /> {t('generateReportButton')}</Button>
          </div>
        }
      />

      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-headline">{t('recordPaymentModalTitle', {customerName: selectedDebt?.customerName})}</DialogTitle>
            <DialogDescription>
              {t('recordPaymentModalDescription', {debtAmount: selectedDebt ? formatCurrency(selectedDebt.totalDebtUSD) : ''})}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="payment-amount">{t('paymentAmountLabel', {currencySymbol: selectedCurrency.symbol})}</Label>
              <Input 
                id="payment-amount" 
                type="number" 
                placeholder="0.00" 
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="payment-date">{t('paymentDateLabel')}</Label>
              <Input id="payment-date" type="date" defaultValue={new Date().toISOString().substring(0, 10)} />
            </div>
             <div>
              <Label htmlFor="payment-notes">{t('paymentNotesLabel')}</Label>
              <Input id="payment-notes" placeholder={t('paymentNotesPlaceholder')} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleClosePaymentModal}>{tg('cancel')}</Button>
            <Button type="submit" onClick={handleClosePaymentModal}>{t('recordPaymentButton')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('tableHeaderCustomerName')}</TableHead>
              <TableHead className="text-right">{t('tableHeaderTotalDebt', { currencySymbol: selectedCurrency.symbol })}</TableHead>
              <TableHead>{t('tableHeaderLastPayment')}</TableHead>
              <TableHead>{t('tableHeaderStatus')}</TableHead>
              <TableHead className="text-right">{t('tableHeaderActions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customerDebts.filter(d => d.totalDebtUSD > 0).map((debt) => ( 
              <TableRow key={debt.id}>
                <TableCell className="font-medium">{debt.customerName}</TableCell>
                <TableCell className="text-right font-semibold">{formatCurrency(debt.totalDebtUSD)}</TableCell>
                <TableCell>{debt.lastPayment || 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(debt.status)}>{getStatusTranslation(debt.status)}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleOpenPaymentModal(debt)}>
                        <HandCoins className="mr-2 h-4 w-4" /> {t('actionRecordPayment')}
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" /> {t('actionViewHistory')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
             {customerDebts.filter(d => d.totalDebtUSD > 0).length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                        {t('noOutstandingDebts')}
                    </TableCell>
                </TableRow>
             )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
