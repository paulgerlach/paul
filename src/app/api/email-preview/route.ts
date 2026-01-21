// src/app/api/email-preview/route.ts
import { renderEmailByTemplate } from '@/utils/email/renderEmail';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const template = searchParams.get('template') as any;

  const html = await renderEmailByTemplate(template, {
    userFirstName: 'Kgothatso Theko',
  });

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
