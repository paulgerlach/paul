import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/shared/',
          '/(admin)/',
          '/(service)/fragebogen',
        ],
      },
    ],
    sitemap: 'https://heidisystems.com/sitemap.xml',
  }
}

