
import React, { useState, useMemo, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { Product, Category } from '../types';
import { Filter, SlidersHorizontal, Loader2 } from 'lucide-react';
import { fetchProducts } from '../services/productService';

interface ShopProps {
  onAddToCart: (p: Product) => void;
  onViewDetail: (p: Product) => void;
  onCompare: (p: Product) => void;
}

const Shop: React.FC<ShopProps> = ({ onAddToCart, onViewDetail, onCompare }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<number>(100000000);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', ...Object.values(Category)];

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    };
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // 1. Lọc theo danh mục
      const matchCategory = selectedCategory === 'All' || product.category === selectedCategory;
      
      // 2. Lọc theo giá
      const matchPrice = product.price <= priceRange;
      
      // 3. Tìm kiếm (Xử lý an toàn null/undefined)
      const productName = product.name ? product.name.toLowerCase() : '';
      const productBrand = product.brand ? product.brand.toLowerCase() : '';
      const query = searchQuery.toLowerCase();
      
      const matchSearch = productName.includes(query) || productBrand.includes(query);

      return matchCategory && matchPrice && matchSearch;
    });
  }, [products, selectedCategory, priceRange, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Cửa Hàng</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-64 space-y-8 h-fit lg:sticky lg:top-24">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4 text-gray-900 font-bold">
              <Filter size={20} /> Bộ lọc
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
              <input 
                type="text" 
                placeholder="Tên sản phẩm, hãng..." 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-brand-500 focus:border-brand-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
              <div className="space-y-2">
                {categories.map(cat => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="category" 
                      checked={selectedCategory === cat}
                      onChange={() => setSelectedCategory(cat)}
                      className="text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-sm text-gray-600 hover:text-gray-900">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Giá tối đa: {(priceRange/1000000).toFixed(0)} tr
               </label>
               <input 
                 type="range" 
                 min="0" 
                 max="100000000" 
                 step="1000000"
                 value={priceRange}
                 onChange={(e) => setPriceRange(Number(e.target.value))}
                 className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
               />
               <div className="flex justify-between text-xs text-gray-400 mt-1">
                 <span>0đ</span>
                 <span>100tr+</span>
               </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1">
           <div className="flex justify-between items-center mb-6">
              <p className="text-gray-500">Hiển thị {filteredProducts.length} sản phẩm</p>
              <div className="flex items-center gap-2">
                 <span className="text-sm text-gray-500">Sắp xếp:</span>
                 <select className="border-gray-300 rounded-md text-sm focus:ring-brand-500 focus:border-brand-500">
                    <option>Mới nhất</option>
                    <option>Giá tăng dần</option>
                    <option>Giá giảm dần</option>
                 </select>
              </div>
           </div>

           {loading ? (
             <div className="flex justify-center items-center py-20">
               <Loader2 className="animate-spin text-brand-600" size={40} />
             </div>
           ) : filteredProducts.length === 0 ? (
             <div className="text-center py-20">
               <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                 <SlidersHorizontal size={32} className="text-gray-400" />
               </div>
               <h3 className="text-lg font-semibold text-gray-900">Không tìm thấy sản phẩm</h3>
               <p className="text-gray-500">Vui lòng thử thay đổi bộ lọc tìm kiếm.</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(p => (
                  <ProductCard 
                    key={p.id} 
                    product={p} 
                    onAddToCart={onAddToCart}
                    onViewDetail={onViewDetail}
                    onCompare={onCompare}
                  />
                ))}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
