
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
import { AlertTriangle, CheckCircle, PackageSearch, SlidersHorizontal } from 'lucide-react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const inventoryItems = [
  { id: '1', name: 'Basmati Rice (1kg)', category: 'Grains', stock: 150, threshold: 20, status: 'In Stock' },
  { id: '2', name: 'Organic Apples', category: 'Fruits', stock: 8, threshold: 10, status: 'Low Stock' },
  { id: '3', name: 'Fresh Milk (1L)', category: 'Dairy', stock: 75, threshold: 15, status: 'In Stock' },
  { id: '4', name: 'Whole Wheat Bread', category: 'Bakery', stock: 0, threshold: 5, status: 'Out of Stock' },
  { id: '5', name: 'Chicken Breast (500g)', category: 'Meat', stock: 40, threshold: 10, status: 'In Stock' },
];

export default function InventoryPage() {
  const t = useTranslations('InventoryPage');
  const tg = useTranslations('General');
  const [isAdjustModalOpen, setIsAdjustModalOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<typeof inventoryItems[0] | null>(null);

  const handleOpenAdjustModal = (product: typeof inventoryItems[0]) => {
    setSelectedProduct(product);
    setIsAdjustModalOpen(true);
  };
  
  const handleCloseAdjustModal = () => {
    setIsAdjustModalOpen(false);
    setSelectedProduct(null);
  };

  const getStatusBadge = (item: typeof inventoryItems[0]) => {
    if (item.stock === 0) return <Badge variant="destructive" className="items-center gap-1"><AlertTriangle className="h-3 w-3"/>{t('statusOutOfStock')}</Badge>;
    if (item.stock < item.threshold) return <Badge variant="secondary" className="items-center gap-1 bg-yellow-400/20 text-yellow-700 hover:bg-yellow-400/30 border-yellow-400/50"><AlertTriangle className="h-3 w-3"/>{t('statusLowStock')}</Badge>;
    return <Badge variant="default" className="items-center gap-1 bg-green-500/20 text-green-700 hover:bg-green-500/30 border-green-500/50"><CheckCircle className="h-3 w-3"/>{t('statusInStock')}</Badge>;
  };

  return (
    <>
      <PageHeader
        title={t('title')}
        description={t('description')}
        actions={
          <div className="flex gap-2">
            <Input type="search" placeholder={t('searchProductPlaceholder')} className="max-w-xs" />
            <Button variant="outline"><PackageSearch className="mr-2 h-4 w-4" /> {t('filterButton')}</Button>
          </div>
        }
      />

      <Dialog open={isAdjustModalOpen} onOpenChange={setIsAdjustModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-headline">{t('adjustStockModalTitle', {productName: selectedProduct?.name})}</DialogTitle>
            <DialogDescription>
              {t('adjustStockModalDescription', {stockCount: selectedProduct?.stock})}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="adjustment-type">{t('adjustmentTypeLabel')}</Label>
              <Select defaultValue="add">
                <SelectTrigger id="adjustment-type">
                  <SelectValue placeholder={t('selectTypePlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">{t('addStockOption')}</SelectItem>
                  <SelectItem value="remove">{t('removeStockOption')}</SelectItem>
                  <SelectItem value="set">{t('setQuantityOption')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quantity">{t('quantityLabel')}</Label>
              <Input id="quantity" type="number" placeholder="0" />
            </div>
            <div>
              <Label htmlFor="notes">{t('notesLabel')}</Label>
              <Input id="notes" placeholder={t('notesPlaceholder')} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseAdjustModal}>{tg('cancel')}</Button>
            <Button type="submit" onClick={handleCloseAdjustModal}>{t('adjustStockButton')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('tableHeaderProductName')}</TableHead>
              <TableHead>{t('tableHeaderCategory')}</TableHead>
              <TableHead className="text-right">{t('tableHeaderCurrentStock')}</TableHead>
              <TableHead className="text-right">{t('tableHeaderLowStockThreshold')}</TableHead>
              <TableHead>{t('tableHeaderStatus')}</TableHead>
              <TableHead className="text-right">{t('tableHeaderActions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell className="text-right font-semibold">{item.stock}</TableCell>
                <TableCell className="text-right">{item.threshold}</TableCell>
                <TableCell>{getStatusBadge(item)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => handleOpenAdjustModal(item)}>
                    <SlidersHorizontal className="mr-2 h-3 w-3" /> {t('actionAdjust')}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
       {inventoryItems.length === 0 && (
         <div className="text-center py-10 text-muted-foreground">
            {t('noInventoryItems')}
        </div>
      )}
    </>
  );
}
