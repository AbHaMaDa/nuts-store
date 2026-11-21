import React from 'react';
import MultiLangFields from '../../../components/admin/MultiLangFields';
/**
 * Adds the Arabic name + description inputs to the product form.
 * Registers fields `name_i18n.ar` / `description_i18n.ar`, which map onto
 * the JSONB columns on product_description (English defaults stay in the
 * core `name`/`description` fields).
 */ export default function ProductI18nFields() {
    return /*#__PURE__*/ React.createElement(MultiLangFields, {
        kind: "product"
    });
}
// sortOrder 15: after core 'name' (10), before SKUAndPrice (20)
export const layout = {
    areaId: 'productEditGeneral',
    sortOrder: 15
};
