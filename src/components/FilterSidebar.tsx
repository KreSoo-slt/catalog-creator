import { useState, useMemo } from 'react';
import { ChevronDown, X, LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const [expandedManufacturer, setExpandedManufacturer] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const hasActiveFilters = selectedCategories.length > 0 || selectedSubcategories.length > 0 || selectedTypes.length > 0 || selectedManufacturers.length > 0;

  // Build manufacturers with their categories
  const manufacturerTree = useMemo(() => {
    const tree = new Map<string, Map<string, Map<string, number>>>();

    products.forEach((product) => {
      const producer = product.producer || 'Без производителя';
      const category = product.category || 'Без категории';
      const type = product.subcategory;

      if (!tree.has(producer)) tree.set(producer, new Map());
      const catMap = tree.get(producer)!;
      if (!catMap.has(category)) catMap.set(category, new Map());
      const typeMap = catMap.get(category)!;
      if (type) {
        typeMap.set(type, (typeMap.get(type) || 0) + 1);
      }
    });

    return tree;
  }, [products]);

  // Get counts
  const manufacturerCounts = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach(p => {
      const key = p.producer || 'Без производителя';
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    return counts;
  }, [products]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach(p => {
      const key = p.category || 'Без категории';
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    return counts;
  }, [products]);

  const sortedManufacturers = useMemo(() =>
    Array.from(manufacturerTree.keys()).sort((a, b) => a.localeCompare(b, 'ru')),
    [manufacturerTree]
  );

  const handleManufacturerClick = (mf: string) => {
    if (expandedManufacturer === mf) {
      setExpandedManufacturer(null);
    } else {
      setExpandedManufacturer(mf);
      setExpandedCategory(null);
    }
    // Select/deselect manufacturer
    const newMf = selectedManufacturers.includes(mf)
      ? selectedManufacturers.filter(m => m !== mf)
      : [mf];
    onManufacturersChange(newMf);
    onCategoriesChange([]);
    onTypesChange([]);
  };

  const handleCategoryClick = (cat: string) => {
    if (expandedCategory === cat) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(cat);
    }
    const newCats = selectedCategories.includes(cat)
      ? selectedCategories.filter(c => c !== cat)
      : [cat];
    onCategoriesChange(newCats);
    onTypesChange([]);
  };

  const handleTypeClick = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [type];
    onTypesChange(newTypes);
  };

  // Get categories for current expanded manufacturer
  const currentCategories = useMemo(() => {
    if (!expandedManufacturer) return [];
    const catMap = manufacturerTree.get(expandedManufacturer);
    if (!catMap) return [];
    return Array.from(catMap.keys()).sort((a, b) => a.localeCompare(b, 'ru'));
  }, [expandedManufacturer, manufacturerTree]);

  // Get types for current expanded category
  const currentTypes = useMemo(() => {
    if (!expandedManufacturer || !expandedCategory) return [];
    const catMap = manufacturerTree.get(expandedManufacturer);
    if (!catMap) return [];
    const typeMap = catMap.get(expandedCategory);
    if (!typeMap) return [];
    return Array.from(typeMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  }, [expandedManufacturer, expandedCategory, manufacturerTree]);

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-24 bg-card border border-border rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="font-bold text-base">Каталог</h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => onViewModeChange('compact')}
              className={cn(
                "p-1.5 rounded-md transition-colors",
                viewMode === 'compact' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <div className="px-4 pt-3">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={onClearFilters}
            >
              <X className="h-4 w-4 mr-1" />
              Сбросить фильтры
            </Button>
          </div>
        )}

        {/* Accordion menu */}
        <ScrollArea className="h-[calc(100vh-200px)]">
          <nav className="py-2">
            {sortedManufacturers.map((mf) => {
              const isExpanded = expandedManufacturer === mf;
              const isSelected = selectedManufacturers.includes(mf);
              const count = manufacturerCounts.get(mf) || 0;

              return (
                <div key={mf}>
                  {/* Manufacturer row */}
                  <button
                    onClick={() => handleManufacturerClick(mf)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3 text-left transition-colors border-l-3",
                      isSelected
                        ? "bg-primary/10 border-l-primary font-semibold text-foreground"
                        : "border-l-transparent hover:bg-muted/50 text-foreground/80"
                    )}
                  >
                    <span className="text-sm truncate pr-2">{mf}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground">{count}</span>
                      <ChevronDown className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform duration-200",
                        isExpanded && "rotate-180"
                      )} />
                    </div>
                  </button>

                  {/* Categories under manufacturer */}
                  {isExpanded && currentCategories.length > 0 && (
                    <div className="bg-muted/20">
                      {currentCategories.map((cat) => {
                        const isCatExpanded = expandedCategory === cat;
                        const isCatSelected = selectedCategories.includes(cat);

                        return (
                          <div key={cat}>
                            <button
                              onClick={() => handleCategoryClick(cat)}
                              className={cn(
                                "w-full flex items-center justify-between pl-8 pr-4 py-2.5 text-left transition-colors",
                                isCatSelected
                                  ? "text-primary font-medium"
                                  : "text-foreground/70 hover:text-foreground"
                              )}
                            >
                              <span className="text-sm truncate pr-2">{cat}</span>
                              <ChevronDown className={cn(
                                "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 shrink-0",
                                isCatExpanded && "rotate-180"
                              )} />
                            </button>

                            {/* Types under category */}
                            {isCatExpanded && currentTypes.length > 0 && (
                              <div className="bg-muted/10">
                                {currentTypes.map((t) => (
                                  <button
                                    key={t.name}
                                    onClick={() => handleTypeClick(t.name)}
                                    className={cn(
                                      "w-full text-left pl-12 pr-4 py-2 text-sm transition-colors",
                                      selectedTypes.includes(t.name)
                                        ? "text-primary font-medium"
                                        : "text-muted-foreground hover:text-foreground"
                                    )}
                                  >
                                    {t.name}
                                    <span className="ml-1 text-xs opacity-60">({t.count})</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </ScrollArea>
      </div>
    </aside>
  );
}
