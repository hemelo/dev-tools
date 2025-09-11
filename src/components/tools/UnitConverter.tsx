import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Copy, Check, Download, RotateCcw, Plus, Minus, Eye, Code, Globe, 
  Upload, Settings, Zap, BookOpen, Palette, Ruler, Layers, Target, 
  AlertCircle, FileImage, Trash2, RefreshCw, Maximize, Minimize,
  Download as DownloadIcon, FolderOpen, ImageIcon, Send, Shield,
  Clock, Activity, Server, Key, Lock, Unlock, Play, Pause, Square,
  Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, BarChart3, TrendingUp,
  Hash, Shuffle, Calculator, History, Save, FileText, BarChart,
  ArrowRightLeft, Thermometer, Weight, Ruler as RulerIcon, 
  Volume2, Zap as ZapIcon, Clock as ClockIcon, MapPin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ConversionUnit {
  name: string;
  symbol: string;
  factor: number; // Factor to convert to base unit
  category: string;
}

interface ConversionResult {
  id: string;
  fromValue: number;
  fromUnit: string;
  toValue: number;
  toUnit: string;
  timestamp: number;
  category: string;
}

interface ConversionCategory {
  id: string;
  name: string;
  icon: any;
  description: string;
  baseUnit: string;
  units: ConversionUnit[];
}

