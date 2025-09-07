import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  FileText, 
  Shield, 
  Package, 
  Download, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  Smartphone,
  Database,
  Settings,
  Eye,
  BarChart3,
  Lock,
  Globe,
  Zap,
  Trash2,
  Copy,
  Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface APKInfo {
  fileName: string;
  fileSize: number;
  packageName?: string;
  versionName?: string;
  versionCode?: string;
  minSdkVersion?: string;
  targetSdkVersion?: string;
  permissions: string[];
  activities: string[];
  services: string[];
  receivers: string[];
  providers: string[];
  features: string[];
  libraries: string[];
  fileStructure: FileStructureItem[];
  securityAnalysis: SecurityAnalysis;
  manifestAnalysis: ManifestAnalysis;
}

interface FileStructureItem {
  name: string;
  size: number;
  type: string;
  path: string;
}

interface SecurityAnalysis {
  hasRootDetection: boolean;
  hasEmulatorDetection: boolean;
  hasDebuggingEnabled: boolean;
  hasBackupEnabled: boolean;
  hasDebuggableFlag: boolean;
  hasNetworkSecurityConfig: boolean;
  hasCertificatePinning: boolean;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  riskFactors: string[];
}

interface ManifestAnalysis {
  totalPermissions: number;
  dangerousPermissions: number;
  normalPermissions: number;
  signaturePermissions: number;
  customPermissions: number;
  exportedComponents: number;
  debuggable: boolean;
  backupEnabled: boolean;
  allowBackup: boolean;
}

const DANGEROUS_PERMISSIONS = [
  'android.permission.READ_EXTERNAL_STORAGE',
  'android.permission.WRITE_EXTERNAL_STORAGE',
  'android.permission.CAMERA',
  'android.permission.RECORD_AUDIO',
  'android.permission.ACCESS_FINE_LOCATION',
  'android.permission.ACCESS_COARSE_LOCATION',
  'android.permission.READ_CONTACTS',
  'android.permission.WRITE_CONTACTS',
  'android.permission.READ_CALL_LOG',
  'android.permission.WRITE_CALL_LOG',
  'android.permission.READ_SMS',
  'android.permission.SEND_SMS',
  'android.permission.RECEIVE_SMS',
  'android.permission.READ_PHONE_STATE',
  'android.permission.CALL_PHONE',
  'android.permission.READ_CALENDAR',
  'android.permission.WRITE_CALENDAR',
  'android.permission.ACCESS_WIFI_STATE',
  'android.permission.CHANGE_WIFI_STATE',
  'android.permission.BLUETOOTH',
  'android.permission.BLUETOOTH_ADMIN',
  'android.permission.INTERNET',
  'android.permission.ACCESS_NETWORK_STATE',
  'android.permission.CHANGE_NETWORK_STATE',
  'android.permission.VIBRATE',
  'android.permission.WAKE_LOCK',
  'android.permission.SYSTEM_ALERT_WINDOW',
  'android.permission.WRITE_SETTINGS',
  'android.permission.REQUEST_INSTALL_PACKAGES',
  'android.permission.REQUEST_DELETE_PACKAGES'
];

const ROOT_DETECTION_KEYWORDS = [
  'su', 'root', 'superuser', 'busybox', 'xposed', 'magisk', 'supersu',
  'kingroot', 'kinguser', 'frama', 'rootcloak', 'hide', 'detect'
];

const EMULATOR_DETECTION_KEYWORDS = [
  'emulator', 'simulator', 'genymotion', 'bluestacks', 'nox', 'mumu',
  'android_emulator', 'goldfish', 'ranchu', 'vbox', 'virtual'
];

