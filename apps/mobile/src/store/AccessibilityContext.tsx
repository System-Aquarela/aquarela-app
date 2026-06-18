import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { storageService } from '../services/storage.service';

interface AccessibilitySettings {
  largeText: boolean;
  highContrast: boolean;
}

interface AccessibilityContextData extends AccessibilitySettings {
  setLargeText: (value: boolean) => void;
  setHighContrast: (value: boolean) => void;
}

const STORAGE_KEY = '@aquarela_accessibility';
const AccessibilityContext = createContext<AccessibilityContextData | null>(null);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>({ largeText: false, highContrast: false });

  useEffect(() => {
    storageService.getItem<AccessibilitySettings>(STORAGE_KEY).then(saved => saved && setSettings(saved));
  }, []);

  function update(changes: Partial<AccessibilitySettings>) {
    setSettings(current => {
      const next = { ...current, ...changes };
      storageService.setItem(STORAGE_KEY, next);
      return next;
    });
  }

  const value = useMemo(() => ({
    ...settings,
    setLargeText: (largeText: boolean) => update({ largeText }),
    setHighContrast: (highContrast: boolean) => update({ highContrast }),
  }), [settings]);

  return <AccessibilityContext.Provider value={value}>{children}</AccessibilityContext.Provider>;
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error('useAccessibility deve ser usado dentro de AccessibilityProvider.');
  return context;
}
