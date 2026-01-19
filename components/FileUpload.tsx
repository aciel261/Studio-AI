
import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';

interface FileUploadProps {
  id: string;
  label: string;
  required?: boolean;
  value: string | null;
  onChange: (base64: string | null) => void;
  className?: string;
  isSmall?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  id, 
  label, 
  required, 
  value, 
  onChange, 
  className = "",
  isSmall = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {value ? (
        <div className={`group relative border-2 border-dashed border-gray-200 rounded-xl overflow-hidden bg-gray-50 ${isSmall ? 'h-32' : 'h-40'}`}>
          <img src={value} alt={label} className="w-full h-full object-contain p-2" />
          <button 
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div 
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 transition-colors ${isSmall ? 'h-32' : 'h-40'}`}
        >
          <Upload className={`text-gray-400 ${isSmall ? 'w-5 h-5' : 'w-8 h-8'}`} />
          <span className="text-xs font-medium text-gray-500 text-center px-2">
            {label} {required && <span className="text-red-500">(Wajib)</span>}
          </span>
          <input 
            ref={inputRef}
            type="file" 
            id={id} 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange} 
          />
        </div>
      )}
    </div>
  );
};
