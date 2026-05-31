import React, { useState } from 'react';
import { Settings, Shield, Sliders, Database, Shuffle, RefreshCw, Layers, Cpu } from 'lucide-react';

interface SettingsViewProps {
  onResetDatabase: () => void;
}

export default function SettingsView({ onResetDatabase }: SettingsViewProps) {
  // Option toggles
  const [useYOLO, setUseYOLO] = useState(false);
  const [modelConfidence, setModelConfidence] = useState(85);
  const [activeLayersCount, setActiveLayersCount] = useState(3);
  const [resetFinished, setResetFinished] = useState(false);

  const handleReset = () => {
    onResetDatabase();
    setResetFinished(true);
    setTimeout(() => setResetFinished(false), 2000);
  };

  return (
    <div id="settings-control-console" className="max-w-4xl mx-auto p-4 space-y-8 animate-fadeIn text-slate-800 font-sans">
      
      {/* Settings Header */}
      <div>
        <h1 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">Configuration Console</h1>
        <p className="text-slate-500 font-light text-sm mt-1">Configure deep neural network pipelines, SQLite database parameters, and GIS layers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Computer Vision Config (Left) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-glass space-y-6">
          <div className="pb-3 border-b border-slate-50 flex items-center">
            <Cpu className="w-5 h-5 mr-2 text-ocean animate-spin-slow" />
            <h3 className="font-display font-semibold text-slate-800 text-sm tracking-tight">Computer Vision Pipelines</h3>
          </div>

          <div className="space-y-5 text-xs text-slate-600">
            {/* Toggle 1: YOLO VS Fallback */}
            <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-800 block">YOLOv8 Autonomous Inference</span>
                <span className="text-[10px] text-slate-400 font-light font-sans block">Switch pipeline to YOLOv8 sand segmentation mode (if dependencies configured).</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={useYOLO} 
                  onChange={(e) => setUseYOLO(e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-ocean"></div>
              </label>
            </div>

            {/* Slider 1: Confidence Interval */}
            <div className="space-y-2">
              <div className="flex justify-between items-center font-bold">
                <span className="text-slate-800">Minimum Bounding Confidence</span>
                <span className="font-mono text-ocean bg-ocean/5 px-2 py-0.5 rounded text-[10px]">{modelConfidence}%</span>
              </div>
              <p className="text-[10px] text-slate-400 font-light leading-relaxed">Filter low-scoring contour boxes generated during sand analysis routines.</p>
              <input 
                type="range" 
                min="50" 
                max="95" 
                value={modelConfidence} 
                onChange={(e) => setModelConfidence(parseInt(e.target.value))}
                className="w-full accent-ocean"
              />
            </div>

            {/* Slider 2: GIS Active Layers */}
            <div className="space-y-2">
              <div className="flex justify-between items-center font-bold">
                <span className="text-slate-800">Maximum Active GIS Layers</span>
                <span className="font-mono text-[#c6996d] bg-[#c6996d]/5 px-2 py-0.5 rounded text-[10px]">{activeLayersCount} layers</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="4" 
                value={activeLayersCount} 
                onChange={(e) => setActiveLayersCount(parseInt(e.target.value))}
                className="w-full accent-[#c6996d]"
              />
            </div>
          </div>
        </div>

        {/* Database & Reset Panel (Right) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-glass space-y-6">
          <div className="pb-3 border-b border-slate-50 flex items-center">
            <Database className="w-5 h-5 mr-2 text-seagreen" />
            <h3 className="font-display font-semibold text-slate-800 text-sm tracking-tight">Relational Database Configuration</h3>
          </div>

          <div className="space-y-5 text-xs text-slate-600">
            {/* DB Details block */}
            <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex justify-between font-mono text-[10px] text-slate-400">
                <span>ACTIVE ENGINE:</span>
                <span className="text-seagreen font-bold">SQLite-v3 EMBEDDED</span>
              </div>
              <div className="space-y-1 mt-2 leading-relaxed">
                <div className="flex justify-between font-medium">
                  <span>Schema Status</span>
                  <span className="text-seagreen">Verified Compliant</span>
                </div>
                <div className="flex justify-between font-medium mt-1">
                  <span>Active Relations</span>
                  <span>6 tables (Users, Locations, Reports etc.)</span>
                </div>
              </div>
            </div>

            {/* Reset Seed Database */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-800 block">Erase & Reload Seed Locations</span>
              <p className="text-[10px] text-slate-400 font-light leading-relaxed">
                university reviewers can trigger an immediate database reload to default Marina Beach, Mahabalipuram, Puducherry and other seed elements back to default metrics.
              </p>
              
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-100 rounded-xl flex items-center gap-1.5 cursor-pointer select-none transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${resetFinished ? 'animate-spin' : ''}`} />
                <span>{resetFinished ? 'Seed Reload completed!' : 'Reload Database Seeds'}</span>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
