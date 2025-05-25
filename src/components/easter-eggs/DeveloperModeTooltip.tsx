'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Code } from 'lucide-react';
import { StyleInfo } from '../../types/easter-eggs';

interface DeveloperModeTooltipProps {
  styleInfo: StyleInfo | null;
  tooltipRef: React.RefObject<HTMLDivElement | null>;
}

export function DeveloperModeTooltip({ styleInfo, tooltipRef }: DeveloperModeTooltipProps) {
  return (
    <AnimatePresence>
      {styleInfo && (
        <motion.div
          ref={tooltipRef}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="dev-tooltip fixed z-[9999] pointer-events-none"
          style={{
            left: styleInfo.x,
            top: styleInfo.y,
          }}
        >
          <div className="bg-gray-900 text-green-400 p-3 rounded-lg shadow-2xl border border-green-500/30 max-w-xs font-mono text-xs">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-green-500/20">
              <Code className="w-4 h-4" />
              <span className="font-bold text-green-300">&lt;{styleInfo.tagName}&gt;</span>
            </div>
            
            {styleInfo.className && (
              <div className="mb-2 pb-2 border-b border-green-500/20">
                <span className="text-blue-400">class:</span>
                <div className="text-yellow-300 break-all text-[10px] mt-1">
                  {styleInfo.className}
                </div>
              </div>
            )}

            <div className="space-y-1 max-h-48 overflow-y-auto">
              {Object.entries(styleInfo.styles).map(([property, value]) => (
                <div key={property} className="flex flex-col">
                  <span className="text-cyan-400">{property}:</span>
                  <span className="text-white ml-2 break-all text-[10px]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 