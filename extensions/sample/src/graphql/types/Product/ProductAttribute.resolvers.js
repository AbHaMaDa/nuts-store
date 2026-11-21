import { select } from '@evershop/postgres-query-builder';
import { localizedText } from '../../../lib/i18n.js';

export default {
  ProductAttributeIndex: {
    attributeName: async (index, _, { pool }) => {
      const attribute = await select('attribute_name', 'attribute_name_i18n')
        .from('attribute')
        .where('attribute_id', '=', index.attributeId)
        .load(pool);
      if (!attribute) return index.attributeName;
      return localizedText(attribute.attribute_name_i18n, attribute.attribute_name);
    },
    optionText: async (index, _, { pool }) => {
      if (!index.optionId) {
        // text/textarea type — the option_text IS the value, no option row
        return index.optionText;
      }
      const option = await select('option_text', 'option_text_i18n')
        .from('attribute_option')
        .where('attribute_option_id', '=', index.optionId)
        .load(pool);
      if (!option) return index.optionText;
      return localizedText(option.option_text_i18n, option.option_text);
    }
  }
};
