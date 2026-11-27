import LanguageSwitcher from '../../../components/common/LanguageSwitcher.js';
import React from 'react';

/**
 * Custom language switcher with better styling and language icon.
 * Overrides the core component to use our custom dropdown.
 */
export default function HeaderLanguageSwitcher(): React.ReactElement | null {
  return <LanguageSwitcher />;
}

export const layout = {
  areaId: 'headerMiddleLeft',
  sortOrder: 1
};
