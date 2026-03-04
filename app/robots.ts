import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/admin', '/api/'],
            },
        ],
        sitemap: 'https://sponge-global.com/sitemap.xml',
        host: 'https://sponge-global.com',
    };
}
