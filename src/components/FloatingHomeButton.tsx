import { Link } from 'react-router-dom';
import { Home, MessageCircle, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { siteConfig } from '@/config/siteConfig';

export function FloatingHomeButton() {
  const { items, toggleCart } = useCart();
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  
  const whatsappLink = `https://wa.me/${siteConfig.contacts.whatsapp}`;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 md:hidden px-4 flex justify-between items-center pointer-events-none">
      {/* Home button - left */}
      <Link to="/" className="pointer-events-auto">
        <Button 
          size="lg" 
          variant="outline"
          className="rounded-full w-14 h-14 shadow-lg bg-card border-border"
        >
          <Home className="h-6 w-6" />
        </Button>
      </Link>

      {/* Right side buttons */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Cart button with label */}
        <Button 
          size="lg" 
          variant="outline"
          className="rounded-full h-14 px-5 shadow-lg bg-card border-border flex items-center gap-2"
          onClick={toggleCart}
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="text-sm font-medium">
            Корзина{totalItems > 0 && ` (${totalItems})`}
          </span>
        </Button>

        {/* WhatsApp button */}
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
          <Button 
            size="lg" 
            className="rounded-full w-14 h-14 shadow-lg bg-green-500 hover:bg-green-600 text-white"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </a>
      </div>
    </div>
  );
}
