import path from 'path';
import { pool } from '@evershop/evershop/lib/postgres';
import { addProcessor } from '@evershop/evershop/lib/util/registry';
import uniqid from 'uniqid';
import {
  applyWidgetI18n,
  installWidgetI18n
} from './lib/widgetI18n.js';
import { registerJob } from '@evershop/evershop/lib/cronjob';
import {
  hookBeforeUpdatePageData,
  hookAfterUpdatePageData,
  hookBeforeCreatePage,
  hookAfterCreatePage
} from '@evershop/evershop/cms/services';

// Content-i18n schema: per-language name/description on the *_description
// tables. Idempotent — safe to run on every boot.
const I18N_MIGRATION_SQL = `
ALTER TABLE product_description
  ADD COLUMN IF NOT EXISTS name_i18n JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE product_description
  ADD COLUMN IF NOT EXISTS description_i18n JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE category_description
  ADD COLUMN IF NOT EXISTS name_i18n JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE category_description
  ADD COLUMN IF NOT EXISTS description_i18n JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_product_description_name_i18n
  ON product_description USING GIN (name_i18n);
CREATE INDEX IF NOT EXISTS idx_product_description_description_i18n
  ON product_description USING GIN (description_i18n);
CREATE INDEX IF NOT EXISTS idx_category_description_name_i18n
  ON category_description USING GIN (name_i18n);
CREATE INDEX IF NOT EXISTS idx_category_description_description_i18n
  ON category_description USING GIN (description_i18n);

UPDATE product_description
SET name_i18n = jsonb_build_object('ar', name)
WHERE name_i18n = '{}'::jsonb
  AND name IS NOT NULL
  AND btrim(name) <> '';

UPDATE category_description
SET name_i18n = jsonb_build_object('ar', name)
WHERE name_i18n = '{}'::jsonb
  AND name IS NOT NULL
  AND btrim(name) <> '';

ALTER TABLE collection
  ADD COLUMN IF NOT EXISTS name_i18n JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE collection
  ADD COLUMN IF NOT EXISTS description_i18n JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_collection_name_i18n
  ON collection USING GIN (name_i18n);
CREATE INDEX IF NOT EXISTS idx_collection_description_i18n
  ON collection USING GIN (description_i18n);

UPDATE collection
SET name_i18n = jsonb_build_object('ar', name)
WHERE name_i18n = '{}'::jsonb
  AND name IS NOT NULL
  AND btrim(name) <> '';

-- Attribute i18n: per-language attribute_name on the attribute table
ALTER TABLE attribute
  ADD COLUMN IF NOT EXISTS attribute_name_i18n JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_attribute_name_i18n
  ON attribute USING GIN (attribute_name_i18n);

-- Attribute option i18n: per-language option_text on the attribute_option table
ALTER TABLE attribute_option
  ADD COLUMN IF NOT EXISTS option_text_i18n JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_attribute_option_text_i18n
  ON attribute_option USING GIN (option_text_i18n);

-- Seed existing attribute names as Arabic translations
UPDATE attribute
SET attribute_name_i18n = jsonb_build_object('ar', attribute_name)
WHERE attribute_name_i18n = '{}'::jsonb
  AND attribute_name IS NOT NULL
  AND btrim(attribute_name) <> '';

-- Seed existing option texts as Arabic translations
UPDATE attribute_option
SET option_text_i18n = jsonb_build_object('ar', option_text)
WHERE option_text_i18n = '{}'::jsonb
  AND option_text IS NOT NULL
  AND btrim(option_text) <> '';

-- CMS page i18n: per-language name/meta/content on cms_page_description
ALTER TABLE cms_page_description
  ADD COLUMN IF NOT EXISTS name_i18n JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE cms_page_description
  ADD COLUMN IF NOT EXISTS meta_title_i18n JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE cms_page_description
  ADD COLUMN IF NOT EXISTS meta_description_i18n JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE cms_page_description
  ADD COLUMN IF NOT EXISTS content_i18n JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_cms_page_description_name_i18n
  ON cms_page_description USING GIN (name_i18n);
CREATE INDEX IF NOT EXISTS idx_cms_page_description_meta_title_i18n
  ON cms_page_description USING GIN (meta_title_i18n);
CREATE INDEX IF NOT EXISTS idx_cms_page_description_meta_description_i18n
  ON cms_page_description USING GIN (meta_description_i18n);
CREATE INDEX IF NOT EXISTS idx_cms_page_description_content_i18n
  ON cms_page_description USING GIN (content_i18n);

-- Seed existing CMS page fields as Arabic translations
UPDATE cms_page_description
SET name_i18n = jsonb_build_object('ar', name)
WHERE name_i18n = '{}'::jsonb
  AND name IS NOT NULL
  AND btrim(name) <> '';

UPDATE cms_page_description
SET meta_title_i18n = jsonb_build_object('ar', meta_title)
WHERE meta_title_i18n = '{}'::jsonb
  AND meta_title IS NOT NULL
  AND btrim(meta_title) <> '';

UPDATE cms_page_description
SET meta_description_i18n = jsonb_build_object('ar', meta_description)
WHERE meta_description_i18n = '{}'::jsonb
  AND meta_description IS NOT NULL
  AND btrim(meta_description) <> '';

UPDATE cms_page_description
SET content_i18n = jsonb_build_object('ar', content)
WHERE content_i18n = '{}'::jsonb
  AND content IS NOT NULL
  AND btrim(content) <> '';
`;

