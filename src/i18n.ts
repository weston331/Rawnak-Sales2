
import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

// Supported locales
const locales = ['en'];

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    // console.error(`[i18n.ts] CRITICAL: Invalid locale detected: "${locale}". Calling notFound().`); // Minimal: removed for absolute clarity
    notFound();
  }

  // console.log(`!!!!!!!!!!!!!!!!!!!! [i18n.ts] getRequestConfig CALLED for locale: ${locale} !!!!!!!!!!!!!!!!!!!!`); // Minimal: removed

  let messages;
  try {
    // The `default` is important when importing JSON with ES modules
    messages = (await import(`../messages/${locale}.json`)).default;
  } catch (error) {
    // console.error(`[i18n.ts] CRITICAL: Failed to load messages for locale "${locale}". Error:`, error); // Minimal: removed
    notFound();
  }

  if (!messages || typeof messages !== 'object' || Object.keys(messages).length === 0) {
    // console.error(`[i18n.ts] CRITICAL: Messages object for locale "${locale}" is empty or invalid after import.`); // Minimal: removed
    notFound();
  }

  return {
    messages
  };
});
