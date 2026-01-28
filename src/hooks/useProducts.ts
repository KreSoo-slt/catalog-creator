import { useQuery } from '@tanstack/react-query';
import { fetchAllProducts, fetchProductBySlug, Product } from '@/lib/supabase';

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
 * Хук для получения одного товара по slug
 */
export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => slug ? fetchProductBySlug(slug) : null,
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}
