// src/data/mockData.ts

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  subCategory?: string;
  image: any;
  description: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isFeatured?: boolean;
  tags: string[];
  features: string[];
  discountRate?: number;
  isFastDelivery?: boolean;
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    price: 55999,
    originalPrice: 59999,
    category: 'Elektronik',
    subCategory: 'Akıllı Telefon',
    image: require('../../assets/images/iphone15.jpg'),
    description: 'En yeni iPhone modeli, Titanium kasa, A17 Pro çip, 48MP kamera',
    rating: 4.9,
    reviewCount: 342,
    inStock: true,
    isFeatured: true,
    tags: ['apple', 'iphone', 'premium', 'yeni'],
    features: ['5G', 'Face ID', '120Hz', 'USB-C'],
    discountRate: 10,
    isFastDelivery: true
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    price: 42999,
    originalPrice: 45999,
    category: 'Elektronik',
    subCategory: 'Akıllı Telefon',
    image: require('../../assets/images/samsung-s24.jpg'),
    description: 'S Pen desteği, 200MP kamera, Snapdragon 8 Gen 3',
    rating: 4.7,
    reviewCount: 287,
    inStock: true,
    isFeatured: true,
    tags: ['samsung', 'android', 'spen', 'premium'],
    features: ['S Pen', '200MP Kamera', '5G', '120Hz'],
    discountRate: 11,
    isFastDelivery: true
  },
  {
    id: '3',
    name: 'MacBook Air M3',
    price: 35999,
    originalPrice: 39999,
    category: 'Elektronik',
    subCategory: 'Laptop',
    image: require('../../assets/images/macbook-air.jpg'),
    description: 'M3 çip, 13.6 inç Liquid Retina, 18 saat pil ömrü',
    rating: 4.8,
    reviewCount: 156,
    inStock: true,
    tags: ['apple', 'macbook', 'laptop', 'm3'],
    features: ['M3 Çip', '18 Saat Pil', 'Retina Ekran', 'MacOS'],
    discountRate: 13,
    isFastDelivery: true
  },
  {
    id: '4',
    name: 'Sony WH-1000XM5',
    price: 8999,
    originalPrice: 10999,
    category: 'Elektronik',
    subCategory: 'Kulaklık',
    image: require('../../assets/images/sony-headphones.jpg'),
    description: 'Gürültü önleyici kulaklık, 30 saat pil, dokunmatik kontrol',
    rating: 4.6,
    reviewCount: 421,
    inStock: true,
    tags: ['sony', 'kulaklık', 'noise-cancelling', 'wireless'],
    features: ['Gürültü Önleme', '30 Saat Pil', 'Dokunmatik', 'Bluetooth 5.2'],
    discountRate: 18,
    isFastDelivery: true
  },
  {
    id: '5',
    name: 'Nike Air Force 1',
    price: 1299,
    originalPrice: 1499,
    category: 'Giyim',
    subCategory: 'Ayakkabı',
    image: require('../../assets/images/nike-airforce.jpg'),
    description: 'Klasik beyaz spor ayakkabı, deri malzeme',
    rating: 4.5,
    reviewCount: 892,
    inStock: true,
    tags: ['nike', 'spor', 'ayakkabı', 'beyaz'],
    features: ['Deri Malzeme', 'Air Teknolojisi', 'Beyaz Renk'],
    discountRate: 14,
    isFastDelivery: true
  },
  {
    id: '6',
    name: 'Apple Watch Series 9',
    price: 14999,
    originalPrice: 15999,
    category: 'Elektronik',
    subCategory: 'Akıllı Saat',
    image: require('../../assets/images/apple-watch.jpg'),
    description: 'GPS, kardiyo takip, always-on ekran',
    rating: 4.9,
    reviewCount: 312,
    inStock: true,
    tags: ['apple', 'watch', 'smartwatch', 'fitness'],
    features: ['GPS', 'Kardiyo Takip', 'Always-on Display'],
    discountRate: 6,
    isFastDelivery: true
  },
  {
    id: '7',
    name: 'AirPods Pro (2.Nesil)',
    price: 7999,
    originalPrice: 8999,
    category: 'Elektronik',
    subCategory: 'Kulaklık',
    image: require('../../assets/images/airpods-pro.jpg'),
    description: 'Gürültü önleme, 24 saat pil ömrü',
    rating: 4.6,
    reviewCount: 421,
    inStock: true,
    tags: ['apple', 'airpods', 'wireless', 'pro'],
    features: ['Gürültü Önleme', '24 Saat Pil', 'Şarj Kutusu'],
    discountRate: 7,
    isFastDelivery: true
  },
  {
    id: '8',
    name: 'Samsung Galaxy Buds2 Pro',
    price: 5999,
    originalPrice: 6999,
    category: 'Elektronik',
    subCategory: 'Kulaklık',
    image: require('../../assets/images/samsung-buds.jpg'),
    description: '360 audio, gürültü önleme, kompakt tasarım',
    rating: 4.4,
    reviewCount: 189,
    inStock: true,
    tags: ['samsung', 'buds', 'wireless', 'pro'],
    features: ['360 Audio', 'Gürültü Önleme', 'Kompakt'],
    discountRate: 14,
    isFastDelivery: true
  },
  {
    id: '9',
    name: 'Adidas Ultraboost',
    price: 1899,
    originalPrice: 2199,
    category: 'Giyim',
    subCategory: 'Ayakkabı',
    image: require('../../assets/images/adidas-ultraboost.jpg'),
    description: 'Boost teknolojisi, Primeknit üst',
    rating: 4.5,
    reviewCount: 324,
    inStock: true,
    tags: ['adidas', 'spor', 'ayakkabı', 'boost'],
    features: ['Boost Teknolojisi', 'Primeknit', 'Koşu'],
    discountRate: 9,
    isFastDelivery: true
  },
  {
    id: '10',
    name: 'Dell XPS 13',
    price: 28999,
    originalPrice: 31999,
    category: 'Elektronik',
    subCategory: 'Laptop',
    image: require('../../assets/images/dell-xps.jpg'),
    description: 'Intel i7, 16GB RAM, SSD depolama',
    rating: 4.4,
    reviewCount: 198,
    inStock: true,
    tags: ['dell', 'laptop', 'xps', 'premium'],
    features: ['Intel i7', '16GB RAM', 'SSD', 'Windows 11'],
    discountRate: 9,
    isFastDelivery: true
  },
  {
    id: '11',
    name: 'iPad Air M2',
    price: 27999,
    originalPrice: 29999,
    category: 'Elektronik',
    subCategory: 'Tablet',
    image: require('../../assets/images/ipad-air.jpg'),
    description: 'M2 çip, Liquid Retina ekran',
    rating: 4.5,
    reviewCount: 234,
    inStock: true,
    tags: ['apple', 'ipad', 'tablet', 'm2'],
    features: ['M2 Çip', 'Liquid Retina', 'iPadOS'],
    discountRate: 6,
    isFastDelivery: true
  },
  {
    id: '12',
    name: 'PlayStation 5',
    price: 14999,
    originalPrice: 16999,
    category: 'Elektronik',
    subCategory: 'Oyun Konsolu',
    image: require('../../assets/images/playstation5.jpg'),
    description: '4K gaming, SSD, yeni nesil konsol',
    rating: 4.9,
    reviewCount: 567,
    inStock: true,
    tags: ['sony', 'playstation', 'gaming', 'console'],
    features: ['4K Gaming', 'SSD', 'Exclusive Games'],
    discountRate: 12,
    isFastDelivery: true
  }
];

