'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Code } from 'lucide-react';

interface DeveloperModeIndicatorProps {
  isDeveloperMode: boolean;
}

export function DeveloperModeIndicator({ isDeveloperMode }: DeveloperModeIndicatorProps) {
  return (
    <>
      <AnimatePresence>
        {isDeveloperMode && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            className="fixed bottom-4 left-4 z-40 bg-black/80 text-green-400 px-3 py-2 rounded-md text-sm font-mono"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>DEV_MODE</span>
              <Code className="w-4 h-4 ml-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global CSS for developer mode effects */}
      <style jsx global>{`
        @keyframes rainbow {
          0% {
            filter: hue-rotate(0deg);
          }
          100% {
            filter: hue-rotate(360deg);
          }
        }

        .developer-mode-active * {
          transition: all 0.3s ease;
        }

        .developer-mode-active *:hover {
          animation: rainbow 2s linear infinite;
          outline: 2px dashed #00ff00;
          outline-offset: 2px;
        }
      `}</style>
    </>
  );
} 