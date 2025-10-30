export interface ProductVariation {
  id: string;
  size?: string;
  color?: string;
  storage?: string;
  material?: string;
  flavor?: string;
  format?: string;
  price: number;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  images: string[];
  description: string;
  sku: string;
  createdAt: string;
  updatedAt?: string;
  variations?: ProductVariation[];
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

export const categoryAttributes = {
  'Electronics': ['color', 'storage'],
  'Clothing': ['size', 'color', 'material'],
  'Home & Garden': ['color'],
  'Sports & Outdoors': ['size', 'color'],
  'Books': ['format'],
  'Toys & Games': ['color'],
  'Health & Beauty': ['size'],
  'Food & Beverages': ['flavor']
};

export const attributeOptions = {
  size: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  color: ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Gray'],
  storage: ['64GB', '128GB', '256GB', '512GB', '1TB'],
  material: ['Cotton', 'Polyester', 'Wool', 'Silk', 'Denim', 'Leather'],
  format: ['Hardcover', 'Paperback', 'eBook', 'Audiobook'],
  flavor: ['Vanilla', 'Chocolate', 'Strawberry', 'Mint', 'Original']
};

export const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    category: 'Electronics',
    price: 79.99,
    stock: 145,
    status: 'active',
    images: ['/placeholder.svg', '/placeholder.svg'],
    description: 'High-quality wireless headphones with noise cancellation',
    sku: 'WBH-001',
    createdAt: '2024-01-15',
    variations: [
      { id: '1-1', color: 'Black', storage: '64GB', price: 79.99, stock: 45, sku: 'WBH-001-BLK' },
      { id: '1-2', color: 'White', storage: '64GB', price: 79.99, stock: 50, sku: 'WBH-001-WHT' },
      { id: '1-3', color: 'Blue', storage: '64GB', price: 79.99, stock: 50, sku: 'WBH-001-BLU' }
    ]
  },
  {
    id: '2',
    name: 'Premium Cotton T-Shirt',
    category: 'Clothing',
    price: 24.99,
    stock: 320,
    status: 'active',
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    description: 'Comfortable 100% cotton t-shirt',
    sku: 'PCT-001',
    createdAt: '2024-01-20',
    variations: [
      { id: '2-1', size: 'S', color: 'Black', material: 'Cotton', price: 24.99, stock: 40, sku: 'PCT-001-S-BLK' },
      { id: '2-2', size: 'M', color: 'Black', material: 'Cotton', price: 24.99, stock: 60, sku: 'PCT-001-M-BLK' },
      { id: '2-3', size: 'L', color: 'Black', material: 'Cotton', price: 24.99, stock: 50, sku: 'PCT-001-L-BLK' },
      { id: '2-4', size: 'S', color: 'White', material: 'Cotton', price: 24.99, stock: 45, sku: 'PCT-001-S-WHT' },
      { id: '2-5', size: 'M', color: 'White', material: 'Cotton', price: 24.99, stock: 65, sku: 'PCT-001-M-WHT' },
      { id: '2-6', size: 'L', color: 'White', material: 'Cotton', price: 24.99, stock: 60, sku: 'PCT-001-L-WHT' }
    ]
  },
  {
    id: '3',
    name: 'Smart Watch Series 5',
    category: 'Electronics',
    price: 299.99,
    stock: 45,
    status: 'active',
    images: ['/placeholder.svg', '/placeholder.svg'],
    description: 'Advanced fitness tracking and notifications',
    sku: 'SWS-005',
    createdAt: '2024-02-01',
    variations: [
      { id: '3-1', color: 'Black', storage: '64GB', price: 299.99, stock: 15, sku: 'SWS-005-BLK-64' },
      { id: '3-2', color: 'Silver', storage: '64GB', price: 299.99, stock: 15, sku: 'SWS-005-SLV-64' },
      { id: '3-3', color: 'Black', storage: '128GB', price: 349.99, stock: 15, sku: 'SWS-005-BLK-128' }
    ]
  },
  {
    id: '4',
    name: 'Yoga Mat Pro',
    category: 'Sports & Outdoors',
    price: 39.99,
    stock: 156,
    status: 'active',
    images: ['/placeholder.svg'],
    description: 'Non-slip premium yoga mat',
    sku: 'YMP-001',
    createdAt: '2024-02-05',
    variations: [
      { id: '4-1', size: 'M', color: 'Blue', price: 39.99, stock: 78, sku: 'YMP-001-M-BLU' },
      { id: '4-2', size: 'L', color: 'Blue', price: 44.99, stock: 40, sku: 'YMP-001-L-BLU' },
      { id: '4-3', size: 'M', color: 'Pink', price: 39.99, stock: 38, sku: 'YMP-001-M-PNK' }
    ]
  },
  {
    id: '5',
    name: 'LED Desk Lamp',
    category: 'Home & Garden',
    price: 34.99,
    stock: 0,
    status: 'inactive',
    images: ['/placeholder.svg'],
    description: 'Adjustable LED lamp with USB charging',
    sku: 'LDL-001',
    createdAt: '2024-02-10'
  },
  {
    id: '6',
    name: 'Organic Green Tea (100 bags)',
    category: 'Food & Beverages',
    price: 12.99,
    stock: 400,
    status: 'active',
    images: ['/placeholder.svg'],
    description: 'Premium organic green tea',
    sku: 'OGT-100',
    createdAt: '2024-02-15',
    variations: [
      { id: '6-1', flavor: 'Original', price: 12.99, stock: 200, sku: 'OGT-100-ORG' },
      { id: '6-2', flavor: 'Mint', price: 13.99, stock: 150, sku: 'OGT-100-MNT' },
      { id: '6-3', flavor: 'Vanilla', price: 13.99, stock: 50, sku: 'OGT-100-VAN' }
    ]
  },
  {
    id: '7',
    name: 'Running Shoes',
    category: 'Sports & Outdoors',
    price: 89.99,
    stock: 220,
    status: 'active',
    images: ['/placeholder.svg', '/placeholder.svg'],
    description: 'Lightweight performance running shoes',
    sku: 'RS-001',
    createdAt: '2024-02-20',
    variations: [
      { id: '7-1', size: 'M', color: 'Black', price: 89.99, stock: 55, sku: 'RS-001-M-BLK' },
      { id: '7-2', size: 'L', color: 'Black', price: 89.99, stock: 45, sku: 'RS-001-L-BLK' },
      { id: '7-3', size: 'XL', color: 'Black', price: 89.99, stock: 40, sku: 'RS-001-XL-BLK' },
      { id: '7-4', size: 'M', color: 'Blue', price: 89.99, stock: 40, sku: 'RS-001-M-BLU' },
      { id: '7-5', size: 'L', color: 'Blue', price: 89.99, stock: 40, sku: 'RS-001-L-BLU' }
    ]
  },
  {
    id: '8',
    name: 'Bestseller Novel Collection',
    category: 'Books',
    price: 45.99,
    stock: 128,
    status: 'active',
    images: ['/placeholder.svg'],
    description: 'Set of 5 bestselling novels',
    sku: 'BNC-005',
    createdAt: '2024-02-25',
    variations: [
      { id: '8-1', format: 'Hardcover', price: 45.99, stock: 32, sku: 'BNC-005-HC' },
      { id: '8-2', format: 'Paperback', price: 29.99, stock: 64, sku: 'BNC-005-PB' },
      { id: '8-3', format: 'eBook', price: 19.99, stock: 32, sku: 'BNC-005-EB' }
    ]
  }
];
