
import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import { ShoppingCart, Star, Check, ArrowLeft, Truck, Shield, Sparkles, Scale } from 'lucide-react';
import { fetchProducts } from '../services/productService';
import ProductCard from '../components/ProductCard';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onBack: () => void;
  onViewDetail: (p: Product) => void;
  onCompare: (p: Product) => void; // Thêm prop
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onAddToCart, onBack, onViewDetail, onCompare }) => {
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product]);

  useEffect(() => {
    const loadRelated = async () => {
      const allProducts = await fetchProducts();
      const related = allProducts
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4); 
      setRelatedProducts(related);
    };
    loadRelated();
  }, [product]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button onClick={onBack} className="flex items-center text-gray-500 hover:text-brand-600 mb-6 transition">
        <ArrowLeft size={20} className="mr-1" /> Quay lại cửa hàng
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          
          {/* Image Section */}
          <div className="p-8 bg-gray-50 flex items-center justify-center border-b md:border-b-0 md:border-r border-gray-100">
            <img 
              src={product.image} 
              alt={product.name} 
              className="max-w-full max-h-[500px] object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Info Section */}
          <div className="p-8 md:p-12 flex flex-col">
             <div className="mb-4">
               <span className="inline-block px-3 py-1 bg-brand-50 text-brand-700 text-xs font-bold uppercase rounded-full tracking-wide">
                 {product.category}
               </span>
             </div>
             
             <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
             
             <div className="flex items-center gap-4 mb-6">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} className={i < Math.floor(product.rating) ? "" : "text-gray-300"} />
                  ))}
                </div>
                <span className="text-gray-500 text-sm">{product.reviewsCount} Đánh giá</span>
                <span className="text-gray-300">|</span>
                <span className="text-green-600 text-sm font-medium flex items-center">
                  <Check size={16} className="mr-1" /> Còn hàng
                </span>
             </div>

             <div className="text-4xl font-bold text-brand-600 mb-2">
               {formatCurrency(product.price)}
             </div>
             {product.originalPrice && (
               <div className="text-gray-400 line-through text-lg mb-8">
                 {formatCurrency(product.originalPrice)}
               </div>
             )}

             <p className="text-gray-600 leading-relaxed mb-8">
               {product.description}
             </p>

             {/* Specs Grid */}
             <div className="grid grid-cols-2 gap-4 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-xs text-gray-500 uppercase font-semibold block mb-1">{key}</span>
                    <span className="text-sm font-medium text-gray-900">{value}</span>
                  </div>
                ))}
             </div>

             <div className="mt-auto space-y-4">
                <div className="flex gap-4">
                  <button 
                    onClick={() => onAddToCart(product)}
                    className="flex-1 bg-brand-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-brand-700 transition flex items-center justify-center gap-2 shadow-lg shadow-brand-500/30"
                  >
                    <ShoppingCart size={24} /> Thêm vào giỏ
                  </button>
                  <button 
                    onClick={() => onCompare(product)}
                    className="flex-none bg-purple-50 text-purple-700 border border-purple-100 py-4 px-6 rounded-xl font-bold hover:bg-purple-100 transition flex items-center gap-2"
                  >
                    <Scale size={20} /> So sánh AI
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-500 pt-4">
                  <div className="flex items-center gap-2">
                    <Truck size={16} className="text-brand-600"/>
                    <span>Giao hàng toàn quốc</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield size={16} className="text-brand-600"/>
                    <span>Bảo hành 12-24 tháng</span>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-6">
             <Sparkles className="text-yellow-500" />
             <h2 className="text-2xl font-bold text-gray-900">Sản phẩm tương tự</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <div key={p.id} className="opacity-90 hover:opacity-100 transition">
                 <ProductCard 
                    product={p} 
                    onAddToCart={onAddToCart} 
                    onViewDetail={onViewDetail}
                    onCompare={onCompare}
                 />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
