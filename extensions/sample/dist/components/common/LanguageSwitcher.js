import { useAppState } from '@components/common/context/app.js';
import { switchLocalePath } from '@evershop/evershop/lib/locale/localeResolution';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import React, { useState, useRef, useEffect } from 'react';
/** Native display name for a locale code, falling back to the upper-cased code. */ function localeLabel(code) {
    try {
        return new Intl.DisplayNames([
            code
        ], {
            type: 'language'
        }).of(code) ?? code;
    } catch  {
        return code.toUpperCase();
    }
}
/**
 * Custom language switcher dropdown with proper styling and language icon.
 * Replaces the native select for better UI/UX.
 */ export default function LanguageSwitcher() {
    const { availableLocales = [], locale = '', defaultLocale = '' } = useAppState();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    // Close dropdown when clicking outside
    useEffect(()=>{
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return ()=>document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    if (availableLocales.length < 2) {
        return null;
    }
    const handleLocaleChange = (targetLocale)=>{
        if (targetLocale === locale) {
            setIsOpen(false);
            return;
        }
        window.location.href = switchLocalePath(window.location.pathname, targetLocale, defaultLocale, availableLocales) + window.location.search;
    };
    const currentLabel = localeLabel(locale);
    return /*#__PURE__*/ React.createElement("div", {
        ref: dropdownRef,
        className: "language-switcher-wrapper"
    }, /*#__PURE__*/ React.createElement("button", {
        className: "language-switcher-button",
        onClick: ()=>setIsOpen(!isOpen),
        "aria-label": _('Language'),
        "aria-expanded": isOpen
    }, /*#__PURE__*/ React.createElement("span", {
        className: "language-icon"
    }, "🌐"), /*#__PURE__*/ React.createElement("span", {
        className: "language-label"
    }, currentLabel), /*#__PURE__*/ React.createElement("span", {
        className: `language-arrow ${isOpen ? 'open' : ''}`
    }, "▼")), isOpen && /*#__PURE__*/ React.createElement("div", {
        className: "language-dropdown"
    }, availableLocales.map((code)=>/*#__PURE__*/ React.createElement("button", {
            key: code,
            className: `language-option ${code === locale ? 'active' : ''}`,
            onClick: ()=>handleLocaleChange(code)
        }, /*#__PURE__*/ React.createElement("span", {
            className: "language-option-label"
        }, localeLabel(code)), code === locale && /*#__PURE__*/ React.createElement("span", {
            className: "language-option-check"
        }, "✓")))));
}
