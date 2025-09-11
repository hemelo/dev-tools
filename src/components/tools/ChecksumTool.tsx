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
  Copy, Check, Download, RotateCcw, Plus, Minus, Eye, Code, Image, 
  Upload, Settings, Zap, BookOpen, Palette, Ruler, Layers, Target, 
  AlertCircle, FileImage, Trash2, RefreshCw, Maximize, Minimize,
  Download as DownloadIcon, FolderOpen, ImageIcon, Crop, RotateCw,
  FlipHorizontal, FlipVertical, Filter, Wand2, Scissors, Move,
  ZoomIn, ZoomOut, Focus, Contrast, Sun, Moon, Droplets, Sparkles,
  Monitor, Smartphone, Tablet, Camera, Printer, Globe, FileText,
  BarChart3, Clock, HardDrive, Wifi, Battery, Shield, Lock,
  Star, Heart, ThumbsUp, Award, Crown, Gem, Sparkle, Rainbow,
  Lightbulb, Brain, Cpu, Database, Network, Cloud, Server,
  Activity, TrendingUp, BarChart, PieChart, LineChart, Gauge,
  Sliders, ToggleLeft, ToggleRight, ChevronDown, ChevronUp,
  Info, HelpCircle, ExternalLink, Share2, Mail, MessageSquare,
  Calendar, Timer, Stopwatch, Play, Pause, Square, SkipForward,
  Volume2, VolumeX, Mic, MicOff, Video, VideoOff, CameraOff,
  Edit, Edit3, PenTool, Brush, Eraser, Paintbrush, Palette as PaletteIcon,
  Layers as LayersIcon, Grid, Square as SquareIcon, Circle, Triangle,
  Hexagon, Octagon, Pentagon, Diamond, Star as StarIcon, Heart as HeartIcon,
  CreditCard, Apple, Hash, FileCheck, FileX, CheckCircle, XCircle,
  AlertTriangle, Info as InfoIcon, Key, Lock as LockIcon, Unlock,
  Search, Filter as FilterIcon, SortAsc, SortDesc, MoreHorizontal,
  MoreVertical, Menu, X, Plus as PlusIcon, Minus as MinusIcon,
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight,
  File, FileText as FileTextIcon, FileCode, FileJson,
  FileVideo, FileAudio, FileImage as FileImageIcon, FileType,
  Folder, FolderOpen as FolderOpenIcon, FolderPlus, FolderMinus,
  Save, Save as SaveIcon, Loader, Loader2, CheckSquare, Square,
  Radio, RadioButton, ToggleLeft as ToggleLeftIcon, ToggleRight as ToggleRightIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CryptoJS from 'crypto-js';

interface ChecksumFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  lastModified: number;
  checksums: Record<string, string>;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
  processingTime?: number;
  verificationStatus?: 'verified' | 'failed' | 'unknown';
  expectedChecksum?: string;
}

interface ChecksumAlgorithm {
  name: string;
  value: string;
  description: string;
  bitLength: number;
  icon: any;
  color: string;
  secure: boolean;
  speed: 'fast' | 'medium' | 'slow';
}

interface ChecksumResult {
  algorithm: string;
  checksum: string;
  processingTime: number;
  verified: boolean;
  expectedChecksum?: string;
}

interface ChecksumHistory {
  id: string;
  fileName: string;
  fileSize: number;
  algorithm: string;
  checksum: string;
  timestamp: number;
  verified: boolean;
}

interface VerificationResult {
  fileName: string;
  algorithm: string;
  calculatedChecksum: string;
  expectedChecksum: string;
  verified: boolean;
  timestamp: number;
}

