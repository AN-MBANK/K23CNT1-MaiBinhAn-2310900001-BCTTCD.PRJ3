
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { X, MapPin, Phone, User as UserIcon, CheckCircle, Loader2 } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  totalPrice: number;
  onConfirm: (info: { name: string; phone: string; address: string }) => void;
  isLoading: boolean;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ 
  isOpen, onClose, currentUser, totalPrice, onConfirm, isLoading 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  // Tự động điền thông tin nếu user đã đăng nhập
  useEffect(() => {
    if (isOpen && currentUser) {
      setFormData(prev => ({
        ...prev,
        name: currentUser.fullName || '',
        // Nếu sau này User có lưu sđt/địa chỉ thì điền vào đây
      }));
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(formData);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="bg-brand-600 px-6 py-4 flex justify-between items-center text-white">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <CheckCircle size={20} /> Xác nhận đơn hàng
          </h3>
          <button onClick={onClose} className="hover:bg-brand-700 p-1 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6 bg-brand-50 p-4 rounded-xl border border-brand-100 text-center">
            <p className="text-gray-500 text-sm mb-1">Tổng thanh toán</p>
            <p className="text-3xl font-bold text-brand-700">{formatCurrency(totalPrice)}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên người nhận</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 transition"
                  placeholder="Nhập họ tên..."
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại liên hệ</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  required
                  pattern="[0-9]{10}"
                  title="Vui lòng nhập số điện thoại 10 số"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 transition"
                  placeholder="0912..."
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Địa chỉ giao hàng</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  required
                  rows={2}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 transition"
                  placeholder="Số nhà, đường, phường/xã..."
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
             <button 
               type="button"
               onClick={onClose}
               className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition"
             >
               Quay lại
             </button>
             <button 
               type="submit"
               disabled={isLoading}
               className="flex-1 py-3 px-4 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 shadow-lg shadow-brand-500/30 transition flex justify-center items-center gap-2"
             >
               {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Hoàn tất đặt hàng'}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
