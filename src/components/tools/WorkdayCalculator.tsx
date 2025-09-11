import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  Copy, 
  Check, 
  Download, 
  Upload, 
  RefreshCw, 
  Settings, 
  Zap, 
  Info, 
  AlertCircle, 
  CheckCircle, 
  RotateCcw, 
  Play, 
  Square, 
  Volume2, 
  VolumeX, 
  Trash2, 
  Edit, 
  Save, 
  Loader2, 
  Target, 
  Activity, 
  PieChart, 
  LineChart, 
  Scatter, 
  Bell, 
  Hash, 
  Percent, 
  Sigma, 
  Function, 
  Grid3X3, 
  List, 
  Table, 
  BookOpen, 
  Lightbulb, 
  ArrowRight, 
  ArrowDown, 
  ArrowUp, 
  ArrowLeft, 
  Palette, 
  Layers, 
  Database, 
  Network, 
  Shield, 
  Lock, 
  Key, 
  Star, 
  Heart, 
  Smile, 
  Frown, 
  Meh, 
  ThumbsUp, 
  ThumbsDown, 
  Flag, 
  MapPin, 
  Clock as ClockIcon, 
  Calendar as CalendarIcon, 
  Mail, 
  Phone, 
  CreditCard, 
  DollarSign, 
  Percent as PercentIcon, 
  Plus, 
  Minus, 
  X, 
  Divide, 
  Equal, 
  LessThan, 
  GreaterThan, 
  QuestionMark, 
  AlertTriangle, 
  AtSign, 
  Hash as HashIcon, 
  DollarSign as DollarIcon, 
  Percent as PercentIcon2, 
  Ampersand, 
  Asterisk, 
  Parentheses, 
  Brackets, 
  Braces, 
  Quotes, 
  Apostrophe, 
  Backslash, 
  ForwardSlash, 
  Pipe, 
  Tilde, 
  Backtick, 
  Underscore, 
  Period, 
  Comma, 
  Semicolon, 
  Colon, 
  Space,
  FileText,
  Code,
  Globe,
  Eye,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Building,
  Users,
  Briefcase,
  Timer,
  CalendarDays,
  CalendarCheck,
  CalendarX,
  CalendarPlus,
  CalendarMinus,
  Calculator
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Holiday {
  id: string;
  name: string;
  date: string;
  type: "fixed" | "floating" | "custom";
  recurring: boolean;
  country?: string;
}

interface BusinessRules {
  workingDays: number[]; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  workingHours: {
    start: string;
    end: string;
  };
  timezone: string;
  excludeHolidays: boolean;
  halfDayHolidays: boolean;
  customHolidays: Holiday[];
}

interface WorkdayResult {
  startDate: string;
  endDate: string;
  totalDays: number;
  businessDays: number;
  weekends: number;
  holidays: number;
  workingHours: number;
  result: string;
  calculationType: "add" | "subtract" | "between";
  daysToAdd?: number;
}

interface DateRange {
  start: string;
  end: string;
  businessDays: number;
  totalDays: number;
  weekends: number;
  holidays: number;
  workingHours: number;
}

