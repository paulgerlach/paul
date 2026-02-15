// src/app/api/email-preview/route.ts
import { renderEmailByTemplate, EmailTemplateKey } from '@/utils/email/renderEmail';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const template = searchParams.get('template') as EmailTemplateKey;

  // Build props based on template type
  let props: Record<string, string> = {
    userFirstName: 'Kgothatso Theko',
  };

  // Handle tenantInvite template with dynamic props
  if (template === 'tenantInvite') {
    const setupURL = searchParams.get('setupURL');
    const name = searchParams.get('name');
    
    props = {
      ...(setupURL && { setupURL }),
      ...(name && { name }),
    };
  }

  const html = await renderEmailByTemplate(template, props);

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
