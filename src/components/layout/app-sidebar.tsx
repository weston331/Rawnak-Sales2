
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LayoutGrid,
  Package,
  ShoppingCart,
  Archive,
  CreditCard,
  Users,
  Settings,
  LogOut,
  Building,
} from 'lucide-react';

// Hardcoded English labels
const navItemLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  products: 'Products',
  sales: 'Sales',
  inventory: 'Inventory',
  debts: 'Debts',
  users: 'Users',
  settings: 'Settings',
  salesManagement: 'Sales Management',
  storeOwner: 'Store Owner',
  logout: 'Log Out',
};

const AppSidebar = () => {
  const currentFullRawPathname = usePathname(); // e.g., /dashboard

  const navItems = [
    { href: '/dashboard', labelKey: 'dashboard', icon: LayoutGrid },
    { href: '/products', labelKey: 'products', icon: Package },
    { href: '/sales', labelKey: 'sales', icon: ShoppingCart },
    { href: '/inventory', labelKey: 'inventory', icon: Archive },
    { href: '/debts', labelKey: 'debts', icon: CreditCard },
    { href: '/users', labelKey: 'users', icon: Users },
  ];

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
           <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/10 shrink-0">
            <Building className="h-7 w-7" />
           </Button>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden transition-opacity duration-200 ease-linear">
            <h1 className="text-xl font-semibold text-primary font-headline">Rawnak Sales</h1>
            <p className="text-xs text-muted-foreground">{navItemLabels.salesManagement}</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="flex-grow p-2">
        <SidebarMenu>
          {navItems.map((item) => {
            let isActive;
            if (item.href === '/dashboard') {
              isActive = currentFullRawPathname === item.href;
            } else {
              isActive = currentFullRawPathname.startsWith(item.href);
            }
            
            return (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref>
                  <SidebarMenuButton
                    isActive={isActive}
                    tooltip={{ children: navItemLabels[item.labelKey], side: 'right', align: 'center' }}
                    className="justify-start"
                  >
                    <item.icon className="mr-2 h-5 w-5 flex-shrink-0" />
                    <span>{navItemLabels[item.labelKey]}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <Separator className="my-2" />

      <SidebarFooter className="p-4 space-y-4">
        <Link href="/settings" passHref>
            <SidebarMenuButton
                isActive={currentFullRawPathname.startsWith("/settings")}
                tooltip={{ children: navItemLabels.settings, side: 'right', align: 'center' }}
                className="justify-start"
            >
                <Settings className="mr-2 h-5 w-5 flex-shrink-0" />
                <span>{navItemLabels.settings}</span>
            </SidebarMenuButton>
        </Link>
        
        <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
                <AvatarImage src="https://placehold.co/100x100.png" alt={navItemLabels.storeOwner} data-ai-hint="user avatar"/>
                <AvatarFallback>RS</AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden transition-opacity duration-200 ease-linear">
                <span className="text-sm font-medium">{navItemLabels.storeOwner}</span>
                <span className="text-xs text-muted-foreground">admin@rawnak.com</span>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto group-data-[collapsible=icon]:hidden" title={navItemLabels.logout}>
                <LogOut className="h-5 w-5 text-muted-foreground hover:text-destructive" />
            </Button>
        </div>
      </SidebarFooter>
       <div className="md:hidden fixed bottom-4 right-4 z-50">
        <SidebarTrigger />
      </div>
    </Sidebar>
  );
};

export default AppSidebar;
