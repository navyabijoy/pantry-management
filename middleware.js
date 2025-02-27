const { createMiddlewareClient } = require('@supabase/auth-helpers-nextjs');
const { NextResponse } = require('next/server');

async function middleware(request) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  await supabase.auth.getSession();

  return res;
}

// Ensure middleware only runs on dashboard routes
const config = {
  matcher: ['/dashboard/:path*']
};

module.exports = { middleware, config };