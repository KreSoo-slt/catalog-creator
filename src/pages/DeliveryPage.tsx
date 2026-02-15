import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Truck, MapPin, Clock } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';

const deliveryIcons = [
  <Truck className="h-6 w-6 text-primary" />,
  <MapPin className="h-6 w-6 text-primary" />,
  <Clock className="h-6 w-6 text-primary" />,
];

const DeliveryPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">Доставка</h1>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl">
          {siteConfig.deliveryPage.methods.map((method, i) => (
            <div key={method.title} className="p-6 border border-border rounded-lg bg-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  {deliveryIcons[i] || deliveryIcons[0]}
                </div>
                <h2 className="text-xl font-semibold">{method.title}</h2>
              </div>
              <p className="text-muted-foreground">{method.description}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DeliveryPage;
