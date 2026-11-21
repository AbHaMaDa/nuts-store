import { localizedDescription, localizedText } from '../../../lib/i18n.js';

export default {
  Category: {
    name: (category) => localizedText(category.nameI18n, category.name),
    description: (category) =>
      localizedDescription(category.descriptionI18n, category.description)
  }
};
