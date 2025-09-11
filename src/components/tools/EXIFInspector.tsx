import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  Upload, 
  Image as ImageIcon, 
  Camera, 
  MapPin, 
  Download, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  Eye,
  Settings,
  Clock,
  Zap,
  Trash2,
  Copy,
  Check,
  Shield,
  Globe,
  Smartphone,
  Monitor,
  Palette,
  Sun,
  Focus,
  Aperture,
  Copyright,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EXIF from 'exif-js';

interface EXIFData {
  fileName: string;
  fileSize: number;
  imagePreview?: string;
  camera: CameraInfo;
  image: ImageInfo;
  gps: GPSInfo;
  technical: TechnicalInfo;
  privacy: PrivacyInfo;
  raw: Record<string, unknown>;
}

interface CameraInfo {
  make?: string;
  model?: string;
  software?: string;
  artist?: string;
  copyright?: string;
  dateTime?: string;
  dateTimeOriginal?: string;
  dateTimeDigitized?: string;
}

interface ImageInfo {
  width?: number;
  height?: number;
  orientation?: number;
  colorSpace?: number;
  compression?: number;
  resolution?: { x: number; y: number };
  bitsPerSample?: number;
  photometricInterpretation?: number;
  samplesPerPixel?: number;
  planarConfiguration?: number;
  yCbCrSubSampling?: string;
  yCbCrPositioning?: number;
  xResolution?: number;
  yResolution?: number;
  resolutionUnit?: number;
  whitePoint?: string;
  primaryChromaticities?: string;
  transferFunction?: string;
  referenceBlackWhite?: string;
  dateTime?: string;
  imageDescription?: string;
  make?: string;
  model?: string;
  software?: string;
  artist?: string;
  copyright?: string;
  exifIFD?: number;
  gpsIFD?: number;
}

interface GPSInfo {
  latitude?: number;
  longitude?: number;
  altitude?: number;
  latitudeRef?: string;
  longitudeRef?: string;
  altitudeRef?: number;
  timeStamp?: string;
  satellites?: string;
  status?: string;
  measureMode?: string;
  degreeOfPrecision?: number;
  speedRef?: string;
  speed?: number;
  trackRef?: string;
  track?: number;
  imgDirectionRef?: string;
  imgDirection?: number;
  mapDatum?: string;
  destLatitudeRef?: string;
  destLatitude?: number;
  destLongitudeRef?: string;
  destLongitude?: number;
  destBearingRef?: string;
  destBearing?: number;
  destDistanceRef?: string;
  destDistance?: number;
  processingMethod?: string;
  areaInformation?: string;
  dateStamp?: string;
  differential?: number;
  hPositioningError?: number;
}

interface TechnicalInfo {
  exposureTime?: number;
  fNumber?: number;
  exposureProgram?: number;
  spectralSensitivity?: string;
  iso?: number;
  oecf?: string;
  exifVersion?: string;
  dateTimeOriginal?: string;
  dateTimeDigitized?: string;
  componentsConfiguration?: string;
  compressedBitsPerPixel?: number;
  shutterSpeedValue?: number;
  apertureValue?: number;
  brightnessValue?: number;
  exposureBiasValue?: number;
  maxApertureValue?: number;
  subjectDistance?: number;
  meteringMode?: number;
  lightSource?: number;
  flash?: number;
  focalLength?: number;
  subjectArea?: string;
  makerNote?: string;
  userComment?: string;
  subsecTime?: string;
  subsecTimeOriginal?: string;
  subsecTimeDigitized?: string;
  flashpixVersion?: string;
  colorSpace?: number;
  pixelXDimension?: number;
  pixelYDimension?: number;
  relatedSoundFile?: string;
  flashEnergy?: number;
  spatialFrequencyResponse?: string;
  focalPlaneXResolution?: number;
  focalPlaneYResolution?: number;
  focalPlaneResolutionUnit?: number;
  subjectLocation?: string;
  exposureIndex?: number;
  sensingMethod?: number;
  fileSource?: number;
  sceneType?: number;
  cfaPattern?: string;
  customRendered?: number;
  exposureMode?: number;
  whiteBalance?: number;
  digitalZoomRatio?: number;
  focalLengthIn35mmFilm?: number;
  sceneCaptureType?: number;
  gainControl?: number;
  contrast?: number;
  saturation?: number;
  sharpness?: number;
  deviceSettingDescription?: string;
  subjectDistanceRange?: number;
  imageUniqueID?: string;
  cameraOwnerName?: string;
  bodySerialNumber?: string;
  lensSpecification?: string;
  lensMake?: string;
  lensModel?: string;
  lensSerialNumber?: string;
  gamma?: number;
}

