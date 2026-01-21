import React from 'react';
import { cn } from "@/lib/utils";
import logoImage from "@/assets/autoseguro-dj-logo.png";

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ className, size = 'md' }: LogoProps) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14'
  };

  return (
    <img
      src={logoImage}
      alt="AutoseguroDJ S.A.S"
      className={cn("object-contain", sizeClasses[size], className)}
    />
  );
};

export default Logo;
