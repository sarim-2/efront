import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { buildWhatsAppOrderLink } from '../lib/whatsapp';

export function Cart() {
  const { cartItems, updateQuantity, removeFromCart, getCartSubtotal } = useCart();
  const { settings } = useSettings();

  const subtotal = getCartSubtotal();
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 10;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your cart is empty"
        description="Looks like you haven't added anything to your cart yet."
        actionText="Continue Shopping"
        actionLink="/shop"
      />
    );
  }

  const handleCheckout = () => {
    const link = buildWhatsAppOrderLink(settings?.whatsappNumber, cartItems, total);
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      alert('Checkout is temporarily unavailable — the store has not configured a WhatsApp number yet.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items */}
        <div className="flex-1">
          <div className="border-b border-border pb-4 hidden sm:grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground">
            <div className="col-span-6">Product</div>
            <div className="col-span-3 text-center">Quantity</div>
            <div className="col-span-3 text-right">Total</div>
          </div>

          <div className="divide-y divide-border">
            {cartItems.map((item) => {
              const price = item.salePrice || item.price;
              const itemTotal = price * item.quantity;

              return (
                <div key={item._id} className="py-6 flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center relative">
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="absolute top-6 right-0 sm:hidden text-muted-foreground hover:text-red-500 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="col-span-6 flex items-center gap-4 w-full">
                    <div className="h-24 w-24 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col pr-6 sm:pr-0">
                      <Link to={`/product/${item._id}`} className="font-medium hover:underline line-clamp-2">{item.name}</Link>
                      <span className="text-sm text-muted-foreground">${price.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="col-span-3 flex justify-start sm:justify-center w-full sm:w-auto mt-4 sm:mt-0">
                    <div className="flex items-center border border-border rounded-md h-9">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="px-3 text-muted-foreground hover:text-foreground disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="px-3 text-muted-foreground hover:text-foreground"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="col-span-3 flex justify-between sm:justify-end items-center w-full sm:w-auto mt-4 sm:mt-0">
                    <span className="font-medium block sm:hidden">Total: </span>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">${itemTotal.toFixed(2)}</span>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="hidden sm:block text-muted-foreground hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-[380px]">
          <div className="bg-muted p-6 rounded-lg sticky top-24">
            <h2 className="text-lg font-medium mb-4">Order Summary</h2>

            <div className="space-y-3 text-sm mb-6 border-b border-border pb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
              </div>
            </div>

            <div className="flex justify-between font-medium text-lg mb-6">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <Button className="w-full mb-4 group" size="lg" onClick={handleCheckout}>
              <MessageCircle className="w-4 h-4 mr-2" />
              Checkout via WhatsApp
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              You'll confirm your order and shipping details with us directly on WhatsApp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
