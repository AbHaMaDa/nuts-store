import { v4 as uuidv4 } from 'uuid';
import { getActiveLocale } from '@evershop/evershop/lib/locale/localeContext';
/** Active storefront locale ('ar', 'en', ...), defaulting to 'en'. */ export function activeLocale() {
    return getActiveLocale() || 'en';
}
/**
 * Pick the translation for the active locale out of a `{ "ar": ..., "en": ... }`
 * JSONB map. Falls back to the base subtag ('ar-SA' → 'ar'), then to any
 * non-empty translation, then to the legacy single-language column.
 */ export function localizedText(i18n, legacy) {
    const map = (i18n && typeof i18n === 'object' ? i18n : {}) || {};
    const locale = activeLocale();
    const base = locale.split(/[-_]/)[0];
    const pick = (key)=>{
        const v = map[key];
        return typeof v === 'string' && v.trim() !== '' ? v : undefined;
    };
    const legacyText = typeof legacy === 'string' && legacy.trim() !== '' ? legacy : undefined;
    return pick(locale) || pick(base) || legacyText || Object.values(map).find((v)=>typeof v === 'string' && v.trim() !== '') || legacy || '';
}
/** Wrap a plain string/HTML fragment into the EditorJS block shape the
 * storefront description renderer expects (same shape core uses for
 * non-JSON legacy descriptions). */ export function rawHtmlBlocks(html) {
    const rowId = `r__${uuidv4()}`;
    return [
        {
            size: 1,
            id: rowId,
            columns: [
                {
                    id: 'c__c5d90067-c786-4324-8e24-8e30520ac3d7',
                    size: 1,
                    data: {
                        time: 1723347125344,
                        blocks: [
                            {
                                id: 'AU89ItzUa7',
                                type: 'raw',
                                data: {
                                    html
                                }
                            }
                        ],
                        version: '2.30.2'
                    }
                }
            ]
        }
    ];
}
/** Parse the legacy `description` column (EditorJS JSON string, or raw text). */ export function legacyDescriptionBlocks(description) {
    if (!description) {
        return [];
    }
    try {
        return JSON.parse(description);
    } catch (e) {
        return rawHtmlBlocks(description);
    }
}
/**
 * Resolve a product/category `description` for the active locale:
 *  1. description_i18n ->> locale (string → raw HTML block, array → blocks)
 *  2. legacy `description` column (JSON blocks or raw HTML)
 */ export function localizedDescription(i18n, legacyDescription) {
    const map = (i18n && typeof i18n === 'object' ? i18n : {}) || {};
    const locale = activeLocale();
    const base = locale.split(/[-_]/)[0];
    const value = map[locale] ?? map[base];
    if (Array.isArray(value) && value.length > 0) {
        return value;
    }
    if (typeof value === 'string' && value.trim() !== '') {
        return rawHtmlBlocks(value);
    }
    return legacyDescriptionBlocks(legacyDescription);
}
