import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Product, initialProducts } from '@/lib/productData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const STORAGE_KEY = 'ecom_products';

const getProducts = (): Product[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : initialProducts;
};

const saveProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');

  useEffect(() => {
    const products = getProducts();
    const foundProduct = products.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedImage(foundProduct.images[0] || '');
    } else {
      toast.error('Product not found');
      navigate('/products/list');
    }
  }, [id, navigate]);

  const handleDelete = () => {
    const products = getProducts();
    const updatedProducts = products.filter(p => p.id !== id);
    saveProducts(updatedProducts);
    toast.success('Product deleted successfully');
    navigate('/products/list');
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/products/list')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground mt-1">SKU: {product.sku}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/products/edit/${product.id}`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the product.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Images */}
        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedImage && (
              <div className="w-full h-96 rounded-lg border overflow-hidden">
                <img
                  src={selectedImage}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`w-full h-20 rounded border overflow-hidden transition-all ${
                    selectedImage === image ? 'ring-2 ring-primary' : 'hover:ring-2 ring-border'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Product Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{product.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                    {product.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium text-lg">${product.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stock</p>
                  <p className="font-medium">{product.stock} units</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created At</p>
                  <p className="font-medium">{product.createdAt}</p>
                </div>
                {product.updatedAt && (
                  <div>
                    <p className="text-sm text-muted-foreground">Updated At</p>
                    <p className="font-medium">{product.updatedAt}</p>
                  </div>
                )}
              </div>
              {product.description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Description</p>
                  <p className="text-sm">{product.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Product Variations */}
          {product.variations && product.variations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Product Variations ({product.variations.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {product.variations.map((variation, index) => (
                    <div
                      key={variation.id}
                      className="p-4 border rounded-lg space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Variation {index + 1}</h4>
                        <Badge variant="outline">{variation.sku}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(variation).map(([key, value]) => {
                          if (['id', 'sku'].includes(key)) return null;
                          return (
                            <div key={key}>
                              <span className="text-muted-foreground capitalize">{key}: </span>
                              <span className="font-medium">
                                {key === 'price' ? `$${value}` : value}
                                {key === 'stock' ? ' units' : ''}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
