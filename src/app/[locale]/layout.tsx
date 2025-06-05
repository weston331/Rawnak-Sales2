
import type { Metadata } from 'next';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { Inter } from 'next/font/google';
import '../globals.css';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/app-sidebar';
import { Toaster } from "@/components/ui/toaster";
import { CurrencyProvider } from '@/contexts/currency-context';
import {notFound} from 'next/navigation';

const inter = Inter({ subsets: ['latin'], display: 'swap' });
const supportedLocales = ['en']; // Only 'en' is supported now

export const metadata: Metadata = {
  title: 'Rawnak Sales',
  description: 'Smart sales management system for store owners in Iraq.',
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function LocaleLayout({
  children,
  params: { locale },
}: Readonly<LocaleLayoutProps>) {

  if (!supportedLocales.includes(locale)) {
    // console.error(`[LocaleLayout] Invalid locale in params: "${locale}". Calling notFound().`); // Minimal: removed
    notFound();
  }

  // useMessages must be called at the top level for Suspense to work correctly.
  const messages = useMessages();

  // A very basic check after useMessages attempts to resolve.
  // If getRequestConfig was never called, messages might be invalid/empty.
  if (!messages || typeof messages !== 'object' || Object.keys(messages).length === 0) {
      console.error(`[LocaleLayout] CRITICAL: Post-useMessages check failed for locale: ${locale}. Messages invalid or empty. This likely means getRequestConfig in i18n.ts was not successfully executed.`);
      notFound();
  }

  return (
    <html lang={locale} dir="ltr">
      <head />
      <body className={`${inter.className} font-body antialiased`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CurrencyProvider>
            <SidebarProvider defaultOpen={true} collapsible="icon">
              <AppSidebar />
              <SidebarInset>
                <div className="min-h-screen p-4 md:p-6 lg:p-8">
                  {children}
                </div>
              </SidebarInset>
            </SidebarProvider>
            <Toaster />
          </CurrencyProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
