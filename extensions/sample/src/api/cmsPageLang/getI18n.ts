import { select } from '@evershop/postgres-query-builder';
import { pool } from '@evershop/evershop/lib/postgres';
import { EvershopRequest, EvershopResponse } from '@evershop/evershop';

export default async (request: EvershopRequest, response: EvershopResponse) => {
  const id = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;

  const query = select().from('cms_page');
  query
    .leftJoin('cms_page_description')
    .on(
      'cms_page_description.cms_page_description_cms_page_id',
      '=',
      'cms_page.cms_page_id'
    );
  const page = await query.where('cms_page.uuid', '=', id).load(pool);

  if (!page) {
    return response.status(404).json({ error: 'Page not found' });
  }

  response.json({
    name: page.name,
    meta_title: page.meta_title,
    meta_description: page.meta_description,
    content: page.content,
    name_i18n: page.name_i18n || {},
    meta_title_i18n: page.meta_title_i18n || {},
    meta_description_i18n: page.meta_description_i18n || {},
    content_i18n: page.content_i18n || {}
  });
};
