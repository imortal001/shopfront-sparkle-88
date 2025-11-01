import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from './useAuth';

export interface Product {
  id: string;
  user_id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  description?: string;
  created_at: string;
  updated_at?: string;
  images?: ProductImage[];
  variations?: ProductVariation[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface ProductVariation {
  id: string;
  product_id: string;
  sku: string;
  price: number;
  stock: number;
  attributes: any;
  created_at: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchProducts = async () => {
    if (!user) {
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;

      // Fetch images and variations for all products
      const productsWithDetails = await Promise.all(
        (productsData || []).map(async (product) => {
          const { data: images } = await supabase
            .from('product_images')
            .select('*')
            .eq('product_id', product.id)
            .order('display_order');

          const { data: variations } = await supabase
            .from('product_variations')
            .select('*')
            .eq('product_id', product.id);

          return {
            ...product,
            images: images || [],
            variations: variations || [],
          };
        })
      );

      setProducts(productsWithDetails);
    } catch (error: any) {
      toast.error('Failed to fetch products: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error: any) {
      toast.error('Failed to delete product: ' + error.message);
    }
  };

  return { products, loading, fetchProducts, deleteProduct };
}
