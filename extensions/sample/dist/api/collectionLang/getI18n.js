import { select } from '@evershop/postgres-query-builder';
import { pool } from '@evershop/evershop/lib/postgres';
export default (async (request, response)=>{
    const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
    const collection = await select('name', 'description', 'name_i18n', 'description_i18n').from('collection').where('uuid', '=', id).load(pool);
    if (!collection) {
        return response.status(404).json({
            error: 'Collection not found'
        });
    }
    response.json({
        name: collection.name,
        description: collection.description,
        name_i18n: collection.name_i18n || {},
        description_i18n: collection.description_i18n || {}
    });
});
