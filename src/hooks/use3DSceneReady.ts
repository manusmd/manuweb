'use client';

import { useState, useEffect, useCallback } from 'react';

interface Use3DSceneReadyProps {
  sphereCount?: number;
  minLoadTime?: number;
}

export function use3DSceneReady({
  sphereCount = 3,
  minLoadTime = 1000,
}: Use3DSceneReadyProps = {}) {
  const [isSceneReady, setIsSceneReady] = useState(false);
  const [readySpheres, setReadySpheres] = useState(0);
  const [startTime] = useState(() => Date.now());

  const markSphereReady = useCallback(() => {
    setReadySpheres(prev => prev + 1);
  }, []);

  const resetScene = useCallback(() => {
    setIsSceneReady(false);
    setReadySpheres(0);
  }, []);

  useEffect(() => {
    if (readySpheres >= sphereCount) {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadTime - elapsed);

      const timer = setTimeout(() => {
        setIsSceneReady(true);
      }, remainingTime);

      return () => clearTimeout(timer);
    }
  }, [readySpheres, sphereCount, startTime, minLoadTime]);

  return {
    isSceneReady,
    markSphereReady,
    resetScene,
    progress: Math.min((readySpheres / sphereCount) * 100, 100),
  };
}
