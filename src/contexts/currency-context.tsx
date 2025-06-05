
'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Currency, currencies, placeholderExchangeRates } from '@/lib/currencies';

interface CurrencyContextType {
  selectedCurrency: Currency;
  exchangeRates: Record<string, number>;
  changeCurrency: (currencyCode: string) => void;
  formatCurrency: (amountInUSD: number) => string;
  convertToSelectedCurrency: (amountInUSD: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]); // Default to USD
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>(placeholderExchangeRates);

  useEffect(() => {
    const storedCurrencyCode = localStorage.getItem('selectedCurrency');
    if (storedCurrencyCode) {
      const foundCurrency = currencies.find(c => c.code === storedCurrencyCode);
      if (foundCurrency) {
        setSelectedCurrency(foundCurrency);
      }
    }
    // In a real app, fetch exchange rates here if they are dynamic
    // For now, we use placeholder rates
  }, []);

  const changeCurrency = useCallback((currencyCode: string) => {
    const newCurrency = currencies.find(c => c.code === currencyCode);
    if (newCurrency) {
      setSelectedCurrency(newCurrency);
      localStorage.setItem('selectedCurrency', currencyCode);
    }
  }, []);

  const convertToSelectedCurrency = useCallback((amountInUSD: number): number => {
    const rate = exchangeRates[selectedCurrency.code];
    if (rate === undefined) {
      console.warn(`Exchange rate not found for ${selectedCurrency.code}, returning amount in USD`);
      return amountInUSD; // Fallback to USD if rate is missing
    }
    return amountInUSD * rate;
  }, [selectedCurrency, exchangeRates]);
  

  const formatCurrency = useCallback((amountInBaseCurrency: number): string => {
    const convertedAmount = convertToSelectedCurrency(amountInBaseCurrency);
    const { symbol, code } = selectedCurrency;

    // Basic formatting, can be expanded with Intl.NumberFormat
    // For IQD, typically no minor units are used in common practice.
    const minimumFractionDigits = code === 'IQD' ? 0 : 2;
    const maximumFractionDigits = code === 'IQD' ? 0 : 2;

    return `${symbol}${convertedAmount.toLocaleString(undefined, { minimumFractionDigits, maximumFractionDigits })}`;
  }, [selectedCurrency, convertToSelectedCurrency]);

  return (
    <CurrencyContext.Provider value={{ selectedCurrency, exchangeRates, changeCurrency, formatCurrency, convertToSelectedCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
