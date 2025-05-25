'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface DeveloperModeIndicatorProps {
  isDeveloperMode: boolean;
}

export function DeveloperModeIndicator({ isDeveloperMode }: DeveloperModeIndicatorProps) {
  const t = useTranslations('easterEggs.developerMode');

  return (
    <>
      {/* Developer Mode Indicator */}
      <AnimatePresence>
        {isDeveloperMode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-4 left-4 z-50 bg-green-500 text-black px-3 py-1 rounded-full text-sm font-bold shadow-lg"
          >
            {t('indicator')}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global CSS for developer mode */}
      {isDeveloperMode && (
        <style jsx global>{`
          * {
            outline: 1px solid rgba(0, 255, 0, 0.3) !important;
            outline-offset: -1px !important;
          }
          *:hover {
            outline: 2px solid rgba(0, 255, 0, 0.8) !important;
            outline-offset: -2px !important;
          }
        `}</style>
      )}
    </>
  );
}
