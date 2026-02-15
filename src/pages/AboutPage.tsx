import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Building2, Users, Truck, Award } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';

const featureIcons = [
  <Building2 className="h-6 w-6 text-primary" />,
  <Users className="h-6 w-6 text-primary" />,
  <Truck className="h-6 w-6 text-primary" />,
  <Award className="h-6 w-6 text-primary" />,
];

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">{siteConfig.about.title}</h1>
        
        <div className="max-w-3xl">
          <p className="text-lg text-muted-foreground mb-8">
            {siteConfig.about.intro}
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {siteConfig.about.features.map((feature, i) => (
              <div key={feature.title} className="p-6 border border-border rounded-lg bg-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    {featureIcons[i] || featureIcons[0]}
                  </div>
                  <h2 className="text-xl font-semibold">{feature.title}</h2>
                </div>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="p-6 bg-muted/50 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">Почему выбирают нас?</h3>
            <ul className="space-y-2 text-muted-foreground">
              {siteConfig.about.advantages.map((item) => (
                <li key={item}>✓ {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
