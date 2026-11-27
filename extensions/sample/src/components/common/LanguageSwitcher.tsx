import { useAppState } from '@components/common/context/app.js';
import { switchLocalePath } from '@evershop/evershop/lib/locale/localeResolution';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import React, { useState, useRef, useEffect } from 'react';

/** Native display name for a locale code, falling back to the upper-cased code. */
function localeLabel(code: string): string {
  try {
    return new Intl.DisplayNames([code], { type: 'language' }).of(code) ?? code;
  } catch {
    return code.toUpperCase();
  }
}

/**
 * Custom language switcher dropdown with proper styling and language icon.
 * Replaces the native select for better UI/UX.
 */
export default function LanguageSwitcher(): React.ReactElement | null {
  const {
    availableLocales = [],
    locale = '',
    defaultLocale = ''
  } = useAppState();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (availableLocales.length < 2) {
    return null;
  }

  const handleLocaleChange = (targetLocale: string) => {
    if (targetLocale === locale) {
      setIsOpen(false);
      return;
    }
    window.location.href =
      switchLocalePath(
        window.location.pathname,
        targetLocale,
        defaultLocale,
        availableLocales
      ) + window.location.search;
  };

  const currentLabel = localeLabel(locale);

  return (
    <div
      ref={dropdownRef}
      className="language-switcher-wrapper"
    >
      <button
        className="language-switcher-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={_('Language')}
        aria-expanded={isOpen}
      >
        <span className="language-icon">🌐</span>
        <span className="language-label">{currentLabel}</span>
        <span className={`language-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="language-dropdown">
          {availableLocales.map((code) => (
            <button
              key={code}
              className={`language-option ${code === locale ? 'active' : ''}`}
              onClick={() => handleLocaleChange(code)}
            >
              <span className="language-option-label">{localeLabel(code)}</span>
              {code === locale && <span className="language-option-check">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
