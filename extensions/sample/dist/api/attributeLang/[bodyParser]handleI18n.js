import { select, update } from '@evershop/postgres-query-builder';
import { pool } from '@evershop/evershop/lib/postgres';
export default (async (request, response)=>{
    const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
    if (request.method === 'GET') {
        const attribute = await select('attribute_id', 'attribute_name', 'attribute_name_i18n').from('attribute').where('uuid', '=', id).load(pool);
        if (!attribute) {
            return response.status(404).json({
                error: 'Attribute not found'
            });
        }
        const options = await select('attribute_option_id', 'option_text', 'option_text_i18n').from('attribute_option').where('attribute_id', '=', attribute.attribute_id).execute(pool);
        return response.json({
            attribute_name: attribute.attribute_name,
            attribute_name_i18n: attribute.attribute_name_i18n || {},
            options: options.map((opt)=>({
                    option_id: opt.attribute_option_id,
                    option_text: opt.option_text,
                    option_text_i18n: opt.option_text_i18n || {}
                }))
        });
    }
    if (request.method === 'PATCH') {
        const attribute = await select('attribute_id').from('attribute').where('uuid', '=', id).load(pool);
        if (!attribute) {
            return response.status(404).json({
                error: 'Attribute not found'
            });
        }
        const body = request.body || {};
        const { attribute_name_i18n, options_i18n } = body;
        // Update attribute name i18n
        if (attribute_name_i18n && typeof attribute_name_i18n === 'object') {
            await update('attribute').given({
                attribute_name_i18n: JSON.stringify(attribute_name_i18n)
            }).where('attribute_id', '=', attribute.attribute_id).execute(pool);
        }
        // Update option text i18n
        if (Array.isArray(options_i18n)) {
            for (const opt of options_i18n){
                if (opt.option_id !== undefined && opt.option_text_i18n) {
                    await update('attribute_option').given({
                        option_text_i18n: JSON.stringify(opt.option_text_i18n)
                    }).where('attribute_option_id', '=', opt.option_id).and('attribute_id', '=', attribute.attribute_id).execute(pool);
                }
            }
        }
        return response.json({
            success: true
        });
    }
    return response.status(405).json({
        error: 'Method not allowed'
    });
});
