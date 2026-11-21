import { select } from '@evershop/postgres-query-builder';
import { pool } from '@evershop/evershop/lib/postgres';
import { EvershopRequest, EvershopResponse } from '@evershop/evershop';

export default async (request: EvershopRequest, response: EvershopResponse) => {
  const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;

  const query = select().from('category');
  query
    .leftJoin('category_description')
    .on(
      'category_description.category_description_category_id',
      '=',
      'category.category_id'
    );
  const category = await query.where('category.uuid', '=', id).load(pool);

  if (!category) {
    return response.status(404).json({ error: 'Category not found' });
  }

  response.json({
    name: category.name,
    description: category.description,
    name_i18n: category.name_i18n || {},
    description_i18n: category.description_i18n || {}
  });
};
