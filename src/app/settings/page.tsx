
'use client';

import * as React from 'react';
// import {useRouter, usePathname} from 'next-intl/client'; // Removed
// import {useTranslations, useLocale} from 'next-intl'; // Removed
import PageHeader from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Building, Palette, Bell, Lock, FileText, Coins } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrency } from '@/contexts/currency-context';
import { currencies as availableCurrencies } from '@/lib/currencies';


export default function SettingsPage() {
  // const t = useTranslations('SettingsPage'); // Removed
  // const router = useRouter(); // Removed
  // const pathname = usePathname(); // Removed
  // const currentLocale = useLocale(); // Removed

  // const [selectedLanguage, setSelectedLanguage] = React.useState(currentLocale); // Removed
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [lowStockNotifications, setLowStockNotifications] = React.useState(true);
  const [debtReminders, setDebtReminders] = React.useState(false);
  
  const { selectedCurrency, changeCurrency } = useCurrency();


  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
  };

  // const handleLanguageChange = (newLocale: string) => { // Removed
  //   setSelectedLanguage(newLocale);
  //   router.push(pathname, {locale: newLocale});
  // };


  return (
    <>
      <PageHeader
        title="Settings" // Hardcoded
        description="Configure your application and preferences." // Hardcoded
      />

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center"><Building className="mr-2 h-5 w-5 text-primary" /> Store Information</CardTitle>
                    <CardDescription>Update your store's basic details.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="storeName">Store Name</Label>
                        <Input id="storeName" defaultValue="Rawnak Sales" />
                    </div>
                    <div>
                        <Label htmlFor="storeAddress">Address</Label>
                        <Input id="storeAddress" defaultValue="123 Main St, Baghdad, Iraq" />
                    </div>
                    <div>
                        <Label htmlFor="storeContact">Contact Phone</Label>
                        <Input id="storeContact" type="tel" defaultValue="+964 770 123 4567" />
                    </div>
                    <Button>Save Store Info</Button>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center"><Lock className="mr-2 h-5 w-5 text-primary" /> Account Security</CardTitle>
                    <CardDescription>Manage your account security settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full">Change Password</Button>
                    <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                        <Label htmlFor="2fa-switch" className="flex flex-col space-y-1">
                        <span>Two-Factor Authentication</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                            Enhance your account security.
                        </span>
                        </Label>
                        <Switch id="2fa-switch" />
                    </div>
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center"><Palette className="mr-2 h-5 w-5 text-primary" /> Appearance</CardTitle>
                    <CardDescription>Customize the look and feel of the application.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                        <Label htmlFor="darkMode-switch" className="flex flex-col space-y-1">
                        <span>Dark Mode</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                            Toggle between light and dark themes.
                        </span>
                        </Label>
                        <Switch id="darkMode-switch" checked={isDarkMode} onCheckedChange={toggleDarkMode}/>
                    </div>
                     {/* Language selection removed
                     <div>
                        <Label htmlFor="language">Language</Label>
                        <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                            <SelectTrigger id="language" className="w-full">
                                <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="ar">Arabic</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    */}
                </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-headline flex items-center">
                  <Coins className="mr-2 h-5 w-5 text-primary" /> Currency Settings
                </CardTitle>
                <CardDescription>Choose your preferred display currency.</CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="currency">Display Currency</Label>
                  <Select value={selectedCurrency.code} onValueChange={changeCurrency}>
                    <SelectTrigger id="currency" className="w-full">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCurrencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          {currency.name} ({currency.symbol})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>


            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center"><Bell className="mr-2 h-5 w-5 text-primary" /> Notifications</CardTitle>
                    <CardDescription>Manage your notification preferences.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                        <Label htmlFor="lowStock-notif" className="flex flex-col space-y-1">
                        <span>Low Stock Alerts</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                            Receive notifications for products running low on stock.
                        </span>
                        </Label>
                        <Switch id="lowStock-notif" checked={lowStockNotifications} onCheckedChange={setLowStockNotifications} />
                    </div>
                    <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                        <Label htmlFor="debtReminder-notif" className="flex flex-col space-y-1">
                        <span>Debt Reminders</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                            Get reminders for overdue customer debts.
                        </span>
                        </Label>
                        <Switch id="debtReminder-notif" checked={debtReminders} onCheckedChange={setDebtReminders} />
                    </div>
                     <div>
                        <Label htmlFor="emailNotif">Email for Important Updates</Label>
                        <Input id="emailNotif" type="email" defaultValue="owner@rawnak.com" />
                    </div>
                     <Button>Save Notification Settings</Button>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center"><FileText className="mr-2 h-5 w-5 text-primary" /> Data & Export</CardTitle>
                    <CardDescription>Manage your application data.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full">Export Sales Data (CSV)</Button>
                    <Button variant="outline" className="w-full">Export Product Data (CSV)</Button>
                    <Button variant="destructive" className="w-full">Backup Entire Database</Button>
                </CardContent>
            </Card>

        </div>
      </div>
    </>
  );
}
