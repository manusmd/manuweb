'use client';

import { useState, useEffect, useRef } from 'react';
import { StyleInfo } from '../types/easter-eggs';

export function useDeveloperModeInspector(isDeveloperMode: boolean) {
  const [styleInfo, setStyleInfo] = useState<StyleInfo | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDeveloperMode) {
      setStyleInfo(null);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || target.closest('.dev-tooltip')) return;

      const computedStyles = window.getComputedStyle(target);

      // Get the most relevant CSS properties
      const relevantStyles = {
        display: computedStyles.display,
        position: computedStyles.position,
        width: computedStyles.width,
        height: computedStyles.height,
        padding: computedStyles.padding,
        margin: computedStyles.margin,
        background: computedStyles.backgroundColor,
        color: computedStyles.color,
        'font-size': computedStyles.fontSize,
        'font-weight': computedStyles.fontWeight,
        border: computedStyles.border,
        'border-radius': computedStyles.borderRadius,
        'z-index': computedStyles.zIndex,
        opacity: computedStyles.opacity,
        transform: computedStyles.transform,
      };

      // Filter out default/empty values
      const filteredStyles: { [key: string]: string } = {};
      Object.entries(relevantStyles).forEach(([key, value]) => {
        if (
          value &&
          value !== 'none' &&
          value !== 'auto' &&
          value !== 'normal' &&
          value !== 'rgba(0, 0, 0, 0)'
        ) {
          filteredStyles[key] = value;
        }
      });

      // Handle className properly for both HTML and SVG elements
      let className = '';
      if (target instanceof SVGElement) {
        className = target.className.baseVal || '';
      } else {
        className = target.className || '';
      }

      // Smart positioning logic with actual tooltip dimensions
      let tooltipWidth = 320;
      let tooltipHeight = 250;

      if (tooltipRef.current) {
        const rect = tooltipRef.current.getBoundingClientRect();
        tooltipWidth = rect.width || 320;
        tooltipHeight = rect.height || 250;
      }

      const offset = 2;
      const margin = 2;

      // Calculate available space in each direction
      const spaceRight = window.innerWidth - e.clientX;
      const spaceLeft = e.clientX;
      const spaceBelow = window.innerHeight - e.clientY;
      const spaceAbove = e.clientY;

      let x, y;

      // Check if we're in a corner situation where we need to position diagonally
      const needsLeftPosition = spaceRight < tooltipWidth + offset + margin;
      const needsAbovePosition = spaceBelow < tooltipHeight + offset + margin;

      // Handle corner cases first
      if (needsLeftPosition && needsAbovePosition) {
        x = e.clientX - tooltipWidth - offset;
        y = e.clientY - tooltipHeight - offset;
      } else if (needsLeftPosition && spaceAbove < tooltipHeight + offset + margin) {
        x = e.clientX - tooltipWidth - offset;
        y = e.clientY + offset;
      } else if (spaceLeft < tooltipWidth + offset + margin && needsAbovePosition) {
        x = e.clientX + offset;
        y = e.clientY - tooltipHeight - offset;
      } else if (
        spaceLeft < tooltipWidth + offset + margin &&
        spaceAbove < tooltipHeight + offset + margin
      ) {
        x = e.clientX + offset;
        y = e.clientY + offset;
      } else {
        // Not in a corner, use standard positioning logic
        if (spaceRight >= tooltipWidth + offset + margin) {
          x = e.clientX + offset;
        } else if (spaceLeft >= tooltipWidth + offset + margin) {
          x = e.clientX - tooltipWidth - offset;
        } else {
          if (spaceRight > spaceLeft) {
            x = window.innerWidth - tooltipWidth - margin;
          } else {
            x = margin;
          }
        }

        if (spaceBelow >= tooltipHeight + offset + margin) {
          y = e.clientY + offset;
        } else if (spaceAbove >= tooltipHeight + offset + margin) {
          y = e.clientY - tooltipHeight - offset;
        } else {
          if (spaceBelow > spaceAbove) {
            y = window.innerHeight - tooltipHeight - margin;
          } else {
            y = margin;
          }
        }
      }

      // Final safety clamps
      x = Math.max(0, Math.min(x, window.innerWidth - tooltipWidth));
      y = Math.max(0, Math.min(y, window.innerHeight - tooltipHeight));

      setStyleInfo({
        x: x,
        y: y,
        tagName: target.tagName.toLowerCase(),
        className: className,
        styles: filteredStyles,
      });
    };

    const handleMouseLeave = () => {
      setStyleInfo(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isDeveloperMode]);

  return {
    styleInfo,
    tooltipRef,
    setStyleInfo,
  };
} 