import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle, ChevronDown, Award, Microscope, ShieldAlert, 
  MapPin, HelpCircle, Activity, Waves, Landmark, RefreshCw,
  Sliders, Grid, Percent, TrendingUp, Info, Eye
} from 'lucide-react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { Upload } from '../types';

interface AnalysisResultsViewProps {
  uploads: Upload[];
  selectedUpload: Upload | null;
  onSelectUpload: (upload: Upload) => void;
  setActiveTab: (tab: string) => void;
  onGenerateReport: (uploadId: string) => void;
}

export default function AnalysisResultsView({ 
  uploads, 
  selectedUpload, 
  onSelectUpload,
  setActiveTab,
  onGenerateReport
}: AnalysisResultsViewProps) {
  
  // Set default active upload if none is selected
  const activeUpload = selectedUpload || (uploads.length > 0 ? uploads[0] : null);

  if (!activeUpload) {
    return (
      <div className="max-w-4xl mx-auto p-4 py-20 text-center space-y-6">
        <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl w-20 mx-auto text-slate-400">
          <Microscope className="w-10 h-10 text-ocean animate-pulse" />
        </div>
        <div>
          <h2 className="font-display font-bold text-xl text-slate-900">No AI Scans Completed</h2>
          <p className="text-slate-500 font-light text-sm mt-1 max-w-sm mx-auto">Please go to the Upload Image portal to start a new computer vision crystallographic analysis.</p>
        </div>
        <button
          onClick={() => setActiveTab('upload')}
          className="px-6 py-3 bg-ocean text-white text-xs font-semibold rounded-2xl shadow-lg shadow-ocean/15 cursor-pointer hover:bg-ocean-light transition-all"
        >
          Upload Beach Sample
        </button>
      </div>
    );
  }

  const ans = activeUpload.analysis!;

  // Fallback defaults for newly added scientific variables in older records
  const averageGrainSize = ans.averageGrainSize || 0.55;
  const grainDensity = ans.grainDensity || 142;
  const finePercentage = ans.fineSandPercentage || 22;
  const mediumPercentage = ans.mediumSandPercentage || 53;
  const coarsePercentage = ans.coarseSandPercentage || 25;
  const uniformity = ans.sedimentUniformity || 2.25;
  const d10 = ans.d10 || 0.18;
  const d30 = ans.d30 || 0.32;
  const d50 = ans.d50 || 0.55;
  const d60 = ans.d60 || 0.68;
  const d90 = ans.d90 || 1.12;

  // Chart data 1: Particle Size Fraction Distribution (Pie / Histogram)
  const compositionData = [
    { name: 'Fine Sand', percentage: finePercentage, color: '#0F4C81' },
    { name: 'Medium Sand', percentage: mediumPercentage, color: '#C6996D' },
    { name: 'Coarse Sand', percentage: coarsePercentage, color: '#334155' }
  ];

  // Chart data 2: Cumulative Curve distribution points
  const cumulativeData = [
    { size: 0.1, passing: 0, label: '0.10 mm' },
    { size: d10, passing: 10, label: `D10: ${d10} mm` },
    { size: d30, passing: 30, label: `D30: ${d30} mm` },
    { size: d50, passing: 50, label: `D50: ${d50} mm` },
    { size: d60, passing: 60, label: `D60: ${d60} mm` },
    { size: d90, passing: 90, label: `D90: ${d90} mm` },
    { size: 1.5, passing: 100, label: '1.50 mm' }
  ];

  // Helper render circular gauge
  const renderCircularGauge = (score: number, strokeColor: string, title: string, category: string) => {
    const radius = 28;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
      <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 p-4 rounded-2xl shadow-sm">
        <div className="relative flex items-center justify-center shrink-0 w-16 h-16">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="50%" cy="50%" r={radius} fill="transparent" stroke="#E2E8F0" strokeWidth="5" />
            <circle cx="50%" cy="50%" r={radius} fill="transparent" stroke={strokeColor} strokeWidth="5" 
              strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <span className="absolute text-xs font-bold font-mono text-slate-800">{score}%</span>
        </div>
        <div>
          <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider block">{title}</span>
          <span className="text-xs font-extrabold text-slate-800 block mt-0.5">{category}</span>
        </div>
      </div>
    );
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Stable': return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Moderate Risk': return 'bg-amber-50 text-amber-800 border-amber-200';
      default: return 'bg-rose-50 text-rose-800 border-rose-200';
    }
  };

  // Live microscopic particle lattice simulation
  const renderDensityHeatmap = (score: number) => {
    const dotsCount = Math.round(score * 1.5 + 40);
    const grains = Array.from({ length: Math.min(220, dotsCount) }).map((_, i) => {
      const x = Math.abs(Math.sin(i * 47.93)) * 92 + 4;
      const y = Math.abs(Math.cos(i * 31.41)) * 92 + 4;
      const size = 1.5 + (Math.abs(Math.sin(i * 12.5)) * 3);
      const isCoarse = size > 3.5;
      return { x, y, size, isCoarse };
    });

    return (
      <div className="relative w-full h-44 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex flex-col justify-between p-3 font-mono">
        <div className="absolute inset-x-0 top-0 p-2 py-1.5 bg-slate-900/90 border-b border-slate-850 flex justify-between items-center text-[10px] text-slate-400 z-10">
          <span className="flex items-center gap-1.5"><Grid className="w-3.5 h-3.5 text-emerald-400" /> COHESIVE SEDIMENT PACKING MATRIX</span>
          <span className="text-emerald-400 font-bold">{score} grains/cm²</span>
        </div>
        <div className="flex-grow mt-3 relative">
          {grains.map((g, idx) => (
            <span 
              key={idx} 
              className={`absolute rounded-full opacity-65 border ${g.isCoarse ? 'bg-amber-300/40 border-amber-400/20' : 'bg-slate-350/50 border-slate-200/20'}`}
              style={{
                left: `${g.x}%`,
                top: `${g.y}%`,
                width: `${g.size}px`,
                height: `${g.size}px`,
              }}
            />
          ))}
        </div>
        <div className="flex justify-between items-center text-[8px] text-slate-500 z-10 font-mono uppercase tracking-wider border-t border-slate-900 pt-1">
          <span>Density Factor: {(score / 100).toFixed(2)}x</span>
          <span>Simulation Active</span>
        </div>
      </div>
    );
  };

  return (
    <div id="analysis-results-view" className="max-w-7xl mx-auto p-4 space-y-8 animate-fadeIn text-slate-800">
      
      {/* Upper header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-ocean bg-ocean/10 p-1.5 rounded-lg flex items-center justify-center shrink-0">
              <Microscope className="w-5 h-5 animate-pulse" />
            </span>
            <span className="text-[10px] text-[#c6996d] uppercase font-mono font-bold tracking-widest leading-none">Sedimentary Lab Terminal</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight mt-1.5">Coastal Sediment Dashboard</h1>
          <p className="text-slate-500 font-light text-sm mt-0.5">High fidelity crystallographic metrics, grain compositions, and risk statistics.</p>
        </div>

        {/* Selected Sample Select dropdown */}
        <div className="relative font-sans shrink-0">
          <select
            value={activeUpload.id}
            onChange={(e) => {
              const target = uploads.find(u => u.id === e.target.value);
              if (target) onSelectUpload(target);
            }}
            className="pl-4 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-slate-700 appearance-none shadow-sm cursor-pointer outline-none focus:ring-2 focus:ring-ocean/10"
          >
            {uploads.map(u => (
              <option key={u.id} value={u.id}>{u.beachName} ({u.dateCollected})</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-4 pointer-events-none" />
        </div>
      </div>

      {/* Primary Layout Block: Split Visual Preview & Laboratory Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Photograph Frame & dynamic AI Observation text */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Pristine Photograph Card - NO BOUNDING BOXES OR OVERLAYS */}
          <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-glass space-y-4">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-ocean" />
                <h3 className="font-display font-bold text-slate-800 text-sm tracking-tight">Shoreline Photograph</h3>
              </div>
              <span className="text-[9px] bg-emerald-50 text-emerald-800 border-emerald-100 font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider">
                Original Match
              </span>
            </div>

            {/* Pristine un-obstructed photograph */}
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-900/5 shadow-inner border border-slate-100">
              <img 
                src={activeUpload.imageUrl} 
                alt={activeUpload.beachName} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <p className="text-[10px] text-slate-400 text-center font-mono uppercase tracking-wider pt-1.5">
              Visual analysis generated dynamically. No object bounding overlays active.
            </p>
          </div>

          {/* AI Observation Card - Dynamic Natural Language Observation */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-glass border-slate-150 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono uppercase tracking-wider">Coastal Intelligence</span>
              <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold border uppercase tracking-wider ${getStatusStyle(ans.overallStatus)}`}>
                {ans.overallStatus}
              </span>
            </div>

            <div className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-2">
              <p className="text-[9px] font-mono font-bold text-slate-400 tracking-wider">LABORATORY OBSERVATION</p>
              <p className="text-xs text-slate-600 font-sans leading-relaxed font-light">{ans.observations}</p>
            </div>

            <div className="space-y-2 pl-2 border-l-2 border-rose-500">
              <p className="text-[10px] font-mono font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" /> Recommended Safeguard Protocol
              </p>
              <p className="text-xs font-bold text-slate-700 leading-normal font-sans">
                {ans.recommendedAction}
              </p>
            </div>
            
            <div className="pt-2">
              <button
                onClick={() => {
                  onGenerateReport(activeUpload.id);
                  setActiveTab('reports');
                }}
                className="w-full py-3 bg-ocean hover:bg-ocean-light text-white rounded-2xl font-bold shadow-md text-xs flex justify-center items-center transition-all cursor-pointer"
              >
                <Award className="w-4 h-4 mr-2" />
                <span>Download Professional Sediment Report</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: High Fidelity Instrument panel & Recharts Visualizations */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Scientific Metric Cards Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-28">
              <span className="text-[9px] text-[#c6996d] font-mono font-bold uppercase tracking-wider">Avg Grain Size</span>
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono">{averageGrainSize} <sub className="text-xs font-light font-sans text-slate-400">mm</sub></span>
              <span className="text-[9px] text-slate-400 mt-1 block">Medium Sand fraction</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-28">
              <span className="text-[9px] text-[#c6996d] font-mono font-bold uppercase tracking-wider">Grain Density</span>
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono">{grainDensity}</span>
              <span className="text-[9px] text-slate-400 mt-1 block">particles / cm²</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-28">
              <span className="text-[9px] text-[#c6996d] font-mono font-bold uppercase tracking-wider">Uniformity (Cu)</span>
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono">{uniformity}</span>
              <span className="text-[9px] text-slate-400 mt-1 block">D60 / D10 sediment ratio</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-28">
              <span className="text-[9px] text-[#c6996d] font-mono font-bold uppercase tracking-wider">Scan Confidence</span>
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono">{ans.confidenceScore}%</span>
              <span className="text-[9px] text-slate-400 mt-1 block">Sensor reliability</span>
            </div>

          </div>

          {/* S-Curve Cumulative Grain Size Line Graph */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-glass space-y-4">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
              <div>
                <h3 className="font-display font-semibold text-slate-800 text-sm">Cumulative Grain Size Distribution S-Curve</h3>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">Geotechnical sieve analysis representation</p>
              </div>
              <span className="text-[9px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 font-mono">D-Diameters</span>
            </div>

            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cumulativeData} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="size" type="number" scale="linear" domain={[0, 1.4]} stroke="#94A3B8" fontSize={10} 
                    tickFormatter={(v) => `${v.toFixed(1)} mm`} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={10} tickFormatter={(v) => `${v}%`} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ border: 'none', borderRadius: '12px', background: 'rgba(15,76,129,0.95)', color: '#fff', fontSize: '11px' }}
                    formatter={(value) => [`${value}% passing`, 'Percentage']}
                    labelFormatter={(label) => `Grain Diameter: ${label} mm`}
                  />
                  <Line type="monotone" dataKey="passing" stroke="#0F4C81" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-mono text-slate-500 bg-slate-50 p-2.5 rounded-xl">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-bold">D10</span>
                <span className="font-extrabold text-slate-850 mt-1 block">{d10} mm</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-bold">D30</span>
                <span className="font-extrabold text-slate-850 mt-1 block">{d30} mm</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-bold">D50</span>
                <span className="font-extrabold text-slate-850 mt-1 block">{d50} mm</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-bold">D60</span>
                <span className="font-extrabold text-slate-850 mt-1 block">{d60} mm</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-bold">D90</span>
                <span className="font-extrabold text-slate-850 mt-1 block">{d90} mm</span>
              </div>
            </div>
          </div>

          {/* Sediment Composition Histogram Bar Chart & Pie Chart */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Histogram Fraction (7 Cols) */}
            <div className="md:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-glass space-y-4">
              <h4 className="font-display font-semibold text-slate-800 text-sm">Grain Size Histogram Fraction</h4>
              
              <div className="h-44 pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={compositionData} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="name" stroke="#94A3B8" fontSize={9} tickLine={false} />
                    <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} />
                    <Tooltip contentStyle={{ border: 'none', borderRadius: '8px', background: '#334155', color: '#fff', fontSize: '11px' }} />
                    <Bar dataKey="percentage" radius={[8, 8, 0, 0]}>
                      {compositionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Microscopic Spacing and Composition Pie Chart (5 Cols) */}
            <div className="md:col-span-5 bg-white p-5 rounded-3xl border border-slate-100 shadow-glass flex flex-col justify-between">
              <h4 className="font-display font-semibold text-slate-800 text-xs">Sediment Composition</h4>
              
              <div className="h-32 flex items-center justify-center relative my-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={compositionData} cx="50%" cy="50%" innerRadius={28} outerRadius={42} paddingAngle={4} dataKey="percentage">
                      {compositionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Central total */}
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-[9px] text-slate-400 uppercase font-mono tracking-wider font-bold">Sum</span>
                  <span className="text-xs font-mono font-extrabold text-slate-800">100%</span>
                </div>
              </div>

              {/* Labels details list */}
              <div className="space-y-1 text-[10px] bg-slate-50 p-2 rounded-xl">
                {compositionData.map((entry, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="flex items-center gap-1.5 font-medium text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
                      {entry.name}
                    </span>
                    <span className="font-mono font-bold text-slate-700">{entry.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Interactive Density Packing Heatmap & Segmented Coastal Gauges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Particle Density Simulation Heatmap */}
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-glass space-y-3">
              <div>
                <h4 className="font-display font-semibold text-slate-800 text-sm">Sediment Packing Heatmap</h4>
                <p className="text-[10px] text-slate-400 font-mono">Microstructure crystallization preview</p>
              </div>
              {renderDensityHeatmap(grainDensity)}
            </div>

            {/* Gauge indicators for Coastal Stability and Erosion Risk */}
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-glass space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="font-display font-semibold text-slate-800 text-sm">Hazards & Stability Gauges</h4>
                <p className="text-[10px] text-slate-400 font-mono">Active risk warning matrices</p>
              </div>

              <div className="space-y-3">
                {renderCircularGauge(
                  ans.coastalStabilityScore, 
                  ans.coastalStabilityScore > 70 ? '#10B981' : ans.coastalStabilityScore >= 40 ? '#F59E0B' : '#EF4444', 
                  'Coastal Stability Gauge', 
                  ans.overallStatus
                )}

                {renderCircularGauge(
                  ans.erosionRiskScore, 
                  ans.erosionRiskScore > 70 ? '#EF4444' : ans.erosionRiskScore >= 40 ? '#F59E0B' : '#10B981', 
                  'Erosion Risk Indicator', 
                  ans.erosionRiskScore > 70 ? 'Extreme Threat' : ans.erosionRiskScore >= 40 ? 'Moderate Alert' : 'Minimal Danger'
                )}
              </div>
            </div>

          </div>

          {/* Color Composition profiling analysis card */}
          <div className="bg-white p-7 rounded-3xl border border-slate-100 shadow-glass grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-2.5">
              <h3 className="font-display font-semibold text-slate-800 text-base">Crystallography Color Profiler</h3>
              <p className="text-xs text-slate-500 font-light leading-relaxed">
                Sediment minerals emit highly specific color responses. The AI extracts red mineral ratios (garnet counts), black oxide distributions (ilmenite particles), and white crystalline calcium carbonate segments from shell fragmentation to speculate active wave energy.
              </p>
            </div>

            {/* Color bars progress */}
            <div className="space-y-4">
              {ans.colorComposition.map((col, idx) => (
                <div key={idx} className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-3.5 h-3.5 rounded-full shadow border border-white" style={{ backgroundColor: col.color }} />
                      <span className="font-semibold text-slate-700">{col.label}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-500">{col.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-1000" 
                      style={{ backgroundColor: col.color, width: `${col.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location ID Geospatial metadata card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-glass space-y-4">
            <h3 className="font-display font-semibold text-slate-800 text-sm tracking-tight pb-2.5 border-b border-slate-50 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-ocean" /> Geospatial Meta Index
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-slate-600">
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase font-semibold">Location Name</span>
                <p className="font-bold text-slate-850 mt-0.5">{activeUpload.siteName}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase font-semibold">Beach Front</span>
                <p className="font-bold text-slate-850 mt-0.5">{activeUpload.beachName}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase font-semibold">District / State</span>
                <p className="font-bold text-slate-850 mt-0.5">{activeUpload.district}, {activeUpload.state}</p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase font-semibold">Sensor Coordinates</span>
                <p className="font-bold font-mono text-slate-850 mt-0.5 leading-none text-[10px]">{activeUpload.latitude.toFixed(4)}, {activeUpload.longitude.toFixed(4)}</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
