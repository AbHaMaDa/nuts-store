import { localizedDescription, localizedText } from '../../../lib/i18n.js';

export default {
  Product: {
    name: (product) => localizedText(product.nameI18n, product.name),
    description: (product) =>
      localizedDescription(product.descriptionI18n, product.description)
  }
};
