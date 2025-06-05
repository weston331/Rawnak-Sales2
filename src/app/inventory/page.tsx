'use client';

import * as React from 'react';
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
import { AlertTriangle, CheckCircle, PackageSearch, SlidersHorizontal, PlusCircle, MinusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
    if (item.stock === 0) return <Badge variant="destructive" className="items-center gap-1"><AlertTriangle className="h-3 w-3"/>Out of Stock</Badge>;
    if (item.stock < item.threshold) return <Badge variant="secondary" className="items-center gap-1 bg-yellow-400/20 text-yellow-700 hover:bg-yellow-400/30 border-yellow-400/50"><AlertTriangle className="h-3 w-3"/>Low Stock</Badge>;
    return <Badge variant="default" className="items-center gap-1 bg-green-500/20 text-green-700 hover:bg-green-500/30 border-green-500/50"><CheckCircle className="h-3 w-3"/>In Stock</Badge>;
  };

  return (
    <>
      <PageHeader
        title="Inventory Tracking"
        description="Monitor stock levels, set alerts, and record adjustments."
        actions={
          <div className="flex gap-2">
            <Input type="search" placeholder="Search products..." className="max-w-xs" />
            <Button variant="outline"><PackageSearch className="mr-2 h-4 w-4" /> Filter</Button>
          </div>
        }
      />

      <Dialog open={isAdjustModalOpen} onOpenChange={setIsAdjustModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-headline">Adjust Stock: {selectedProduct?.name}</DialogTitle>
            <DialogDescription>
              Current stock: {selectedProduct?.stock}. Record new arrivals or stock changes.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="adjustment-type">Adjustment Type</Label>
              <Select defaultValue="add">
                <SelectTrigger id="adjustment-type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Add Stock (New Arrival)</SelectItem>
                  <SelectItem value="remove">Remove Stock (Damage/Expiry)</SelectItem>
                  <SelectItem value="set">Set to Specific Quantity (Count)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input id="quantity" type="number" placeholder="0" />
            </div>
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input id="notes" placeholder="e.g., Supplier invoice #123" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseAdjustModal}>Cancel</Button>
            <Button type="submit" onClick={handleCloseAdjustModal}>Adjust Stock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Current Stock</TableHead>
              <TableHead className="text-right">Low Stock Threshold</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
                    <SlidersHorizontal className="mr-2 h-3 w-3" /> Adjust
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
       {inventoryItems.length === 0 && (
         <div className="text-center py-10 text-muted-foreground">
            No inventory items found. Add products to see them here.
        </div>
      )}
    </>
  );
}
