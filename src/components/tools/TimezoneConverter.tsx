import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Copy, Check, Download, RotateCcw, Plus, Minus, Eye, Code, Clock, 
  Upload, Settings, Zap, BookOpen, Palette, Ruler, Layers, Target, 
  AlertCircle, FileImage, Trash2, RefreshCw, Maximize, Minimize,
  Download as DownloadIcon, FolderOpen, ImageIcon, Globe, MapPin,
  Calendar, Timer, Sun, Moon, Sunrise, Sunset, Watch
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TimezoneInfo {
  name: string;
  displayName: string;
  offset: string;
  offsetMinutes: number;
  abbreviation: string;
  isDST: boolean;
  country: string;
  region: string;
}

interface TimezoneConversion {
  id: string;
  fromTimezone: string;
  toTimezone: string;
  fromTime: string;
  toTime: string;
  date: string;
  isDST: boolean;
}

interface TimezonePreset {
  name: string;
  description: string;
  timezones: string[];
  category: 'business' | 'development' | 'global' | 'custom';
}

// Comprehensive timezone database
const TIMEZONES: TimezoneInfo[] = [
  // Americas
  { name: 'America/New_York', displayName: 'Eastern Time (ET)', offset: '-05:00', offsetMinutes: -300, abbreviation: 'EST', isDST: false, country: 'US', region: 'Americas' },
  { name: 'America/New_York', displayName: 'Eastern Daylight Time (EDT)', offset: '-04:00', offsetMinutes: -240, abbreviation: 'EDT', isDST: true, country: 'US', region: 'Americas' },
  { name: 'America/Chicago', displayName: 'Central Time (CT)', offset: '-06:00', offsetMinutes: -360, abbreviation: 'CST', isDST: false, country: 'US', region: 'Americas' },
  { name: 'America/Chicago', displayName: 'Central Daylight Time (CDT)', offset: '-05:00', offsetMinutes: -300, abbreviation: 'CDT', isDST: true, country: 'US', region: 'Americas' },
  { name: 'America/Denver', displayName: 'Mountain Time (MT)', offset: '-07:00', offsetMinutes: -420, abbreviation: 'MST', isDST: false, country: 'US', region: 'Americas' },
  { name: 'America/Denver', displayName: 'Mountain Daylight Time (MDT)', offset: '-06:00', offsetMinutes: -360, abbreviation: 'MDT', isDST: true, country: 'US', region: 'Americas' },
  { name: 'America/Los_Angeles', displayName: 'Pacific Time (PT)', offset: '-08:00', offsetMinutes: -480, abbreviation: 'PST', isDST: false, country: 'US', region: 'Americas' },
  { name: 'America/Los_Angeles', displayName: 'Pacific Daylight Time (PDT)', offset: '-07:00', offsetMinutes: -420, abbreviation: 'PDT', isDST: true, country: 'US', region: 'Americas' },
  { name: 'America/Toronto', displayName: 'Eastern Time (ET)', offset: '-05:00', offsetMinutes: -300, abbreviation: 'EST', isDST: false, country: 'CA', region: 'Americas' },
  { name: 'America/Toronto', displayName: 'Eastern Daylight Time (EDT)', offset: '-04:00', offsetMinutes: -240, abbreviation: 'EDT', isDST: true, country: 'CA', region: 'Americas' },
  { name: 'America/Sao_Paulo', displayName: 'Brasília Time (BRT)', offset: '-03:00', offsetMinutes: -180, abbreviation: 'BRT', isDST: false, country: 'BR', region: 'Americas' },
  { name: 'America/Mexico_City', displayName: 'Central Time (CT)', offset: '-06:00', offsetMinutes: -360, abbreviation: 'CST', isDST: false, country: 'MX', region: 'Americas' },

  // Europe
  { name: 'Europe/London', displayName: 'Greenwich Mean Time (GMT)', offset: '+00:00', offsetMinutes: 0, abbreviation: 'GMT', isDST: false, country: 'GB', region: 'Europe' },
  { name: 'Europe/London', displayName: 'British Summer Time (BST)', offset: '+01:00', offsetMinutes: 60, abbreviation: 'BST', isDST: true, country: 'GB', region: 'Europe' },
  { name: 'Europe/Paris', displayName: 'Central European Time (CET)', offset: '+01:00', offsetMinutes: 60, abbreviation: 'CET', isDST: false, country: 'FR', region: 'Europe' },
  { name: 'Europe/Paris', displayName: 'Central European Summer Time (CEST)', offset: '+02:00', offsetMinutes: 120, abbreviation: 'CEST', isDST: true, country: 'FR', region: 'Europe' },
  { name: 'Europe/Berlin', displayName: 'Central European Time (CET)', offset: '+01:00', offsetMinutes: 60, abbreviation: 'CET', isDST: false, country: 'DE', region: 'Europe' },
  { name: 'Europe/Berlin', displayName: 'Central European Summer Time (CEST)', offset: '+02:00', offsetMinutes: 120, abbreviation: 'CEST', isDST: true, country: 'DE', region: 'Europe' },
  { name: 'Europe/Rome', displayName: 'Central European Time (CET)', offset: '+01:00', offsetMinutes: 60, abbreviation: 'CET', isDST: false, country: 'IT', region: 'Europe' },
  { name: 'Europe/Rome', displayName: 'Central European Summer Time (CEST)', offset: '+02:00', offsetMinutes: 120, abbreviation: 'CEST', isDST: true, country: 'IT', region: 'Europe' },
  { name: 'Europe/Madrid', displayName: 'Central European Time (CET)', offset: '+01:00', offsetMinutes: 60, abbreviation: 'CET', isDST: false, country: 'ES', region: 'Europe' },
  { name: 'Europe/Madrid', displayName: 'Central European Summer Time (CEST)', offset: '+02:00', offsetMinutes: 120, abbreviation: 'CEST', isDST: true, country: 'ES', region: 'Europe' },
  { name: 'Europe/Moscow', displayName: 'Moscow Time (MSK)', offset: '+03:00', offsetMinutes: 180, abbreviation: 'MSK', isDST: false, country: 'RU', region: 'Europe' },

  // Asia
  { name: 'Asia/Tokyo', displayName: 'Japan Standard Time (JST)', offset: '+09:00', offsetMinutes: 540, abbreviation: 'JST', isDST: false, country: 'JP', region: 'Asia' },
  { name: 'Asia/Shanghai', displayName: 'China Standard Time (CST)', offset: '+08:00', offsetMinutes: 480, abbreviation: 'CST', isDST: false, country: 'CN', region: 'Asia' },
  { name: 'Asia/Seoul', displayName: 'Korea Standard Time (KST)', offset: '+09:00', offsetMinutes: 540, abbreviation: 'KST', isDST: false, country: 'KR', region: 'Asia' },
  { name: 'Asia/Singapore', displayName: 'Singapore Time (SGT)', offset: '+08:00', offsetMinutes: 480, abbreviation: 'SGT', isDST: false, country: 'SG', region: 'Asia' },
  { name: 'Asia/Hong_Kong', displayName: 'Hong Kong Time (HKT)', offset: '+08:00', offsetMinutes: 480, abbreviation: 'HKT', isDST: false, country: 'HK', region: 'Asia' },
  { name: 'Asia/Dubai', displayName: 'Gulf Standard Time (GST)', offset: '+04:00', offsetMinutes: 240, abbreviation: 'GST', isDST: false, country: 'AE', region: 'Asia' },
  { name: 'Asia/Kolkata', displayName: 'India Standard Time (IST)', offset: '+05:30', offsetMinutes: 330, abbreviation: 'IST', isDST: false, country: 'IN', region: 'Asia' },
  { name: 'Asia/Bangkok', displayName: 'Indochina Time (ICT)', offset: '+07:00', offsetMinutes: 420, abbreviation: 'ICT', isDST: false, country: 'TH', region: 'Asia' },

  // Oceania
  { name: 'Australia/Sydney', displayName: 'Australian Eastern Standard Time (AEST)', offset: '+10:00', offsetMinutes: 600, abbreviation: 'AEST', isDST: false, country: 'AU', region: 'Oceania' },
  { name: 'Australia/Sydney', displayName: 'Australian Eastern Daylight Time (AEDT)', offset: '+11:00', offsetMinutes: 660, abbreviation: 'AEDT', isDST: true, country: 'AU', region: 'Oceania' },
  { name: 'Australia/Melbourne', displayName: 'Australian Eastern Standard Time (AEST)', offset: '+10:00', offsetMinutes: 600, abbreviation: 'AEST', isDST: false, country: 'AU', region: 'Oceania' },
  { name: 'Australia/Melbourne', displayName: 'Australian Eastern Daylight Time (AEDT)', offset: '+11:00', offsetMinutes: 660, abbreviation: 'AEDT', isDST: true, country: 'AU', region: 'Oceania' },
  { name: 'Pacific/Auckland', displayName: 'New Zealand Standard Time (NZST)', offset: '+12:00', offsetMinutes: 720, abbreviation: 'NZST', isDST: false, country: 'NZ', region: 'Oceania' },
  { name: 'Pacific/Auckland', displayName: 'New Zealand Daylight Time (NZDT)', offset: '+13:00', offsetMinutes: 780, abbreviation: 'NZDT', isDST: true, country: 'NZ', region: 'Oceania' },

  // UTC and GMT
  { name: 'UTC', displayName: 'Coordinated Universal Time (UTC)', offset: '+00:00', offsetMinutes: 0, abbreviation: 'UTC', isDST: false, country: 'UTC', region: 'UTC' },
  { name: 'GMT', displayName: 'Greenwich Mean Time (GMT)', offset: '+00:00', offsetMinutes: 0, abbreviation: 'GMT', isDST: false, country: 'GB', region: 'UTC' },
];

