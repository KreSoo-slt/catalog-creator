import { useQuery } from '@tanstack/react-query';
import { fetchAllProducts, fetchProductById, Product } from '@/lib/supabase';

export type { Product };

/**
 * Хук для получения всех активных товаров из Supabase
 * Загружает все 2000+ товаров с пагинацией
 */
export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: fetchAllProducts,
    staleTime: 5 * 60 * 1000, // 5 минут
    gcTime: 10 * 60 * 1000, // 10 минут
  });
}

/**
 * Хук для получения одного товара по id
 */
export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => (id ? fetchProductById(id) : null),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}
