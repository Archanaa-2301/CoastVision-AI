import React from 'react';
import { 
  Building, ShieldAlert, Waves, Microscope, Activity, 
  TrendingUp, CheckCircle, HelpCircle, ArrowRight, AlertTriangle 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Location, Upload } from '../types';

interface DashboardViewProps {
  locations: Location[];
  uploads: Upload[];
  setActiveTab: (tab: string) => void;
  onSelectUpload: (upload: Upload) => void;
}

export default function DashboardView({ locations, uploads, setActiveTab, onSelectUpload }: DashboardViewProps) {
  // ---------------------------------
  // KPI Calculations
  // ---------------------------------
  const totalSites = locations.length;
  const totalAnalyzed = uploads.length;

  // Calculate Average Stability Score universally from all zones
  const allZones = locations.flatMap(loc => loc.zones);
  const avgStability = allZones.length > 0 
    ? Math.round(allZones.reduce((sum, item) => sum + item.stabilityScore, 0) / allZones.length) 
    : 0;

  // Count High Risk Sites (Stability < 40)
  const highRiskSitesCount = locations.filter(loc => 
    loc.zones.some(z => z.stabilityScore < 40)
  ).length;

  // ---------------------------------
  // Recharts Data Transformation
  // ---------------------------------
  // Chart 1: Average Stability per Location
  const stabilityChartData = locations.map(loc => {
    const avgLocStability = loc.zones.length > 0
      ? Math.round(loc.zones.reduce((sum, z) => sum + z.stabilityScore, 0) / loc.zones.length)
      : 0;
    return {
      name: loc.beachName,
      Stability: avgLocStability
    };
  }).slice(0, 5); // display top 5 for neatness

  // Chart 2: Risk Profile distribution
  const totalZones = allZones.length;
  const stableCount = allZones.filter(z => z.stabilityScore > 70).length;
  const moderateCount = allZones.filter(z => z.stabilityScore >= 40 && z.stabilityScore <= 70).length;
  const highRiskCount = allZones.filter(z => z.stabilityScore < 40).length;

  const pieData = [
    { name: 'Stable (>70)', value: stableCount, color: '#2E8B57' },
    { name: 'Moderate Risk (40-70)', value: moderateCount, color: '#DDB892' },
    { name: 'High Risk (<40)', value: highRiskCount, color: '#E11D48' }
  ].filter(item => item.value > 0);

  const getStabilityBadge = (score: number) => {
    if (score > 70) return <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-200">STABLE ({score})</span>;
    if (score >= 40) return <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-200">MODERATE RISK ({score})</span>;
    return <span className="bg-rose-50 text-rose-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-rose-200">HIGH RISK ({score})</span>;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 animate-fadeIn">
      {/* Upper Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">Geospatial Command Center</h1>
          <p className="text-slate-500 font-light text-sm mt-1">Real-time status overview of shoreline crystallography, active erosion grids, and heritage sites.</p>
        </div>
        <button
          onClick={() => setActiveTab('upload')}
          className="px-5 py-3 bg-ocean hover:bg-ocean-light text-white text-sm font-semibold rounded-2xl shadow-lg shadow-ocean/15 flex items-center transition-all cursor-pointer"
        >
          <Microscope className="w-4 h-4 mr-2" />
          <span>New Physical Scan</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1 */}
        <div className="bg-white p-6 rounded-3xl shadow-glass border border-slate-100 flex items-center space-x-4">
          <div className="bg-ocean/10 text-ocean p-4 rounded-2xl">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">Sites Monitored</p>
            <p className="text-2xl font-bold font-display text-slate-900 mt-1">{totalSites}</p>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-6 rounded-3xl shadow-glass border border-slate-100 flex items-center space-x-4">
          <div className="bg-indigo-50 text-indigo-600 p-4 rounded-2xl">
            <Microscope className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">Analysed Scans</p>
            <p className="text-2xl font-bold font-display text-slate-900 mt-1">{totalAnalyzed}</p>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-6 rounded-3xl shadow-glass border border-slate-100 flex items-center space-x-4">
          <div className="bg-seagreen/10 text-seagreen p-4 rounded-2xl">
            <Waves className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">Avg Stability</p>
            <p className="text-2xl font-bold font-display text-slate-900 mt-1">{avgStability}%</p>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-6 rounded-3xl shadow-glass border border-slate-100 flex items-center space-x-4">
          <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">High Risk Sites</p>
            <p className="text-2xl font-bold font-display text-rose-600 mt-1">{highRiskSitesCount}</p>
          </div>
        </div>
      </div>

      {/* Main Charts & Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column - Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-glass lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-display font-semibold text-slate-800 text-base">Beach Stability Spectrum</h3>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">Top 5 monitored beach segments comparison</p>
            </div>
            <span className="text-xs text-slate-500 font-mono bg-slate-50 px-3 py-1 rounded-lg">Score index (0-100)</span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stabilityChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} domain={[0, 100]} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: 'rgba(15, 76, 129, 0.95)', border: 'none', borderRadius: '12px', color: '#fff' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Bar dataKey="Stability" fill="#0F4C81" radius={[8, 8, 0, 0]}>
                  {stabilityChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.Stability < 40 ? '#F43F5E' : entry.Stability < 70 ? '#DDB892' : '#0F4C81'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column - Pie Chart */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-glass lg:col-span-4 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-display font-semibold text-slate-800 text-base">Coastline Risk Profile</h3>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">Monitoring zone percentage profile</p>
          </div>

          {pieData.length > 0 ? (
            <div className="h-56 relative flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center">
                <p className="text-2xl font-bold font-display text-slate-800">{totalZones}</p>
                <p className="text-[10px] uppercase font-semibold text-slate-400 font-mono tracking-widest">Active Zones</p>
              </div>
            </div>
          ) : (
            <div className="h-56 flex items-center justify-center text-xs text-slate-400">
              No tracking zones registered.
            </div>
          )}

          {/* Color Indicators Legend */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100 text-xs">
            {pieData.map((entry, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-slate-600 font-medium">{entry.name.split(' (')[0]}</span>
                </div>
                <span className="font-mono font-bold text-slate-700">{entry.value} zone(s)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Beach Locations & Recent Scans */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Monitored Locations Table (8 Cols) */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-glass lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-display font-semibold text-slate-800 text-base">Shoreline Inventory</h3>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">Complete record list of monitored beach grids</p>
            </div>
            <button 
              onClick={() => setActiveTab('map')}
              className="text-xs text-ocean font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Verify Georeferences</span> <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-mono uppercase tracking-wider">
                  <th className="pb-3 font-semibold">Location</th>
                  <th className="pb-3 font-semibold">State/District</th>
                  <th className="pb-3 font-semibold">Security Zones</th>
                  <th className="pb-3 font-semibold text-right">Primary Stability Check</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                {locations.slice(0, 5).map((loc) => {
                  // Calculate average stability for this location specifically
                  const avgStabilityScore = loc.zones.length > 0
                    ? Math.round(loc.zones.reduce((sum, z) => sum + z.stabilityScore, 0) / loc.zones.length)
                    : 0;

                  return (
                    <tr key={loc.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4">
                        <p className="font-bold text-slate-900">{loc.name}</p>
                        <p className="text-slate-400 text-[10px] mt-0.5 font-light">{loc.beachName}</p>
                      </td>
                      <td className="py-4">
                        <p className="font-medium">{loc.state}</p>
                        <p className="text-slate-400 text-[10px] mt-0.5">{loc.district}</p>
                      </td>
                      <td className="py-4">
                        <div className="flex gap-1.5 flex-wrap max-w-[150px]">
                          {loc.zones.map((z, idx) => (
                            <span 
                              key={z.id} 
                              className={`px-1.5 py-0.5 text-[8px] font-mono font-bold rounded ${
                                z.stabilityScore > 70 ? 'bg-emerald-100/50 text-emerald-800' :
                                z.stabilityScore >= 40 ? 'bg-amber-100/50 text-amber-800' :
                                'bg-rose-100/50 text-rose-800'
                              }`}
                              title={`${z.name}: ${z.stabilityScore}`}
                            >
                              {z.name.substring(z.name.indexOf('(') + 1, z.name.indexOf(')') === -1 ? z.name.length : z.name.indexOf(')')) || `Z${idx+1}`}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 text-right">
                        {getStabilityBadge(avgStabilityScore)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Analyzed Images List (4 Cols) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-glass lg:col-span-4 space-y-4">
          <div className="pb-4 border-b border-slate-100">
            <h3 className="font-display font-semibold text-slate-800 text-base">Recent Field Artifacts</h3>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">Quick lookup of recently completed sand scans</p>
          </div>

          <div className="space-y-4 max-h-84 overflow-y-auto pr-1">
            {uploads.length > 0 ? (
              uploads.slice(0, 3).map((up) => (
                <div 
                  key={up.id} 
                  onClick={() => {
                    onSelectUpload(up);
                    setActiveTab('results');
                  }}
                  className="flex items-center space-x-3 p-3.5 hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-2xl cursor-pointer transition-all"
                >
                  <img 
                    src={up.imageUrl} 
                    alt={up.beachName} 
                    className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-sm"
                    referrerPolicy="no-referrer"
                  />
                  <div className="overflow-hidden flex-grow">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{up.beachName}</h4>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                        up.analysis?.overallStatus === 'Stable' ? 'bg-emerald-50 text-emerald-600' :
                        up.analysis?.overallStatus === 'Moderate Risk' ? 'bg-amber-50 text-amber-600' :
                        'bg-rose-50 text-rose-600'
                      }`}>
                        {up.analysis?.overallStatus || 'Unknown'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{up.siteName}</p>
                    <p className="text-[9px] text-[#c6996d] mt-1 font-mono">{up.dateCollected}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No scans analysed yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
