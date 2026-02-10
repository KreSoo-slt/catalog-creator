import { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight, X, LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product } from '@/lib/supabase';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';

interface MobileFiltersProps {
  products: Product[];
  selectedCategories: string[];
  selectedSubcategories: string[];
  selectedManufacturers: string[];
  viewMode: 'grid' | 'compact';
  onCategoriesChange: (categories: string[]) => void;
  onSubcategoriesChange: (subcategories: string[]) => void;
  onManufacturersChange: (manufacturers: string[]) => void;
  onViewModeChange: (mode: 'grid' | 'compact') => void;
  onClearFilters: () => void;
}

type OpenPanel = 'manufacturers' | 'categories' | null;

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

export function MobileFilters({
  products,
  selectedCategories,
  selectedSubcategories,
  selectedManufacturers,
  viewMode,
  onCategoriesChange,
  onSubcategoriesChange,
  onManufacturersChange,
  onViewModeChange,
  onClearFilters,
}: MobileFiltersProps) {
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const hasActiveFilters = selectedCategories.length > 0 || selectedSubcategories.length > 0 || selectedManufacturers.length > 0;

  const manufacturers = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach(p => {
      if (p.producer) map.set(p.producer, (map.get(p.producer) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  }, [products]);

  const categoryTree = useMemo(() => {
    const filtered = selectedManufacturers.length > 0
      ? products.filter(p => p.producer && selectedManufacturers.includes(p.producer))
      : products;

    const map = new Map<string, { count: number; types: Map<string, number> }>();
    filtered.forEach(p => {
      const cat = p.category || 'Без категории';
      if (!map.has(cat)) map.set(cat, { count: 0, types: new Map() });
      const node = map.get(cat)!;
      node.count++;
      if (p.subcategory) {
        node.types.set(p.subcategory, (node.types.get(p.subcategory) || 0) + 1);
      }
    });

    const result = Array.from(map.entries())
      .map(([name, data]) => ({
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
    onSubcategoriesChange([]);
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
    onSubcategoriesChange([]);
  };

  const handleTypeClick = (name: string) => {
    const next = selectedSubcategories.includes(name)
      ? selectedSubcategories.filter(s => s !== name)
      : [name];
    onSubcategoriesChange(next);
  };

  return (
    <div className="bg-card border-b border-border sticky top-[105px] z-30 md:hidden shadow-sm">
      {/* Top bar */}
      <div className="flex items-center gap-2 px-3 py-2 overflow-x-auto no-scrollbar">
        {/* View toggle */}
        <div className="flex items-center gap-0.5 shrink-0 border border-border rounded-lg p-0.5 bg-muted/30">
          <button
            onClick={() => onViewModeChange('grid')}
            className={cn(
              "p-2 rounded-md transition-all",
              viewMode === 'grid' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            )}
            aria-label="Сетка"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewModeChange('compact')}
            className={cn(
              "p-2 rounded-md transition-all",
              viewMode === 'compact' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
            )}
            aria-label="Список"
          >
            <List className="h-4 w-4" />
          </button>
        </div>

        {/* Category chip */}
        <button
          onClick={() => setOpenPanel(openPanel === 'categories' ? null : 'categories')}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm shrink-0 transition-all border",
            selectedCategories.length > 0
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background text-foreground border-border hover:border-primary/50"
          )}
        >
          <span className="font-medium">Категория</span>
          {selectedCategories.length > 0 && (
            <span className="min-w-5 h-5 flex items-center justify-center bg-primary-foreground/20 rounded-full text-xs font-bold">
              {selectedCategories.length}
            </span>
          )}
          <ChevronDown className={cn("h-4 w-4 transition-transform", openPanel === 'categories' && "rotate-180")} />
        </button>

        {/* Manufacturer chip */}
        <button
          onClick={() => setOpenPanel(openPanel === 'manufacturers' ? null : 'manufacturers')}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm shrink-0 transition-all border",
            selectedManufacturers.length > 0
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background text-foreground border-border hover:border-primary/50"
          )}
        >
          <span className="font-medium">Производитель</span>
          {selectedManufacturers.length > 0 && (
            <span className="min-w-5 h-5 flex items-center justify-center bg-primary-foreground/20 rounded-full text-xs font-bold">
              {selectedManufacturers.length}
            </span>
          )}
          <ChevronDown className={cn("h-4 w-4 transition-transform", openPanel === 'manufacturers' && "rotate-180")} />
        </button>

        {/* Clear */}
        {hasActiveFilters && (
          <button
            onClick={() => {
              onClearFilters();
              setOpenPanel(null);
              setExpandedCategory(null);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm shrink-0 bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-colors"
          >
            <X className="h-4 w-4" />
            Сброс
          </button>
        )}
      </div>

      {/* Categories panel */}
      {openPanel === 'categories' && (
        <div className="border-t border-border bg-background">
          <ScrollArea className="h-72">
            <div className="py-1">
              {categoryTree.map(cat => {
                const isExpanded = expandedCategory === cat.name;
                const isSelected = selectedCategories.includes(cat.name);

                return (
                  <div key={cat.name}>
                    <button
                      onClick={() => handleCategoryClick(cat.name, cat.hasTypes)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-4 py-3 text-left transition-all",
                        isSelected
                          ? "bg-primary/10 text-foreground"
                          : "hover:bg-muted/40 text-foreground/90"
                      )}
                    >
                      {/* Arrow for expandable */}
                      {cat.hasTypes ? (
                        <div className={cn(
                          "flex items-center justify-center w-6 h-6 rounded-md shrink-0 transition-colors",
                          isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
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
                        "text-xs px-2 py-0.5 rounded-full shrink-0 font-semibold",
                        isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      )}>
                        {cat.count}
                      </span>
                    </button>

                    <AnimatedPanel open={isExpanded && cat.types.length > 0}>
                      <div className="border-l-2 border-primary/30 ml-7 bg-muted/10">
                        {cat.types.map(t => (
                          <button
                            key={t.name}
                            onClick={() => handleTypeClick(t.name)}
                            className={cn(
                              "w-full flex items-center gap-2 pl-4 pr-4 py-2.5 text-left transition-colors",
                              selectedSubcategories.includes(t.name)
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
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Manufacturers panel */}
      {openPanel === 'manufacturers' && (
        <div className="border-t border-border bg-background">
          <ScrollArea className="h-56">
            <div className="p-2 space-y-0.5">
              {manufacturers.map(mf => (
                <label
                  key={mf.name}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors",
                    selectedManufacturers.includes(mf.name)
                      ? "bg-primary/10 border border-primary/30"
                      : "hover:bg-muted/50"
                  )}
                >
                  <Checkbox
                    checked={selectedManufacturers.includes(mf.name)}
                    onCheckedChange={() => handleManufacturerToggle(mf.name)}
                    className="shrink-0"
                  />
                  <span className="text-sm flex-1 truncate font-medium">{mf.name}</span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{mf.count}</span>
                </label>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
