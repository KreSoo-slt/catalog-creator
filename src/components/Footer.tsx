import { Link } from 'react-router-dom';
import { Phone, MapPin, MessageCircle } from 'lucide-react';
import { siteConfig, getPhoneLink, getWhatsAppLink } from '@/config/siteConfig';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={siteConfig.company.logo}
                alt={siteConfig.company.name}
                className="h-10 w-10 rounded-lg"
              />
              <div className="font-bold text-lg">{siteConfig.company.name}</div>
            </div>
            <p className="text-muted-foreground text-sm">
              {siteConfig.company.description}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4">Информация</h4>
            <nav className="flex flex-col gap-2">
              {siteConfig.navigation.main.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contacts */}
          <div>
            <h4 className="font-semibold mb-4">Контакты</h4>
            <div className="space-y-3">
              <a
                href={getPhoneLink()}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                {siteConfig.contacts.phone}
              </a>
              <a
                href={getWhatsAppLink('Здравствуйте!')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {siteConfig.contacts.address}
              </div>
            </div>
          </div>

          {/* Delivery info */}
          <div>
            <h4 className="font-semibold mb-4">Доставка</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>{siteConfig.delivery.description}</p>
              <p>Срок: {siteConfig.delivery.deliveryTime}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          © {siteConfig.company.year} {siteConfig.company.name}. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
