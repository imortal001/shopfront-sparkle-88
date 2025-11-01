import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { categoryAttributes, attributeOptions } from '@/lib/productData';
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
import { useAuth } from '@/hooks/useAuth';

export default function ProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isEdit = !!id;
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    price: 0,
    stock: 0,
    status: 'active' as 'active' | 'inactive',
    description: '',
    images: [] as File[],
    imageUrls: [] as string[],
    variations: [] as any[]
  });

  const [dragActive, setDragActive] = useState(false);

  const availableAttributes = formData.category 
    ? categoryAttributes[formData.category] || []
    : [];

  useEffect(() => {
    if (isEdit && id) {
      fetchProduct(id);
    }
  }, [id, isEdit]);

  const fetchProduct = async (productId: string) => {
    try {
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (productError) throw productError;

      const { data: images } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', productId)
        .order('display_order');

      const { data: variations } = await supabase
        .from('product_variations')
        .select('*')
        .eq('product_id', productId);

      setFormData({
        name: product.name,
        sku: product.sku,
        category: product.category,
        price: product.price,
        stock: product.stock,
        status: product.status,
        description: product.description || '',
        images: [],
        imageUrls: images?.map(img => img.image_url) || [],
        variations: variations || []
      });
    } catch (error: any) {
      toast.error('Failed to fetch product: ' + error.message);
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newFiles]
      }));
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

  const removeNewImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const removeExistingImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index)
    }));
  };

  const addVariation = () => {
    const newVariation: any = {
      id: `temp-${Date.now()}`,
      sku: `${formData.sku}-VAR-${formData.variations.length + 1}`,
      price: formData.price,
      stock: 0,
      attributes: {}
    };

    availableAttributes.forEach(attr => {
      newVariation.attributes[attr] = '';
    });

    setFormData(prev => ({
      ...prev,
      variations: [...prev.variations, newVariation]
    }));
  };

  const updateVariation = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      variations: prev.variations.map((v, i) => {
        if (i === index) {
          if (field.startsWith('attr_')) {
            const attrName = field.replace('attr_', '');
            return {
              ...v,
              attributes: { ...v.attributes, [attrName]: value }
            };
          }
          return { ...v, [field]: value };
        }
        return v;
      })
    }));
  };

  const removeVariation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variations: prev.variations.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.sku || !formData.category) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!isEdit && formData.images.length === 0) {
      toast.error('Please add at least one product image');
      return;
    }

    if (!user) {
      toast.error('You must be logged in');
      return;
    }

    setLoading(true);

    try {
      let productId = id;

      // Create or update product
      if (isEdit) {
        const { error } = await supabase
          .from('products')
          .update({
            name: formData.name,
            sku: formData.sku,
            category: formData.category,
            price: formData.price,
            stock: formData.stock,
            status: formData.status,
            description: formData.description,
          })
          .eq('id', id);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert({
            user_id: user.id,
            name: formData.name,
            sku: formData.sku,
            category: formData.category,
            price: formData.price,
            stock: formData.stock,
            status: formData.status,
            description: formData.description,
          })
          .select()
          .single();

        if (error) throw error;
        productId = data.id;
      }

      // Upload new images
      if (formData.images.length > 0) {
        for (let i = 0; i < formData.images.length; i++) {
          const file = formData.images[i];
          const fileExt = file.name.split('.').pop();
          const fileName = `${productId}/${Date.now()}-${i}.${fileExt}`;

          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);

          await supabase
            .from('product_images')
            .insert({
              product_id: productId,
              image_url: publicUrl,
              display_order: formData.imageUrls.length + i
            });
        }
      }

      // Handle variations
      if (isEdit) {
        // Delete existing variations
        await supabase
          .from('product_variations')
          .delete()
          .eq('product_id', productId);
      }

      // Insert new variations
      if (formData.variations.length > 0) {
        const variationsToInsert = formData.variations.map(v => ({
          product_id: productId,
          sku: v.sku,
          price: v.price,
          stock: v.stock,
          attributes: v.attributes
        }));

        await supabase
          .from('product_variations')
          .insert(variationsToInsert);
      }

      toast.success(isEdit ? 'Product updated successfully' : 'Product added successfully');
      navigate('/products/list');
    } catch (error: any) {
      toast.error('Error saving product: ' + error.message);
    } finally {
      setLoading(false);
    }
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

            {/* URL Input Option - Removed */}

            {(formData.imageUrls.length > 0 || formData.images.length > 0) && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {formData.imageUrls.map((url, index) => (
                  <div key={`existing-${index}`} className="relative group">
                    <img
                      src={url}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeExistingImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {formData.images.map((file, index) => (
                  <div key={`new-${index}`} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`New ${index + 1}`}
                      className="w-full h-32 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeNewImage(index)}
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
                            value={variation.attributes?.[attr] || ''}
                            onValueChange={(value) => updateVariation(index, `attr_${attr}`, value)}
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

        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/products/list')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (isEdit ? 'Update Product' : 'Add Product')}
          </Button>
        </div>
      </form>
    </div>
  );
}
