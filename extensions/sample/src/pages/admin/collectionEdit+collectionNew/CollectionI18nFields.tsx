import React from 'react';
import MultiLangFields from '../../../components/admin/MultiLangFields';

// sortOrder 15: after core 'name' field, inside collectionFormInner area
export const layout = {
  areaId: 'collectionFormInner',
  sortOrder: 15
};

export default function CollectionI18nFields() {
  return <MultiLangFields kind="collection" />;
}
