import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingBag, Shield, BadgeCheck, Truck, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import { useProduct, useProducts } from '@/hooks/use-products';
import { useCart } from '@/contexts/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useProduct(id);
  const { data: allProducts = [] } = useProducts();

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-heading font-bold mb-4">Loading product</h2>
          <p className="text-sm text-muted-foreground">Fetching the latest details.</p>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-heading font-bold mb-4">Product Not Found</h2>
          <Link to="/products" className="text-primary font-medium hover:underline">Browse products</Link>
        </div>
      </Layout>
    );
  }

  const relatedProducts = allProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product, i === 0 ? e : undefined);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 pb-24 lg:pb-12">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="aspect-square rounded-xl overflow-hidden bg-secondary"
          >
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Seller */}
            <Link
              to={`/products?seller=${product.seller.id}`}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mb-2"
            >
              <BadgeCheck size={14} className="text-primary" />
              {product.seller.name} · Verified Seller
            </Link>

            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground leading-snug mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < Math.floor(product.rating) ? 'fill-primary text-primary' : 'text-border'}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-xs text-muted-foreground">({product.reviewCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-foreground">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="px-2 py-0.5 bg-destructive/10 text-destructive text-xs font-semibold rounded">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Category & Sub */}
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 bg-secondary rounded-full text-xs font-medium text-secondary-foreground capitalize">
                {product.category === 'saree' ? 'Sarees' : 'Jewellery'}
              </span>
              <span className="px-3 py-1 bg-secondary rounded-full text-xs font-medium text-secondary-foreground">
                {product.subCategory}
              </span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-foreground">Quantity</span>
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              <span className="text-xs text-muted-foreground">{product.stock} in stock</span>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 luxury-gradient text-primary-foreground font-semibold rounded-full text-sm hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 active:scale-[0.97]"
            >
              <ShoppingBag size={18} />
              Add to Cart · ₹{(product.price * quantity).toLocaleString('en-IN')}
            </button>

            {/* Trust signals */}
            <div className="grid grid-cols-3 gap-3 mt-8 pt-6 border-t border-border">
              <div className="flex flex-col items-center text-center gap-1">
                <Shield size={18} className="text-primary" />
                <span className="text-[10px] text-muted-foreground">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <BadgeCheck size={18} className="text-primary" />
                <span className="text-[10px] text-muted-foreground">Certified Authentic</span>
              </div>
              <div className="flex flex-col items-center text-center gap-1">
                <Truck size={18} className="text-primary" />
                <span className="text-[10px] text-muted-foreground">Free Shipping</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h3 className="text-xl sm:text-2xl font-heading font-bold text-foreground mb-6">
              You May Also Like
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {relatedProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetail;