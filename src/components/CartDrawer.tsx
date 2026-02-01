import { Trash2, Plus, Minus, ShoppingBag, MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { useCart, CartItem } from '@/hooks/useCart';
import { siteConfig, formatPrice, getWhatsAppLink } from '@/config/siteConfig';

function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-3 py-3">
      {/* Image */}
      <div className="w-16 h-16 rounded-md overflow-hidden bg-muted shrink-0">
        {item.img ? (
          <img
            src={item.img}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="h-6 w-6 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium line-clamp-2">{item.name}</h4>
        <div className="text-sm text-primary font-semibold mt-1">
          {formatPrice(item.price)}
        </div>
      </div>

      {/* Quantity */}
      <div className="flex flex-col items-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground hover:text-destructive"
          onClick={() => removeItem(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CartDrawer() {
  const { items, isOpen, setCartOpen, clearCart, getTotalPrice, getTotalItems } = useCart();

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  const handleWhatsAppCheckout = () => {
    const itemsList = items
      .map((item) => `• ${item.name} x${item.quantity} = ${formatPrice(item.price * item.quantity)}`)
      .join('\n');

    const message = `🛒 *Заказ с сайта ${siteConfig.company.name}*\n\n${itemsList}\n\n💰 *Итого: ${formatPrice(totalPrice)}*\n\nПожалуйста, подтвердите заказ.`;

    window.open(getWhatsAppLink(message), '_blank');
  };

  return (
    <Drawer open={isOpen} onOpenChange={setCartOpen}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Корзина
              </DrawerTitle>
              <DrawerDescription>
                {totalItems > 0 ? `${totalItems} товаров` : 'Пусто'}
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon">
                <X className="h-5 w-5" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-center">
              {siteConfig.messages.emptyCart}
            </p>
            <p className="text-sm text-muted-foreground/70 text-center mt-1">
              Добавьте товары из каталога
            </p>
            <DrawerClose asChild>
              <Button variant="outline" className="mt-4">
                Перейти к каталогу
              </Button>
            </DrawerClose>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-4 max-h-[50vh]">
              {items.map((item) => (
                <div key={item.id}>
                  <CartItemRow item={item} />
                  <Separator />
                </div>
              ))}
            </ScrollArea>

            <DrawerFooter className="border-t">
              {/* Total */}
              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">Итого:</span>
                <span className="text-xl font-bold text-primary">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              {/* Actions */}
              <Button
                size="lg"
                className="w-full gap-2"
                onClick={handleWhatsAppCheckout}
              >
                <MessageCircle className="h-5 w-5" />
                {siteConfig.messages.checkout}
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={clearCart}
                >
                  Очистить
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline" className="flex-1">
                    Продолжить покупки
                  </Button>
                </DrawerClose>
              </div>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
