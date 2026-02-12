import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Building2, Users, Truck, Award } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">О компании</h1>
        
        <div className="max-w-3xl">
          <p className="text-lg text-muted-foreground mb-8">
            {siteConfig.company.name} — надёжный партнёр в сфере оптовых поставок товаров. 
            Мы работаем как с физическими, так и с юридическими лицами, предлагая 
            широкий ассортимент продукции по конкурентным ценам.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            <div className="p-6 border border-border rounded-lg bg-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Опыт работы</h2>
              </div>
              <p className="text-muted-foreground">
                Многолетний опыт в сфере оптовой торговли позволяет нам предлагать 
                лучшие условия для наших клиентов.
              </p>
            </div>

            <div className="p-6 border border-border rounded-lg bg-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Клиенты</h2>
              </div>
              <p className="text-muted-foreground">
                Работаем с розничными магазинами, ИП, оптовыми клиентами
                по всему Казахстану.
              </p>
            </div>

            <div className="p-6 border border-border rounded-lg bg-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Доставка</h2>
              </div>
              <p className="text-muted-foreground">
                Логистика через транспортные компании и InDriver обеспечивает быструю и надёжную доставку 
                товаров по {siteConfig.contacts.city} и Казахстану.
              </p>
            </div>

            <div className="p-6 border border-border rounded-lg bg-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold">Качество</h2>
              </div>
              <p className="text-muted-foreground">
                Гарантируем подлинность и качество всей продукции. 
                Работаем только с проверенными производителями.
              </p>
            </div>
          </div>

          <div className="p-6 bg-muted/50 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">Почему выбирают нас?</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>✓ Широкий ассортимент — более 2000 наименований</li>
              <li>✓ Конкурентные оптовые цены</li>
              <li>✓ Удобные способы оплаты</li>
              <li>✓ Индивидуальный подход к каждому клиенту</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
