// FILE: UserProfile.tsx (Tạo mới)

import React from 'react';
import { User } from '../types';
import { User as UserIcon, Mail, Hash, Briefcase, ArrowLeft } from 'lucide-react';

interface UserProfileProps {
  user: User;
  onNavigate: (page: string) => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onNavigate }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 min-h-screen">

      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => onNavigate('home')}
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <ArrowLeft size={24} className="text-gray-600" />
        </button>
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Hồ Sơ Của Tôi</h1>
           <p className="text-gray-500 text-sm">Quản lý thông tin cá nhân và tài khoản</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-8">
         <div className="text-center">
            <div className="w-24 h-24 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{user.fullName}</h2>
            <p className="text-gray-500 text-sm">@{user.username}</p>
         </div>

         <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-bold text-gray-900">Chi tiết tài khoản</h3>

            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
               <Mail size={20} className="text-brand-600" />
               <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{user.email}</p>
               </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
               <Hash size={20} className="text-brand-600" />
               <div>
                  <p className="text-xs text-gray-500">Tên đăng nhập</p>
                  <p className="font-medium text-gray-800">{user.username}</p>
               </div>
            </div>

            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
               <Briefcase size={20} className="text-brand-600" />
               <div>
                  <p className="text-xs text-gray-500">Vai trò</p>
                  <p className="font-medium text-gray-800">{user.role === 'ADMIN' ? 'Quản Trị Viên' : 'Khách Hàng'}</p>
               </div>
            </div>
         </div>

         <div className="border-t pt-6 flex justify-end">
             <button
                 onClick={() => onNavigate('user-orders')}
                 className="px-6 py-2 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition"
             >
                Xem Lịch Sử Đơn Hàng
             </button>
         </div>
      </div>
    </div>
  );
};

export default UserProfile;