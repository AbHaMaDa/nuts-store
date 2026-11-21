import React, { useEffect } from 'react';
import '../../styles/custom.css';
const RTL_LOCALES = [
    'ar',
    'fa',
    'he',
    'ur'
];
function applyDir() {
    const lang = (document.documentElement.lang || '').toLowerCase();
    const base = lang.split(/[-_]/)[0];
    document.documentElement.setAttribute('dir', RTL_LOCALES.includes(base) ? 'rtl' : 'ltr');
}
export default function ThemeStyles() {
    useEffect(()=>{
        applyDir();
        const observer = new MutationObserver(applyDir);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: [
                'lang'
            ]
        });
        return ()=>observer.disconnect();
    }, []);
    return null;
}
export const layout = {
    areaId: 'head',
    sortOrder: 1
};
