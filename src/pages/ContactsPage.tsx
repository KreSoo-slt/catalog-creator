import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteConfig, getPhoneLink, getWhatsAppLink } from '@/config/siteConfig';

const ContactsPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-8">Контакты</h1>
        
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mb-8">
          <div className="p-6 border border-border rounded-lg bg-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Телефон</h2>
                <a 
                  href={getPhoneLink()} 
                  className="text-primary hover:underline"
                >
                  {siteConfig.contacts.phone}
                </a>
              </div>
            </div>
          </div>

          <div className="p-6 border border-border rounded-lg bg-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">WhatsApp</h2>
                <a 
                  href={getWhatsAppLink('Здравствуйте! Хочу узнать о товарах.')} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 hover:underline"
                >
                  Написать в WhatsApp
                </a>
              </div>
            </div>
          </div>

          <div className="p-6 border border-border rounded-lg bg-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Email</h2>
                <a 
                  href={`mailto:${siteConfig.contacts.email}`}
                  className="text-primary hover:underline"
                >
                  {siteConfig.contacts.email}
                </a>
              </div>
            </div>
          </div>

          <div className="p-6 border border-border rounded-lg bg-card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Адрес</h2>
                <p className="text-muted-foreground">{siteConfig.contacts.address}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button size="lg" asChild>
            <a href={getPhoneLink()}>
              <Phone className="h-5 w-5 mr-2" />
              Позвонить
            </a>
          </Button>
          <Button size="lg" variant="outline" className="bg-green-500/10 border-green-500 text-green-600 hover:bg-green-500/20" asChild>
            <a href={getWhatsAppLink('Здравствуйте!')} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5 mr-2" />
              WhatsApp
            </a>
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactsPage;
