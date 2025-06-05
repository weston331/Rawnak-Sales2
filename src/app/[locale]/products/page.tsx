
'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import PageHeader from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { PlusCircle, Edit, Trash2, MoreHorizontal } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrency } from '@/contexts/currency-context';

interface Product {
  id: string;
  name: string;
  category: string;
  priceUSD: number; 
  stock: number;
  status: string;
}

const initialProducts: Product[] = [
  { id: '1', name: 'Basmati Rice (1kg)', category: 'Grains', priceUSD: 2.50, stock: 150, status: 'In Stock' },
  { id: '2', name: 'Organic Apples', category: 'Fruits', priceUSD: 3.00, stock: 8, status: 'Low Stock' },
  { id: '3', name: 'Fresh Milk (1L)', category: 'Dairy', priceUSD: 1.20, stock: 75, status: 'In Stock' },
  { id: '4', name: 'Whole Wheat Bread', category: 'Bakery', priceUSD: 2.00, stock: 0, status: 'Out of Stock' },
  { id: '5', name: 'Chicken Breast (500g)', category: 'Meat', priceUSD: 5.50, stock: 40, status: 'In Stock' },
];

export default function ProductsPage() {
  const t = useTranslations('ProductsPage');
  const tg = useTranslations('General');
  const { formatCurrency, selectedCurrency } = useCurrency();
  const [products, setProducts] = React.useState<Product[]>(initialProducts);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);

  const handleOpenModal = (product?: Product) => {
    setEditingProduct(product || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'In Stock': return 'default';
      case 'Low Stock': return 'secondary'; 
      case 'Out of Stock': return 'destructive';
      default: return 'outline';
    }
  };

  const getPurchasePriceUSD = (salePriceUSD: number) => (salePriceUSD * 0.8);

  return (
    <>
      <PageHeader
        title={t('title')}
        description={t('description')}
        actions={
          <Button onClick={() => handleOpenModal()}>
            <PlusCircle className="mr-2 h-4 w-4" /> {t('addNewProduct')}
          </Button>
        }
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="font-headline">{editingProduct ? t('editProductTitle') : t('addProductTitle')}</DialogTitle> 
            <DialogDescription>
              {editingProduct ? t('editProductDescription') : t('addProductDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">{t('nameLabel')}</Label>
              <Input id="name" defaultValue={editingProduct?.name || ""} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">{t('categoryLabel')}</Label>
              <Select defaultValue={editingProduct?.category || ""}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t('selectCategoryPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Grains">{t('grainsCategory')}</SelectItem>
                  <SelectItem value="Fruits">{t('fruitsCategory')}</SelectItem>
                  <SelectItem value="Dairy">{t('dairyCategory')}</SelectItem>
                  <SelectItem value="Bakery">{t('bakeryCategory')}</SelectItem>
                  <SelectItem value="Meat">{t('meatCategory')}</SelectItem>
                  <SelectItem value="Beverages">{t('beveragesCategory')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">{t('descriptionLabel')}</Label>
              <Textarea id="description" placeholder={t('optionalProductDescription')} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="purchase-price" className="text-right">{t('purchasePriceLabelUSD')}</Label>
              <Input id="purchase-price" type="number" defaultValue={editingProduct ? getPurchasePriceUSD(editingProduct.priceUSD).toFixed(2) : ""} className="col-span-3" placeholder="0.00"/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sale-price" className="text-right">{t('salePriceLabelUSD')}</Label>
              <Input id="sale-price" type="number" defaultValue={editingProduct?.priceUSD.toFixed(2) || ""} className="col-span-3" placeholder="0.00"/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">{t('initialStockLabel')}</Label>
              <Input id="stock" type="number" defaultValue={editingProduct?.stock.toString() || ""} className="col-span-3" placeholder="0"/>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>{tg('cancel')}</Button> 
            <Button type="submit" onClick={handleCloseModal}>{editingProduct ? t('saveChangesButton') : t('addProductButton')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('tableHeaderName')}</TableHead>
              <TableHead>{t('tableHeaderCategory')}</TableHead>
              <TableHead className="text-right">{t('tableHeaderPrice', { currencySymbol: selectedCurrency.symbol })}</TableHead>
              <TableHead className="text-right">{t('tableHeaderStock')}</TableHead>
              <TableHead>{t('tableHeaderStatus')}</TableHead>
              <TableHead className="text-right">{t('tableHeaderActions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell className="text-right">{formatCurrency(product.priceUSD)}</TableCell>
                <TableCell className="text-right">{product.stock}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(product.status)}>
                    {product.status === 'In Stock' && t('statusInStock')}
                    {product.status === 'Low Stock' && t('statusLowStock')}
                    {product.status === 'Out of Stock' && t('statusOutOfStock')}
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
                      <DropdownMenuItem onClick={() => handleOpenModal(product)}>
                        <Edit className="mr-2 h-4 w-4" /> {t('editAction')}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                        <Trash2 className="mr-2 h-4 w-4" /> {t('deleteAction')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {products.length === 0 && (
         <div className="text-center py-10 text-muted-foreground">
            {t('noProductsFound')}
        </div>
      )}
    </>
  );
}
