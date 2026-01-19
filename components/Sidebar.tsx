
import React from 'react';
import { 
  ImagePlus, 
  ShoppingBag, 
  LayoutTemplate, 
  History,
  Menu
} from 'lucide-react';

const navItems = [
  { id: 'kombinasi', icon: ImagePlus, label: 'Kombinasi Gambar' },
  { id: 'produk', icon: ShoppingBag, label: 'Foto Produk Profesional', active: true },
  { id: 'banner', icon: LayoutTemplate, label: 'Desain Banner Produk' },
  { id: 'story', icon: History, label: 'Desain Story' },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 border-r border-gray-200 bg-white hidden lg:flex flex-col h-full sticky top-0">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Studio AI</h1>
        <Menu className="w-5 h-5 text-gray-500 cursor-pointer" />
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              item.active 
                ? 'bg-green-600 text-white shadow-sm' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
};
