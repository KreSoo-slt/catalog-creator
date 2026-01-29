import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Package } from 'lucide-react';
import { useProduct } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/config/siteConfig';
import { OptimizedImage } from '@/components/OptimizedImage';

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, error } = useProduct(slug);
  const { addItem } = useCart();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-8">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-muted rounded mb-6" />
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-square bg-muted rounded-lg" />
              <div className="space-y-4">
                <div className="h-8 bg-muted rounded w-3/4" />
                <div className="h-6 bg-muted rounded w-1/4" />
                <div className="h-24 bg-muted rounded" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container py-8">
          <div className="text-center py-20">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h1 className="text-2xl font-bold mb-2">Товар не найден</h1>
            <p className="text-muted-foreground mb-6">
              К сожалению, запрашиваемый товар не существует или был удалён
            </p>
            <Button asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Вернуться в каталог
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      img: product.img,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">
            Каталог
          </Link>
          <span>/</span>
          {product.category && (
            <>
              <Link 
                to={`/?category=${encodeURIComponent(product.category)}`}
                className="hover:text-foreground transition-colors"
              >
                {product.category}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-foreground truncate max-w-xs">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="aspect-square bg-muted/30 rounded-lg overflow-hidden border border-border">
            {product.img ? (
              <OptimizedImage
                src={product.img}
                alt={product.name}
                className="w-full h-full object-contain p-4"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-24 w-24 text-muted-foreground/30" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold mb-3">{product.name}</h1>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {product.category && (
                <Badge variant="secondary">{product.category}</Badge>
              )}
              {product.subcategory && (
                <Badge variant="outline">{product.subcategory}</Badge>
              )}
              {product.manufacturer && (
                <Badge variant="outline">{product.manufacturer}</Badge>
              )}
            </div>

            <div className="text-3xl font-bold text-primary mb-6">
              {formatPrice(product.price)}
            </div>

            {product.description && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Описание</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>
            )}

            {product.inBox && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">В упаковке</h3>
                <p className="text-muted-foreground">{product.inBox}</p>
              </div>
            )}

            <div className="mt-auto space-y-3">
              <Button size="lg" className="w-full" onClick={handleAddToCart}>
                <ShoppingCart className="h-5 w-5 mr-2" />
                В корзину
              </Button>
              
              <Button variant="outline" size="lg" className="w-full" asChild>
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Вернуться в каталог
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPage;
