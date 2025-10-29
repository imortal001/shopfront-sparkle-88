import { useState } from 'react';
import { Product, initialProducts } from '@/lib/productData';
import { ProductList } from '@/components/ProductList';
import { ProductModal } from '@/components/ProductModal';
import { toast } from 'sonner';

export default function ProductListPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleAdd = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success('Product deleted successfully');
  };

  const handleSave = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    if (editingProduct) {
      setProducts(products.map(p => 
        p.id === editingProduct.id 
          ? { ...productData, id: p.id, createdAt: p.createdAt }
          : p
      ));
      toast.success('Product updated successfully');
    } else {
      const newProduct: Product = {
        ...productData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0]
      };
      setProducts([...products, newProduct]);
      toast.success('Product added successfully');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Product List</h1>
        <p className="text-muted-foreground mt-2">
          Manage your product inventory
        </p>
      </div>

      <ProductList
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />

      <ProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        product={editingProduct}
      />
    </div>
  );
}
