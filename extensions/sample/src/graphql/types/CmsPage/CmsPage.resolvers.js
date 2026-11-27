import { localizedText, localizedDescription } from '../../../lib/i18n.js';
import { select } from '@evershop/postgres-query-builder';
import { camelCase } from '@evershop/evershop/lib/util/camelCase';
import { localizeUrl } from '@evershop/evershop/lib/locale/localeContext';
import { buildUrl } from '@evershop/evershop/lib/router';
import { pool } from '@evershop/evershop/lib/postgres';
import { getValue } from '@evershop/evershop/lib/util/registry';
import { v4 as uuidv4 } from 'uuid';

// Inline the base query since it's not exported from the package
const getCmsPagesBaseQuery = () => {
  const query = select().from('cms_page');
  query
    .leftJoin('cms_page_description')
    .on('cms_page.cms_page_id', '=', 'cms_page_description.cms_page_description_cms_page_id');
  return query;
};

// Inline the collection class since it's not exported from the package
class CMSPageCollection {
  constructor(baseQuery) {
    this.baseQuery = baseQuery;
  }
  async init(filters = [], isAdmin = false) {
    if (!isAdmin) {
      this.baseQuery.andWhere('cms_page.status', '=', 't');
    }
    const currentFilters = [];
    const cmsPageCollectionFilters = await getValue('cmsPageCollectionFilters', []);
    cmsPageCollectionFilters.forEach((filter) => {
      const check = filters.find((f) => f.key === filter.key && filter.operation.includes(f.operation));
      if (filter.key === '*' || check) {
        filter.callback(this.baseQuery, check?.operation, check?.value, currentFilters);
      }
    });
    const totalQuery = this.baseQuery.clone();
    totalQuery.select('COUNT(cms_page.cms_page_id)', 'total');
    totalQuery.removeOrderBy();
    totalQuery.removeLimit();
    this.currentFilters = currentFilters;
    this.totalQuery = totalQuery;
  }
  async items() {
    const items = await this.baseQuery.execute(pool);
    return items.map((row) => camelCase(row));
  }
  async total() {
    const total = await this.totalQuery.execute(pool);
    return total[0].total;
  }
  currentFilters() {
    return this.currentFilters;
  }
}

export default {
  Query: {
    cmsPage: async (root, { id }, { pool }) => {
      const query = getCmsPagesBaseQuery();
      query.where('cms_page_id', '=', id);
      const page = await query.load(pool);
      return page ? camelCase(page) : null;
    },
    cmsPages: async (_, { filters = [] }, { user }) => {
      const query = getCmsPagesBaseQuery();
      const root = new CMSPageCollection(query);
      await root.init(filters, !!user);
      return root;
    },
    currentCmsPage: async (_, args, { currentRoute, pool }) => {
      if (currentRoute?.id !== 'cmsPageView') {
        return null;
      }
      const { params } = currentRoute;
      if (!params || !params.url_key) {
        return null;
      }
      const query = getCmsPagesBaseQuery();
      query.where('cms_page_description.url_key', '=', params.url_key);
      const page = await query.load(pool);
      return page ? camelCase(page) : null;
    }
  },
  CmsPage: {
    url: ({ urlKey }) => localizeUrl(`/${urlKey}`),
    editUrl: ({ uuid }) => buildUrl('cmsPageEdit', { id: uuid }),
    updateApi: (page) => buildUrl('updateCmsPage', { id: page.uuid }),
    deleteApi: (page) => buildUrl('deleteCmsPage', { id: page.uuid }),
    name: ({ name, nameI18n }) => {
      return localizedText(nameI18n, name);
    },
    metaTitle: ({ metaTitle, metaTitleI18n }) => {
      return localizedText(metaTitleI18n, metaTitle);
    },
    metaDescription: ({ metaDescription, metaDescriptionI18n }) => {
      return localizedText(metaDescriptionI18n, metaDescription);
    },
    content: ({ content, contentI18n }) => {
      // Try to get localized content first
      const localized = localizedDescription(contentI18n, content);
      if (localized && Array.isArray(localized) && localized.length > 0) {
        return localized;
      }
      
      // Fall back to legacy content parsing
      try {
        const json = JSON.parse(content);
        return json;
      } catch (e) {
        // This is for backward compatibility. If the content is not a JSON string then it is a raw HTML block
        const rowId = `r__${uuidv4()}`;
        return [
          {
            size: 1,
            id: rowId,
            columns: [
              {
                id: 'c__c5d90067-c786-4324-8e24-8e30520ac3d7',
                size: 1,
                data: {
                  time: 1723347125344,
                  blocks: [
                    {
                      id: 'AU89ItzUa7',
                      type: 'raw',
                      data: {
                        html: content
                      }
                    }
                  ],
                  version: '2.30.2'
                }
              }
            ]
          }
        ];
      }
    }
  }
};
