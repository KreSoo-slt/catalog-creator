import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FilterSidebar } from '@/components/FilterSidebar';
import { MobileFilters } from '@/components/MobileFilters';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ITEMS_OPTIONS = [24, 48, 96, 192];

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: products = [], isLoading, error } = useProducts();

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  const [itemsPerPage, setItemsPerPage] = useState(48);
  const [currentPage, setCurrentPage] = useState(1);

  const searchQuery = searchParams.get('search') || '';

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, selectedSubcategories, selectedTypes, selectedManufacturers, searchQuery, itemsPerPage]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category filter (multi-select)
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

      // Type filter (uses subcategory field)
      if (selectedTypes.length > 0 && (!product.subcategory || !selectedTypes.includes(product.subcategory))) {
        return false;
      }

      // Manufacturer filter (multi-select) - using producer field
      if (selectedManufacturers.length > 0) {
        const productProducer = product.producer;
        if (!productProducer || !selectedManufacturers.includes(productProducer)) {
          return false;
        }
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const name = (product.name || '').toLowerCase();
        const category = (product.category || '').toLowerCase();
        const description = (product.description || '').toLowerCase();
        const producer = (product.producer || '').toLowerCase();
        
        if (!name.includes(query) && !category.includes(query) && !description.includes(query) && !producer.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [products, selectedCategories, selectedSubcategories, selectedTypes, selectedManufacturers, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedSubcategories([]);
    setSelectedTypes([]);
    setSelectedManufacturers([]);
    setSearchParams({});
  };

  // Page title
  const pageTitle = searchQuery
    ? `Поиск: "${searchQuery}"`
    : selectedCategories.length === 1
      ? selectedCategories[0]
      : 'Все товары';

  // Breadcrumbs
  const breadcrumbs = useMemo(() => {
    const crumbs: { label: string; onClick?: () => void }[] = [
      { label: 'Все товары', onClick: handleClearFilters },
    ];
    if (selectedManufacturers.length === 1) {
      crumbs.push({ label: selectedManufacturers[0], onClick: () => { setSelectedCategories([]); setSelectedSubcategories([]); setSelectedTypes([]); } });
    } else if (selectedManufacturers.length > 1) {
      crumbs.push({ label: `${selectedManufacturers.length} производителей`, onClick: () => { setSelectedCategories([]); setSelectedSubcategories([]); setSelectedTypes([]); } });
    }
    if (selectedCategories.length === 1) {
      crumbs.push({ label: selectedCategories[0], onClick: () => { setSelectedSubcategories([]); setSelectedTypes([]); } });
    }
    if (selectedTypes.length === 1) {
      crumbs.push({ label: selectedTypes[0] });
    } else if (selectedSubcategories.length === 1) {
      crumbs.push({ label: selectedSubcategories[0] });
    }
    return crumbs;
  }, [selectedManufacturers, selectedCategories, selectedTypes, selectedSubcategories]);

  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <Header />

      {/* Mobile filters */}
      <MobileFilters
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

      <main className="flex-1">
        <div className="container py-4 md:py-6">
          {/* Breadcrumbs */}
          {breadcrumbs.length > 1 && (
            <nav className="flex items-center gap-1 text-sm mb-4 flex-wrap">
              {breadcrumbs.map((crumb, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <span className="text-muted-foreground mx-1">/</span>}
                  {crumb.onClick && i < breadcrumbs.length - 1 ? (
                    <button
                      onClick={crumb.onClick}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {crumb.label}
                    </button>
                  ) : (
                    <span className="font-medium text-foreground">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}

          {/* Page header - desktop only */}
          <div className="hidden md:flex flex-col gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold">{pageTitle}</h1>
              <p className="text-muted-foreground text-sm mt-1">
                {isLoading ? 'Загрузка...' : `${filteredProducts.length} товаров из ${products.length}`}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Items per page */}
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => setItemsPerPage(Number(value))}
              >
                <SelectTrigger className="w-32">
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

          {/* Mobile items per page */}
          <div className="md:hidden flex items-center gap-2 mb-4">
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(value) => setItemsPerPage(Number(value))}
            >
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ITEMS_OPTIONS.map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} шт.
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">
              Найдено: {filteredProducts.length}
            </span>
          </div>

          <div className="flex gap-6">
            {/* Desktop Sidebar */}
            <FilterSidebar
              products={products}
              selectedCategories={selectedCategories}
              selectedSubcategories={selectedSubcategories}
              selectedTypes={selectedTypes}
              selectedManufacturers={selectedManufacturers}
              viewMode={viewMode}
              onCategoriesChange={setSelectedCategories}
              onSubcategoriesChange={setSelectedSubcategories}
              onTypesChange={setSelectedTypes}
              onManufacturersChange={setSelectedManufacturers}
              onViewModeChange={setViewMode}
              onClearFilters={handleClearFilters}
            />
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
