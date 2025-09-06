import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Clock, 
  Copy, 
  Calendar, 
  Zap, 
  AlertTriangle,
  CheckCircle,
  Info,
  Play,
  Pause,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CronConfig {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

interface CronPreset {
  name: string;
  description: string;
  cron: string;
  config: CronConfig;
}

const CronGenerator = () => {
  const [config, setConfig] = useState<CronConfig>({
    minute: "*",
    hour: "*",
    dayOfMonth: "*",
    month: "*",
    dayOfWeek: "*"
  });
  
  const [generatedCron, setGeneratedCron] = useState("");
  const [nextRuns, setNextRuns] = useState<string[]>([]);
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const { toast } = useToast();

  const presets: Record<string, CronPreset> = {
    everyMinute: {
      name: "Every Minute",
      description: "Run every minute",
      cron: "* * * * *",
      config: { minute: "*", hour: "*", dayOfMonth: "*", month: "*", dayOfWeek: "*" }
    },
    everyHour: {
      name: "Every Hour",
      description: "Run at the top of every hour",
      cron: "0 * * * *",
      config: { minute: "0", hour: "*", dayOfMonth: "*", month: "*", dayOfWeek: "*" }
    },
    daily: {
      name: "Daily",
      description: "Run every day at midnight",
      cron: "0 0 * * *",
      config: { minute: "0", hour: "0", dayOfMonth: "*", month: "*", dayOfWeek: "*" }
    },
    weekly: {
      name: "Weekly",
      description: "Run every Monday at midnight",
      cron: "0 0 * * 1",
      config: { minute: "0", hour: "0", dayOfMonth: "*", month: "*", dayOfWeek: "1" }
    },
    monthly: {
      name: "Monthly",
      description: "Run on the 1st of every month at midnight",
      cron: "0 0 1 * *",
      config: { minute: "0", hour: "0", dayOfMonth: "1", month: "*", dayOfWeek: "*" }
    },
    businessHours: {
      name: "Business Hours",
      description: "Run every hour from 9 AM to 5 PM, Monday to Friday",
      cron: "0 9-17 * * 1-5",
      config: { minute: "0", hour: "9-17", dayOfMonth: "*", month: "*", dayOfWeek: "1-5" }
    },
    every15Minutes: {
      name: "Every 15 Minutes",
      description: "Run every 15 minutes",
      cron: "*/15 * * * *",
      config: { minute: "*/15", hour: "*", dayOfMonth: "*", month: "*", dayOfWeek: "*" }
    },
    twiceDaily: {
      name: "Twice Daily",
      description: "Run at 6 AM and 6 PM every day",
      cron: "0 6,18 * * *",
      config: { minute: "0", hour: "6,18", dayOfMonth: "*", month: "*", dayOfWeek: "*" }
    }
  };

  const validateCronField = (field: string, type: keyof CronConfig): boolean => {
    if (field === "*") return true;
    
    // Check for ranges (e.g., 1-5)
    if (field.includes("-")) {
      const parts = field.split("-");
      if (parts.length !== 2) return false;
      const start = parseInt(parts[0]);
      const end = parseInt(parts[1]);
      if (isNaN(start) || isNaN(end) || start > end) return false;
      
      const maxValues = { minute: 59, hour: 23, dayOfMonth: 31, month: 12, dayOfWeek: 6 };
      const minValues = { minute: 0, hour: 0, dayOfMonth: 1, month: 1, dayOfWeek: 0 };
      return start >= minValues[type] && end <= maxValues[type];
    }
    
    // Check for lists (e.g., 1,3,5)
    if (field.includes(",")) {
      const parts = field.split(",");
      return parts.every(part => validateCronField(part.trim(), type));
    }
    
    // Check for steps (e.g., */5, 0-30/5)
    if (field.includes("/")) {
      const parts = field.split("/");
      if (parts.length !== 2) return false;
      const base = parts[0];
      const step = parseInt(parts[1]);
      if (isNaN(step) || step <= 0) return false;
      
      if (base === "*") return true;
      
      // Validate the base part
      if (base.includes("-")) {
        const rangeParts = base.split("-");
        if (rangeParts.length !== 2) return false;
        const start = parseInt(rangeParts[0]);
        const end = parseInt(rangeParts[1]);
        if (isNaN(start) || isNaN(end) || start > end) return false;
        
        const maxValues = { minute: 59, hour: 23, dayOfMonth: 31, month: 12, dayOfWeek: 6 };
        const minValues = { minute: 0, hour: 0, dayOfMonth: 1, month: 1, dayOfWeek: 0 };
        return start >= minValues[type] && end <= maxValues[type];
      }
      
      return validateCronField(base, type);
    }
    
    // Check for single values
    const num = parseInt(field);
    if (isNaN(num)) return false;
    
    const maxValues = { minute: 59, hour: 23, dayOfMonth: 31, month: 12, dayOfWeek: 6 };
    const minValues = { minute: 0, hour: 0, dayOfMonth: 1, month: 1, dayOfWeek: 0 };
    return num >= minValues[type] && num <= maxValues[type];
  };

  const validateCronExpression = (config: CronConfig): boolean => {
    return (
      validateCronField(config.minute, 'minute') &&
      validateCronField(config.hour, 'hour') &&
      validateCronField(config.dayOfMonth, 'dayOfMonth') &&
      validateCronField(config.month, 'month') &&
      validateCronField(config.dayOfWeek, 'dayOfWeek')
    );
  };

  const generateCronExpression = () => {
    const cron = `${config.minute} ${config.hour} ${config.dayOfMonth} ${config.month} ${config.dayOfWeek}`;
    setGeneratedCron(cron);
    
    const valid = validateCronExpression(config);
    setIsValid(valid);
    
    if (valid) {
      setError("");
      generateNextRuns(cron);
    } else {
      setError("Invalid cron expression. Please check your values.");
      setNextRuns([]);
    }
  };

  const parseCronField = (field: string, min: number, max: number): number[] => {
    if (field === '*') {
      return Array.from({ length: max - min + 1 }, (_, i) => min + i);
    }

    const values: number[] = [];
    const parts = field.split(',');

    for (const part of parts) {
      if (part.includes('/')) {
        // Handle step values (e.g., */5, 0-30/5)
        const [range, step] = part.split('/');
        const stepNum = parseInt(step);
        
        let rangeValues: number[];
        if (range === '*') {
          rangeValues = Array.from({ length: max - min + 1 }, (_, i) => min + i);
        } else if (range.includes('-')) {
          const [start, end] = range.split('-').map(Number);
          rangeValues = Array.from({ length: end - start + 1 }, (_, i) => start + i);
        } else {
          rangeValues = [parseInt(range)];
        }
        
        for (let i = 0; i < rangeValues.length; i += stepNum) {
          if (rangeValues[i] >= min && rangeValues[i] <= max) {
            values.push(rangeValues[i]);
          }
        }
      } else if (part.includes('-')) {
        // Handle ranges (e.g., 1-5, 9-17)
        const [start, end] = part.split('-').map(Number);
        for (let i = start; i <= end; i++) {
          if (i >= min && i <= max) {
            values.push(i);
          }
        }
      } else {
        // Handle single values
        const value = parseInt(part);
        if (value >= min && value <= max) {
          values.push(value);
        }
      }
    }

    return [...new Set(values)].sort((a, b) => a - b);
  };

  const getNextRunTime = (cron: string, fromDate: Date): Date | null => {
    const [minute, hour, dayOfMonth, month, dayOfWeek] = cron.split(' ');
    
    const minutes = parseCronField(minute, 0, 59);
    const hours = parseCronField(hour, 0, 23);
    const daysOfMonth = parseCronField(dayOfMonth, 1, 31);
    const months = parseCronField(month, 1, 12);
    const daysOfWeek = parseCronField(dayOfWeek, 0, 6);

    // Start from the next minute
    let current = new Date(fromDate);
    current.setSeconds(0, 0);
    current.setMinutes(current.getMinutes() + 1);

    // Look ahead up to 1 year
    const maxDate = new Date(current.getTime() + 365 * 24 * 60 * 60 * 1000);

    while (current < maxDate) {
      const currentMonth = current.getMonth() + 1; // getMonth() returns 0-11
      const currentDay = current.getDate();
      const currentHour = current.getHours();
      const currentMinute = current.getMinutes();
      const currentDayOfWeek = current.getDay(); // 0 = Sunday, 6 = Saturday

      // Check month
      if (!months.includes(currentMonth)) {
        // Move to next month
        current.setMonth(current.getMonth() + 1, 1);
        current.setHours(0, 0, 0, 0);
        continue;
      }

      // Check day of month and day of week
      const dayOfMonthMatch = daysOfMonth.includes(currentDay);
      const dayOfWeekMatch = daysOfWeek.includes(currentDayOfWeek);
      
      // If both day fields are specified (not *), both must match
      // If only one is specified, that one must match
      const dayMatches = (dayOfMonth === '*' || dayOfMonthMatch) && 
                        (dayOfWeek === '*' || dayOfWeekMatch);

      if (!dayMatches) {
        // Move to next day
        current.setDate(current.getDate() + 1);
        current.setHours(0, 0, 0, 0);
        continue;
      }

      // Check hour
      if (!hours.includes(currentHour)) {
        // Move to next hour
        current.setHours(current.getHours() + 1, 0, 0, 0);
        continue;
      }

      // Check minute
      if (!minutes.includes(currentMinute)) {
        // Move to next minute
        current.setMinutes(current.getMinutes() + 1, 0, 0);
        continue;
      }

      return new Date(current);
    }

    return null;
  };

  const generateNextRuns = (cron: string) => {
    const runs: string[] = [];
    let currentDate = new Date();
    
    // Generate next 5 occurrences
    for (let i = 0; i < 5; i++) {
      const nextRun = getNextRunTime(cron, currentDate);
      if (nextRun) {
        runs.push(nextRun.toLocaleString());
        currentDate = new Date(nextRun.getTime() + 60000); // Move to next minute
      } else {
        break;
      }
    }
    
    setNextRuns(runs);
  };

  const loadPreset = (presetKey: string) => {
    const preset = presets[presetKey];
    if (preset) {
      setConfig(preset.config);
      setSelectedPreset(presetKey);
      setGeneratedCron(preset.cron);
      setIsValid(true);
      setError("");
      generateNextRuns(preset.cron);
    }
  };

  const copyCron = () => {
    navigator.clipboard.writeText(generatedCron);
    toast({
      title: "Copied!",
      description: "Cron expression copied to clipboard!",
    });
  };

  const updateConfig = (field: keyof CronConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
    setSelectedPreset("");
  };

  const getFieldDescription = (field: keyof CronConfig): string => {
    const descriptions = {
      minute: "Minute (0-59)",
      hour: "Hour (0-23)",
      dayOfMonth: "Day of month (1-31)",
      month: "Month (1-12)",
      dayOfWeek: "Day of week (0-6, where 0=Sunday)"
    };
    return descriptions[field];
  };

  const getFieldExamples = (field: keyof CronConfig): string[] => {
    const examples = {
      minute: ["*", "0", "30", "*/15", "0,30", "0-30"],
      hour: ["*", "0", "12", "9-17", "0,12", "*/2"],
      dayOfMonth: ["*", "1", "15", "1-15", "1,15,30", "*/5"],
      month: ["*", "1", "6", "1-6", "1,6,12", "*/3"],
      dayOfWeek: ["*", "0", "1", "1-5", "0,6", "*/2"]
    };
    return examples[field];
  };

  useEffect(() => {
    generateCronExpression();
  }, [config]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Cron Expression Generator</h2>
        <p className="text-muted-foreground">
          Generate and validate cron expressions with visual interface and next run times
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Cron Configuration
            </CardTitle>
            <CardDescription>
              Configure your cron expression parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="presets" className="space-y-4">
              <TabsList>
                <TabsTrigger value="presets">Presets</TabsTrigger>
                <TabsTrigger value="custom">Custom</TabsTrigger>
              </TabsList>
              
              <TabsContent value="presets" className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(presets).map(([key, preset]) => (
                    <Button
                      key={key}
                      variant={selectedPreset === key ? "default" : "outline"}
                      onClick={() => loadPreset(key)}
                      className="justify-start h-auto p-3"
                    >
                      <div className="text-left">
                        <div className="font-medium">{preset.name}</div>
                        <div className="text-xs text-muted-foreground">{preset.description}</div>
                        <div className="text-xs font-mono mt-1">{preset.cron}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="custom" className="space-y-4">
                {Object.entries(config).map(([field, value]) => (
                  <div key={field}>
                    <Label htmlFor={field}>{getFieldDescription(field as keyof CronConfig)}</Label>
                    <Input
                      id={field}
                      value={value}
                      onChange={(e) => updateConfig(field as keyof CronConfig, e.target.value)}
                      className="font-mono"
                      placeholder="*"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      Examples: {getFieldExamples(field as keyof CronConfig).join(", ")}
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <span className="text-red-600 dark:text-red-400 text-sm">{error}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isValid ? (
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              )}
              Generated Expression
            </CardTitle>
            <CardDescription>
              Your cron expression and validation status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Cron Expression:</span>
                <Button variant="outline" size="sm" onClick={copyCron}>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="font-mono text-lg break-all">{generatedCron}</div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={isValid ? "default" : "destructive"}>
                {isValid ? "Valid" : "Invalid"}
              </Badge>
              {isValid && (
                <Badge variant="outline">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Ready to use
                </Badge>
              )}
            </div>

            {isValid && nextRuns.length > 0 && (
              <div>
                <Label className="text-sm font-medium">Next 5 Execution Times:</Label>
                <div className="mt-2 space-y-1">
                  {nextRuns.map((run, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded text-sm">
                      <Calendar className="h-3 w-3" />
                      <span className="font-mono text-xs">{run}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  * Times are calculated based on your current system timezone
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Cron Expression Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Cron Format</h4>
              <div className="bg-muted p-3 rounded font-mono text-sm">
                minute hour day-of-month month day-of-week
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Special Characters</h4>
                <div className="space-y-1 text-sm">
                  <div><code>*</code> - Any value</div>
                  <div><code>,</code> - Value list separator</div>
                  <div><code>-</code> - Range of values</div>
                  <div><code>/</code> - Step values</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Examples</h4>
                <div className="space-y-1 text-sm">
                  <div><code>*/15 * * * *</code> - Every 15 minutes</div>
                  <div><code>0 9-17 * * 1-5</code> - Every hour 9-17, Mon-Fri</div>
                  <div><code>0 0 1 * *</code> - First day of every month</div>
                  <div><code>0 0 * * 0</code> - Every Sunday at midnight</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Common Use Cases
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">System Maintenance</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• Daily backups: <code>0 2 * * *</code></div>
                <div>• Weekly cleanup: <code>0 3 * * 0</code></div>
                <div>• Monthly reports: <code>0 0 1 * *</code></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Application Tasks</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>• Health checks: <code>*/5 * * * *</code></div>
                <div>• Data sync: <code>0 */6 * * *</code></div>
                <div>• Cache refresh: <code>0 0 * * *</code></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CronGenerator;
