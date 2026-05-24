'use client';

import type { ExperienceEntry } from '@/types/experience';
import { useTranslations } from 'next-intl';

interface TimelineBottomNavProps {
  visible: boolean;
  currentPanel: number;
  experiences: ExperienceEntry[];
  onNavigatePanel: (index: number) => void;
}

export function TimelineBottomNav({
  visible,
  currentPanel,
  experiences,
  onNavigatePanel,
}: TimelineBottomNavProps) {
  const ta = useTranslations('about.timelineDesktopNav');

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="relative">
        <div className="bg-black/95 backdrop-blur-xl rounded-2xl px-6 py-3 border border-gray-600/30 shadow-2xl shadow-black/50 transition-all duration-500 hover:shadow-3xl hover:shadow-blue-500/20 hover:border-gray-500/50">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-600/10 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

          <div className="relative z-10">
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-center space-y-1 group">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => onNavigatePanel(0)}
                    className={`relative w-3 h-3 rounded-full transition-all duration-500 transform hover:scale-125 ${
                      currentPanel === 0
                        ? 'bg-gradient-to-r from-blue-400 to-purple-400 shadow-lg shadow-blue-400/50 scale-110'
                        : 'bg-gray-500 hover:bg-gray-400 hover:shadow-md hover:shadow-gray-400/30'
                    }`}
                    title={ta('introTooltip')}
                  >
                    {currentPanel === 0 && (
                      <div className="absolute inset-0 rounded-full border border-blue-400/50 animate-ping"></div>
                    )}
                    <div className="absolute inset-0 rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-150"></div>
                  </button>
                </div>
                <span
                  className={`text-[10px] font-medium transition-all duration-300 ${
                    currentPanel === 0
                      ? 'text-blue-300 font-semibold transform scale-105'
                      : 'text-gray-400 group-hover:text-gray-300'
                  }`}
                >
                  {ta('introShort')}
                </span>
              </div>

              <div className="relative h-px w-6">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-500"></div>
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-700 ${
                    currentPanel > 0 ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                  }`}
                ></div>
              </div>

              {experiences.map((exp, index) => (
                <div key={exp.company + exp.date} className="flex items-center space-x-4">
                  <div className="flex flex-col items-center space-y-1 group">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => onNavigatePanel(index + 1)}
                        className={`relative w-3 h-3 rounded-full transition-all duration-500 transform hover:scale-125 ${
                          currentPanel === index + 1
                            ? 'bg-gradient-to-r from-blue-400 to-purple-400 shadow-lg shadow-blue-400/50 scale-110'
                            : 'bg-gray-500 hover:bg-gray-400 hover:shadow-md hover:shadow-gray-400/30'
                        }`}
                        title={exp.company}
                      >
                        {currentPanel === index + 1 && (
                          <div className="absolute inset-0 rounded-full border border-blue-400/50 animate-ping"></div>
                        )}
                        <div className="absolute inset-0 rounded-full border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-150"></div>

                        {currentPanel === index + 1 && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </button>
                    </div>
                    <span
                      className={`text-[10px] font-medium transition-all duration-300 whitespace-nowrap ${
                        currentPanel === index + 1
                          ? 'text-blue-300 font-semibold transform scale-105'
                          : 'text-gray-400 group-hover:text-gray-300'
                      }`}
                    >
                      {exp.company.split(' ')[0]}
                    </span>
                  </div>

                  {index < experiences.length - 1 && (
                    <div className="relative h-px w-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-500"></div>
                      <div
                        className={`absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-700 delay-${(index + 1) * 100} ${
                          currentPanel > index + 1
                            ? 'opacity-100 scale-x-100'
                            : 'opacity-0 scale-x-0'
                        }`}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-3 flex justify-center">
              <div className="relative h-1 w-24 bg-gray-800 rounded-full overflow-hidden shadow-inner">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-800"></div>

                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 rounded-full transition-all duration-700 ease-out shadow-lg shadow-blue-400/30"
                  style={{
                    width: `${((currentPanel + 1) / (experiences.length + 1)) * 100}%`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full animate-pulse"></div>
                </div>

                <div
                  className="absolute top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-lg transition-all duration-700 ease-out"
                  style={{
                    left: `calc(${((currentPanel + 1) / (experiences.length + 1)) * 100}% - 4px)`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="text-center mt-2">
              <div className="relative overflow-hidden">
                <span className="inline-block text-xs text-gray-200 font-semibold transition-all duration-500 transform">
                  {currentPanel === 0
                    ? ta('introTooltip')
                    : `${experiences[currentPanel - 1]?.company ?? ''}`}
                </span>
                {currentPanel > 0 && (
                  <span className="text-[10px] text-gray-400 ml-1 transition-all duration-500">
                    • {experiences[currentPanel - 1]?.date ?? ''}
                  </span>
                )}
              </div>

              <div className="mt-1 flex justify-center">
                <div className="h-0.5 w-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-500 transform scale-x-100 opacity-100"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <div
              key={`spark-${String(i)}`}
              className="absolute w-0.5 h-0.5 bg-blue-400/30 rounded-full animate-ping"
              style={{
                left: `${25 + i * 20}%`,
                top: `${15 + (i % 2) * 70}%`,
                animationDelay: `${i * 0.7}s`,
                animationDuration: '3s',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
