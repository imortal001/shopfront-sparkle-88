import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, AlertCircle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Notifications() {
  const notifications = [
    { id: 1, type: 'success', message: 'New order #1234 received', time: '5 minutes ago' },
    { id: 2, type: 'warning', message: 'Low stock alert: LED Desk Lamp', time: '1 hour ago' },
    { id: 3, type: 'info', message: 'Product review pending approval', time: '2 hours ago' },
    { id: 4, type: 'success', message: 'Payment received for order #1233', time: '3 hours ago' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground mt-2">
          Stay updated with your store activities
        </p>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-3">
                {notification.type === 'success' && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
                {notification.type === 'warning' && (
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                )}
                {notification.type === 'info' && (
                  <Bell className="h-5 w-5 text-blue-600" />
                )}
                <CardTitle className="text-base font-medium">
                  {notification.message}
                </CardTitle>
              </div>
              <Badge variant="outline">{notification.time}</Badge>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
