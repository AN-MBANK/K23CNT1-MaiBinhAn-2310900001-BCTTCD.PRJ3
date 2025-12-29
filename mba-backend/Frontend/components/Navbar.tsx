import React, { useState } from 'react';
import { ShoppingCart, Menu, X, Search, Cpu, User as UserIcon, LogOut, LayoutDashboard, ShoppingBag } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onCartClick, onNavigate, currentPage, user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Trang chủ' },
    { id: 'shop', label: 'Sản phẩm' },
    { id: 'about', label: 'Giới thiệu' },
  ];
  
  const handleUserMenuClick = (page: string) => {
    onNavigate(page);
    setIsUserMenuOpen(false);
  };
  
  const renderUserMenu = () => (
    <div className="relative">
      <button 
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        className="p-2 rounded-full bg-brand-50 text-brand-700 hover:bg-brand-100 transition flex items-center gap-2"
      >
        <UserIcon size={20}/>
        <span className="hidden lg:inline text-sm font-medium">{user!.fullName.split(' ')[0]}</span>
      </button>

      {isUserMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 border border-gray-100 z-50">
          <p className="px-4 py-2 text-sm text-gray-500 font-semibold border-b border-gray-100">Xin chào, {user!.fullName.split(' ')[0]}</p>
          
          <button
            onClick={() => handleUserMenuClick('profile')}
            className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
             <UserIcon size={16}/> Hồ sơ cá nhân
          </button>
          
          <button
            onClick={() => handleUserMenuClick('user-orders')}
            className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
             <ShoppingBag size={16}/> Đơn hàng của tôi
          </button>
          
          {user!.role === 'ADMIN' && (
             <button
               onClick={() => handleUserMenuClick('admin')}
               className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
             >
               <LayoutDashboard size={16}/> Quản trị
             </button>
          )}

          <button
            onClick={onLogout}
            className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 border-t mt-1"
          >
             <LogOut size={16}/> Đăng xuất
          </button>
        </div>
      )}
    </div>
  );


  return (
    <nav className="bg-white sticky top-0 z-40 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <Cpu className="h-8 w-8 text-brand-600 mr-2" />
            <span className="font-bold text-xl text-gray-900 tracking-tight">MbaEvolution<span className="text-brand-600">AI</span></span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`${currentPage === item.id ? 'text-brand-600 font-semibold' : 'text-gray-500 hover:text-gray-900'} transition-colors duration-200`}
              >
                {item.label}
              </button>
            ))}
            {user?.role === 'ADMIN' && (
              <button
                onClick={() => onNavigate('admin')}
                className={`${currentPage === 'admin' ? 'text-red-600 font-semibold' : 'text-gray-500 hover:text-red-600'} transition-colors duration-200 flex items-center gap-1`}
              >
                <LayoutDashboard size={16}/> Admin
              </button>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => onNavigate('shop')}
              className="text-gray-500 hover:text-brand-600 p-2 rounded-full hover:bg-gray-100 transition"
              title="Tìm kiếm sản phẩm"
            >
              <Search className="h-5 w-5" />
            </button>
            <button 
              className="text-gray-500 hover:text-brand-600 p-2 rounded-full hover:bg-gray-100 relative transition"
              onClick={onCartClick}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-brand-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
            
            <div className="hidden md:flex items-center space-x-2 border-l pl-4 ml-2">
               {user ? (
                 renderUserMenu()
               ) : (
                 <>
                   <button onClick={() => onNavigate('login')} className="text-sm font-medium text-gray-700 hover:text-brand-600">Đăng nhập</button>
                   <span className="text-gray-300">|</span>
                   <button onClick={() => onNavigate('register')} className="text-sm font-medium text-gray-700 hover:text-brand-600">Đăng ký</button>
                 </>
               )}
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-500 hover:text-gray-900 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-600 hover:bg-gray-50"
              >
                {item.label}
              </button>
            ))}
             {user?.role === 'ADMIN' && (
              <button
                onClick={() => { onNavigate('admin'); setIsMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
              >
                Trang Quản Trị
              </button>
            )}
            <div className="border-t border-gray-100 pt-2 mt-2">
                {user ? (
                   <div className="px-3 py-2 space-y-2">
                      <p className="font-medium text-gray-900 mb-2">Xin chào, {user.fullName}</p>
                      
                      <button 
                         onClick={() => { onNavigate('profile'); setIsMenuOpen(false); }}
                         className="flex items-center gap-2 w-full text-left text-gray-600 hover:text-brand-600"
                      >
                         <UserIcon size={18} /> Hồ sơ cá nhân
                      </button>

                      <button 
                         onClick={() => { onNavigate('user-orders'); setIsMenuOpen(false); }}
                         className="flex items-center gap-2 w-full text-left text-gray-600 hover:text-brand-600"
                      >
                         <ShoppingBag size={18} /> Đơn hàng của tôi
                      </button>
                      <button 
                         onClick={onLogout} 
                         className="flex items-center gap-2 w-full text-left text-red-500 hover:text-red-700 mt-2"
                      >
                         <LogOut size={18} /> Đăng xuất
                      </button>
                   </div>
                ) : (
                  <>
                    <button onClick={() => { onNavigate('login'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700">Đăng nhập</button>
                    <button onClick={() => { onNavigate('register'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700">Đăng ký</button>
                  </>
                )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;