const WorkdayCalculator = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [daysToAdd, setDaysToAdd] = useState(5);
  const [calculationType, setCalculationType] = useState<"add" | "subtract" | "between">("add");
  const [businessRules, setBusinessRules] = useState<BusinessRules>({
    workingDays: [1, 2, 3, 4, 5], // Monday to Friday
    workingHours: { start: "09:00", end: "17:00" },
    timezone: "UTC",
    excludeHolidays: true,
    halfDayHolidays: false,
    customHolidays: []
  });
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [results, setResults] = useState<WorkdayResult[]>([]);
  const [copied, setCopied] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  // Predefined holidays for common countries
  const predefinedHolidays: { [key: string]: Holiday[] } = {
    "US": [
      { id: "new-year", name: "New Year's Day", date: "2024-01-01", type: "fixed", recurring: true, country: "US" },
      { id: "mlk-day", name: "Martin Luther King Jr. Day", date: "2024-01-15", type: "floating", recurring: true, country: "US" },
      { id: "presidents-day", name: "Presidents' Day", date: "2024-02-19", type: "floating", recurring: true, country: "US" },
      { id: "memorial-day", name: "Memorial Day", date: "2024-05-27", type: "floating", recurring: true, country: "US" },
      { id: "independence-day", name: "Independence Day", date: "2024-07-04", type: "fixed", recurring: true, country: "US" },
      { id: "labor-day", name: "Labor Day", date: "2024-09-02", type: "floating", recurring: true, country: "US" },
      { id: "columbus-day", name: "Columbus Day", date: "2024-10-14", type: "floating", recurring: true, country: "US" },
      { id: "veterans-day", name: "Veterans Day", date: "2024-11-11", type: "fixed", recurring: true, country: "US" },
      { id: "thanksgiving", name: "Thanksgiving", date: "2024-11-28", type: "floating", recurring: true, country: "US" },
      { id: "christmas", name: "Christmas Day", date: "2024-12-25", type: "fixed", recurring: true, country: "US" }
    ],
    "UK": [
      { id: "new-year-uk", name: "New Year's Day", date: "2024-01-01", type: "fixed", recurring: true, country: "UK" },
      { id: "good-friday", name: "Good Friday", date: "2024-03-29", type: "floating", recurring: true, country: "UK" },
      { id: "easter-monday", name: "Easter Monday", date: "2024-04-01", type: "floating", recurring: true, country: "UK" },
      { id: "early-may", name: "Early May Bank Holiday", date: "2024-05-06", type: "floating", recurring: true, country: "UK" },
      { id: "spring-bank", name: "Spring Bank Holiday", date: "2024-05-27", type: "floating", recurring: true, country: "UK" },
      { id: "summer-bank", name: "Summer Bank Holiday", date: "2024-08-26", type: "floating", recurring: true, country: "UK" },
      { id: "christmas-uk", name: "Christmas Day", date: "2024-12-25", type: "fixed", recurring: true, country: "UK" },
      { id: "boxing-day", name: "Boxing Day", date: "2024-12-26", type: "fixed", recurring: true, country: "UK" }
    ],
    "CA": [
      { id: "new-year-ca", name: "New Year's Day", date: "2024-01-01", type: "fixed", recurring: true, country: "CA" },
      { id: "family-day", name: "Family Day", date: "2024-02-19", type: "floating", recurring: true, country: "CA" },
      { id: "good-friday-ca", name: "Good Friday", date: "2024-03-29", type: "floating", recurring: true, country: "CA" },
      { id: "victoria-day", name: "Victoria Day", date: "2024-05-20", type: "floating", recurring: true, country: "CA" },
      { id: "canada-day", name: "Canada Day", date: "2024-07-01", type: "fixed", recurring: true, country: "CA" },
      { id: "civic-holiday", name: "Civic Holiday", date: "2024-08-05", type: "floating", recurring: true, country: "CA" },
      { id: "labour-day-ca", name: "Labour Day", date: "2024-09-02", type: "floating", recurring: true, country: "CA" },
      { id: "thanksgiving-ca", name: "Thanksgiving", date: "2024-10-14", type: "floating", recurring: true, country: "CA" },
      { id: "remembrance-day", name: "Remembrance Day", date: "2024-11-11", type: "fixed", recurring: true, country: "CA" },
      { id: "christmas-ca", name: "Christmas Day", date: "2024-12-25", type: "fixed", recurring: true, country: "CA" }
    ]
  };

  // Check if a date is a weekend
  const isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return !businessRules.workingDays.includes(day);
  };

  // Check if a date is a holiday
  const isHoliday = (date: Date): boolean => {
    if (!businessRules.excludeHolidays) return false;
    
    const dateStr = date.toISOString().split('T')[0];
    return holidays.some(holiday => holiday.date === dateStr);
  };

  // Check if a date is a business day
  const isBusinessDay = (date: Date): boolean => {
    return !isWeekend(date) && !isHoliday(date);
  };

  // Calculate business days between two dates
  const calculateBusinessDaysBetween = (start: Date, end: Date): DateRange => {
    let businessDays = 0;
    let weekends = 0;
    let holidays = 0;
    let workingHours = 0;
    
    const current = new Date(start);
    const endDate = new Date(end);
    
    while (current <= endDate) {
      if (isWeekend(current)) {
        weekends++;
      } else if (isHoliday(current)) {
        holidays++;
      } else {
        businessDays++;
        workingHours += 8; // Assuming 8 hours per business day
      }
      current.setDate(current.getDate() + 1);
    }
    
    const totalDays = Math.ceil((endDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    return {
      start: start.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0],
      businessDays,
      totalDays,
      weekends,
      holidays,
      workingHours
    };
  };

  // Add business days to a date
  const addBusinessDays = (start: Date, days: number): Date => {
    const result = new Date(start);
    let addedDays = 0;
    
    while (addedDays < days) {
      result.setDate(result.getDate() + 1);
      if (isBusinessDay(result)) {
        addedDays++;
      }
    }
    
    return result;
  };

  // Subtract business days from a date
  const subtractBusinessDays = (start: Date, days: number): Date => {
    const result = new Date(start);
    let subtractedDays = 0;
    
    while (subtractedDays < days) {
      result.setDate(result.getDate() - 1);
      if (isBusinessDay(result)) {
        subtractedDays++;
      }
    }
    
    return result;
  };

  // Perform calculation
  const performCalculation = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      try {
        let result: WorkdayResult;
        
        if (calculationType === "between") {
          if (!startDate || !endDate) {
            toast({
              title: "Error",
              description: "Please provide both start and end dates",
              variant: "destructive",
            });
            setIsCalculating(false);
            return;
          }
          
          const start = new Date(startDate);
          const end = new Date(endDate);
          const range = calculateBusinessDaysBetween(start, end);
          
          result = {
            startDate: range.start,
            endDate: range.end,
            totalDays: range.totalDays,
            businessDays: range.businessDays,
            weekends: range.weekends,
            holidays: range.holidays,
            workingHours: range.workingHours,
            result: `${range.businessDays} business days`,
            calculationType: "between"
          };
        } else {
          if (!startDate) {
            toast({
              title: "Error",
              description: "Please provide a start date",
              variant: "destructive",
            });
            setIsCalculating(false);
            return;
          }
          
          const start = new Date(startDate);
          let resultDate: Date;
          
          if (calculationType === "add") {
            resultDate = addBusinessDays(start, daysToAdd);
          } else {
            resultDate = subtractBusinessDays(start, daysToAdd);
          }
          
          const range = calculateBusinessDaysBetween(start, resultDate);
          
          result = {
            startDate: start.toISOString().split('T')[0],
            endDate: resultDate.toISOString().split('T')[0],
            totalDays: range.totalDays,
            businessDays: range.businessDays,
            weekends: range.weekends,
            holidays: range.holidays,
            workingHours: range.workingHours,
            result: resultDate.toISOString().split('T')[0],
            calculationType,
            daysToAdd
          };
        }
        
        setResults(prev => [result, ...prev]);
        setIsCalculating(false);
        
        toast({
          title: "Calculation complete",
          description: `Business days calculated successfully`,
        });
      } catch (error) {
        setIsCalculating(false);
        toast({
          title: "Error",
          description: "Failed to perform calculation",
          variant: "destructive",
        });
      }
    }, 500);
  };

  // Add holiday
  const addHoliday = () => {
    const newHoliday: Holiday = {
      id: `holiday-${Date.now()}`,
      name: "",
      date: "",
      type: "custom",
      recurring: false
    };
    setHolidays(prev => [...prev, newHoliday]);
  };

  // Update holiday
  const updateHoliday = (id: string, field: keyof Holiday, value: any) => {
    setHolidays(prev => prev.map(holiday => 
      holiday.id === id ? { ...holiday, [field]: value } : holiday
    ));
  };

  // Remove holiday
  const removeHoliday = (id: string) => {
    setHolidays(prev => prev.filter(holiday => holiday.id !== id));
  };

  // Load predefined holidays
  const loadPredefinedHolidays = (country: string) => {
    const countryHolidays = predefinedHolidays[country] || [];
    setHolidays(prev => [...prev, ...countryHolidays]);
    
    toast({
      title: "Holidays loaded",
      description: `${countryHolidays.length} holidays loaded for ${country}`,
    });
  };

  // Clear all results
  const clearResults = () => {
    setResults([]);
    toast({
      title: "Cleared",
      description: "All calculation results have been removed",
    });
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  // Export results
  const exportResults = () => {
    const data = {
      businessRules,
      holidays,
      results
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workday-calculations.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Exported!",
      description: "Workday calculations have been exported",
    });
  };

  // Update business rules
  const updateBusinessRules = (field: keyof BusinessRules, value: any) => {
    setBusinessRules(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Load example configuration
  const loadExample = () => {
    setStartDate("2024-01-15");
    setDaysToAdd(10);
    setCalculationType("add");
    setBusinessRules({
      workingDays: [1, 2, 3, 4, 5],
      workingHours: { start: "09:00", end: "17:00" },
      timezone: "UTC",
      excludeHolidays: true,
      halfDayHolidays: false,
      customHolidays: []
    });
    
    toast({
      title: "Example loaded",
      description: "Sample configuration has been loaded",
    });
  };

  // Reset configuration
  const resetConfiguration = () => {
    setStartDate("");
    setEndDate("");
    setDaysToAdd(5);
    setCalculationType("add");
    setBusinessRules({
      workingDays: [1, 2, 3, 4, 5],
      workingHours: { start: "09:00", end: "17:00" },
      timezone: "UTC",
      excludeHolidays: true,
      halfDayHolidays: false,
      customHolidays: []
    });
    setHolidays([]);
    setResults([]);
    
    toast({
      title: "Configuration reset",
      description: "All settings have been reset to defaults",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Workday Calculator</h2>
        <p className="text-muted-foreground">
          Calculate business days, working hours, and project timelines with comprehensive holiday and weekend management
        </p>
      </div>

      <Tabs defaultValue="calculator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="holidays">Holidays</TabsTrigger>
          <TabsTrigger value="results">Results</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Calculator */}
        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Day Calculator</CardTitle>
              <CardDescription>Calculate business days between dates or add/subtract business days</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Calculation Type</Label>
                <Select value={calculationType} onValueChange={(value: "add" | "subtract" | "between") => setCalculationType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">Add Business Days</SelectItem>
                    <SelectItem value="subtract">Subtract Business Days</SelectItem>
                    <SelectItem value="between">Days Between Dates</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                {calculationType === "between" ? (
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label>Days to {calculationType === "add" ? "Add" : "Subtract"}</Label>
                    <Input
                      type="number"
                      min="1"
                      value={daysToAdd}
                      onChange={(e) => setDaysToAdd(parseInt(e.target.value) || 1)}
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button onClick={performCalculation} disabled={isCalculating} className="gap-2">
                  {isCalculating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Calculator className="h-4 w-4" />
                  )}
                  Calculate
                </Button>
                <Button variant="outline" onClick={loadExample} className="gap-2">
                  <FileText className="h-4 w-4" />
                  Load Example
                </Button>
                <Button variant="outline" onClick={resetConfiguration} className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Holidays */}
        <TabsContent value="holidays" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Holiday Management</CardTitle>
                  <CardDescription>Manage holidays and non-working days</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={addHoliday} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Holiday
                  </Button>
                  <Select onValueChange={loadPredefinedHolidays}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Load holidays" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {holidays.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No holidays configured. Add holidays or load predefined ones.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {holidays.map((holiday) => (
                    <div key={holiday.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                          placeholder="Holiday name"
                          value={holiday.name}
                          onChange={(e) => updateHoliday(holiday.id, "name", e.target.value)}
                        />
                        <Input
                          type="date"
                          value={holiday.date}
                          onChange={(e) => updateHoliday(holiday.id, "date", e.target.value)}
                        />
                        <Select value={holiday.type} onValueChange={(value: "fixed" | "floating" | "custom") => updateHoliday(holiday.id, "type", value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fixed">Fixed Date</SelectItem>
                            <SelectItem value="floating">Floating Date</SelectItem>
                            <SelectItem value="custom">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={holiday.recurring}
                          onCheckedChange={(checked) => updateHoliday(holiday.id, "recurring", checked)}
                        />
                        <Label className="text-sm">Recurring</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeHoliday(holiday.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Results */}
        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Calculation Results</CardTitle>
                  <CardDescription>
                    {results.length} calculations performed
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={clearResults} className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Clear All
                  </Button>
                  <Button variant="outline" onClick={exportResults} className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {results.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No calculations performed yet. Use the Calculator tab to perform calculations.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((result, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant={result.calculationType === "between" ? "default" : "secondary"}>
                          {result.calculationType === "between" ? "Between Dates" : 
                           result.calculationType === "add" ? "Add Days" : "Subtract Days"}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(result.result, "Result")}
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium text-muted-foreground">Start Date</Label>
                          <p className="font-mono text-sm">{result.startDate}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm font-medium text-muted-foreground">End Date</Label>
                          <p className="font-mono text-sm">{result.endDate}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm font-medium text-muted-foreground">Business Days</Label>
                          <p className="text-lg font-semibold">{result.businessDays}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm font-medium text-muted-foreground">Total Days</Label>
                          <p className="text-sm">{result.totalDays}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm font-medium text-muted-foreground">Weekends</Label>
                          <p className="text-sm">{result.weekends}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm font-medium text-muted-foreground">Holidays</Label>
                          <p className="text-sm">{result.holidays}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm font-medium text-muted-foreground">Working Hours</Label>
                          <p className="text-sm">{result.workingHours}h</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-sm font-medium text-muted-foreground">Result</Label>
                          <p className="font-mono text-sm font-semibold">{result.result}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Business Rules</CardTitle>
              <CardDescription>Configure working days, hours, and business rules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Working Days</Label>
                <div className="flex gap-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                    <Button
                      key={day}
                      variant={businessRules.workingDays.includes(index) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const newWorkingDays = businessRules.workingDays.includes(index)
                          ? businessRules.workingDays.filter(d => d !== index)
                          : [...businessRules.workingDays, index];
                        updateBusinessRules("workingDays", newWorkingDays);
                      }}
                    >
                      {day}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Working Hours Start</Label>
                  <Input
                    type="time"
                    value={businessRules.workingHours.start}
                    onChange={(e) => updateBusinessRules("workingHours", { ...businessRules.workingHours, start: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Working Hours End</Label>
                  <Input
                    type="time"
                    value={businessRules.workingHours.end}
                    onChange={(e) => updateBusinessRules("workingHours", { ...businessRules.workingHours, end: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select value={businessRules.timezone} onValueChange={(value) => updateBusinessRules("timezone", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    <SelectItem value="Europe/London">London</SelectItem>
                    <SelectItem value="Europe/Paris">Paris</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Exclude Holidays</Label>
                    <p className="text-sm text-muted-foreground">Exclude holidays from business day calculations</p>
                  </div>
                  <Switch
                    checked={businessRules.excludeHolidays}
                    onCheckedChange={(checked) => updateBusinessRules("excludeHolidays", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Half Day Holidays</Label>
                    <p className="text-sm text-muted-foreground">Treat holidays as half working days</p>
                  </div>
                  <Switch
                    checked={businessRules.halfDayHolidays}
                    onCheckedChange={(checked) => updateBusinessRules("halfDayHolidays", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Workday Calculator Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Workday Calculator Reference</CardTitle>
          <CardDescription>Understanding business day calculations and best practices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Calculation Types</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Add Business Days:</strong> Add N business days to a start date</li>
                <li>• <strong>Subtract Business Days:</strong> Subtract N business days from a start date</li>
                <li>• <strong>Days Between:</strong> Calculate business days between two dates</li>
                <li>• <strong>Working Hours:</strong> Calculate total working hours in a period</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Business Rules</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Working Days:</strong> Configure which days are considered working days</li>
                <li>• <strong>Holidays:</strong> Define fixed, floating, and custom holidays</li>
                <li>• <strong>Working Hours:</strong> Set daily working hours for calculations</li>
                <li>• <strong>Timezone:</strong> Handle different timezones for global teams</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">Pro Tip</p>
                <p className="text-blue-700 dark:text-blue-300">
                  Use this tool for project planning, deadline calculations, and business day analysis. 
                  Configure holidays for your specific region and business rules to get accurate results. 
                  Export results for integration with project management tools.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkdayCalculator;
