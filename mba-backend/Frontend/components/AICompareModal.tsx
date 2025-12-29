
import React from 'react';
import { Product } from '../types';
import { X, Sparkles, CheckCircle } from 'lucide-react';

interface AICompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  p1: Product | null;
  p2: Product | null;
  aiResult: string;
  isLoading: boolean;
}

const AICompareModal: React.FC<AICompareModalProps> = ({ isOpen, onClose, p1, p2, aiResult, isLoading }) => {
  if (!isOpen || !p1 || !p2) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black bg-opacity-70 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden animate-fade-in-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600 to-purple-600 p-6 flex justify-between items-center text-white shrink-0">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-white/20 rounded-lg">
                <Sparkles size={24} className="text-yellow-300" />
             </div>
             <div>
                <h3 className="text-xl font-bold">Phân Tích & So Sánh AI</h3>
                <p className="text-brand-100 text-sm">Powered by Gemini 2.5 Flash</p>
             </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-2 rounded-full transition">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
           {/* Product VS Header */}
           <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                 <img src={p1.image} alt={p1.name} className="h-24 w-full object-contain mb-3" />
                 <h4 className="font-bold text-gray-900 line-clamp-1">{p1.name}</h4>
                 <p className="text-brand-600 font-bold">{p1.price.toLocaleString()} đ</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
                 <img src={p2.image} alt={p2.name} className="h-24 w-full object-contain mb-3" />
                 <h4 className="font-bold text-gray-900 line-clamp-1">{p2.name}</h4>
                 <p className="text-brand-600 font-bold">{p2.price.toLocaleString()} đ</p>
              </div>
           </div>

           {/* AI Result */}
           <div className="bg-white rounded-xl shadow-sm border border-brand-100 p-6 md:p-8">
              {isLoading ? (
                 <div className="flex flex-col items-center justify-center py-10 space-y-4">
                    <div className="relative">
                       <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
                       <Sparkles size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-600 animate-pulse" />
                    </div>
                    <p className="text-gray-500 font-medium animate-pulse">AI đang đọc thông số kỹ thuật...</p>
                 </div>
              ) : (
                 <div className="prose prose-blue max-w-none">
                    <div className="flex items-center gap-2 mb-4 text-brand-700">
                       <CheckCircle size={20} />
                       <span className="font-bold uppercase tracking-wider text-sm">Kết quả phân tích</span>
                    </div>
                    <div className="whitespace-pre-line text-gray-700 leading-relaxed text-lg">
                       {aiResult}
                    </div>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AICompareModal;
