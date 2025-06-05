
'use client'; 

import React, { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import PageHeader from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Trash2, Percent, DollarSign, Printer, Eye, MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrency } from '@/contexts/currency-context';


interface SaleItem {
  productId: string;
  name: string;
  priceUSD: number; 
  quantity: number;
}

interface Product {
    id: string;
    name: string;
    priceUSD: number; 
    stock: number;
}

const sampleRecentSales = [
  { id: 'S001', date: '2024-07-20', customer: 'Ahmed Ali', totalUSD: 125.50, status: 'Paid' },
  { id: 'S002', date: '2024-07-19', customer: 'Fatima K.', totalUSD: 75.00, status: 'Debt' },
  { id: 'S003', date: '2024-07-19', customer: 'Omar Z.', totalUSD: 210.20, status: 'Paid' },
  { id: 'S004', date: '2024-07-18', customer: 'Layla M.', totalUSD: 55.75, status: 'Debt' },
];

const sampleProducts: Product[] = [
    { id: 'P001', name: 'Basmati Rice (1kg)', priceUSD: 2.50, stock: 10 },
    { id: 'P002', name: 'Organic Apples', priceUSD: 3.00, stock: 5 },
    { id: 'P003', name: 'Fresh Milk (1L)', priceUSD: 1.20, stock: 20 },
];

