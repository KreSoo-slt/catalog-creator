import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Phone, ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { siteConfig, getPhoneLink } from '@/config/siteConfig';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { items, toggleCart } = useCart();

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      {/* Desktop top bar */}
      <div className="hidden md:block border-b border-border bg-muted/50">
        <div className="container flex items-center justify-between h-10 text-sm">
          <nav className="flex items-center gap-6">
            {siteConfig.navigation.main.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4 text-muted-foreground">
            <span>{siteConfig.contacts.city}</span>
          </div>
        </div>
      </div>

      {/* Mobile header - compact with logo left, menu right */}
      <div className="md:hidden">
        <div className="container py-3 flex items-center justify-between">
          {/* Left: Menu + Nav links */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Right: Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-lg">{siteConfig.company.name}</span>
            <img
              src={siteConfig.company.logo}
              alt={siteConfig.company.name}
              className="h-10 w-10 rounded-lg object-cover"
            />
          </Link>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearch} className="container pb-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Поиск товаров..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
          </div>
        </form>
      </div>

      {/* Desktop main header */}
      <div className="hidden md:block container py-3">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src={siteConfig.company.logo}
              alt={siteConfig.company.name}
              className="h-10 w-10 rounded-lg object-cover"
            />
            <div>
              <div className="font-bold text-lg leading-tight">{siteConfig.company.name}</div>
              <div className="text-xs text-muted-foreground">{siteConfig.company.slogan}</div>
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Поиск товаров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
          </form>

          {/* Phone */}
          <a
            href={getPhoneLink()}
            className="hidden lg:flex items-center gap-2 text-sm hover:text-primary transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Phone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-semibold">{siteConfig.contacts.phone}</div>
              <div className="text-xs text-muted-foreground">Звоните!</div>
            </div>
          </a>

          {/* Cart */}
          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={toggleCart}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary">
                {totalItems}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="container py-4">
            <nav className="flex flex-col gap-2">
              {siteConfig.navigation.main.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="py-2 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="mt-4 pt-4 border-t border-border">
              <a
                href={getPhoneLink()}
                className="flex items-center gap-2 text-primary font-semibold"
              >
                <Phone className="h-5 w-5" />
                {siteConfig.contacts.phone}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
