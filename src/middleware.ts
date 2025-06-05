
import type { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest, event: NextFetchEvent) {
  // This middleware function is currently a no-op (does nothing).
  // It's here to resolve an import error after 'next-intl' was removed.
  // If you do not need any custom middleware logic,
  // you can safely delete this file (src/middleware.ts).
  // Returning nothing or undefined allows the request to proceed.
  return undefined;
}

// An empty matcher array means this middleware will effectively not run on any paths.
// This is the safest default if the file must exist but do nothing.
// If you delete the file, this config object is also removed.
export const config = {
  matcher: [],
};
