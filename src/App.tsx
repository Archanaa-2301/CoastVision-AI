import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AuthScreen from './components/AuthScreen';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import UploadView from './components/UploadView';
import AnalysisResultsView from './components/AnalysisResultsView';
import CoastalMapView from './components/CoastalMapView';
import HistoricalView from './components/HistoricalView';
import ReportsView from './components/ReportsView';
import ProfileView from './components/ProfileView';
import SettingsView from './components/SettingsView';
import { Location, Upload, Report } from './types';
import { ShieldCheck, Compass, HelpCircle } from 'lucide-react';

export default function App() {
  // Session authentication state
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  // Active navigation tab
  // Options: 'landing', 'auth', 'dashboard', 'upload', 'results', 'map', 'history', 'reports', 'profile', 'settings'
  const [activeTab, setActiveTab] = useState<string>('landing');

  // Database Data States
  const [locations, setLocations] = useState<Location[]>([]);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [reports, setReports] = useState<Report[]>([]);

  // Selected upload reference for visual analysis targeting
  const [selectedUpload, setSelectedUpload] = useState<Upload | null>(null);

  // Is data loading from backend on bootup
  const [loadingDb, setLoadingDb] = useState(true);

  // Read stored credentials on boot
  useEffect(() => {
    const storedUser = localStorage.getItem('cv_user');
    const storedToken = localStorage.getItem('cv_token');

    if (storedUser && storedToken) {
      try {
        setCurrentUser(JSON.parse(storedUser));
        setToken(storedToken);
        setActiveTab('dashboard'); // Logged in, default straight to workspace
      } catch (err) {
        console.error('Failed reading credentials from cache:', err);
      }
    }
    fetchLatestDatabase();
  }, []);

  const fetchLatestDatabase = async () => {
    setLoadingDb(true);
    try {
      const [resLoc, resUp, resRep] = await Promise.all([
        fetch('/api/locations'),
        fetch('/api/uploads'),
        fetch('/api/reports')
      ]);

      if (resLoc.ok && resUp.ok && resRep.ok) {
        const dataLoc = await resLoc.json();
        const dataUp = await resUp.json();
        const dataRep = await resRep.json();

        setLocations(dataLoc);
        setUploads(dataUp);
        setReports(dataRep);

        // Pick latest analysed scan as default
        if (dataUp.length > 0) {
          setSelectedUpload(dataUp[0]);
        }
      }
    } catch (err) {
      console.error('Failed coordinating fetch queries with local API routes:', err);
    } finally {
      setLoadingDb(false);
    }
  };

  const handleAuthSuccess = (userData: any, userToken: string) => {
    setCurrentUser(userData);
    setToken(userToken);
    setActiveTab('dashboard');
    fetchLatestDatabase();
  };

  const handleLogout = () => {
    localStorage.removeItem('cv_token');
    localStorage.removeItem('cv_user');
    setCurrentUser(null);
    setToken(null);
    setActiveTab('landing');
  };

  // Add compiled analysis back to memory states
  const handleAnalysisCompleted = (newUpload: Upload) => {
    // Prepend upload
    setUploads(prev => [newUpload, ...prev]);
    setSelectedUpload(newUpload);
    // Reload database parameters to sync stability map scores, zones, and density layers
    fetchLatestDatabase();
  };

  const handleAddReport = (newReport: Report) => {
    setReports(prev => [newReport, ...prev]);
  };

  // Build Report helper
  const handleAutoPrepareReport = async (uploadId: string) => {
    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uploadId,
          title: `Georeferenced Crystalline Dossier Report - Site ID: ${uploadId}`,
          preparedBy: `${currentUser?.username || 'Evelyn Carter (_automated)'}, Coastal Analyst`
        })
      });

      if (response.ok) {
        const newRep = await response.json();
        handleAddReport(newRep);
      }
    } catch (err) {
      console.error('Report synthesizer failure:', err);
    }
  };

  // Reset database seeds handler
  const handleResetDatabaseValue = async () => {
    setLoadingDb(true);
    // Mimic API route clear or reset on client
    localStorage.removeItem('cv_token');
    localStorage.removeItem('cv_user');
    
    // We can clear db.json on the server or we can simply mock a server reset
    // Actually, we can trigger a reload directly from Express if we build a route,
    // or we can reload page to reload server.ts seed engine which re-saves is.
    // Let's reload our state from seeds
    try {
      // In our code db.json is reloaded automatically if empty or we can reload page
      // Let's wait a second, wipe states and re-pull
      setTimeout(() => {
        handleLogout();
        fetchLatestDatabase();
      }, 1000);
    } catch (err) {
      console.error(err);
    }
  };

  // View router renderer
  const renderWorkspaceContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            locations={locations} 
            uploads={uploads} 
            setActiveTab={setActiveTab}
            onSelectUpload={setSelectedUpload}
          />
        );
      case 'upload':
        return (
          <UploadView 
            locations={locations} 
            onUploadComplete={handleAnalysisCompleted}
            setActiveTab={setActiveTab}
            currentUser={currentUser}
          />
        );
      case 'results':
        return (
          <AnalysisResultsView 
            uploads={uploads} 
            selectedUpload={selectedUpload}
            onSelectUpload={setSelectedUpload}
            setActiveTab={setActiveTab}
            onGenerateReport={handleAutoPrepareReport}
          />
        );
      case 'map':
        return (
          <CoastalMapView 
            locations={locations} 
            uploads={uploads}
            setActiveTab={setActiveTab}
            onSelectUpload={setSelectedUpload}
            onGenerateReport={handleAutoPrepareReport}
          />
        );
      case 'history':
        return (
          <HistoricalView 
            uploads={uploads} 
          />
        );
      case 'reports':
        return (
          <ReportsView 
            uploads={uploads} 
            reports={reports}
            onAddReport={handleAddReport}
            setActiveTab={setActiveTab}
          />
        );
      case 'profile':
        return (
          <ProfileView 
            currentUser={currentUser} 
          />
        );
      case 'settings':
        return (
          <SettingsView 
            onResetDatabase={handleResetDatabaseValue}
          />
        );
      default:
        return null;
    }
  };

  // Main UI Layer Routing
  if (activeTab === 'landing') {
    return (
      <LandingPage 
        onStartAnalysis={() => {
          if (currentUser) {
            setActiveTab('dashboard');
          } else {
            setActiveTab('auth');
          }
        }} 
        onExploreMap={() => {
          setActiveTab('map'); // Allow visitors to view the Leaflet GIS map directly! Extremely slick!
        }}
      />
    );
  }

  if (activeTab === 'auth') {
    return (
      <AuthScreen 
        onAuthSuccess={handleAuthSuccess}
        onBack={() => setActiveTab('landing')}
      />
    );
  }

  // General Portal / Dashboard Wrapper Layout
  if (loadingDb && locations.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="bg-ocean text-white p-4 rounded-3xl w-16 h-16 mx-auto flex items-center justify-center shadow animate-spin-slow">
            <Compass className="w-8 h-8" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-slate-800 text-sm">Aligning Coastal Satellite Feeds...</h3>
            <p className="text-xs text-slate-400 font-light font-mono tracking-widest mt-1">ESTABLISHING GEOSPATIAL VECTOR MAPS</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-bg font-sans flex overflow-hidden">
      
      {/* Sidebar on the Left (only if user logged in or viewing map) */}
      {currentUser ? (
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      ) : (
        /* Visitor mode sidebar which lets guest navigate simple maps and go back */
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 h-full text-slate-300">
          <div className="p-6 border-b border-slate-800 flex items-center space-x-3">
            <div className="bg-[#c6996d] text-white p-2.5 rounded-xl">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <span className="font-display font-bold text-white text-lg tracking-tight">CoastalVision</span>
              <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">GUEST CHANNEL</p>
            </div>
          </div>
          <nav className="flex-grow p-4 mt-4 space-y-1">
            <button
              onClick={() => setActiveTab('map')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'map' ? 'bg-ocean text-white' : 'hover:bg-slate-800 text-slate-400'
              }`}
            >
              <span>Explore GIS Map</span>
            </button>
          </nav>
          <div className="p-4 border-t border-slate-800 bg-slate-950/40">
            <div className="mb-4 text-xs text-slate-500 bg-slate-900/50 p-3 rounded-xl border border-slate-800 leading-normal">
              <span className="font-bold text-slate-300 block mb-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-seagreen" /> Guest Mode
              </span>
              Register a student investigator account to scan shoreline photos.
            </div>
            <button
              onClick={() => setActiveTab('auth')}
              className="w-full py-2.5 px-4 bg-ocean hover:bg-ocean-light text-white text-xs font-bold rounded-xl shadow cursor-pointer text-center"
            >
              Access Investigator Console
            </button>
            <button
              onClick={() => setActiveTab('landing')}
              className="w-full mt-2 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl text-center cursor-pointer"
            >
              Back to Landing Page
            </button>
          </div>
        </aside>
      )}

      {/* Main active work view pane */}
      <main className="flex-grow overflow-y-auto min-w-0 h-full bg-slate-bg scroll-smooth">
        
        {/* Simple upper banner inside workspace for guest notifications */}
        {!currentUser && activeTab === 'map' && (
          <div className="bg-ocean text-white py-2.5 px-6 text-xs font-bold flex justify-between items-center z-20 relative select-none">
            <span>You are currently in guest preview mode. Register to edit site layers and run custom image computer vision.</span>
            <button 
              onClick={() => setActiveTab('auth')} 
              className="bg-white text-ocean font-bold px-3 py-1 rounded shadow-sm hover:bg-slate-50 text-[10px]"
            >
              Register Account
            </button>
          </div>
        )}

        <div className="p-6 md:p-8">
          {renderWorkspaceContent()}
        </div>
      </main>

    </div>
  );
}
