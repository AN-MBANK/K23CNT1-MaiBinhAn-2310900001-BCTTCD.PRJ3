
import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, CreditCard, Banknote, QrCode, Shield, Truck, Check } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: number) => void;
  onUpdateQty: (id: number, delta: number) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onRemove, onUpdateQty, onCheckout }) => {
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BANK'>('COD');
  const [showQR, setShowQR] = useState(false);

  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const handleCheckoutClick = () => {
    if (paymentMethod === 'BANK') {
      setShowQR(true);
    } else {
      onCheckout();
    }
  };

  // Tạo link QR VietQR (Dùng ngân hàng MB, thay số tài khoản của bạn vào chỗ 0000...)
  const qrUrl = `https://img.vietqr.io/image/MB-0358245899-compact.png?amount=${total}&addInfo=Thanh toan don hang MBA`;

  if (showQR) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center animate-fade-in-up">
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <QrCode className="text-brand-600"/> Quét mã thanh toán
              </h3>
              <button onClick={() => setShowQR(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24}/>
              </button>
           </div>
           
           <div className="bg-gray-100 p-4 rounded-xl mb-4">
              <img src={qrUrl} alt="VietQR" className="w-full h-auto rounded-lg mix-blend-multiply" />
           </div>

           <p className="text-gray-600 mb-2">Số tiền: <span className="font-bold text-brand-600 text-xl">{formatCurrency(total)}</span></p>
           <p className="text-sm text-gray-500 mb-6">Vui lòng quét mã trên ứng dụng ngân hàng của bạn.</p>

           <button 
             onClick={() => { setShowQR(false); onCheckout(); }}
             className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700 transition flex items-center justify-center gap-2"
           >
             <Check size={20}/> Tôi đã thanh toán
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose}></div>
      
      <div className="absolute inset-y-0 right-0 max-w-md w-full flex">
        <div className="h-full w-full bg-white shadow-xl flex flex-col animate-slide-in-right">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Giỏ hàng ({items.length})</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X size={24} />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <ShoppingCartIcon size={48} className="mb-4 text-gray-300" />
                <p>Giỏ hàng của bạn đang trống.</p>
                <button onClick={onClose} className="mt-4 text-brand-600 font-medium hover:underline">
                  Tiếp tục mua sắm
                </button>
              </div>
            ) : (
              items.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                       <h3 className="font-medium text-gray-900 line-clamp-1">{item.name}</h3>
                       <p className="text-sm text-gray-500">{item.brand}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                       <div className="flex items-center border border-gray-200 rounded">
                         <button 
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                            onClick={() => onUpdateQty(item.id, -1)}
                         >
                           -
                         </button>
                         <span className="px-2 text-sm font-medium">{item.quantity}</span>
                         <button 
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                            onClick={() => onUpdateQty(item.id, 1)}
                         >
                           +
                         </button>
                       </div>
                       <button 
                         onClick={() => onRemove(item.id)}
                         className="text-red-500 hover:text-red-600 p-1"
                       >
                         <Trash2 size={16} />
                       </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-brand-600">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Summary */}
          {items.length > 0 && (
            <div className="border-t border-gray-100 px-6 py-6 bg-gray-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
               {/* Payment Method Selection */}
               <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Phương thức thanh toán</p>
                  <div className="grid grid-cols-2 gap-3">
                     <button 
                        onClick={() => setPaymentMethod('COD')}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border text-sm font-medium transition ${paymentMethod === 'COD' ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                     >
                        <Truck size={20} className="mb-1" />
                        Thanh toán khi nhận (COD)
                     </button>
                     <button 
                        onClick={() => setPaymentMethod('BANK')}
                        className={`flex flex-col items-center justify-center p-3 rounded-lg border text-sm font-medium transition ${paymentMethod === 'BANK' ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                     >
                        <QrCode size={20} className="mb-1" />
                        Chuyển khoản / QR
                     </button>
                  </div>
               </div>

               <div className="flex justify-between mb-2 text-sm">
                 <span className="text-gray-500">Tạm tính:</span>
                 <span className="font-medium">{formatCurrency(total)}</span>
               </div>
               <div className="flex justify-between mb-4 text-sm">
                 <span className="text-gray-500">Vận chuyển:</span>
                 <span className="text-green-600 font-medium">Miễn phí</span>
               </div>
               <div className="flex justify-between mb-6 text-xl font-bold text-gray-900">
                 <span>Tổng cộng:</span>
                 <span>{formatCurrency(total)}</span>
               </div>
               
               <button 
                 onClick={handleCheckoutClick}
                 className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold hover:bg-brand-700 transition shadow-lg shadow-brand-500/30 mb-3 flex items-center justify-center gap-2"
               >
                 {paymentMethod === 'COD' ? <Banknote size={20}/> : <CreditCard size={20}/>}
                 {paymentMethod === 'COD' ? 'Đặt hàng ngay' : 'Thanh toán & Đặt hàng'}
               </button>
               <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-2">
                 <Shield size={12}/> Bảo mật thanh toán 100%
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ShoppingCartIcon = ({size, className}: {size: number, className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
)

export default CartDrawer;
