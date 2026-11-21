import React, { useEffect } from 'react';
import { InputField } from '@evershop/evershop/components/common/form/InputField.js';
import { TextareaField } from '@evershop/evershop/components/common/form/TextareaField.js';
import { useFormContext } from '@evershop/evershop/components/common/form/Form.js';
const ENDPOINTS = {
    product: 'products',
    category: 'categories',
    collection: 'collections'
};
/**
 * Arabic (second-language) name + description editor for product, category
 * and collection forms. The core `name`/`description` fields are the English
 * defaults; these register `name_i18n.ar` / `description_i18n.ar`, which map
 * onto the JSONB columns. On the storefront the resolver picks
 * `name_i18n ->> locale` and falls back to the core columns when empty.
 */ export default function MultiLangFields({ kind }) {
    const { setValue } = useFormContext();
    // The entity UUID is the segment after /edit/ in the admin URL
    // (/admin/products/edit/<uuid>, /admin/collections/edit/<uuid>).
    // /new pages have no entity yet — fields start empty.
    const entityId = window.location.pathname.match(/\/edit\/([^/?#]+)/)?.[1];
    useEffect(()=>{
        if (!entityId) return;
        fetch(`/api/${ENDPOINTS[kind]}/${entityId}/i18n`).then((r)=>r.ok ? r.json() : null).then((data)=>{
            if (!data) return;
            if (data.name_i18n?.ar) setValue('name_i18n.ar', data.name_i18n.ar);
            if (data.description_i18n?.ar) setValue('description_i18n.ar', data.description_i18n.ar);
        }).catch(()=>{});
    }, [
        entityId,
        kind,
        setValue
    ]);
    return /*#__PURE__*/ React.createElement("div", {
        className: "rounded-lg border border-border p-4"
    }, /*#__PURE__*/ React.createElement("p", {
        className: "mb-3 text-sm font-medium text-muted-foreground"
    }, "النسخة العربية (Arabic version) — اختياري"), /*#__PURE__*/ React.createElement(InputField, {
        name: "name_i18n.ar",
        label: "الاسم (Arabic)",
        placeholder: "الاسم بالعربية"
    }), /*#__PURE__*/ React.createElement(TextareaField, {
        name: "description_i18n.ar",
        label: "الوصف (Arabic)",
        placeholder: "الوصف بالعربية...",
        rows: 4
    }));
}
