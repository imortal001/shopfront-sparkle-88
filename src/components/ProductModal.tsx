import { useState, useEffect } from 'react';
import { Product, ProductVariation, categories, categoryAttributes, attributeOptions } from '@/lib/productData';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  product?: Product | null;
}

export function ProductModal({ open, onClose, onSave, product }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    status: 'active' as 'active' | 'inactive',
    description: '',
    sku: '',
    images: ['/placeholder.svg']
  });
  const [variations, setVariations] = useState<ProductVariation[]>([]);
  const [showVariations, setShowVariations] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        price: product.price.toString(),
        stock: product.stock.toString(),
        status: product.status,
        description: product.description,
        sku: product.sku,
        images: product.images
      });
      setVariations(product.variations || []);
      setShowVariations((product.variations?.length || 0) > 0);
    } else {
      setFormData({
        name: '',
        category: '',
        price: '',
        stock: '',
        status: 'active',
        description: '',
        sku: '',
        images: ['/placeholder.svg']
      });
      setVariations([]);
      setShowVariations(false);
    }
  }, [product, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: parseFloat(formData.price),
      stock: showVariations ? variations.reduce((sum, v) => sum + v.stock, 0) : parseInt(formData.stock),
      variations: showVariations ? variations : undefined
    });
    onClose();
  };

  const addVariation = () => {
    const attrs = categoryAttributes[formData.category as keyof typeof categoryAttributes] || [];
    const newVariation: ProductVariation = {
      id: `var-${Date.now()}`,
      price: parseFloat(formData.price) || 0,
      stock: 0,
      sku: `${formData.sku}-VAR-${variations.length + 1}`
    };
    setVariations([...variations, newVariation]);
  };

  const updateVariation = (index: number, field: keyof ProductVariation, value: any) => {
    const updated = [...variations];
    updated[index] = { ...updated[index], [field]: value };
    setVariations(updated);
  };

  const removeVariation = (index: number) => {
    setVariations(variations.filter((_, i) => i !== index));
  };

  const getAttributesForCategory = () => {
    return categoryAttributes[formData.category as keyof typeof categoryAttributes] || [];
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="images">Product Images (URLs, comma separated)</Label>
              <Textarea
                id="images"
                value={formData.images.join(', ')}
                onChange={(e) => setFormData({ ...formData, images: e.target.value.split(',').map(s => s.trim()) })}
                rows={2}
                placeholder="/placeholder.svg, /placeholder.svg"
              />
            </div>

            {formData.category && getAttributesForCategory().length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Product Variations</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowVariations(!showVariations)}
                  >
                    {showVariations ? 'Hide' : 'Show'} Variations
                  </Button>
                </div>
                
                {showVariations && (
                  <div className="space-y-3 border rounded-lg p-4 bg-muted/30">
                    {variations.map((variation, index) => (
                      <div key={variation.id} className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 border rounded bg-background">
                        {getAttributesForCategory().map((attr) => (
                          <div key={attr} className="space-y-1">
                            <Label className="text-xs capitalize">{attr}</Label>
                            <Select
                              value={variation[attr as keyof ProductVariation] as string || ''}
                              onValueChange={(value) => updateVariation(index, attr as keyof ProductVariation, value)}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue placeholder={`Select ${attr}`} />
                              </SelectTrigger>
                              <SelectContent>
                                {(attributeOptions[attr as keyof typeof attributeOptions] || []).map((option) => (
                                  <SelectItem key={option} value={option}>{option}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                        <div className="space-y-1">
                          <Label className="text-xs">Price</Label>
                          <Input
                            type="number"
                            step="0.01"
                            className="h-8"
                            value={variation.price}
                            onChange={(e) => updateVariation(index, 'price', parseFloat(e.target.value))}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Stock</Label>
                          <Input
                            type="number"
                            className="h-8"
                            value={variation.stock}
                            onChange={(e) => updateVariation(index, 'stock', parseInt(e.target.value))}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">SKU</Label>
                          <Input
                            className="h-8"
                            value={variation.sku}
                            onChange={(e) => updateVariation(index, 'sku', e.target.value)}
                          />
                        </div>
                        <div className="flex items-end">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="h-8"
                            onClick={() => removeVariation(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addVariation}
                      className="w-full"
                    >
                      + Add Variation
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {product ? 'Update' : 'Add'} Product
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