// Conversion categories with comprehensive unit definitions
const CONVERSION_CATEGORIES: ConversionCategory[] = [
  {
    id: 'length',
    name: 'Length',
    icon: RulerIcon,
    description: 'Distance and length measurements',
    baseUnit: 'meter',
    units: [
      { name: 'Meter', symbol: 'm', factor: 1, category: 'length' },
      { name: 'Kilometer', symbol: 'km', factor: 1000, category: 'length' },
      { name: 'Centimeter', symbol: 'cm', factor: 0.01, category: 'length' },
      { name: 'Millimeter', symbol: 'mm', factor: 0.001, category: 'length' },
      { name: 'Micrometer', symbol: 'μm', factor: 0.000001, category: 'length' },
      { name: 'Nanometer', symbol: 'nm', factor: 0.000000001, category: 'length' },
      { name: 'Picometer', symbol: 'pm', factor: 0.000000000001, category: 'length' },
      { name: 'Femtometer', symbol: 'fm', factor: 0.000000000000001, category: 'length' },
      { name: 'Inch', symbol: 'in', factor: 0.0254, category: 'length' },
      { name: 'Foot', symbol: 'ft', factor: 0.3048, category: 'length' },
      { name: 'Yard', symbol: 'yd', factor: 0.9144, category: 'length' },
      { name: 'Mile', symbol: 'mi', factor: 1609.344, category: 'length' },
      { name: 'Nautical Mile', symbol: 'nmi', factor: 1852, category: 'length' },
      { name: 'Light Year', symbol: 'ly', factor: 9.461e15, category: 'length' },
      { name: 'Astronomical Unit', symbol: 'AU', factor: 1.496e11, category: 'length' },
      { name: 'Parsec', symbol: 'pc', factor: 3.086e16, category: 'length' },
      { name: 'Angstrom', symbol: 'Å', factor: 1e-10, category: 'length' },
      { name: 'Fermi', symbol: 'fm', factor: 1e-15, category: 'length' },
      { name: 'Planck Length', symbol: 'ℓP', factor: 1.616e-35, category: 'length' },
      { name: 'Thou', symbol: 'th', factor: 0.0000254, category: 'length' },
      { name: 'Point', symbol: 'pt', factor: 0.000352778, category: 'length' },
      { name: 'Pica', symbol: 'p', factor: 0.00423333, category: 'length' },
      { name: 'Cubit', symbol: 'cubit', factor: 0.4572, category: 'length' },
      { name: 'Fathom', symbol: 'ftm', factor: 1.8288, category: 'length' },
      { name: 'Chain', symbol: 'ch', factor: 20.1168, category: 'length' },
      { name: 'Furlong', symbol: 'fur', factor: 201.168, category: 'length' },
      { name: 'League', symbol: 'lea', factor: 4828.03, category: 'length' }
    ]
  },
  {
    id: 'weight',
    name: 'Weight/Mass',
    icon: Weight,
    description: 'Weight and mass measurements',
    baseUnit: 'kilogram',
    units: [
      { name: 'Kilogram', symbol: 'kg', factor: 1, category: 'weight' },
      { name: 'Gram', symbol: 'g', factor: 0.001, category: 'weight' },
      { name: 'Milligram', symbol: 'mg', factor: 0.000001, category: 'weight' },
      { name: 'Microgram', symbol: 'μg', factor: 0.000000001, category: 'weight' },
      { name: 'Pound', symbol: 'lb', factor: 0.453592, category: 'weight' },
      { name: 'Ounce', symbol: 'oz', factor: 0.0283495, category: 'weight' },
      { name: 'Stone', symbol: 'st', factor: 6.35029, category: 'weight' },
      { name: 'Ton (Metric)', symbol: 't', factor: 1000, category: 'weight' },
      { name: 'Ton (US)', symbol: 'ton', factor: 907.185, category: 'weight' },
      { name: 'Ton (UK)', symbol: 'ton', factor: 1016.05, category: 'weight' },
      { name: 'Carat', symbol: 'ct', factor: 0.0002, category: 'weight' },
      { name: 'Grain', symbol: 'gr', factor: 0.0000647989, category: 'weight' }
    ]
  },
  {
    id: 'temperature',
    name: 'Temperature',
    icon: Thermometer,
    description: 'Temperature measurements',
    baseUnit: 'celsius',
    units: [
      { name: 'Celsius', symbol: '°C', factor: 1, category: 'temperature' },
      { name: 'Fahrenheit', symbol: '°F', factor: 1, category: 'temperature' },
      { name: 'Kelvin', symbol: 'K', factor: 1, category: 'temperature' },
      { name: 'Rankine', symbol: '°R', factor: 1, category: 'temperature' }
    ]
  },
  {
    id: 'area',
    name: 'Area',
    icon: Square,
    description: 'Area measurements',
    baseUnit: 'square_meter',
    units: [
      { name: 'Square Meter', symbol: 'm²', factor: 1, category: 'area' },
      { name: 'Square Kilometer', symbol: 'km²', factor: 1000000, category: 'area' },
      { name: 'Square Centimeter', symbol: 'cm²', factor: 0.0001, category: 'area' },
      { name: 'Square Millimeter', symbol: 'mm²', factor: 0.000001, category: 'area' },
      { name: 'Square Inch', symbol: 'in²', factor: 0.00064516, category: 'area' },
      { name: 'Square Foot', symbol: 'ft²', factor: 0.092903, category: 'area' },
      { name: 'Square Yard', symbol: 'yd²', factor: 0.836127, category: 'area' },
      { name: 'Square Mile', symbol: 'mi²', factor: 2589988.11, category: 'area' },
      { name: 'Acre', symbol: 'ac', factor: 4046.86, category: 'area' },
      { name: 'Hectare', symbol: 'ha', factor: 10000, category: 'area' }
    ]
  },
  {
    id: 'volume',
    name: 'Volume',
    icon: Volume2,
    description: 'Volume and capacity measurements',
    baseUnit: 'liter',
    units: [
      { name: 'Liter', symbol: 'L', factor: 1, category: 'volume' },
      { name: 'Milliliter', symbol: 'mL', factor: 0.001, category: 'volume' },
      { name: 'Cubic Meter', symbol: 'm³', factor: 1000, category: 'volume' },
      { name: 'Cubic Centimeter', symbol: 'cm³', factor: 0.001, category: 'volume' },
      { name: 'Cubic Inch', symbol: 'in³', factor: 0.0163871, category: 'volume' },
      { name: 'Cubic Foot', symbol: 'ft³', factor: 28.3168, category: 'volume' },
      { name: 'Cubic Yard', symbol: 'yd³', factor: 764.555, category: 'volume' },
      { name: 'Gallon (US)', symbol: 'gal', factor: 3.78541, category: 'volume' },
      { name: 'Gallon (UK)', symbol: 'gal', factor: 4.54609, category: 'volume' },
      { name: 'Quart (US)', symbol: 'qt', factor: 0.946353, category: 'volume' },
      { name: 'Pint (US)', symbol: 'pt', factor: 0.473176, category: 'volume' },
      { name: 'Cup (US)', symbol: 'cup', factor: 0.236588, category: 'volume' },
      { name: 'Fluid Ounce (US)', symbol: 'fl oz', factor: 0.0295735, category: 'volume' },
      { name: 'Fluid Ounce (UK)', symbol: 'fl oz', factor: 0.0284131, category: 'volume' },
      { name: 'Tablespoon', symbol: 'tbsp', factor: 0.0147868, category: 'volume' },
      { name: 'Teaspoon', symbol: 'tsp', factor: 0.00492892, category: 'volume' }
    ]
  },
  {
    id: 'time',
    name: 'Time',
    icon: ClockIcon,
    description: 'Time measurements',
    baseUnit: 'second',
    units: [
      { name: 'Second', symbol: 's', factor: 1, category: 'time' },
      { name: 'Millisecond', symbol: 'ms', factor: 0.001, category: 'time' },
      { name: 'Microsecond', symbol: 'μs', factor: 0.000001, category: 'time' },
      { name: 'Nanosecond', symbol: 'ns', factor: 0.000000001, category: 'time' },
      { name: 'Minute', symbol: 'min', factor: 60, category: 'time' },
      { name: 'Hour', symbol: 'h', factor: 3600, category: 'time' },
      { name: 'Day', symbol: 'd', factor: 86400, category: 'time' },
      { name: 'Week', symbol: 'wk', factor: 604800, category: 'time' },
      { name: 'Month', symbol: 'mo', factor: 2629746, category: 'time' },
      { name: 'Year', symbol: 'yr', factor: 31556952, category: 'time' },
      { name: 'Decade', symbol: 'decade', factor: 315569520, category: 'time' },
      { name: 'Century', symbol: 'century', factor: 3155695200, category: 'time' }
    ]
  },
  {
    id: 'speed',
    name: 'Speed',
    icon: ZapIcon,
    description: 'Speed and velocity measurements',
    baseUnit: 'meter_per_second',
    units: [
      { name: 'Meter per Second', symbol: 'm/s', factor: 1, category: 'speed' },
      { name: 'Kilometer per Hour', symbol: 'km/h', factor: 0.277778, category: 'speed' },
      { name: 'Mile per Hour', symbol: 'mph', factor: 0.44704, category: 'speed' },
      { name: 'Foot per Second', symbol: 'ft/s', factor: 0.3048, category: 'speed' },
      { name: 'Knot', symbol: 'kn', factor: 0.514444, category: 'speed' },
      { name: 'Mach', symbol: 'Ma', factor: 343, category: 'speed' },
      { name: 'Light Speed', symbol: 'c', factor: 299792458, category: 'speed' }
    ]
  },
  {
    id: 'pressure',
    name: 'Pressure',
    icon: Target,
    description: 'Pressure measurements',
    baseUnit: 'pascal',
    units: [
      { name: 'Pascal', symbol: 'Pa', factor: 1, category: 'pressure' },
      { name: 'Kilopascal', symbol: 'kPa', factor: 1000, category: 'pressure' },
      { name: 'Megapascal', symbol: 'MPa', factor: 1000000, category: 'pressure' },
      { name: 'Bar', symbol: 'bar', factor: 100000, category: 'pressure' },
      { name: 'Atmosphere', symbol: 'atm', factor: 101325, category: 'pressure' },
      { name: 'Torr', symbol: 'Torr', factor: 133.322, category: 'pressure' },
      { name: 'PSI', symbol: 'psi', factor: 6894.76, category: 'pressure' },
      { name: 'Inch of Mercury', symbol: 'inHg', factor: 3386.39, category: 'pressure' }
    ]
  },
  {
    id: 'energy',
    name: 'Energy',
    icon: Zap,
    description: 'Energy measurements',
    baseUnit: 'joule',
    units: [
      { name: 'Joule', symbol: 'J', factor: 1, category: 'energy' },
      { name: 'Kilojoule', symbol: 'kJ', factor: 1000, category: 'energy' },
      { name: 'Megajoule', symbol: 'MJ', factor: 1000000, category: 'energy' },
      { name: 'Calorie', symbol: 'cal', factor: 4.184, category: 'energy' },
      { name: 'Kilocalorie', symbol: 'kcal', factor: 4184, category: 'energy' },
      { name: 'Watt Hour', symbol: 'Wh', factor: 3600, category: 'energy' },
      { name: 'Kilowatt Hour', symbol: 'kWh', factor: 3600000, category: 'energy' },
      { name: 'BTU', symbol: 'BTU', factor: 1055.06, category: 'energy' },
      { name: 'Therm', symbol: 'thm', factor: 105506000, category: 'energy' },
      { name: 'Foot Pound', symbol: 'ft·lb', factor: 1.35582, category: 'energy' }
    ]
  },
  {
    id: 'power',
    name: 'Power',
    icon: Zap,
    description: 'Power measurements',
    baseUnit: 'watt',
    units: [
      { name: 'Watt', symbol: 'W', factor: 1, category: 'power' },
      { name: 'Kilowatt', symbol: 'kW', factor: 1000, category: 'power' },
      { name: 'Megawatt', symbol: 'MW', factor: 1000000, category: 'power' },
      { name: 'Gigawatt', symbol: 'GW', factor: 1000000000, category: 'power' },
      { name: 'Horsepower', symbol: 'hp', factor: 745.7, category: 'power' },
      { name: 'BTU per Hour', symbol: 'BTU/h', factor: 0.293071, category: 'power' },
      { name: 'Foot Pound per Second', symbol: 'ft·lb/s', factor: 1.35582, category: 'power' }
    ]
  },
  {
    id: 'data_storage',
    name: 'Data Storage',
    icon: Server,
    description: 'Digital data storage measurements',
    baseUnit: 'byte',
    units: [
      { name: 'Byte', symbol: 'B', factor: 1, category: 'data_storage' },
      { name: 'Kilobyte', symbol: 'KB', factor: 1024, category: 'data_storage' },
      { name: 'Megabyte', symbol: 'MB', factor: 1048576, category: 'data_storage' },
      { name: 'Gigabyte', symbol: 'GB', factor: 1073741824, category: 'data_storage' },
      { name: 'Terabyte', symbol: 'TB', factor: 1099511627776, category: 'data_storage' },
      { name: 'Petabyte', symbol: 'PB', factor: 1125899906842624, category: 'data_storage' },
      { name: 'Exabyte', symbol: 'EB', factor: 1152921504606846976, category: 'data_storage' },
      { name: 'Zettabyte', symbol: 'ZB', factor: 1180591620717411303424, category: 'data_storage' },
      { name: 'Yottabyte', symbol: 'YB', factor: 1208925819614629174706176, category: 'data_storage' },
      { name: 'Bit', symbol: 'bit', factor: 0.125, category: 'data_storage' },
      { name: 'Kilobit', symbol: 'Kbit', factor: 128, category: 'data_storage' },
      { name: 'Megabit', symbol: 'Mbit', factor: 131072, category: 'data_storage' },
      { name: 'Gigabit', symbol: 'Gbit', factor: 134217728, category: 'data_storage' },
      { name: 'Terabit', symbol: 'Tbit', factor: 137438953472, category: 'data_storage' }
    ]
  },
  {
    id: 'data_transfer',
    name: 'Data Transfer Rate',
    icon: Activity,
    description: 'Data transfer speed measurements',
    baseUnit: 'bit_per_second',
    units: [
      { name: 'Bit per Second', symbol: 'bps', factor: 1, category: 'data_transfer' },
      { name: 'Kilobit per Second', symbol: 'Kbps', factor: 1000, category: 'data_transfer' },
      { name: 'Megabit per Second', symbol: 'Mbps', factor: 1000000, category: 'data_transfer' },
      { name: 'Gigabit per Second', symbol: 'Gbps', factor: 1000000000, category: 'data_transfer' },
      { name: 'Terabit per Second', symbol: 'Tbps', factor: 1000000000000, category: 'data_transfer' },
      { name: 'Byte per Second', symbol: 'B/s', factor: 8, category: 'data_transfer' },
      { name: 'Kilobyte per Second', symbol: 'KB/s', factor: 8000, category: 'data_transfer' },
      { name: 'Megabyte per Second', symbol: 'MB/s', factor: 8000000, category: 'data_transfer' },
      { name: 'Gigabyte per Second', symbol: 'GB/s', factor: 8000000000, category: 'data_transfer' },
      { name: 'Terabyte per Second', symbol: 'TB/s', factor: 8000000000000, category: 'data_transfer' }
    ]
  },
  {
    id: 'angle',
    name: 'Angle',
    icon: Target,
    description: 'Angular measurements',
    baseUnit: 'radian',
    units: [
      { name: 'Radian', symbol: 'rad', factor: 1, category: 'angle' },
      { name: 'Degree', symbol: '°', factor: 0.0174533, category: 'angle' },
      { name: 'Gradian', symbol: 'grad', factor: 0.015708, category: 'angle' },
      { name: 'Minute of Arc', symbol: 'arcmin', factor: 0.000290888, category: 'angle' },
      { name: 'Second of Arc', symbol: 'arcsec', factor: 0.00000484814, category: 'angle' },
      { name: 'Turn', symbol: 'turn', factor: 6.28319, category: 'angle' },
      { name: 'Quadrant', symbol: 'quad', factor: 1.5708, category: 'angle' },
      { name: 'Sextant', symbol: 'sextant', factor: 1.0472, category: 'angle' },
      { name: 'Octant', symbol: 'octant', factor: 0.785398, category: 'angle' },
      { name: 'Sign', symbol: 'sign', factor: 0.523599, category: 'angle' },
      { name: 'Point', symbol: 'point', factor: 0.19635, category: 'angle' },
      { name: 'Hour Angle', symbol: 'h', factor: 0.261799, category: 'angle' }
    ]
  },
  {
    id: 'frequency',
    name: 'Frequency',
    icon: Zap,
    description: 'Frequency and wavelength measurements',
    baseUnit: 'hertz',
    units: [
      { name: 'Hertz', symbol: 'Hz', factor: 1, category: 'frequency' },
      { name: 'Kilohertz', symbol: 'kHz', factor: 1000, category: 'frequency' },
      { name: 'Megahertz', symbol: 'MHz', factor: 1000000, category: 'frequency' },
      { name: 'Gigahertz', symbol: 'GHz', factor: 1000000000, category: 'frequency' },
      { name: 'Terahertz', symbol: 'THz', factor: 1000000000000, category: 'frequency' },
      { name: 'Petahertz', symbol: 'PHz', factor: 1000000000000000, category: 'frequency' },
      { name: 'Revolutions per Minute', symbol: 'rpm', factor: 0.0166667, category: 'frequency' },
      { name: 'Revolutions per Second', symbol: 'rps', factor: 1, category: 'frequency' },
      { name: 'Cycles per Second', symbol: 'cps', factor: 1, category: 'frequency' },
      { name: 'Beats per Minute', symbol: 'BPM', factor: 0.0166667, category: 'frequency' }
    ]
  },
  {
    id: 'force',
    name: 'Force',
    icon: Target,
    description: 'Force and mechanical measurements',
    baseUnit: 'newton',
    units: [
      { name: 'Newton', symbol: 'N', factor: 1, category: 'force' },
      { name: 'Kilonewton', symbol: 'kN', factor: 1000, category: 'force' },
      { name: 'Meganewton', symbol: 'MN', factor: 1000000, category: 'force' },
      { name: 'Dyne', symbol: 'dyn', factor: 0.00001, category: 'force' },
      { name: 'Pound-force', symbol: 'lbf', factor: 4.44822, category: 'force' },
      { name: 'Kilogram-force', symbol: 'kgf', factor: 9.80665, category: 'force' },
      { name: 'Ounce-force', symbol: 'ozf', factor: 0.278014, category: 'force' },
      { name: 'Poundal', symbol: 'pdl', factor: 0.138255, category: 'force' },
      { name: 'Kip', symbol: 'kip', factor: 4448.22, category: 'force' },
      { name: 'Ton-force', symbol: 'tf', factor: 9806.65, category: 'force' }
    ]
  },
  {
    id: 'torque',
    name: 'Torque',
    icon: Target,
    description: 'Torque and moment measurements',
    baseUnit: 'newton_meter',
    units: [
      { name: 'Newton Meter', symbol: 'N·m', factor: 1, category: 'torque' },
      { name: 'Kilonewton Meter', symbol: 'kN·m', factor: 1000, category: 'torque' },
      { name: 'Foot Pound', symbol: 'ft·lb', factor: 1.35582, category: 'torque' },
      { name: 'Inch Pound', symbol: 'in·lb', factor: 0.112985, category: 'torque' },
      { name: 'Foot Ounce', symbol: 'ft·oz', factor: 0.0847386, category: 'torque' },
      { name: 'Inch Ounce', symbol: 'in·oz', factor: 0.00706155, category: 'torque' },
      { name: 'Kilogram Meter', symbol: 'kg·m', factor: 9.80665, category: 'torque' },
      { name: 'Gram Centimeter', symbol: 'g·cm', factor: 0.0000980665, category: 'torque' },
      { name: 'Pound Foot', symbol: 'lb·ft', factor: 1.35582, category: 'torque' },
      { name: 'Pound Inch', symbol: 'lb·in', factor: 0.112985, category: 'torque' }
    ]
  },
  {
    id: 'illuminance',
    name: 'Illuminance',
    icon: Eye,
    description: 'Light illuminance measurements',
    baseUnit: 'lux',
    units: [
      { name: 'Lux', symbol: 'lx', factor: 1, category: 'illuminance' },
      { name: 'Foot-candle', symbol: 'fc', factor: 10.764, category: 'illuminance' },
      { name: 'Phot', symbol: 'ph', factor: 10000, category: 'illuminance' },
      { name: 'Nox', symbol: 'nx', factor: 0.001, category: 'illuminance' },
      { name: 'Candela per Square Meter', symbol: 'cd/m²', factor: 1, category: 'illuminance' },
      { name: 'Lumen per Square Meter', symbol: 'lm/m²', factor: 1, category: 'illuminance' },
      { name: 'Lumen per Square Foot', symbol: 'lm/ft²', factor: 10.764, category: 'illuminance' },
      { name: 'Lumen per Square Centimeter', symbol: 'lm/cm²', factor: 10000, category: 'illuminance' }
    ]
  },
  {
    id: 'luminance',
    name: 'Luminance',
    icon: Eye,
    description: 'Light luminance measurements',
    baseUnit: 'candela_per_square_meter',
    units: [
      { name: 'Candela per Square Meter', symbol: 'cd/m²', factor: 1, category: 'luminance' },
      { name: 'Nit', symbol: 'nt', factor: 1, category: 'luminance' },
      { name: 'Stilb', symbol: 'sb', factor: 10000, category: 'luminance' },
      { name: 'Apostilb', symbol: 'asb', factor: 0.31831, category: 'luminance' },
      { name: 'Lambert', symbol: 'L', factor: 3183.1, category: 'luminance' },
      { name: 'Foot-lambert', symbol: 'fL', factor: 3.42626, category: 'luminance' },
      { name: 'Candela per Square Foot', symbol: 'cd/ft²', factor: 10.764, category: 'luminance' },
      { name: 'Candela per Square Inch', symbol: 'cd/in²', factor: 1550, category: 'luminance' }
    ]
  },
  {
    id: 'radiation',
    name: 'Radiation',
    icon: Zap,
    description: 'Radiation and radioactivity measurements',
    baseUnit: 'becquerel',
    units: [
      { name: 'Becquerel', symbol: 'Bq', factor: 1, category: 'radiation' },
      { name: 'Curie', symbol: 'Ci', factor: 37000000000, category: 'radiation' },
      { name: 'Rutherford', symbol: 'Rd', factor: 1000000, category: 'radiation' },
      { name: 'Disintegrations per Second', symbol: 'dps', factor: 1, category: 'radiation' },
      { name: 'Disintegrations per Minute', symbol: 'dpm', factor: 0.0166667, category: 'radiation' },
      { name: 'Gray', symbol: 'Gy', factor: 1, category: 'radiation' },
      { name: 'Rad', symbol: 'rad', factor: 0.01, category: 'radiation' },
      { name: 'Sievert', symbol: 'Sv', factor: 1, category: 'radiation' },
      { name: 'Rem', symbol: 'rem', factor: 0.01, category: 'radiation' },
      { name: 'Roentgen', symbol: 'R', factor: 0.00877, category: 'radiation' }
    ]
  },
  {
    id: 'cooking',
    name: 'Cooking',
    icon: Palette,
    description: 'Cooking and recipe measurements',
    baseUnit: 'milliliter',
    units: [
      { name: 'Milliliter', symbol: 'mL', factor: 1, category: 'cooking' },
      { name: 'Liter', symbol: 'L', factor: 1000, category: 'cooking' },
      { name: 'Teaspoon', symbol: 'tsp', factor: 4.92892, category: 'cooking' },
      { name: 'Tablespoon', symbol: 'tbsp', factor: 14.7868, category: 'cooking' },
      { name: 'Fluid Ounce', symbol: 'fl oz', factor: 29.5735, category: 'cooking' },
      { name: 'Cup', symbol: 'cup', factor: 236.588, category: 'cooking' },
      { name: 'Pint', symbol: 'pt', factor: 473.176, category: 'cooking' },
      { name: 'Quart', symbol: 'qt', factor: 946.353, category: 'cooking' },
      { name: 'Gallon', symbol: 'gal', factor: 3785.41, category: 'cooking' },
      { name: 'Dash', symbol: 'dash', factor: 0.616115, category: 'cooking' },
      { name: 'Pinch', symbol: 'pinch', factor: 0.308058, category: 'cooking' },
      { name: 'Drop', symbol: 'drop', factor: 0.05, category: 'cooking' },
      { name: 'Gill', symbol: 'gi', factor: 118.294, category: 'cooking' },
      { name: 'Pottle', symbol: 'pottle', factor: 1892.71, category: 'cooking' }
    ]
  },
  {
    id: 'typography',
    name: 'Typography',
    icon: FileText,
    description: 'Typography and font size measurements',
    baseUnit: 'point',
    units: [
      { name: 'Point', symbol: 'pt', factor: 1, category: 'typography' },
      { name: 'Pica', symbol: 'p', factor: 12, category: 'typography' },
      { name: 'Pixel', symbol: 'px', factor: 0.75, category: 'typography' },
      { name: 'Em', symbol: 'em', factor: 12, category: 'typography' },
      { name: 'Rem', symbol: 'rem', factor: 12, category: 'typography' },
      { name: 'Ex', symbol: 'ex', factor: 6, category: 'typography' },
      { name: 'Ch', symbol: 'ch', factor: 6, category: 'typography' },
      { name: 'Inch', symbol: 'in', factor: 72, category: 'typography' },
      { name: 'Centimeter', symbol: 'cm', factor: 28.3465, category: 'typography' },
      { name: 'Millimeter', symbol: 'mm', factor: 2.83465, category: 'typography' },
      { name: 'Didot Point', symbol: 'dd', factor: 1.07, category: 'typography' },
      { name: 'Cicero', symbol: 'cc', factor: 12.84, category: 'typography' },
      { name: 'Twip', symbol: 'twip', factor: 0.05, category: 'typography' },
      { name: 'PostScript Point', symbol: 'pspt', factor: 1, category: 'typography' }
    ]
  },
  {
    id: 'currency',
    name: 'Currency',
    icon: Globe,
    description: 'Currency exchange rates (approximate)',
    baseUnit: 'usd',
    units: [
      { name: 'US Dollar', symbol: 'USD', factor: 1, category: 'currency' },
      { name: 'Euro', symbol: 'EUR', factor: 0.85, category: 'currency' },
      { name: 'British Pound', symbol: 'GBP', factor: 0.73, category: 'currency' },
      { name: 'Japanese Yen', symbol: 'JPY', factor: 110, category: 'currency' },
      { name: 'Canadian Dollar', symbol: 'CAD', factor: 1.25, category: 'currency' },
      { name: 'Australian Dollar', symbol: 'AUD', factor: 1.35, category: 'currency' },
      { name: 'Swiss Franc', symbol: 'CHF', factor: 0.92, category: 'currency' },
      { name: 'Chinese Yuan', symbol: 'CNY', factor: 6.45, category: 'currency' },
      { name: 'Indian Rupee', symbol: 'INR', factor: 74.5, category: 'currency' },
      { name: 'Brazilian Real', symbol: 'BRL', factor: 5.2, category: 'currency' },
      { name: 'Russian Ruble', symbol: 'RUB', factor: 73.5, category: 'currency' },
      { name: 'South Korean Won', symbol: 'KRW', factor: 1180, category: 'currency' },
      { name: 'Mexican Peso', symbol: 'MXN', factor: 20.1, category: 'currency' },
      { name: 'Singapore Dollar', symbol: 'SGD', factor: 1.35, category: 'currency' },
      { name: 'Hong Kong Dollar', symbol: 'HKD', factor: 7.8, category: 'currency' },
      { name: 'Norwegian Krone', symbol: 'NOK', factor: 8.5, category: 'currency' },
      { name: 'Swedish Krona', symbol: 'SEK', factor: 8.7, category: 'currency' },
      { name: 'Danish Krone', symbol: 'DKK', factor: 6.3, category: 'currency' },
      { name: 'Polish Zloty', symbol: 'PLN', factor: 3.9, category: 'currency' },
      { name: 'Turkish Lira', symbol: 'TRY', factor: 8.5, category: 'currency' }
    ]
  },
  {
    id: 'density',
    name: 'Density',
    icon: Weight,
    description: 'Density measurements',
    baseUnit: 'kilogram_per_cubic_meter',
    units: [
      { name: 'Kilogram per Cubic Meter', symbol: 'kg/m³', factor: 1, category: 'density' },
      { name: 'Gram per Cubic Centimeter', symbol: 'g/cm³', factor: 1000, category: 'density' },
      { name: 'Gram per Milliliter', symbol: 'g/mL', factor: 1000, category: 'density' },
      { name: 'Pound per Cubic Foot', symbol: 'lb/ft³', factor: 16.0185, category: 'density' },
      { name: 'Pound per Cubic Inch', symbol: 'lb/in³', factor: 27679.9, category: 'density' },
      { name: 'Ounce per Cubic Inch', symbol: 'oz/in³', factor: 1729.99, category: 'density' },
      { name: 'Ounce per Cubic Foot', symbol: 'oz/ft³', factor: 1.00115, category: 'density' },
      { name: 'Ton per Cubic Meter', symbol: 't/m³', factor: 1000, category: 'density' },
      { name: 'Slug per Cubic Foot', symbol: 'slug/ft³', factor: 515.379, category: 'density' }
    ]
  },
  {
    id: 'viscosity',
    name: 'Viscosity',
    icon: Activity,
    description: 'Viscosity measurements',
    baseUnit: 'pascal_second',
    units: [
      { name: 'Pascal Second', symbol: 'Pa·s', factor: 1, category: 'viscosity' },
      { name: 'Poise', symbol: 'P', factor: 0.1, category: 'viscosity' },
      { name: 'Centipoise', symbol: 'cP', factor: 0.001, category: 'viscosity' },
      { name: 'Millipoise', symbol: 'mP', factor: 0.0001, category: 'viscosity' },
      { name: 'Micropoise', symbol: 'μP', factor: 0.0000001, category: 'viscosity' },
      { name: 'Pound per Foot Second', symbol: 'lb/(ft·s)', factor: 1.48816, category: 'viscosity' },
      { name: 'Pound per Foot Hour', symbol: 'lb/(ft·h)', factor: 0.000413378, category: 'viscosity' },
      { name: 'Reyn', symbol: 'reyn', factor: 6894.76, category: 'viscosity' },
      { name: 'Stokes', symbol: 'St', factor: 0.0001, category: 'viscosity' },
      { name: 'Centistokes', symbol: 'cSt', factor: 0.000001, category: 'viscosity' }
    ]
  },
  {
    id: 'conductivity',
    name: 'Electrical Conductivity',
    icon: Zap,
    description: 'Electrical conductivity measurements',
    baseUnit: 'siemens_per_meter',
    units: [
      { name: 'Siemens per Meter', symbol: 'S/m', factor: 1, category: 'conductivity' },
      { name: 'Microsiemens per Centimeter', symbol: 'μS/cm', factor: 0.0001, category: 'conductivity' },
      { name: 'Millisiemens per Centimeter', symbol: 'mS/cm', factor: 0.1, category: 'conductivity' },
      { name: 'Siemens per Centimeter', symbol: 'S/cm', factor: 100, category: 'conductivity' },
      { name: 'Mho per Meter', symbol: '℧/m', factor: 1, category: 'conductivity' },
      { name: 'Mho per Centimeter', symbol: '℧/cm', factor: 100, category: 'conductivity' },
      { name: 'Picosiemens per Meter', symbol: 'pS/m', factor: 0.000000000001, category: 'conductivity' },
      { name: 'Nanosiemens per Meter', symbol: 'nS/m', factor: 0.000000001, category: 'conductivity' },
      { name: 'Microsiemens per Meter', symbol: 'μS/m', factor: 0.000001, category: 'conductivity' },
      { name: 'Millisiemens per Meter', symbol: 'mS/m', factor: 0.001, category: 'conductivity' }
    ]
  },
  {
    id: 'magnetic_field',
    name: 'Magnetic Field',
    icon: Zap,
    description: 'Magnetic field strength measurements',
    baseUnit: 'tesla',
    units: [
      { name: 'Tesla', symbol: 'T', factor: 1, category: 'magnetic_field' },
      { name: 'Gauss', symbol: 'G', factor: 0.0001, category: 'magnetic_field' },
      { name: 'Milligauss', symbol: 'mG', factor: 0.0000001, category: 'magnetic_field' },
      { name: 'Microtesla', symbol: 'μT', factor: 0.000001, category: 'magnetic_field' },
      { name: 'Millitesla', symbol: 'mT', factor: 0.001, category: 'magnetic_field' },
      { name: 'Kilotesla', symbol: 'kT', factor: 1000, category: 'magnetic_field' },
      { name: 'Megatesla', symbol: 'MT', factor: 1000000, category: 'magnetic_field' },
      { name: 'Oersted', symbol: 'Oe', factor: 0.0000795775, category: 'magnetic_field' },
      { name: 'Ampere per Meter', symbol: 'A/m', factor: 0.00000125664, category: 'magnetic_field' },
      { name: 'Gilbert per Centimeter', symbol: 'Gb/cm', factor: 0.0000795775, category: 'magnetic_field' }
    ]
  },
  {
    id: 'capacitance',
    name: 'Capacitance',
    icon: Zap,
    description: 'Electrical capacitance measurements',
    baseUnit: 'farad',
    units: [
      { name: 'Farad', symbol: 'F', factor: 1, category: 'capacitance' },
      { name: 'Microfarad', symbol: 'μF', factor: 0.000001, category: 'capacitance' },
      { name: 'Nanofarad', symbol: 'nF', factor: 0.000000001, category: 'capacitance' },
      { name: 'Picofarad', symbol: 'pF', factor: 0.000000000001, category: 'capacitance' },
      { name: 'Femtofarad', symbol: 'fF', factor: 0.000000000000001, category: 'capacitance' },
      { name: 'Millifarad', symbol: 'mF', factor: 0.001, category: 'capacitance' },
      { name: 'Kilofarad', symbol: 'kF', factor: 1000, category: 'capacitance' },
      { name: 'Megafarad', symbol: 'MF', factor: 1000000, category: 'capacitance' },
      { name: 'Gigafarad', symbol: 'GF', factor: 1000000000, category: 'capacitance' },
      { name: 'Abfarad', symbol: 'abF', factor: 1000000000, category: 'capacitance' },
      { name: 'Statfarad', symbol: 'statF', factor: 0.00000000000111265, category: 'capacitance' }
    ]
  },
  {
    id: 'inductance',
    name: 'Inductance',
    icon: Zap,
    description: 'Electrical inductance measurements',
    baseUnit: 'henry',
    units: [
      { name: 'Henry', symbol: 'H', factor: 1, category: 'inductance' },
      { name: 'Millihenry', symbol: 'mH', factor: 0.001, category: 'inductance' },
      { name: 'Microhenry', symbol: 'μH', factor: 0.000001, category: 'inductance' },
      { name: 'Nanohenry', symbol: 'nH', factor: 0.000000001, category: 'inductance' },
      { name: 'Picohenry', symbol: 'pH', factor: 0.000000000001, category: 'inductance' },
      { name: 'Femtohenry', symbol: 'fH', factor: 0.000000000000001, category: 'inductance' },
      { name: 'Kilohenry', symbol: 'kH', factor: 1000, category: 'inductance' },
      { name: 'Megahenry', symbol: 'MH', factor: 1000000, category: 'inductance' },
      { name: 'Gigahenry', symbol: 'GH', factor: 1000000000, category: 'inductance' },
      { name: 'Abhenry', symbol: 'abH', factor: 0.000000001, category: 'inductance' },
      { name: 'Stathenry', symbol: 'statH', factor: 898755200000, category: 'inductance' }
    ]
  }
];

