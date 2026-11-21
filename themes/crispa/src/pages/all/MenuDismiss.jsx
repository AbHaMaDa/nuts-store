import React, { useEffect } from 'react';

export default function MenuDismiss() {
  useEffect(() => {
    const closeIfOpen = () => {
      const panel = document.querySelector(
        '.evershop-basic-menu__mobile-panel'
      );
      if (!panel) return;
      const menu = panel.closest('.evershop-basic-menu');
      const toggle = menu?.querySelector('.evershop-basic-menu__toggle');
      if (toggle) toggle.click();
    };

    const onDown = (e) => {
      const panel = document.querySelector(
        '.evershop-basic-menu__mobile-panel'
      );
      if (!panel) return;
      const menu = panel.closest('.evershop-basic-menu');
      if (menu && !menu.contains(e.target)) {
        menu.querySelector('.evershop-basic-menu__toggle')?.click();
      }
    };

    const onKey = (e) => {
      if (e.key === 'Escape') closeIfOpen();
    };

    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown, { passive: true });
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return null;
}

export const layout = {
  areaId: 'headerBottom',
  sortOrder: 99
};
