import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Filter, X, LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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

interface CategoryNode {
  name: string;
  count: number;
  subcategories: Map<string, number>;
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
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['categories', 'manufacturers', 'types'])
  );
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [searchCategory, setSearchCategory] = useState('');
  const [searchManufacturer, setSearchManufacturer] = useState('');
  const [searchType, setSearchType] = useState('');

  // Build category tree
  const categories = useMemo(() => {
    const catMap = new Map<string, CategoryNode>();
    
    products.forEach((product) => {
      const cat = product.category || 'Без категории';
      
      if (!catMap.has(cat)) {
        catMap.set(cat, { name: cat, count: 0, subcategories: new Map() });
      }
      
      const node = catMap.get(cat)!;
      node.count++;
      
      if (product.subcategory) {
        const currentCount = node.subcategories.get(product.subcategory) || 0;
        node.subcategories.set(product.subcategory, currentCount + 1);
      }
    });
    
    return Array.from(catMap.values()).sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  }, [products]);

  // Build types list (subcategory as "Type")
  const types = useMemo(() => {
    const typeMap = new Map<string, number>();
    
    products.forEach((product) => {
      const type = product.subcategory;
      if (type) {
        typeMap.set(type, (typeMap.get(type) || 0) + 1);
      }
    });
    
    return Array.from(typeMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  }, [products]);

  // Build manufacturers list (using producer field)
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

  const hasActiveFilters = selectedCategories.length > 0 || selectedSubcategories.length > 0 || selectedTypes.length > 0 || selectedManufacturers.length > 0;

  const toggleSection = (section: string) => {
    const next = new Set(expandedSections);
    if (next.has(section)) {
      next.delete(section);
    } else {
      next.add(section);
    }
    setExpandedSections(next);
  };

  const toggleCategory = (category: string) => {
    const next = new Set(expandedCategories);
    if (next.has(category)) {
      next.delete(category);
    } else {
      next.add(category);
    }
    setExpandedCategories(next);
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    onCategoriesChange(newCategories);
  };

  const handleSubcategoryToggle = (subcategory: string) => {
    const newSubcategories = selectedSubcategories.includes(subcategory)
      ? selectedSubcategories.filter(s => s !== subcategory)
      : [...selectedSubcategories, subcategory];
    onSubcategoriesChange(newSubcategories);
  };

  const handleManufacturerToggle = (manufacturer: string) => {
    const newManufacturers = selectedManufacturers.includes(manufacturer)
      ? selectedManufacturers.filter(m => m !== manufacturer)
      : [...selectedManufacturers, manufacturer];
    onManufacturersChange(newManufacturers);
  };

  const handleTypeToggle = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    onTypesChange(newTypes);
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchCategory.toLowerCase())
  );

  const filteredManufacturers = manufacturers.filter(mf => 
    mf.name.toLowerCase().includes(searchManufacturer.toLowerCase())
  );

  const filteredTypes = types.filter(t => 
    t.name.toLowerCase().includes(searchType.toLowerCase())
  );

  const SidebarContent = () => (
    <div className="space-y-4">
      {/* View Mode Toggle */}
      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
        <span className="text-sm font-medium flex-1">Вид:</span>
        <Button
          variant={viewMode === 'grid' ? 'default' : 'ghost'}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onViewModeChange('grid')}
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === 'compact' ? 'default' : 'ghost'}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onViewModeChange('compact')}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onClearFilters}
        >
          <X className="h-4 w-4 mr-2" />
          Сбросить фильтры ({selectedCategories.length + selectedSubcategories.length + selectedTypes.length + selectedManufacturers.length})
        </Button>
      )}

      {/* Categories Section */}
      <div className="border border-border rounded-lg overflow-hidden">
        <button
          className="w-full flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition-colors"
          onClick={() => toggleSection('categories')}
        >
          <span className="font-semibold text-sm">Категории</span>
          {expandedSections.has('categories') ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        
        {expandedSections.has('categories') && (
          <div className="p-2">
            <input
              type="text"
              placeholder="Поиск категории..."
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md mb-2 bg-background"
            />
            <ScrollArea className="h-[250px]">
              <div className="space-y-1 pr-3">
                {filteredCategories.map((cat) => (
                  <div key={cat.name}>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id={`cat-${cat.name}`}
                        checked={selectedCategories.includes(cat.name)}
                        onCheckedChange={() => handleCategoryToggle(cat.name)}
                      />
                      <label
                        htmlFor={`cat-${cat.name}`}
                        className="flex-1 text-sm cursor-pointer py-1"
                      >
                        {cat.name}
                        <span className="text-muted-foreground ml-1">({cat.count})</span>
                      </label>
                      {cat.subcategories.size > 0 && (
                        <button
                          className="p-1 hover:bg-muted rounded"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCategory(cat.name);
                          }}
                        >
                          {expandedCategories.has(cat.name) ? (
                            <ChevronDown className="h-3 w-3" />
                          ) : (
                            <ChevronRight className="h-3 w-3" />
                          )}
                        </button>
                      )}
                    </div>
                    
                    {/* Subcategories */}
                    {expandedCategories.has(cat.name) && cat.subcategories.size > 0 && (
                      <div className="ml-6 mt-1 space-y-1 border-l-2 border-muted pl-3">
                        {Array.from(cat.subcategories.entries()).map(([subName, subCount]) => (
                          <div key={subName} className="flex items-center gap-2">
                            <Checkbox
                              id={`sub-${subName}`}
                              checked={selectedSubcategories.includes(subName)}
                              onCheckedChange={() => handleSubcategoryToggle(subName)}
                            />
                            <label
                              htmlFor={`sub-${subName}`}
                              className="text-sm cursor-pointer text-muted-foreground hover:text-foreground py-0.5"
                            >
                              {subName}
                              <span className="ml-1">({subCount})</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      {/* Manufacturers Section */}
      <div className="border border-border rounded-lg overflow-hidden">
        <button
          className="w-full flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition-colors"
          onClick={() => toggleSection('manufacturers')}
        >
          <span className="font-semibold text-sm">Производители</span>
          {expandedSections.has('manufacturers') ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        
        {expandedSections.has('manufacturers') && (
          <div className="p-2">
            <input
              type="text"
              placeholder="Поиск производителя..."
              value={searchManufacturer}
              onChange={(e) => setSearchManufacturer(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md mb-2 bg-background"
            />
            <ScrollArea className="h-[200px]">
              <div className="space-y-1 pr-3">
                {filteredManufacturers.map((mf) => (
                  <div key={mf.name} className="flex items-center gap-2">
                    <Checkbox
                      id={`mf-${mf.name}`}
                      checked={selectedManufacturers.includes(mf.name)}
                      onCheckedChange={() => handleManufacturerToggle(mf.name)}
                    />
                    <label
                      htmlFor={`mf-${mf.name}`}
                      className="flex-1 text-sm cursor-pointer py-1"
                    >
                      {mf.name}
                      <span className="text-muted-foreground ml-1">({mf.count})</span>
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>

      {/* Types Section */}
      <div className="border border-border rounded-lg overflow-hidden">
        <button
          className="w-full flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition-colors"
          onClick={() => toggleSection('types')}
        >
          <span className="font-semibold text-sm">Тип</span>
          {expandedSections.has('types') ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        
        {expandedSections.has('types') && (
          <div className="p-2">
            <input
              type="text"
              placeholder="Поиск типа..."
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md mb-2 bg-background"
            />
            <ScrollArea className="h-[200px]">
              <div className="space-y-1 pr-3">
                {filteredTypes.map((t) => (
                  <div key={t.name} className="flex items-center gap-2">
                    <Checkbox
                      id={`type-${t.name}`}
                      checked={selectedTypes.includes(t.name)}
                      onCheckedChange={() => handleTypeToggle(t.name)}
                    />
                    <label
                      htmlFor={`type-${t.name}`}
                      className="flex-1 text-sm cursor-pointer py-1"
                    >
                      {t.name}
                      <span className="text-muted-foreground ml-1">({t.count})</span>
                    </label>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );

  // Desktop only - mobile uses MobileFilters component
  return (
    <aside className="hidden lg:block w-72 shrink-0">
      <div className="sticky top-24 bg-card border border-border rounded-lg p-4">
        <h2 className="font-semibold flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5" />
          Фильтры
        </h2>
        <SidebarContent />
      </div>
    </aside>
  );
}