export const categories = [
  { id: '1', name: 'Elektronik', icon: '📱', count: 9 },
  { id: '2', name: 'Giyim', icon: '👕', count: 2 },
  { id: '3', name: 'Ev & Yaşam', icon: '🏠', count: 0 },
  { id: '4', name: 'Kozmetik', icon: '💄', count: 0 },
  { id: '5', name: 'Spor', icon: '⚽', count: 0 },
  { id: '6', name: 'Kitap', icon: '📚', count: 0 },
];

export const featuredProducts = mockProducts.filter(product => product.isFeatured);

// Sepet için mock data
export const mockCartItems = [
  {
    id: '1',
    productId: '1',
    quantity: 1,
    product: mockProducts[0]
  },
  {
    id: '2', 
    productId: '5',
    quantity: 2,
    product: mockProducts[4]
  }
];

// Filtreleme için markalar
export const brands = [
  { id: '1', name: 'Apple', count: 5 },
  { id: '2', name: 'Samsung', count: 2 },
  { id: '3', name: 'Sony', count: 1 },
  { id: '4', name: 'Nike', count: 1 },
  { id: '5', name: 'Adidas', count: 1 },
  { id: '6', name: 'Dell', count: 1 },
];

// Teslimat seçenekleri
export const deliveryOptions = [
  { id: '1', name: 'Standart Teslimat', price: 0, days: '3-5 iş günü' },
  { id: '2', name: 'Hızlı Teslimat', price: 29.99, days: '1-2 iş günü' },
  { id: '3', name: 'Aynı Gün Teslimat', price: 49.99, days: 'Aynı gün' }
];

// Arama geçmişi
export const searchHistory = [
  'iphone',
  'airpods', 
  'nike',
  'samsung',
  'laptop'
];

// Bildirimler
export const notifications = [
  {
    id: '1',
    title: 'Siparişin kargoda',
    message: 'Siparişiniz kargoya verildi. Takip numarası: TRK123456',
    time: '2 saat önce',
    isRead: false
  },
  {
    id: '2',
    title: 'İndirim fırsatı',
    message: 'Apple ürünlerinde %10 indirim başladı!',
    time: '1 gün önce',
    isRead: true
  }
];