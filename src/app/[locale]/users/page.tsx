
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
import { PlusCircle, Edit, Trash2, ShieldCheck, ShieldAlert, MoreHorizontal } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const users = [
  { id: 'U001', name: 'Ali Hassan', email: 'ali.hassan@example.com', role: 'Admin', status: 'Active' },
  { id: 'U002', name: 'Sara Ibrahim', email: 'sara.ibrahim@example.com', role: 'Employee', status: 'Active' },
  { id: 'U003', name: 'Omar Khalid', email: 'omar.khalid@example.com', role: 'Employee', status: 'Inactive' },
  { id: 'U004', name: 'Nour Ahmed', email: 'nour.ahmed@example.com', role: 'Admin', status: 'Active' },
];

export default function UsersPage() {
  const t = useTranslations('UsersPage');
  const tg = useTranslations('General');
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingUser, setEditingUser] = React.useState<typeof users[0] | null>(null);

  const handleOpenModal = (user?: typeof users[0]) => {
    setEditingUser(user || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };
  
  const getRoleBadge = (role: string) => {
    if (role === 'Admin') return <Badge className="items-center gap-1 bg-primary/20 text-primary hover:bg-primary/30 border-primary/50"><ShieldCheck className="h-3 w-3"/>{t('adminRole')}</Badge>;
    return <Badge variant="secondary" className="items-center gap-1"><ShieldAlert className="h-3 w-3"/>{t('employeeRole')}</Badge>;
  };

  return (
    <>
      <PageHeader
        title={t('title')}
        description={t('description')}
        actions={
          <Button onClick={() => handleOpenModal()}>
            <PlusCircle className="mr-2 h-4 w-4" /> {t('addNewUser')}
          </Button>
        }
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-headline">{editingUser ? t('editUserModalTitle') : t('addUserModalTitle')}</DialogTitle>
            <DialogDescription>
              {editingUser ? t('editUserModalDescription') : t('addUserModalDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">{t('fullNameLabel')}</Label>
              <Input id="name" defaultValue={editingUser?.name || ""} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">{t('emailLabel')}</Label>
              <Input id="email" type="email" defaultValue={editingUser?.email || ""} className="col-span-3" />
            </div>
             {!editingUser && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">{t('passwordLabel')}</Label>
                <Input id="password" type="password" className="col-span-3" />
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">{t('roleLabel')}</Label>
              <Select defaultValue={editingUser?.role || "Employee"}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder={t('selectRolePlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">{t('adminRole')}</SelectItem>
                  <SelectItem value="Employee">{t('employeeRole')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
             {editingUser && (
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">{t('statusLabel')}</Label>
                     <Select defaultValue={editingUser?.status || "Active"}>
                        <SelectTrigger className="col-span-3">
                        <SelectValue placeholder={t('selectStatusPlaceholder')} />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="Active">{t('activeStatus')}</SelectItem>
                        <SelectItem value="Inactive">{t('inactiveStatus')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}
            <div className="col-span-4">
                <Label className="font-medium">{t('permissionsLabel')}</Label>
                <div className="mt-2 space-y-2 p-3 border rounded-md bg-muted/50">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="perm-sales" defaultChecked={editingUser?.role === 'Admin' || true} />
                        <Label htmlFor="perm-sales" className="font-normal">{t('manageSalesPermission')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="perm-products" defaultChecked={editingUser?.role === 'Admin' || true} />
                        <Label htmlFor="perm-products" className="font-normal">{t('manageProductsPermission')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="perm-inventory" defaultChecked={editingUser?.role === 'Admin' || false} />
                        <Label htmlFor="perm-inventory" className="font-normal">{t('manageInventoryPermission')}</Label>
                    </div>
                     <div className="flex items-center space-x-2">
                        <Checkbox id="perm-users" defaultChecked={editingUser?.role === 'Admin'} disabled={editingUser?.role !== 'Admin'} />
                        <Label htmlFor="perm-users" className="font-normal">{t('manageUsersPermission')}</Label>
                    </div>
                </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>{tg('cancel')}</Button>
            <Button type="submit" onClick={handleCloseModal}>{editingUser ? t('saveChangesButton') : t('createUserButton')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('tableHeaderName')}</TableHead>
              <TableHead>{t('tableHeaderEmail')}</TableHead>
              <TableHead>{t('tableHeaderRole')}</TableHead>
              <TableHead>{t('tableHeaderStatus')}</TableHead>
              <TableHead className="text-right">{t('tableHeaderActions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell>
                  <Badge variant={user.status === 'Active' ? 'default' : 'outline'}>
                    {user.status === 'Active' ? t('activeStatus') : t('inactiveStatus')}
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
                      <DropdownMenuItem onClick={() => handleOpenModal(user)}>
                        <Edit className="mr-2 h-4 w-4" /> {t('actionEditUser')}
                      </DropdownMenuItem>
                       <DropdownMenuItem>
                        {t('actionResetPassword')}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator/>
                      <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                        <Trash2 className="mr-2 h-4 w-4" /> {t('actionDeleteUser')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
       {users.length === 0 && (
         <div className="text-center py-10 text-muted-foreground">
            {t('noUsersFound')}
        </div>
      )}
    </>
  );
}
