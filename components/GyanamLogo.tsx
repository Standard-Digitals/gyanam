'use client';
import React from 'react';

interface GyanamLogoProps {
  className?: string;
}

export const GyanamLogo: React.FC<GyanamLogoProps> = ({ className = "w-24 h-24" }) => {
  return (
    <img src="/favicon.svg" alt="Gyanam" className={className} />
  );
};
