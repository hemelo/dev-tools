import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ShimmerEffect } from "./LoadingAnimations";

// Tool card skeleton
export const ToolCardSkeleton = () => (
  <Card className="hover:shadow-xl transition-all duration-300 relative overflow-hidden">
    <ShimmerEffect className="absolute inset-0" />
    <CardHeader>
      <div className="flex items-start justify-between mb-2">
        <div className="p-3 rounded-xl bg-muted">
          <Skeleton className="h-6 w-6" />
        </div>
        <div className="flex flex-col gap-1 items-end">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-10 w-full rounded-lg" />
    </CardContent>
  </Card>
);

// Tool grid skeleton
export const ToolGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <ToolCardSkeleton key={index} />
    ))}
  </div>
);

// Recently used tools skeleton
export const RecentlyUsedToolsSkeleton = () => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border">
            <Skeleton className="h-8 w-16 rounded-r-none" />
            <Skeleton className="h-8 w-20 rounded-l-none" />
          </div>
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
      <Skeleton className="h-4 w-48" />
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-12 rounded-full" />
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-12" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

// Search bar skeleton
export const SearchBarSkeleton = () => (
  <div className="relative mb-4">
    <Skeleton className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" />
    <Skeleton className="h-12 w-full rounded-xl" />
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
      <Skeleton className="h-6 w-12" />
    </div>
  </div>
);

// Category buttons skeleton
export const CategoryButtonsSkeleton = () => (
  <div className="flex flex-wrap gap-2 justify-center items-center">
    {Array.from({ length: 8 }).map((_, index) => (
      <Skeleton key={index} className="h-10 w-20 rounded-full" />
    ))}
  </div>
);

// Hero section skeleton
export const HeroSectionSkeleton = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
      <div className="flex items-center justify-center gap-4 mb-8">
        <Skeleton className="p-3 rounded-2xl h-18 w-18" />
        <Skeleton className="h-16 w-80" />
      </div>
      
      <Skeleton className="h-8 w-3/4 mx-auto mb-8" />
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
        <Skeleton className="h-14 w-40 rounded-xl" />
        <Skeleton className="h-14 w-32 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
        <div className="text-center">
          <Skeleton className="h-8 w-16 mx-auto mb-2" />
          <Skeleton className="h-4 w-24 mx-auto" />
        </div>
        <div className="text-center">
          <Skeleton className="h-8 w-16 mx-auto mb-2" />
          <Skeleton className="h-4 w-24 mx-auto" />
        </div>
        <div className="text-center">
          <Skeleton className="h-8 w-16 mx-auto mb-2" />
          <Skeleton className="h-4 w-24 mx-auto" />
        </div>
      </div>
    </div>
  </section>
);

// Benefits section skeleton
export const BenefitsSectionSkeleton = () => (
  <section className="py-20 bg-gradient-to-b from-background to-card/50">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <Skeleton className="h-10 w-80 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="text-center p-8">
            <Skeleton className="p-4 rounded-full w-16 h-16 mx-auto mb-6" />
            <Skeleton className="h-6 w-32 mx-auto mb-3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
          </Card>
        ))}
      </div>
    </div>
  </section>
);

// Tool page loading skeleton
export const ToolPageLoadingSkeleton = () => (
  <div className="min-h-screen bg-background">
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-32" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-6 w-32" />
            </div>
          </div>
        </div>
      </div>
    </header>
    <main className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="mt-8">
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
      </div>
    </main>
  </div>
);
