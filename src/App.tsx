import React, { useState } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { VictimView } from './components/VictimView';
import { ResponderView } from './components/ResponderView';
import { ControlDashboard } from './components/ControlDashboard';
import { PitchDeckView } from './components/PitchDeckView';
import { EmergencyIncident } from './types';
import { Shield, Info, Heart, Award, Sparkles, MapPin } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('victim');
  const [notification, setNotification] = useState<string | null>(null);

  const handleIncidentTriggered = (incident: EmergencyIncident) => {
    setNotification(`🚨 Beacon Dispatched: ${incident.type.toUpperCase()} at ${incident.location.name}`);
    setTimeout(() => setNotification(null), 6000);
  };

  const handleFocusIncident = (_incident: EmergencyIncident) => {
    // Switch to control room map view on focus
    setActiveTab('control');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* Sticky Tactical Header */}
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Real-time Notification Toast */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-red-600 text-white px-4 py-2.5 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 border border-red-400 animate-bounce">
          <span>{notification}</span>
        </div>
      )}

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tab 1: Citizen / Student Mobile Companion */}
        {activeTab === 'victim' && (
          <VictimView onIncidentTriggered={handleIncidentTriggered} />
        )}

        {/* Tab 2: Sankalp Setu First-Responder Guardians */}
        {activeTab === 'responder' && (
          <ResponderView onFocusIncident={handleFocusIncident} />
        )}

        {/* Tab 3: Command & Control Center */}
        {activeTab === 'control' && (
          <ControlDashboard />
        )}

        {/* Tab 4: Hackathon Jury Pitch Deck */}
        {activeTab === 'pitch' && (
          <PitchDeckView />
        )}
      </main>

      {/* Hackathon Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/90 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-red-600/30 text-red-400 flex items-center justify-center font-bold text-[10px]">
              🛡️
            </div>
            <span>
              <strong>SafeSphere</strong> • Developed for <strong>SANKALP SETU Hackathon 2026</strong>
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Theme: Safety, Disaster Management & Community Resilience</span>
            <span>•</span>
            <span className="text-slate-400">Goa College of Engineering (GEC)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