export default function SalesPage() {
  const t = useTranslations('SalesPage');
  const { formatCurrency, selectedCurrency } = useCurrency();
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  const handleAddProductToCart = () => {
    const product = sampleProducts.find(p => p.id === selectedProductId);
    if (product && quantity > 0) {
      const existingItemIndex = cart.findIndex(item => item.productId === product.id);
      if (existingItemIndex > -1) {
        const updatedCart = [...cart];
        updatedCart[existingItemIndex].quantity += quantity;
        setCart(updatedCart);
      } else {
        setCart([...cart, { productId: product.id, name: product.name, priceUSD: product.priceUSD, quantity }]);
      }
      setSelectedProductId('');
      setQuantity(1);
    }
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const subtotalUSD = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.priceUSD * item.quantity, 0);
  }, [cart]);

  const discountAmountUSD = useMemo(() => {
    return subtotalUSD * (discountPercent / 100);
  }, [subtotalUSD, discountPercent]);

  const totalUSD = useMemo(() => {
    return subtotalUSD - discountAmountUSD;
  }, [subtotalUSD, discountAmountUSD]);


  return (
    <>
      <PageHeader
        title={t('title')}
        description={t('description')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">{t('newSaleCardTitle')}</CardTitle> 
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer">{t('customerLabel')}</Label>
                <Select>
                  <SelectTrigger id="customer">
                    <SelectValue placeholder={t('selectCustomerPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ahmed_ali">Ahmed Ali</SelectItem>
                    <SelectItem value="fatima_k">Fatima K.</SelectItem>
                    <SelectItem value="new_customer">{t('addNewCustomerOption')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sale-date">{t('saleDateLabel')}</Label>
                <Input id="sale-date" type="date" defaultValue={new Date().toISOString().substring(0, 10)} />
              </div>
            </div>

            <div>
              <Label htmlFor="product-search">{t('addProductLabel')}</Label>
              <div className="flex gap-2">
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger id="product-search">
                    <SelectValue placeholder={t('searchProductPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {sampleProducts.map(p => 
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} ({formatCurrency(p.priceUSD)}) - Stock: {p.stock}
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <Input 
                  type="number" 
                  placeholder={t('quantityLabel')}
                  className="w-20" 
                  value={quantity} 
                  onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                  min="1"
                />
                <Button variant="outline" size="icon" onClick={handleAddProductToCart}><PlusCircle className="h-4 w-4" /></Button>
              </div>
            </div>
            
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>{t('tableHeaderProduct')}</TableHead>
                        <TableHead className="text-center">{t('tableHeaderQuantity')}</TableHead>
                        <TableHead className="text-right">{t('tableHeaderPrice', { currencySymbol: selectedCurrency.symbol })}</TableHead>
                        <TableHead className="text-right">{t('tableHeaderTotal', { currencySymbol: selectedCurrency.symbol })}</TableHead>
                        <TableHead className="text-center">{t('tableHeaderAction')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {cart.length === 0 && (
                            <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-4">{t('noItemsInCart')}</TableCell></TableRow>
                        )}
                        {cart.map(item => (
                            <TableRow key={item.productId}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-right">{formatCurrency(item.priceUSD)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(item.priceUSD * item.quantity)}</TableCell>
                                <TableCell className="text-center">
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleRemoveFromCart(item.productId)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="discount">{t('discountLabel')}</Label>
                    <div className="flex items-center">
                        <Input 
                          id="discount" 
                          type="number" 
                          placeholder="0" 
                          className="rounded-r-none" 
                          value={discountPercent}
                          onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                          min="0"
                          max="100"
                        />
                        <span className="flex items-center justify-center px-3 border border-l-0 rounded-r-md bg-muted text-muted-foreground h-10">
                            <Percent className="h-4 w-4"/>
                        </span>
                    </div>
                </div>
                <div>
                    <Label htmlFor="payment-status">{t('paymentStatusLabel')}</Label>
                    <Select defaultValue="paid">
                        <SelectTrigger id="payment-status">
                        <SelectValue placeholder={t('selectStatusPlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="paid">{t('paidStatus')}</SelectItem>
                        <SelectItem value="debt">{t('debtStatus')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
          </CardContent>
          <Separator className="my-4" />
          <CardFooter className="flex flex-col items-end space-y-2">
            <div className="text-lg font-semibold">{t('subtotalLabel', {amount: formatCurrency(subtotalUSD)})}</div>
            <div className="text-muted-foreground">{t('discountAmountLabel', {amount: formatCurrency(discountAmountUSD)})}</div>
            <div className="text-xl font-bold text-primary">{t('totalAmountLabel', {amount: formatCurrency(totalUSD)})}</div>
            <Button size="lg" className="w-full md:w-auto mt-4">
              <DollarSign className="mr-2 h-5 w-5" /> {t('recordSaleButton')}
            </Button>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle className="font-headline">{t('recentSalesCardTitle')}</CardTitle>
            </CardHeader>
            <CardContent>
                 <div className="rounded-md border shadow-sm">
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>{t('tableHeaderID')}</TableHead>
                        <TableHead>{t('tableHeaderCustomer')}</TableHead>
                        <TableHead className="text-right">{t('tableHeaderTotalAmount', {currencySymbol: selectedCurrency.symbol})}</TableHead>
                        <TableHead>{t('tableHeaderStatus')}</TableHead>
                        <TableHead className="text-right">{t('tableHeaderActions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sampleRecentSales.slice(0,3).map((sale) => (
                        <TableRow key={sale.id}>
                            <TableCell className="font-mono text-xs">{sale.id}</TableCell>
                            <TableCell>{sale.customer}</TableCell>
                            <TableCell className="text-right">{formatCurrency(sale.totalUSD)}</TableCell>
                            <TableCell>
                            <Badge variant={sale.status === 'Paid' ? 'default' : 'destructive'}>
                                {sale.status === 'Paid' ? t('paidStatus') : t('debtStatus')}
                            </Badge>
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
                                <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" /> {t('actionViewDetails')}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Printer className="mr-2 h-4 w-4" /> {t('actionPrintReceipt')}
                                </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                 </div>
                  {sampleRecentSales.length === 0 && (
                    <div className="text-center py-10 text-muted-foreground">
                        {t('noSalesRecorded')}
                    </div>
                 )}
                 {sampleRecentSales.length > 3 && (
                    <Button variant="link" className="w-full mt-4">{t('viewAllSalesButton')}</Button>
                 )}
            </CardContent>
        </Card>
      </div>
    </>
  );
}
