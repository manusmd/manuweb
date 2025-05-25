'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';

interface EasterEggHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EasterEggHelp({ isOpen, onClose }: EasterEggHelpProps) {
  const t = useTranslations('easterEggs.help');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-background border border-border rounded-xl p-6 w-full max-w-2xl shadow-2xl max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎮</span>
                <h2 className="text-2xl font-bold tracking-tight">{t('title')}</h2>
              </div>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid gap-4">
                {/* Keyboard Shortcuts */}
                <div className="bg-muted/50 rounded-lg p-4 border">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    {t('keyboardShortcuts.title')}
                  </h3>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono bg-background px-2 py-1 rounded border text-sm">
                        D
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {t('keyboardShortcuts.developerMode')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono bg-background px-2 py-1 rounded border text-sm">
                        C
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {t('keyboardShortcuts.confetti')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono bg-background px-2 py-1 rounded border text-sm">
                        R
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {t('keyboardShortcuts.reset')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono bg-background px-2 py-1 rounded border text-sm">
                        A
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {t('keyboardShortcuts.help')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mouse Actions */}
                <div className="bg-muted/50 rounded-lg p-4 border">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    {t('mouseActions.title')}
                  </h3>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t('mouseActions.tripleClick')}</span>
                      <span className="text-sm text-muted-foreground">
                        {t('mouseActions.tripleClickDesc')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t('mouseActions.logoClick')}</span>
                      <span className="text-sm text-muted-foreground">
                        {t('mouseActions.logoClickDesc')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t('mouseActions.nameClick')}</span>
                      <span className="text-sm text-muted-foreground">
                        {t('mouseActions.nameClickDesc')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Games & Activities */}
                <div className="bg-muted/50 rounded-lg p-4 border">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    {t('gamesActivities.title')}
                  </h3>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t('gamesActivities.snakeGame')}</span>
                      <span className="text-sm text-muted-foreground">
                        {t('gamesActivities.snakeGameDesc')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{t('gamesActivities.bugHunt')}</span>
                      <span className="text-sm text-muted-foreground">
                        {t('gamesActivities.bugHuntDesc')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {t('gamesActivities.blogRewards')}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {t('gamesActivities.blogRewardsDesc')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pro Tips */}
                <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg p-4 border border-purple-500/20">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    {t('proTips.title')}
                  </h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>{t('proTips.tip1')}</p>
                    <p>{t('proTips.tip2')}</p>
                    <p>{t('proTips.tip3')}</p>
                    <p>{t('proTips.tip4')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t text-center">
              <p className="text-sm text-muted-foreground">{t('closeHint', { key: 'A' })}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
