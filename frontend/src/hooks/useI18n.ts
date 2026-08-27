import { useState, useEffect, useCallback } from 'react';
import { t, getLanguage, setLanguage, toggleLanguage } from '../lib/i18n';
import type { Language } from '../lib/i18n';

/**
 * React hook for internationalization.
 * Automatically re-renders when language changes.
 */
export function useI18n() {
  const [lang, setLang] = useState<Language>(getLanguage());

  useEffect(() => {
    const handler = (e: Event) => {
      setLang((e as CustomEvent).detail as Language);
    };
    window.addEventListener('language-change', handler);
    return () => window.removeEventListener('language-change', handler);
  }, []);

  const changeLanguage = useCallback((newLang: Language) => {
    setLanguage(newLang);
  }, []);

  const toggle = useCallback(() => {
    toggleLanguage();
  }, []);

  return { t, lang, changeLanguage, toggleLanguage: toggle };
}
