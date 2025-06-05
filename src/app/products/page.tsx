
'use client';

import * as React from 'react';
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
  priceUSD: number; // Store price in base currency (USD)
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

  // Assume purchase price is always entered in USD for simplicity
  const getPurchasePriceUSD = (salePriceUSD: number) => (salePriceUSD * 0.8);

  return (
    <>
      <PageHeader
        title="Product Management"
        description="Manage your product catalog, categories, and pricing."
        actions={
          <Button onClick={() => handleOpenModal()}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Product 
          </Button>
        }
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="font-headline">{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle> 
            <DialogDescription>
              {editingProduct ? 'Update the details of the existing product.' : 'Fill in the details to add a new product to your catalog.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" defaultValue={editingProduct?.name || ""} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">Category</Label>
              <Select defaultValue={editingProduct?.category || ""}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Grains">Grains</SelectItem>
                  <SelectItem value="Fruits">Fruits</SelectItem>
                  <SelectItem value="Dairy">Dairy</SelectItem>
                  <SelectItem value="Bakery">Bakery</SelectItem>
                  <SelectItem value="Meat">Meat</SelectItem>
                  <SelectItem value="Beverages">Beverages</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea id="description" placeholder="Optional product description" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="purchase-price" className="text-right">Purchase Price (USD)</Label>
              <Input id="purchase-price" type="number" defaultValue={editingProduct ? getPurchasePriceUSD(editingProduct.priceUSD).toFixed(2) : ""} className="col-span-3" placeholder="0.00"/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sale-price" className="text-right">Sale Price (USD)</Label>
              <Input id="sale-price" type="number" defaultValue={editingProduct?.priceUSD.toFixed(2) || ""} className="col-span-3" placeholder="0.00"/>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stock" className="text-right">Initial Stock</Label>
              <Input id="stock" type="number" defaultValue={editingProduct?.stock.toString() || ""} className="col-span-3" placeholder="0"/>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>Cancel</Button> 
            <Button type="submit" onClick={handleCloseModal}>{editingProduct ? 'Save Changes' : 'Add Product'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price ({selectedCurrency.symbol})</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
                  <Badge variant={getStatusBadgeVariant(product.status)}>{product.status}</Badge>
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
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
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
            No products found. Add your first product!
        </div>
      )}
    </>
  );
}