export default async function () {
  registerJob({
    name: 'sampleJob',
    schedule: '*/1 * * * *', // Runs every minute
    resolve: path.resolve(import.meta.dirname, 'crons', 'everyMinute.js'),
    enabled: true
  });

  await pool.query(I18N_MIGRATION_SQL);

  // content_i18n holds raw HTML. Merchants sometimes paste markup that was
  // copied from a rendered page or "view source", where tags arrive as
  // entities (&lt;div&gt;). Decode them so the storefront renders HTML
  // instead of literal text. Plain text without entities is untouched.
  const decodeEscapedHtml = (value: string): string => {
    if (!value.includes('&lt;')) return value;
    return value
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#0?39;|&apos;/g, "'")
      .replace(/&amp;/g, '&');
  };

  // Transform i18n fields from form data (name_i18n.ar) to JSONB format
  // before saving to database
  hookBeforeUpdatePageData(async (uuid, data, connection) => {
    // Transform i18n fields from form format to JSONB
    const i18nFields = ['name_i18n', 'meta_title_i18n', 'meta_description_i18n', 'content_i18n'];
    for (const field of i18nFields) {
      // Check if data has the field in form format (e.g., name_i18n.ar)
      const formKeys = Object.keys(data).filter(key => key.startsWith(`${field}.`));
      if (formKeys.length > 0) {
        // Initialize the JSONB object if it doesn't exist
        if (!data[field]) {
          data[field] = {};
        }
        // Extract values from form format
        for (const formKey of formKeys) {
          const locale = formKey.split('.')[1];
          const value = data[formKey];
          if (value && typeof value === 'string' && value.trim() !== '') {
            data[field][locale] =
              field === 'content_i18n' ? decodeEscapedHtml(value) : value;
          }
          // Remove the form-format key
          delete data[formKey];
        }
      }
    }
  }, 10);

  hookBeforeCreatePage(async (data, context) => {
    // Transform i18n fields from form format to JSONB
    const i18nFields = ['name_i18n', 'meta_title_i18n', 'meta_description_i18n', 'content_i18n'];
    for (const field of i18nFields) {
      // Check if data has the field in form format (e.g., name_i18n.ar)
      const formKeys = Object.keys(data).filter(key => key.startsWith(`${field}.`));
      if (formKeys.length > 0) {
        // Initialize the JSONB object if it doesn't exist
        if (!data[field]) {
          data[field] = {};
        }
        // Extract values from form format
        for (const formKey of formKeys) {
          const locale = formKey.split('.')[1];
          const value = data[formKey];
          if (value && typeof value === 'string' && value.trim() !== '') {
            data[field][locale] =
              field === 'content_i18n' ? decodeEscapedHtml(value) : value;
          }
          // Remove the form-format key
          delete data[formKey];
        }
      }
    }
  }, 10);

  // Widget-builder text translations: `settings._i18n` maps dot-paths to
  // per-locale strings. The loadWidgetInstances patch calls this hook after
  // changeset overlays are applied; the pool wrapper covers any other
  // widget_instance.settings SELECT.
  (globalThis as any).__evershopWidgetI18n = applyWidgetI18n;
  installWidgetI18n(pool);

  // Catalog search i18n: the core `keyword` filter only builds its tsvector
  // from the legacy `name`/`description` columns, so queries in a translated
  // language (e.g. Arabic "مانجا") never match `name_i18n`/`description_i18n`.
  // Replace that filter's callback with one that also indexes the JSONB
  // translation maps. COALESCE keeps products with NULL description searchable.
  addProcessor(
    'productCollectionFilters',
    (filters: any[]) =>
      (filters || []).map((filter: any) =>
        filter.key === 'keyword'
          ? {
              ...filter,
              callback: (
                query: any,
                operation: string,
                val: string,
                currentFilters: any[]
              ) => {
                const bindingKey = `keyword_i18n_${uniqid()}`;
                query.getWhere().addRaw(
                  'AND',
                  `product.product_id IN (
                    WITH keyword_matches AS MATERIALIZED (
                      SELECT product_description_product_id FROM product_description
                      WHERE to_tsvector('simple',
                              COALESCE(name, '') || ' ' ||
                              COALESCE((SELECT string_agg(v.val, ' ')
                                        FROM jsonb_each_text(name_i18n) AS v(key, val)), '') || ' ' ||
                              COALESCE(description, '') || ' ' ||
                              COALESCE((SELECT string_agg(v.val, ' ')
                                        FROM jsonb_each_text(description_i18n) AS v(key, val)), '')
                            ) @@ websearch_to_tsquery('simple', :${bindingKey})
                    )
                    SELECT product_description_product_id FROM keyword_matches
                  )`,
                  { [bindingKey]: val }
                );
                currentFilters.push({
                  key: 'keyword',
                  operation,
                  value: val
                });
              }
            }
          : filter
      ),
    20
  );
}
