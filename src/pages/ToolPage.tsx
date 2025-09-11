import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code2, ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { SEOHead } from "@/components/SEOHead";
import { addToToolHistory } from "@/lib/toolHistory";
import { toolMetadata } from "@/lib/toolMetadata";
import { useMountLoading } from "@/hooks/useLoading";
import { ToolPageLoadingSkeleton } from "@/components/SkeletonComponents";
import { LazyToolComponent } from "@/components/LazyToolComponent";

// Tool components are now loaded lazily via LazyToolComponent

// Tool metadata is now imported from toolMetadata.ts

const ToolPage = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const navigate = useNavigate();

  // Get metadata for current tool
  const currentToolMetadata = toolId ? toolMetadata[toolId] : null;
  
  // Mount loading for tool page
  const isMounted = useMountLoading(300);

  // Scroll to top when component mounts or toolId changes
  useEffect(() => {
    // Scroll to top when accessing a tool
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    
    // Additional fallback for mobile devices
    setTimeout(() => {
      // Try multiple methods to ensure scroll to top works on all devices
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 100);
  }, [toolId]);

  // Track tool usage in history
  useEffect(() => {
    if (toolId && currentToolMetadata) {
      addToToolHistory(
        toolId,
        currentToolMetadata.name,
        currentToolMetadata.category
      );
    }
  }, [toolId, currentToolMetadata]);

  // Show loading skeleton while mounting
  if (!isMounted) {
    return <ToolPageLoadingSkeleton />;
  }

  if (!toolId) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Tools
                </Button>
                <div className="flex items-center gap-2">
                  <Code2 className="h-6 w-6 text-primary" />
                  <h1 className="text-xl font-bold">DevTools Hub</h1>
                </div>
              </div>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Tool Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The tool you're looking for doesn't exist or has been moved.
            </p>
            <Button onClick={() => navigate('/')}>
              Go to Homepage
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={currentToolMetadata?.title}
        description={currentToolMetadata?.description}
        canonical={`https://devtools.hemelo.fyi/tools/${toolId}`}
      />
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Tools
              </Button>
              <div className="flex items-center gap-2">
                <Code2 className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">DevTools Hub</h1>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <LazyToolComponent toolId={toolId} />
      </main>
    </div>
  );
};

export default ToolPage;
