
'use client';

import { useTranslations } from 'next-intl';
import PageHeader from '@/components/shared/page-header';
import StatCard from '@/components/dashboard/stat-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, Package, Users, AlertTriangle, ListChecks, TrendingUp, CreditCard } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart as RechartsBarChart } from 'recharts';
import { useCurrency } from '@/contexts/currency-context';
import type { ChartConfig } from '@/components/ui/chart';
import React from 'react';

const initialChartData = [
  { month: "Jan", salesUSD: 1860, expensesUSD: 800 },
  { month: "Feb", salesUSD: 3050, expensesUSD: 2000 },
  { month: "Mar", salesUSD: 2370, expensesUSD: 1200 },
  { month: "Apr", salesUSD: 1730, expensesUSD: 1900 },
  { month: "May", salesUSD: 2090, expensesUSD: 1300 },
  { month: "Jun", salesUSD: 2800, expensesUSD: 1600 },
];

const totalSalesUSD = 125360;
const outstandingDebtsUSD = 15820;
const recentSaleAmountUSD = 250;
const debtPaymentAmountUSD = 50;


export default function DashboardPage() {
  const t = useTranslations('DashboardPage');
  const { formatCurrency, convertToSelectedCurrency, selectedCurrency } = useCurrency();

  const chartData = React.useMemo(() => {
    return initialChartData.map(item => ({
      month: item.month,
      sales: convertToSelectedCurrency(item.salesUSD),
      expenses: convertToSelectedCurrency(item.expensesUSD),
    }));
  }, [convertToSelectedCurrency]);

  const chartConfig = React.useMemo(() => ({
    sales: {
      label: t('salesLabel', { currencySymbol: selectedCurrency.symbol }),
      color: "hsl(var(--primary))",
    },
    expenses: {
      label: t('expensesLabel', { currencySymbol: selectedCurrency.symbol }),
      color: "hsl(var(--accent))",
    },
  }) satisfies ChartConfig, [t, selectedCurrency.symbol]);


  return (
    <>
      <PageHeader
        title={t('title')}
        description={t('description')}
        actions={
          <div className="flex gap-2">
            <Button><Package className="mr-2 h-4 w-4" /> {t('addProduct')}</Button>
            <Button variant="outline"><DollarSign className="mr-2 h-4 w-4" /> {t('newSale')}</Button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatCard title={t('totalSales')} value={formatCurrency(totalSalesUSD)} icon={<DollarSign className="text-primary" />} trend={`+12.5% ${t('fromLastMonth')}`} />
        <StatCard title={t('outstandingDebts')} value={formatCurrency(outstandingDebtsUSD)} icon={<CreditCard className="text-destructive" />} trend={`5 ${t('newDebtsThisWeek')}`} />
        <StatCard title={t('activeProducts')} value="287" icon={<Package className="text-green-500" />} trend={`15 ${t('addedThisMonth')}`} />
        <StatCard title={t('customers')} value="1,205" icon={<Users className="text-blue-500" />} trend={`+50 ${t('newCustomers')}`} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-primary" /> {t('salesTrendTitle')}
            </CardTitle>
            <CardDescription>{t('salesTrendDescription')}</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <RechartsBarChart data={chartData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tickMargin={10} 
                  tickFormatter={(value) => `${selectedCurrency.symbol}${value}`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent 
                    indicator="dot" 
                    formatter={(value, name) => {
                       const label = name === 'sales' ? chartConfig.sales.label : chartConfig.expenses.label;
                       return (
                        <div className="flex flex-col">
                           <span className="text-muted-foreground">{label}</span>
                           <span>{selectedCurrency.symbol}{Number(value).toLocaleString(undefined, {minimumFractionDigits: selectedCurrency.code === 'IQD' ? 0 : 2, maximumFractionDigits: selectedCurrency.code === 'IQD' ? 0 : 2})}</span>
                        </div>
                       )
                    }}
                  />} 
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
                <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
              </RechartsBarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center">
              <ListChecks className="mr-2 h-5 w-5 text-accent" /> {t('recentActivityTitle')}
            </CardTitle>
            <CardDescription>{t('recentActivityDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">{t('salePrefix')} #1024</div>
                    <div className="text-sm text-muted-foreground">Ahmed Ali - {formatCurrency(recentSaleAmountUSD)}</div>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">{t('minutesAgo', {count: 2})}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">{t('productLowStockSuffix', { productName: "T-Shirt"})}</div>
                    <div className="text-sm text-muted-foreground">{t('itemsRemainingSuffix', {count: 5})}</div>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">{t('hoursAgo', {count: 1})}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <div className="font-medium">{t('newProductAdded')}</div>
                    <div className="text-sm text-muted-foreground">"Coffee Mug"</div>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">{t('hoursAgo', {count: 3})}</TableCell>
                </TableRow>
                 <TableRow>
                  <TableCell>
                    <div className="font-medium">{t('debtPaymentReceived')}</div>
                    <div className="text-sm text-muted-foreground">Fatima K. - {formatCurrency(debtPaymentAmountUSD)}</div>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">{t('yesterday')}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-destructive" /> {t('lowStockAlertsTitle')}
          </CardTitle>
          <CardDescription>{t('lowStockAlertsDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('tableHeaderProduct')}</TableHead>
                <TableHead>{t('tableHeaderCategory')}</TableHead>
                <TableHead className="text-right">{t('tableHeaderStock')}</TableHead>
                <TableHead className="text-right">{t('tableHeaderAction')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Red Gala Apples</TableCell>
                <TableCell>Fruits</TableCell>
                <TableCell className="text-right text-destructive font-medium">3 units</TableCell>
                <TableCell className="text-right"><Button variant="outline" size="sm">{t('restockButton')}</Button></TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Basmati Rice (1kg)</TableCell>
                <TableCell>Grains</TableCell>
                <TableCell className="text-right text-destructive font-medium">8 units</TableCell>
                <TableCell className="text-right"><Button variant="outline" size="sm">{t('restockButton')}</Button></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
