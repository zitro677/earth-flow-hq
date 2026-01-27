import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface VoiceIndicatorProps {
  isActive: boolean;
  type: 'recording' | 'speaking';
  className?: string;
}

export function VoiceIndicator({ isActive, type, className }: VoiceIndicatorProps) {
  if (!isActive) return null;

  const bars = [0, 1, 2, 3, 4];
  const baseColor = type === 'recording' ? 'bg-destructive' : 'bg-primary';

  return (
    <div className={cn("flex items-center gap-0.5 h-4", className)}>
      {bars.map((i) => (
        <motion.div
          key={i}
          className={cn("w-1 rounded-full", baseColor)}
          initial={{ height: 4 }}
          animate={{
            height: [4, 12, 6, 14, 4],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
