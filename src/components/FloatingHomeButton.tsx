import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function FloatingHomeButton() {
  return (
    <Link 
      to="/" 
      className="fixed bottom-20 right-4 z-40 md:hidden"
    >
      <Button 
        size="lg" 
        className="rounded-full w-14 h-14 shadow-lg"
      >
        <Home className="h-6 w-6" />
      </Button>
    </Link>
  );
}
