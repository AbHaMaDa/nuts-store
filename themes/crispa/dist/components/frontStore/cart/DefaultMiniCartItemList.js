import { Image } from '@components/common/Image.js';
import { ProductNoThumbnail } from '@components/common/ProductNoThumbnail.js';
import { useCartDispatch, useCartState } from '@components/frontStore/cart/CartContext.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import { Check, Minus, Plus, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
const MiniCartLine = ({ item, showPriceIncludingTax })=>{
    const { updateItem, removeItem } = useCartDispatch();
    const { loadingStates } = useCartState();
    const [draftQty, setDraftQty] = useState(item.qty);
    const [applying, setApplying] = useState(false);
    useEffect(()=>{
        setDraftQty(item.qty);
    }, [
        item.qty
    ]);
    const busy = applying || loadingStates.updatingItem === item.cartItemId || loadingStates.removingItem === item.cartItemId;
    const dirty = draftQty !== item.qty;
    const lineTotal = showPriceIncludingTax ? item.lineTotalInclTax?.text : item.lineTotal?.text;
    const apply = async ()=>{
        if (!dirty || busy) return;
        setApplying(true);
        try {
            if (draftQty === 0) {
                await removeItem(item.cartItemId);
            } else {
                const diff = draftQty - item.qty;
                await updateItem(item.cartItemId, {
                    qty: Math.abs(diff),
                    action: diff > 0 ? 'increase' : 'decrease'
                });
            }
        } finally{
            setApplying(false);
        }
    };
    return /*#__PURE__*/ React.createElement('li', {
        className: 'flex gap-3 py-3'
    }, /*#__PURE__*/ React.createElement('a', {
        href: item.productUrl,
        className: 'block h-16 w-16 shrink-0 overflow-hidden rounded-md border border-border'
    }, item.thumbnail ? /*#__PURE__*/ React.createElement(Image, {
        width: 128,
        height: 128,
        sizes: '64px',
        src: item.thumbnail,
        alt: item.productName,
        className: 'h-full w-full object-cover'
    }) : /*#__PURE__*/ React.createElement(ProductNoThumbnail, {
        className: 'h-full w-full'
    })), /*#__PURE__*/ React.createElement('div', {
        className: 'flex min-w-0 flex-1 flex-col'
    }, /*#__PURE__*/ React.createElement('div', {
        className: 'flex items-start justify-between gap-2'
    }, /*#__PURE__*/ React.createElement('a', {
        href: item.productUrl,
        className: 'line-clamp-2 text-sm font-medium hover:underline'
    }, item.productName), /*#__PURE__*/ React.createElement('span', {
        className: 'shrink-0 text-sm font-semibold tabular-nums'
    }, lineTotal)), item.variantOptions && item.variantOptions.length > 0 && /*#__PURE__*/ React.createElement('div', {
        className: 'mt-0.5 space-y-0.5'
    }, item.variantOptions.map((option)=>/*#__PURE__*/ React.createElement('div', {
            key: option.attributeCode,
            className: 'text-xs text-muted-foreground'
        }, option.attributeName, ': ', option.optionText))), /*#__PURE__*/ React.createElement('div', {
        className: 'mt-auto flex items-center justify-between gap-2 pt-2'
    }, /*#__PURE__*/ React.createElement('div', {
        className: 'inline-flex items-center rounded-md border border-border'
    }, /*#__PURE__*/ React.createElement('button', {
        type: 'button',
        onClick: ()=>setDraftQty((q)=>Math.max(0, q - 1)),
        disabled: busy,
        className: 'p-2 text-muted-foreground hover:text-foreground disabled:opacity-40',
        'aria-label': _('Decrease quantity')
    }, /*#__PURE__*/ React.createElement(Minus, {
        className: 'h-4 w-4'
    })), /*#__PURE__*/ React.createElement('span', {
        className: 'w-9 border-x border-border py-1.5 text-center text-sm tabular-nums'
    }, draftQty), /*#__PURE__*/ React.createElement('button', {
        type: 'button',
        onClick: ()=>setDraftQty((q)=>Math.min(99, q + 1)),
        disabled: busy,
        className: 'p-2 text-muted-foreground hover:text-foreground disabled:opacity-40',
        'aria-label': _('Increase quantity')
    }, /*#__PURE__*/ React.createElement(Plus, {
        className: 'h-4 w-4'
    }))), dirty ? /*#__PURE__*/ React.createElement('button', {
        type: 'button',
        onClick: apply,
        disabled: busy,
        className: 'inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50'
    }, /*#__PURE__*/ React.createElement(Check, {
        className: 'h-4 w-4'
    }), draftQty === 0 ? _('Remove') : _('Update')) : /*#__PURE__*/ React.createElement('button', {
        type: 'button',
        onClick: (e)=>{
            e.preventDefault();
            removeItem(item.cartItemId);
        },
        disabled: busy,
        className: 'inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive disabled:opacity-40'
    }, /*#__PURE__*/ React.createElement(Trash2, {
        className: 'h-4 w-4'
    }), _('Remove')))));
};
export const DefaultMiniCartItemList = ({ items, showPriceIncludingTax = true, loading = false })=>{
    if (loading && items.length === 0) {
        return /*#__PURE__*/ React.createElement('ul', {
            className: 'divide-y divide-border'
        }, [
            0,
            1
        ].map((i)=>/*#__PURE__*/ React.createElement('li', {
                key: i,
                className: 'flex gap-3 py-3 animate-pulse'
            }, /*#__PURE__*/ React.createElement('div', {
                className: 'h-16 w-16 shrink-0 rounded-md bg-muted'
            }), /*#__PURE__*/ React.createElement('div', {
                className: 'flex-1 space-y-2'
            }, /*#__PURE__*/ React.createElement('div', {
                className: 'h-4 w-3/5 rounded bg-muted'
            }), /*#__PURE__*/ React.createElement('div', {
                className: 'h-3 w-2/5 rounded bg-muted'
            })))));
    }
    if (items.length === 0) {
        return /*#__PURE__*/ React.createElement('div', {
            className: 'py-8 text-center text-muted-foreground'
        }, /*#__PURE__*/ React.createElement('p', {
            className: 'text-base'
        }, _('Your cart is empty')), /*#__PURE__*/ React.createElement('p', {
            className: 'mt-2 text-sm'
        }, _('Add some items to get started')));
    }
    return /*#__PURE__*/ React.createElement('ul', {
        className: 'divide-y divide-border'
    }, items.map((item)=>/*#__PURE__*/ React.createElement(MiniCartLine, {
            key: item.uuid,
            item: item,
            showPriceIncludingTax: showPriceIncludingTax
        })));
};
