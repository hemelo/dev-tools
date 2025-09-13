// Tool ID to URL slug mapping
export const toolIdToSlug: Record<string, string> = {
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
  "sql-query-builder": "sql-query-builder",
};

// URL slug to tool ID mapping (reverse mapping)
export const slugToToolId: Record<string, string> = Object.fromEntries(
  Object.entries(toolIdToSlug).map(([id, slug]) => [slug, id])
);

/**
 * Generate a URL for a specific tool
 * @param toolId - The internal tool ID
 * @returns The URL path for the tool
 */
export const getToolUrl = (toolId: string): string => {
  const slug = toolIdToSlug[toolId];
  return slug ? `/tools/${slug}` : `/tools/${toolId}`;
};

/**
 * Get the tool ID from a URL slug
 * @param slug - The URL slug
 * @returns The internal tool ID
 */
export const getToolIdFromSlug = (slug: string): string => {
  return slugToToolId[slug] || slug;
};

/**
 * Get the URL slug from a tool ID
 * @param toolId - The internal tool ID
 * @returns The URL slug
 */
export const getSlugFromToolId = (toolId: string): string => {
  return toolIdToSlug[toolId] || toolId;
};

