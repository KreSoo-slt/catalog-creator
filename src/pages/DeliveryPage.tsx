import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Truck, MapPin, Clock, Package } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';

const DeliveryPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">Доставка</h1>
        
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mb-8">
          <div className="p-6 border border-border rounded-lg bg-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Курьерская доставка</h2>
            </div>
            <p className="text-muted-foreground">
              Доставка по {siteConfig.contacts.city} и пригородам. Стоимость рассчитывается индивидуально.
            </p>
          </div>

          <div className="p-6 border border-border rounded-lg bg-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Самовывоз</h2>
            </div>
            <p className="text-muted-foreground">
              Бесплатный самовывоз со склада. Адрес: {siteConfig.contacts.address}
            </p>
          </div>

          <div className="p-6 border border-border rounded-lg bg-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Сроки доставки</h2>
            </div>
            <p className="text-muted-foreground">
              {siteConfig.delivery.deliveryTime}. Точное время согласовывается с менеджером.
            </p>
          </div>

          <div className="p-6 border border-border rounded-lg bg-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Бесплатная доставка</h2>
            </div>
            <p className="text-muted-foreground">
              При заказе от {siteConfig.delivery.freeDeliveryFrom.toLocaleString('ru-RU')} {siteConfig.delivery.currency} доставка бесплатно!
            </p>
          </div>
        </div>

        <div className="max-w-3xl p-6 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-3">Зона доставки</h3>
          <p className="text-muted-foreground">
            {siteConfig.delivery.deliveryZone}. Доставка в другие регионы обсуждается индивидуально.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DeliveryPage;
