import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/chatbot-sources'],
      },
    ],
    sitemap: 'https://wintongee.com/sitemap.xml',
  }
}
