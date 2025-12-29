import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './views/Home';
import Shop from './views/Shop';
import ProductDetail from './views/ProductDetail';
import CartDrawer from './views/CartDrawer';
import AIChatBot from './components/AIChatBot';
import Login from './views/Login';
import Register from './views/Register';
import AdminDashboard from './views/AdminDashboard';
import UserOrders from './views/UserOrders';
import CheckoutModal from './components/CheckoutModal';
import AICompareModal from './components/AICompareModal';
import UserProfile from './views/UserProfile';
import { Product, CartItem, User } from './types';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone, Scale, X, Sparkles } from 'lucide-react';
import { useToast } from './contexts/ToastContext';
import { compareProductsAI } from './services/geminiService';

const App: React.FC = () => {
  const { showToast } = useToast();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [aiCompareResult, setAiCompareResult] = useState('');
  const [isComparing, setIsComparing] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`Đã thêm ${product.name} vào giỏ`, 'success');
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
    showToast('Đã xóa sản phẩm khỏi giỏ', 'info');
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleAddToCompare = (product: Product) => {
    setCompareList(prev => {
      if (prev.find(p => p.id === product.id)) {
        showToast("Sản phẩm này đã có trong danh sách so sánh", 'info');
        return prev;
      }
      if (prev.length >= 2) {
        showToast("Chỉ so sánh được tối đa 2 sản phẩm", 'error');
        return prev;
      }
      showToast("Đã thêm vào danh sách so sánh", 'success');
      return [...prev, product];
    });
  };

  const handleRemoveCompare = (id: number) => {
    setCompareList(prev => prev.filter(p => p.id !== id));
  };

  const handleRunComparison = async () => {
    if (compareList.length < 2) return;
    setIsCompareModalOpen(true);
    setIsComparing(true);
    const result = await compareProductsAI(compareList[0], compareList[1]);
    setAiCompareResult(result);
    setIsComparing(false);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleViewDetail = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('detail');
    window.scrollTo(0, 0);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    showToast(`Xin chào, ${user.fullName}!`, 'success');
    if (user.role === 'ADMIN') {
      handleNavigate('admin');
    } else {
      handleNavigate('home');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
    showToast('Đã đăng xuất thành công', 'info');
    handleNavigate('home');
  };

  const handleCheckoutStart = () => {
    if (cart.length === 0) {
      showToast("Giỏ hàng đang trống!", 'error');
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutModalOpen(true);
  };

  const handleConfirmCheckout = async (customerInfo: { name: string; phone: string; address: string }) => {
    setIsProcessingOrder(true);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderData = {
      customerName: customerInfo.name,
      customerPhone: customerInfo.phone,
      address: customerInfo.address,
      totalPrice: totalPrice,
      status: "PENDING",
      username: currentUser ? currentUser.username : null
    };

    try {
      const response = await fetch('http://localhost:8080/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        setCart([]);
        setIsCheckoutModalOpen(false);
        showToast("Đặt hàng thành công! Cảm ơn bạn.", 'success');

        if(currentUser) {
             setTimeout(() => handleNavigate('user-orders'), 1500);
        }
      } else {
        showToast("Có lỗi xảy ra khi gửi đơn hàng.", 'error');
      }
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      showToast("Không thể kết nối Server. Backend đã bật chưa?", 'error');
    } finally {
      setIsProcessingOrder(false);
    }
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <Home onAddToCart={addToCart} onViewDetail={handleViewDetail} onNavigate={handleNavigate} onCompare={handleAddToCompare} />;
      case 'shop':
        return <Shop onAddToCart={addToCart} onViewDetail={handleViewDetail} onCompare={handleAddToCompare} />;
      case 'detail':
        return selectedProduct ? (
          <ProductDetail
            product={selectedProduct}
            onAddToCart={addToCart}
            onBack={() => handleNavigate('shop')}
            onViewDetail={handleViewDetail}
            onCompare={handleAddToCompare}
          />
        ) : <Shop onAddToCart={addToCart} onViewDetail={handleViewDetail} onCompare={handleAddToCompare} />;
      case 'login':
        return <Login onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />;
      case 'register':
        return <Register onNavigate={handleNavigate} />;

      case 'profile':
         if (!currentUser) {
            handleNavigate('login');
            return null;
         }
         return <UserProfile user={currentUser} onNavigate={handleNavigate} />;

      case 'admin':
        if (!currentUser || currentUser.role !== 'ADMIN') {
          return <div className="p-10 text-center text-red-500 font-bold">Bạn không có quyền truy cập trang này!</div>;
        }
        return <AdminDashboard user={currentUser} />;
      case 'user-orders':
         if (!currentUser) {
            handleNavigate('login');
            return null;
         }
         return <UserOrders user={currentUser} onNavigate={handleNavigate} />;
      default:
        return <Home onAddToCart={addToCart} onViewDetail={handleViewDetail} onNavigate={handleNavigate} onCompare={handleAddToCompare} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-slate-800">
      <Navbar
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onNavigate={handleNavigate}
        currentPage={currentPage}
        user={currentUser}
        onLogout={handleLogout}
      />

      <main className="flex-grow">
        {renderContent()}
      </main>

      {compareList.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-5px_15px_rgba(0,0,0,0.1)] p-4 z-40 animate-slide-in-up">
           <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4 overflow-x-auto">
                 <div className="flex items-center gap-2 text-brand-700 font-bold">
                    <Scale size={24} /> So sánh
                 </div>
                 {compareList.map(p => (
                   <div key={p.id} className="flex items-center gap-2 bg-gray-100 pl-2 pr-3 py-1 rounded-full border border-gray-200">
                      <img src={p.image} className="w-8 h-8 rounded-full object-cover" alt="" />
                      <span className="text-sm font-medium line-clamp-1 max-w-[100px]">{p.name}</span>
                      <button onClick={() => handleRemoveCompare(p.id)} className="text-gray-400 hover:text-red-500"><X size={14}/></button>
                   </div>
                 ))}
                 {compareList.length < 2 && (
                   <div className="text-sm text-gray-400 italic">Chọn thêm 1 sản phẩm nữa...</div>
                 )}
              </div>

              <div className="flex gap-2">
                 <button onClick={() => setCompareList([])} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg text-sm">
                   Xóa hết
                 </button>
                 <button
                   onClick={handleRunComparison}
                   disabled={compareList.length < 2}
                   className="bg-brand-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                 >
                   <Sparkles size={18} /> Phân tích AI
                 </button>
              </div>
           </div>
        </div>
      )}

      <footer className="bg-white border-t border-gray-200 pt-16 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto px-4">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div>
                <h3 className="font-bold text-xl text-gray-900 mb-4">MbaEvolution<span className="text-brand-600">AI</span></h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">
                  Hệ thống bán lẻ thiết bị công nghệ hàng đầu Việt Nam. Tiên phong ứng dụng AI vào trải nghiệm mua sắm.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="text-gray-400 hover:text-brand-600"><Facebook size={20} /></a>
                  <a href="#" className="text-gray-400 hover:text-brand-600"><Instagram size={20} /></a>
                  <a href="#" className="text-gray-400 hover:text-brand-600"><Twitter size={20} /></a>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-4">Liên kết nhanh</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li><button onClick={() => handleNavigate('home')} className="hover:text-brand-600">Trang chủ</button></li>
                  <li><button onClick={() => handleNavigate('shop')} className="hover:text-brand-600">Sản phẩm</button></li>
                  <li><a href="#" className="hover:text-brand-600">Về chúng tôi</a></li>
                  <li><a href="#" className="hover:text-brand-600">Blog công nghệ</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-4">Chính sách</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li><a href="#" className="hover:text-brand-600">Chính sách bảo hành</a></li>
                  <li><a href="#" className="hover:text-brand-600">Chính sách đổi trả</a></li>
                  <li><a href="#" className="hover:text-brand-600">Vận chuyển & Giao nhận</a></li>
                  <li><a href="#" className="hover:text-brand-600">Bảo mật thông tin</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-4">Liên hệ</h4>
                <ul className="space-y-3 text-sm text-gray-500">
                  <li className="flex items-start gap-3">
                    <MapPin size={18} className="text-brand-600 mt-0.5" />
                    <span>123 Đường Công Nghệ, Quận 1, TP. Hồ Chí Minh</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Phone size={18} className="text-brand-600" />
                    <span>1900 123 456</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Mail size={18} className="text-brand-600" />
                    <span>support@mbaevolution.ai</span>
                  </li>
                </ul>
              </div>
           </div>

           <div className="border-t border-gray-100 pt-8 text-center text-sm text-gray-400">
             <p>&copy; 2024 MbaEvolutionAI. All rights reserved.</p>
           </div>
        </div>
      </footer>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemove={removeFromCart}
        onUpdateQty={updateQuantity}
        onCheckout={handleCheckoutStart}
      />

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        currentUser={currentUser}
        totalPrice={cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
        onConfirm={handleConfirmCheckout}
        isLoading={isProcessingOrder}
      />

      <AICompareModal 
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        p1={compareList[0]}
        p2={compareList[1]}
        aiResult={aiCompareResult}
        isLoading={isComparing}
      />

      <AIChatBot />
    </div>
  );
};

export default App;