import { Area } from '@components/common/Area.js';
import { Image } from '@components/common/Image.js';
import { ProductNoThumbnail } from '@components/common/ProductNoThumbnail.js';
import { useCatalogImageDimensions } from '@components/common/useCatalogImageDimensions.js';
import { ItemQuantity } from '@components/frontStore/cart/ItemQuantity.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import { deriveProductImageSize } from '@evershop/evershop/lib/util/deriveProductImageSize';
import { Minus, Plus, Trash2 } from 'lucide-react';
import React from 'react';

export const DefaultCartItemList = ({ items, showPriceIncludingTax = true, loading = false, onRemoveItem }) => {
  const thumbSize = deriveProductImageSize(200, useCatalogImageDimensions());
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Area, { id: 'cartItemListBefore', noOuter: true }),
    React.createElement(
      'div',
      { className: 'cart__items divide-y divide-border' },
      items.map((row) => {
        const totalValue = showPriceIncludingTax
          ? row.lineTotalInclTax?.text
          : row.lineTotal?.text;
        return React.createElement(
          'div',
          { key: row.cartItemId, className: 'cart__item flex gap-4 py-5' },
          React.createElement(
            'div',
            { className: 'shrink-0' },
            row.thumbnail
              ? React.createElement(Image, {
                  src: row.thumbnail,
                  alt: row.productName,
                  width: thumbSize.width,
                  height: thumbSize.height,
                  sizes: '100px',
                  objectFit: 'cover',
                  className: 'h-24 w-24 rounded-lg border border-border'
                })
              : React.createElement(ProductNoThumbnail, { width: 96, height: 96 })
          ),
          React.createElement(
            'div',
            { className: 'flex flex-1 flex-col' },
            React.createElement(
              'div',
              { className: 'flex justify-between gap-4' },
              React.createElement(
                'div',
                { className: 'min-w-0' },
                React.createElement(
                  'a',
                  { href: row.productUrl, className: 'font-medium hover:underline' },
                  row.productName
                ),
                React.createElement(
                  'div',
                  { className: 'mt-0.5 text-xs text-muted-foreground' },
                  _('SKU ${sku}', { sku: row.productSku })
                ),
                row.variantOptions?.map((option) =>
                  React.createElement(
                    'div',
                    { key: option.optionId, className: 'mt-0.5 text-xs text-muted-foreground' },
                    option.attributeName,
                    ': ',
                    option.optionText
                  )
                ),
                row.errors?.map((error, index) =>
                  React.createElement(
                    'div',
                    { key: index, className: 'mt-0.5 text-xs text-destructive' },
                    error
                  )
                )
              ),
              React.createElement(
                'div',
                { className: 'text-right font-medium tabular-nums' },
                totalValue
              )
            ),
            React.createElement(
              'div',
              { className: 'mt-auto flex items-center justify-between pt-3' },
              React.createElement(
                ItemQuantity,
                { initialValue: row.qty, cartItemId: row.cartItemId, min: 1, max: 99 },
                ({ quantity, increase, decrease }) =>
                  React.createElement('div', {
                    className: 'inline-flex items-center rounded-md border border-border'
                  },
                    React.createElement(
                      'button',
                      {
                        onClick: decrease,
                        disabled: loading || quantity <= 1,
                        className: 'p-3 text-muted-foreground hover:text-foreground disabled:opacity-40'
                      },
                      React.createElement(Minus, { className: 'h-5 w-5' })
                    ),
                    React.createElement(
                      'span',
                      { className: 'w-12 border-x border-border py-2 text-center text-base tabular-nums' },
                      quantity
                    ),
                    React.createElement(
                      'button',
                      {
                        onClick: increase,
                        disabled: loading,
                        className: 'p-3 text-muted-foreground hover:text-foreground disabled:opacity-40'
                      },
                      React.createElement(Plus, { className: 'h-5 w-5' })
                    )
                  )
              ),
              React.createElement(
                'button',
                {
                  type: 'button',
                  onClick: (e) => {
                    e.preventDefault();
                    onRemoveItem?.(row.cartItemId);
                  },
                  className: 'inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive'
                },
                React.createElement(Trash2, { className: 'h-4 w-4' }),
                _('Remove')
              )
            )
          )
        );
      })
    ),
    React.createElement(Area, { id: 'cartItemListAfter', noOuter: true })
  );
};
