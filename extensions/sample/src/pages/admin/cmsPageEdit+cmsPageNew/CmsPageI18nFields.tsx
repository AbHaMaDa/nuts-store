import React from 'react';
import CmsPageMultiLangFields from '../../../components/admin/CmsPageMultiLangFields';

/**
 * Adds the Arabic name/meta/content inputs to the CMS page form.
 * Registers fields `name_i18n.ar`, `meta_title_i18n.ar`,
 * `meta_description_i18n.ar`, and `content_i18n.ar`, which map onto
 * the JSONB columns on cms_page_description (English defaults stay in the
 * core `name`/`meta_title`/`meta_description`/`content` fields).
 */
export default function CmsPageI18nFields() {
  return <CmsPageMultiLangFields />;
}

// sortOrder 25: after core General (10) and Seo (30)
export const layout = {
  areaId: 'wideScreen',
  sortOrder: 25
};
