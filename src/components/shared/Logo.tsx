import React from 'react';
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ className, size = 'md' }: LogoProps) => {
  const sizeClasses = {
    sm: 'w-24',
    md: 'w-32',
    lg: 'w-40'
  };

  return (
    <div className={cn("inline-block", sizeClasses[size], className)}>
      <AspectRatio ratio={16/9}>
        <img
          src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e"
          alt="Company Logo"
          className="object-contain w-full h-full"
        />
      </AspectRatio>
    </div>
  );
};

export default Logo;
