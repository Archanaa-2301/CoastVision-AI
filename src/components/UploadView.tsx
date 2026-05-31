import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UploadCloud, Compass, MapPin, Calendar, FileText, 
  Map, ShieldAlert, FileImage, Trash2, Microscope, ChevronDown 
} from 'lucide-react';
import { Location, Upload } from '../types';

interface UploadViewProps {
  locations: Location[];
  onUploadComplete: (newUpload: Upload) => void;
  setActiveTab: (tab: string) => void;
  currentUser: {
    id: string;
    username: string;
    role: string;
  };
}

export default function UploadView({ locations, onUploadComplete, setActiveTab, currentUser }: UploadViewProps) {
  // Image state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  
  // Field states
  const [useExisting, setUseExisting] = useState(true);
  const [selectedLocId, setSelectedLocId] = useState('');
  
  const [siteName, setSiteName] = useState('');
  const [beachName, setBeachName] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [dateCollected, setDateCollected] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // UI state
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(0);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-populate when existing site is selected
  const handleLocationChange = (locId: string) => {
    setSelectedLocId(locId);
    if (!locId) return;

    const loc = locations.find(l => l.id === locId);
    if (loc) {
      setSiteName(loc.name);
      setBeachName(loc.beachName);
      setState(loc.state);
      setDistrict(loc.district);
      setLatitude(loc.latitude.toString());
      setLongitude(loc.longitude.toString());
    }
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processSelectedFile = (file: File) => {
    if (file.size > 20 * 1024 * 1024) {
      setError('File size exceeds the 20MB academic threshold limit.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setError('Unsupported file type. Please upload jpeg, jpg, or png images of coastal sand or shores.');
      return;
    }

    setError('');
    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  // Submit and analyze
  const handleInference = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) {
      setError('Please upload a shoreline sand photo first.');
      return;
    }
    if (!siteName || !beachName || !latitude || !longitude) {
      setError('Geospatial identifiers (Site, Beach, Coordinates) are required.');
      return;
    }

    setError('');
    setIsProcessing(true);
    setProcessStep(0);

    // Simulated UX sequence of steps
    const stepIntervals = [1200, 2400, 3600];
    stepIntervals.forEach((time, index) => {
      setTimeout(() => setProcessStep(index + 1), time);
    });

    try {
      const payload = {
        siteName,
        beachName,
        state,
        district,
        latitude,
        longitude,
        dateCollected,
        notes,
        imageUrl: imagePreview,
        userId: currentUser.id
      };

      const res = await fetch('/api/uploads/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Computer Vision system crashed during upload analysis.');
      }

      // Finish sequence elegantly after minimum of 4 seconds
      setTimeout(() => {
        setIsProcessing(false);
        onUploadComplete(data);
        setActiveTab('results');
      }, 4500);

    } catch (err: any) {
      setError(err.message || 'An error occurred during image processing.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8 animate-fadeIn">
      {/* Title block */}
      <div>
        <h1 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">Crystallography upload portal</h1>
        <p className="text-slate-500 font-light text-sm mt-1">Submit high-definition beach, dunes, or sand images for contour mapping & mineral classification models.</p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-start space-x-3 text-rose-700 text-xs shadow-sm">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Main Upload Portal Area */}
      <AnimatePresence mode="wait">
        {!isProcessing ? (
          <form onSubmit={handleInference} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left Column - Image drag/drop upload and preview (5 Cols) */}
            <div className="md:col-span-5 space-y-4">
              <label className="text-xs font-semibold text-slate-400 font-mono tracking-wider uppercase block">Shoreline Sample Image</label>
              
              <div 
                className={`relative rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-6 h-80 transition-all ${
                  dragActive ? 'border-ocean bg-ocean/5' : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
              >
                {imagePreview ? (
                  <div className="absolute inset-0 rounded-2xl overflow-hidden flex flex-col justify-between">
                    <img 
                      src={imagePreview} 
                      alt="Sand sample preview" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent flex justify-end p-4">
                      <button
                        type="button"
                        onClick={clearImage}
                        className="p-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md self-end cursor-pointer transition-colors"
                        title="Delete selected artifact"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4 flex flex-col items-center">
                    <div className="p-4 bg-slate-50 text-slate-400 rounded-2xl shadow-sm border border-slate-100">
                      <UploadCloud className="w-8 h-8 text-ocean" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Drag & drop shoreline image</p>
                      <p className="text-xs text-slate-400 mt-1 font-light">JPG, JPEG, PNG formats (max 20MB)</p>
                    </div>
                    <button
                      type="button"
                      onClick={triggerFileSelect}
                      className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer transition-all"
                    >
                      Browse Storage
                    </button>
                    <input 
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Georeferencing metadata fields (7 Cols) */}
            <div className="md:col-span-7 bg-white p-6 rounded-3xl border border-slate-100 shadow-glass space-y-6">
              
              {/* Site Selection Toggles */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-400 font-mono tracking-wider uppercase block">Assigned Site Target</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setUseExisting(true); setError(''); }}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      useExisting 
                        ? 'bg-ocean/10 border-ocean/30 text-ocean' 
                        : 'bg-white border-slate-100 text-slate-500'
                    }`}
                  >
                    Select Seed Site
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUseExisting(false);
                      setSelectedLocId('');
                      setSiteName('');
                      setBeachName('');
                      setState('');
                      setDistrict('');
                      setLatitude('');
                      setLongitude('');
                      setError('');
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      !useExisting 
                        ? 'bg-ocean/10 border-ocean/30 text-ocean' 
                        : 'bg-white border-slate-100 text-slate-500'
                    }`}
                  >
                    Add Custom Geolocation
                  </button>
                </div>

                {useExisting && (
                  <div className="relative">
                    <select
                      value={selectedLocId}
                      onChange={(e) => handleLocationChange(e.target.value)}
                      required={useExisting}
                      className="w-full pl-4 pr-10 py-3 bg-slate-50 rounded-2xl border border-slate-200 focus:outline-none focus:border-ocean text-xs text-slate-700 appearance-none"
                    >
                      <option value="">-- Choose a Seed Beach --</option>
                      {locations.map(l => (
                        <option key={l.id} value={l.id}>{l.beachName} ({l.name})</option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 top-3.5 pointer-events-none" />
                  </div>
                )}
              </div>

              {/* Form Metadata Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs font-semibold text-slate-700 font-mono uppercase tracking-widest">Site Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Mahabalipuram Historic Basin"
                    required
                    disabled={useExisting}
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50/50 rounded-2xl border border-slate-200 focus:outline-none focus:border-ocean text-xs text-slate-800 disabled:bg-slate-100 disabled:opacity-75"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 font-mono uppercase tracking-widest">Beach/Shore Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Shore Temple North"
                    required
                    disabled={useExisting}
                    value={beachName}
                    onChange={(e) => setBeachName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50/50 rounded-2xl border border-slate-200 focus:outline-none focus:border-ocean text-xs text-slate-800 disabled:bg-slate-100 disabled:opacity-75"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 font-mono uppercase tracking-widest">Date Collected</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-3 w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="date"
                      required
                      value={dateCollected}
                      onChange={(e) => setDateCollected(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50/50 rounded-2xl border border-slate-200 focus:outline-none focus:border-ocean text-xs text-slate-800"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 font-mono uppercase tracking-widest">State</label>
                  <input
                    type="text"
                    placeholder="e.g., Goa"
                    disabled={useExisting}
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50/50 rounded-2xl border border-slate-200 focus:outline-none focus:border-ocean text-xs text-slate-800 disabled:bg-slate-100 disabled:opacity-75"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 font-mono uppercase tracking-widest">District</label>
                  <input
                    type="text"
                    placeholder="e.g., North Goa"
                    disabled={useExisting}
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50/50 rounded-2xl border border-slate-200 focus:outline-none focus:border-ocean text-xs text-slate-800 disabled:bg-slate-100 disabled:opacity-75"
                  />
                </div>

                {/* Coordinates */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 font-mono uppercase tracking-widest">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g., 12.6208"
                    required
                    disabled={useExisting}
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50/50 rounded-2xl border border-slate-200 focus:outline-none focus:border-ocean text-xs text-slate-800 disabled:bg-slate-100 disabled:opacity-75"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 font-mono uppercase tracking-widest">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="e.g., 80.1945"
                    required
                    disabled={useExisting}
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50/50 rounded-2xl border border-slate-200 focus:outline-none focus:border-ocean text-xs text-slate-800 disabled:bg-slate-100 disabled:opacity-75"
                  />
                </div>
              </div>

              {/* Notes field */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 font-mono uppercase tracking-widest">Field Logs / Context Notes</label>
                <div className="relative font-sans">
                  <FileText className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                  <textarea
                    placeholder="Write active erosion indications, grain size description, sand coloration types, or submerged masonry signs observed..."
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50/50 rounded-2xl border border-slate-200 focus:outline-none focus:border-ocean text-xs text-slate-800"
                  />
                </div>
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full py-4 bg-ocean hover:bg-ocean-light text-white rounded-2xl font-semibold shadow-lg shadow-ocean/15 text-xs flex justify-center items-center transition-all hover:translate-y-[-1px] cursor-pointer"
              >
                <Microscope className="w-4 h-4 mr-2" />
                <span>Trigger AI Sand Crystallography Scan</span>
              </button>

            </div>

          </form>
        ) : (
          /* scanning animated state */
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 shadow-glass text-center space-y-6 min-h-[480px]"
          >
            {/* Spinning, pulsing compass visualization */}
            <div className="relative">
              <div className="absolute inset-[-15px] rounded-full border border-dashed border-ocean/30 animate-spin-slow" />
              <div className="p-8 bg-ocean/10 text-ocean rounded-full shadow-inner animate-[pulse_2s_infinite]">
                <Compass className="w-12 h-12 text-ocean animate-spin" />
              </div>
            </div>

            <div className="max-w-md space-y-2">
              <h3 className="font-display font-bold text-xl text-slate-900">Conducting Computer Vision Scanning</h3>
              
              {/* Stepped reassure logs */}
              <AnimatePresence mode="wait">
                {processStep === 0 && (
                  <motion.p key="s0" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: -5 }} className="text-xs text-[#c6996d] font-mono tracking-wider">
                    [1/3] BUFFERING HIGH-RESOLUTION IMAGE TO GPU COMPUTE...
                  </motion.p>
                )}
                {processStep === 1 && (
                  <motion.p key="s1" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: -5 }} className="text-xs text-ocean font-mono tracking-wider">
                    [2/3] COMPUTING PARTICLE BOUNDARIES & GRADIANT VECTORING...
                  </motion.p>
                )}
                {processStep === 2 && (
                  <motion.p key="s2" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: -5 }} className="text-xs text-[#0a3256] font-mono tracking-wider">
                    [3/3] ESTIMATING STABILITY INFERENCE & ARCHEOLOGICAL MATCHS...
                  </motion.p>
                )}
                {processStep >= 3 && (
                  <motion.p key="s3" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: -5 }} className="text-xs text-seagreen font-mono tracking-wider">
                    [DONE] DRAFTING COMPILER DOSSIER OBJECT...
                  </motion.p>
                )}
              </AnimatePresence>

              <p className="text-xs text-slate-400 font-light px-8">
                The image is being processed by the system's hybrid AI models. Average execution takes 4 seconds. Please stand by.
              </p>
            </div>

            {/* Simulated progress slider bar */}
            <div className="w-64 bg-slate-100 rounded-full h-1 relative overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 4.5, ease: 'easeInOut' }}
                className="bg-ocean h-full rounded-full"
              />
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
