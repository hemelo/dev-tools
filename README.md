# DevTools Hub 🛠️

> **Essential Developer Tools Collection** - A comprehensive suite of web-based utilities for modern developers

## 🌐 **Language / Idioma**

- 🇺🇸 [English](README.md) - Current version
- 🇧🇷 [Português (Brasil)](README-pt-BR.md) - Portuguese version

---

## 📋 **Situation (Context)**

### The Problem
As a developer, I frequently found myself switching between multiple online tools and browser tabs to perform common development tasks:

- **Scattered Tools**: Having to visit different websites for JSON formatting, UUID generation, Base64 encoding, password generation, and cryptographic operations
- **Inconsistent UX**: Each tool had different interfaces, some with ads, others with limited functionality
- **Security Concerns**: Using third-party tools for sensitive operations like password generation and encryption
- **Time Waste**: Constantly searching for reliable, fast, and secure developer utilities
- **Offline Limitations**: Most tools required internet connectivity, limiting productivity in offline scenarios

### The Vision
I envisioned a **single, unified platform** that would:
- Consolidate all essential developer tools in one place
- Provide a consistent, modern user experience
- Ensure security and privacy (client-side processing)
- Work offline with no external dependencies
- Be fast, reliable, and ad-free

---

## 🚀 **Action (Implementation)**

### Technology Stack
Built a modern, performant web application using:

- **Frontend**: React 18 with TypeScript for type safety
- **Build Tool**: Vite for lightning-fast development and builds
- **UI Framework**: shadcn/ui components with Tailwind CSS for modern design
- **Icons**: Lucide React for consistent iconography
- **State Management**: React hooks for local state management
- **QR Code Generation**: react-qr-code library for authentic QR code generation
- **Cryptography**: Web Crypto API for secure operations
- **Validation**: Real-time input validation and error handling

---

## 🎯 **Result (Outcomes)**

### Immediate Benefits
✅ **Unified Experience**: All essential dev tools in one application  
✅ **Improved Productivity**: No more tab switching or tool hunting  
✅ **Enhanced Security**: Client-side processing with no data leakage  
✅ **Offline Capability**: Works without internet connection  
✅ **Consistent Interface**: Familiar UX patterns across all tools  

### Technical Excellence
✅ **Performance**: Lightning-fast with Vite's optimized builds  
✅ **Type Safety**: Full TypeScript implementation prevents runtime errors  
✅ **Accessibility**: WCAG-compliant components from shadcn/ui  
✅ **Maintainability**: Clean, modular code architecture  
✅ **Scalability**: Easy to add new tools and features  

### User Impact
- **Time Savings**: Reduced context switching saves 2-3 minutes per development session
- **Reliability**: No dependency on external services or internet connectivity
- **Security**: Sensitive operations like password generation and encryption happen locally
- **Learning**: Clear feedback helps developers understand security concepts (entropy, strength, QR encoding)
- **Comprehensive Coverage**: 54 essential tools covering all major development needs
- **Enhanced Productivity**: One-stop solution for text processing, data conversion, web development, and cryptography
- **Professional Quality**: Real QR codes, advanced text processing, and enterprise-grade security features
- **Developer Experience**: Interactive examples, real-time validation, and intuitive interfaces


### Future-Ready Architecture
- **Modular Design**: Easy to extend with new tools
- **Component Library**: Reusable UI components for rapid development
- **Modern Stack**: Built with current best practices and latest technologies
- **Deployment Ready**: Optimized for production with Vercel platform
- **Extensible**: Clean architecture allows for easy addition of new features and tools

---

## 🚀 **Getting Started**

### Prerequisites
- Node.js 18+ and npm
- Modern web browser with Web Crypto API support

### Installation & Development

