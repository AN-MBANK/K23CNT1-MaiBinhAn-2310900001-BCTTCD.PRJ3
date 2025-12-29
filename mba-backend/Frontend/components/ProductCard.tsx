
import React from 'react';
import { Star, ShoppingCart, Scale } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetail: (product: Product) => void;
  onCompare?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetail, onCompare }) => {
  // Bảo vệ: Nếu product bị null (do lỗi dữ liệu), không render gì cả
  if (!product) return null;

  const formatCurrency = (amount: number) => {
    if (amount === undefined || amount === null) return "0 đ";
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100 group">
      <div className="relative cursor-pointer" onClick={() => onViewDetail(product)}>
        <img 
          src={product.image || "https://via.placeholder.com/400"} 
          alt={product.name} 
          className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=No+Image'; }}
        />
        {product.originalPrice && product.originalPrice > product.price && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
          </div>
        )}
        
        {onCompare && (
          <button 
            onClick={(e) => { e.stopPropagation(); onCompare(product); }}
            className="absolute bottom-2 right-2 bg-white/90 p-2 rounded-full shadow-md text-gray-600 hover:text-brand-600 hover:bg-white transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
            title="So sánh sản phẩm này"
          >
            <Scale size={18} />
          </button>
        )}
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <div className="text-xs text-brand-600 font-semibold uppercase tracking-wider mb-1">
          {product.category || "Sản phẩm"}
        </div>
        <h3 
          className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-brand-600 cursor-pointer"
          onClick={() => onViewDetail(product)}
        >
          {product.name}
        </h3>
        
        <div className="flex items-center mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill={i < Math.floor(product.rating || 0) ? "currentColor" : "none"} className={i < Math.floor(product.rating || 0) ? "" : "text-gray-300"} />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">({product.reviewsCount || 0})</span>
        </div>

        {/* Specs summary */}
        <div className="text-xs text-gray-500 mb-4 space-y-1">
            {product.specs?.cpu && <p>• CPU: {product.specs.cpu}</p>}
            {product.specs?.gpu && <p>• GPU: {product.specs.gpu}</p>}
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-brand-600 block">{formatCurrency(product.price)}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-400 line-through">{formatCurrency(product.originalPrice)}</span>
            )}
          </div>
          <button 
            onClick={() => onAddToCart(product)}
            className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-brand-600 hover:text-white transition-colors"
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
