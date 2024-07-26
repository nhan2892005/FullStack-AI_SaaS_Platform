import { clerkMiddleware, ClerkMiddlewareOptions } from '@clerk/nextjs/server';

export default clerkMiddleware({
  publicRoutes: ["/api/webhooks/clerk"],
} as ClerkMiddlewareOptions);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};