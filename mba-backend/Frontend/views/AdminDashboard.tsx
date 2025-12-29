import React, { useEffect, useState } from 'react';
import { User, Order, Product, Category } from '../types';
import { LayoutDashboard, Package, ShoppingBag, Users, DollarSign, Edit, Trash2, Plus, X, Loader2 } from 'lucide-react';
import { fetchOrders, updateOrderStatus } from '../services/orderService';
import { fetchProducts, createProduct, updateProduct, deleteProduct, uploadImageFile } from '../services/productService';
import { useToast } from '../contexts/ToastContext';

interface AdminDashboardProps {
  user: User;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '', price: 0, category: Category.LAPTOP, brand: '', description: '', image: '', specs: {}
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [ordersData, productsData] = await Promise.all([
      fetchOrders(),
      fetchProducts()
    ]);
    setOrders(ordersData.sort((a, b) => b.id - a.id));
    setProducts(productsData.sort((a, b) => b.id - a.id));
    setLoading(false);
  };

  const handleStatusChange = async (orderId: number, newStatus: string) => {
    setUpdatingOrderId(orderId);
    const success = await updateOrderStatus(orderId, newStatus);
    if (success) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      showToast('Cập nhật trạng thái đơn hàng thành công', 'success');
    } else {
      showToast('Cập nhật thất bại', 'error');
    }
    setUpdatingOrderId(null);
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData(product);
      setSelectedFile(null);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '', price: 0, originalPrice: 0, category: Category.LAPTOP, brand: '',
        description: '', image: '',
        specs: { cpu: '', ram: '', storage: '', gpu: '', screen: '' }
      });
      setSelectedFile(null);
    }
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        setSelectedFile(e.target.files[0]);
    } else {
        setSelectedFile(null);
    }
  }

  const handleDeleteProduct = async (id: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
      const success = await deleteProduct(id);
      if (success) {
        setProducts(prev => prev.filter(p => p.id !== id));
        showToast('Đã xóa sản phẩm', 'success');
      } else {
        showToast('Xóa sản phẩm thất bại', 'error');
      }
    }
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let success = false;
    let finalPayload: Partial<Product> = { ...formData };

    if (!editingProduct && !selectedFile) {
        showToast("Vui lòng chọn file ảnh cho sản phẩm mới.", "error");
        return;
    }

    if (selectedFile) {
        showToast("Đang tải ảnh lên server...", "info");
        const imageUrl = await uploadImageFile(selectedFile);

        if (!imageUrl) {
            showToast("Lỗi: Không thể upload ảnh lên server.", "error");
            return;
        }

        finalPayload.image = imageUrl;
    }

    if (editingProduct) {
      success = await updateProduct(editingProduct.id, finalPayload);
    } else {
      success = await createProduct(finalPayload);
    }

    if (success) {
      setIsModalOpen(false);
      setSelectedFile(null);
      loadData();
      showToast(editingProduct ? 'Đã cập nhật sản phẩm thành công!' : 'Đã thêm sản phẩm mới thành công!', 'success');
    } else {
      showToast('Lỗi: Không thể lưu dữ liệu sản phẩm vào cơ sở dữ liệu.', 'error');
    }
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-bold text-gray-900">Dashboard Quản Trị</h1>
           <p className="text-gray-500 mt-1">Xin chào, {user.fullName}</p>
        </div>
        <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
           <button
             onClick={() => setActiveTab('orders')}
             className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'orders' ? 'bg-brand-100 text-brand-700' : 'text-gray-600 hover:bg-gray-50'}`}
           >
             Đơn hàng
           </button>
           <button
             onClick={() => setActiveTab('products')}
             className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'products' ? 'bg-brand-100 text-brand-700' : 'text-gray-600 hover:bg-gray-50'}`}
           >
             Sản phẩm
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard icon={<ShoppingBag size={24}/>} color="blue" label="Tổng đơn hàng" value={orders.length} />
        <StatCard icon={<DollarSign size={24}/>} color="green" label="Doanh thu" value={formatCurrency(orders.reduce((sum, o) => sum + o.totalPrice, 0))} />
        <StatCard icon={<Package size={24}/>} color="purple" label="Sản phẩm" value={products.length} />
        <StatCard icon={<Users size={24}/>} color="orange" label="Khách hàng" value="4" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

        {activeTab === 'orders' && (
          <div>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Quản lý Đơn hàng</h3>
                <button onClick={loadData} className="text-brand-600 hover:text-brand-800 text-sm font-medium">Làm mới</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                   <thead className="bg-gray-50">
                      <tr>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã Đơn</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                           <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">#{order.id}</td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="font-medium text-gray-900">{order.customerName}</div>
                              <div className="text-gray-500 text-xs">{order.customerPhone}</div>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-brand-600">
                              {formatCurrency(order.totalPrice)}
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                disabled={updatingOrderId === order.id}
                                className="text-xs font-semibold rounded-full px-3 py-1 border-gray-300 focus:ring-brand-500"
                              >
                                <option value="PENDING">Chờ xử lý</option>
                                <option value="CONFIRMED">Đã xác nhận</option>
                                <option value="SHIPPED">Đang giao</option>
                                <option value="COMPLETED">Hoàn thành</option>
                                <option value="CANCELLED">Đã hủy</option>
                              </select>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Quản lý Sản phẩm</h3>
                <button
                  onClick={() => handleOpenModal()}
                  className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 flex items-center gap-2"
                >
                  <Plus size={16} /> Thêm sản phẩm
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                   <thead className="bg-gray-50">
                      <tr>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ảnh</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên sản phẩm</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danh mục</th>
                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá bán</th>
                         <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-200">
                      {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                           <td className="px-6 py-4 whitespace-nowrap">
                              <img src={product.image} alt="" className="h-10 w-10 rounded-md object-cover border border-gray-200"/>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <span className="px-2 py-1 rounded-full bg-gray-100 text-xs font-semibold">{product.category}</span>
                           </td>
                           <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-600 font-bold">{formatCurrency(product.price)}</td>
                           <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button onClick={() => handleOpenModal(product)} className="text-blue-600 hover:text-blue-900 mr-4"><Edit size={18}/></button>
                              <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18}/></button>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl animate-fade-in-up">
            <form onSubmit={handleProductSubmit}>
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-900">{editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
                  <input required type="text" className="w-full border rounded-lg px-3 py-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán (VNĐ)</label>
                  <input required type="number" min="0" className="w-full border rounded-lg px-3 py-2" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá gốc (VNĐ)</label>
                  <input type="number" min="0" className="w-full border rounded-lg px-3 py-2" value={formData.originalPrice || 0} onChange={e => setFormData({...formData, originalPrice: Number(e.target.value)})} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                  <select className="w-full border rounded-lg px-3 py-2" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as Category})}>
                    {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thương hiệu</label>
                  <input required type="text" className="w-full border rounded-lg px-3 py-2" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
                </div>

                <div className="md:col-span-2 border p-3 rounded-lg bg-gray-50">
                   <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh sản phẩm</label>

                   <input
                     type="file"
                     accept="image/*"
                     required={!editingProduct}
                     className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none"
                     onChange={handleFileChange}
                   />

                   {(selectedFile || formData.image) ? (
                       <div className="mt-3">
                         <p className="text-xs text-gray-500 mb-1">Preview:</p>
                         <img
                           src={selectedFile ? URL.createObjectURL(selectedFile) : formData.image || ''}
                           alt="Preview"
                           className="w-24 h-24 object-contain border rounded-lg p-1"
                         />
                       </div>
                   ) : null}
                 </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <textarea required rows={3} className="w-full border rounded-lg px-3 py-2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                </div>

                <div className="md:col-span-2">
                  <h4 className="font-bold text-gray-900 mb-3 border-t pt-3">Cấu hình kỹ thuật</h4>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-xs font-semibold text-gray-500">CPU</label>
                        <input type="text" className="w-full border rounded-lg px-2 py-1 text-sm" value={formData.specs?.cpu || ''} onChange={e => setFormData({...formData, specs: {...formData.specs, cpu: e.target.value}})} />
                     </div>
                     <div>
                        <label className="text-xs font-semibold text-gray-500">RAM</label>
                        <input type="text" className="w-full border rounded-lg px-2 py-1 text-sm" value={formData.specs?.ram || ''} onChange={e => setFormData({...formData, specs: {...formData.specs, ram: e.target.value}})} />
                     </div>
                     <div>
                        <label className="text-xs font-semibold text-gray-500">Ổ cứng</label>
                        <input type="text" className="w-full border rounded-lg px-2 py-1 text-sm" value={formData.specs?.storage || ''} onChange={e => setFormData({...formData, specs: {...formData.specs, storage: e.target.value}})} />
                     </div>
                     <div>
                        <label className="text-xs font-semibold text-gray-500">GPU (Card đồ họa)</label>
                        <input type="text" className="w-full border rounded-lg px-2 py-1 text-sm" value={formData.specs?.gpu || ''} onChange={e => setFormData({...formData, specs: {...formData.specs, gpu: e.target.value}})} />
                     </div>
                     <div>
                        <label className="text-xs font-semibold text-gray-500">Màn hình</label>
                        <input type="text" className="w-full border rounded-lg px-2 py-1 text-sm" value={formData.specs?.screen || ''} onChange={e => setFormData({...formData, specs: {...formData.specs, screen: e.target.value}})} />
                     </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg">Hủy</button>
                <button type="submit" className="px-6 py-2 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 shadow-lg shadow-brand-500/30">
                  {editingProduct ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, color, label, value }: { icon: any, color: string, label: string, value: string | number }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
    <div className={`p-3 rounded-lg bg-${color}-50 text-${color}-600`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
    </div>
  </div>
);

export default AdminDashboard;