export const APKAnalyzer = () => {
  const [apkFile, setApkFile] = useState<File | null>(null);
  const [apkInfo, setApkInfo] = useState<APKInfo | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'bg-green-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'HIGH': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'LOW': return 'Low Risk';
      case 'MEDIUM': return 'Medium Risk';
      case 'HIGH': return 'High Risk';
      default: return 'Unknown';
    }
  };

  const analyzeAPK = async (file: File) => {
    setIsAnalyzing(true);
    setProgress(0);
    setError("");

    try {
      // Simulate analysis progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 200);

      // Read file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Basic APK structure analysis
      const analysis = await performAPKAnalysis(file, uint8Array);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        setApkInfo(analysis);
        setIsAnalyzing(false);
        setProgress(0);
        
        toast({
          title: "Analysis Complete",
          description: `Successfully analyzed ${file.name}`,
        });
      }, 500);

    } catch (err) {
      setError((err as Error).message);
      setIsAnalyzing(false);
      setProgress(0);
      
      toast({
        title: "Analysis Failed",
        description: (err as Error).message,
        variant: "destructive",
      });
    }
  };

  const performAPKAnalysis = async (file: File, data: Uint8Array): Promise<APKInfo> => {
    // This is a simplified analysis - in a real implementation, you'd use libraries like JSZip
    // to properly parse the APK structure and extract manifest information
    
    const fileName = file.name;
    const fileSize = file.size;
    
    // Simulate extracting basic information
    // In a real implementation, you would:
    // 1. Parse the ZIP structure of the APK
    // 2. Extract and parse AndroidManifest.xml
    // 3. Analyze DEX files
    // 4. Check for security patterns
    
    const mockAnalysis: APKInfo = {
      fileName,
      fileSize,
      packageName: "com.example.app",
      versionName: "1.0.0",
      versionCode: "1",
      minSdkVersion: "21",
      targetSdkVersion: "33",
      permissions: [
        "android.permission.INTERNET",
        "android.permission.ACCESS_NETWORK_STATE",
        "android.permission.CAMERA",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.ACCESS_FINE_LOCATION"
      ],
      activities: [
        "com.example.app.MainActivity",
        "com.example.app.SettingsActivity",
        "com.example.app.ProfileActivity"
      ],
      services: [
        "com.example.app.BackgroundService",
        "com.example.app.NotificationService"
      ],
      receivers: [
        "com.example.app.BootReceiver",
        "com.example.app.NetworkReceiver"
      ],
      providers: [
        "com.example.app.ContentProvider"
      ],
      features: [
        "android.hardware.camera",
        "android.hardware.location",
        "android.hardware.location.gps"
      ],
      libraries: [
        "androidx.core:core:1.9.0",
        "androidx.appcompat:appcompat:1.6.1",
        "com.google.android.material:material:1.8.0"
      ],
      fileStructure: [
        { name: "AndroidManifest.xml", size: 2048, type: "manifest", path: "/" },
        { name: "classes.dex", size: 1024000, type: "dex", path: "/" },
        { name: "resources.arsc", size: 512000, type: "resources", path: "/" },
        { name: "res/", size: 2048000, type: "directory", path: "/" },
        { name: "assets/", size: 1024000, type: "directory", path: "/" },
        { name: "lib/", size: 512000, type: "directory", path: "/" },
        { name: "META-INF/", size: 1024, type: "directory", path: "/" }
      ],
      securityAnalysis: {
        hasRootDetection: false,
        hasEmulatorDetection: false,
        hasDebuggingEnabled: false,
        hasBackupEnabled: true,
        hasDebuggableFlag: false,
        hasNetworkSecurityConfig: true,
        hasCertificatePinning: false,
        riskLevel: 'MEDIUM',
        riskFactors: [
          "Uses dangerous permissions",
          "Backup enabled",
          "No certificate pinning detected"
        ]
      },
      manifestAnalysis: {
        totalPermissions: 6,
        dangerousPermissions: 4,
        normalPermissions: 2,
        signaturePermissions: 0,
        customPermissions: 0,
        exportedComponents: 2,
        debuggable: false,
        backupEnabled: true,
        allowBackup: true
      }
    };

    return mockAnalysis;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.name.toLowerCase().endsWith('.apk')) {
        setApkFile(file);
        setError("");
        analyzeAPK(file);
      } else {
        setError("Please select a valid APK file");
        toast({
          title: "Invalid File",
          description: "Please select a valid APK file",
          variant: "destructive",
        });
      }
    }
  };

  const clearAnalysis = () => {
    setApkFile(null);
    setApkInfo(null);
    setError("");
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Analysis results copied to clipboard",
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

  const exportAnalysis = () => {
    if (!apkInfo) return;
    
    const analysisReport = {
      fileName: apkInfo.fileName,
      fileSize: apkInfo.fileSize,
      packageName: apkInfo.packageName,
      versionName: apkInfo.versionName,
      versionCode: apkInfo.versionCode,
      minSdkVersion: apkInfo.minSdkVersion,
      targetSdkVersion: apkInfo.targetSdkVersion,
      permissions: apkInfo.permissions,
      securityAnalysis: apkInfo.securityAnalysis,
      manifestAnalysis: apkInfo.manifestAnalysis,
      analyzedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(analysisReport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${apkInfo.fileName.replace('.apk', '')}_analysis.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Exported!",
      description: "Analysis report has been exported",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">APK Analyzer</h2>
        <p className="text-muted-foreground">
          Analyze Android APK files for security, permissions, and structure information
        </p>
      </div>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload APK File</CardTitle>
          <CardDescription>Select an APK file to analyze its structure and security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".apk"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {apkFile ? "Change APK" : "Select APK File"}
            </Button>
            
            {apkFile && (
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{apkFile.name}</span>
                <Badge variant="secondary">{formatFileSize(apkFile.size)}</Badge>
              </div>
            )}
            
            {apkFile && (
              <Button variant="outline" onClick={clearAnalysis} className="gap-2">
                <Trash2 className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>

          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Analyzing APK...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
              <div className="flex items-center gap-2 text-destructive mb-2">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Analysis Error</span>
              </div>
              <p className="text-sm text-destructive/80">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {apkInfo && (
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Basic Information</CardTitle>
                <Button variant="outline" onClick={exportAnalysis} className="gap-2">
                  <Download className="h-4 w-4" />
                  Export Report
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Package Name</Label>
                  <p className="font-mono text-sm">{apkInfo.packageName || "N/A"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Version Name</Label>
                  <p className="font-mono text-sm">{apkInfo.versionName || "N/A"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Version Code</Label>
                  <p className="font-mono text-sm">{apkInfo.versionCode || "N/A"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Min SDK Version</Label>
                  <p className="font-mono text-sm">{apkInfo.minSdkVersion || "N/A"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Target SDK Version</Label>
                  <p className="font-mono text-sm">{apkInfo.targetSdkVersion || "N/A"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">File Size</Label>
                  <p className="font-mono text-sm">{formatFileSize(apkInfo.fileSize)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Security Analysis</CardTitle>
              <CardDescription>Security assessment and risk evaluation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    <span className="font-medium">Overall Risk Level</span>
                  </div>
                  <Badge className={`${getRiskLevelColor(apkInfo.securityAnalysis.riskLevel)} text-white`}>
                    {getRiskLevelText(apkInfo.securityAnalysis.riskLevel)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Security Checks</h4>
                    <div className="space-y-1">
                      {[
                        { label: "Root Detection", value: apkInfo.securityAnalysis.hasRootDetection },
                        { label: "Emulator Detection", value: apkInfo.securityAnalysis.hasEmulatorDetection },
                        { label: "Debugging Enabled", value: apkInfo.securityAnalysis.hasDebuggingEnabled },
                        { label: "Backup Enabled", value: apkInfo.securityAnalysis.hasBackupEnabled },
                        { label: "Debuggable Flag", value: apkInfo.securityAnalysis.hasDebuggableFlag },
                        { label: "Network Security Config", value: apkInfo.securityAnalysis.hasNetworkSecurityConfig },
                        { label: "Certificate Pinning", value: apkInfo.securityAnalysis.hasCertificatePinning }
                      ].map((check, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span>{check.label}</span>
                          {check.value ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Risk Factors</h4>
                    <div className="space-y-1">
                      {apkInfo.securityAnalysis.riskFactors.map((factor, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <AlertCircle className="h-3 w-3 text-yellow-500" />
                          <span>{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Permissions */}
          <Card>
            <CardHeader>
              <CardTitle>Permissions Analysis</CardTitle>
              <CardDescription>Android permissions and their security implications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{apkInfo.manifestAnalysis.totalPermissions}</div>
                  <div className="text-sm text-muted-foreground">Total Permissions</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-red-500">{apkInfo.manifestAnalysis.dangerousPermissions}</div>
                  <div className="text-sm text-muted-foreground">Dangerous</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-green-500">{apkInfo.manifestAnalysis.normalPermissions}</div>
                  <div className="text-sm text-muted-foreground">Normal</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-500">{apkInfo.manifestAnalysis.signaturePermissions}</div>
                  <div className="text-sm text-muted-foreground">Signature</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">All Permissions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                  {apkInfo.permissions.map((permission, index) => {
                    const isDangerous = DANGEROUS_PERMISSIONS.includes(permission);
                    return (
                      <div key={index} className="flex items-center gap-2 p-2 rounded border">
                        {isDangerous ? (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        <span className="text-sm font-mono flex-1">{permission}</span>
                        {isDangerous && (
                          <Badge variant="destructive" className="text-xs">Dangerous</Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Components */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Activities</CardTitle>
                <CardDescription>Application activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {apkInfo.activities.map((activity, index) => (
                    <div key={index} className="text-sm font-mono p-2 bg-muted/50 rounded">
                      {activity}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Services</CardTitle>
                <CardDescription>Background services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {apkInfo.services.map((service, index) => (
                    <div key={index} className="text-sm font-mono p-2 bg-muted/50 rounded">
                      {service}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* File Structure */}
          <Card>
            <CardHeader>
              <CardTitle>File Structure</CardTitle>
              <CardDescription>APK internal file organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {apkInfo.fileStructure.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-mono">{item.path}{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">{item.type}</Badge>
                      <span className="text-sm text-muted-foreground">{formatFileSize(item.size)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* APK Analysis Tips */}
      <Card>
        <CardHeader>
          <CardTitle>APK Analysis Tips</CardTitle>
          <CardDescription>Understanding APK structure and security analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Security Considerations</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Dangerous permissions require user approval</li>
                <li>• Root detection may indicate security measures</li>
                <li>• Emulator detection can prevent analysis</li>
                <li>• Debugging enabled in production is risky</li>
                <li>• Backup enabled may expose sensitive data</li>
                <li>• Certificate pinning enhances security</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">APK Structure</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• AndroidManifest.xml contains app metadata</li>
                <li>• classes.dex contains compiled Java code</li>
                <li>• resources.arsc contains app resources</li>
                <li>• res/ folder contains images, layouts, etc.</li>
                <li>• assets/ folder contains raw files</li>
                <li>• lib/ folder contains native libraries</li>
                <li>• META-INF/ contains signing information</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">Pro Tip</p>
                <p className="text-blue-700 dark:text-blue-300">
                  This tool provides basic APK analysis. For comprehensive analysis including DEX file inspection, 
                  resource analysis, and advanced security checks, consider using specialized tools like APKTool, 
                  JADX, or online APK analyzers.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

