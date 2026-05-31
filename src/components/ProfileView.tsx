import React from 'react';
import { User, Mail, Shield, Building, Award, Calendar, BookOpen, Clock } from 'lucide-react';

interface ProfileViewProps {
  currentUser: {
    username: string;
    email: string;
    role: 'archaeologist' | 'researcher' | 'student';
  };
}

export default function ProfileView({ currentUser }: ProfileViewProps) {
  const getDisciplineDetails = (role: string) => {
    switch (role) {
      case 'archaeologist': return {
        title: 'Maritime Archeological Anthropologist',
        dept: 'Coastal Ruins and Heritage Safeguard Commission',
        desc: 'Specialized in detecting Pallava, Chola, and Indo-Roman submerged masonry layouts and coastal brick regressing analysis.'
      };
      case 'researcher': return {
        title: 'Senior Marine Geomorphologist',
        dept: 'Oceanography and Coastline Stability Institute',
        desc: 'Analyzing global tide shifts, heavy ilmenite/garnet mineral sorting indices, and sand crystallography trends.'
      };
      default: return {
        title: 'Student Investigator (Field Geology)',
        dept: 'University Geology and Sedimentary Lab',
        desc: 'Field volunteer collecting shoreline, dunes, and beach-line crystallography data across regional estuaries.'
      };
    }
  };

  const details = getDisciplineDetails(currentUser.role);

  return (
    <div id="profile-assessment-view" className="max-w-4xl mx-auto p-4 space-y-8 animate-fadeIn text-slate-800">
      
      {/* Title */}
      <div>
        <h1 className="font-display font-extrabold text-3xl text-slate-900 tracking-tight">Investigator credentials</h1>
        <p className="text-slate-500 font-light text-sm mt-1">Review active laboratory rankings, university clearance, and departmental assignments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Profile Card Left (4 Cols) */}
        <div className="md:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-glass flex flex-col items-center text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-ocean to-seagreen flex items-center justify-center font-display font-extrabold text-white text-3xl shadow-lg border-2 border-white">
            {currentUser.username.substring(0,2).toUpperCase()}
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-slate-950 capitalize">{currentUser.username}</h3>
            <span className="inline-block px-3 py-1 bg-ocean/10 text-ocean text-[10px] uppercase tracking-wider border border-ocean/20 rounded-full font-bold mt-1">
              {currentUser.role}
            </span>
          </div>

          <div className="w-full pt-4 border-t border-slate-100 space-y-3.5 text-xs text-slate-600">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Clearance</span>
              <span className="font-mono font-bold text-seagreen">LEVEL-III APPROVED</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Joined Date</span>
              <span className="font-mono text-slate-700">2026-02-15</span>
            </div>
          </div>
        </div>

        {/* Credentials Breakdown Right (8 Cols) */}
        <div className="md:col-span-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-glass space-y-6">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="font-display font-semibold text-slate-800 text-base">Departmental Assignment</h3>
          </div>

          <div className="space-y-5">
            {/* Dept Item */}
            <div className="flex space-x-3.5">
              <div className="p-3 bg-slate-50 text-slate-500 rounded-xl shrink-0 h-fit">
                <Building className="w-5 h-5 text-ocean" />
              </div>
              <div className="font-sans">
                <h4 className="text-xs font-semibold text-slate-400 uppercase font-mono tracking-wider">Assigned University Lab</h4>
                <p className="text-sm font-bold text-slate-900 mt-1">{details.dept}</p>
              </div>
            </div>

            {/* Title Item */}
            <div className="flex space-x-3.5">
              <div className="p-3 bg-slate-50 text-slate-500 rounded-xl shrink-0 h-fit">
                <Award className="w-5 h-5 text-[#c6996d]" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase font-mono tracking-wider">Research Ranking</h4>
                <p className="text-sm font-bold text-slate-900 mt-1">{details.title}</p>
              </div>
            </div>

            {/* Scope desc */}
            <div className="flex space-x-3.5 pb-2">
              <div className="p-3 bg-slate-50 text-slate-500 rounded-xl shrink-0 h-fit">
                <BookOpen className="w-5 h-5 text-slate-500" />
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase font-mono tracking-wider">Academic Specialization Scope</h4>
                <p className="text-xs text-slate-600 font-light mt-1.5 leading-relaxed">{details.desc}</p>
              </div>
            </div>

            {/* Recent activities simulator */}
            <div className="border-t border-slate-100 pt-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 font-display">Recent Activity Logs</h4>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-slate-300" />
                    <span className="font-medium text-slate-700">Completed Sand Crystallography Upload</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">2026-05-29</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-slate-300" />
                    <span className="font-medium text-slate-700">Synthesized Executive Dossier Report</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">2026-05-30</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
