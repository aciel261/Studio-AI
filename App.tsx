
import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { FileUpload } from './components/FileUpload';
import { Mood, AspectRatio, ProductPhotoSettings, GeneratedResult } from './types';
import { analyzeProductImage, generateProductPhoto } from './services/geminiService';
import { Wand2, Image as ImageIcon, Sparkles, Loader2, Download } from 'lucide-react';

const App: React.FC = () => {
  const [settings, setSettings] = useState<ProductPhotoSettings>({
    productImage: null,
    modelImage: null,
    logoImage: null,
    backgroundPrompt: '',
    mood: Mood.BRIGHT,
    aspectRatio: AspectRatio.SQUARE,
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!settings.productImage) {
      setError("Silakan unggah gambar produk terlebih dahulu.");
      return;
    }
    setError(null);
    setIsAnalyzing(true);
    try {
      const suggestion = await analyzeProductImage(settings.productImage);
      setSettings(prev => ({ ...prev, backgroundPrompt: suggestion }));
    } catch (err) {
      setError("Gagal menganalisa gambar. Coba lagi.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    if (!settings.productImage) {
      setError("Silakan unggah gambar produk terlebih dahulu.");
      return;
    }
    if (!settings.backgroundPrompt) {
      setError("Silakan isi deskripsi latar belakang atau gunakan analisa AI.");
      return;
    }

    setError(null);
    setIsGenerating(true);
    try {
      const imageUrl = await generateProductPhoto(settings);
      if (imageUrl) {
        setResult({ imageUrl, timestamp: Date.now() });
      } else {
        setError("Gagal membuat foto produk. Silakan coba deskripsi yang berbeda.");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat menghubungi server AI.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadResult = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result.imageUrl;
    link.download = `product-shot-${result.timestamp}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex min-h-screen bg-[#f8f9fb]">
      <Sidebar />
      
      <main className="flex-1 flex flex-col md:flex-row p-4 md:p-8 gap-8 max-w-[1600px] mx-auto w-full">
        {/* Settings Panel */}
        <div className="w-full md:w-[400px] flex flex-col gap-6">
          <header>
            <h2 className="text-2xl font-bold text-gray-900">Foto Produk Profesional</h2>
            <p className="text-gray-500 mt-2">Unggah gambar produk Anda dan biarkan AI menyempurnakannya.</p>
          </header>

          <section className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            {/* Main Image Upload */}
            <FileUpload 
              id="product-image" 
              label="Gambar Produk" 
              required 
              value={settings.productImage}
              onChange={(val) => setSettings(p => ({ ...p, productImage: val }))}
            />

            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !settings.productImage}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-gray-700 font-medium transition-all"
            >
              {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-purple-500" />}
              Analisa Gambar & Beri Saran Prompt
            </button>

            {/* Background Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Latar Belakang / Tempat</label>
              <textarea 
                className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:outline-none transition-all resize-none min-h-[100px]"
                placeholder="Contoh: di atas meja kayu, di pantai saat senja, studio minimalis modern..."
                value={settings.backgroundPrompt}
                onChange={(e) => setSettings(p => ({ ...p, backgroundPrompt: e.target.value }))}
              />
            </div>

            {/* Mood Selection */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Suasana</label>
              <div className="flex gap-2">
                {Object.values(Mood).map((m) => (
                  <button
                    key={m}
                    onClick={() => setSettings(p => ({ ...p, mood: m }))}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      settings.mood === m 
                        ? 'bg-green-600 text-white shadow-sm' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Optional Uploads */}
            <div className="grid grid-cols-2 gap-4">
              <FileUpload 
                id="model-image" 
                label="Model (Opsional)" 
                isSmall
                value={settings.modelImage}
                onChange={(val) => setSettings(p => ({ ...p, modelImage: val }))}
              />
              <FileUpload 
                id="logo-image" 
                label="Logo (Opsional)" 
                isSmall
                value={settings.logoImage}
                onChange={(val) => setSettings(p => ({ ...p, logoImage: val }))}
              />
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Rasio Aspek</label>
              <div className="grid grid-cols-4 gap-2">
                {Object.values(AspectRatio).map((r) => (
                  <button
                    key={r}
                    onClick={() => setSettings(p => ({ ...p, aspectRatio: r }))}
                    className={`py-2 rounded-lg text-sm font-medium transition-all ${
                      settings.aspectRatio === r 
                        ? 'bg-green-600 text-white shadow-sm' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 py-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-green-200 transition-all"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Memproses Foto...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Buat Foto Produk
                </>
              )}
            </button>
          </section>
        </div>

        {/* Display Area */}
        <div className="flex-1 min-h-[500px] flex flex-col gap-4">
          <div className="flex-1 bg-white rounded-[2rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-8 relative overflow-hidden">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-4 animate-pulse text-gray-400">
                <Loader2 className="w-16 h-16 animate-spin" />
                <p className="font-medium">AI sedang menyusun pencahayaan dan latar belakang...</p>
              </div>
            ) : result ? (
              <>
                <div className="w-full h-full flex items-center justify-center">
                   <img 
                    src={result.imageUrl} 
                    alt="Generated Product" 
                    className="max-w-full max-h-full rounded-xl object-contain shadow-2xl"
                  />
                </div>
                <button 
                  onClick={downloadResult}
                  className="absolute bottom-6 right-6 bg-white/90 backdrop-blur hover:bg-white text-gray-800 p-3 rounded-full shadow-lg border border-gray-200 transition-all"
                >
                  <Download className="w-6 h-6" />
                </button>
              </>
            ) : (
              <div className="flex flex-col items-center text-center gap-6 max-w-sm">
                <div className="w-24 h-24 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-300">
                  <ImageIcon className="w-12 h-12" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Hasil Gambar Anda Akan Muncul Di Sini</h3>
                  <p className="text-gray-500 mt-2">Atur opsi di sebelah kiri dan klik "Buat Foto Produk" untuk melihat keajaibannya.</p>
                </div>
              </div>
            )}
          </div>
          
          {result && (
            <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <span className="text-sm font-medium text-gray-500">Hasil Terkini - {new Date(result.timestamp).toLocaleTimeString()}</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setResult(null)} 
                  className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  Hapus
                </button>
                <button 
                  onClick={downloadResult}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-bold transition-colors"
                >
                  Unduh HD
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
