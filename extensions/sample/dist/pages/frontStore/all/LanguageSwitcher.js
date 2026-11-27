import LanguageSwitcher from '../../../components/common/LanguageSwitcher.js';
import React from 'react';
/**
 * Custom language switcher with better styling and language icon.
 * Overrides the core component to use our custom dropdown.
 */ export default function HeaderLanguageSwitcher() {
    return /*#__PURE__*/ React.createElement(LanguageSwitcher, null);
}
export const layout = {
    areaId: 'headerMiddleLeft',
    sortOrder: 1
};
