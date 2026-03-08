"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

export interface AetherLogoProps {
  className?: string;
  /** "full" = symbol + AETHER text (default), "icon" = symbol only */
  variant?: "full" | "icon";
}

export function AetherLogo({ className, variant = "full" }: AetherLogoProps) {
  const id = useId();
  const gradId = `gradAether-${id.replace(/:/g, "")}`;

  return (
    <div
      className={cn(
        "aether-logo flex items-center flex-shrink-0 overflow-visible",
        variant === "icon" ? "aspect-square" : "aspect-[220/60]",
        className
      )}
    >
      <svg
        viewBox={variant === "icon" ? "0 0 60 60" : "0 0 220 60"}
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full object-contain"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        <defs>
          <linearGradient
            id={gradId}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#3BC9FF" />
            <stop offset="100%" stopColor="#6C63FF" />
          </linearGradient>
        </defs>
        {/* Orbital ring */}
        <circle
          className="aether-orbit"
          cx="30"
          cy="30"
          r="18"
          stroke={`url(#${gradId})`}
          strokeWidth="2"
          fill="none"
        />
        {/* AI core */}
        <circle
          className="aether-core"
          cx="30"
          cy="30"
          r="8"
          fill={`url(#${gradId})`}
        />
        {/* Glow */}
        <circle
          className="aether-glow"
          cx="30"
          cy="30"
          r="12"
          stroke={`url(#${gradId})`}
          strokeWidth="1"
          fill="none"
        />
        {variant === "full" && (
          <text
            x="70"
            y="36"
            fontFamily="Inter, sans-serif"
            fontSize="24"
            letterSpacing="4"
            fill="currentColor"
            className="font-semibold tracking-wider"
          >
            AETHER
          </text>
        )}
      </svg>
    </div>
  );
}
