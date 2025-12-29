import { Category, Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Dell XPS 15 9530",
    price: 45000000,
    originalPrice: 48000000,
    category: Category.LAPTOP,
    brand: "Dell",
    image: "https://picsum.photos/seed/dellxps/400/400",
    rating: 4.8,
    reviewsCount: 120,
    specs: {
      cpu: "Intel Core i7-13700H",
      ram: "16GB DDR5",
      storage: "512GB SSD",
      gpu: "RTX 4050 6GB",
      screen: "15.6 inch OLED 3.5K"
    },
    description: "Chiếc laptop doanh nhân cao cấp nhất với màn hình OLED tuyệt đẹp."
  },
  {
    id: 2,
    name: "MacBook Pro 14 M3 Pro",
    price: 49990000,
    category: Category.LAPTOP,
    brand: "Apple",
    image: "https://picsum.photos/seed/macbook/400/400",
    rating: 4.9,
    reviewsCount: 340,
    specs: {
      cpu: "M3 Pro Chip",
      ram: "18GB Unified",
      storage: "512GB SSD",
      gpu: "14-core GPU",
      screen: "14.2 inch Liquid Retina XDR"
    },
    description: "Sức mạnh vượt trội cho lập trình viên và nhà sáng tạo nội dung."
  },
  {
    id: 3,
    name: "PC Gaming Shark Deep",
    price: 32000000,
    originalPrice: 35000000,
    category: Category.PC,
    brand: "Custom",
    image: "https://picsum.photos/seed/pcgame/400/400",
    rating: 4.7,
    reviewsCount: 45,
    specs: {
      cpu: "Intel Core i5-13600K",
      ram: "32GB DDR4",
      storage: "1TB NVMe SSD",
      gpu: "RTX 4060 Ti 8GB",
      screen: "Không kèm màn hình"
    },
    description: "Chiến mượt mọi tựa game AAA ở độ phân giải 2K."
  },
  {
    id: 4,
    name: "Asus TUF Gaming F15",
    price: 19500000,
    originalPrice: 22000000,
    category: Category.LAPTOP,
    brand: "Asus",
    image: "https://picsum.photos/seed/asustuf/400/400",
    rating: 4.5,
    reviewsCount: 210,
    specs: {
      cpu: "Intel Core i5-12500H",
      ram: "16GB",
      storage: "512GB SSD",
      gpu: "RTX 3050 4GB",
      screen: "15.6 FHD 144Hz"
    },
    description: "Laptop gaming quốc dân, hiệu năng trên giá thành cực tốt."
  },
  {
    id: 5,
    name: "LG UltraGear 27''",
    price: 8500000,
    category: Category.MONITOR,
    brand: "LG",
    image: "https://picsum.photos/seed/lgmonitor/400/400",
    rating: 4.6,
    reviewsCount: 88,
    specs: {
      screen: "27 inch IPS 2K 144Hz"
    },
    description: "Màn hình gaming màu sắc chuẩn xác, tần số quét cao."
  },
  {
    id: 6,
    name: "Bàn phím cơ Keychron K8 Pro",
    price: 2800000,
    category: Category.ACCESSORIES,
    brand: "Keychron",
    image: "https://picsum.photos/seed/keychron/400/400",
    rating: 4.8,
    reviewsCount: 156,
    specs: {
      screen: "Nhôm nguyên khối, LED RGB"
    },
    description: "Bàn phím cơ custom không dây tốt nhất phân khúc."
  }
];

export const MOCK_BANNERS = [
  "https://picsum.photos/seed/banner1/1200/400",
  "https://picsum.photos/seed/banner2/1200/400",
];