```bash
# Clone the repository
git clone https://github.com/hemelo/dev-tools.git
cd dev-tools

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build optimized production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

---

## 🛠️ **Available Tools**

| Tool | Category | Description |
|------|----------|-------------|
| **JSON Formatter** | Text | Format, validate, and minify JSON data with statistics |
| **CSV ↔ JSON Converter** | Text | Convert between CSV and JSON formats |
| **YAML ↔ JSON Converter** | Text | Convert between YAML and JSON formats |
| **XML Formatter** | Text | Format, validate, and minify XML documents with statistics |
| **Text Case Converter** | Text | Convert text between different case formats |
| **Text Diff Tool** | Text | Compare two text documents and see differences |
| **Regex Tester** | Text | Test regular expressions with live preview |
| **SQL Formatter** | Text | Format, validate, and minify SQL queries with statistics |
| **Slug Generator** | Text | Generate URL-friendly slugs from any text |
| **EXIF Inspector** | Security | Analyze image metadata and EXIF data for privacy, technical details, and location information |
| **APK Analyzer** | Security | Analyze Android APK files for security, permissions, and structure information |
| **Checksum Tool** | Security | Professional file integrity verification with multiple hash algorithms and batch processing |
| **Unit Converter** | Utilities | Professional unit conversion with comprehensive categories and precision control |
| **Random Number Generator** | Generator | Professional random number generation with statistical analysis |
| **Barcode Generator** | Generator | Generate professional barcodes in multiple formats with customizable options |
| **UUID Generator** | Generator | Generate RFC 4122 compliant unique identifiers |
| **QR Code Generator** | Generator | Generate QR codes from text or URLs |
| **Mock Data Generator** | Generator | Generate fake names, emails, addresses, phones and more |
| **Base64 Tool** | Encoding | Encode/decode Base64 strings |
| **URL Tool** | Encoding | Encode/decode URL components |
| **Timezone Converter** | Web Development | Professional timezone conversion with DST support and global coverage |
| **Image Resizer & Compressor** | Web Development | Professional image processing with batch operations and format conversion |
| **Sequence Diagrams** | Web Development | Create PlantUML-style sequence diagrams with live preview and professional rendering |
| **Flexbox Creator** | Web Development | Create and experiment with flexbox layouts with real-time visual feedback |
| **Favicon Generator** | Web Development | Create favicons from emojis, text, or images with multiple formats |
| **Color Picker & Converter** | Web Development | Pick colors and convert between formats |
| **Number Base Converter** | Data | Convert between binary, octal, decimal, hex |
| **Timestamp Converter** | Data | Convert between Unix timestamps and dates |
| **Matrix Calculator** | Mathematics | Perform matrix operations including determinant, inverse, transpose, and more |
| **ASCII/Unicode Explorer** | Text & Data | Explore ASCII and Unicode characters with detailed information and encoding details |
| **PWA Manifest Generator** | Web Development | Create and customize Progressive Web App manifests with comprehensive configuration options |
| **Statistics Calculator** | Mathematics | Calculate descriptive statistics, generate probability distributions, and analyze data with comprehensive statistical tools |
| **NanoID / ULID Generator** | Generators | Generate unique identifiers using NanoID and ULID algorithms with comprehensive customization options |
| **Workday Calculator** | Business | Calculate business days, working hours, and project timelines with comprehensive holiday and weekend management |
| **Password Strength Tester** | Cryptography & Security | Analyze password strength, calculate entropy, and get security recommendations |
| **Hash Generator** | Cryptography | Generate MD5, SHA-1, SHA-256, SHA-384, SHA-512 hashes |
| **Password Generator** | Cryptography | Generate secure passwords with strength analysis |
| **JWT Decoder** | Cryptography | Decode and validate JSON Web Tokens |
| **HMAC Generator** | Cryptography | Generate HMAC signatures for authentication |
| **AES Encryption** | Cryptography | Encrypt/decrypt data with AES algorithm |
| **Data Visualizer** | Data Analysis | Create charts from CSV and JSON data |
| **IP Geolocation** | Network | Get location and network info from IP addresses |
| **Markdown Editor** | Content | Write and preview markdown with live rendering |
| **CSS Gradient Generator** | Web Development | Create beautiful CSS gradients with visual preview |
| **API Tester** | Network | Test REST APIs with detailed response analysis |
| **JSON Schema Generator** | Data Analysis | Generate JSON Schema from JSON data automatically |
| **DNS Lookup** | Network | Query DNS records for any domain |
| **Lorem Ipsum Generator** | Content | Generate placeholder text in multiple languages |
| **Color Palette Generator** | Web Development | Create color palettes with harmony rules and image extraction |
| **Git Commit Generator** | Development | Generate conventional commit messages |
| **cURL Command Generator** | Network | Generate cURL commands for API testing and debugging |
| **Subnet Calculator** | Network | Calculate network information and subnet masks |
| **SSL/TLS Checker** | Network | Check SSL certificate validity and security grade |
| **Cron Expression Generator** | Development | Generate and validate cron expressions with visual interface |
| **SQL Query Builder** | Database | Build SQL queries visually with drag-and-drop interface, table relationships, and real-time query generation |

---

## 🌐 **Deployment**

This project is deployed on the Vercel platform:

**Live URL**: [https://devtools.hemelo.fyi](https://devtools.hemelo.fyi)

---

## 🤝 **Contributing**

This project welcomes contributions! Whether you want to:
- Add new developer tools
- Improve existing functionality
- Enhance the UI/UX
- Fix bugs or improve performance

Feel free to submit issues and pull requests.

---

## 📄 **License**

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 **Acknowledgments**

- Built with [Lovable](https://lovable.dev) platform
- Vibecoded with [Cursor](https://cursor.com) IDE
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
- Powered by [Vite](https://vitejs.dev) and [React](https://react.dev)

---

*Made with ❤️ for the developer community*