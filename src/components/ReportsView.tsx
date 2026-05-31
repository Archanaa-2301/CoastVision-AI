import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Download, Award, Compass, CheckCircle, 
  Trash2, Plus, Users, Calendar, MapPin, Printer, Microscope, ChevronDown 
} from 'lucide-react';
import { Report, Upload } from '../types';

interface ReportsViewProps {
  uploads: Upload[];
  reports: Report[];
  onAddReport: (report: Report) => void;
  setActiveTab: (tab: string) => void;
}

export default function ReportsView({ uploads, reports, onAddReport, setActiveTab }: ReportsViewProps) {
  
  // Create state
  const [selectedUploadId, setSelectedUploadId] = useState('');
  const [reportTitle, setReportTitle] = useState('');
  const [preparedBy, setPreparedBy] = useState('Dr. Evelyn Carter, Marine Geomorphologist');
  const [activeReportId, setActiveReportId] = useState<string | null>(null);

  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  // Default to first report if available
  useEffect(() => {
    if (reports.length > 0 && !activeReportId) {
      setActiveReportId(reports[0].id);
    }
  }, [reports, activeReportId]);

  const activeReport = reports.find(r => r.id === activeReportId);
  const matchedUpload = activeReport 
    ? uploads.find(up => up.id === activeReport.uploadId) 
    : null;

  // Auto-fill values when upload is selected
  const handleUploadSelect = (upId: string) => {
    setSelectedUploadId(upId);
    if (!upId) return;

    const up = uploads.find(u => u.id === upId);
    if (up) {
      setReportTitle(`Executive Dossier: ${up.beachName} Crystalline Sediment Assessment`);
    }
  };

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUploadId) {
      setError('Please select an active computer vision scan.');
      return;
    }

    setError('');
    setIsGenerating(true);

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uploadId: selectedUploadId,
          title: reportTitle,
          preparedBy
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Server failed to compile document.');
      }

      // Success
      setTimeout(() => {
        onAddReport(data);
        setActiveReportId(data.id);
        setIsGenerating(false);
        // Reset form
        setSelectedUploadId('');
        setReportTitle('');
      }, 1500);

    } catch (err: any) {
      setError(err.message || 'An error occurred during report compilation.');
      setIsGenerating(false);
    }
  };

  // Raw file downloader
  const handleDownloadTxt = (report: Report) => {
    const textDocument = `
==================================================
COASTALVISION AI - EXECUTIVE RESEARCH DOSSIER
==================================================
Dossier ID: ${report.id}
Date Compiled: ${report.dateGenerated}
Prepared By: ${report.preparedBy}

SITE TARGET METADATA:
--------------------------------------------------
Site Name: ${report.siteName}
Beach Front Segment: ${report.beachName}
Georeferencing coordinates matched dynamically.

QUANTITATIVE CRYSTALLOGRAPHY METRICS:
--------------------------------------------------
Coastal Stability Score: ${report.metrics.coastalStability}%
Erosion Risk Rating: ${report.metrics.erosionRisk}%
Archaeological Relevance Score: ${report.metrics.archaeologicalRelevance}%
Grain Density Index: ${report.metrics.grainDensity}%

DETAILED OBSERVATIONAL ANALYSIS:
--------------------------------------------------
${report.observations}

SAFEGUARD RECOMMENDATIONS:
--------------------------------------------------
${report.recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

==================================================
PRESERVING SENSITIVE SHORELINES & HERITAGE
==================================================
    `;

    const blob = new Blob([textDocument], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CoastalVision_Dossier_${report.id}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerNativePrint = () => {
    window.print();
  };

  return (
    <div id="reports-and-compilers" className="max-w-6xl mx-auto p-4 space-y-8 animate-fadeIn text-slate-800">
      
      {/* Printable custom CSS */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 24px;
          }
          #app-sidebar, #reports-and-compilers > *:not(#print-layout-wrapper), #reports-sidebar, #reports-builder {
            display: none !important;
          }
        }
      `}</style>

      {/* Welcome and Header */}
      <div className="flex justify-between items-center pb-4 border-b border-slate-100">
        <div>
          <h1 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">Executive report compiler</h1>
          <p className="text-slate-500 font-light text-sm mt-1">Generate beautifully structured, print-ready, geospatial shoreline surveys and compliance papers.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column - Sidebar lists of generated reports & compiler (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Section 1: Active compiler generator */}
          <div id="reports-builder" className="bg-white p-6 rounded-3xl border border-slate-100 shadow-glass space-y-4">
            <h3 className="font-display font-semibold text-slate-800 text-sm tracking-tight pb-3 border-b border-slate-50 flex items-center">
              <Plus className="w-4 h-4 mr-1.5 text-ocean" /> Compiler Engine
            </h3>

            {error && (
              <div className="bg-rose-50 text-rose-700 text-xs p-3 rounded-xl border border-rose-100 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleGenerateReport} className="space-y-4">
              {/* Select active target */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <label className="font-semibold text-slate-700 uppercase font-mono tracking-wider">Active Crystalline Scan</label>
                <div className="relative font-sans">
                  <select
                    value={selectedUploadId}
                    onChange={(e) => handleUploadSelect(e.target.value)}
                    required
                    className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none appearance-none"
                  >
                    <option value="">-- Choose Completed Scan --</option>
                    {uploads.filter(u => u.analysis).map(u => (
                      <option key={u.id} value={u.id}>{u.beachName} ({u.dateCollected})</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              {/* Title input */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <label className="font-semibold text-slate-700 uppercase font-mono tracking-wider">Dossier Main Title</label>
                <input
                  type="text"
                  placeholder="e.g. Shoreline Assessment Sheet"
                  required
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              {/* preparedBy */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <label className="font-semibold text-slate-700 uppercase font-mono tracking-wider">Prepared By Signant</label>
                <input
                  type="text"
                  required
                  value={preparedBy}
                  onChange={(e) => setPreparedBy(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3 bg-ocean hover:bg-ocean-light text-white text-xs font-bold rounded-2xl shadow-md cursor-pointer transition-all disabled:opacity-50 flex justify-center items-center"
              >
                {isGenerating ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : <Plus className="w-4 h-4 mr-1.5" />}
                <span>{isGenerating ? 'Compiling Dossier...' : 'Initialize New Report'}</span>
              </button>
            </form>
          </div>

          {/* Section 2: Historic generated Reports List */}
          <div id="reports-sidebar" className="bg-white p-6 rounded-3xl border border-slate-100 shadow-glass space-y-4">
            <h3 className="font-display font-semibold text-slate-800 text-sm tracking-tight pb-3 border-b border-slate-50 font-sans">
              Compiled Documents Repository
            </h3>

            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  onClick={() => setActiveReportId(rep.id)}
                  className={`p-3 rounded-2xl hover:bg-slate-50 border cursor-pointer transition-all flex items-center space-x-3 ${
                    activeReportId === rep.id ? 'bg-ocean/5 border-ocean/20' : 'border-transparent'
                  }`}
                >
                  <div className="bg-ocean/10 text-ocean p-2 rounded-xl shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-slate-800 truncate leading-snug">{rep.title}</h4>
                    <p className="text-[9px] text-[#c6996d] font-mono mt-0.5 leading-none">{rep.siteName}</p>
                    <p className="text-[8px] text-slate-400 mt-1 font-mono">{rep.dateGenerated}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column - Premium "PDF preview" printable view (8 Cols) */}
        <div id="print-layout-wrapper" className="lg:col-span-8 space-y-6">
          {activeReport ? (
            <div className="space-y-4">
              {/* Dynamic Action float bar */}
              <div className="flex gap-2 justify-end">
                <button
                  onClick={triggerNativePrint}
                  className="px-4 py-2 bg-slate-900 border border-slate-950 text-white rounded-xl text-xs font-medium cursor-pointer shadow flex items-center hover:bg-slate-850"
                >
                  <Printer className="w-4 h-4 mr-2" /> Print Official PDF
                </button>
                <button
                  onClick={() => handleDownloadTxt(activeReport)}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer shadow-sm flex items-center hover:bg-slate-50"
                >
                  <Download className="w-4 h-4 mr-2 text-[#c6996d]" /> Download Document File
                </button>
              </div>

              {/* Preview Layout designed as premium, formatted A4 academic paper sheet */}
              <div 
                id="print-area" 
                className="bg-white rounded-3xl border border-slate-200 shadow-xl p-10 max-w-3xl mx-auto space-y-8 font-sans border-t-[8px] border-t-ocean text-slate-800"
              >
                
                {/* Official institutional header with stamp logos */}
                <div className="flex justify-between items-start pb-6 border-b-2 border-slate-900">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Compass className="w-7 h-7 text-ocean shrink-0" />
                      <span className="font-display font-extrabold text-xl tracking-tight text-slate-950">COASTALVISION ACADEMIC LABORATORY</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono tracking-wider max-w-sm uppercase font-semibold">
                      Department of Oceanography, Marine Geology and Archaeological Surveys
                    </p>
                  </div>

                  {/* Certified stamp */}
                  <div className="border-4 border-double border-[#c6996d] p-2 text-center text-[#c6996d] rounded font-mono text-[8px] font-bold tracking-widest uppercase shrink-0">
                    AI SYSTEM<br />CERTIFIED
                  </div>
                </div>

                {/* Sub Metadata Card */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block">Document ID</span>
                    <span className="font-mono text-slate-800 font-bold">{activeReport.id}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block">Date Compiled</span>
                    <span className="font-medium text-slate-800">{activeReport.dateGenerated}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block">Site Name</span>
                    <span className="font-bold text-slate-800">{activeReport.siteName}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block">Beach Segment</span>
                    <span className="font-medium text-slate-800">{activeReport.beachName}</span>
                  </div>
                </div>

                {/* Main Title block */}
                <div>
                  <h2 className="text-xl font-bold font-display text-slate-950 tracking-tight leading-snug">{activeReport.title}</h2>
                  <p className="text-xs text-slate-400 mt-1 font-mono font-semibold">Author Signatory: {activeReport.preparedBy}</p>
                </div>

                {/* Flexbox - Thumbnail image on Left, Metrics table on right */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  {/* Thumbnail */}
                  <div className="md:col-span-5 rounded-2xl overflow-hidden aspect-video relative max-h-36 border border-slate-100 shadow-sm shrink-0">
                    {matchedUpload ? (
                      <img src={matchedUpload.imageUrl} alt={matchedUpload.beachName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-400">Image missing in current workspace</div>
                    )}
                  </div>

                  {/* Metrics List */}
                  <div className="md:col-span-7 space-y-2">
                    <h4 className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest pb-1 border-b border-slate-100">Crystallography Ratings</h4>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="flex justify-between items-center py-1">
                        <span className="font-semibold text-slate-600">Coastal Stability</span>
                        <span className="font-mono font-bold">{activeReport.metrics.coastalStability}%</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="font-semibold text-slate-600">Erosion Risk rating</span>
                        <span className="font-mono font-bold text-rose-600">{activeReport.metrics.erosionRisk}%</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="font-semibold text-slate-600">Archaeological Value</span>
                        <span className="font-mono font-bold text-amber-600">{activeReport.metrics.archaeologicalRelevance}%</span>
                      </div>
                      <div className="flex justify-between items-center py-1">
                        <span className="font-semibold text-slate-600">Matrix Grain Density</span>
                        <span className="font-mono font-bold text-emerald-600">{activeReport.metrics.grainDensity}%</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Deep vision descriptive log */}
                <div className="space-y-2 text-xs leading-relaxed text-slate-700 font-light">
                  <h4 className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest pb-1 border-b border-slate-100">Observed littoral and sediment conditions</h4>
                  <p className="font-medium text-slate-900 font-display">SUMMARY STATEMENT:</p>
                  <p className="indent-4 leading-normal">{activeReport.observations}</p>
                </div>

                {/* Recommendations bullet blocks */}
                <div className="space-y-3 font-sans text-xs">
                  <h4 className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest pb-1 border-b border-slate-100">Compulsory Shoreline protection actions</h4>
                  <ul className="space-y-2 font-light">
                    {activeReport.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0 mr-2.5 mt-2" />
                        <span className="leading-normal">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Final Sign signatory row */}
                <div className="pt-10 flex justify-between items-end border-t border-slate-150">
                  <div className="text-[9px] font-mono text-slate-400 leading-normal">
                    COASTALVISION ACADEMIC COMPLIANCE PLATFORM<br />
                    VERIFICATION HASH: MD5_SUM_GEO_INFERENCE_VALID
                  </div>
                  
                  <div className="text-right space-y-4">
                    {/* Simulated hand drawn line bar */}
                    <div className="w-44 border-b border-slate-900 border-dashed" />
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{activeReport.preparedBy}</p>
                      <p className="text-[10px] text-slate-400">Chief Geospatial Investigator</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="bg-white p-20 text-center text-slate-400 font-light text-xs rounded-3xl border border-slate-100 shadow-glass">
              No compiled documents available to preview. Create one first.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
