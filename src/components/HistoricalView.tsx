import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  History, GitCompare, ArrowRightLeft, TrendingUp, 
  ChevronDown, HelpCircle, AlertTriangle, ShieldCheck 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { Upload } from '../types';

interface HistoricalViewProps {
  uploads: Upload[];
}

export default function HistoricalView({ uploads }: HistoricalViewProps) {
  // Select two uploads for comparative analysis
  const [compOneId, setCompOneId] = useState(uploads[0]?.id || '');
  const [compTwoId, setCompTwoId] = useState(uploads[1]?.id || uploads[0]?.id || '');

  const upOne = uploads.find(u => u.id === compOneId);
  const upTwo = uploads.find(u => u.id === compTwoId);

  // Recharts line data sorted chronologically
  const timelineData = [...uploads]
    .sort((a, b) => new Date(a.dateCollected).getTime() - new Date(b.dateCollected).getTime())
    .map(up => ({
      date: up.dateCollected,
      'Stability Index': up.analysis?.coastalStabilityScore || 0,
      'Erosion Risk': up.analysis?.erosionRiskScore || 0,
      'Grain Density': up.analysis?.grainDensityScore || 0,
    }));

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'Stable': return <span className="bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">Stable</span>;
      case 'Moderate Risk': return <span className="bg-amber-50 text-amber-700 font-bold border border-amber-200 text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">Moderate Risk</span>;
      default: return <span className="bg-rose-50 text-rose-700 font-bold border border-rose-200 text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">High Risk</span>;
    }
  };

  const renderComparisonRow = (label: string, val1: number, val2: number) => {
    const diff = val2 - val1;
    let diffText = '';
    let diffColor = 'text-slate-400';
    
    if (diff > 0) {
      diffText = `+${diff}%`;
      diffColor = 'text-emerald-600 font-bold';
    } else if (diff < 0) {
      diffText = `${diff}%`;
      diffColor = 'text-rose-600 font-bold';
    } else {
      diffText = 'No Change';
    }

    return (
      <div className="py-3 flex justify-between items-center border-b border-slate-50 text-xs">
        <span className="font-semibold text-slate-500 w-[140px] truncate">{label}</span>
        
        {/* Sample 1 Value */}
        <span className="font-mono text-slate-800 font-bold w-12 text-center">{val1}%</span>
        
        {/* Visual progress comparison scale slider */}
        <div className="flex-grow max-w-[140px] h-2 bg-slate-100 rounded-full overflow-hidden flex relative mx-4">
          <div className="h-full bg-slate-300 rounded-l" style={{ width: `${val1}%` }} />
          <div className="h-full bg-ocean rounded-l absolute left-0" style={{ width: `${val2}%`, opacity: 0.8 }} />
        </div>

        {/* Sample 2 Value */}
        <span className="font-mono text-slate-800 font-bold w-12 text-center">{val2}%</span>
        
        {/* Variance index */}
        <span className={`font-mono text-[10px] w-14 text-right ${diffColor}`}>{diffText}</span>
      </div>
    );
  };

  const renderMeasurementRow = (label: string, val1: number, val2: number, unit: string = 'mm') => {
    const diff = val2 - val1;
    let diffText = '';
    let diffColor = 'text-slate-400';
    
    if (diff > 0) {
      diffText = `+${diff.toFixed(2)} ${unit}`;
      diffColor = 'text-emerald-600 font-bold';
    } else if (diff < 0) {
      diffText = `${diff.toFixed(2)} ${unit}`;
      diffColor = 'text-rose-600 font-bold';
    } else {
      diffText = '0.00';
    }

    // Scale representation based on typical 1.5mm max diameter
    const percentage1 = Math.min(100, Math.round((val1 / 1.5) * 100));
    const percentage2 = Math.min(100, Math.round((val2 / 1.5) * 100));

    return (
      <div className="py-3 flex justify-between items-center border-b border-slate-50 text-xs font-sans">
        <span className="font-semibold text-slate-505 text-slate-500 w-[140px] truncate">{label}</span>
        <span className="font-mono text-slate-800 font-bold w-12 text-center">{val1.toFixed(2)} {unit}</span>
        <div className="flex-grow max-w-[140px] h-2 bg-slate-100 rounded-full overflow-hidden flex relative mx-4">
          <div className="h-full bg-slate-300 rounded-l" style={{ width: `${percentage1}%` }} />
          <div className="h-full bg-amber-500 rounded-l absolute left-0" style={{ width: `${percentage2}%`, opacity: 0.8 }} />
        </div>
        <span className="font-mono text-slate-800 font-bold w-12 text-center">{val2.toFixed(2)} {unit}</span>
        <span className={`font-mono text-[10px] w-14 text-right ${diffColor}`}>{diffText}</span>
      </div>
    );
  };

  return (
    <div id="historical-trends-comparisons" className="space-y-8 max-w-6xl mx-auto p-4 animate-fadeIn text-slate-800">
      
      {/* Welcome Title Block */}
      <div>
        <h1 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight flex items-center">
          <History className="w-6 h-6 mr-2 text-[#c6996d]" /> Geological Timeline Analysis
        </h1>
        <p className="text-slate-500 font-light text-sm mt-1">Examine physical shoreline shifts over historical runs and compare sediment matrices side-by-side.</p>
      </div>

      {/* Area Line Chart showing historical trends over time */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-glass space-y-4">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-display font-semibold text-slate-800 text-base flex items-center">
              <TrendingUp className="w-4 h-4 mr-1.5 text-ocean" /> Shoreline Stability & Erosion Evolution
            </h3>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">Progressive timeline tracking from first collective field sample to present</p>
          </div>
          <span className="text-[10px] text-slate-500 bg-slate-50 px-3 py-1 border border-slate-100 font-mono rounded-lg">Historical Regression Graph</span>
        </div>

        <div className="h-72 w-full pt-4 font-sans">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorStability" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0F4C81" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#0F4C81" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorErosion" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={10} domain={[0, 100]} tickLine={false} />
              <Tooltip 
                contentStyle={{ background: 'rgba(15, 76, 129, 0.95)', border: 'none', borderRadius: '12px', color: '#fff' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Area type="monotone" dataKey="Stability Index" stroke="#0F4C81" strokeWidth={2.5} fillOpacity={1} fill="url(#colorStability)" />
              <Area type="monotone" dataKey="Erosion Risk" stroke="#EF4444" strokeWidth={1.5} fillOpacity={1} fill="url(#colorErosion)" />
              <Line type="monotone" dataKey="Grain Density" stroke="#10B981" strokeWidth={1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Side-by-side Comparison Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Choice Selectors Card (4 Cols) */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-glass space-y-6">
          <div className="pb-3 border-b border-slate-100 flex items-center">
            <GitCompare className="w-4 h-4 mr-1.5 text-ocean" />
            <h3 className="font-display font-semibold text-slate-800 text-sm tracking-tight">Comparator Settings</h3>
          </div>

          <div className="space-y-4">
            
            {/* Pick Sample One */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Primary Benchmark (Left)</label>
              <div className="relative font-sans">
                <select
                  value={compOneId}
                  onChange={(e) => setCompOneId(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-150 rounded-2xl text-xs text-slate-755 font-semibold text-slate-700 appearance-none focus:outline-none"
                >
                  {uploads.map(u => (
                    <option key={u.id} value={u.id}>{u.beachName} ({u.dateCollected})</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div className="flex justify-center py-1">
              <div className="p-2 bg-slate-50 text-slate-400 border border-slate-100 rounded-full flex items-center justify-center">
                <ArrowRightLeft className="w-4 h-4 text-ocean transform rotate-90" />
              </div>
            </div>

            {/* Pick Sample Two */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">Secondary Comparison (Right)</label>
              <div className="relative font-sans">
                <select
                  value={compTwoId}
                  onChange={(e) => setCompTwoId(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-150 rounded-2xl text-xs text-slate-755 font-semibold text-slate-700 appearance-none focus:outline-none"
                >
                  {uploads.map(u => (
                    <option key={u.id} value={u.id}>{u.beachName} ({u.dateCollected})</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl text-xs space-y-1.5 border border-slate-100 leading-normal font-light">
            <span className="font-bold text-slate-700 font-display block text-xs">Comparator Guidance</span>
            By matching historic beach samples of the same grid, investigators can calculate physical sand loss, heavy oxide sorting increases, and potential erosion trends indicating long-term shoreline shifts.
          </div>
        </div>

        {/* Side-by-Side Comparison Metrics Sheet (8 Cols) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-glass space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="font-display font-semibold text-slate-800 text-base">Comparative Variance Sheet</h3>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">Calculated variance margins between benchmarks and targets</p>
          </div>

          {upOne && upTwo ? (
            <div className="space-y-6">
              
              {/* Visual mini-thumbnails comparison */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl overflow-hidden aspect-video bg-slate-100 relative shadow-sm border border-slate-100">
                  <img src={upOne.imageUrl} alt={upOne.beachName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-3 text-white text-[10px]">
                    <span className="font-bold leading-normal">{upOne.beachName}</span>
                    <span className="opacity-80 font-mono">{upOne.dateCollected}</span>
                  </div>
                </div>

                <div className="rounded-2xl overflow-hidden aspect-video bg-slate-100 relative shadow-sm border border-slate-100">
                  <img src={upTwo.imageUrl} alt={upTwo.beachName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-3 text-white text-[10px]">
                    <span className="font-bold leading-normal">{upTwo.beachName}</span>
                    <span className="opacity-80 font-mono">{upTwo.dateCollected}</span>
                  </div>
                </div>
              </div>

              {/* Comparing Status Cards */}
              <div className="grid grid-cols-2 gap-4 py-1.5 text-xs">
                <div className="p-3 bg-slate-50/70 border border-slate-100 rounded-xl flex flex-col justify-between">
                  <span className="text-[9px] text-slate-400 uppercase font-mono font-bold tracking-wider">Benchmark Status</span>
                  <div className="mt-2">{getStatusBadge(upOne.analysis?.overallStatus)}</div>
                </div>
                <div className="p-3 bg-slate-50/70 border border-slate-100 rounded-xl flex flex-col justify-between">
                  <span className="text-[9px] text-slate-400 uppercase font-mono font-bold tracking-wider">Comparison Status</span>
                  <div className="mt-2">{getStatusBadge(upTwo.analysis?.overallStatus)}</div>
                </div>
              </div>

              {/* Rows Comparison */}
              <div>
                <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-4">Crystallography metrics & indices</p>
                
                {renderComparisonRow('Coastal Stability Index', upOne.analysis?.coastalStabilityScore || 0, upTwo.analysis?.coastalStabilityScore || 0)}
                
                {renderComparisonRow('Erosion Risk Score', upOne.analysis?.erosionRiskScore || 0, upTwo.analysis?.erosionRiskScore || 0)}
                
                {renderComparisonRow('Archaeological Relevance', upOne.analysis?.archaeologicalRelevanceScore || 0, upTwo.analysis?.archaeologicalRelevanceScore || 0)}
                
                {renderComparisonRow('Matrix Grain Density', upOne.analysis?.grainDensityScore || 0, upTwo.analysis?.grainDensityScore || 0)}
                
                {renderComparisonRow('Sediment Texture Variance', upOne.analysis?.sedimentVariationScore || 0, upTwo.analysis?.sedimentVariationScore || 0)}

                <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mt-6 mb-4 font-mono">Geotechnical Diameter Grading</p>
                
                {renderMeasurementRow('Average Grain Size', upOne.analysis?.averageGrainSize || 0.55, upTwo.analysis?.averageGrainSize || 0.55, 'mm')}
                
                {renderMeasurementRow('D10 Sieve Diameter', upOne.analysis?.d10 || 0.18, upTwo.analysis?.d10 || 0.18, 'mm')}
                
                {renderMeasurementRow('D30 Sieve Diameter', upOne.analysis?.d30 || 0.32, upTwo.analysis?.d30 || 0.32, 'mm')}
                
                {renderMeasurementRow('D50 Sieve Diameter', upOne.analysis?.d50 || 0.55, upTwo.analysis?.d50 || 0.55, 'mm')}
                
                {renderMeasurementRow('D60 Sieve Diameter', upOne.analysis?.d60 || 0.68, upTwo.analysis?.d60 || 0.68, 'mm')}
                
                {renderMeasurementRow('D90 Sieve Diameter', upOne.analysis?.d90 || 1.12, upTwo.analysis?.d90 || 1.12, 'mm')}
              </div>

            </div>
          ) : (
            <div className="py-20 text-center text-xs text-slate-400 font-light">
              Insufficient sand analysis records to conduct side-by-side comparisons.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
