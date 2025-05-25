'use client';

import { useState } from 'react';
import { EasterEggHelp } from './EasterEggHelp';
import { DeveloperModeTooltip } from './DeveloperModeTooltip';
import { NotificationSystem } from './NotificationSystem';
import { KeyboardEasterEggs } from './KeyboardEasterEggs';
import { MouseEasterEggs } from './MouseEasterEggs';
import { FloatingHearts } from './FloatingHearts';
import { DeveloperModeIndicator } from './DeveloperModeIndicator';
import { useNotifications } from '../../hooks/useNotifications';
import { useDeveloperModeInspector } from '../../hooks/useDeveloperModeInspector';
import { useFloatingHearts } from '../../hooks/useFloatingHearts';

export function SimpleEasterEggs() {
  const [isDeveloperMode, setIsDeveloperMode] = useState(false);
  const [showEasterEggHelp, setShowEasterEggHelp] = useState(false);

  // Custom hooks
  const { notifications, removeNotification, showEasterEggDiscovery, setNotifications } =
    useNotifications();

  const { styleInfo, tooltipRef, setStyleInfo } = useDeveloperModeInspector(isDeveloperMode);
  const { showHearts } = useFloatingHearts();

  return (
    <>
      {/* Floating Hearts Easter Egg */}
      <FloatingHearts showHearts={showHearts} />

      {/* Developer Mode Style Inspector Tooltip */}
      {isDeveloperMode && <DeveloperModeTooltip styleInfo={styleInfo} tooltipRef={tooltipRef} />}

      {/* Developer Mode Indicator */}
      <DeveloperModeIndicator isDeveloperMode={isDeveloperMode} />

      {/* Easter Egg Help Window */}
      <EasterEggHelp isOpen={showEasterEggHelp} onClose={() => setShowEasterEggHelp(false)} />

      {/* Notification System */}
      <NotificationSystem notifications={notifications} onRemoveNotification={removeNotification} />

      {/* Keyboard Easter Eggs */}
      <KeyboardEasterEggs
        isDeveloperMode={isDeveloperMode}
        setIsDeveloperMode={setIsDeveloperMode}
        setStyleInfo={setStyleInfo}
        showEasterEggHelp={showEasterEggHelp}
        setShowEasterEggHelp={setShowEasterEggHelp}
        setNotifications={setNotifications}
        showEasterEggDiscovery={showEasterEggDiscovery}
      />

      {/* Mouse Easter Eggs */}
      <MouseEasterEggs showEasterEggDiscovery={showEasterEggDiscovery} />
    </>
  );
}
