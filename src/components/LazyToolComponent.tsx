import { lazy, Suspense } from 'react';
import { LoadingWrapper } from './LoadingWrapper';
import { Skeleton } from './ui/skeleton';

// Lazy load tool components - using default exports
const JsonFormatter = lazy(() => import('@/components/tools/JsonFormatter'));
const UuidGenerator = lazy(() => import('@/components/tools/UuidGenerator'));
const Base64Tool = lazy(() => import('@/components/tools/Base64Tool'));
const UrlTool = lazy(() => import('@/components/tools/UrlTool'));
const HashGenerator = lazy(() => import('@/components/tools/HashGenerator'));
const PasswordGenerator = lazy(() => import('@/components/tools/PasswordGenerator'));
const JwtTool = lazy(() => import('@/components/tools/JwtTool'));
const HmacGenerator = lazy(() => import('@/components/tools/HmacGenerator'));
const AesTool = lazy(() => import('@/components/tools/AesTool'));
const CsvJsonConverter = lazy(() => import('@/components/tools/CsvJsonConverter'));
const ColorPicker = lazy(() => import('@/components/tools/ColorPicker'));
const NumberBaseConverter = lazy(() => import('@/components/tools/NumberBaseConverter'));
const TimestampConverter = lazy(() => import('@/components/tools/TimestampConverter'));
const CaseConverter = lazy(() => import('@/components/tools/CaseConverter'));
const RegexTester = lazy(() => import('@/components/tools/RegexTester'));
const QrCodeGenerator = lazy(() => import('@/components/tools/QrCodeGenerator'));
const TextDiffTool = lazy(() => import('@/components/tools/TextDiffTool'));
const YamlJsonConverter = lazy(() => import('@/components/tools/YamlJsonConverter'));
const XmlFormatter = lazy(() => import('@/components/tools/XmlFormatter'));
const DataVisualizer = lazy(() => import('@/components/tools/DataVisualizer'));
const IpGeolocation = lazy(() => import('@/components/tools/IpGeolocation'));
const MarkdownEditor = lazy(() => import('@/components/tools/MarkdownEditor'));
const CssGradientGenerator = lazy(() => import('@/components/tools/CssGradientGenerator'));
const ApiTester = lazy(() => import('@/components/tools/ApiTester'));
const JsonSchemaGenerator = lazy(() => import('@/components/tools/JsonSchemaGenerator'));
const DnsLookup = lazy(() => import('@/components/tools/DnsLookup'));
const LoremIpsumGenerator = lazy(() => import('@/components/tools/LoremIpsumGenerator'));
const ColorPaletteGenerator = lazy(() => import('@/components/tools/ColorPaletteGenerator'));
const GitCommitGenerator = lazy(() => import('@/components/tools/GitCommitGenerator'));
const CurlGenerator = lazy(() => import('@/components/tools/CurlGenerator'));
const SubnetCalculator = lazy(() => import('@/components/tools/SubnetCalculator'));
const SslChecker = lazy(() => import('@/components/tools/SslChecker'));
const CronGenerator = lazy(() => import('@/components/tools/CronGenerator'));
const SlugGenerator = lazy(() => import('@/components/tools/SlugGenerator'));
const SqlFormatter = lazy(() => import('@/components/tools/SqlFormatter'));
const MockDataGenerator = lazy(() => import('@/components/tools/MockDataGenerator'));
const FaviconGenerator = lazy(() => import('@/components/tools/FaviconGenerator'));
const FlexboxCreator = lazy(() => import('@/components/tools/FlexboxCreator'));
const TimezoneConverter = lazy(() => import('@/components/tools/TimezoneConverter'));
const RandomNumberGenerator = lazy(() => import('@/components/tools/RandomNumberGenerator'));
const UnitConverter = lazy(() => import('@/components/tools/UnitConverter'));
const ChecksumTool = lazy(() => import('@/components/tools/ChecksumTool'));
const APKAnalyzer = lazy(() => import('@/components/tools/APKAnalyzer'));
const EXIFInspector = lazy(() => import('@/components/tools/EXIFInspector'));
const BarcodeGenerator = lazy(() => import('@/components/tools/BarcodeGenerator'));
const SequenceDiagrams = lazy(() => import('@/components/tools/SequenceDiagrams'));
const MatrixCalculator = lazy(() => import('@/components/tools/MatrixCalculator'));
const ASCIIUnicodeExplorer = lazy(() => import('@/components/tools/ASCIIUnicodeExplorer'));
const ManifestGenerator = lazy(() => import('@/components/tools/ManifestGenerator'));
const StatisticsCalculator = lazy(() => import('@/components/tools/StatisticsCalculator'));
const NanoIDULIDGenerator = lazy(() => import('@/components/tools/NanoIDULIDGenerator'));
const WorkdayCalculator = lazy(() => import('@/components/tools/WorkdayCalculator'));
const PasswordStrengthTester = lazy(() => import('@/components/tools/PasswordStrengthTester'));
const SqlQueryBuilder = lazy(() => import('@/components/tools/SqlQueryBuilder'));

