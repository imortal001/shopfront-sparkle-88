import { categories } from '@/lib/productData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Grid3x3 } from 'lucide-react';

export default function Categories() {
  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Categories</h1>
        <p className="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base">
          Browse product categories
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((category) => (
          <Card key={category} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Grid3x3 className="h-5 w-5 text-primary" />
                {category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View all products in this category
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
