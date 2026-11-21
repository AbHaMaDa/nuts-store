import React from 'react';
import MultiLangFields from '../../../components/admin/MultiLangFields';
/**
 * Adds the Arabic name + description inputs to the category form.
 * Registers fields `name_i18n.ar` / `description_i18n.ar`, which map onto
 * the JSONB columns on category_description (English defaults stay in the
 * core `name`/`description` fields).
 */ export default function CategoryI18nFields() {
    return /*#__PURE__*/ React.createElement(MultiLangFields, {
        kind: "category"
    });
}
// sortOrder 25: after core 'name' (10) / 'parent' (15), near 'description' (30)
export const layout = {
    areaId: 'categoryEditGeneral',
    sortOrder: 25
};
