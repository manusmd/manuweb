'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface EasterEggHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EasterEggHelp({ isOpen, onClose }: EasterEggHelpProps) {
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
                <h2 className="text-2xl font-bold tracking-tight">Easter Egg Guide</h2>
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
                    ⌨️ Keyboard Shortcuts
                  </h3>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono bg-background px-2 py-1 rounded border text-sm">
                        D
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Toggle Developer Mode (CSS Inspector)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono bg-background px-2 py-1 rounded border text-sm">
                        C
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Colorful Confetti Burst
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono bg-background px-2 py-1 rounded border text-sm">
                        R
                      </span>
                      <span className="text-sm text-muted-foreground">Reset All Easter Eggs</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono bg-background px-2 py-1 rounded border text-sm">
                        A
                      </span>
                      <span className="text-sm text-muted-foreground">Show This Help Guide</span>
                    </div>
                  </div>
                </div>

                {/* Mouse Actions */}
                <div className="bg-muted/50 rounded-lg p-4 border">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    🖱️ Mouse Actions
                  </h3>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Triple Click Anywhere</span>
                      <span className="text-sm text-muted-foreground">
                        Floating Hearts Animation
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Click Logo (10x)</span>
                      <span className="text-sm text-muted-foreground">
                        Golden Confetti Celebration
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Click Name in Hero</span>
                      <span className="text-sm text-muted-foreground">Start Bug Hunt Game</span>
                    </div>
                  </div>
                </div>

                {/* Games & Activities */}
                <div className="bg-muted/50 rounded-lg p-4 border">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    🎯 Games & Activities
                  </h3>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Portfolio Snake Game</span>
                      <span className="text-sm text-muted-foreground">
                        Click game button or complete first blog
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Bug Hunt Game</span>
                      <span className="text-sm text-muted-foreground">
                        Find 10 hidden bugs across the site
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Blog Reading Rewards</span>
                      <span className="text-sm text-muted-foreground">
                        Complete reading any blog post
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pro Tips */}
                <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg p-4 border border-purple-500/20">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    💡 Pro Tips
                  </h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Developer mode shows CSS properties when hovering over elements</p>
                    <p>• Bug hunt progress is saved - you can continue later</p>
                    <p>• Some easter eggs unlock others - explore to find them all!</p>
                    <p>• Press 'R' to reset everything and start fresh</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t text-center">
              <p className="text-sm text-muted-foreground">
                Press <kbd className="font-mono bg-muted px-2 py-1 rounded text-xs">A</kbd> again
                to close this guide
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 