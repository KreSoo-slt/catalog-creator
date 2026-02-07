import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/OptimizedImage';
import { Product } from '@/lib/supabase';
import { useCart } from '@/hooks/useCart';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'compact';
}

const formatPrice = (price: number) => {
  return price.toLocaleString('ru-RU') + ' ₸';
};

export function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const { addItem } = useCart();

  // Skip rendering if product has no slug
  if (!product.slug) {
    console.warn(`Product "${product.name}" (id: ${product.id}) has no slug`);
    return null;
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
    });
  };

  if (viewMode === 'compact') {
    return (
      <article className="group bg-card rounded-lg border border-border overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/20">
        <div className="flex items-center gap-3 p-3">
          <Link to={`/product/${product.slug}`} className="w-16 h-16 rounded-md overflow-hidden shrink-0">
            <OptimizedImage
              src={product.img}
              alt={product.name}
              className="w-full h-full"
              fallback="/placeholder.svg"
            />
          </Link>
          <Link to={`/product/${product.slug}`} className="flex-1 min-w-0">
            <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">{product.category}</span>
              {product.inBox && (
                <span className="text-xs text-muted-foreground">• {product.inBox}</span>
              )}
            </div>
          </Link>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <div className="font-bold text-primary">{formatPrice(product.price)}</div>
            </div>
            <Button size="sm" variant="outline" onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group bg-card rounded-lg border border-border overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/20">
      <Link to={`/product/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <OptimizedImage
            src={product.img}
            alt={product.name}
            className="w-full h-full transition-transform duration-300 group-hover:scale-105"
            fallback="/placeholder.svg"
          />

          {/* Category & Type badge */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.category && (
              <span className="bg-background/90 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded">
                {product.category}
              </span>
            )}
            {product.subcategory && (
              <span className="bg-primary/80 text-primary-foreground backdrop-blur-sm text-xs px-2 py-0.5 rounded">
                {product.subcategory}
              </span>
            )}
          </div>

          {/* Quick view overlay */}
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" className="shadow-lg">
                <Eye className="h-4 w-4 mr-1" />
                Смотреть
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="font-medium text-sm line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          {product.inBox && (
            <p className="text-xs text-muted-foreground mt-1">
              {product.inBox}
            </p>
          )}

          <div className="flex items-center justify-between mt-3 gap-2">
            <div className="font-bold text-lg text-primary">
              {formatPrice(product.price)}
            </div>
            <Button size="sm" variant="outline" onClick={handleAddToCart}>
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Link>
    </article>
  );
}
