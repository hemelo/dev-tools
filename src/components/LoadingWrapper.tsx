import { ReactNode, useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface LoadingWrapperProps {
  isLoading: boolean;
  children: ReactNode;
  skeleton?: ReactNode;
  className?: string;
  showSpinner?: boolean;
  message?: string;
}

export const LoadingWrapper = ({
  isLoading,
  children,
  skeleton,
  className = '',
  showSpinner = false,
  message = 'Loading...'
}: LoadingWrapperProps) => {
  if (isLoading) {
    if (skeleton) {
      return <>{skeleton}</>;
    }

    if (showSpinner) {
      return (
        <div className={`flex items-center justify-center p-8 ${className}`}>
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        </div>
      );
    }

    return (
      <div className={className}>
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return <>{children}</>;
};

// Loading overlay component
interface LoadingOverlayProps {
  isLoading: boolean;
  children: ReactNode;
  message?: string;
  className?: string;
}

export const LoadingOverlay = ({
  isLoading,
  children,
  message = 'Loading...',
  className = ''
}: LoadingOverlayProps) => {
  return (
    <div className={`relative ${className}`}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">{message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// Progressive loading component
interface ProgressiveLoadingProps {
  isLoading: boolean;
  children: ReactNode;
  fallback: ReactNode;
  delay?: number;
  className?: string;
}

export const ProgressiveLoading = ({
  isLoading,
  children,
  fallback,
  delay = 0,
  className = ''
}: ProgressiveLoadingProps) => {
  const [showFallback, setShowFallback] = useState(true);

  useEffect(() => {
    if (isLoading) {
      setShowFallback(true);
      const timer = setTimeout(() => {
        setShowFallback(false);
      }, delay);

      return () => clearTimeout(timer);
    } else {
      setShowFallback(false);
    }
  }, [isLoading, delay]);

  return (
    <div className={className}>
      {isLoading && showFallback ? fallback : children}
    </div>
  );
};
