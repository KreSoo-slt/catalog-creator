import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, X, LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Build category list
  const categories = useMemo(() => {
    const catMap = new Map<string, number>();
    
    products.forEach((product) => {
      const cat = product.category || 'Без категории';
      catMap.set(cat, (catMap.get(cat) || 0) + 1);
    });
    
    return Array.from(catMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  }, [products]);

  // Build manufacturers list
  const manufacturers = useMemo(() => {
    const mfMap = new Map<string, number>();
    
    products.forEach((product) => {
      const mf = product.manufacturer || product.category;
      if (mf) {
        mfMap.set(mf, (mfMap.get(mf) || 0) + 1);
      }
    });
    
    return Array.from(mfMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  }, [products]);

  const hasActiveFilters = selectedCategories.length > 0 || selectedSubcategories.length > 0 || selectedManufacturers.length > 0;

  const handleCategoryToggle = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    onCategoriesChange(newCategories);
  };

  const handleManufacturerToggle = (manufacturer: string) => {
    const newManufacturers = selectedManufacturers.includes(manufacturer)
      ? selectedManufacturers.filter(m => m !== manufacturer)
      : [...selectedManufacturers, manufacturer];
    onManufacturersChange(newManufacturers);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="bg-card border-b border-border sticky top-[108px] z-30 md:hidden">
      {/* Filter chips row */}
      <div className="flex items-center gap-2 px-4 py-2 overflow-x-auto no-scrollbar">
        {/* View toggle */}
        <div className="flex items-center gap-1 shrink-0 border border-border rounded-lg p-1">
          <button
            onClick={() => onViewModeChange('grid')}
            className={cn(
              "p-1.5 rounded",
              viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
            )}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewModeChange('compact')}
            className={cn(
              "p-1.5 rounded",
              viewMode === 'compact' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
            )}
          >
            <List className="h-4 w-4" />
          </button>
        </div>

        {/* Category chip */}
        <button
          onClick={() => toggleSection('categories')}
          className={cn(
            "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm shrink-0 transition-colors",
            selectedCategories.length > 0 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted text-foreground"
          )}
        >
          Категории
          {selectedCategories.length > 0 && (
            <span className="bg-primary-foreground/20 px-1.5 rounded-full text-xs">
              {selectedCategories.length}
            </span>
          )}
          {expandedSection === 'categories' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>

        {/* Manufacturer chip */}
        <button
          onClick={() => toggleSection('manufacturers')}
          className={cn(
            "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm shrink-0 transition-colors",
            selectedManufacturers.length > 0 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted text-foreground"
          )}
        >
          Производители
          {selectedManufacturers.length > 0 && (
            <span className="bg-primary-foreground/20 px-1.5 rounded-full text-xs">
              {selectedManufacturers.length}
            </span>
          )}
          {expandedSection === 'manufacturers' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm shrink-0 bg-destructive/10 text-destructive"
          >
            <X className="h-3 w-3" />
            Сбросить
          </button>
        )}
      </div>

      {/* Expanded section */}
      {expandedSection && (
        <div className="border-t border-border bg-background">
          <ScrollArea className="h-48">
            <div className="p-3 grid grid-cols-2 gap-2">
              {expandedSection === 'categories' && categories.map((cat) => (
                <label 
                  key={cat.name} 
                  className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 cursor-pointer"
                >
                  <Checkbox
                    checked={selectedCategories.includes(cat.name)}
                    onCheckedChange={() => handleCategoryToggle(cat.name)}
                  />
                  <span className="text-sm truncate flex-1">{cat.name}</span>
                  <span className="text-xs text-muted-foreground">{cat.count}</span>
                </label>
              ))}
              {expandedSection === 'manufacturers' && manufacturers.map((mf) => (
                <label 
                  key={mf.name} 
                  className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 cursor-pointer"
                >
                  <Checkbox
                    checked={selectedManufacturers.includes(mf.name)}
                    onCheckedChange={() => handleManufacturerToggle(mf.name)}
                  />
                  <span className="text-sm truncate flex-1">{mf.name}</span>
                  <span className="text-xs text-muted-foreground">{mf.count}</span>
                </label>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
