
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { GeneratedImage } from '../types';

const ImageView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const imageUrl = await geminiService.generateImage(prompt);
      setCurrentImage(imageUrl);
      setHistory(prev => [{ url: imageUrl, prompt, timestamp: new Date() }, ...prev]);
    } catch (error) {
      console.error(error);
      alert("Rasm yaratishda xatolik yuz berdi.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-10">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-xl">
          <i className="fa-solid fa-palette"></i>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Tasvir Studiyasi</h2>
          <p className="text-slate-400 text-sm">Gemini 2.5 Flash Image-ga asoslangan</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="glass p-6 rounded-3xl space-y-4">
            <label className="text-sm font-medium text-slate-300 block">Tasvir tavsifi (prompt)</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Masalan: Futuristic Central Asia city, neon lights, sunset, cinematic 4k..."
              className="w-full h-32 bg-slate-900/50 border border-slate-700 rounded-2xl p-4 text-white outline-none focus:border-purple-500 transition-colors resize-none"
            ></textarea>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl text-white font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin"></i>
                  Yaratilmoqda...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-wand-magic-sparkles"></i>
                  Tasvir yaratish
                </>
              )}
            </button>
          </div>

          <div className="glass p-6 rounded-3xl">
            <h4 className="font-bold text-white mb-4">Maslahatlar</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-emerald-400 mt-1"></i>
                Ko'proq sifat belgilari qo'shing (masalan: 8k resolution, hyper-realistic).
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-emerald-400 mt-1"></i>
                Yoritish haqida yozing (masalan: golden hour, dramatic lighting).
              </li>
              <li className="flex items-start gap-2">
                <i className="fa-solid fa-check text-emerald-400 mt-1"></i>
                Uslubni belgilang (masalan: oil painting, 3D render, anime style).
              </li>
            </ul>
          </div>
        </div>

        <div className="glass rounded-3xl overflow-hidden aspect-square flex items-center justify-center relative bg-slate-900/30 border-2 border-dashed border-slate-700">
          {isGenerating ? (
            <div className="text-center space-y-4">
              <div className="w-20 h-20 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
              <p className="text-slate-400 animate-pulse">San'at asari tayyorlanmoqda...</p>
            </div>
          ) : currentImage ? (
            <img src={currentImage} alt="Generated" className="w-full h-full object-cover animate-fadeIn" />
          ) : (
            <div className="text-center text-slate-500 p-10">
              <i className="fa-solid fa-image text-6xl mb-4 opacity-20"></i>
              <p>Hali rasm yaratilmadi. Chap tomonda tavsif kiriting.</p>
            </div>
          )}
        </div>
      </div>

      {history.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Oxirgi yaratilganlar</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {history.map((img, i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden group cursor-pointer" onClick={() => setCurrentImage(img.url)}>
                <div className="aspect-square relative">
                  <img src={img.url} alt={img.prompt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <p className="text-[10px] text-white line-clamp-2">{img.prompt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageView;
