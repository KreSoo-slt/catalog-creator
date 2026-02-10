import { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight, X, LayoutGrid, List, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

interface FilterSidebarProps {
  products: Product[];
  selectedCategories: string[];
  selectedSubcategories: string[];
  selectedTypes: string[];
  selectedManufacturers: string[];
  viewMode: 'grid' | 'compact';
  onCategoriesChange: (categories: string[]) => void;
  onSubcategoriesChange: (subcategories: string[]) => void;
  onTypesChange: (types: string[]) => void;
  onManufacturersChange: (manufacturers: string[]) => void;
  onViewModeChange: (mode: 'grid' | 'compact') => void;
  onClearFilters: () => void;
}

interface CategoryNode {
  name: string;
  count: number;
  hasTypes: boolean;
  types: { name: string; count: number }[];
}

function AnimatedPanel({ open, children }: { open: boolean; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      setHeight(open ? ref.current.scrollHeight : 0);
    }
  }, [open, children]);

  return (
    <div
      style={{ height: open ? height : 0 }}
      className="overflow-hidden transition-all duration-300 ease-in-out"
    >
      <div ref={ref}>{children}</div>
    </div>
  );
}

export function FilterSidebar({
  products,
  selectedCategories,
  selectedSubcategories,
  selectedTypes,
  selectedManufacturers,
  viewMode,
  onCategoriesChange,
  onSubcategoriesChange,
  onTypesChange,
  onManufacturersChange,
  onViewModeChange,
  onClearFilters,
}: FilterSidebarProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [manufacturerSearch, setManufacturerSearch] = useState('');
  const [manufacturersExpanded, setManufacturersExpanded] = useState(true);

  const hasActiveFilters = selectedCategories.length > 0 || selectedSubcategories.length > 0 || selectedTypes.length > 0 || selectedManufacturers.length > 0;

  const manufacturers = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach(p => {
      if (p.producer) map.set(p.producer, (map.get(p.producer) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  }, [products]);

  const filteredManufacturers = manufacturers.filter(m =>
    m.name.toLowerCase().includes(manufacturerSearch.toLowerCase())
  );

  const categoryTree = useMemo(() => {
    const map = new Map<string, { count: number; types: Map<string, number> }>();
    const filtered = selectedManufacturers.length > 0
      ? products.filter(p => p.producer && selectedManufacturers.includes(p.producer))
      : products;

    filtered.forEach(p => {
      const cat = p.category || 'Без категории';
      if (!map.has(cat)) map.set(cat, { count: 0, types: new Map() });
      const node = map.get(cat)!;
      node.count++;
      if (p.subcategory) {
        node.types.set(p.subcategory, (node.types.get(p.subcategory) || 0) + 1);
      }
    });

    const result: CategoryNode[] = Array.from(map.entries()).map(([name, data]) => ({
      name,
      count: data.count,
      hasTypes: data.types.size > 0,
      types: Array.from(data.types.entries())
        .map(([n, c]) => ({ name: n, count: c }))
        .sort((a, b) => a.name.localeCompare(b.name, 'ru')),
    }));

    return result.sort((a, b) => {
      if (a.hasTypes && !b.hasTypes) return -1;
      if (!a.hasTypes && b.hasTypes) return 1;
      return a.name.localeCompare(b.name, 'ru');
    });
  }, [products, selectedManufacturers]);

  const handleManufacturerToggle = (name: string) => {
    const next = selectedManufacturers.includes(name)
      ? selectedManufacturers.filter(m => m !== name)
      : [...selectedManufacturers, name];
    onManufacturersChange(next);
    onCategoriesChange([]);
    onTypesChange([]);
    setExpandedCategory(null);
  };

  const handleCategoryClick = (name: string, hasTypes: boolean) => {
    if (hasTypes) {
      setExpandedCategory(expandedCategory === name ? null : name);
    }
    const next = selectedCategories.includes(name)
      ? selectedCategories.filter(c => c !== name)
      : [name];
    onCategoriesChange(next);
    onTypesChange([]);
  };

  const handleTypeClick = (name: string) => {
    const next = selectedTypes.includes(name)
      ? selectedTypes.filter(t => t !== name)
      : [name];
    onTypesChange(next);
  };

  return (
    <aside className="hidden lg:block w-72 shrink-0">
      <div className="sticky top-24 space-y-4">
        {/* View mode + clear */}
        <div className="bg-card border border-border rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={cn(
                "p-2 rounded-lg transition-colors",
                viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange('compact')}
              className={cn(
                "p-2 rounded-lg transition-colors",
                viewMode === 'compact' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-destructive hover:text-destructive h-8 px-2">
              <X className="h-4 w-4 mr-1" /> Сброс
            </Button>
          )}
        </div>

        {/* Categories */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-4 py-3.5 font-bold text-base border-b border-border">
            Категории
          </div>
          <ScrollArea className="h-[calc(100vh-480px)] min-h-[240px]">
            <nav className="py-1">
              {categoryTree.map(cat => {
                const isExpanded = expandedCategory === cat.name;
                const isSelected = selectedCategories.includes(cat.name);

                return (
                  <div key={cat.name}>
                    <button
                      onClick={() => handleCategoryClick(cat.name, cat.hasTypes)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-4 py-3.5 text-left transition-all group",
                        isSelected
                          ? "bg-primary/10 text-foreground"
                          : "hover:bg-muted/40 text-foreground/90"
                      )}
                    >
                      {/* Arrow indicator for expandable categories */}
                      {cat.hasTypes ? (
                        <div className={cn(
                          "flex items-center justify-center w-6 h-6 rounded-md shrink-0 transition-colors",
                          isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary"
                        )}>
                          <ChevronRight className={cn(
                            "h-4 w-4 transition-transform duration-300",
                            isExpanded && "rotate-90"
                          )} />
                        </div>
                      ) : (
                        <div className="w-6 h-6 shrink-0" />
                      )}
                      <span className={cn(
                        "flex-1 truncate",
                        isSelected ? "font-bold text-[15px]" : "font-semibold text-sm"
                      )}>
                        {cat.name}
                      </span>
                      <span className={cn(
                        "text-xs px-2.5 py-1 rounded-full shrink-0 font-semibold",
                        isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      )}>
                        {cat.count}
                      </span>
                    </button>

                    {/* Animated subcategories */}
                    <AnimatedPanel open={isExpanded && cat.types.length > 0}>
                      <div className="border-l-2 border-primary/30 ml-7 bg-muted/5">
                        {cat.types.map(t => (
                          <button
                            key={t.name}
                            onClick={() => handleTypeClick(t.name)}
                            className={cn(
                              "w-full flex items-center gap-2 pl-4 pr-4 py-2.5 text-left transition-colors",
                              selectedTypes.includes(t.name)
                                ? "text-primary font-semibold bg-primary/5"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                            )}
                          >
                            <span className="flex-1 truncate text-sm">{t.name}</span>
                            <span className="text-xs text-muted-foreground shrink-0 bg-muted px-2 py-0.5 rounded-full">{t.count}</span>
                          </button>
                        ))}
                      </div>
                    </AnimatedPanel>
                  </div>
                );
              })}
            </nav>
          </ScrollArea>
        </div>

        {/* Manufacturers */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <button
            onClick={() => setManufacturersExpanded(!manufacturersExpanded)}
            className="w-full flex items-center justify-between px-4 py-3.5 font-bold text-base hover:bg-muted/30 transition-colors"
          >
            <span>Производители</span>
            <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform duration-300", manufacturersExpanded && "rotate-180")} />
          </button>
          {manufacturersExpanded && (
            <div className="border-t border-border">
              <div className="p-3 pb-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Поиск..."
                    value={manufacturerSearch}
                    onChange={e => setManufacturerSearch(e.target.value)}
                    className="h-8 pl-8 text-sm"
                  />
                </div>
              </div>
              <ScrollArea className="h-48">
                <div className="px-2 pb-2 space-y-0.5">
                  {filteredManufacturers.map(mf => (
                    <label
                      key={mf.name}
                      className={cn(
                        "flex items-center gap-2.5 px-2 py-1.5 rounded-lg cursor-pointer transition-colors",
                        selectedManufacturers.includes(mf.name)
                          ? "bg-primary/10 text-foreground font-medium"
                          : "hover:bg-muted/50 text-foreground/80"
                      )}
                    >
                      <Checkbox
                        checked={selectedManufacturers.includes(mf.name)}
                        onCheckedChange={() => handleManufacturerToggle(mf.name)}
                        className="shrink-0"
                      />
                      <span className="flex-1 truncate text-sm">{mf.name}</span>
                      <span className="text-xs text-muted-foreground shrink-0">{mf.count}</span>
                    </label>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
