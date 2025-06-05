
'use client';

import * as React from 'react';
import {useRouter, usePathname} from 'next-intl/client';
import {useTranslations, useLocale} from 'next-intl';
import PageHeader from '@/components/shared/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  const t = useTranslations('SettingsPage');
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const [selectedLanguage, setSelectedLanguage] = React.useState(currentLocale);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [lowStockNotifications, setLowStockNotifications] = React.useState(true);
  const [debtReminders, setDebtReminders] = React.useState(false);
  
  const { selectedCurrency, changeCurrency } = useCurrency();

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const dm = localStorage.getItem('darkMode') === 'true';
      setIsDarkMode(dm);
      if (dm) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    if (newIsDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('darkMode', 'true');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('darkMode', 'false');
    }
  };

  const handleLanguageChange = (newLocale: string) => {
    setSelectedLanguage(newLocale);
    router.push(pathname, {locale: newLocale});
  };

  return (
    <>
      <PageHeader
        title={t('title')}
        description={t('description')}
      />

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center"><Building className="mr-2 h-5 w-5 text-primary" /> {t('storeInfoTitle')}</CardTitle>
                    <CardDescription>{t('storeInfoDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="storeName">{t('storeNameLabel')}</Label>
                        <Input id="storeName" defaultValue="Rawnak Sales" />
                    </div>
                    <div>
                        <Label htmlFor="storeAddress">{t('storeAddressLabel')}</Label>
                        <Input id="storeAddress" defaultValue="123 Main St, Baghdad, Iraq" />
                    </div>
                    <div>
                        <Label htmlFor="storeContact">{t('storeContactLabel')}</Label>
                        <Input id="storeContact" type="tel" defaultValue="+964 770 123 4567" />
                    </div>
                    <Button>{t('saveStoreInfoButton')}</Button>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center"><Lock className="mr-2 h-5 w-5 text-primary" /> {t('accountSecurityTitle')}</CardTitle>
                    <CardDescription>{t('accountSecurityDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full">{t('changePasswordButton')}</Button>
                    <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                        <Label htmlFor="2fa-switch" className="flex flex-col space-y-1">
                        <span>{t('twoFactorAuthLabel')}</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                            {t('twoFactorAuthDescription')}
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
                    <CardTitle className="font-headline flex items-center"><Palette className="mr-2 h-5 w-5 text-primary" /> {t('appearanceTitle')}</CardTitle>
                    <CardDescription>{t('appearanceDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                        <Label htmlFor="darkMode-switch" className="flex flex-col space-y-1">
                        <span>{t('darkModeLabel')}</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                            {t('darkModeDescription')}
                        </span>
                        </Label>
                        <Switch id="darkMode-switch" checked={isDarkMode} onCheckedChange={toggleDarkMode}/>
                    </div>
                     <div>
                        <Label htmlFor="language">{t('languageLabel')}</Label>
                        <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                            <SelectTrigger id="language" className="w-full">
                                <SelectValue placeholder={t('selectLanguagePlaceholder')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">{t('english')}</SelectItem>
                                {/* Arabic option removed */}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-headline flex items-center">
                  <Coins className="mr-2 h-5 w-5 text-primary" /> {t('currencySettingsTitle')}
                </CardTitle>
                <CardDescription>{t('currencySettingsDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="currency">{t('displayCurrencyLabel')}</Label>
                  <Select value={selectedCurrency.code} onValueChange={changeCurrency}>
                    <SelectTrigger id="currency" className="w-full">
                      <SelectValue placeholder={t('selectCurrencyPlaceholder')} />
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
                    <CardTitle className="font-headline flex items-center"><Bell className="mr-2 h-5 w-5 text-primary" /> {t('notificationsTitle')}</CardTitle>
                    <CardDescription>{t('notificationsDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                        <Label htmlFor="lowStock-notif" className="flex flex-col space-y-1">
                        <span>{t('lowStockAlertsLabel')}</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                            {t('lowStockAlertsDescription')}
                        </span>
                        </Label>
                        <Switch id="lowStock-notif" checked={lowStockNotifications} onCheckedChange={setLowStockNotifications} />
                    </div>
                    <div className="flex items-center justify-between space-x-2 rounded-lg border p-4">
                        <Label htmlFor="debtReminder-notif" className="flex flex-col space-y-1">
                        <span>{t('debtRemindersLabel')}</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                            {t('debtRemindersDescription')}
                        </span>
                        </Label>
                        <Switch id="debtReminder-notif" checked={debtReminders} onCheckedChange={setDebtReminders} />
                    </div>
                     <div>
                        <Label htmlFor="emailNotif">{t('emailForUpdatesLabel')}</Label>
                        <Input id="emailNotif" type="email" defaultValue="owner@rawnak.com" />
                    </div>
                     <Button>{t('saveNotificationSettingsButton')}</Button>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center"><FileText className="mr-2 h-5 w-5 text-primary" /> {t('dataExportTitle')}</CardTitle>
                    <CardDescription>{t('dataExportDescription')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button variant="outline" className="w-full">{t('exportSalesButton')}</Button>
                    <Button variant="outline" className="w-full">{t('exportProductsButton')}</Button>
                    <Button variant="destructive" className="w-full">{t('backupDatabaseButton')}</Button>
                </CardContent>
            </Card>

        </div>
      </div>
    </>
  );
}
