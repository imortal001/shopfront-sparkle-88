import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product, initialProducts } from '@/lib/productData';
import { ProductList } from '@/components/ProductList';
import { toast } from 'sonner';

const STORAGE_KEY = 'ecom_products';

const getProducts = (): Product[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : initialProducts;
};

const saveProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export default function ProductListPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>(getProducts());

  useEffect(() => {
    const handleStorageChange = () => {
      setProducts(getProducts());
    };
    
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(() => {
      setProducts(getProducts());
    }, 500);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleAdd = () => {
    navigate('/products/add');
  };

  const handleEdit = (product: Product) => {
    navigate(`/products/edit/${product.id}`);
  };

  const handleDelete = (id: string) => {
    const updatedProducts = products.filter(p => p.id !== id);
    setProducts(updatedProducts);
    saveProducts(updatedProducts);
    toast.success('Product deleted successfully');
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Product List</h1>
        <p className="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base">
          Manage your product inventory
        </p>
      </div>

      <ProductList
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />
    </div>
  );
}
