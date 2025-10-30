import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Product, categoryAttributes, attributeOptions, initialProducts } from '@/lib/productData';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, X, Upload } from 'lucide-react';
import { toast } from 'sonner';

const STORAGE_KEY = 'ecom_products';

const getProducts = (): Product[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : initialProducts;
};

const saveProducts = (products: Product[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export default function ProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  
  const [products, setProducts] = useState<Product[]>(getProducts());
  const existingProduct = isEdit ? products.find(p => p.id === id) : null;

  const [formData, setFormData] = useState({
    name: existingProduct?.name || '',
    sku: existingProduct?.sku || '',
    category: existingProduct?.category || '',
    price: existingProduct?.price || 0,
    stock: existingProduct?.stock || 0,
    status: existingProduct?.status || 'active' as 'active' | 'inactive',
    description: existingProduct?.description || '',
    images: existingProduct?.images || [] as string[],
    variations: existingProduct?.variations || []
  });

  const [imageInput, setImageInput] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const availableAttributes = formData.category 
    ? categoryAttributes[formData.category] || []
    : [];

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const result = e.target?.result as string;
            setFormData(prev => ({
              ...prev,
              images: [...prev.images, result]
            }));
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const addImage = () => {
    if (imageInput.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageInput.trim()]
      }));
      setImageInput('');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addVariation = () => {
    const newVariation: any = {
      id: Date.now().toString(),
      sku: `${formData.sku}-VAR-${formData.variations.length + 1}`,
      price: formData.price,
      stock: 0
    };

    availableAttributes.forEach(attr => {
      newVariation[attr] = '';
    });

    setFormData(prev => ({
      ...prev,
      variations: [...prev.variations, newVariation]
    }));
  };

  const updateVariation = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      variations: prev.variations.map((v, i) => 
        i === index ? { ...v, [field]: value } : v
      )
    }));
  };

  const removeVariation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variations: prev.variations.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.sku || !formData.category || formData.images.length === 0) {
      toast.error('Please fill all required fields and add at least one image');
      return;
    }

    const now = new Date();
    const dateTime = now.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    const product: Product = {
      ...formData,
      id: isEdit ? id : Date.now().toString(),
      createdAt: existingProduct?.createdAt || dateTime,
      updatedAt: isEdit ? dateTime : undefined
    };

    let updatedProducts: Product[];
    if (isEdit) {
      updatedProducts = products.map(p => p.id === id ? product : p);
    } else {
      updatedProducts = [...products, product];
    }
    
    saveProducts(updatedProducts);
    toast.success(isEdit ? 'Product updated successfully' : 'Product added successfully');
    navigate('/products/list');
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/products/list')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            {isEdit ? 'Update product details' : 'Create a new product'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                  placeholder="Enter SKU"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value, variations: [] }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Clothing">Clothing</SelectItem>
                    <SelectItem value="Shoes">Shoes</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'active' | 'inactive') => setFormData(prev => ({ ...prev, status: value }))}
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

              <div className="space-y-2">
                <Label htmlFor="price">Base Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock">Base Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) }))}
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter product description"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Product Images */}
        <Card>
          <CardHeader>
            <CardTitle>Product Images *</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Drag and Drop Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-primary bg-primary/5' : 'border-border'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm font-medium mb-2">Drag and drop images here</p>
              <p className="text-xs text-muted-foreground mb-4">or</p>
              <label htmlFor="file-upload" className="cursor-pointer">
                <Button type="button" variant="outline" asChild>
                  <span>Browse Files</span>
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
              </label>
            </div>

            {/* URL Input Option */}
            <div className="flex gap-2">
              <Input
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                placeholder="Or enter image URL"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
              />
              <Button type="button" onClick={addImage}>
                <Upload className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Product Variations */}
        {formData.category && availableAttributes.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Product Variations</CardTitle>
              <Button type="button" onClick={addVariation} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Variation
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.variations.map((variation, index) => (
                <Card key={variation.id}>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {availableAttributes.map(attr => (
                        <div key={attr} className="space-y-2">
                          <Label>{attr}</Label>
                          <Select
                            value={variation[attr as keyof typeof variation] as string || ''}
                            onValueChange={(value) => updateVariation(index, attr, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={`Select ${attr}`} />
                            </SelectTrigger>
                            <SelectContent>
                              {attributeOptions[attr]?.map(option => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      ))}

                      <div className="space-y-2">
                        <Label>SKU</Label>
                        <Input
                          value={variation.sku}
                          onChange={(e) => updateVariation(index, 'sku', e.target.value)}
                          placeholder="Variation SKU"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Price</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={variation.price}
                          onChange={(e) => updateVariation(index, 'price', parseFloat(e.target.value))}
                          placeholder="0.00"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Stock</Label>
                        <Input
                          type="number"
                          value={variation.stock}
                          onChange={(e) => updateVariation(index, 'stock', parseInt(e.target.value))}
                          placeholder="0"
                        />
                      </div>

                      <div className="flex items-end">
                        <Button
                          type="button"
                          variant="destructive"
                          onClick={() => removeVariation(index)}
                          className="w-full"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Form Actions */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/products/list')}
          >
            Cancel
          </Button>
          <Button type="submit">
            {isEdit ? 'Update Product' : 'Add Product'}
          </Button>
        </div>
      </form>
    </div>
  );
}
