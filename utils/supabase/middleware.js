import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function updateSession(request) {
  try {
    // Create a response to modify
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          get(name) {
            return request.cookies.get(name)?.value;
          },
          set(name, value, options) {
            response.cookies.set({
              name,
              value,
              ...options,
            });
          },
          remove(name, options) {
            response.cookies.set({
              name,
              value: '',
              ...options,
            });
          },
        },
      }
    );

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (
      !session &&
      request.nextUrl.pathname.startsWith('/')
    ) {
      const redirectUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(redirectUrl);
    }

    if (
      session &&
      request.nextUrl.pathname === '/'
    ) {
      const redirectUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(redirectUrl);
    }

    return response;
  } catch (e) {
    console.error('Middleware error:', e);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
}