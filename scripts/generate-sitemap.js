import { writeFileSync } from 'fs';

// Tool ID to URL slug mapping (copied from toolUtils.ts)
const toolIdToSlug = {
  "json": "json-formatter",
  "csv-json": "csv-json-converter",
  "yaml-json": "yaml-json-converter",
  "xml-formatter": "xml-formatter",
  "case-converter": "text-case-converter",
  "text-diff": "text-diff-tool",
  "regex-tester": "regex-tester",
  "sql-formatter": "sql-formatter",
  "slug-generator": "slug-generator",
  "uuid": "uuid-generator",
  "qr-code": "qr-code-generator",
  "base64": "base64-encoder-decoder",
  "url": "url-encoder-decoder",
  "color-picker": "color-picker-converter",
  "number-base": "number-base-converter",
  "timestamp": "timestamp-converter",
  "hash": "hash-generator",
  "password": "password-generator",
  "jwt": "jwt-decoder",
  "hmac": "hmac-generator",
  "aes": "aes-encryption",
  "data-visualizer": "data-visualizer",
  "ip-geolocation": "ip-geolocation",
  "markdown-editor": "markdown-editor",
  "css-gradient-generator": "css-gradient-generator",
  "api-tester": "api-tester",
  "json-schema-generator": "json-schema-generator",
  "dns-lookup": "dns-lookup",
  "lorem-ipsum-generator": "lorem-ipsum-generator",
  "color-palette-generator": "color-palette-generator",
  "git-commit-generator": "git-commit-generator",
  "curl-generator": "curl-command-generator",
  "subnet-calculator": "subnet-calculator",
  "ssl-checker": "ssl-tls-checker",
  "cron-generator": "cron-expression-generator",
  "mock-data-generator": "mock-data-generator",
  "favicon-generator": "favicon-generator",
  "flexbox-creator": "flexbox-creator",
  "timezone-converter": "timezone-converter",
  "random-generator": "random-number-generator",
  "unit-converter": "unit-converter",
  "checksum-tool": "checksum-tool",
  "apk-analyzer": "apk-analyzer",
  "exif-inspector": "exif-inspector",
  "barcode-generator": "barcode-generator",
  "sequence-diagrams": "sequence-diagrams",
  "matrix-calculator": "matrix-calculator",
  "ascii-unicode-explorer": "ascii-unicode-explorer",
  "manifest-generator": "pwa-manifest-generator",
  "statistics-calculator": "statistics-calculator",
  "nanoid-ulid-generator": "nanoid-ulid-generator",
  "workday-calculator": "workday-calculator",
  "password-strength-tester": "password-strength-tester",
};

// Generate sitemap entries for all tools
const generateSitemapEntries = () => {
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
const generateSitemapXML = () => {
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
const generateRobotsTxt = () => {
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

// Generate sitemap.xml
const sitemapXML = generateSitemapXML();
writeFileSync('./public/sitemap.xml', sitemapXML);
console.log('✅ Generated sitemap.xml');

// Generate robots.txt
const robotsTxt = generateRobotsTxt();
writeFileSync('./public/robots.txt', robotsTxt);
console.log('✅ Generated robots.txt');

console.log('🎉 SEO files generated successfully!');
