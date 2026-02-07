import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, X, LayoutGrid, List, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product } from '@/lib/supabase';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';

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

type FilterType = 'manufacturers' | 'categories' | 'types' | null;

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
  const [expandedSection, setExpandedSection] = useState<FilterType>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Build manufacturers list (top level) - using producer field
  const manufacturers = useMemo(() => {
    const mfMap = new Map<string, number>();
    
    products.forEach((product) => {
      const mf = product.producer;
      if (mf) {
        mfMap.set(mf, (mfMap.get(mf) || 0) + 1);
      }
    });
    
    return Array.from(mfMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  }, [products]);

  // Build category list (second level)
  const categories = useMemo(() => {
    const catMap = new Map<string, number>();
    
    // Filter by selected manufacturers if any
    const filteredProducts = selectedManufacturers.length > 0
      ? products.filter(p => p.producer && selectedManufacturers.includes(p.producer))
      : products;
    
    filteredProducts.forEach((product) => {
      const cat = product.category;
      if (cat) {
        catMap.set(cat, (catMap.get(cat) || 0) + 1);
      }
    });
    
    return Array.from(catMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  }, [products, selectedManufacturers]);

  // Build types list (third level - using subcategory)
  const types = useMemo(() => {
    const typeMap = new Map<string, number>();
    
    // Filter by selected manufacturers and categories
    let filteredProducts = products;
    if (selectedManufacturers.length > 0) {
      filteredProducts = filteredProducts.filter(p => p.producer && selectedManufacturers.includes(p.producer));
    }
    if (selectedCategories.length > 0) {
      filteredProducts = filteredProducts.filter(p => p.category && selectedCategories.includes(p.category));
    }
    
    filteredProducts.forEach((product) => {
      const type = product.subcategory;
      if (type) {
        typeMap.set(type, (typeMap.get(type) || 0) + 1);
      }
    });
    
    return Array.from(typeMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  }, [products, selectedManufacturers, selectedCategories]);

  const hasActiveFilters = selectedCategories.length > 0 || selectedSubcategories.length > 0 || selectedManufacturers.length > 0;

  const handleManufacturerToggle = (manufacturer: string) => {
    const newManufacturers = selectedManufacturers.includes(manufacturer)
      ? selectedManufacturers.filter(m => m !== manufacturer)
      : [...selectedManufacturers, manufacturer];
    onManufacturersChange(newManufacturers);
    
    // Clear dependent filters when manufacturer changes
    if (!newManufacturers.includes(manufacturer)) {
      // If manufacturer was removed, we might need to clear categories/types
    }
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    onCategoriesChange(newCategories);
  };

  const handleTypeToggle = (type: string) => {
    const newSubcategories = selectedSubcategories.includes(type)
      ? selectedSubcategories.filter(s => s !== type)
      : [...selectedSubcategories, type];
    onSubcategoriesChange(newSubcategories);
  };

  const toggleSection = (section: FilterType) => {
    setExpandedSection(expandedSection === section ? null : section);
    setSearchQuery('');
  };

  const getFilteredItems = (items: { name: string; count: number }[]) => {
    if (!searchQuery) return items;
    return items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const renderFilterChip = (
    label: string,
    section: FilterType,
    selectedCount: number,
    itemsCount: number
  ) => (
    <button
      onClick={() => toggleSection(section)}
      className={cn(
        "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm shrink-0 transition-all border",
        selectedCount > 0 
          ? "bg-primary text-primary-foreground border-primary" 
          : "bg-background text-foreground border-border hover:border-primary/50"
      )}
    >
      <span className="font-medium">{label}</span>
      {selectedCount > 0 && (
        <span className="flex items-center justify-center min-w-5 h-5 bg-primary-foreground/20 rounded-full text-xs font-bold">
          {selectedCount}
        </span>
      )}
      {expandedSection === section 
        ? <ChevronUp className="h-4 w-4" /> 
        : <ChevronDown className="h-4 w-4" />
      }
    </button>
  );

  const renderFilterList = (
    items: { name: string; count: number }[],
    selectedItems: string[],
    onToggle: (item: string) => void
  ) => {
    const filtered = getFilteredItems(items);
    
    return (
      <div className="border-t border-border bg-background">
        {/* Search */}
        <div className="p-3 border-b border-border">
          <Input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9"
          />
        </div>
        
        <ScrollArea className="h-56">
          <div className="p-2 space-y-1">
            {filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Ничего не найдено
              </p>
            ) : (
              filtered.map((item) => (
                <label 
                  key={item.name} 
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                    selectedItems.includes(item.name) 
                      ? "bg-primary/10 border border-primary/30" 
                      : "bg-muted/30 hover:bg-muted/50"
                  )}
                >
                  <Checkbox
                    checked={selectedItems.includes(item.name)}
                    onCheckedChange={() => onToggle(item.name)}
                    className="shrink-0"
                  />
                  <span className="text-sm flex-1 truncate">{item.name}</span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {item.count}
                  </span>
                </label>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    );
  };

  return (
    <div className="bg-card border-b border-border sticky top-[60px] z-30 md:hidden">
      {/* Filter chips row */}
      <div className="flex items-center gap-2 px-3 py-2 overflow-x-auto no-scrollbar">
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

        {/* Manufacturer chip */}
        {renderFilterChip('Производитель', 'manufacturers', selectedManufacturers.length, manufacturers.length)}

        {/* Category chip */}
        {renderFilterChip('Категория', 'categories', selectedCategories.length, categories.length)}

        {/* Type chip - only show if there are types available */}
        {types.length > 0 && renderFilterChip('Тип', 'types', selectedSubcategories.length, types.length)}

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm shrink-0 bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20 transition-colors"
          >
            <X className="h-4 w-4" />
            Сброс
          </button>
        )}
      </div>

      {/* Expanded section */}
      {expandedSection === 'manufacturers' && 
        renderFilterList(manufacturers, selectedManufacturers, handleManufacturerToggle)
      }
      {expandedSection === 'categories' && 
        renderFilterList(categories, selectedCategories, handleCategoryToggle)
      }
      {expandedSection === 'types' && 
        renderFilterList(types, selectedSubcategories, handleTypeToggle)
      }
    </div>
  );
}
