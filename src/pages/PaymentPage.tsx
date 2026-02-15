import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CreditCard, Banknote, Building2, Smartphone } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';

const iconMap: Record<string, React.ReactNode> = {
  banknote: <Banknote className="h-6 w-6 text-primary" />,
  creditcard: <CreditCard className="h-6 w-6 text-primary" />,
  smartphone: <Smartphone className="h-6 w-6 text-primary" />,
  building: <Building2 className="h-6 w-6 text-primary" />,
};

const PaymentPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">Способы оплаты</h1>
        
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl">
          {siteConfig.payment.methods.map((method) => (
            <div key={method.name} className="p-6 border border-border rounded-lg bg-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  {iconMap[method.icon] || <Banknote className="h-6 w-6 text-primary" />}
                </div>
                <h2 className="text-xl font-semibold">{method.name}</h2>
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

export default PaymentPage;
