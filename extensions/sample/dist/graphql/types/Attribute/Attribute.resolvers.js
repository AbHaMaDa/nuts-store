import { localizedText } from '../../../lib/i18n.js';
export default {
    Attribute: {
        attributeName: (attribute)=>localizedText(attribute.attributeNameI18n, attribute.attributeName)
    },
    AttributeOption: {
        optionText: (option)=>localizedText(option.optionTextI18n, option.optionText)
    }
};
