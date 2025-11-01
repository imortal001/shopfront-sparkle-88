import { useNavigate } from 'react-router-dom';
import { ProductList } from '@/components/ProductList';
import { useProducts, Product } from '@/hooks/useProducts';

export default function ProductListPage() {
  const navigate = useNavigate();
  const { products, loading, deleteProduct } = useProducts();

  const handleAdd = () => {
    navigate('/products/add');
  };

  const handleEdit = (product: Product) => {
    navigate(`/products/edit/${product.id}`);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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
