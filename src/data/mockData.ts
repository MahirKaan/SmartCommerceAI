export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  subCategory?: string;
  image: string;
  description: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isFeatured?: boolean;
  tags: string[];
  features: string[];
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    price: 55999,
    originalPrice: 59999,
    category: 'Elektronik',
    subCategory: 'Akıllı Telefon',
    image: 'https://picsum.photos/300/300?random=1',
    description: 'En yeni iPhone modeli, Titanium kasa, A17 Pro çip, 48MP kamera',
    rating: 4.9,
    reviewCount: 342,
    inStock: true,
    isFeatured: true,
    tags: ['apple', 'iphone', 'premium', 'yeni'],
    features: ['5G', 'Face ID', '120Hz', 'USB-C']
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra',
    price: 42999,
    originalPrice: 45999,
    category: 'Elektronik',
    subCategory: 'Akıllı Telefon',
    image: 'https://picsum.photos/300/300?random=2',
    description: 'S Pen desteği, 200MP kamera, Snapdragon 8 Gen 3',
    rating: 4.7,
    reviewCount: 287,
    inStock: true,
    isFeatured: true,
    tags: ['samsung', 'android', 'spen', 'premium'],
    features: ['S Pen', '200MP Kamera', '5G', '120Hz']
  },
  {
    id: '3',
    name: 'MacBook Air M3',
    price: 35999,
    category: 'Elektronik',
    subCategory: 'Laptop',
    image: 'https://picsum.photos/300/300?random=3',
    description: 'M3 çip, 13.6 inç Liquid Retina, 18 saat pil ömrü',
    rating: 4.8,
    reviewCount: 156,
    inStock: true,
    tags: ['apple', 'macbook', 'laptop', 'm3'],
    features: ['M3 Çip', '18 Saat Pil', 'Retina Ekran', 'MacOS']
  },
  {
    id: '4',
    name: 'Sony WH-1000XM5',
    price: 8999,
    originalPrice: 10999,
    category: 'Elektronik',
    subCategory: 'Kulaklık',
    image: 'https://picsum.photos/300/300?random=4',
    description: 'Gürültü önleyici kulaklık, 30 saat pil, dokunmatik kontrol',
    rating: 4.6,
    reviewCount: 421,
    inStock: true,
    tags: ['sony', 'kulaklık', 'noise-cancelling', 'wireless'],
    features: ['Gürültü Önleme', '30 Saat Pil', 'Dokunmatik', 'Bluetooth 5.2']
  },
  {
    id: '5',
    name: 'Nike Air Force 1',
    price: 1299,
    category: 'Giyim',
    subCategory: 'Ayakkabı',
    image: 'https://picsum.photos/300/300?random=5',
    description: 'Klasik beyaz spor ayakkabı, deri malzeme',
    rating: 4.5,
    reviewCount: 892,
    inStock: true,
    tags: ['nike', 'spor', 'ayakkabı', 'beyaz'],
    features: ['Deri Malzeme', 'Air Teknolojisi', 'Beyaz Renk']
  }
];

export const categories = [
  { id: '1', name: 'Elektronik', icon: '📱', count: 4 },
  { id: '2', name: 'Giyim', icon: '👕', count: 1 },
  { id: '3', name: 'Ev & Yaşam', icon: '🏠', count: 0 },
  { id: '4', name: 'Kozmetik', icon: '💄', count: 0 },
  { id: '5', name: 'Spor', icon: '⚽', count: 0 },
  { id: '6', name: 'Kitap', icon: '📚', count: 0 },
];

export const featuredProducts = mockProducts.filter(product => product.isFeatured);