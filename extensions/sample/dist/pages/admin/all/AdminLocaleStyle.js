import React, { useEffect } from 'react';
import '../../../styles/admin.css';
const RTL_LOCALES = [
    'ar',
    'fa',
    'he',
    'ur'
];
function isRtlLocale() {
    const lang = (document.documentElement.lang || '').toLowerCase();
    return RTL_LOCALES.includes(lang.split(/[-_]/)[0]);
}
function applyDir() {
    document.documentElement.setAttribute('dir', isRtlLocale() ? 'rtl' : 'ltr');
}
function pinSettingsButton() {
    const nav = document.querySelector('.admin-navigation');
    const groups = document.querySelectorAll('.admin-nav .root-nav-item');
    const el = [
        ...groups
    ].find((g)=>g.querySelector('.root-label a[href*="setting"]')) || groups[groups.length - 1];
    if (!el) return;
    if (isRtlLocale()) {
        // رفع مستوى تكديس السايد بار بالكامل حتى لا يُحجب العنصر المثبت بداخله
        if (nav) {
            nav.style.setProperty('z-index', '1000', 'important');
        }
        el.style.setProperty('position', 'fixed', 'important');
        el.style.setProperty('bottom', '0px', 'important');
        el.style.setProperty('top', 'auto', 'important');
        el.style.setProperty('left', 'auto', 'important');
        el.style.setProperty('right', '0px', 'important');
        el.style.setProperty('width', '15rem', 'important');
        el.style.setProperty('background-color', '#ffffff', 'important');
        el.style.setProperty('border-top', '1px solid #e5e7eb', 'important');
        el.style.setProperty('border-left', '1px solid #e5e7eb', 'important');
        el.style.setProperty('padding', '0.85rem 0.75rem', 'important');
        el.style.setProperty('margin', '0', 'important');
        el.style.setProperty('z-index', '10000', 'important');
        el.style.setProperty('display', 'block', 'important');
        el.style.setProperty('visibility', 'visible', 'important');
        el.style.setProperty('opacity', '1', 'important');
    } else {
        if (nav) {
            nav.style.removeProperty('z-index');
        }
        [
            'position',
            'bottom',
            'top',
            'left',
            'right',
            'width',
            'background-color',
            'border-top',
            'border-left',
            'padding',
            'margin',
            'z-index',
            'display',
            'visibility',
            'opacity'
        ].forEach((p)=>el.style.removeProperty(p));
    }
}
export default function AdminLocaleStyle() {
    useEffect(()=>{
        const sync = ()=>{
            applyDir();
            pinSettingsButton();
        };
        sync();
        const observer = new MutationObserver(sync);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: [
                'lang'
            ],
            childList: true,
            subtree: true
        });
        return ()=>observer.disconnect();
    }, []);
    return null;
}
export const layout = {
    areaId: 'body',
    sortOrder: 1
};
