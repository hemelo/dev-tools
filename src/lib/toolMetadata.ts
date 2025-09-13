export interface ToolMetadata {
  title: string;
  description: string;
  name: string;
  category: string;
}

export const toolMetadata: Record<string, ToolMetadata> = {
  "json-formatter": {
    title: "JSON Formatter - DevTools Hub",
    description: "Format, validate, and minify JSON data with syntax highlighting and error detection. Free online JSON formatter tool.",
    name: "JSON Formatter",
    category: "Text"
  },
  "csv-json-converter": {
    title: "CSV to JSON Converter - DevTools Hub",
    description: "Convert between CSV and JSON formats with customizable delimiters and header options. Free online converter tool.",
    name: "CSV ↔ JSON Converter",
    category: "Text"
  },
  "yaml-json-converter": {
    title: "YAML to JSON Converter - DevTools Hub",
    description: "Convert between YAML and JSON formats with customizable indentation and validation. Free online converter tool.",
    name: "YAML ↔ JSON Converter",
    category: "Text"
  },
  "xml-formatter": {
    title: "XML Formatter - DevTools Hub",
    description: "Format, validate, and minify XML documents with syntax highlighting and error detection. Free online XML formatter.",
    name: "XML Formatter",
    category: "Text"
  },
  "text-case-converter": {
    title: "Text Case Converter - DevTools Hub",
    description: "Convert text between camelCase, PascalCase, snake_case, kebab-case, and more. Free online text case converter.",
    name: "Text Case Converter",
    category: "Text"
  },
  "text-diff-tool": {
    title: "Text Diff Tool - DevTools Hub",
    description: "Compare two text documents with highlighting and change statistics. Free online text comparison tool.",
    name: "Text Diff Tool",
    category: "Text"
  },
  "regex-tester": {
    title: "Regex Tester - DevTools Hub",
    description: "Test regular expressions with live preview, match highlighting, and replacement functionality. Free regex tester.",
    name: "Regex Tester",
    category: "Text"
  },
  "sql-formatter": {
    title: "SQL Formatter - DevTools Hub",
    description: "Format, validate, and minify SQL queries with advanced statistics and syntax highlighting. Free SQL formatter.",
    name: "SQL Formatter",
    category: "Text"
  },
  "slug-generator": {
    title: "Slug Generator - DevTools Hub",
    description: "Generate URL-friendly slugs from any text with customizable options and multiple formats. Free slug generator.",
    name: "Slug Generator",
    category: "Text"
  },
  "uuid-generator": {
    title: "UUID Generator - DevTools Hub",
    description: "Generate RFC 4122 compliant UUIDs (v4) with cryptographically secure random generation. Free UUID generator.",
    name: "UUID Generator",
    category: "Generator"
  },
  "qr-code-generator": {
    title: "QR Code Generator - DevTools Hub",
    description: "Generate real, scannable QR codes from text, URLs, or any data with customizable size and colors. Free QR code generator.",
    name: "QR Code Generator",
    category: "Generator"
  },
  "base64-encoder-decoder": {
    title: "Base64 Encoder/Decoder - DevTools Hub",
    description: "Encode and decode Base64 strings with copy-to-clipboard functionality and validation. Free Base64 tool.",
    name: "Base64 Encoder/Decoder",
    category: "Encoding"
  },
  "url-encoder-decoder": {
    title: "URL Encoder/Decoder - DevTools Hub",
    description: "Encode and decode URL components with proper escaping. Free online URL encoder/decoder tool.",
    name: "URL Encoder/Decoder",
    category: "Encoding"
  },
  "color-picker-converter": {
    title: "Color Picker & Converter - DevTools Hub",
    description: "Pick colors and convert between HEX, RGB, HSL, CMYK formats with color variations. Free color picker tool.",
    name: "Color Picker & Converter",
    category: "Web Development"
  },
  "number-base-converter": {
    title: "Number Base Converter - DevTools Hub",
    description: "Convert between binary, octal, decimal, and hexadecimal bases with validation and examples. Free base converter.",
    name: "Number Base Converter",
    category: "Data"
  },
  "timestamp-converter": {
    title: "Timestamp Converter - DevTools Hub",
    description: "Convert between Unix timestamps, ISO dates, and human-readable formats with timezone support. Free timestamp converter.",
    name: "Timestamp Converter",
    category: "Data"
  },
  "hash-generator": {
    title: "Hash Generator - DevTools Hub",
    description: "Generate MD5, SHA-1, SHA-256, SHA-384, SHA-512 hashes with copy-to-clipboard functionality. Free hash generator.",
    name: "Hash Generator",
    category: "Cryptography"
  },
  "password-generator": {
    title: "Password Generator - DevTools Hub",
    description: "Generate secure passwords with customizable options, entropy-based strength measurement, and pattern detection. Free password generator.",
    name: "Password Generator",
    category: "Cryptography"
  },
  "jwt-decoder": {
    title: "JWT Decoder - DevTools Hub",
    description: "Decode and validate JSON Web Tokens with header and payload inspection. Free JWT decoder tool.",
    name: "JWT Decoder",
    category: "Cryptography"
  },
  "hmac-generator": {
    title: "HMAC Generator - DevTools Hub",
    description: "Generate HMAC signatures for authentication with multiple hash algorithms and secure key handling. Free HMAC generator.",
    name: "HMAC Generator",
    category: "Cryptography"
  },
  "aes-encryption": {
    title: "AES Encryption - DevTools Hub",
    description: "Encrypt and decrypt data with AES algorithm using PBKDF2 key derivation. Free AES encryption tool.",
    name: "AES Encryption",
    category: "Cryptography"
  },
  "data-visualizer": {
    title: "Data Visualizer - DevTools Hub",
    description: "Create interactive charts (bar, line, pie, scatter) from CSV and JSON data with customizable options. Free data visualization tool.",
    name: "Data Visualizer",
    category: "Data Analysis"
  },
  "ip-geolocation": {
    title: "IP Geolocation - DevTools Hub",
    description: "Get detailed location, ISP, and network information from IP addresses with map integration. Free IP geolocation tool.",
    name: "IP Geolocation",
    category: "Network"
  },
  "markdown-editor": {
    title: "Markdown Editor - DevTools Hub",
    description: "Write and preview markdown with live rendering, syntax highlighting, and export options. Free markdown editor.",
    name: "Markdown Editor",
    category: "Content"
  },
  "css-gradient-generator": {
    title: "CSS Gradient Generator - DevTools Hub",
    description: "Create beautiful CSS gradients with visual preview, predefined templates, and export options. Free gradient generator.",
    name: "CSS Gradient Generator",
    category: "Web Development"
  },
  "api-tester": {
    title: "API Tester - DevTools Hub",
    description: "Test REST APIs with custom requests, detailed response analysis, and multiple HTTP methods. Free API testing tool.",
    name: "API Tester",
    category: "Network"
  },
  "json-schema-generator": {
    title: "JSON Schema Generator - DevTools Hub",
    description: "Automatically generate JSON Schema from JSON data with multiple draft versions and validation options. Free schema generator.",
    name: "JSON Schema Generator",
    category: "Data Analysis"
  },
  "dns-lookup": {
    title: "DNS Lookup - DevTools Hub",
    description: "Query DNS records (A, AAAA, MX, TXT, NS, SOA, etc.) for any domain with comprehensive results. Free DNS lookup tool.",
    name: "DNS Lookup",
    category: "Network"
  },
  "lorem-ipsum-generator": {
    title: "Lorem Ipsum Generator - DevTools Hub",
    description: "Generate placeholder text in multiple languages (Latin, English, Spanish, French, German, Italian, Portuguese). Free Lorem Ipsum generator.",
    name: "Lorem Ipsum Generator",
    category: "Content"
  },
  "color-palette-generator": {
    title: "Color Palette Generator - DevTools Hub",
    description: "Generate color palettes using harmony rules, image extraction, or manual selection with export capabilities. Free color palette generator.",
    name: "Color Palette Generator",
    category: "Web Development"
  },
  "git-commit-generator": {
    title: "Git Commit Generator - DevTools Hub",
    description: "Generate conventional commit messages following best practices with emoji support and templates. Free Git commit generator.",
    name: "Git Commit Generator",
    category: "Development"
  },
  "curl-command-generator": {
    title: "cURL Command Generator - DevTools Hub",
    description: "Generate cURL commands for API testing and debugging with customizable options. Free cURL generator.",
    name: "cURL Command Generator",
    category: "Network"
  },
  "subnet-calculator": {
    title: "Subnet Calculator - DevTools Hub",
    description: "Calculate network information, subnet masks, and IP ranges with detailed analysis. Free subnet calculator.",
    name: "Subnet Calculator",
    category: "Network"
  },
  "ssl-tls-checker": {
    title: "SSL/TLS Checker - DevTools Hub",
    description: "Check SSL certificate validity, expiration dates, and security grades for any domain. Free SSL checker.",
    name: "SSL/TLS Checker",
    category: "Network"
  },
  "cron-expression-generator": {
    title: "Cron Expression Generator - DevTools Hub",
    description: "Generate and validate cron expressions with visual interface and next execution time calculation. Free cron generator.",
    name: "Cron Expression Generator",
    category: "Development"
  },
  "mock-data-generator": {
    title: "Mock Data Generator - DevTools Hub",
    description: "Generate realistic fake data including names, emails, addresses, phone numbers, and more in JSON, CSV, or SQL formats. Free mock data generator.",
    name: "Mock Data Generator",
    category: "Generator"
  },
  "favicon-generator": {
    title: "Favicon Generator - DevTools Hub",
    description: "Create favicons from emojis, text, or images with multiple formats (ICO, PNG, SVG) and sizes. Free favicon generator.",
    name: "Favicon Generator",
    category: "Web Development"
  },
  "flexbox-creator": {
    title: "Flexbox Creator - DevTools Hub",
    description: "Create and experiment with flexbox layouts with real-time visual feedback and CSS code generation. Free flexbox tool.",
    name: "Flexbox Creator",
    category: "Web Development"
  },
  "timezone-converter": {
    title: "Timezone Converter - DevTools Hub",
    description: "Convert between timezones with DST support, multiple timezones, global coverage, and real-time updates. Free timezone converter.",
    name: "Timezone Converter",
    category: "Web Development"
  },
  "random-number-generator": {
    title: "Random Number Generator - DevTools Hub",
    description: "Generate random numbers with statistical analysis, seed support, and multiple output formats. Free random number generator.",
    name: "Random Number Generator",
    category: "Utilities"
  },
  "unit-converter": {
    title: "Unit Converter - DevTools Hub",
    description: "Convert between units with comprehensive categories, precision control, and conversion history. Free unit converter.",
    name: "Unit Converter",
    category: "Utilities"
  },
  "checksum-tool": {
    title: "Checksum Tool - DevTools Hub",
    description: "Verify file integrity with multiple hash algorithms and batch processing. Free checksum verification tool.",
    name: "Checksum Tool",
    category: "Security"
  },
  "apk-analyzer": {
    title: "APK Analyzer - DevTools Hub",
    description: "Analyze Android APK files for security, permissions, and structure information with comprehensive reporting. Free APK analyzer.",
    name: "APK Analyzer",
    category: "Security"
  },
  "exif-inspector": {
    title: "EXIF Inspector - DevTools Hub",
    description: "Analyze image metadata and EXIF data for privacy, technical details, and location information. Free EXIF inspector.",
    name: "EXIF Inspector",
    category: "Security"
  },
  "barcode-generator": {
    title: "Barcode Generator - DevTools Hub",
    description: "Generate professional barcodes in multiple formats (Code 128, EAN-13, UPC-A, etc.) with customizable options. Free barcode generator.",
    name: "Barcode Generator",
    category: "Generator"
  },
  "sequence-diagrams": {
    title: "Sequence Diagrams - DevTools Hub",
    description: "Create PlantUML-style sequence diagrams with live preview and professional rendering. Free sequence diagram tool.",
    name: "Sequence Diagrams",
    category: "Web Development"
  },
  "matrix-calculator": {
    title: "Matrix Calculator - DevTools Hub",
    description: "Perform matrix operations including determinant, inverse, transpose, trace, rank, eigenvalues, and arithmetic operations. Free matrix calculator.",
    name: "Matrix Calculator",
    category: "Mathematics"
  },
  "ascii-unicode-explorer": {
    title: "ASCII/Unicode Explorer - DevTools Hub",
    description: "Explore ASCII and Unicode characters with detailed information, encoding details, and copy functionality. Free character explorer.",
    name: "ASCII/Unicode Explorer",
    category: "Text & Data"
  },
  "pwa-manifest-generator": {
    title: "PWA Manifest Generator - DevTools Hub",
    description: "Create and customize Progressive Web App manifests with comprehensive configuration options. Free PWA manifest generator.",
    name: "PWA Manifest Generator",
    category: "Web Development"
  },
  "statistics-calculator": {
    title: "Statistics Calculator - DevTools Hub",
    description: "Calculate descriptive statistics, generate probability distributions, and analyze data with comprehensive statistical tools. Free statistics calculator.",
    name: "Statistics Calculator",
    category: "Mathematics"
  },
  "nanoid-ulid-generator": {
    title: "NanoID/ULID Generator - DevTools Hub",
    description: "Generate unique identifiers using NanoID and ULID algorithms with comprehensive customization options. Free ID generator.",
    name: "NanoID/ULID Generator",
    category: "Generators"
  },
  "workday-calculator": {
    title: "Workday Calculator - DevTools Hub",
    description: "Calculate business days, working hours, and project timelines with comprehensive holiday and weekend management. Free workday calculator.",
    name: "Workday Calculator",
    category: "Business"
  },
  "password-strength-tester": {
    title: "Password Strength Tester - DevTools Hub",
    description: "Analyze password strength, calculate entropy, and get security recommendations. Free password strength tester.",
    name: "Password Strength Tester",
    category: "Cryptography & Security"
  },
  "sql-query-builder": {
    title: "SQL Query Builder - DevTools Hub",
    description: "Build SQL queries visually with drag-and-drop interface, table relationships, and real-time query generation. Free SQL query builder.",
    name: "SQL Query Builder",
    category: "Database"
  },
};

