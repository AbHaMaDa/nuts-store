import { localizedText } from '../../../lib/i18n.js';

export default {
  ListingCategory: {
    name: (category) => localizedText(category.nameI18n, category.name)
  }
};
