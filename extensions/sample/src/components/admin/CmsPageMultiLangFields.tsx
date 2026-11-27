import React, { useEffect } from 'react';
import { InputField } from '@evershop/evershop/components/common/form/InputField.js';
import { TextareaField } from '@evershop/evershop/components/common/form/TextareaField.js';
import { useFormContext } from '@evershop/evershop/components/common/form/Form.js';

/**
 * Arabic (second-language) fields for CMS pages. The core `name`,
 * `meta_title`, `meta_description`, and `content` fields are the English
 * defaults; these register `name_i18n.ar`, `meta_title_i18n.ar`,
 * `meta_description_i18n.ar`, and `content_i18n.ar`, which map onto the
 * JSONB columns. On the storefront the resolver picks `*_i18n ->> locale`
 * and falls back to the core columns when empty.
 */
export default function CmsPageMultiLangFields() {
  const { setValue } = useFormContext();

  // The page UUID is the segment after /edit/ in the admin URL
  // (/admin/cms-pages/edit/<uuid>). /new pages have no entity yet.
  const entityId = window.location.pathname.match(/\/edit\/([^/?#]+)/)?.[1];

  useEffect(() => {
    if (!entityId) return;
    fetch(`/api/cms-pages/${entityId}/i18n`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        if (data.name_i18n?.ar) setValue('name_i18n.ar', data.name_i18n.ar);
        if (data.meta_title_i18n?.ar)
          setValue('meta_title_i18n.ar', data.meta_title_i18n.ar);
        if (data.meta_description_i18n?.ar)
          setValue('meta_description_i18n.ar', data.meta_description_i18n.ar);
        if (data.content_i18n?.ar)
          setValue('content_i18n.ar', data.content_i18n.ar);
      })
      .catch(() => {});
  }, [entityId, setValue]);

  return (
    <div className="rounded-lg border border-border p-4">
      <p className="mb-3 text-sm font-medium text-muted-foreground">
        النسخة العربية (Arabic version) — اختياري
      </p>
      <InputField
        name="name_i18n.ar"
        label="اسم الصفحة (Arabic)"
        placeholder="اسم الصفحة بالعربية"
      />
      <InputField
        name="meta_title_i18n.ar"
        label="عنوان الميتا (Arabic)"
        placeholder="عنوان الميتا بالعربية"
      />
      <TextareaField
        name="meta_description_i18n.ar"
        label="وصف الميتا (Arabic)"
        placeholder="وصف الميتا بالعربية..."
        rows={3}
      />
      <TextareaField
        name="content_i18n.ar"
        label="المحتوى (Arabic)"
        placeholder="المحتوى بالعربية..."
        rows={6}
      />
    </div>
  );
}
