import React from 'react';
import AttributeI18nFields from '../../../components/admin/AttributeI18nFields';

/**
 * Adds the Arabic translation inputs to the attribute form.
 * Registers fields for `attribute_name_i18n.ar` and each option's
 * `option_text_i18n.ar`, which map onto the JSONB columns on the
 * attribute / attribute_option tables.
 */
export default function AttributeI18n() {
  return <AttributeI18nFields />;
}

// sortOrder 15: after the core General card (sortOrder 10), still on the left side
export const layout = {
  areaId: 'leftSide',
  sortOrder: 15
};
