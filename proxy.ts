import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  "/", 
  "/sign-in(.*)", 
  "/sign-up(.*)",
])

export default clerkMiddleware(async (auth, req) => {
  console.log('Middleware running for:', req.nextUrl.pathname)
  console.log('Is public route:', isPublicRoute(req))
  if (isPublicRoute(req)) {
    return
  }

  await auth.protect()  // Remove the redirectTo option
})

export const config = {
  matcher: [
     // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
}