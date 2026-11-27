import React, { useEffect } from 'react';
import { useAppState } from '@components/common/context/app.js';
/**
 * The theme keeps <html dir> on the store default (rtl) so the header/nav
 * never flip. Page CONTENT should still follow the request locale: set `dir`
 * on the content <main class="page-width"> — right in Arabic, left in
 * English — on every storefront page. Header/footer are outside <main> and
 * keep the global direction.
 */ export default function ContentDir() {
    const { locale } = useAppState();
    useEffect(()=>{
        const main = document.querySelector('main.page-width');
        if (!main) return;
        // The theme forces `direction: rtl` on main via `html[dir="rtl"] main`,
        // which beats the dir attribute — set the CSS property inline too.
        const dir = (locale || '').toLowerCase().startsWith('ar') ? 'rtl' : 'ltr';
        main.setAttribute('dir', dir);
        main.style.direction = dir;
        return ()=>{
            main.removeAttribute('dir');
            main.style.direction = '';
        };
    }, [
        locale
    ]);
    return null;
}
export const layout = {
    areaId: 'body',
    sortOrder: 100
};
