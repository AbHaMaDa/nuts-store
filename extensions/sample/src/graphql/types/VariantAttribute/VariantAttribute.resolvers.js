import { select } from '@evershop/postgres-query-builder';
import { localizedText } from '../../../lib/i18n.js';

export default {
  VariantAttribute: {
    attributeName: async (attribute, _, { pool }) => {
      const row = await select('attribute_name', 'attribute_name_i18n')
        .from('attribute')
        .where('attribute_id', '=', attribute.attributeId)
        .load(pool);
      if (!row) return attribute.attributeName;
      return localizedText(row.attribute_name_i18n, row.attribute_name);
    }
  }
};