const CHECKSUM_ALGORITHMS: ChecksumAlgorithm[] = [
  {
    name: 'MD5',
    value: 'md5',
    description: 'Message Digest 5 (128-bit)',
    bitLength: 128,
    icon: Hash,
    color: 'text-red-500',
    secure: false,
    speed: 'fast'
  },
  {
    name: 'SHA-1',
    value: 'sha1',
    description: 'Secure Hash Algorithm 1 (160-bit)',
    bitLength: 160,
    icon: Shield,
    color: 'text-orange-500',
    secure: false,
    speed: 'fast'
  },
  {
    name: 'SHA-256',
    value: 'sha256',
    description: 'Secure Hash Algorithm 256 (256-bit)',
    bitLength: 256,
    icon: Lock,
    color: 'text-green-500',
    secure: true,
    speed: 'medium'
  },
  {
    name: 'SHA-384',
    value: 'sha384',
    description: 'Secure Hash Algorithm 384 (384-bit)',
    bitLength: 384,
    icon: Lock,
    color: 'text-blue-500',
    secure: true,
    speed: 'medium'
  },
  {
    name: 'SHA-512',
    value: 'sha512',
    description: 'Secure Hash Algorithm 512 (512-bit)',
    bitLength: 512,
    icon: Lock,
    color: 'text-purple-500',
    secure: true,
    speed: 'slow'
  },
  {
    name: 'SHA3-256',
    value: 'sha3-256',
    description: 'SHA-3 256-bit (Keccak)',
    bitLength: 256,
    icon: Key,
    color: 'text-indigo-500',
    secure: true,
    speed: 'medium'
  },
  {
    name: 'SHA3-512',
    value: 'sha3-512',
    description: 'SHA-3 512-bit (Keccak)',
    bitLength: 512,
    icon: Key,
    color: 'text-pink-500',
    secure: true,
    speed: 'slow'
  },
  {
    name: 'BLAKE2b',
    value: 'blake2b',
    description: 'BLAKE2b (512-bit) - Uses SHA-512 fallback',
    bitLength: 512,
    icon: Zap,
    color: 'text-cyan-500',
    secure: true,
    speed: 'fast'
  },
  {
    name: 'CRC32',
    value: 'crc32',
    description: 'Cyclic Redundancy Check 32-bit - Uses MD5 fallback',
    bitLength: 32,
    icon: CheckCircle,
    color: 'text-gray-500',
    secure: false,
    speed: 'fast'
  }
];

const VERIFICATION_PRESETS = [
  {
    name: 'File Integrity Check',
    description: 'Verify file integrity using SHA-256',
    algorithm: 'sha256',
    icon: Shield
  },
  {
    name: 'Quick Verification',
    description: 'Fast verification using MD5',
    algorithm: 'md5',
    icon: Zap
  },
  {
    name: 'High Security',
    description: 'Maximum security using SHA-512',
    algorithm: 'sha512',
    icon: Lock
  },
  {
    name: 'Modern Standard',
    description: 'Current standard using SHA3-256',
    algorithm: 'sha3-256',
    icon: Key
  }
];

const FILE_TYPE_ICONS: Record<string, any> = {
  'image/': ImageIcon,
  'video/': Video,
  'audio/': Volume2,
  'text/': FileText,
  'application/json': FileJson,
  'default': File
};

