import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles } from 'lucide-react';

// Animated loading spinner
export const AnimatedLoader = ({ 
  size = 24, 
  className = '' 
}: { 
  size?: number; 
  className?: string; 
}) => (
  <motion.div
    className={`flex items-center justify-center ${className}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <Loader2 size={size} className="text-primary" />
    </motion.div>
  </motion.div>
);

// Pulsing dots animation
export const PulsingDots = ({ 
  count = 3, 
  className = '' 
}: { 
  count?: number; 
  className?: string; 
}) => (
  <div className={`flex items-center gap-1 ${className}`}>
    {Array.from({ length: count }).map((_, index) => (
      <motion.div
        key={index}
        className="w-2 h-2 bg-primary rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: index * 0.2,
        }}
      />
    ))}
  </div>
);

// Shimmer effect for skeleton loading
export const ShimmerEffect = ({ 
  className = '' 
}: { 
  className?: string; 
}) => (
  <div className={`relative overflow-hidden ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
  </div>
);

// Fade in animation for content
export const FadeIn = ({ 
  children, 
  delay = 0, 
  duration = 0.5,
  className = ''
}: { 
  children: React.ReactNode; 
  delay?: number; 
  duration?: number;
  className?: string;
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration }}
  >
    {children}
  </motion.div>
);

// Stagger animation for lists
export const StaggerContainer = ({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) => (
  <motion.div
    className={className}
    initial="hidden"
    animate="visible"
    variants={{
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1
        }
      }
    }}
  >
    {children}
  </motion.div>
);

// Stagger item for individual elements
export const StaggerItem = ({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) => (
  <motion.div
    className={className}
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }}
  >
    {children}
  </motion.div>
);

// Loading overlay with animation
export const AnimatedLoadingOverlay = ({ 
  isLoading, 
  children, 
  message = "Loading...",
  className = ''
}: {
  isLoading: boolean;
  children: React.ReactNode;
  message?: string;
  className?: string;
}) => (
  <div className={`relative ${className}`}>
    {children}
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <AnimatedLoader size={32} />
            <motion.p
              className="text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {message}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// Page transition animation
export const PageTransition = ({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

// Tool card hover animation
export const AnimatedToolCard = ({ 
  children, 
  className = '' 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) => (
  <motion.div
    className={className}
    whileHover={{ 
      y: -4,
      transition: { duration: 0.2 }
    }}
    whileTap={{ scale: 0.98 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

// Sparkle loading animation
export const SparkleLoader = ({ 
  message = "Loading...",
  className = ''
}: {
  message?: string;
  className?: string;
}) => (
  <motion.div
    className={`flex flex-col items-center gap-4 ${className}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <Sparkles className="h-8 w-8 text-primary" />
    </motion.div>
    <motion.p
      className="text-sm text-muted-foreground"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      {message}
    </motion.p>
  </motion.div>
);

// Progress bar animation
export const AnimatedProgressBar = ({ 
  progress, 
  className = '' 
}: { 
  progress: number; 
  className?: string; 
}) => (
  <div className={`w-full bg-muted rounded-full h-2 ${className}`}>
    <motion.div
      className="h-2 bg-primary rounded-full"
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    />
  </div>
);

