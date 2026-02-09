import { useState, useMemo } from 'react';
import { ChevronDown, ChevronLeft, X, LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product } from '@/lib/supabase';
import { ScrollArea } from '@/components/ui/scroll-area';

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

type MenuLevel = 'manufacturers' | 'categories' | 'types';

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
  const [isOpen, setIsOpen] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<MenuLevel>('manufacturers');
  const [currentManufacturer, setCurrentManufacturer] = useState<string | null>(null);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);

  const hasActiveFilters = selectedCategories.length > 0 || selectedSubcategories.length > 0 || selectedManufacturers.length > 0;

  // Build tree
  const manufacturerTree = useMemo(() => {
    const tree = new Map<string, Map<string, Map<string, number>>>();
    products.forEach((product) => {
      const producer = product.producer || 'Без производителя';
      const category = product.category || 'Без категории';
      const type = product.subcategory;
      if (!tree.has(producer)) tree.set(producer, new Map());
      const catMap = tree.get(producer)!;
      if (!catMap.has(category)) catMap.set(category, new Map());
      if (type) {
        const typeMap = catMap.get(category)!;
        typeMap.set(type, (typeMap.get(type) || 0) + 1);
      }
    });
    return tree;
  }, [products]);

  const manufacturerCounts = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach(p => {
      const key = p.producer || 'Без производителя';
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    return counts;
  }, [products]);

  const sortedManufacturers = useMemo(() =>
    Array.from(manufacturerTree.keys()).sort((a, b) => a.localeCompare(b, 'ru')),
    [manufacturerTree]
  );

  const currentCategories = useMemo(() => {
    if (!currentManufacturer) return [];
    const catMap = manufacturerTree.get(currentManufacturer);
    if (!catMap) return [];
    return Array.from(catMap.keys()).sort((a, b) => a.localeCompare(b, 'ru'));
  }, [currentManufacturer, manufacturerTree]);

  const currentTypes = useMemo(() => {
    if (!currentManufacturer || !currentCategory) return [];
    const catMap = manufacturerTree.get(currentManufacturer);
    if (!catMap) return [];
    const typeMap = catMap.get(currentCategory);
    if (!typeMap) return [];
    return Array.from(typeMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  }, [currentManufacturer, currentCategory, manufacturerTree]);

  const handleManufacturerSelect = (mf: string) => {
    setCurrentManufacturer(mf);
    setCurrentLevel('categories');
    onManufacturersChange([mf]);
    onCategoriesChange([]);
    onSubcategoriesChange([]);
  };

  const handleCategorySelect = (cat: string) => {
    setCurrentCategory(cat);
    setCurrentLevel('types');
    onCategoriesChange([cat]);
    onSubcategoriesChange([]);
  };

  const handleTypeSelect = (type: string) => {
    const newSubs = selectedSubcategories.includes(type)
      ? selectedSubcategories.filter(s => s !== type)
      : [type];
    onSubcategoriesChange(newSubs);
  };

  const goBack = () => {
    if (currentLevel === 'types') {
      setCurrentLevel('categories');
      setCurrentCategory(null);
      onSubcategoriesChange([]);
    } else if (currentLevel === 'categories') {
      setCurrentLevel('manufacturers');
      setCurrentManufacturer(null);
      onManufacturersChange([]);
      onCategoriesChange([]);
    }
  };

  const getTitle = () => {
    if (currentLevel === 'types' && currentCategory) return currentCategory;
    if (currentLevel === 'categories' && currentManufacturer) return currentManufacturer;
    return 'Каталог';
  };

  return (
    <div className="bg-card border-b border-border sticky top-[105px] z-30 md:hidden shadow-sm">
      {/* Top bar */}
      <div className="flex items-center gap-2 px-3 py-2">
        {/* View toggle */}
        <div className="flex items-center gap-0.5 shrink-0 border border-border rounded-lg p-0.5 bg-muted/30">
          <button
            onClick={() => onViewModeChange('grid')}
            className={cn(
              "p-2 rounded-md transition-all",
              viewMode === 'grid'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
            aria-label="Сетка"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewModeChange('compact')}
            className={cn(
              "p-2 rounded-md transition-all",
              viewMode === 'compact'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
            aria-label="Список"
          >
            <List className="h-4 w-4" />
          </button>
        </div>

        {/* Catalog button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm shrink-0 transition-all border font-medium",
            isOpen
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-background text-foreground border-border hover:border-primary/50"
          )}
        >
          Каталог
          <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
        </button>

        {/* Active filter chips */}
        {selectedManufacturers.length > 0 && (
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full truncate shrink-0">
            {selectedManufacturers[0]}
          </span>
        )}
        {selectedCategories.length > 0 && (
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full truncate shrink-0">
            {selectedCategories[0]}
          </span>
        )}

        {/* Clear */}
        {hasActiveFilters && (
          <button
            onClick={() => {
              onClearFilters();
              setCurrentLevel('manufacturers');
              setCurrentManufacturer(null);
              setCurrentCategory(null);
            }}
            className="flex items-center gap-1 px-2 py-2 rounded-lg text-sm shrink-0 text-destructive hover:bg-destructive/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="border-t border-border bg-background">
          {/* Breadcrumb / Back */}
          {currentLevel !== 'manufacturers' && (
            <button
              onClick={goBack}
              className="flex items-center gap-2 px-4 py-3 text-sm text-primary w-full border-b border-border hover:bg-muted/30 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>{getTitle()}</span>
            </button>
          )}

          <ScrollArea className="h-64">
            <div className="py-1">
              {/* Manufacturers level */}
              {currentLevel === 'manufacturers' && sortedManufacturers.map((mf) => (
                <button
                  key={mf}
                  onClick={() => handleManufacturerSelect(mf)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 text-left text-sm transition-colors",
                    selectedManufacturers.includes(mf)
                      ? "text-primary font-medium bg-primary/5"
                      : "text-foreground hover:bg-muted/50"
                  )}
                >
                  <span className="truncate pr-2">{mf}</span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {manufacturerCounts.get(mf) || 0}
                  </span>
                </button>
              ))}

              {/* Categories level */}
              {currentLevel === 'categories' && currentCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 text-left text-sm transition-colors",
                    selectedCategories.includes(cat)
                      ? "text-primary font-medium bg-primary/5"
                      : "text-foreground hover:bg-muted/50"
                  )}
                >
                  <span className="truncate pr-2">{cat}</span>
                </button>
              ))}

              {/* Types level */}
              {currentLevel === 'types' && currentTypes.map((t) => (
                <button
                  key={t.name}
                  onClick={() => handleTypeSelect(t.name)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 text-left text-sm transition-colors",
                    selectedSubcategories.includes(t.name)
                      ? "text-primary font-medium bg-primary/5"
                      : "text-foreground hover:bg-muted/50"
                  )}
                >
                  <span className="truncate pr-2">{t.name}</span>
                  <span className="text-xs text-muted-foreground shrink-0">{t.count}</span>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
