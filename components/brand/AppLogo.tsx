"use client";

import Image from "next/image";

type AppLogoProps = {
  className?: string;
  preload?: boolean;
  size?: number;
};

export function AppLogo({ className, preload = false, size = 48 }: AppLogoProps) {
  return (
    <Image
      src="/logo.svg"
      alt="PupiAgenda"
      width={size}
      height={size}
      preload={preload}
      className={className}
    />
  );
}
