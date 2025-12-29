
import React, { useEffect, useState } from 'react';
import { Order, User } from '../types';
import { fetchOrdersByUser } from '../services/orderService';
import { Package, Calendar, MapPin, Phone, ArrowLeft, Clock } from 'lucide-react';

interface UserOrdersProps {
  user: User;
  onNavigate: (page: string) => void;
}

const UserOrders: React.FC<UserOrdersProps> = ({ user, onNavigate }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      const data = await fetchOrdersByUser(user.username);
      // Sắp xếp đơn mới nhất lên đầu
      setOrders(data.sort((a, b) => b.id - a.id));
      setLoading(false);
    };
    loadOrders();
  }, [user.username]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
       year: 'numeric', month: '2-digit', day: '2-digit',
       hour: '2-digit', minute: '2-digit'
    });
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'PENDING': return { text: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' };
      case 'CONFIRMED': return { text: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' };
      case 'SHIPPED': return { text: 'Đang giao hàng', color: 'bg-purple-100 text-purple-800' };
      case 'COMPLETED': return { text: 'Giao thành công', color: 'bg-green-100 text-green-800' };
      case 'CANCELLED': return { text: 'Đã hủy', color: 'bg-red-100 text-red-800' };
      default: return { text: status, color: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => onNavigate('home')} 
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Đơn hàng của tôi</h1>
           <p className="text-gray-500 text-sm">Theo dõi trạng thái mua sắm</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Đang tải lịch sử đơn hàng...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="inline-flex p-4 bg-gray-50 rounded-full mb-4">
             <Package size={40} className="text-gray-300" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">Bạn chưa có đơn hàng nào</h3>
          <p className="text-gray-500 mb-6">Hãy dạo một vòng cửa hàng và chọn món đồ ưng ý nhé!</p>
          <button 
            onClick={() => onNavigate('shop')}
            className="px-6 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition"
          >
            Mua sắm ngay
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            return (
              <div key={order.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition">
                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                   <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900">#{order.id}</span>
                      <span className="text-gray-300">|</span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Calendar size={14} /> {formatDate(order.orderDate)}
                      </span>
                   </div>
                   <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${statusInfo.color}`}>
                     {statusInfo.text}
                   </span>
                </div>

                {/* Body */}
                <div className="p-6">
                   <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="space-y-3">
                         <div className="flex items-start gap-3">
                            <MapPin size={18} className="text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                               <p className="text-sm font-medium text-gray-700">Địa chỉ nhận hàng</p>
                               <p className="text-gray-600">{order.address}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-3">
                            <Phone size={18} className="text-gray-400 flex-shrink-0" />
                            <div>
                               <p className="text-sm text-gray-600">{order.customerName} - {order.customerPhone}</p>
                            </div>
                         </div>
                      </div>

                      <div className="text-right">
                         <p className="text-sm text-gray-500 mb-1">Tổng tiền thanh toán</p>
                         <p className="text-2xl font-bold text-brand-600">{formatCurrency(order.totalPrice)}</p>
                         <p className="text-xs text-gray-400 mt-1">Thanh toán khi nhận hàng (COD)</p>
                      </div>
                   </div>
                </div>

                {/* Footer Status Timeline (Simplified) */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                   <div className="flex items-center text-sm text-gray-600">
                      <Clock size={16} className="mr-2 text-brand-600" />
                      {order.status === 'PENDING' && "Đơn hàng đang chờ cửa hàng xác nhận."}
                      {order.status === 'CONFIRMED' && "Đơn hàng đã được xác nhận, đang chuẩn bị hàng."}
                      {order.status === 'SHIPPED' && "Đơn vị vận chuyển đang giao hàng đến bạn."}
                      {order.status === 'COMPLETED' && "Đơn hàng đã giao thành công. Cảm ơn bạn!"}
                      {order.status === 'CANCELLED' && "Đơn hàng đã bị hủy."}
                   </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserOrders;
