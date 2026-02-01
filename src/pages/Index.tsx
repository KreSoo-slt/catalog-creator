import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, Package, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FilterSidebar } from '@/components/FilterSidebar';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ITEMS_OPTIONS = [24, 48, 96, 192];

type SortOption = 'default' | 'price-asc' | 'price-desc';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'default', label: 'По умолчанию' },
  { value: 'price-asc', label: 'Цена: по возрастанию' },
  { value: 'price-desc', label: 'Цена: по убыванию' },
];

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: products = [], isLoading, error } = useProducts();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  const [itemsPerPage, setItemsPerPage] = useState(48);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>('default');

  const searchQuery = searchParams.get('search') || '';

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, selectedSubcategories, selectedManufacturers, searchQuery, itemsPerPage, sortBy]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      // Category filter (multi-select) - handle "Без категории"
      if (selectedCategories.length > 0) {
        const productCategory = product.category || 'Без категории';
        if (!selectedCategories.includes(productCategory)) {
          return false;
        }
      }

      // Subcategory filter (multi-select)
      if (selectedSubcategories.length > 0 && (!product.subcategory || !selectedSubcategories.includes(product.subcategory))) {
        return false;
      }

      // Manufacturer filter (multi-select)
      if (selectedManufacturers.length > 0) {
        const productManufacturer = product.manufacturer || product.category;
        if (!productManufacturer || !selectedManufacturers.includes(productManufacturer)) {
          return false;
        }
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const name = (product.name || '').toLowerCase();
        const category = (product.category || '').toLowerCase();
        const description = (product.description || '').toLowerCase();
        const manufacturer = (product.manufacturer || '').toLowerCase();
        
        if (!name.includes(query) && !category.includes(query) && !description.includes(query) && !manufacturer.includes(query)) {
          return false;
        }
      }

      return true;
    });

    // Sort - use stable sort
    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return result;
  }, [products, selectedCategories, selectedSubcategories, selectedManufacturers, searchQuery, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setSelectedManufacturers([]);
    setSortBy('default');
    setSearchParams({});
  };

  // Page title
  const pageTitle = searchQuery
    ? `Поиск: "${searchQuery}"`
    : selectedCategories.length === 1
      ? selectedCategories[0]
      : 'Все товары';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <div className="container py-6">
          {/* Page header */}
          <div className="flex flex-col gap-4 mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">{pageTitle}</h1>
              <p className="text-muted-foreground text-sm mt-1">
                {isLoading ? 'Загрузка...' : `${filteredProducts.length} товаров из ${products.length}`}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Sort */}
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as SortOption)}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <ArrowUpDown className="h-4 w-4 mr-2 shrink-0" />
                  <SelectValue placeholder="Сортировка" />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Items per page */}
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => setItemsPerPage(Number(value))}
              >
                <SelectTrigger className="w-28 sm:w-32">
                  <SelectValue placeholder="На странице" />
                </SelectTrigger>
                <SelectContent>
                  {ITEMS_OPTIONS.map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} шт.
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            {/* Sidebar */}
            <FilterSidebar
              products={products}
              selectedCategories={selectedCategories}
              selectedSubcategories={selectedSubcategories}
              selectedManufacturers={selectedManufacturers}
              viewMode={viewMode}
              onCategoriesChange={setSelectedCategories}
              onSubcategoriesChange={setSelectedSubcategories}
              onManufacturersChange={setSelectedManufacturers}
              onViewModeChange={setViewMode}
              onClearFilters={handleClearFilters}
            />

            {/* Products */}
            <div className="flex-1 min-w-0">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Загрузка товаров...</p>
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <p className="text-destructive font-medium">Ошибка загрузки товаров</p>
                  <p className="text-muted-foreground text-sm mt-2">Попробуйте обновить страницу</p>
                </div>
              ) : paginatedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <Package className="h-16 w-16 mb-4 opacity-20" />
                  <p className="font-medium">Товары не найдены</p>
                  <p className="text-sm mt-1">Попробуйте изменить параметры фильтра</p>
                  <Button variant="outline" className="mt-4" onClick={handleClearFilters}>
                    Сбросить фильтры
                  </Button>
                </div>
              ) : (
                <>
                  {/* Products grid */}
                  <div className={
                    viewMode === 'compact' 
                      ? 'grid grid-cols-1 gap-2' 
                      : 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3'
                  }>
                    {paginatedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} viewMode={viewMode} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                          let pageNum: number;
                          if (totalPages <= 7) {
                            pageNum = i + 1;
                          } else if (currentPage <= 4) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 3) {
                            pageNum = totalPages - 6 + i;
                          } else {
                            pageNum = currentPage - 3 + i;
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? 'default' : 'ghost'}
                              size="sm"
                              className="w-9"
                              onClick={() => setCurrentPage(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      
                      <span className="text-sm text-muted-foreground ml-4">
                        Страница {currentPage} из {totalPages}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