const COMMON_CONVERSIONS = [
  {
    name: 'Height Conversion',
    description: 'Convert between feet/inches and centimeters',
    from: { value: 5, unit: 'ft', category: 'length' },
    to: { value: 152.4, unit: 'cm', category: 'length' }
  },
  {
    name: 'Weight Conversion',
    description: 'Convert between pounds and kilograms',
    from: { value: 150, unit: 'lb', category: 'weight' },
    to: { value: 68.04, unit: 'kg', category: 'weight' }
  },
  {
    name: 'Temperature Conversion',
    description: 'Convert between Celsius and Fahrenheit',
    from: { value: 25, unit: '°C', category: 'temperature' },
    to: { value: 77, unit: '°F', category: 'temperature' }
  },
  {
    name: 'Speed Conversion',
    description: 'Convert between mph and km/h',
    from: { value: 60, unit: 'mph', category: 'speed' },
    to: { value: 96.56, unit: 'km/h', category: 'speed' }
  },
  {
    name: 'Data Storage',
    description: 'Convert between GB and MB',
    from: { value: 1, unit: 'GB', category: 'data_storage' },
    to: { value: 1024, unit: 'MB', category: 'data_storage' }
  },
  {
    name: 'Cooking Volume',
    description: 'Convert between cups and milliliters',
    from: { value: 1, unit: 'cup', category: 'cooking' },
    to: { value: 236.588, unit: 'mL', category: 'cooking' }
  },
  {
    name: 'Typography',
    description: 'Convert between points and pixels',
    from: { value: 12, unit: 'pt', category: 'typography' },
    to: { value: 16, unit: 'px', category: 'typography' }
  },
  {
    name: 'Currency',
    description: 'Convert between USD and EUR',
    from: { value: 100, unit: 'USD', category: 'currency' },
    to: { value: 85, unit: 'EUR', category: 'currency' }
  },
  {
    name: 'Angle',
    description: 'Convert between degrees and radians',
    from: { value: 90, unit: '°', category: 'angle' },
    to: { value: 1.571, unit: 'rad', category: 'angle' }
  },
  {
    name: 'Frequency',
    description: 'Convert between Hz and MHz',
    from: { value: 1000000, unit: 'Hz', category: 'frequency' },
    to: { value: 1, unit: 'MHz', category: 'frequency' }
  }
];

