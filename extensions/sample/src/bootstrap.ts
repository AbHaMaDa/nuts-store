import path from 'path';
import { pool } from '@evershop/evershop/lib/postgres';
import {
  applyWidgetI18n,
  installWidgetI18n
} from './lib/widgetI18n.js';
import { registerJob } from '@evershop/evershop/lib/cronjob';

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
`;

export default async function () {
  registerJob({
    name: 'sampleJob',
    schedule: '*/1 * * * *', // Runs every minute
    resolve: path.resolve(import.meta.dirname, 'crons', 'everyMinute.js'),
    enabled: true
  });

  await pool.query(I18N_MIGRATION_SQL);

  // Widget-builder text translations: `settings._i18n` maps dot-paths to
  // per-locale strings. The loadWidgetInstances patch calls this hook after
  // changeset overlays are applied; the pool wrapper covers any other
  // widget_instance.settings SELECT.
  (globalThis as any).__evershopWidgetI18n = applyWidgetI18n;
  installWidgetI18n(pool);
}
