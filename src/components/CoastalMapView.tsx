import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Map as MapIcon, Shield, Layers, HelpCircle, Compass, 
  Home, Info, AlertTriangle, Clock, Play, Award, FileText, 
  MapPin, Sliders, ArrowRightLeft, Eye, Grid, CheckCircle
} from 'lucide-react';
import { Location, Upload } from '../types';
import L from 'leaflet';

interface CoastalMapViewProps {
  locations: Location[];
  uploads: Upload[];
  setActiveTab: (tab: string) => void;
  onSelectUpload: (upload: Upload) => void;
  onGenerateReport: (uploadId: string) => void;
}

export default function CoastalMapView({ 
  locations, 
  uploads, 
  setActiveTab, 
  onSelectUpload,
  onGenerateReport
}: CoastalMapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.FeatureGroup | null>(null);
  const heatmapGroupRef = useRef<L.FeatureGroup | null>(null);

  // Layer toggles state
  const [showSites, setShowSites] = useState(true);
  const [showRiskZones, setShowRiskZones] = useState(true);
  const [showHeatMap, setShowHeatMap] = useState(false);

  // Interactive selected detail sidebar inside map
  const [selectedPlace, setSelectedPlace] = useState<Location | null>(null);
  
  // Track selected historical upload for the active place
  const [activeUploadId, setActiveUploadId] = useState<string | null>(null);

  // Compare mode inside the location sidebar
  const [isComparing, setIsComparing] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Center on coastal South India / Tamil Nadu
    const map = L.map(mapContainerRef.current, {
      center: [12.0, 79.5],
      zoom: 6,
      zoomControl: false
    });
    mapRef.current = map;

    // Add high quality CartoDB minimalist light background
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    markersGroupRef.current = L.featureGroup().addTo(map);
    heatmapGroupRef.current = L.featureGroup();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update GIS map markers whenever locations, uploads or layer states toggle
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !markersGroupRef.current || !heatmapGroupRef.current) return;

    markersGroupRef.current.clearLayers();
    heatmapGroupRef.current.clearLayers();

    // 1. Layer 1 (Monitoring Sites) & Layer 2 (Risk Zones color gradients)
    locations.forEach((loc) => {
      // Find historical uploads tied to this location to derive average stability index
      const matchingUploads = uploads.filter(
        u => u.siteName.toLowerCase() === loc.name.toLowerCase() || u.beachName.toLowerCase() === loc.beachName.toLowerCase()
      );

      const latestUpload = matchingUploads[0];
      const stabilityScore = latestUpload?.analysis?.coastalStabilityScore ?? loc.zones[0]?.stabilityScore ?? 65;

      // Color coding based on risk layers
      let color = '#10B981'; // Green = Stable
      let riskStatus = 'Stable';
      if (stabilityScore < 40) {
        color = '#EF4444'; // Red = High Risk
        riskStatus = 'High Risk';
      } else if (stabilityScore <= 70) {
        color = '#F59E0B'; // Yellow = Moderate Risk
        riskStatus = 'Moderate Risk';
      }

      const markerHtml = `
        <div style="position: relative; display: flex; align-items: center; justify-content: center;">
          <!-- Layer 2: Ring pulse indicating active risk zones -->
          ${showRiskZones ? `
            <span style="position: absolute; width: 34px; height: 34px; border-radius: 50%; opacity: 0.3; background-color: ${color};" class="animate-ping"></span>
          ` : ''}
          <!-- Central core anchor pin -->
          <div style="position: relative; width: 15px; height: 15px; background-color: ${color}; border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 3px 8px rgba(0,0,0,0.25); z-index: 10;">
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-leaflet-marker-glow',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      if (showSites) {
        const marker = L.marker([loc.latitude, loc.longitude], { icon: customIcon });

        // Popup matching the rich marker requirement
        const d10 = latestUpload?.analysis?.d10 ?? 0.18;
        const d30 = latestUpload?.analysis?.d30 ?? 0.32;
        const d50 = latestUpload?.analysis?.d50 ?? 0.55;
        const d60 = latestUpload?.analysis?.d60 ?? 0.68;
        const d90 = latestUpload?.analysis?.d90 ?? 1.12;
        const avgGrain = latestUpload?.analysis?.averageGrainSize ?? 0.58;
        const stability = latestUpload?.analysis?.coastalStabilityScore ?? 72;
        const erosion = latestUpload?.analysis?.erosionRiskScore ?? 25;
        const archeo = latestUpload?.analysis?.archaeologicalRelevanceScore ?? 15;
        const obsTrimmed = latestUpload?.analysis?.observations 
          ? (latestUpload.analysis.observations.slice(0, 100) + '...') 
          : 'Monitoring station active. Crystalline silicate interlocking indices stable.';

        const thumbnail = latestUpload?.imageUrl || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&q=80&w=300';
        const dateStr = latestUpload?.dateCollected || 'No recorded runs';

        const popupContent = `
          <div class="p-3 text-slate-800 font-sans" style="width: 280px; line-height: 1.4;">
            <img src="${thumbnail}" alt="${loc.beachName}" style="width: 100%; height: 90px; object-fit: cover; border-radius: 12px; margin-bottom: 8px;" />
            
            <div style="margin-bottom: 6px;">
              <h4 style="margin: 0; font-weight: 800; font-size: 13px; color: #0F4C81;">${loc.beachName}</h4>
              <p style="margin: 0; font-size: 10px; text-transform: uppercase; font-family: monospace; color: #94A3B8;">${loc.name}, ${loc.state}</p>
            </div>

            <div style="display: grid; grid-cols-2; font-size: 10px; color: #475569; margin: 6px 0; border-top: 1px solid #F1F5F9; border-bottom: 1px solid #F1F5F9; padding: 4px 0;">
              <div>• <b>Avg Grain:</b> ${avgGrain} mm</div>
              <div>• <b>D50:</b> ${d50} mm (D10: ${d10})</div>
              <div>• <b>Stability:</b> <span style="color:${color};font-weight:bold;">${stability}%</span></div>
              <div>• <b>Erosion Risk:</b> ${erosion}%</div>
            </div>

            <div style="font-size: 9px; line-height: 1.3; color: #64748B; margin-top: 4px; font-style: italic;">
              "${obsTrimmed}"
            </div>

            <div style="font-size: 9px; color: #94A3B8; margin-top: 6px; text-align: right;">Updated: ${dateStr}</div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          closeButton: true,
          offset: [0, -4]
        });

        // Click marker hooks
        marker.on('click', () => {
          setSelectedPlace(loc);
          // Auto select latest upload when site changes
          if (matchingUploads.length > 0) {
            setActiveUploadId(matchingUploads[0].id);
          } else {
            setActiveUploadId(null);
          }
          setIsComparing(false);
        });

        marker.addTo(markersGroupRef.current);
      }
    });

    // 2. Layer 3: Historical Upload Density Heatmap
    if (showHeatMap) {
      // Loop over uploads to plot density gradients (overlapping translucent circles representing hot zones)
      uploads.forEach((up) => {
        const matchingLoc = locations.find(
          l => l.name.toLowerCase() === up.siteName.toLowerCase() || l.beachName.toLowerCase() === up.beachName.toLowerCase()
        );
        const lat = up.latitude || matchingLoc?.latitude || 12.0;
        const lng = up.longitude || matchingLoc?.longitude || 79.5;

        const densityCircle = L.circle([lat, lng], {
          color: '#0F4C81',
          fillColor: '#0F4C81',
          fillOpacity: 0.12,
          radius: 38000, // 38km coverage circle
          weight: 0.5
        });
        densityCircle.addTo(heatmapGroupRef.current);
      });
      heatmapGroupRef.current.addTo(map);
    } else {
      heatmapGroupRef.current.remove();
    }

  }, [locations, uploads, showSites, showRiskZones, showHeatMap]);

  // Center maps on specific location coordinates
  const handleFlyTo = (loc: Location) => {
    if (mapRef.current) {
      mapRef.current.flyTo([loc.latitude, loc.longitude], 10, {
        animate: true,
        duration: 1.5
      });
      setSelectedPlace(loc);
      
      const matchingUploads = uploads.filter(
        u => u.siteName.toLowerCase() === loc.name.toLowerCase() || u.beachName.toLowerCase() === loc.beachName.toLowerCase()
      );
      if (matchingUploads.length > 0) {
        setActiveUploadId(matchingUploads[0].id);
      } else {
        setActiveUploadId(null);
      }
      setIsComparing(false);
    }
  };

  // Get active selected location historical uploads timeline
  const activePlaceUploads = selectedPlace ? uploads.filter(
    u => u.siteName.toLowerCase() === selectedPlace.name.toLowerCase() || u.beachName.toLowerCase() === selectedPlace.beachName.toLowerCase()
  ).sort((a, b) => new Date(b.dateCollected).getTime() - new Date(a.dateCollected).getTime()) : [];

  // Active highlighted upload structure
  const currentDetailsUpload = activePlaceUploads.find(u => u.id === activeUploadId) || activePlaceUploads[0] || null;

  // Comparison benchmark upload (usually the previous run in timeline)
  const previousUpload = currentDetailsUpload 
    ? activePlaceUploads.find(u => u.id !== currentDetailsUpload.id) || activePlaceUploads[activePlaceUploads.length - 1] 
    : null;

  return (
    <div id="gis-mapping-dashboard" className="h-[calc(100vh-2rem)] flex flex-col font-sans animate-fadeIn text-slate-800">
      
      {/* Upper Map Toolbelt Control */}
      <div className="bg-white p-4 shrink-0 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
            <h1 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight flex items-center">
              <MapIcon className="w-5 h-5 mr-1.5 text-ocean z-10" /> Coastal GIS Intelligence Panel
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-light mt-0.5">High precision maritime monitoring layers. Coordinates synchronized automatically from image EXIF payloads.</p>
        </div>

        {/* GIS Layers Control panel */}
        <div className="flex gap-4 items-center">
          <div className="bg-slate-50 border border-slate-150 p-2.5 rounded-2xl flex flex-wrap items-center gap-5 text-xs text-slate-600">
            <span className="font-mono text-[9px] text-[#c6996d] font-bold uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Core GIS Layers:
            </span>
            
            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input 
                type="checkbox" 
                checked={showSites} 
                onChange={(e) => setShowSites(e.target.checked)}
                className="rounded text-ocean focus:ring-ocean w-3.5 h-3.5 border-slate-300"
              />
              <span className="font-semibold text-slate-700">Layer 1: Monitoring Sites</span>
            </label>

            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input 
                type="checkbox" 
                checked={showRiskZones} 
                onChange={(e) => setShowRiskZones(e.target.checked)}
                className="rounded text-[#c6996d] focus:ring-[#c6996d] w-3.5 h-3.5 border-slate-300"
              />
              <span className="font-semibold text-slate-700">Layer 2: Risk Zones Status</span>
            </label>

            <label className="flex items-center space-x-1.5 cursor-pointer">
              <input 
                type="checkbox" 
                checked={showHeatMap} 
                onChange={(e) => setShowHeatMap(e.target.checked)}
                className="rounded text-ocean focus:ring-ocean w-3.5 h-3.5 border-slate-300"
              />
              <span className="font-semibold text-slate-700">Layer 3: Upload Density Heatmap</span>
            </label>
          </div>
        </div>
      </div>

      {/* Main Map Body layout (Map left, sites & timeline sidebar right) */}
      <div className="flex-grow flex relative min-h-0">
        
        {/* Actual Map Canvas Leaflet Node */}
        <div className="flex-grow h-full bg-slate-100 z-0 relative">
          <div ref={mapContainerRef} className="w-full h-full" id="gis-leaflet-canvas" />
          
          {/* Legend absolute Overlay */}
          <div className="absolute left-4 bottom-4 bg-white/95 backdrop-blur shadow-lg border border-slate-100 p-3.5 rounded-2xl z-10 w-44 font-sans text-xs space-y-2 leading-none">
            <p className="font-extrabold text-[10px] text-slate-700 uppercase tracking-wider mb-2 font-mono">Risk Index Scale</p>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span>Stable (Stability &gt; 70%)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
              <span>Mod Risk (40% - 70%)</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              <span>High Risk (&lt; 40%)</span>
            </div>
          </div>
        </div>

        {/* Dynamic Sidebar: Sites List & Selector on upper portion, Active Pin Details in lower portion */}
        <div className="w-96 bg-white border-l border-slate-100 h-full overflow-y-auto shrink-0 flex flex-col relative z-10 shadow-xl scrollbar-thin">
          
          {/* Station listing list section */}
          <div className="h-[40%] flex flex-col min-h-[180px] bg-white border-b border-slate-105">
            <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex justify-between items-center shrink-0">
              <div>
                <h4 className="text-xs font-bold text-slate-400 font-mono tracking-wider uppercase">Monitored Coasts ({locations.length})</h4>
                <span className="text-[10px] text-slate-400 font-light block mt-0.5">Click station pin to focus and view timelines</span>
              </div>
            </div>

            <div className="divide-y divide-slate-50 overflow-y-auto flex-grow font-sans scrollbar-none">
              {locations.map((loc) => {
                // Fetch stability from latest upload
                const matching = uploads.filter(
                  u => u.siteName.toLowerCase() === loc.name.toLowerCase() || u.beachName.toLowerCase() === loc.beachName.toLowerCase()
                );
                const score = matching[0]?.analysis?.coastalStabilityScore ?? loc.zones[0]?.stabilityScore ?? 65;

                return (
                  <div
                    key={loc.id}
                    onClick={() => handleFlyTo(loc)}
                    className={`p-3.5 hover:bg-slate-50/50 transition-all cursor-pointer flex justify-between items-start text-xs ${
                      selectedPlace?.id === loc.id ? 'bg-ocean/5 border-l-2 border-ocean font-semibold' : ''
                    }`}
                  >
                    <div>
                      <h5 className="font-bold text-slate-900 leading-tight">{loc.beachName}</h5>
                      <p className="text-slate-400 text-[10px] mt-0.5 font-sans leading-none">{loc.name}</p>
                      <span className="text-[10px] font-medium text-slate-500 mt-1.5 block font-sans">{loc.district}, {loc.state}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded font-extrabold text-[9px] ${
                      score > 70 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                      score >= 40 ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                      'bg-rose-50 text-rose-600 border border-rose-100'
                    }`}>
                      {score}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed analysis sidebar timeline of selected site */}
          <div className="h-[60%] flex flex-col bg-white overflow-y-auto p-4 space-y-4">
            {selectedPlace ? (
              <div className="space-y-4 flex flex-col justify-start pb-5">
                
                {/* Header title */}
                <div className="pb-3 border-b border-slate-100 shrink-0">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] text-[#c6996d] font-mono uppercase font-bold tracking-wider">Site Monitor Station</span>
                    <button onClick={() => { setSelectedPlace(null); setActiveUploadId(null); }} className="text-sm text-slate-400 hover:text-slate-500 font-bold font-sans">&times;</button>
                  </div>
                  <h3 className="font-display font-black text-lg text-slate-950 mt-1 leading-snug">{selectedPlace.beachName}</h3>
                  <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[9px] mt-0.5">
                    <MapPin className="w-3 h-3 text-ocean" />
                    <span>Coordinates: {selectedPlace.latitude.toFixed(4)}, {selectedPlace.longitude.toFixed(4)}</span>
                  </div>
                </div>

                {/* IMAGE HISTORY SYSTEM SECTION */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#c6996d]" /> History timeline ({activePlaceUploads.length} runs)
                    </span>
                  </div>

                  {/* Horizontal/Vertical History Swapper timeline list */}
                  <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                    {activePlaceUploads.map((up, idx) => (
                      <div 
                        key={up.id}
                        onClick={() => { setActiveUploadId(up.id); setIsComparing(false); }}
                        className={`p-2 rounded-xl text-xs flex justify-between items-center border transition-all cursor-pointer ${
                          up.id === activeUploadId || (!activeUploadId && idx === 0)
                            ? 'bg-ocean text-white border-ocean font-bold'
                            : 'bg-white text-slate-700 border-slate-150 hover:bg-slate-100/50'
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          <Play className="w-2.5 h-2.5" />
                          Observation {activePlaceUploads.length - idx}
                        </span>
                        <span className="font-mono text-[10px] opacity-75">{up.dateCollected}</span>
                      </div>
                    ))}
                  </div>

                  {/* Compare mode trigger */}
                  {activePlaceUploads.length > 1 && (
                    <button
                      onClick={() => setIsComparing(!isComparing)}
                      className={`w-full py-1.5 rounded-xl border text-[10px] font-bold tracking-wider flex justify-center items-center gap-1 shadow-sm transition-all cursor-pointer ${
                        isComparing 
                          ? 'bg-[#c6996d] text-white border-[#c6996d]' 
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-150'
                      }`}
                    >
                      <ArrowRightLeft className="w-3 h-3" />
                      {isComparing ? 'Exit Comparator View' : 'Compare Current vs. Previous Run'}
                    </button>
                  )}
                </div>

                {/* ACTIVE RUN DETAILS PANEL */}
                {currentDetailsUpload && currentDetailsUpload.analysis ? (
                  <div className="space-y-4">
                    
                    {/* Selected image preview */}
                    <div className="relative rounded-xl overflow-hidden aspect-video border border-slate-100 shadow-sm">
                      <img 
                        src={currentDetailsUpload.imageUrl} 
                        alt="Active observation thumbnail" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-2.5 text-white">
                        <span className="font-bold text-[10px]">Active dossier run:</span>
                        <span className="font-mono text-[9px] opacity-80">{currentDetailsUpload.dateCollected}</span>
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      {isComparing && previousUpload && previousUpload.analysis ? (
                        /* COMPARATIVE METRICS SHIFT */
                        <motion.div 
                          key="comparison-panel"
                          initial={{ opacity: 0, y: 5 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          exit={{ opacity: 0, y: -5 }}
                          className="bg-[#c6996d]/5 border border-[#c6996d]/20 rounded-2xl p-3.5 space-y-3"
                        >
                          <div className="border-b border-[#c6996d]/10 pb-2">
                            <h4 className="text-[10px] font-mono font-bold text-[#c6996d] uppercase tracking-wider">Historical Comparison Delta</h4>
                            <p className="text-[9px] text-slate-400">Comparing run of {currentDetailsUpload.dateCollected} vs. previous {previousUpload.dateCollected}</p>
                          </div>

                          <div className="space-y-2.5 text-xs text-slate-700">
                            
                            {/* Row 1: Stability shift */}
                            <div className="flex justify-between items-center leading-none">
                              <span className="font-medium">Stability Index Gap</span>
                              <span className="font-mono">
                                <b>{currentDetailsUpload.analysis.coastalStabilityScore}%</b> 
                                <span className="text-slate-450 mx-1">({previousUpload.analysis.coastalStabilityScore}%)</span>
                                <span className={`font-bold ml-1.5 ${
                                  currentDetailsUpload.analysis.coastalStabilityScore - previousUpload.analysis.coastalStabilityScore >= 0 
                                    ? 'text-emerald-600' : 'text-rose-600'
                                }`}>
                                  {currentDetailsUpload.analysis.coastalStabilityScore - previousUpload.analysis.coastalStabilityScore >= 0 ? '+' : ''}
                                  {currentDetailsUpload.analysis.coastalStabilityScore - previousUpload.analysis.coastalStabilityScore}%
                                </span>
                              </span>
                            </div>

                            {/* Row 2: Grain Size change */}
                            <div className="flex justify-between items-center leading-none">
                              <span className="font-medium">Avg Grain Diameter Size</span>
                              <span className="font-mono">
                                <b>{currentDetailsUpload.analysis.averageGrainSize ?? 0.55} mm</b> 
                                <span className="text-slate-450 mx-1">({previousUpload.analysis.averageGrainSize ?? 0.55} mm)</span>
                                <span className={`font-bold ml-1.5 ${
                                  (currentDetailsUpload.analysis.averageGrainSize ?? 0.55) - (previousUpload.analysis.averageGrainSize ?? 0.55) >= 0 
                                    ? 'text-emerald-600' : 'text-rose-600'
                                }`}>
                                  {((currentDetailsUpload.analysis.averageGrainSize ?? 0.55) - (previousUpload.analysis.averageGrainSize ?? 0.55)) >= 0 ? '+' : ''}
                                  {((currentDetailsUpload.analysis.averageGrainSize ?? 0.55) - (previousUpload.analysis.averageGrainSize ?? 0.55)).toFixed(2)} mm
                                </span>
                              </span>
                            </div>

                            {/* Row 3: Erosion risk delta */}
                            <div className="flex justify-between items-center leading-none">
                              <span className="font-medium">Erosion Threat Delta</span>
                              <span className="font-mono">
                                <b>{currentDetailsUpload.analysis.erosionRiskScore}%</b> 
                                <span className="text-slate-450 mx-1">({previousUpload.analysis.erosionRiskScore}%)</span>
                                <span className={`font-bold ml-1.5 ${
                                  currentDetailsUpload.analysis.erosionRiskScore - previousUpload.analysis.erosionRiskScore <= 0 
                                    ? 'text-emerald-600' : 'text-rose-600'
                                }`}>
                                  {currentDetailsUpload.analysis.erosionRiskScore - previousUpload.analysis.erosionRiskScore >= 0 ? '+' : ''}
                                  {currentDetailsUpload.analysis.erosionRiskScore - previousUpload.analysis.erosionRiskScore}%
                                </span>
                              </span>
                            </div>

                          </div>
                        </motion.div>
                      ) : (
                        /* STANDALONE ACTIVE DETAILS */
                        <motion.div 
                          key="single-panel"
                          initial={{ opacity: 0, y: 5 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          exit={{ opacity: 0, y: -5 }}
                          className="space-y-4 text-xs font-sans"
                        >
                          {/* Sieve Sizes curves metric */}
                          <div className="border border-slate-100 rounded-2xl p-3 bg-slate-50/50 space-y-2">
                            <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest leading-none">Grain sizes grading diameters</h4>
                            <div className="grid grid-cols-5 gap-1 text-center font-mono text-[10px] leading-tight">
                              <div className="bg-white border p-1 rounded-md">
                                <span className="text-[8px] text-slate-400 block">D10</span>
                                <b className="text-slate-800">{currentDetailsUpload.analysis.d10 ?? 0.18}</b>
                              </div>
                              <div className="bg-white border p-1 rounded-md">
                                <span className="text-[8px] text-slate-400 block">D30</span>
                                <b className="text-slate-800">{currentDetailsUpload.analysis.d30 ?? 0.32}</b>
                              </div>
                              <div className="bg-white border p-1 rounded-md">
                                <span className="text-[8px] text-slate-400 block">D50</span>
                                <b className="text-slate-800">{currentDetailsUpload.analysis.d50 ?? 0.55}</b>
                              </div>
                              <div className="bg-white border p-1 rounded-md">
                                <span className="text-[8px] text-slate-400 block">D60</span>
                                <b className="text-slate-800">{currentDetailsUpload.analysis.d60 ?? 0.68}</b>
                              </div>
                              <div className="bg-white border p-1 rounded-md">
                                <span className="text-[8px] text-slate-400 block">D90</span>
                                <b className="text-slate-800">{currentDetailsUpload.analysis.d90 ?? 1.12}</b>
                              </div>
                            </div>
                          </div>

                          {/* Science Metric card lists */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="border border-slate-100 bg-white p-3 rounded-xl">
                              <span className="text-[9px] text-[#c6996d] font-mono uppercase font-bold tracking-wider block">Average grain size</span>
                              <span className="text-lg font-extrabold text-slate-850 mt-1 block font-mono">{currentDetailsUpload.analysis.averageGrainSize ?? 0.55} mm</span>
                            </div>

                            <div className="border border-slate-100 bg-white p-3 rounded-xl">
                              <span className="text-[9px] text-[#c6996d] font-mono uppercase font-bold tracking-wider block">Packing density</span>
                              <span className="text-lg font-extrabold text-slate-850 mt-1 block font-mono">{currentDetailsUpload.analysis.grainDensity ?? 142} cm²</span>
                            </div>

                            <div className="border border-slate-100 bg-white p-3 rounded-xl col-span-2 flex justify-between items-center leading-none">
                              <div>
                                <span className="text-[9px] text-[#c6996d] font-mono uppercase font-bold tracking-wider block">Coastal Stability</span>
                                <span className="text-xl font-extrabold text-[#0f4c81] mt-1.5 block font-mono">{currentDetailsUpload.analysis.coastalStabilityScore}%</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[9px] text-rose-500 font-mono uppercase font-bold tracking-wider block">Erosion Risk</span>
                                <span className="text-xl font-extrabold text-rose-600 mt-1.5 block font-mono">{currentDetailsUpload.analysis.erosionRiskScore}%</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[9px] text-amber-500 font-mono uppercase font-bold tracking-wider block">Heritage Score</span>
                                <span className="text-xl font-extrabold text-amber-600 mt-1.5 block font-mono">{currentDetailsUpload.analysis.archaeologicalRelevanceScore}%</span>
                              </div>
                            </div>
                          </div>

                          {/* Text observations text */}
                          <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-[11px] leading-relaxed border dark:border-none">
                            <span className="font-bold text-slate-700 block font-sans">AI Dossier Observations</span>
                            <p className="font-light text-slate-600">{currentDetailsUpload.analysis.observations}</p>
                          </div>

                          {/* Quick Report actions */}
                          <div className="pt-2">
                            <button
                              onClick={() => {
                                onGenerateReport(currentDetailsUpload.id);
                                setActiveTab('reports');
                              }}
                              className="w-full py-3 bg-[#0f4c81] hover:bg-[#0f4c81]/90 text-white rounded-xl text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                            >
                              <Award className="w-4 h-4" />
                              Download Sediment Report Dossier
                            </button>
                          </div>

                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                ) : (
                  <div className="p-10 text-center font-light text-xs text-slate-400">
                    No active crystallography models loaded.
                  </div>
                )}

              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center space-y-3 text-slate-400">
                <Compass className="w-10 h-10 animate-spin-slow text-slate-300" />
                <div>
                  <h5 className="font-bold text-slate-705 text-xs text-slate-600">No Location Selected</h5>
                  <p className="text-[10px] font-light max-w-[210px] leading-relaxed mx-auto mt-0.5">Click any active beach marker on the Leaflet map to inspect layers, timelines, and compare historical runs.</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
