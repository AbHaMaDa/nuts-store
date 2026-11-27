import { Area } from '@components/common/Area.js';
import { Image } from '@components/common/Image.js';
import { ProductNoThumbnail } from '@components/common/ProductNoThumbnail.js';
import { useCatalogImageDimensions } from '@components/common/useCatalogImageDimensions.js';
import { ItemQuantity } from '@components/frontStore/cart/ItemQuantity.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import { deriveProductImageSize } from '@evershop/evershop/lib/util/deriveProductImageSize';
import { Minus, Plus, Trash2 } from 'lucide-react';
import React from 'react';
export const DefaultCartItemList = ({ items, showPriceIncludingTax = true, loading = false, onRemoveItem })=>{
    const thumbSize = deriveProductImageSize(200, useCatalogImageDimensions());
    return /*#__PURE__*/ React.createElement(React.Fragment, null, /*#__PURE__*/ React.createElement(Area, {
        id: 'cartItemListBefore',
        noOuter: true
    }), /*#__PURE__*/ React.createElement('div', {
        className: 'cart__items divide-y divide-border'
    }, items.map((row)=>{
        const totalValue = showPriceIncludingTax ? row.lineTotalInclTax?.text : row.lineTotal?.text;
        return /*#__PURE__*/ React.createElement('div', {
            key: row.cartItemId,
            className: 'cart__item flex gap-4 py-5'
        }, /*#__PURE__*/ React.createElement('div', {
            className: 'shrink-0'
        }, row.thumbnail ? /*#__PURE__*/ React.createElement(Image, {
            src: row.thumbnail,
            alt: row.productName,
            width: thumbSize.width,
            height: thumbSize.height,
            sizes: '100px',
            objectFit: 'cover',
            className: 'h-24 w-24 rounded-lg border border-border'
        }) : /*#__PURE__*/ React.createElement(ProductNoThumbnail, {
            width: 96,
            height: 96
        })), /*#__PURE__*/ React.createElement('div', {
            className: 'flex flex-1 flex-col'
        }, /*#__PURE__*/ React.createElement('div', {
            className: 'flex justify-between gap-4'
        }, /*#__PURE__*/ React.createElement('div', {
            className: 'min-w-0'
        }, /*#__PURE__*/ React.createElement('a', {
            href: row.productUrl,
            className: 'font-medium hover:underline'
        }, row.productName), /*#__PURE__*/ React.createElement('div', {
            className: 'mt-0.5 text-xs text-muted-foreground'
        }, _('SKU ${sku}', {
            sku: row.productSku
        })), row.variantOptions?.map((option)=>/*#__PURE__*/ React.createElement('div', {
                key: option.optionId,
                className: 'mt-0.5 text-xs text-muted-foreground'
            }, option.attributeName, ': ', option.optionText)), row.errors?.map((error, index)=>/*#__PURE__*/ React.createElement('div', {
                key: index,
                className: 'mt-0.5 text-xs text-destructive'
            }, error))), /*#__PURE__*/ React.createElement('div', {
            className: 'text-right font-medium tabular-nums'
        }, totalValue)), /*#__PURE__*/ React.createElement('div', {
            className: 'mt-auto flex items-center justify-between pt-3'
        }, /*#__PURE__*/ React.createElement(ItemQuantity, {
            initialValue: row.qty,
            cartItemId: row.cartItemId,
            min: 1,
            max: 99
        }, ({ quantity, increase, decrease })=>/*#__PURE__*/ React.createElement('div', {
                className: 'inline-flex items-center rounded-md border border-border'
            }, /*#__PURE__*/ React.createElement('button', {
                onClick: decrease,
                disabled: loading || quantity <= 1,
                className: 'p-3 text-muted-foreground hover:text-foreground disabled:opacity-40'
            }, /*#__PURE__*/ React.createElement(Minus, {
                className: 'h-5 w-5'
            })), /*#__PURE__*/ React.createElement('span', {
                className: 'w-12 border-x border-border py-2 text-center text-base tabular-nums'
            }, quantity), /*#__PURE__*/ React.createElement('button', {
                onClick: increase,
                disabled: loading,
                className: 'p-3 text-muted-foreground hover:text-foreground disabled:opacity-40'
            }, /*#__PURE__*/ React.createElement(Plus, {
                className: 'h-5 w-5'
            })))), /*#__PURE__*/ React.createElement('button', {
            type: 'button',
            onClick: (e)=>{
                e.preventDefault();
                onRemoveItem?.(row.cartItemId);
            },
            className: 'inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive'
        }, /*#__PURE__*/ React.createElement(Trash2, {
            className: 'h-4 w-4'
        }), _('Remove')))));
    })), /*#__PURE__*/ React.createElement(Area, {
        id: 'cartItemListAfter',
        noOuter: true
    }));
};
