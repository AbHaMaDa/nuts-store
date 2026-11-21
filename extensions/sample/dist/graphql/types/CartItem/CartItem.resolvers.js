import { select } from '@evershop/postgres-query-builder';
import { camelCase } from '@evershop/evershop/lib/util/camelCase';
import { localizedText } from '../../../lib/i18n.js';
export default {
    CartItem: {
        // productName is snapshotted into cart.items JSONB in the language active
        // at add-to-cart time. Re-resolve it per request so the cart/drawer always
        // shows the active locale.
        productName: async (item, _, { pool })=>{
            if (!item.productId) {
                return item.productName;
            }
            const row = await select('name', 'name_i18n').from('product_description').where('product_description_product_id', '=', item.productId).load(pool);
            if (!row) {
                return item.productName;
            }
            return localizedText(row.name_i18n, row.name) || item.productName;
        },
        // variantOptions is also a JSONB snapshot — localize attribute/option text.
        variantOptions: async (item, _, { pool })=>{
            let options;
            try {
                options = JSON.parse(item.variantOptions || '[]').map((option)=>({
                        ...camelCase(option),
                        attributeId: parseInt(option.attribute_id, 10),
                        optionId: parseInt(option.option_id, 10)
                    }));
            } catch (error) {
                return [];
            }
            for (const option of options){
                if (option.attributeId) {
                    const attribute = await select('attribute_name', 'attribute_name_i18n').from('attribute').where('attribute_id', '=', option.attributeId).load(pool);
                    if (attribute) {
                        option.attributeName = localizedText(attribute.attribute_name_i18n, attribute.attribute_name) || option.attributeName;
                    }
                }
                if (option.optionId) {
                    const opt = await select('option_text', 'option_text_i18n').from('attribute_option').where('attribute_option_id', '=', option.optionId).load(pool);
                    if (opt) {
                        option.optionText = localizedText(opt.option_text_i18n, opt.option_text) || option.optionText;
                    }
                }
            }
            return options;
        }
    }
};
