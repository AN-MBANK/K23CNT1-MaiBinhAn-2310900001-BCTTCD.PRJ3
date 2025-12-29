
import React, { useEffect, useState } from 'react';
import { MOCK_BANNERS } from '../constants';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import { ArrowRight, Truck, ShieldCheck, Headphones } from 'lucide-react';
import { fetchProducts } from '../services/productService';

interface HomeProps {
  onAddToCart: (p: Product) => void;
  onViewDetail: (p: Product) => void;
  onNavigate: (page: string) => void;
  onCompare: (p: Product) => void;
}

const Home: React.FC<HomeProps> = ({ onAddToCart, onViewDetail, onNavigate, onCompare }) => {
  const [products, setProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    const loadFeatured = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };
    loadFeatured();
  }, []);

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="space-y-12 pb-10">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] bg-gray-900 overflow-hidden">
        <img 
          src={MOCK_BANNERS[0]} 
          alt="Banner" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-transparent to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in-up">
            Nâng Tầm Trải Nghiệm <br/> <span className="text-brand-500">Công Nghệ Tương Lai</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-2xl">
            Sở hữu ngay những mẫu Laptop, PC Gaming mới nhất với mức giá ưu đãi và sự hỗ trợ từ AI.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => onNavigate('shop')}
              className="px-8 py-3 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition flex items-center gap-2"
            >
              Mua Ngay <ArrowRight size={20}/>
            </button>
            <button className="px-8 py-3 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-lg font-semibold hover:bg-white/20 transition">
              Tìm hiểu thêm
            </button>
          </div>
        </div>
      </div>

      {/* Features Info */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-3 bg-blue-50 text-brand-600 rounded-lg">
                <Truck size={24} />
            </div>
            <div>
                <h4 className="font-bold text-gray-900">Vận chuyển miễn phí</h4>
                <p className="text-sm text-gray-500">Cho đơn hàng trên 5 triệu</p>
            </div>
        </div>
        <div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                <ShieldCheck size={24} />
            </div>
            <div>
                <h4 className="font-bold text-gray-900">Bảo hành chính hãng</h4>
                <p className="text-sm text-gray-500">Cam kết 100% hàng thật</p>
            </div>
        </div>
        <div className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                <Headphones size={24} />
            </div>
            <div>
                <h4 className="font-bold text-gray-900">Hỗ trợ 24/7</h4>
                <p className="text-sm text-gray-500">Với trợ lý ảo AI thông minh</p>
            </div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sản phẩm nổi bật</h2>
            <p className="text-gray-500">Những lựa chọn tốt nhất được khách hàng tin dùng</p>
          </div>
          <button onClick={() => onNavigate('shop')} className="text-brand-600 font-medium hover:underline flex items-center gap-1">
            Xem tất cả <ArrowRight size={16}/>
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.length > 0 ? (
            featuredProducts.map(p => (
              <ProductCard 
                key={p.id} 
                product={p} 
                onAddToCart={onAddToCart}
                onViewDetail={onViewDetail}
                onCompare={onCompare}
              />
            ))
          ) : (
             <p className="text-gray-500 col-span-4 text-center">Đang tải sản phẩm...</p>
          )}
        </div>
      </div>

      {/* Promotional Banner */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-brand-900 rounded-2xl p-8 md:p-12 relative overflow-hidden flex items-center justify-between">
           <div className="relative z-10 max-w-lg">
              <span className="text-brand-300 font-bold tracking-wider text-sm uppercase mb-2 block">Khuyến mãi đặc biệt</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Build PC - Nhận quà cực chất</h2>
              <p className="text-brand-100 mb-6">Giảm ngay 10% khi build PC Full bộ. Tặng kèm bàn phím cơ và chuột gaming.</p>
              <button onClick={() => onNavigate('shop')} className="bg-white text-brand-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition">
                Xem cấu hình ngay
              </button>
           </div>
           <div className="hidden md:block absolute right-0 top-0 bottom-0 w-1/2 opacity-20">
               <img src="https://picsum.photos/seed/setup/800/600" alt="PC Setup" className="w-full h-full object-cover" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
