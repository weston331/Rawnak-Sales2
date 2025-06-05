
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/app-sidebar';
import { Toaster } from "@/components/ui/toaster";
import { CurrencyProvider } from '@/contexts/currency-context';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'Rawnak Sales',
  description: 'Smart sales management system for store owners in Iraq.',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({
  children,
}: Readonly<RootLayoutProps>) {
  return (
    <html lang="en" dir="ltr">
      <head />
      <body className={`${inter.className} font-body antialiased`}>
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
      </body>
    </html>
  );
}
