export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  image: string;
  description: string;
  sku: string;
  createdAt: string;
}

export const categories = [
  'Electronics',
  'Clothing',
  'Home & Garden',
  'Sports & Outdoors',
  'Books',
  'Toys & Games',
  'Health & Beauty',
  'Food & Beverages'
];

export const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    category: 'Electronics',
    price: 79.99,
    stock: 45,
    status: 'active',
    image: '/placeholder.svg',
    description: 'High-quality wireless headphones with noise cancellation',
    sku: 'WBH-001',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Premium Cotton T-Shirt',
    category: 'Clothing',
    price: 24.99,
    stock: 120,
    status: 'active',
    image: '/placeholder.svg',
    description: 'Comfortable 100% cotton t-shirt',
    sku: 'PCT-001',
    createdAt: '2024-01-20'
  },
  {
    id: '3',
    name: 'Smart Watch Series 5',
    category: 'Electronics',
    price: 299.99,
    stock: 15,
    status: 'active',
    image: '/placeholder.svg',
    description: 'Advanced fitness tracking and notifications',
    sku: 'SWS-005',
    createdAt: '2024-02-01'
  },
  {
    id: '4',
    name: 'Yoga Mat Pro',
    category: 'Sports & Outdoors',
    price: 39.99,
    stock: 78,
    status: 'active',
    image: '/placeholder.svg',
    description: 'Non-slip premium yoga mat',
    sku: 'YMP-001',
    createdAt: '2024-02-05'
  },
  {
    id: '5',
    name: 'LED Desk Lamp',
    category: 'Home & Garden',
    price: 34.99,
    stock: 0,
    status: 'inactive',
    image: '/placeholder.svg',
    description: 'Adjustable LED lamp with USB charging',
    sku: 'LDL-001',
    createdAt: '2024-02-10'
  },
  {
    id: '6',
    name: 'Organic Green Tea (100 bags)',
    category: 'Food & Beverages',
    price: 12.99,
    stock: 200,
    status: 'active',
    image: '/placeholder.svg',
    description: 'Premium organic green tea',
    sku: 'OGT-100',
    createdAt: '2024-02-15'
  },
  {
    id: '7',
    name: 'Running Shoes',
    category: 'Sports & Outdoors',
    price: 89.99,
    stock: 55,
    status: 'active',
    image: '/placeholder.svg',
    description: 'Lightweight performance running shoes',
    sku: 'RS-001',
    createdAt: '2024-02-20'
  },
  {
    id: '8',
    name: 'Bestseller Novel Collection',
    category: 'Books',
    price: 45.99,
    stock: 32,
    status: 'active',
    image: '/placeholder.svg',
    description: 'Set of 5 bestselling novels',
    sku: 'BNC-005',
    createdAt: '2024-02-25'
  }
];
