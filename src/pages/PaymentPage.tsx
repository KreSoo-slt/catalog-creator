import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CreditCard, Banknote, Building2, Smartphone } from 'lucide-react';

const PaymentPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">Способы оплаты</h1>
        
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl">
          <div className="p-6 border border-border rounded-lg bg-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Banknote className="h-6 w-6 text-primary" />
              </div>
             
       

          <div className="p-6 border border-border rounded-lg bg-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Картой</h2>
  
          </div>

          <div className="p-6 border border-border rounded-lg bg-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Kaspi перевод</h2>
            </div>
            <p className="text-muted-foreground">
              Перевод на Kaspi.
            </p>
          </div>

          <div className="p-6 border border-border rounded-lg bg-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Безналичный расчёт</h2>
            </div>
            <p className="text-muted-foreground">
              Для юридических лиц. Оплата по счёту с ЭСФ.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentPage;
