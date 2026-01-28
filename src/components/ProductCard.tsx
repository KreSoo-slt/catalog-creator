import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { OptimizedImage } from '@/components/OptimizedImage';
import { Product } from '@/lib/supabase';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'compact';
}

const formatPrice = (price: number) => {
  return price.toLocaleString('ru-RU') + ' ₸';
};

export function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  if (viewMode === 'compact') {
    return (
      <article className="group bg-card rounded-lg border border-border overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/20">
        <Link to={`/product/${product.slug}`} className="flex items-center gap-3 p-3">
          <div className="w-16 h-16 rounded-md overflow-hidden shrink-0">
            <OptimizedImage
              src={product.img}
              alt={product.name}
              className="w-full h-full"
              fallback="/placeholder.svg"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">{product.category}</span>
              {product.inBox && (
                <span className="text-xs text-muted-foreground">• {product.inBox}</span>
              )}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-bold text-primary">{formatPrice(product.price)}</div>
          </div>
        </Link>
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

          {/* Category badge */}
          {product.category && (
            <span className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded">
              {product.category}
            </span>
          )}

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

          <div className="flex items-center justify-between mt-3">
            <div className="font-bold text-lg text-primary">
              {formatPrice(product.price)}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
