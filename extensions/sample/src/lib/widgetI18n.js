import {
  getActiveLocale,
  getLocaleContext
} from '@evershop/evershop/lib/locale/localeContext';

// Widget-builder text translations are stored inside widget_instance.settings
// under a reserved `_i18n` object: { "heading": {"ar": "..."}, "menus.0.name": {"ar": "..."} }
// Keys are dot-paths into the settings tree (array indices included).
const I18N_KEY = '_i18n';

function* walkLeaves(value, prefix = '') {
  if (value === null || typeof value !== 'object') return;
  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      yield* walkLeaves(
        value[index],
        prefix ? `${prefix}.${index}` : String(index)
      );
    }
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    if (key === I18N_KEY) continue;
    const path = prefix ? `${prefix}.${key}` : key;
    if (child !== null && typeof child === 'object') {
      yield* walkLeaves(child, path);
    } else {
      yield path;
    }
  }
}

function setAtPath(root, path, value) {
  const parts = path.split('.');
  let node = root;
  for (let i = 0; i < parts.length - 1; i += 1) {
    const key = parts[i];
    const nextKey = parts[i + 1];
    const child = node[key];
    if (child === null || typeof child !== 'object') {
      node[key] = /^\d+$/.test(nextKey) ? [] : {};
    }
    node = node[key];
  }
  node[parts[parts.length - 1]] = value;
}

/**
 * Returns a copy of `settings` with translatable leaves swapped for the
 * active locale's value when one exists in `settings._i18n`.
 */
export function applyWidgetI18n(settings) {
  if (!settings || typeof settings !== 'object') return settings;
  const i18n = settings[I18N_KEY];
  if (!i18n || typeof i18n !== 'object') return settings;

  const ctx = getLocaleContext();
  if (ctx?.isAdmin) return settings;
  const locale = getActiveLocale();
  const hasLocale = Object.values(i18n).some(
    (entry) => entry && typeof entry === 'object' && entry[locale]
  );
  if (!hasLocale) return settings;

  const result = { ...settings };
  let changed = false;
  for (const path of walkLeaves(settings)) {
    const entry = i18n[path];
    const translated = entry && typeof entry === 'object' ? entry[locale] : null;
    if (typeof translated === 'string' && translated !== '') {
      // First translation wins; subsequent locales fall through untouched.
      setAtPath(result, path, translated);
      changed = true;
    }
  }
  return changed ? result : settings;
}

function isWidgetInstanceSelect(text) {
  return (
    typeof text === 'string' &&
    /^\s*select/i.test(text) &&
    /widget_instance/i.test(text) &&
    /settings/i.test(text)
  );
}

function transformResult(result) {
  if (!result || !Array.isArray(result.rows)) return result;
  let touched = false;
  const rows = result.rows.map((row) => {
    if (!row || typeof row !== 'object' || !row.settings) return row;
    const settings = applyWidgetI18n(row.settings);
    if (settings === row.settings) return row;
    touched = true;
    return { ...row, settings };
  });
  return touched ? { ...result, rows } : result;
}

/**
 * Wraps pool.query so any SELECT touching widget_instance.settings has its
 * rows localized for the active request locale. Applies to storefront page
 * queries and the page-builder preview (changeset overlays are applied in JS
 * afterwards, so translated base settings flow through unchanged).
 */
export function installWidgetI18n(pool) {
  const original = pool.query.bind(pool);
  pool.query = function widgetI18nQuery(...args) {
    const maybeConfig = args[0];
    const text =
      typeof maybeConfig === 'string'
        ? maybeConfig
        : maybeConfig && typeof maybeConfig === 'object'
          ? maybeConfig.text
          : '';
    const result = original(...args);
    if (!isWidgetInstanceSelect(text)) return result;
    const maybePromise = result && typeof result.then === 'function';
    if (!maybePromise) return result;
    return result.then(transformResult);
  };
}

export { I18N_KEY };
