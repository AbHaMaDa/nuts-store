import { select } from '@evershop/postgres-query-builder';
import { localizedText } from '../../../lib/i18n.js';

export default {
  FilterOption: {
    optionText: async (option, _, { pool }) => {
      if (option.optionId == null) return option.optionText;
      const row = await select('option_text', 'option_text_i18n')
        .from('attribute_option')
        .where('attribute_option_id', '=', option.optionId)
        .load(pool);
      if (!row) return option.optionText;
      return localizedText(row.option_text_i18n, row.option_text);
    }
  }
};