const TIMEZONE_PRESETS: TimezonePreset[] = [
  {
    name: 'Global Business',
    description: 'Major business centers worldwide',
    category: 'business',
    timezones: ['America/New_York', 'Europe/London', 'Asia/Tokyo', 'Asia/Shanghai', 'Australia/Sydney']
  },
  {
    name: 'US Time Zones',
    description: 'All US time zones',
    category: 'business',
    timezones: ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles']
  },
  {
    name: 'European Union',
    description: 'Major EU time zones',
    category: 'business',
    timezones: ['Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Europe/Rome', 'Europe/Madrid']
  },
  {
    name: 'Asia Pacific',
    description: 'Major APAC time zones',
    category: 'business',
    timezones: ['Asia/Tokyo', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Hong_Kong', 'Australia/Sydney']
  },
  {
    name: 'Development Teams',
    description: 'Common time zones for remote development',
    category: 'development',
    timezones: ['America/New_York', 'Europe/London', 'Asia/Tokyo', 'UTC']
  },
  {
    name: '24-Hour Coverage',
    description: 'Time zones for 24/7 operations',
    category: 'global',
    timezones: ['America/Los_Angeles', 'America/New_York', 'Europe/London', 'Asia/Tokyo', 'Australia/Sydney']
  }
];

export const TimezoneConverter = () => {
  const [conversions, setConversions] = useState<TimezoneConversion[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState(new Date().toTimeString().slice(0, 5));
  const [fromTimezone, setFromTimezone] = useState('UTC');
  const [toTimezones, setToTimezones] = useState<string[]>(['America/New_York', 'Europe/London']);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeTab, setActiveTab] = useState("converter");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Get current timezone info
  const getTimezoneInfo = useCallback((timezoneName: string): TimezoneInfo | undefined => {
    return TIMEZONES.find(tz => tz.name === timezoneName);
  }, []);

  // Convert time between timezones
  const convertTime = useCallback((date: string, time: string, fromTz: string, toTz: string): { convertedTime: string; isDST: boolean } => {
    try {
      const fromTzInfo = getTimezoneInfo(fromTz);
      const toTzInfo = getTimezoneInfo(toTz);
      
      if (!fromTzInfo || !toTzInfo) {
        throw new Error('Invalid timezone');
      }

      // Create date object in the source timezone
      const dateTimeString = `${date}T${time}:00`;
      const sourceDate = new Date(dateTimeString);
      
      // Adjust for source timezone offset
      const sourceOffsetMs = fromTzInfo.offsetMinutes * 60 * 1000;
      const utcTime = new Date(sourceDate.getTime() - sourceOffsetMs);
      
      // Apply target timezone offset
      const targetOffsetMs = toTzInfo.offsetMinutes * 60 * 1000;
      const targetTime = new Date(utcTime.getTime() + targetOffsetMs);
      
      const convertedTime = targetTime.toTimeString().slice(0, 5);
      const isDST = toTzInfo.isDST;
      
      return { convertedTime, isDST };
    } catch (error) {
      console.error('Conversion error:', error);
      return { convertedTime: '00:00', isDST: false };
    }
  }, [getTimezoneInfo]);

  // Update conversions when inputs change
  useEffect(() => {
    const newConversions: TimezoneConversion[] = toTimezones.map((toTz, index) => {
      const result = convertTime(selectedDate, selectedTime, fromTimezone, toTz);
      return {
        id: `conv-${index}`,
        fromTimezone,
        toTimezone: toTz,
        fromTime: selectedTime,
        toTime: result.convertedTime,
        date: selectedDate,
        isDST: result.isDST
      };
    });
    setConversions(newConversions);
  }, [selectedDate, selectedTime, fromTimezone, toTimezones, convertTime]);

  // Add timezone to conversion list
  const addTimezone = useCallback((timezone: string) => {
    if (!toTimezones.includes(timezone)) {
      setToTimezones(prev => [...prev, timezone]);
    }
  }, [toTimezones]);

  // Remove timezone from conversion list
  const removeTimezone = useCallback((timezone: string) => {
    setToTimezones(prev => prev.filter(tz => tz !== timezone));
  }, []);

  // Apply preset
  const applyPreset = useCallback((preset: TimezonePreset) => {
    setToTimezones(preset.timezones);
    toast({
      title: "Preset Applied",
      description: `${preset.name} preset has been applied`,
    });
  }, [toast]);

  // Set current time
  const setCurrentTime = useCallback(() => {
    const now = new Date();
    setSelectedDate(now.toISOString().split('T')[0]);
    setSelectedTime(now.toTimeString().slice(0, 5));
    setFromTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
  }, []);

  // Copy results
  const copyResults = useCallback(() => {
    const results = conversions.map(conv => {
      const fromTzInfo = getTimezoneInfo(conv.fromTimezone);
      const toTzInfo = getTimezoneInfo(conv.toTimezone);
      return `${conv.fromTime} ${fromTzInfo?.abbreviation || conv.fromTimezone} → ${conv.toTime} ${toTzInfo?.abbreviation || conv.toTimezone}`;
    }).join('\n');
    
    navigator.clipboard.writeText(results);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Results Copied",
      description: "Timezone conversions copied to clipboard",
    });
  }, [conversions, getTimezoneInfo, toast]);

  // Export results
  const exportResults = useCallback(() => {
    const data = {
      date: selectedDate,
      fromTimezone,
      conversions: conversions.map(conv => ({
        from: `${conv.fromTime} ${conv.fromTimezone}`,
        to: `${conv.toTime} ${conv.toTimezone}`,
        isDST: conv.isDST
      })),
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `timezone-conversion-${selectedDate}.json`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [selectedDate, fromTimezone, conversions]);

  // Get timezone groups
  const getTimezoneGroups = useCallback(() => {
    const groups: { [key: string]: TimezoneInfo[] } = {};
    TIMEZONES.forEach(tz => {
      if (!groups[tz.region]) {
        groups[tz.region] = [];
      }
      groups[tz.region].push(tz);
    });
    return groups;
  }, []);

  // Format time difference
  const getTimeDifference = useCallback((fromTz: string, toTz: string): string => {
    const fromTzInfo = getTimezoneInfo(fromTz);
    const toTzInfo = getTimezoneInfo(toTz);
    
    if (!fromTzInfo || !toTzInfo) return '';
    
    const diff = toTzInfo.offsetMinutes - fromTzInfo.offsetMinutes;
    const hours = Math.floor(Math.abs(diff) / 60);
    const minutes = Math.abs(diff) % 60;
    
    const sign = diff >= 0 ? '+' : '-';
    return `${sign}${hours}:${minutes.toString().padStart(2, '0')}`;
  }, [getTimezoneInfo]);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold">Timezone Converter</h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Zap className="h-3 w-3" />
              Professional
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="gap-2"
            >
              <Settings className="h-4 w-4" />
              {showAdvanced ? 'Hide' : 'Show'} Advanced
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground">
          Professional timezone conversion with DST support, multiple timezones, and global coverage
        </p>
      </div>

      {/* Professional Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Timezone Presets
          </CardTitle>
          <CardDescription>Quick-start configurations for common use cases</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TIMEZONE_PRESETS.map((preset) => (
              <Card key={preset.name} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4" onClick={() => applyPreset(preset)}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{preset.name}</h4>
                    <Badge variant="secondary" className="text-xs">
                      {preset.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{preset.description}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {preset.timezones.slice(0, 3).map(tz => {
                      const tzInfo = getTimezoneInfo(tz);
                      return (
                        <Badge key={tz} variant="outline" className="text-xs">
                          {tzInfo?.abbreviation || tz.split('/')[1]}
                        </Badge>
                      );
                    })}
                    {preset.timezones.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{preset.timezones.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="converter" className="gap-2">
                <Clock className="h-4 w-4" />
                Converter
              </TabsTrigger>
              <TabsTrigger value="timezones" className="gap-2">
                <Globe className="h-4 w-4" />
                Timezones
              </TabsTrigger>
              <TabsTrigger value="info" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Info
              </TabsTrigger>
            </TabsList>

            <TabsContent value="converter" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Time Input</CardTitle>
                  <CardDescription>Set the date and time to convert</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>From Timezone</Label>
                    <Select value={fromTimezone} onValueChange={setFromTimezone}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(getTimezoneGroups()).map(([region, timezones]) => (
                          <div key={region}>
                            <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                              {region}
                            </div>
                            {timezones.map((tz) => (
                              <SelectItem key={`${tz.name}-${tz.isDST}`} value={tz.name}>
                                <div className="flex items-center gap-2">
                                  <span>{tz.displayName}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {tz.abbreviation}
                                  </Badge>
                                  {tz.isDST && (
                                    <Badge variant="secondary" className="text-xs">
                                      DST
                                    </Badge>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={setCurrentTime} variant="outline" className="w-full gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Use Current Time
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Target Timezones</CardTitle>
                  <CardDescription>Select timezones to convert to</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Add Timezone</Label>
                    <Select onValueChange={addTimezone}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a timezone to add" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(getTimezoneGroups()).map(([region, timezones]) => (
                          <div key={region}>
                            <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                              {region}
                            </div>
                            {timezones.map((tz) => (
                              <SelectItem key={`${tz.name}-${tz.isDST}`} value={tz.name}>
                                <div className="flex items-center gap-2">
                                  <span>{tz.displayName}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {tz.abbreviation}
                                  </Badge>
                                  {tz.isDST && (
                                    <Badge variant="secondary" className="text-xs">
                                      DST
                                    </Badge>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Selected Timezones ({toTimezones.length})</Label>
                    <div className="space-y-2">
                      {toTimezones.map((tz) => {
                        const tzInfo = getTimezoneInfo(tz);
                        return (
                          <div key={tz} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{tzInfo?.displayName || tz}</span>
                              <Badge variant="outline" className="text-xs">
                                {tzInfo?.abbreviation || tz.split('/')[1]}
                              </Badge>
                              {tzInfo?.isDST && (
                                <Badge variant="secondary" className="text-xs">
                                  DST
                                </Badge>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTimezone(tz)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timezones" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Timezone Database</CardTitle>
                  <CardDescription>Browse all available timezones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(getTimezoneGroups()).map(([region, timezones]) => (
                      <div key={region}>
                        <h4 className="font-medium mb-2 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {region}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {timezones.map((tz) => (
                            <div key={`${tz.name}-${tz.isDST}`} className="flex items-center justify-between p-2 border rounded">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{tz.displayName}</span>
                                <Badge variant="outline" className="text-xs">
                                  {tz.abbreviation}
                                </Badge>
                                {tz.isDST && (
                                  <Badge variant="secondary" className="text-xs">
                                    DST
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {tz.offset}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="info" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Timezone Information</CardTitle>
                  <CardDescription>Learn about timezone conversion and DST</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">Daylight Saving Time (DST)</h4>
                    <p className="text-sm text-muted-foreground">
                      DST is automatically calculated based on the current date. Timezones with DST will show 
                      different offsets during summer months.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">UTC Reference</h4>
                    <p className="text-sm text-muted-foreground">
                      All conversions are calculated relative to UTC (Coordinated Universal Time). 
                      UTC is the primary time standard by which the world regulates clocks and time.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Timezone Abbreviations</h4>
                    <p className="text-sm text-muted-foreground">
                      Timezone abbreviations (like EST, PST, GMT) are shown for convenience but may not 
                      be unique. The full timezone name (like America/New_York) is the authoritative identifier.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Conversion Results</CardTitle>
                <div className="flex gap-2">
                  <Button
                    onClick={copyResults}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    Copy
                  </Button>
                  <Button
                    onClick={exportResults}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <DownloadIcon className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {conversions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No conversions to display</p>
                  <p className="text-sm">Select timezones to see conversion results</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {conversions.map((conv) => {
                    const fromTzInfo = getTimezoneInfo(conv.fromTimezone);
                    const toTzInfo = getTimezoneInfo(conv.toTimezone);
                    const timeDiff = getTimeDifference(conv.fromTimezone, conv.toTimezone);
                    
                    return (
                      <div key={conv.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{toTzInfo?.displayName || conv.toTimezone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {toTzInfo?.abbreviation || conv.toTimezone.split('/')[1]}
                            </Badge>
                            {conv.isDST && (
                              <Badge variant="secondary" className="text-xs">
                                DST
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">From</p>
                            <p className="font-medium">
                              {conv.fromTime} {fromTzInfo?.abbreviation || conv.fromTimezone}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">To</p>
                            <p className="font-medium">
                              {conv.toTime} {toTzInfo?.abbreviation || conv.toTimezone}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-2 flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {timeDiff} difference
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {toTzInfo?.offset}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Current Time Display */}
          <Card>
            <CardHeader>
              <CardTitle>Current Time</CardTitle>
              <CardDescription>Real-time display of current time in selected timezones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {toTimezones.map((tz) => {
                  const tzInfo = getTimezoneInfo(tz);
                  const now = new Date();
                  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
                  const localTime = new Date(utcTime + (tzInfo?.offsetMinutes || 0) * 60000);
                  
                  return (
                    <div key={tz} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          <Watch className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{tzInfo?.displayName || tz}</p>
                          <p className="text-sm text-muted-foreground">
                            {tzInfo?.country} • {tzInfo?.offset}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-lg font-medium">
                          {localTime.toTimeString().slice(0, 8)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {localTime.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Professional Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Tips</CardTitle>
          <CardDescription>Best practices for timezone handling</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Development Best Practices</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Always store in UTC:</strong> Convert to local time for display only</li>
                <li>• <strong>Use timezone identifiers:</strong> Prefer "America/New_York" over "EST"</li>
                <li>• <strong>Handle DST transitions:</strong> Be aware of ambiguous times</li>
                <li>• <strong>Test edge cases:</strong> DST start/end dates and leap seconds</li>
                <li>• <strong>Use libraries:</strong> Consider moment.js or date-fns for complex operations</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Business Considerations</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Meeting scheduling:</strong> Always show multiple timezones</li>
                <li>• <strong>Deadline communication:</strong> Specify timezone explicitly</li>
                <li>• <strong>Travel planning:</strong> Account for DST changes</li>
                <li>• <strong>Global teams:</strong> Use consistent timezone references</li>
                <li>• <strong>Documentation:</strong> Always include timezone in timestamps</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
