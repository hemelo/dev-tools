import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Copy, 
  Check, 
  Users, 
  Mail, 
  MapPin, 
  Phone, 
  Download, 
  RefreshCw, 
  Settings, 
  Info, 
  Zap,
  User,
  Globe,
  Calendar,
  CreditCard,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MockDataConfig {
  count: number;
  includeNames: boolean;
  includeEmails: boolean;
  includeAddresses: boolean;
  includePhones: boolean;
  includeDates: boolean;
  includeIds: boolean;
  includeCreditCards: boolean;
  format: 'json' | 'csv' | 'sql';
  locale: string;
}

interface MockData {
  id?: number;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  dateOfBirth?: string;
  creditCard?: string;
}

const MockDataGenerator = () => {
  const [config, setConfig] = useState<MockDataConfig>({
    count: 10,
    includeNames: true,
    includeEmails: true,
    includeAddresses: true,
    includePhones: true,
    includeDates: false,
    includeIds: true,
    includeCreditCards: false,
    format: 'json',
    locale: 'en-US'
  });
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Sample data arrays
  const firstNames = [
    'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
    'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
    'Thomas', 'Sarah', 'Christopher', 'Karen', 'Charles', 'Nancy', 'Daniel', 'Lisa',
    'Matthew', 'Betty', 'Anthony', 'Helen', 'Mark', 'Sandra', 'Donald', 'Donna',
    'Steven', 'Carol', 'Paul', 'Ruth', 'Andrew', 'Sharon', 'Joshua', 'Michelle',
    'Kenneth', 'Laura', 'Kevin', 'Sarah', 'Brian', 'Kimberly', 'George', 'Deborah',
    'Timothy', 'Dorothy', 'Ronald', 'Lisa', 'Jason', 'Nancy', 'Edward', 'Karen'
  ];

  const lastNames = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
    'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
    'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
    'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young',
    'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
    'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
    'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker'
  ];

  const streetNames = [
    'Main St', 'Oak Ave', 'Pine Rd', 'Cedar Ln', 'Elm St', 'Maple Dr', 'First St', 'Second Ave',
    'Park Rd', 'Washington St', 'Lincoln Ave', 'Jefferson Rd', 'Madison St', 'Monroe Ave', 'Jackson Rd',
    'Adams St', 'Franklin Ave', 'Roosevelt Rd', 'Kennedy St', 'Wilson Ave', 'Johnson Rd', 'Brown St',
    'Davis Ave', 'Miller Rd', 'Wilson St', 'Moore Ave', 'Taylor Rd', 'Anderson St', 'Thomas Ave',
    'Jackson Rd', 'White St', 'Harris Ave', 'Martin Rd', 'Thompson St', 'Garcia Ave', 'Martinez Rd'
  ];

  const cities = [
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego',
    'Dallas', 'San Jose', 'Austin', 'Jacksonville', 'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco',
    'Indianapolis', 'Seattle', 'Denver', 'Washington', 'Boston', 'El Paso', 'Nashville', 'Detroit',
    'Oklahoma City', 'Portland', 'Las Vegas', 'Memphis', 'Louisville', 'Baltimore', 'Milwaukee', 'Albuquerque',
    'Tucson', 'Fresno', 'Sacramento', 'Mesa', 'Kansas City', 'Atlanta', 'Long Beach', 'Colorado Springs'
  ];

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS',
    'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY',
    'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];

  const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Japan', 'Brazil'];

  const generateRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const generateRandomElement = <T,>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const generatePhoneNumber = (): string => {
    const areaCode = generateRandomNumber(200, 999);
    const exchange = generateRandomNumber(200, 999);
    const number = generateRandomNumber(1000, 9999);
    return `(${areaCode}) ${exchange}-${number}`;
  };

  const generateEmail = (firstName: string, lastName: string): string => {
    const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com'];
    const domain = generateRandomElement(domains);
    const variations = [
      `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`,
      `${firstName.toLowerCase()}${lastName.toLowerCase()}@${domain}`,
      `${firstName.toLowerCase()}${lastName.toLowerCase()}${generateRandomNumber(1, 99)}@${domain}`,
      `${firstName.charAt(0).toLowerCase()}${lastName.toLowerCase()}@${domain}`
    ];
    return generateRandomElement(variations);
  };

  const generateAddress = (): { street: string; city: string; state: string; zipCode: string; country: string } => {
    const streetNumber = generateRandomNumber(1, 9999);
    const streetName = generateRandomElement(streetNames);
    const city = generateRandomElement(cities);
    const state = generateRandomElement(states);
    const zipCode = generateRandomNumber(10000, 99999).toString();
    const country = generateRandomElement(countries);
    
    return {
      street: `${streetNumber} ${streetName}`,
      city,
      state,
      zipCode,
      country
    };
  };

  const generateDateOfBirth = (): string => {
    const year = generateRandomNumber(1950, 2005);
    const month = generateRandomNumber(1, 12);
    const day = generateRandomNumber(1, 28);
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  };

  const generateCreditCard = (): string => {
    const types = ['Visa', 'MasterCard', 'American Express', 'Discover'];
    const type = generateRandomElement(types);
    let number = '';
    
    switch (type) {
      case 'Visa':
        number = '4' + generateRandomNumber(100000000000000, 999999999999999).toString();
        break;
      case 'MasterCard':
        number = '5' + generateRandomNumber(100000000000000, 999999999999999).toString();
        break;
      case 'American Express':
        number = '3' + generateRandomNumber(10000000000000, 99999999999999).toString();
        break;
      case 'Discover':
        number = '6' + generateRandomNumber(100000000000000, 999999999999999).toString();
        break;
    }
    
    return `${type}: ${number}`;
  };

  const generateMockData = (): MockData[] => {
    const data: MockData[] = [];
    
    for (let i = 0; i < config.count; i++) {
      const firstName = generateRandomElement(firstNames);
      const lastName = generateRandomElement(lastNames);
      const address = generateAddress();
      
      const item: MockData = {};
      
      if (config.includeIds) {
        item.id = i + 1;
      }
      
      if (config.includeNames) {
        item.firstName = firstName;
        item.lastName = lastName;
        item.fullName = `${firstName} ${lastName}`;
      }
      
      if (config.includeEmails) {
        item.email = generateEmail(firstName, lastName);
      }
      
      if (config.includePhones) {
        item.phone = generatePhoneNumber();
      }
      
      if (config.includeAddresses) {
        item.address = address.street;
        item.city = address.city;
        item.state = address.state;
        item.zipCode = address.zipCode;
        item.country = address.country;
      }
      
      if (config.includeDates) {
        item.dateOfBirth = generateDateOfBirth();
      }
      
      if (config.includeCreditCards) {
        item.creditCard = generateCreditCard();
      }
      
      data.push(item);
    }
    
    return data;
  };

  const formatOutput = (data: MockData[]): string => {
    switch (config.format) {
      case 'json':
        return JSON.stringify(data, null, 2);
      case 'csv':
        if (data.length === 0) return '';
        const headers = Object.keys(data[0]);
        const csvHeaders = headers.join(',');
        const csvRows = data.map(item => 
          headers.map(header => {
            const value = item[header as keyof MockData];
            return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
          }).join(',')
        );
        return [csvHeaders, ...csvRows].join('\n');
      case 'sql':
        if (data.length === 0) return '';
        const tableName = 'mock_data';
        const columns = Object.keys(data[0]);
        const sqlColumns = columns.join(', ');
        const sqlValues = data.map(item => {
          const values = columns.map(col => {
            const value = item[col as keyof MockData];
            return typeof value === 'string' ? `'${value.replace(/'/g, "''")}'` : value;
          });
          return `(${values.join(', ')})`;
        });
        return `INSERT INTO ${tableName} (${sqlColumns}) VALUES\n${sqlValues.join(',\n')};`;
      default:
        return JSON.stringify(data, null, 2);
    }
  };

  const handleGenerate = () => {
    try {
      const data = generateMockData();
      const formatted = formatOutput(data);
      setOutput(formatted);
      
      toast({
        title: "Mock Data Generated",
        description: `Generated ${config.count} records in ${config.format.toUpperCase()} format`,
      });
    } catch (err) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate mock data",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      toast({
        title: "Copied to Clipboard",
        description: "Mock data has been copied to your clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy mock data to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadData = () => {
    if (!output) return;

    const extension = config.format === 'json' ? 'json' : config.format === 'csv' ? 'csv' : 'sql';
    const mimeType = config.format === 'json' ? 'application/json' : 
                    config.format === 'csv' ? 'text/csv' : 'text/sql';
    
    const blob = new Blob([output], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `mock-data-${Date.now()}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: `Mock data has been downloaded as ${extension.toUpperCase()} file`,
    });
  };

  const clearAll = () => {
    setOutput("");
    setCopied(false);
  };

  const loadPreset = (preset: Partial<MockDataConfig>) => {
    setConfig(prev => ({ ...prev, ...preset }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Mock Data Generator</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Generate realistic fake data for testing, development, and prototyping. 
          Create names, emails, addresses, phone numbers, and more in multiple formats.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuration
            </CardTitle>
            <CardDescription>
              Customize your mock data generation settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Count */}
            <div className="space-y-2">
              <Label htmlFor="count">Number of Records</Label>
              <Input
                id="count"
                type="number"
                min="1"
                max="1000"
                value={config.count}
                onChange={(e) => setConfig(prev => ({ ...prev, count: parseInt(e.target.value) || 1 }))}
              />
            </div>

            {/* Format */}
            <div className="space-y-2">
              <Label htmlFor="format">Output Format</Label>
              <Select value={config.format} onValueChange={(value: 'json' | 'csv' | 'sql') => setConfig(prev => ({ ...prev, format: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="sql">SQL INSERT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Data Types */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Include Data Types</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="include-ids"
                    checked={config.includeIds}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeIds: checked }))}
                  />
                  <Label htmlFor="include-ids" className="text-sm">IDs</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="include-names"
                    checked={config.includeNames}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeNames: checked }))}
                  />
                  <Label htmlFor="include-names" className="text-sm">Names</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="include-emails"
                    checked={config.includeEmails}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeEmails: checked }))}
                  />
                  <Label htmlFor="include-emails" className="text-sm">Emails</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="include-phones"
                    checked={config.includePhones}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includePhones: checked }))}
                  />
                  <Label htmlFor="include-phones" className="text-sm">Phones</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="include-addresses"
                    checked={config.includeAddresses}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeAddresses: checked }))}
                  />
                  <Label htmlFor="include-addresses" className="text-sm">Addresses</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="include-dates"
                    checked={config.includeDates}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeDates: checked }))}
                  />
                  <Label htmlFor="include-dates" className="text-sm">Birth Dates</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="include-credit-cards"
                    checked={config.includeCreditCards}
                    onCheckedChange={(checked) => setConfig(prev => ({ ...prev, includeCreditCards: checked }))}
                  />
                  <Label htmlFor="include-credit-cards" className="text-sm">Credit Cards</Label>
                </div>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button onClick={handleGenerate} disabled={!config.includeNames && !config.includeEmails && !config.includeAddresses && !config.includePhones && !config.includeDates && !config.includeIds && !config.includeCreditCards}>
                <Users className="h-4 w-4 mr-2" /> Generate Data
              </Button>
              <Button variant="outline" onClick={clearAll}>
                <RefreshCw className="h-4 w-4 mr-2" /> Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Output Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generated Data
            </CardTitle>
            <CardDescription>
              Your mock data will appear here
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Generated mock data will appear here..."
              value={output}
              readOnly
              className="min-h-[400px] font-mono bg-muted/50"
            />

            {output && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={downloadData} className="gap-2">
                  <Download className="h-4 w-4" /> Download
                </Button>
                <Button variant="outline" size="sm" onClick={copyToClipboard} className="gap-2">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Presets
          </CardTitle>
          <CardDescription>
            Use these presets to quickly configure common data generation scenarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* User Profiles */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-primary">User Profiles</Label>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => loadPreset({ count: 25, includeNames: true, includeEmails: true, includePhones: true, includeAddresses: true, includeIds: true, format: 'json' })}
                >
                  <div>
                    <div className="font-medium">Complete Profiles</div>
                    <div className="text-xs text-muted-foreground">Names, emails, phones, addresses</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => loadPreset({ count: 50, includeNames: true, includeEmails: true, includeIds: true, format: 'csv' })}
                >
                  <div>
                    <div className="font-medium">Basic Users</div>
                    <div className="text-xs text-muted-foreground">Names and emails only</div>
                  </div>
                </Button>
              </div>
            </div>

            {/* Database Seeds */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-primary">Database Seeds</Label>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => loadPreset({ count: 100, includeNames: true, includeEmails: true, includeAddresses: true, includeIds: true, format: 'sql' })}
                >
                  <div>
                    <div className="font-medium">SQL Insert</div>
                    <div className="text-xs text-muted-foreground">Ready for database</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => loadPreset({ count: 200, includeNames: true, includeEmails: true, includeIds: true, format: 'csv' })}
                >
                  <div>
                    <div className="font-medium">CSV Import</div>
                    <div className="text-xs text-muted-foreground">For bulk import</div>
                  </div>
                </Button>
              </div>
            </div>

            {/* Testing Data */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-primary">Testing Data</Label>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => loadPreset({ count: 10, includeNames: true, includeEmails: true, includePhones: true, includeAddresses: true, includeDates: true, includeIds: true, format: 'json' })}
                >
                  <div>
                    <div className="font-medium">Full Test Data</div>
                    <div className="text-xs text-muted-foreground">All fields included</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => loadPreset({ count: 5, includeNames: true, includeEmails: true, includeCreditCards: true, includeIds: true, format: 'json' })}
                >
                  <div>
                    <div className="font-medium">Payment Data</div>
                    <div className="text-xs text-muted-foreground">With credit cards</div>
                  </div>
                </Button>
              </div>
            </div>

            {/* API Mocking */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-primary">API Mocking</Label>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => loadPreset({ count: 15, includeNames: true, includeEmails: true, includePhones: true, includeIds: true, format: 'json' })}
                >
                  <div>
                    <div className="font-medium">API Response</div>
                    <div className="text-xs text-muted-foreground">JSON format</div>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto p-3"
                  onClick={() => loadPreset({ count: 30, includeNames: true, includeEmails: true, includeAddresses: true, includeDates: true, includeIds: true, format: 'json' })}
                >
                  <div>
                    <div className="font-medium">User API</div>
                    <div className="text-xs text-muted-foreground">Complete user data</div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mock Data Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            About Mock Data Generation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Generated Data Types</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Names:</strong> Realistic first and last names</li>
                <li>• <strong>Emails:</strong> Various email formats and domains</li>
                <li>• <strong>Phones:</strong> US phone number format</li>
                <li>• <strong>Addresses:</strong> Street, city, state, zip, country</li>
                <li>• <strong>Dates:</strong> Birth dates (1950-2005)</li>
                <li>• <strong>Credit Cards:</strong> Various card types with numbers</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Output Formats</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>JSON:</strong> Perfect for APIs and web apps</li>
                <li>• <strong>CSV:</strong> Great for spreadsheets and imports</li>
                <li>• <strong>SQL:</strong> Ready-to-use INSERT statements</li>
              </ul>
              
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">Pro Tip</p>
                    <p className="text-blue-700 dark:text-blue-300">
                      Use the presets to quickly generate data for common scenarios. 
                      The SQL format is perfect for database seeding and testing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MockDataGenerator;
