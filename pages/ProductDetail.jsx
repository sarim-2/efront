import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Truck, ShieldCheck, ArrowLeft, ShoppingBag, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { LoadingState } from '../components/ui/LoadingState';
import { ProductGrid } from '../components/ProductGrid';
import { api } from '../lib/api';
import { useCart } from '../context/CartContext';
import { useSettings } from '../context/SettingsContext';
import { buildWhatsAppSingleProductLink } from '../lib/whatsapp';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { settings } = useSettings();
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState('');
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setMainImage('');
    setQuantity(1);
    setProduct(null);
    setNotFound(false);

    api
      .getProduct(id)
      .then((p) => setProduct(p))
      .catch(() => setNotFound(true));
  }, [id]);

  // Recompute related products once `product` is set (category id needed for the filter above)
  useEffect(() => {
    if (!product) return;
    api
      .getProducts()
      .then((all) =>
        setRelatedProducts(
          all.filter((rp) => rp.category?._id === product.category?._id && rp._id !== product._id).slice(0, 4)
        )
      )
      .catch(() => setRelatedProducts([]));
  }, [product]);

  if (notFound) {
    return <EmptyState title="Product not found" description="The product you are looking for does not exist." actionText="Back to Shop" actionLink="/shop" />;
  }

  if (!product) {
    return <LoadingState message="Loading product..." />;
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    const link = buildWhatsAppSingleProductLink(settings?.whatsappNumber, product, quantity);
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      addToCart(product, quantity);
      navigate('/cart');
    }
  };

  const inStock = product.stock > 0;
  const displayPrice = product.salePrice || product.price;
  const images = product.images || [];
  const currentMainImage = mainImage || images[0];

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Link to="/shop" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
        {/* Product Image Gallery */}
        <div className="flex flex-col-reverse md:flex-row gap-4">
          <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible md:w-24 flex-shrink-0">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setMainImage(img)}
                className={`aspect-square w-20 md:w-full rounded-md overflow-hidden border-2 transition-all ${currentMainImage === img ? 'border-primary' : 'border-transparent hover:border-border'}`}
              >
                <img src={img} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          <div className="flex-1 aspect-square md:aspect-[4/5] bg-muted rounded-md overflow-hidden relative">
            <img
              src={currentMainImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {!inStock && (
              <div className="absolute top-4 left-4 bg-background px-3 py-1 text-sm font-medium rounded-md shadow-sm">
                Out of Stock
              </div>
            )}
            {product.salePrice && inStock && (
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-sm font-medium rounded-md shadow-sm">
                Sale
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          {product.category && (
            <div className="mb-2">
              <Link to={`/category/${product.category.slug}`} className="text-sm text-muted-foreground capitalize hover:text-foreground transition-colors">
                {product.category.name}
              </Link>
            </div>
          )}

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{product.name}</h1>
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-medium">${displayPrice.toFixed(2)}</span>
            {product.salePrice && (
              <span className="text-lg text-muted-foreground line-through">${product.price.toFixed(2)}</span>
            )}
          </div>

          <div className="prose prose-sm mb-8 text-muted-foreground">
            <p>{product.description}</p>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Quantity</span>
              {inStock ? (
                <span className="text-sm text-green-600 font-medium">In Stock</span>
              ) : (
                <span className="text-sm text-red-600 font-medium">Out of Stock</span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center border border-border rounded-md h-12 w-full sm:w-auto">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 text-muted-foreground hover:text-foreground disabled:opacity-50 h-full flex items-center justify-center"
                  disabled={quantity <= 1 || !inStock}
                >
                  -
                </button>
                <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 text-muted-foreground hover:text-foreground disabled:opacity-50 h-full flex items-center justify-center"
                  disabled={!inStock || quantity >= product.stock}
                >
                  +
                </button>
              </div>

              <Button
                className="flex-1 w-full h-12"
                variant="outline"
                disabled={!inStock}
                onClick={handleAddToCart}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>

              <Button
                className="flex-1 w-full h-12"
                disabled={!inStock}
                onClick={handleBuyNow}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Buy Now
              </Button>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 space-y-4">
            <div className="flex items-center text-sm">
              <Truck className="w-5 h-5 mr-3 text-muted-foreground" />
              <div>
                <p className="font-medium">Free Shipping</p>
                <p className="text-muted-foreground">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <ShieldCheck className="w-5 h-5 mr-3 text-muted-foreground" />
              <div>
                <p className="font-medium">1 Year Warranty</p>
                <p className="text-muted-foreground">Manufacturer warranty included</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-border pt-12 md:pt-16 mt-8">
          <h2 className="text-2xl font-bold tracking-tight mb-8">You May Also Like</h2>
          <ProductGrid products={relatedProducts} />
        </div>
      )}
    </div>
  );
}
