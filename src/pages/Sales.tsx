import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, ShoppingCart, Package } from 'lucide-react';

export default function Sales() {
  const stats = [
    { title: 'Total Revenue', value: '$45,231', icon: DollarSign, trend: '+20.1%' },
    { title: 'Orders', value: '2,456', icon: ShoppingCart, trend: '+12.5%' },
    { title: 'Products Sold', value: '8,234', icon: Package, trend: '+8.2%' },
    { title: 'Growth', value: '+18.4%', icon: TrendingUp, trend: '+4.3%' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Sales Overview</h1>
        <p className="text-muted-foreground mt-2">
          Track your sales performance
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-green-600">{stat.trend}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