interface PrivacyInfo {
  hasGPS: boolean;
  hasLocation: boolean;
  hasDateTime: boolean;
  hasCameraInfo: boolean;
  hasSoftwareInfo: boolean;
  hasArtistInfo: boolean;
  hasCopyrightInfo: boolean;
  privacyLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  privacyRisks: string[];
  recommendations: string[];
}

const PRIVACY_RISKS = {
  GPS: "GPS coordinates can reveal exact location where photo was taken",
  DateTime: "Date/time information can reveal when photo was taken",
  CameraInfo: "Camera make/model can reveal device ownership",
  SoftwareInfo: "Software information can reveal editing tools used",
  ArtistInfo: "Artist information can reveal photographer identity",
  CopyrightInfo: "Copyright information can reveal ownership details"
};

const EXIFInspector = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [exifData, setExifData] = useState<EXIFData | null>(null);
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

  const getPrivacyLevelColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'bg-green-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'HIGH': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPrivacyLevelText = (level: string) => {
    switch (level) {
      case 'LOW': return 'Low Risk';
      case 'MEDIUM': return 'Medium Risk';
      case 'HIGH': return 'High Risk';
      default: return 'Unknown';
    }
  };

  const formatGPS = (lat: number, lon: number): string => {
    const latDir = lat >= 0 ? 'N' : 'S';
    const lonDir = lon >= 0 ? 'E' : 'W';
    return `${Math.abs(lat).toFixed(6)}° ${latDir}, ${Math.abs(lon).toFixed(6)}° ${lonDir}`;
  };

  const formatDateTime = (dateTime: string): string => {
    if (!dateTime) return 'N/A';
    try {
      const date = new Date(dateTime);
      return date.toLocaleString();
    } catch {
      return dateTime;
    }
  };

  const formatExposureTime = (exposureTime: number): string => {
    if (exposureTime >= 1) {
      return `${exposureTime}s`;
    } else {
      return `1/${Math.round(1 / exposureTime)}s`;
    }
  };

  const formatFNumber = (fNumber: number): string => {
    return `f/${fNumber}`;
  };

  const formatFocalLength = (focalLength: number): string => {
    return `${focalLength}mm`;
  };

  const formatISO = (iso: number): string => {
    return `ISO ${iso}`;
  };

  const analyzeImage = async (file: File) => {
    setIsAnalyzing(true);
    setProgress(0);
    setError("");

    try {
      // Simulate analysis progress
      let progressInterval: NodeJS.Timeout;
      progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 10;
          if (newProgress >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return newProgress;
        });
      }, 200);

      // Create image preview
      const imagePreview = await createImagePreview(file);
      
      // Extract EXIF data
      const exifData = await extractEXIFData(file, imagePreview);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setTimeout(() => {
        setExifData(exifData);
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

  const createImagePreview = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const extractEXIFData = async (file: File, imagePreview: string): Promise<EXIFData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const image = new Image();
          image.onload = () => {
            EXIF.getData(image, () => {
              const rawData = EXIF.getAllTags(image);
              
              // If no EXIF data, try to get basic image info
              if (!rawData || Object.keys(rawData).length === 0) {
                console.log('No EXIF data found, using basic image info');
                const basicImageInfo: ImageInfo = {
                  width: image.naturalWidth,
                  height: image.naturalHeight,
                  orientation: 1,
                  colorSpace: 1
                };
                
                const basicExifData: EXIFData = {
                  fileName: file.name,
                  fileSize: file.size,
                  imagePreview: imagePreview,
                  camera: {},
                  image: basicImageInfo,
                  gps: {},
                  technical: {},
                  privacy: {
                    hasGPS: false,
                    hasLocation: false,
                    hasDateTime: false,
                    hasCameraInfo: false,
                    hasSoftwareInfo: false,
                    hasArtistInfo: false,
                    hasCopyrightInfo: false,
                    privacyLevel: 'LOW',
                    privacyRisks: [],
                    recommendations: []
                  },
                  raw: {}
                };
                
                resolve(basicExifData);
                return;
              }
              
              // Debug: Log raw data to see what we're getting
              console.log('Raw EXIF data:', rawData);
              
              // Check if we have any EXIF data
              const hasExifData = Object.keys(rawData).length > 0;
              console.log('Has EXIF data:', hasExifData, 'Keys:', Object.keys(rawData));
              
              // Parse camera information
              const camera: CameraInfo = {
                make: rawData.Make,
                model: rawData.Model,
                software: rawData.Software,
                artist: rawData.Artist,
                copyright: rawData.Copyright,
                dateTime: rawData.DateTime,
                dateTimeOriginal: rawData.DateTimeOriginal,
                dateTimeDigitized: rawData.DateTimeDigitized
              };

              // Parse image information
              const imageInfo: ImageInfo = {
                width: rawData.PixelXDimension || image.naturalWidth,
                height: rawData.PixelYDimension || image.naturalHeight,
                orientation: rawData.Orientation,
                colorSpace: rawData.ColorSpace,
                compression: rawData.Compression,
                resolution: {
                  x: rawData.XResolution,
                  y: rawData.YResolution
                },
                bitsPerSample: rawData.BitsPerSample,
                photometricInterpretation: rawData.PhotometricInterpretation,
                samplesPerPixel: rawData.SamplesPerPixel,
                planarConfiguration: rawData.PlanarConfiguration,
                yCbCrSubSampling: rawData.YCbCrSubSampling,
                yCbCrPositioning: rawData.YCbCrPositioning,
                xResolution: rawData.XResolution,
                yResolution: rawData.YResolution,
                resolutionUnit: rawData.ResolutionUnit,
                whitePoint: rawData.WhitePoint,
                primaryChromaticities: rawData.PrimaryChromaticities,
                transferFunction: rawData.TransferFunction,
                referenceBlackWhite: rawData.ReferenceBlackWhite,
                dateTime: rawData.DateTime,
                imageDescription: rawData.ImageDescription,
                make: rawData.Make,
                model: rawData.Model,
                software: rawData.Software,
                artist: rawData.Artist,
                copyright: rawData.Copyright,
                exifIFD: rawData.ExifIFD,
                gpsIFD: rawData.GPSIFD
              };

              // Parse GPS information
              const gps: GPSInfo = {
                latitude: rawData.GPSLatitude,
                longitude: rawData.GPSLongitude,
                altitude: rawData.GPSAltitude,
                latitudeRef: rawData.GPSLatitudeRef,
                longitudeRef: rawData.GPSLongitudeRef,
                altitudeRef: rawData.GPSAltitudeRef,
                timeStamp: rawData.GPSTimeStamp,
                satellites: rawData.GPSSatellites,
                status: rawData.GPSStatus,
                measureMode: rawData.GPSMeasureMode,
                degreeOfPrecision: rawData.GPSDOP,
                speedRef: rawData.GPSSpeedRef,
                speed: rawData.GPSSpeed,
                trackRef: rawData.GPSTrackRef,
                track: rawData.GPSTrack,
                imgDirectionRef: rawData.GPSImgDirectionRef,
                imgDirection: rawData.GPSImgDirection,
                mapDatum: rawData.GPSMapDatum,
                destLatitudeRef: rawData.GPSDestLatitudeRef,
                destLatitude: rawData.GPSDestLatitude,
                destLongitudeRef: rawData.GPSDestLongitudeRef,
                destLongitude: rawData.GPSDestLongitude,
                destBearingRef: rawData.GPSDestBearingRef,
                destBearing: rawData.GPSDestBearing,
                destDistanceRef: rawData.GPSDestDistanceRef,
                destDistance: rawData.GPSDestDistance,
                processingMethod: rawData.GPSProcessingMethod,
                areaInformation: rawData.GPSAreaInformation,
                dateStamp: rawData.GPSDateStamp,
                differential: rawData.GPSDifferential,
                hPositioningError: rawData.GPSHPositioningError
              };

              // Parse technical information
              const technical: TechnicalInfo = {
                exposureTime: rawData.ExposureTime,
                fNumber: rawData.FNumber,
                exposureProgram: rawData.ExposureProgram,
                spectralSensitivity: rawData.SpectralSensitivity,
                iso: rawData.ISOSpeedRatings,
                oecf: rawData.OECF,
                exifVersion: rawData.ExifVersion,
                dateTimeOriginal: rawData.DateTimeOriginal,
                dateTimeDigitized: rawData.DateTimeDigitized,
                componentsConfiguration: rawData.ComponentsConfiguration,
                compressedBitsPerPixel: rawData.CompressedBitsPerPixel,
                shutterSpeedValue: rawData.ShutterSpeedValue,
                apertureValue: rawData.ApertureValue,
                brightnessValue: rawData.BrightnessValue,
                exposureBiasValue: rawData.ExposureBiasValue,
                maxApertureValue: rawData.MaxApertureValue,
                subjectDistance: rawData.SubjectDistance,
                meteringMode: rawData.MeteringMode,
                lightSource: rawData.LightSource,
                flash: rawData.Flash,
                focalLength: rawData.FocalLength,
                subjectArea: rawData.SubjectArea,
                makerNote: rawData.MakerNote,
                userComment: rawData.UserComment,
                subsecTime: rawData.SubsecTime,
                subsecTimeOriginal: rawData.SubsecTimeOriginal,
                subsecTimeDigitized: rawData.SubsecTimeDigitized,
                flashpixVersion: rawData.FlashpixVersion,
                colorSpace: rawData.ColorSpace,
                pixelXDimension: rawData.PixelXDimension,
                pixelYDimension: rawData.PixelYDimension,
                relatedSoundFile: rawData.RelatedSoundFile,
                flashEnergy: rawData.FlashEnergy,
                spatialFrequencyResponse: rawData.SpatialFrequencyResponse,
                focalPlaneXResolution: rawData.FocalPlaneXResolution,
                focalPlaneYResolution: rawData.FocalPlaneYResolution,
                focalPlaneResolutionUnit: rawData.FocalPlaneResolutionUnit,
                subjectLocation: rawData.SubjectLocation,
                exposureIndex: rawData.ExposureIndex,
                sensingMethod: rawData.SensingMethod,
                fileSource: rawData.FileSource,
                sceneType: rawData.SceneType,
                cfaPattern: rawData.CFAPattern,
                customRendered: rawData.CustomRendered,
                exposureMode: rawData.ExposureMode,
                whiteBalance: rawData.WhiteBalance,
                digitalZoomRatio: rawData.DigitalZoomRatio,
                focalLengthIn35mmFilm: rawData.FocalLengthIn35mmFilm,
                sceneCaptureType: rawData.SceneCaptureType,
                gainControl: rawData.GainControl,
                contrast: rawData.Contrast,
                saturation: rawData.Saturation,
                sharpness: rawData.Sharpness,
                deviceSettingDescription: rawData.DeviceSettingDescription,
                subjectDistanceRange: rawData.SubjectDistanceRange,
                imageUniqueID: rawData.ImageUniqueID,
                cameraOwnerName: rawData.CameraOwnerName,
                bodySerialNumber: rawData.BodySerialNumber,
                lensSpecification: rawData.LensSpecification,
                lensMake: rawData.LensMake,
                lensModel: rawData.LensModel,
                lensSerialNumber: rawData.LensSerialNumber,
                gamma: rawData.Gamma
              };

              // Analyze privacy
              const privacy = analyzePrivacy(camera, gps, technical);

              const exifData: EXIFData = {
                fileName: file.name,
                fileSize: file.size,
                imagePreview: imagePreview,
                camera,
                image: imageInfo,
                gps,
                technical,
                privacy,
                raw: rawData
              };

              console.log('Processed EXIF data:', exifData);
              resolve(exifData);
            });
          };
          image.src = e.target?.result as string;
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const analyzePrivacy = (camera: CameraInfo, gps: GPSInfo, technical: TechnicalInfo): PrivacyInfo => {
    const risks: string[] = [];
    const recommendations: string[] = [];

    // Check for GPS data
    const hasGPS = !!(gps.latitude && gps.longitude);
    if (hasGPS) {
      risks.push(PRIVACY_RISKS.GPS);
      recommendations.push("Remove GPS coordinates before sharing");
    }

    // Check for date/time
    const hasDateTime = !!(camera.dateTime || camera.dateTimeOriginal || camera.dateTimeDigitized);
    if (hasDateTime) {
      risks.push(PRIVACY_RISKS.DateTime);
      recommendations.push("Consider removing date/time information");
    }

    // Check for camera info
    const hasCameraInfo = !!(camera.make || camera.model);
    if (hasCameraInfo) {
      risks.push(PRIVACY_RISKS.CameraInfo);
      recommendations.push("Camera make/model can reveal device ownership");
    }

    // Check for software info
    const hasSoftwareInfo = !!camera.software;
    if (hasSoftwareInfo) {
      risks.push(PRIVACY_RISKS.SoftwareInfo);
      recommendations.push("Software information can reveal editing tools");
    }

    // Check for artist info
    const hasArtistInfo = !!camera.artist;
    if (hasArtistInfo) {
      risks.push(PRIVACY_RISKS.ArtistInfo);
      recommendations.push("Artist information can reveal photographer identity");
    }

    // Check for copyright info
    const hasCopyrightInfo = !!camera.copyright;
    if (hasCopyrightInfo) {
      risks.push(PRIVACY_RISKS.CopyrightInfo);
      recommendations.push("Copyright information can reveal ownership");
    }

    // Determine privacy level
    let privacyLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    if (hasGPS || (hasDateTime && hasCameraInfo)) {
      privacyLevel = 'HIGH';
    } else if (hasDateTime || hasCameraInfo || hasSoftwareInfo) {
      privacyLevel = 'MEDIUM';
    }

    return {
      hasGPS,
      hasLocation: hasGPS,
      hasDateTime,
      hasCameraInfo,
      hasSoftwareInfo,
      hasArtistInfo,
      hasCopyrightInfo,
      privacyLevel,
      privacyRisks: risks,
      recommendations
    };
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setImageFile(file);
        setError("");
        analyzeImage(file);
      } else {
        setError("Please select a valid image file");
        toast({
          title: "Invalid File",
          description: "Please select a valid image file (JPEG, PNG, TIFF, etc.)",
          variant: "destructive",
        });
      }
    }
  };

  const clearAnalysis = () => {
    setImageFile(null);
    setExifData(null);
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
        description: "EXIF data copied to clipboard",
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

  const exportEXIFData = () => {
    if (!exifData) return;
    
    const exportData = {
      fileName: exifData.fileName,
      fileSize: exifData.fileSize,
      camera: exifData.camera,
      image: exifData.image,
      gps: exifData.gps,
      technical: exifData.technical,
      privacy: exifData.privacy,
      analyzedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exifData.fileName.replace(/\.[^/.]+$/, '')}_exif.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Exported!",
      description: "EXIF data has been exported",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">EXIF Inspector</h2>
        <p className="text-muted-foreground">
          Analyze image metadata and EXIF data for privacy, technical details, and location information
        </p>
      </div>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Image File</CardTitle>
          <CardDescription>Select an image file to analyze its EXIF metadata</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {imageFile ? "Change Image" : "Select Image File"}
            </Button>
            
            {imageFile && (
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{imageFile.name}</span>
                <Badge variant="secondary">{formatFileSize(imageFile.size)}</Badge>
              </div>
            )}
            
            {imageFile && (
              <Button variant="outline" onClick={clearAnalysis} className="gap-2">
                <Trash2 className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>

          {isAnalyzing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Analyzing image...</span>
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
      {exifData && (
        <div className="space-y-6">
          {/* Image Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Image Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <img
                  src={exifData.imagePreview}
                  alt="Preview"
                  className="max-w-full max-h-96 rounded-lg shadow-lg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Analysis */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Privacy Analysis</CardTitle>
                <Button variant="outline" onClick={exportEXIFData} className="gap-2">
                  <Download className="h-4 w-4" />
                  Export Data
                </Button>
              </div>
              <CardDescription>Privacy assessment and risk evaluation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    <span className="font-medium">Privacy Risk Level</span>
                  </div>
                  <Badge className={`${getPrivacyLevelColor(exifData.privacy.privacyLevel)} text-white`}>
                    {getPrivacyLevelText(exifData.privacy.privacyLevel)}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Privacy Checks</h4>
                    <div className="space-y-1">
                      {[
                        { label: "GPS Location", value: exifData.privacy.hasGPS, icon: MapPin },
                        { label: "Date/Time", value: exifData.privacy.hasDateTime, icon: Clock },
                        { label: "Camera Info", value: exifData.privacy.hasCameraInfo, icon: Camera },
                        { label: "Software Info", value: exifData.privacy.hasSoftwareInfo, icon: Settings },
                        { label: "Artist Info", value: exifData.privacy.hasArtistInfo, icon: User },
                        { label: "Copyright Info", value: exifData.privacy.hasCopyrightInfo, icon: Copyright }
                      ].map((check, index) => {
                        const IconComponent = check.icon;
                        return (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-4 w-4" />
                              <span>{check.label}</span>
                            </div>
                            {check.value ? (
                              <CheckCircle className="h-4 w-4 text-red-500" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Recommendations</h4>
                    <div className="space-y-1">
                      {exifData.privacy.recommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <AlertCircle className="h-3 w-3 text-yellow-500 mt-0.5" />
                          <span>{recommendation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Camera Information */}
          <Card>
            <CardHeader>
              <CardTitle>Camera Information</CardTitle>
              <CardDescription>Camera make, model, and software details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Make</Label>
                  <p className="font-mono text-sm">{exifData.camera.make || "N/A"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Model</Label>
                  <p className="font-mono text-sm">{exifData.camera.model || "N/A"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Software</Label>
                  <p className="font-mono text-sm">{exifData.camera.software || "N/A"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Artist</Label>
                  <p className="font-mono text-sm">{exifData.camera.artist || "N/A"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Copyright</Label>
                  <p className="font-mono text-sm">{exifData.camera.copyright || "N/A"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Date/Time</Label>
                  <p className="font-mono text-sm">{formatDateTime(exifData.camera.dateTime || "")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Information */}
          <Card>
            <CardHeader>
              <CardTitle>Technical Information</CardTitle>
              <CardDescription>Camera settings and technical parameters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Exposure Time</Label>
                  <p className="font-mono text-sm">
                    {exifData.technical.exposureTime ? formatExposureTime(exifData.technical.exposureTime) : "N/A"}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Aperture</Label>
                  <p className="font-mono text-sm">
                    {exifData.technical.fNumber ? formatFNumber(exifData.technical.fNumber) : "N/A"}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">ISO</Label>
                  <p className="font-mono text-sm">
                    {exifData.technical.iso ? formatISO(exifData.technical.iso) : "N/A"}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Focal Length</Label>
                  <p className="font-mono text-sm">
                    {exifData.technical.focalLength ? formatFocalLength(exifData.technical.focalLength) : "N/A"}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Flash</Label>
                  <p className="font-mono text-sm">{exifData.technical.flash || "N/A"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">White Balance</Label>
                  <p className="font-mono text-sm">{exifData.technical.whiteBalance || "N/A"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Metering Mode</Label>
                  <p className="font-mono text-sm">{exifData.technical.meteringMode || "N/A"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Exposure Mode</Label>
                  <p className="font-mono text-sm">{exifData.technical.exposureMode || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* GPS Information */}
          {exifData.gps.latitude && exifData.gps.longitude && (
            <Card>
              <CardHeader>
                <CardTitle>GPS Information</CardTitle>
                <CardDescription>Location data and GPS coordinates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Coordinates</Label>
                    <p className="font-mono text-sm">
                      {formatGPS(exifData.gps.latitude, exifData.gps.longitude)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Altitude</Label>
                    <p className="font-mono text-sm">
                      {exifData.gps.altitude ? `${exifData.gps.altitude}m` : "N/A"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Speed</Label>
                    <p className="font-mono text-sm">
                      {exifData.gps.speed ? `${exifData.gps.speed} km/h` : "N/A"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Direction</Label>
                    <p className="font-mono text-sm">
                      {exifData.gps.track ? `${exifData.gps.track}°` : "N/A"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">GPS Time</Label>
                    <p className="font-mono text-sm">
                      {exifData.gps.timeStamp || "N/A"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Map Datum</Label>
                    <p className="font-mono text-sm">
                      {exifData.gps.mapDatum || "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Image Information */}
          <Card>
            <CardHeader>
              <CardTitle>Image Information</CardTitle>
              <CardDescription>Image dimensions, resolution, and format details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Dimensions</Label>
                  <p className="font-mono text-sm">
                    {exifData.image.width && exifData.image.height 
                      ? `${exifData.image.width} × ${exifData.image.height}` 
                      : "N/A"}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Resolution</Label>
                  <p className="font-mono text-sm">
                    {exifData.image.resolution && exifData.image.resolution.x && exifData.image.resolution.y
                      ? `${exifData.image.resolution.x} × ${exifData.image.resolution.y}` 
                      : "N/A"}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Color Space</Label>
                  <p className="font-mono text-sm">
                    {exifData.image.colorSpace !== undefined 
                      ? (exifData.image.colorSpace === 1 ? "sRGB" : `Color Space ${exifData.image.colorSpace}`)
                      : "N/A"}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Orientation</Label>
                  <p className="font-mono text-sm">
                    {exifData.image.orientation !== undefined 
                      ? (exifData.image.orientation === 1 ? "Normal" : `Orientation ${exifData.image.orientation}`)
                      : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* EXIF Tips */}
      <Card>
        <CardHeader>
          <CardTitle>EXIF Data Tips</CardTitle>
          <CardDescription>Understanding EXIF metadata and privacy considerations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-medium">Privacy Considerations</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• GPS coordinates reveal exact location</li>
                <li>• Date/time can reveal when photo was taken</li>
                <li>• Camera make/model can identify device</li>
                <li>• Software info reveals editing tools used</li>
                <li>• Artist/copyright info reveals ownership</li>
                <li>• Always review metadata before sharing</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">EXIF Data Types</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Camera settings (ISO, aperture, shutter speed)</li>
                <li>• GPS location and altitude data</li>
                <li>• Date and time information</li>
                <li>• Camera make, model, and software</li>
                <li>• Image dimensions and resolution</li>
                <li>• Color space and compression info</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-start gap-2">
              <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100 mb-1">Pro Tip</p>
                <p className="text-blue-700 dark:text-blue-300">
                  EXIF data can contain sensitive information. Always review and remove unnecessary metadata 
                  before sharing images publicly. Use image editing software or online tools to strip EXIF data 
                  when privacy is a concern.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EXIFInspector;
