import { select } from '@evershop/postgres-query-builder';
import { pool } from '@evershop/evershop/lib/postgres';
import { EvershopRequest, EvershopResponse } from '@evershop/evershop';

export default async (request: EvershopRequest, response: EvershopResponse) => {
  const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;

  const query = select().from('product');
  query
    .leftJoin('product_description')
    .on(
      'product_description.product_description_product_id',
      '=',
      'product.product_id'
    );
  const product = await query.where('product.uuid', '=', id).load(pool);

  if (!product) {
    return response.status(404).json({ error: 'Product not found' });
  }

  response.json({
    name: product.name,
    description: product.description,
    name_i18n: product.name_i18n || {},
    description_i18n: product.description_i18n || {}
  });
};
