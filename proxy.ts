import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Multi-tenant proxy (Next.js 16).
 *
 * Rules:
 *  - admin.crmproclinic.com.br → rewrite to /admin/*
 *  - {slug}.crmproclinic.com.br → inject x-tenant-slug header
 *  - apex (crmproclinic.com.br / www) → landing/login intacto
 *  - previews (*.vercel.app) e localhost → aceitam ?tenant=slug para teste
 */

const ROOT_DOMAIN = 'crmproclinic.com.br';

const RESERVED_SUBDOMAINS = new Set([
  'admin',
  'api',
  'www',
  'app',
  'auth',
  'mail',
  'blog',
  'help',
  'support',
  'suporte',
  'login',
  'dashboard',
  'portal',
  'docs',
  'status',
  'dev',
  'staging',
  'test',
  'beta',
  'alpha',
  'master',
  'root',
  'system',
  'sistema',
  'cdn',
  'static',
  'assets',
]);

export function proxy(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const host = hostname.split(':')[0].toLowerCase();
  const url = request.nextUrl.clone();

  let subdomain: string | null = null;

  if (host.endsWith(`.${ROOT_DOMAIN}`)) {
    subdomain = host.slice(0, -(`.${ROOT_DOMAIN}`.length));
  } else if (
    host.endsWith('.vercel.app') ||
    host === 'localhost' ||
    host.startsWith('127.') ||
    host === '0.0.0.0'
  ) {
    subdomain = url.searchParams.get('tenant');
  }

  // admin.* → rewrite para /admin
  if (subdomain === 'admin') {
    if (!url.pathname.startsWith('/admin')) {
      url.pathname = url.pathname === '/' ? '/admin' : `/admin${url.pathname}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // apex / www / sem subdomínio → segue normal (landing + /auth/login)
  if (!subdomain || subdomain === 'www') {
    return NextResponse.next();
  }

  // subdomínios reservados que não são 'admin' → deixa passar sem header de tenant
  if (RESERVED_SUBDOMAINS.has(subdomain)) {
    return NextResponse.next();
  }

  // subdomínio de clínica → injeta header para o app identificar o tenant
  const response = NextResponse.next();
  response.headers.set('x-tenant-slug', subdomain);
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)',
  ],
};
