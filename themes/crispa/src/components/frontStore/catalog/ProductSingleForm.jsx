import Area from '@components/common/Area.js';
import { Form } from '@components/common/form/Form.js';
import { Button } from '@components/common/ui/Button.js';
import { toast } from '@components/common/ui/Sonner.js';
import { AddToCart } from '@components/frontStore/cart/AddToCart.js';
import { useProduct } from '@components/frontStore/catalog/ProductContext.js';
import { VariantSelector } from '@components/frontStore/catalog/VariantSelector.js';
import { _ } from '@evershop/evershop/lib/locale/translate/_';
import { Minus, Plus } from 'lucide-react';
import React from 'react';
import { Controller, useForm, useFormContext } from 'react-hook-form';

const MIN_QTY = 1;

function QuantityStepper({ name = 'qty', min = MIN_QTY, defaultValue = MIN_QTY }) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={{
        required: _('Quantity is required'),
        min: { value: min, message: _('Value must be at least ${min}', { min: min.toString() }) },
        validate: (value) =>
          value === null || value === undefined || value === '' || Number.isInteger(Number(value)) ||
          _('Value must be a whole number')
      }}
      render={({ field }) => {
        const current = Number.isFinite(field.value) ? field.value : defaultValue;
        const clamp = (v) => Math.max(min, Math.floor(v));
        return (
          <div className="crispa-qty-stepper inline-flex items-center rounded-md border border-border">
            <button
              type="button"
              className="p-2.5 text-muted-foreground hover:text-foreground disabled:opacity-40"
              onClick={() => field.onChange(clamp(current - 1))}
              disabled={current <= min}
              aria-label={_('Decrease quantity')}
            >
              <Minus className="h-5 w-5" />
            </button>
            <input
              {...field}
              type="number"
              min={min}
              step={1}
              value={field.value ?? ''}
              onChange={(e) => {
                const v = e.target.value;
                if (v === '') {
                  field.onChange(null);
                  return;
                }
                const n = parseInt(v, 10);
                field.onChange(isNaN(n) ? null : n);
              }}
              className="crispa-qty-input w-12 border-x border-border bg-transparent py-2.5 text-center text-base tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              aria-label={_('Quantity')}
            />
            <button
              type="button"
              className="p-2.5 text-muted-foreground hover:text-foreground"
              onClick={() => field.onChange(clamp(current + 1))}
              aria-label={_('Increase quantity')}
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        );
      }}
    />
  );
}

export function ProductSingleForm() {
  const {
    sku,
    inventory: { isInStock }
  } = useProduct();
  const form = useForm();
  const [addingToCart, setAddingToCart] = React.useState(false);
  return React.createElement(
    Form,
    {
      id: 'productForm',
      method: 'POST',
      submitBtn: false,
      form: form
    },
    React.createElement(
      Area,
      {
        id: 'productSinglePageForm',
        coreComponents: [
          {
            component: {
              default: React.createElement(VariantSelector, null)
            },
            sortOrder: 10,
            id: 'variantSelector'
          },
          {
            component: {
              default: React.createElement(
                AddToCart,
                {
                  product: {
                    sku: sku,
                    isInStock: isInStock
                  },
                  qty: form.watch('qty') || 1,
                  onSuccess: () => {
                    // To show the mini cart after adding a product to cart
                  },
                  onError: (errorMessage) => {
                    toast.error(errorMessage || _('Failed to add product to cart'));
                  }
                },
                (state, actions) =>
                  React.createElement('div', { className: 'mt-6 space-y-3' },
                    state.isInStock === true &&
                      React.createElement(
                        React.Fragment,
                        null,
                        React.createElement(
                          'div',
                          { className: 'w-1/2' },
                          React.createElement(
                            'label',
                            { className: 'mb-1 block text-sm font-medium' },
                            _('Quantity')
                          ),
                          React.createElement(QuantityStepper, { name: 'qty' })
                        ),
                        React.createElement(
                          Button,
                          {
                            variant: 'default',
                            size: 'lg',
                            onClick: () => {
                              form
                                .trigger()
                                .then((isValid) => {
                                  if (isValid) {
                                    setAddingToCart(true);
                                    actions.addToCart();
                                  }
                                })
                                .finally(() => {
                                  setAddingToCart(false);
                                });
                            },
                            className: 'mt-2 w-full',
                            isLoading: addingToCart || state.isLoading
                          },
                          _('Add to cart')
                        )
                      ),
                    state.isInStock === false &&
                      React.createElement(
                        Button,
                        { onClick: () => {}, className: 'mt-2 w-full', disabled: true },
                        _('Sold out')
                      )
                  )
              )
            },
            sortOrder: 30,
            id: 'addToCartButton'
          }
        ]
      }
    )
  );
}
