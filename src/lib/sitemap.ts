import { toolIdToSlug } from './toolUtils';

// Generate sitemap entries for all tools
export const generateSitemapEntries = () => {
  const baseUrl = 'https://devtools.hemelo.fyi';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const entries = [
    // Homepage
    {
      url: baseUrl,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '1.0'
    },
    // All tool pages
    ...Object.values(toolIdToSlug).map(slug => ({
      url: `${baseUrl}/tools/${slug}`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.8'
    }))
  ];

  return entries;
};

// Generate XML sitemap
export const generateSitemapXML = () => {
  const entries = generateSitemapEntries();
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xml;
};

// Generate robots.txt content
export const generateRobotsTxt = () => {
  const baseUrl = 'https://devtools.hemelo.fyi';
  
  return `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml

# Disallow crawling of build artifacts
Disallow: /dist/
Disallow: /node_modules/
Disallow: /.git/
Disallow: /src/

# Allow all tool pages
Allow: /tools/`;
};

