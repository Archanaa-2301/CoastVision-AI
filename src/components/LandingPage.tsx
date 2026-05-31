import React from 'react';
import { motion } from 'motion/react';
import { Anchor, Shield, Waves, Microscope, Map, FileSpreadsheet, Compass, ArrowRight, Activity, Users, Award } from 'lucide-react';

interface LandingPageProps {
  onStartAnalysis: () => void;
  onExploreMap: () => void;
}

export default function LandingPage({ onStartAnalysis, onExploreMap }: LandingPageProps) {
  return (
    <div id="landing-page" className="min-h-screen wave-bg text-slate-800 font-sans flex flex-col selection:bg-ocean selection:text-white">
      {/* Dynamic Animated Header */}
      <nav className="max-w-7xl mx-auto w-full px-6 py-5 flex justify-between items-center z-10">
        <div className="flex items-center space-x-3">
          <div className="bg-ocean text-white p-2.5 rounded-xl shadow-md border border-white/10">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <span className="font-display font-bold text-2xl tracking-tight bg-gradient-to-r from-ocean to-seagreen bg-clip-text text-transparent">
              CoastalVision <span className="font-light">AI</span>
            </span>
            <p className="text-[9px] font-mono tracking-widest text-[#94A3B8] uppercase">Geospatial Platform</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={onStartAnalysis}
            className="px-5 py-2 rounded-xl text-sm font-medium text-ocean hover:bg-slate-100 transition-all cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={onStartAnalysis}
            className="px-5 py-2 rounded-xl text-sm font-medium bg-ocean hover:bg-ocean-light text-white shadow-md cursor-pointer flex items-center transition-all hover:translate-y-[-1px]"
          >
            Launch Console <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto w-full px-6 pt-16 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-grow">
        <div className="lg:col-span-7 flex flex-col space-y-6">
          <div className="inline-flex items-center space-x-2 bg-ocean/10 border border-ocean/20 rounded-full px-4 py-1.5 w-fit">
            <span className="flex h-2 w-2 rounded-full bg-seagreen animate-pulse" />
            <span className="text-xs font-semibold text-ocean uppercase tracking-wider font-mono">Academic Demonstration Engine</span>
          </div>

          <h1 className="font-display font-extrabold text-5xl md:text-6xl text-slate-950 leading-tight tracking-tight">
            AI-Powered Coastal <br />
            <span className="bg-gradient-to-r from-ocean to-[#1d6b9d] bg-clip-text text-transparent">Sand Analysis</span> and Monitoring
          </h1>

          <p className="text-lg text-slate-600 font-light max-w-xl leading-relaxed">
            Conduct intelligent sand crystallography analysis, monitor sensitive shoreline erosion, trace submerged maritime heritage, and synthesize automatic GIS tracking reports. Developed for marine archaeologists and ocean researchers.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
            <button
              onClick={onStartAnalysis}
              className="px-8 py-4 bg-ocean hover:bg-ocean-light text-white rounded-2xl font-semibold shadow-lg shadow-ocean/20 flex justify-center items-center group transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              Start Analysis 
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={onExploreMap}
              className="px-8 py-4 bg-white/80 hover:bg-white text-slate-800 border border-slate-200 rounded-2xl font-semibold shadow-sm flex justify-center items-center hover:shadow-md transition-all cursor-pointer"
            >
              <Map className="w-5 h-5 mr-3 text-seagreen" /> Explore Coastal Map
            </button>
          </div>

          {/* Quick Stats in Hero */}
          <div className="grid grid-cols-3 gap-6 pt-10 border-t border-slate-200">
            <div>
              <p className="text-3xl font-bold text-ocean font-display">10+</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Supervised Beaches</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-seagreen font-display">92%</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">AI CV Accuracy</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#c6996d] font-display">4K</p>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">Granule Database</p>
            </div>
          </div>
        </div>

        {/* Hero Interactive/Animation Visual */}
        <div className="lg:col-span-5 relative flex justify-center items-center">
          <div className="absolute top-1/2 left-1/2 w-[110%] h-[110%] -translate-x-1/2 -translate-y-1/2 bg-radial from-ocean/5 via-transparent to-transparent rounded-full animate-pulse [-webkit-mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)]" />
          
          {/* Glass Card Showcase */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full relative bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-white/40 overflow-hidden"
          >
            {/* Wave animation simulation graphic */}
            <div className="h-44 bg-slate-900 rounded-2xl relative overflow-hidden flex items-center justify-center border border-white/10 mb-4 shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-t from-ocean/40 to-slate-950 z-0" />
              {/* Waves lines */}
              <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden opacity-30">
                <svg viewBox="0 0 120 28" className="w-[200%] h-full fill-white absolute bottom-0 left-0 animate-[wave_10s_medium_infinite] translate-x-[-25%]">
                  <path d="M0 15 Q 30 0, 60 15 T 120 15 T 180 15 T 240 15 L 240 28 L 0 28 Z" />
                </svg>
                <style>{`
                  @keyframes wave {
                    0% { transform: translateX(0); }
                    50% { transform: translateX(-50%); }
                    100% { transform: translateX(0); }
                  }
                `}</style>
              </div>

              {/* Bounding box illustration overlays */}
              <div className="absolute inset-0 p-4 flex flex-col justify-between z-10">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] bg-emerald-500/90 text-white font-mono px-2 py-0.5 rounded-md uppercase">Scanning Particle Cloud</span>
                  <div className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
                </div>
                {/* Simulated crystal scan boxes */}
                <div className="space-y-2">
                  <span className="text-white text-xs font-mono font-medium block">Microcrystallography</span>
                  <div className="flex gap-2">
                    <div className="px-2 py-1 bg-white/10 rounded-md border border-emerald-500/30 text-[10px] text-white font-mono">Quartz (96.4%)</div>
                    <div className="px-2 py-1 bg-white/10 rounded-md border border-amber-500/30 text-[10px] text-white font-mono">Garnet (91%)</div>
                  </div>
                </div>
              </div>
              <Compass className="w-20 h-20 text-white/5 absolute right-4 top-4" />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 font-mono">COASTAL SYSTEM LOG</span>
                <span className="text-xs text-seagreen font-semibold">● ONLINE</span>
              </div>
              <p className="text-sm font-semibold text-slate-800">Visual Core Analytics active for 10 seed locations along the Indian Ocean corridor.</p>
              
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Stability Index Monitor</span>
                  <span className="font-semibold text-seagreen">Stable</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className="bg-seagreen h-1.5 rounded-full" style={{ width: '84%' }} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="bg-white py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto w-full px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display font-display text-xs font-bold text-ocean tracking-wider uppercase">Advanced Features</h2>
            <p className="font-display font-bold text-3xl text-slate-900 mt-2">Comprehensive Coastal Geomorphology Suite</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-all">
              <div className="bg-ocean/10 text-ocean p-3.5 rounded-xl w-fit mb-6">
                <Microscope className="w-6 h-6" />
              </div>
              <h3 className="font-display font-semibold text-lg text-slate-900 mb-2">Texture Micro-Analysis</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-light">
                Leverage hybrid computer vision models (OpenCV fallback & Gemini AI) to extract mineral boundaries, detect grain contours, and classify quartz sand vs heavy iron minerals.
              </p>
            </div>

            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-all">
              <div className="bg-seagreen/10 text-seagreen p-3.5 rounded-xl w-fit mb-6">
                <Map className="w-6 h-6" />
              </div>
              <h3 className="font-display font-semibold text-lg text-slate-900 mb-2">GIS Mapping & Risk Layers</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-light">
                Visualize shoreline stability scores directly on an interactive Map layer. Highlight stable dunes, moderate erosion zones, and high-risk sediment zones dynamically.
              </p>
            </div>

            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-all">
              <div className="bg-amber-50 rounded-2xl border border-amber-100/50 hover:shadow-lg transition-all">
                <div className="p-8">
                  <div className="bg-amber-500/10 text-[#c6996d] p-3.5 rounded-xl w-fit mb-6">
                    <Shield className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-semibold text-lg text-slate-900 mb-2">Archaeological Safeguard</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-light">
                    Monitor historical coastal sites. Analyze and detect visual indicators of buried structural bricks, submerged port basins, or historic ceramic scatter under tide levels.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="bg-slate-50 py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto w-full px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display font-display text-xs font-bold text-ocean tracking-wider uppercase">The Science</h2>
            <p className="font-display font-bold text-3xl text-slate-900 mt-2">Analysis Operational Workflow</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-ocean text-white flex items-center justify-center font-display font-bold mb-4 shadow">1</div>
              <h4 className="font-semibold text-slate-900 text-sm mb-1">Image Capture</h4>
              <p className="text-xs text-slate-500 px-4 font-light">Take close-up photos of shoreline sand or beach lines under standard daylight.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-ocean text-white flex items-center justify-center font-display font-bold mb-4 shadow">2</div>
              <h4 className="font-semibold text-slate-900 text-sm mb-1">Upload & Tag</h4>
              <p className="text-xs text-slate-500 px-4 font-light">Drag & drop files, specify geographical coordinates, beach names, and notes.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-ocean text-white flex items-center justify-center font-display font-bold mb-4 shadow">3</div>
              <h4 className="font-semibold text-slate-900 text-sm mb-1">Dual AI Inference</h4>
              <p className="text-xs text-slate-500 px-4 font-light">Processing runs either via high-performance Gemini API or intelligent OpenCV Fallback.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-ocean text-white flex items-center justify-center font-display font-bold mb-4 shadow">4</div>
              <h4 className="font-semibold text-slate-900 text-sm mb-1">Dossier Synthesis</h4>
              <p className="text-xs text-slate-500 px-4 font-light">Review grain maps, stability indicators, spatial markers, and compile PDF reports instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900 mt-auto">
        <div className="max-w-7xl mx-auto w-full px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-3">
            <div className="bg-ocean text-white p-2 rounded-lg">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-bold text-white tracking-tight">CoastalVision <span className="font-light text-slate-400">AI</span></span>
              <p className="text-[10px] text-slate-600 font-mono tracking-widest">UNESCO Heritage Co-monitoring</p>
            </div>
          </div>
          <p className="text-xs">&copy; 2026 University Coastal Geomorphology Mini-Project. Built with React & Gemini AI.</p>
        </div>
      </footer>
    </div>
  );
}