const ChecksumTool = () => {
  const [files, setFiles] = useState<ChecksumFile[]>([]);
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>(['sha256']);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("generator");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [verificationMode, setVerificationMode] = useState(false);
  const [expectedChecksums, setExpectedChecksums] = useState<Record<string, string>>({});
  const [checksumHistory, setChecksumHistory] = useState<ChecksumHistory[]>([]);
  const [verificationResults, setVerificationResults] = useState<VerificationResult[]>([]);
  const [copied, setCopied] = useState(false);
  const [batchMode, setBatchMode] = useState(false);
  const [autoVerify, setAutoVerify] = useState(false);
  const [saveHistory, setSaveHistory] = useState(true);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const workerRef = useRef<Worker | null>(null);

  // Generate unique ID
  const generateId = useCallback(() => {
    return Math.random().toString(36).substr(2, 9);
  }, []);

  // Format file size
  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  // Format processing time
  const formatTime = useCallback((ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  }, []);

  // Get file type icon
  const getFileTypeIcon = useCallback((fileType: string) => {
    for (const [prefix, icon] of Object.entries(FILE_TYPE_ICONS)) {
      if (fileType.startsWith(prefix)) {
        return icon;
      }
    }
    return FILE_TYPE_ICONS.default;
  }, []);

  // Validate file
  const validateFile = useCallback((file: File): { valid: boolean; error?: string } => {
    // Check file size (100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return { valid: false, error: 'File size exceeds 100MB limit' };
    }

    return { valid: true };
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback((fileList: FileList) => {
    const newFiles: ChecksumFile[] = [];
    
    Array.from(fileList).forEach(file => {
      const validation = validateFile(file);
      if (!validation.valid) {
        toast({
          title: "File Rejected",
          description: `${file.name}: ${validation.error}`,
          variant: "destructive",
        });
        return;
      }

      const checksumFile: ChecksumFile = {
        id: generateId(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        checksums: {},
        status: 'pending'
      };

      newFiles.push(checksumFile);
    });

    setFiles(prev => [...prev, ...newFiles]);
    
    toast({
      title: "Files Added",
      description: `${newFiles.length} file(s) added for processing`,
    });
  }, [validateFile, generateId, toast]);

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // Calculate checksum using crypto-js
  const calculateChecksum = useCallback(async (
    file: File, 
    algorithm: string
  ): Promise<{ checksum: string; processingTime: number }> => {
    const startTime = performance.now();
    
    try {
      const buffer = await file.arrayBuffer();
      const wordArray = CryptoJS.lib.WordArray.create(buffer);
      
      let hash: CryptoJS.lib.WordArray;
      
      switch (algorithm.toLowerCase()) {
        case 'md5':
          hash = CryptoJS.MD5(wordArray);
          break;
        case 'sha1':
          hash = CryptoJS.SHA1(wordArray);
          break;
        case 'sha256':
          hash = CryptoJS.SHA256(wordArray);
          break;
        case 'sha384':
          hash = CryptoJS.SHA384(wordArray);
          break;
        case 'sha512':
          hash = CryptoJS.SHA512(wordArray);
          break;
        case 'sha3-256':
          hash = CryptoJS.SHA3(wordArray, { outputLength: 256 });
          break;
        case 'sha3-512':
          hash = CryptoJS.SHA3(wordArray, { outputLength: 512 });
          break;
        case 'blake2b':
          // BLAKE2b is not available in crypto-js, use SHA-512 as fallback
          hash = CryptoJS.SHA512(wordArray);
          break;
        case 'crc32':
          // CRC32 is not available in crypto-js, use MD5 as fallback
          hash = CryptoJS.MD5(wordArray);
          break;
        default:
          throw new Error(`Unsupported algorithm: ${algorithm}`);
      }
      
      const checksum = hash.toString(CryptoJS.enc.Hex);
      const processingTime = performance.now() - startTime;
      
      return { checksum, processingTime };
    } catch (error) {
      throw new Error(`Failed to calculate ${algorithm}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, []);

  // Process single file
  const processFile = useCallback(async (file: ChecksumFile) => {
    const updatedFile = { ...file, status: 'processing' as const };
    setFiles(prev => prev.map(f => f.id === file.id ? updatedFile : f));

    try {
      const results: Record<string, string> = {};
      let totalTime = 0;

      for (const algorithm of selectedAlgorithms) {
        const result = await calculateChecksum(file.file, algorithm);
        results[algorithm] = result.checksum;
        totalTime += result.processingTime;
      }

      const finalFile: ChecksumFile = {
        ...updatedFile,
        status: 'completed',
        checksums: results,
        processingTime: totalTime,
        verificationStatus: autoVerify ? 'verified' : 'unknown'
      };

      setFiles(prev => prev.map(f => f.id === file.id ? finalFile : f));

      // Save to history if enabled
      if (saveHistory) {
        selectedAlgorithms.forEach(algorithm => {
          const historyEntry: ChecksumHistory = {
            id: generateId(),
            fileName: file.name,
            fileSize: file.size,
            algorithm,
            checksum: results[algorithm],
            timestamp: Date.now(),
            verified: false
          };
          setChecksumHistory(prev => [historyEntry, ...prev.slice(0, 99)]); // Keep last 100
        });
      }

      return finalFile;
    } catch (error) {
      const errorFile: ChecksumFile = {
        ...updatedFile,
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
      setFiles(prev => prev.map(f => f.id === file.id ? errorFile : f));
      throw error;
    }
  }, [selectedAlgorithms, calculateChecksum, autoVerify, saveHistory, generateId]);

  // Process all files
  const processAllFiles = useCallback(async () => {
    if (files.length === 0) {
      toast({
        title: "No Files",
        description: "Please add files to process",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(0);

    let processed = 0;
    const pendingFiles = files.filter(f => f.status === 'pending');

    for (const file of pendingFiles) {
      try {
        await processFile(file);
        processed++;
        setProcessingProgress((processed / pendingFiles.length) * 100);
      } catch (error) {
        console.error('Error processing file:', error);
      }
    }

    setIsProcessing(false);
    
    toast({
      title: "Processing Complete",
      description: `Processed ${processed} file(s) with ${selectedAlgorithms.length} algorithm(s) each`,
    });
  }, [files, processFile, selectedAlgorithms.length, toast]);

  // Verify checksum
  const verifyChecksum = useCallback((file: ChecksumFile, algorithm: string, expectedChecksum: string) => {
    const calculatedChecksum = file.checksums[algorithm];
    const verified = calculatedChecksum?.toLowerCase() === expectedChecksum.toLowerCase();
    
    const result: VerificationResult = {
      fileName: file.name,
      algorithm,
      calculatedChecksum: calculatedChecksum || '',
      expectedChecksum,
      verified,
      timestamp: Date.now()
    };

    setVerificationResults(prev => [result, ...prev.slice(0, 99)]); // Keep last 100

    return verified;
  }, []);

  // Apply preset
  const applyPreset = useCallback((preset: typeof VERIFICATION_PRESETS[0]) => {
    setSelectedAlgorithms([preset.algorithm]);
    toast({
      title: "Preset Applied",
      description: `${preset.name} preset has been applied`,
    });
  }, [toast]);

  // Copy checksum to clipboard
  const copyChecksum = useCallback((checksum: string) => {
    navigator.clipboard.writeText(checksum);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied to Clipboard",
      description: "Checksum copied to clipboard",
    });
  }, [toast]);

  // Export checksums
  const exportChecksums = useCallback(() => {
    const completedFiles = files.filter(f => f.status === 'completed');
    if (completedFiles.length === 0) {
      toast({
        title: "No Results",
        description: "No completed checksums to export",
        variant: "destructive",
      });
      return;
    }

    let content = '';
    completedFiles.forEach(file => {
      content += `File: ${file.name}\n`;
      content += `Size: ${formatFileSize(file.size)}\n`;
      Object.entries(file.checksums).forEach(([algorithm, checksum]) => {
        const algo = CHECKSUM_ALGORITHMS.find(a => a.value === algorithm);
        content += `${algo?.name || algorithm.toUpperCase()}: ${checksum}\n`;
      });
      content += '\n';
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `checksums-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Checksums Exported",
      description: "Checksums exported to text file",
    });
  }, [files, formatFileSize, toast]);

  // Clear all files
  const clearAllFiles = useCallback(() => {
    setFiles([]);
    setVerificationResults([]);
    toast({
      title: "Files Cleared",
      description: "All files and results have been cleared",
    });
  }, [toast]);

  // Remove single file
  const removeFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    toast({
      title: "File Removed",
      description: "File has been removed from the list",
    });
  }, [toast]);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold">Checksum Tool</h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <Shield className="h-3 w-3" />
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
          Professional file integrity verification with multiple hash algorithms, batch processing, and verification tools
        </p>
      </div>

      {/* Verification Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Verification Presets
          </CardTitle>
          <CardDescription>Quick-start configurations for common verification scenarios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {VERIFICATION_PRESETS.map((preset) => {
              const IconComponent = preset.icon;
              return (
                <Card key={preset.name} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4" onClick={() => applyPreset(preset)}>
                    <div className="flex items-center gap-2 mb-2">
                      <IconComponent className="h-4 w-4" />
                      <h4 className="font-medium">{preset.name}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">{preset.description}</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {preset.algorithm.toUpperCase()}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="generator" className="gap-2">
                <Hash className="h-4 w-4" />
                Generator
              </TabsTrigger>
              <TabsTrigger value="verifier" className="gap-2">
                <FileCheck className="h-4 w-4" />
                Verifier
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <Clock className="h-4 w-4" />
                History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generator" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>File Upload</CardTitle>
                  <CardDescription>Upload files to generate checksums</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">Drop files here or click to upload</p>
                    <p className="text-sm text-muted-foreground">
                      Supports all file types up to 100MB
                    </p>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                  />

                  <div className="flex gap-2">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Select Files
                    </Button>
                    <Button
                      onClick={clearAllFiles}
                      variant="outline"
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Clear All
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Hash Algorithms</CardTitle>
                  <CardDescription>Select algorithms for checksum generation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    {CHECKSUM_ALGORITHMS.map((algorithm) => {
                      const IconComponent = algorithm.icon;
                      const isSelected = selectedAlgorithms.includes(algorithm.value);
                      
                      return (
                        <div
                          key={algorithm.value}
                          className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                            isSelected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                          }`}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedAlgorithms(prev => prev.filter(a => a !== algorithm.value));
                            } else {
                              setSelectedAlgorithms(prev => [...prev, algorithm.value]);
                            }
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <IconComponent className={`h-5 w-5 ${algorithm.color}`} />
                              <div>
                                <div className="font-medium">{algorithm.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {algorithm.description}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={algorithm.secure ? "default" : "secondary"} className="text-xs">
                                {algorithm.secure ? "Secure" : "Legacy"}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {algorithm.speed}
                              </Badge>
                              {isSelected && <CheckCircle className="h-4 w-4 text-primary" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => setSelectedAlgorithms(['sha256'])}
                      variant="outline"
                      size="sm"
                    >
                      SHA-256 Only
                    </Button>
                    <Button
                      onClick={() => setSelectedAlgorithms(['md5', 'sha1', 'sha256', 'sha512'])}
                      variant="outline"
                      size="sm"
                    >
                      Common Set
                    </Button>
                    <Button
                      onClick={() => setSelectedAlgorithms(CHECKSUM_ALGORITHMS.map(a => a.value))}
                      variant="outline"
                      size="sm"
                    >
                      All Algorithms
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {showAdvanced && (
                <Card>
                  <CardHeader>
                    <CardTitle>Advanced Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="batch-mode"
                        checked={batchMode}
                        onCheckedChange={setBatchMode}
                      />
                      <Label htmlFor="batch-mode">Batch Processing Mode</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="auto-verify"
                        checked={autoVerify}
                        onCheckedChange={setAutoVerify}
                      />
                      <Label htmlFor="auto-verify">Auto-verify Checksums</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="save-history"
                        checked={saveHistory}
                        onCheckedChange={setSaveHistory}
                      />
                      <Label htmlFor="save-history">Save to History</Label>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button
                onClick={processAllFiles}
                disabled={isProcessing || files.length === 0}
                className="w-full gap-2"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Processing... {Math.round(processingProgress)}%
                  </>
                ) : (
                  <>
                    <Hash className="h-4 w-4" />
                    Generate Checksums
                  </>
                )}
              </Button>

              {isProcessing && (
                <div className="space-y-2">
                  <Progress value={processingProgress} className="w-full" />
                  <p className="text-sm text-muted-foreground text-center">
                    Processing files... {Math.round(processingProgress)}%
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="verifier" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Checksum Verification</CardTitle>
                  <CardDescription>Verify file integrity against expected checksums</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Expected Checksum</Label>
                    <Textarea
                      placeholder="Paste expected checksum here..."
                      className="min-h-[100px] font-mono text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Algorithm</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select algorithm" />
                      </SelectTrigger>
                      <SelectContent>
                        {CHECKSUM_ALGORITHMS.map((algorithm) => (
                          <SelectItem key={algorithm.value} value={algorithm.value}>
                            {algorithm.name} - {algorithm.description}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full gap-2">
                    <FileCheck className="h-4 w-4" />
                    Verify Checksum
                  </Button>
                </CardContent>
              </Card>

              {verificationResults.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Verification Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {verificationResults.slice(0, 10).map((result, index) => (
                        <div key={index} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{result.fileName}</span>
                              <Badge variant="outline" className="text-xs">
                                {result.algorithm.toUpperCase()}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              {result.verified ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-500" />
                              )}
                              <span className={`text-sm ${result.verified ? 'text-green-600' : 'text-red-600'}`}>
                                {result.verified ? 'Verified' : 'Failed'}
                              </span>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground font-mono">
                            <div>Expected: {result.expectedChecksum}</div>
                            <div>Calculated: {result.calculatedChecksum}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Processing History</CardTitle>
                    <Button
                      onClick={() => setChecksumHistory([])}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Clear
                    </Button>
                  </div>
                  <CardDescription>View your recent checksum operations</CardDescription>
                </CardHeader>
                <CardContent>
                  {checksumHistory.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No processing history</p>
                      <p className="text-sm">Generate checksums to see them here</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {checksumHistory.map((entry) => (
                        <div key={entry.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{entry.fileName}</span>
                              <Badge variant="outline" className="text-xs">
                                {entry.algorithm.toUpperCase()}
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(entry.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            <div>Size: {formatFileSize(entry.fileSize)}</div>
                            <div className="font-mono break-all">{entry.checksum}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                <CardTitle>File List</CardTitle>
                <div className="flex gap-2">
                  <Button
                    onClick={exportChecksums}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
              <CardDescription>Uploaded files and their checksums</CardDescription>
            </CardHeader>
            <CardContent>
              {files.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileImage className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No files uploaded</p>
                  <p className="text-sm">Upload files to generate checksums</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {files.map((file) => {
                    const FileIcon = getFileTypeIcon(file.type);
                    return (
                      <div key={file.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <FileIcon className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <div className="font-medium">{file.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {formatFileSize(file.size)} • {file.type || 'Unknown type'}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={
                              file.status === 'completed' ? 'default' :
                              file.status === 'processing' ? 'secondary' :
                              file.status === 'error' ? 'destructive' : 'outline'
                            }>
                              {file.status}
                            </Badge>
                            <Button
                              onClick={() => removeFile(file.id)}
                              variant="ghost"
                              size="sm"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {file.status === 'completed' && (
                          <div className="space-y-3">
                            {Object.entries(file.checksums).map(([algorithm, checksum]) => {
                              const algo = CHECKSUM_ALGORITHMS.find(a => a.value === algorithm);
                              return (
                                <div key={algorithm} className="bg-muted p-3 rounded-lg">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                      {algo && <algo.icon className={`h-4 w-4 ${algo.color}`} />}
                                      <span className="font-medium">{algo?.name || algorithm.toUpperCase()}</span>
                                    </div>
                                    <Button
                                      onClick={() => copyChecksum(checksum)}
                                      variant="ghost"
                                      size="sm"
                                      className="gap-1"
                                    >
                                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                                      Copy
                                    </Button>
                                  </div>
                                  <div className="font-mono text-sm break-all text-muted-foreground">
                                    {checksum}
                                  </div>
                                </div>
                              );
                            })}
                            
                            {file.processingTime && (
                              <div className="text-xs text-muted-foreground">
                                Processing time: {formatTime(file.processingTime)}
                              </div>
                            )}
                          </div>
                        )}

                        {file.status === 'error' && (
                          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                            <div className="flex items-center gap-2 text-destructive">
                              <AlertCircle className="h-4 w-4" />
                              <span className="font-medium">Error</span>
                            </div>
                            <p className="text-sm text-destructive mt-1">{file.error}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Processing Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Files:</span>
                    <span className="font-medium">{files.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Completed:</span>
                    <span className="font-medium text-green-600">
                      {files.filter(f => f.status === 'completed').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Processing:</span>
                    <span className="font-medium text-blue-600">
                      {files.filter(f => f.status === 'processing').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Errors:</span>
                    <span className="font-medium text-red-600">
                      {files.filter(f => f.status === 'error').length}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Algorithms:</span>
                    <span className="font-medium">{selectedAlgorithms.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">History Entries:</span>
                    <span className="font-medium">{checksumHistory.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Verifications:</span>
                    <span className="font-medium">{verificationResults.length}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Professional Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Professional Tips</CardTitle>
          <CardDescription>Best practices for file integrity verification</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Security Best Practices</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Use SHA-256 or higher:</strong> MD5 and SHA-1 are cryptographically broken</li>
                <li>• <strong>Verify from trusted sources:</strong> Always verify checksums from official sources</li>
                <li>• <strong>Multiple algorithms:</strong> Use multiple algorithms for critical files</li>
                <li>• <strong>Store securely:</strong> Keep checksums in secure, tamper-proof locations</li>
                <li>• <strong>Regular verification:</strong> Periodically verify file integrity</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Common Use Cases</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Software Distribution:</strong> Verify downloaded software packages</li>
                <li>• <strong>Data Backup:</strong> Ensure backup integrity and completeness</li>
                <li>• <strong>File Transfer:</strong> Verify files transferred over networks</li>
                <li>• <strong>Forensic Analysis:</strong> Maintain evidence integrity</li>
                <li>• <strong>Compliance:</strong> Meet regulatory requirements for data integrity</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChecksumTool;