const UnitConverter = () => {
  const [selectedCategory, setSelectedCategory] = useState('length');
  const [fromValue, setFromValue] = useState('');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [toValue, setToValue] = useState('');
  const [conversionHistory, setConversionHistory] = useState<ConversionResult[]>([]);
  const [activeTab, setActiveTab] = useState("converter");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [precision, setPrecision] = useState(6);
  const [scientificNotation, setScientificNotation] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Get current category
  const currentCategory = CONVERSION_CATEGORIES.find(cat => cat.id === selectedCategory);

  // Generate unique ID
  const generateId = useCallback(() => {
    return Math.random().toString(36).substr(2, 9);
  }, []);

  // Format number with precision and scientific notation
  const formatNumber = useCallback((num: number) => {
    if (scientificNotation) {
      return num.toExponential(precision);
    }
    return num.toFixed(precision);
  }, [precision, scientificNotation]);

  // Convert temperature (special case)
  const convertTemperature = useCallback((value: number, from: string, to: string) => {
    // Convert to Celsius first
    let celsius: number;
    switch (from) {
      case '°C':
        celsius = value;
        break;
      case '°F':
        celsius = (value - 32) * 5 / 9;
        break;
      case 'K':
        celsius = value - 273.15;
        break;
      case '°R':
        celsius = (value - 491.67) * 5 / 9;
        break;
      default:
        celsius = value;
    }

    // Convert from Celsius to target
    switch (to) {
      case '°C':
        return celsius;
      case '°F':
        return celsius * 9 / 5 + 32;
      case 'K':
        return celsius + 273.15;
      case '°R':
        return celsius * 9 / 5 + 491.67;
      default:
        return celsius;
    }
  }, []);

  // Perform conversion
  const performConversion = useCallback(() => {
    if (!fromValue || !fromUnit || !toUnit || !currentCategory) return;

    const numValue = parseFloat(fromValue);
    if (isNaN(numValue)) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid number",
        variant: "destructive",
      });
      return;
    }

    let result: number;

    if (currentCategory.id === 'temperature') {
      result = convertTemperature(numValue, fromUnit, toUnit);
    } else {
      const fromUnitData = currentCategory.units.find(u => u.symbol === fromUnit);
      const toUnitData = currentCategory.units.find(u => u.symbol === toUnit);

      if (!fromUnitData || !toUnitData) return;

      // Convert to base unit, then to target unit
      const baseValue = numValue * fromUnitData.factor;
      result = baseValue / toUnitData.factor;
    }

    const formattedResult = formatNumber(result);
    setToValue(formattedResult);

    // Add to history
    const conversion: ConversionResult = {
      id: generateId(),
      fromValue: numValue,
      fromUnit,
      toValue: result,
      toUnit,
      timestamp: Date.now(),
      category: currentCategory.id
    };

    setConversionHistory(prev => [conversion, ...prev.slice(0, 99)]); // Keep last 100
  }, [fromValue, fromUnit, toUnit, currentCategory, convertTemperature, formatNumber, generateId, toast]);

  // Swap units
  const swapUnits = useCallback(() => {
    const tempUnit = fromUnit;
    const tempValue = fromValue;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    setFromValue(toValue);
    setToValue(tempValue);
  }, [fromUnit, toUnit, fromValue, toValue]);

  // Apply common conversion
  const applyCommonConversion = useCallback((conversion: typeof COMMON_CONVERSIONS[0]) => {
    setSelectedCategory(conversion.from.category);
    setFromValue(conversion.from.value.toString());
    setFromUnit(conversion.from.unit);
    setToUnit(conversion.to.unit);
    setToValue(conversion.to.value.toString());
    
    toast({
      title: "Common Conversion Applied",
      description: `${conversion.name} has been applied`,
    });
  }, [toast]);

  // Copy result
  const copyResult = useCallback(() => {
    if (toValue) {
      navigator.clipboard.writeText(toValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Result Copied",
        description: "Conversion result copied to clipboard",
      });
    }
  }, [toValue, toast]);

  // Clear history
  const clearHistory = useCallback(() => {
    setConversionHistory([]);
    toast({
      title: "History Cleared",
      description: "Conversion history has been cleared",
    });
  }, [toast]);

  // Auto-convert when values change
  useEffect(() => {
    if (fromValue && fromUnit && toUnit && currentCategory) {
      performConversion();
    }
  }, [fromValue, fromUnit, toUnit, currentCategory, performConversion]);

  // Set default units when category changes
  useEffect(() => {
    if (currentCategory && currentCategory.units.length > 0) {
      if (!fromUnit) setFromUnit(currentCategory.units[0].symbol);
      if (!toUnit) setToUnit(currentCategory.units[1]?.symbol || currentCategory.units[0].symbol);
    }
  }, [currentCategory, fromUnit, toUnit]);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold">Unit Converter</h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <ArrowRightLeft className="h-3 w-3" />
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
          Professional unit conversion with comprehensive categories, precision control, and conversion history
        </p>
      </div>

      {/* Common Conversions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Common Conversions
          </CardTitle>
          <CardDescription>Quick access to frequently used conversions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {COMMON_CONVERSIONS.map((conversion) => (
              <Card key={conversion.name} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-4" onClick={() => applyCommonConversion(conversion)}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{conversion.name}</h4>
                    <Badge variant="outline" className="text-xs">
                      {conversion.from.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{conversion.description}</p>
                  <div className="text-sm font-mono">
                    {conversion.from.value} {conversion.from.unit} → {conversion.to.value} {conversion.to.unit}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Converter */}
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="converter" className="gap-2">
                <ArrowRightLeft className="h-4 w-4" />
                Converter
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <History className="h-4 w-4" />
                History
              </TabsTrigger>
              <TabsTrigger value="categories" className="gap-2">
                <Layers className="h-4 w-4" />
                Categories
              </TabsTrigger>
            </TabsList>

            <TabsContent value="converter" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Unit Converter</CardTitle>
                  <CardDescription>Convert between different units of measurement</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CONVERSION_CATEGORIES.map((category) => {
                          const IconComponent = category.icon;
                          return (
                            <SelectItem key={category.id} value={category.id}>
                              <div className="flex items-center gap-2">
                                <IconComponent className="h-4 w-4" />
                                <div>
                                  <div className="font-medium">{category.name}</div>
                                  <div className="text-xs text-muted-foreground">{category.description}</div>
                                </div>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>From</Label>
                      <div className="space-y-2">
                        <Input
                          type="number"
                          value={fromValue}
                          onChange={(e) => setFromValue(e.target.value)}
                          placeholder="Enter value"
                          step="any"
                        />
                        <Select value={fromUnit} onValueChange={setFromUnit}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                          <SelectContent>
                            {currentCategory?.units.map((unit) => (
                              <SelectItem key={unit.symbol} value={unit.symbol}>
                                {unit.name} ({unit.symbol})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>To</Label>
                      <div className="space-y-2">
                        <Input
                          type="text"
                          value={toValue}
                          readOnly
                          className="bg-muted"
                          placeholder="Result"
                        />
                        <Select value={toUnit} onValueChange={setToUnit}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                          <SelectContent>
                            {currentCategory?.units.map((unit) => (
                              <SelectItem key={unit.symbol} value={unit.symbol}>
                                {unit.name} ({unit.symbol})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={swapUnits}
                      variant="outline"
                      className="flex-1 gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Swap Units
                    </Button>
                    <Button
                      onClick={copyResult}
                      variant="outline"
                      className="gap-2"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      Copy
                    </Button>
                  </div>

                  {showAdvanced && (
                    <>
                      <Separator />
                      <div className="space-y-4">
                        <h4 className="font-medium">Advanced Settings</h4>
                        
                        <div className="space-y-2">
                          <Label htmlFor="precision">Precision (decimal places)</Label>
                          <Input
                            id="precision"
                            type="number"
                            min="0"
                            max="15"
                            value={precision}
                            onChange={(e) => setPrecision(parseInt(e.target.value) || 6)}
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="scientific-notation"
                            checked={scientificNotation}
                            onCheckedChange={setScientificNotation}
                          />
                          <Label htmlFor="scientific-notation">Scientific Notation</Label>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Conversion History</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        onClick={clearHistory}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Clear
                      </Button>
                    </div>
                  </div>
                  <CardDescription>View your recent conversions</CardDescription>
                </CardHeader>
                <CardContent>
                  {conversionHistory.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No conversion history</p>
                      <p className="text-sm">Perform conversions to see them here</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {conversionHistory.map((conversion) => (
                        <div key={conversion.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {CONVERSION_CATEGORIES.find(c => c.id === conversion.category)?.name}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(conversion.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                          </div>
                          <div className="font-mono text-sm">
                            {conversion.fromValue} {conversion.fromUnit} → {formatNumber(conversion.toValue)} {conversion.toUnit}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="categories" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Available Categories</CardTitle>
                  <CardDescription>Browse all available conversion categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {CONVERSION_CATEGORIES.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <div
                          key={category.id}
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            selectedCategory === category.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                          }`}
                          onClick={() => setSelectedCategory(category.id)}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <IconComponent className="h-5 w-5" />
                            <h4 className="font-medium">{category.name}</h4>
                            <Badge variant="outline" className="text-xs">
                              {category.units.length} units
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                          <div className="text-xs text-muted-foreground">
                            Base unit: {category.baseUnit}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Results and Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Result</CardTitle>
              <CardDescription>Current conversion details</CardDescription>
            </CardHeader>
            <CardContent>
              {fromValue && toValue && fromUnit && toUnit ? (
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">
                      {fromValue} {fromUnit} = {toValue} {toUnit}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {currentCategory?.name} conversion
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">From:</span>
                      <span className="font-mono">{fromValue} {fromUnit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">To:</span>
                      <span className="font-mono">{toValue} {toUnit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <span>{currentCategory?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Precision:</span>
                      <span>{precision} decimal places</span>
                    </div>
                    {scientificNotation && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Format:</span>
                        <span>Scientific notation</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ArrowRightLeft className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No conversion to display</p>
                  <p className="text-sm">Enter values and select units to see results</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button
                  onClick={() => setPrecision(2)}
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Calculator className="h-4 w-4" />
                  2 Decimal Places
                </Button>
                <Button
                  onClick={() => setPrecision(6)}
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Calculator className="h-4 w-4" />
                  6 Decimal Places
                </Button>
                <Button
                  onClick={() => setScientificNotation(!scientificNotation)}
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <Code className="h-4 w-4" />
                  Toggle Scientific Notation
                </Button>
                <Button
                  onClick={() => {
                    setFromValue('');
                    setToValue('');
                  }}
                  variant="outline"
                  className="w-full justify-start gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Clear Values
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Professional Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Tips</CardTitle>
          <CardDescription>Best practices for unit conversion across all categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Conversion Accuracy</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Precision:</strong> Use appropriate decimal places for your use case</li>
                <li>• <strong>Scientific Notation:</strong> Useful for very large or small numbers</li>
                <li>• <strong>Temperature:</strong> Special conversion formulas for accurate results</li>
                <li>• <strong>Base Units:</strong> All conversions go through standard base units</li>
                <li>• <strong>Validation:</strong> Always verify critical conversions</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Specialized Categories</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Data Storage:</strong> Binary (1024) vs decimal (1000) prefixes</li>
                <li>• <strong>Typography:</strong> Point, pixel, and em conversions</li>
                <li>• <strong>Currency:</strong> Approximate rates, verify with live data</li>
                <li>• <strong>Electrical:</strong> SI units for capacitance, inductance</li>
                <li>• <strong>Radiation:</strong> Safety-critical conversions</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Common Use Cases</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Engineering:</strong> Convert between metric and imperial units</li>
                <li>• <strong>Science:</strong> Convert between different measurement systems</li>
                <li>• <strong>International:</strong> Convert for global communication</li>
                <li>• <strong>Education:</strong> Learn relationships between units</li>
                <li>• <strong>Development:</strong> Convert units in applications</li>
                <li>• <strong>Cooking:</strong> Recipe conversions and scaling</li>
                <li>• <strong>Web Design:</strong> Typography and layout units</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnitConverter;
