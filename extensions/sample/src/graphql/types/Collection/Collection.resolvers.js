import { localizedDescription, localizedText } from '../../../lib/i18n.js';

export default {
  Collection: {
    name: (collection) => localizedText(collection.nameI18n, collection.name),
    description: (collection) =>
      localizedDescription(collection.descriptionI18n, collection.description)
  }
};