// Tool component mapping
const toolComponents: Record<string, React.ComponentType> = {
  "json-formatter": JsonFormatter,
  "csv-json-converter": CsvJsonConverter,
  "yaml-json-converter": YamlJsonConverter,
  "xml-formatter": XmlFormatter,
  "text-case-converter": CaseConverter,
  "text-diff-tool": TextDiffTool,
  "regex-tester": RegexTester,
  "sql-formatter": SqlFormatter,
  "slug-generator": SlugGenerator,
  "uuid-generator": UuidGenerator,
  "qr-code-generator": QrCodeGenerator,
  "base64-encoder-decoder": Base64Tool,
  "url-encoder-decoder": UrlTool,
  "color-picker-converter": ColorPicker,
  "number-base-converter": NumberBaseConverter,
  "timestamp-converter": TimestampConverter,
  "hash-generator": HashGenerator,
  "password-generator": PasswordGenerator,
  "jwt-decoder": JwtTool,
  "hmac-generator": HmacGenerator,
  "aes-encryption": AesTool,
  "data-visualizer": DataVisualizer,
  "ip-geolocation": IpGeolocation,
  "markdown-editor": MarkdownEditor,
  "css-gradient-generator": CssGradientGenerator,
  "api-tester": ApiTester,
  "json-schema-generator": JsonSchemaGenerator,
  "dns-lookup": DnsLookup,
  "lorem-ipsum-generator": LoremIpsumGenerator,
  "color-palette-generator": ColorPaletteGenerator,
  "git-commit-generator": GitCommitGenerator,
  "curl-command-generator": CurlGenerator,
  "subnet-calculator": SubnetCalculator,
  "ssl-tls-checker": SslChecker,
  "cron-expression-generator": CronGenerator,
  "mock-data-generator": MockDataGenerator,
  "favicon-generator": FaviconGenerator,
  "flexbox-creator": FlexboxCreator,
  "timezone-converter": TimezoneConverter,
  "random-number-generator": RandomNumberGenerator,
  "unit-converter": UnitConverter,
  "checksum-tool": ChecksumTool,
  "apk-analyzer": APKAnalyzer,
  "exif-inspector": EXIFInspector,
  "barcode-generator": BarcodeGenerator,
  "sequence-diagrams": SequenceDiagrams,
  "matrix-calculator": MatrixCalculator,
  "ascii-unicode-explorer": ASCIIUnicodeExplorer,
  "pwa-manifest-generator": ManifestGenerator,
  "statistics-calculator": StatisticsCalculator,
  "nanoid-ulid-generator": NanoIDULIDGenerator,
  "workday-calculator": WorkdayCalculator,
  "password-strength-tester": PasswordStrengthTester,
  "sql-query-builder": SqlQueryBuilder,
};

interface LazyToolComponentProps {
  toolId: string;
}

export const LazyToolComponent = ({ toolId }: LazyToolComponentProps) => {
  const ToolComponent = toolComponents[toolId];

  if (!ToolComponent) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Tool Not Found</h1>
        <p className="text-muted-foreground">
          The tool you're looking for doesn't exist or has been moved.
        </p>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <LoadingWrapper
          isLoading={true}
          showSpinner={true}
          message="Loading tool..."
          className="min-h-96"
        >
          <div />
        </LoadingWrapper>
      }
    >
      <ToolComponent />
    </Suspense>
  );
};
