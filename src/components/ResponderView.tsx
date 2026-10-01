import React, { useState, useEffect } from 'react';
import {
  Shield,
  MapPin,
  Clock,
  Phone,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  HeartPulse,
  Award,
  Navigation,
  Compass
} from 'lucide-react';
import { CommunityResponder, EmergencyIncident } from '../types';
import { incidentStore } from '../services/incidentStore';
import { soundEffects } from '../services/soundEffects';
import confetti from 'canvas-confetti';

interface ResponderViewProps {
  onFocusIncident?: (incident: EmergencyIncident) => void;
}

export const ResponderView: React.FC<ResponderViewProps> = ({ onFocusIncident }) => {
  const [responders, setResponders] = useState<CommunityResponder[]>(() => incidentStore.getResponders());
  const [activeResponderId, setActiveResponderId] = useState<string>('resp-1'); // Default Rohan Naik (Campus Security)
  const [incidents, setIncidents] = useState<EmergencyIncident[]>(() => incidentStore.getIncidents());
  const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = incidentStore.subscribe(() => {
      setResponders(incidentStore.getResponders());
      setIncidents(incidentStore.getIncidents());
    });
    return () => unsubscribe();
  }, []);

  const currentResponder = responders.find((r) => r.id === activeResponderId) || responders[0];
  const activeIncidents = incidents.filter((i) => i.status !== 'resolved');

  // Accept and rush
  const handleAccept = (incident: EmergencyIncident) => {
    incidentStore.acceptIncidentByResponder(currentResponder.id, incident.id);
    soundEffects.playBeep(1000, 0.2);
    soundEffects.speakText(`You accepted response for ${incident.victimName}. Rushing to ${incident.location.name}.`);
    onFocusIncident?.(incident);
  };

  // Mark resolved
  const handleResolve = (incident: EmergencyIncident) => {
    incidentStore.resolveIncident(incident.id, `Resolved by Guardian ${currentResponder.name} (${currentResponder.role})`);
    soundEffects.speakText(`Incident ${incident.id} marked safely resolved. Well done guardian.`);
    confetti({ particleCount: 100, spread: 70 });
  };

  const protocols = [
    {
      id: 'cpr',
      title: 'CPR Emergency Protocol',
      icon: '🫀',
      color: 'border-red-500/50 bg-red-950/20 text-red-300',
      steps: [
        '1. Check responsiveness and call for Goa 108 ambulance immediately.',
        '2. Place hands center of chest, lock elbows.',
        '3. Push hard and fast: 100–120 compressions per minute (to the beat of Stayin’ Alive).',
        '4. 30 chest compressions followed by 2 rescue breaths if trained.',
      ],
    },
    {
      id: 'harass',
      title: 'Harassment Bystander Intervention',
      icon: '🛡️',
      color: 'border-purple-500/50 bg-purple-950/20 text-purple-300',
      steps: [
        '1. Direct Approach: Step in and engage victim ("Hey, there you are, come let’s go").',
        '2. Create Distraction: Ask victim for the time or directions to defuse stalker.',
        '3. Escort victim to nearest lit Safe Haven (e.g., GEC Security Gate).',
        '4. Maintain distance from aggressor; dial 112 if physical threat escalates.',
      ],
    },
    {
      id: 'bleeding',
      title: 'Trauma & Severe Bleeding',
      icon: '🩹',
      color: 'border-rose-500/50 bg-rose-950/20 text-rose-300',
      steps: [
        '1. Apply firm, continuous direct pressure with clean cloth or bandage.',
        '2. Do not remove soaked gauze; layer fresh cloth over it.',
        '3. Keep victim calm and elevated if possible to reduce shock.',
        '4. Guide ambulance to exact landmark coordinates.',
      ],
    },
    {
      id: 'rip_current',
      title: 'Goa Coastal Rip Current Rescue',
      icon: '🌊',
      color: 'border-blue-500/50 bg-blue-950/20 text-blue-300',
      steps: [
        '1. Do not enter turbulent surf without flotation aid (ring buoy or bodyboard).',
        '2. Shouting instruction to victim: "Swim parallel to shore, do NOT fight the current!"',
        '3. Alert Drishti Marine Lifeguard tower immediately.',
        '4. Prepare CPR and warm blanket on beach.',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Guardian Profile Selector */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-sm shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={currentResponder.avatar}
              alt={currentResponder.name}
              className="w-13 h-13 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-0.5" title="Verified Volunteer">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{currentResponder.name}</h2>
              <span className="text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded-full">
                {currentResponder.role}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
              <span>★ {currentResponder.rating} Rating</span>
              <span>•</span>
              <span className="font-mono">{currentResponder.phone}</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Active on Mesh
              </span>
            </div>
          </div>
        </div>

        {/* Switch Persona for Demo / Roleplay */}
        <div className="w-full md:w-auto">
          <label className="text-[11px] font-semibold text-slate-400 block mb-1">
            Simulate Guardian Role:
          </label>
          <select
            value={activeResponderId}
            onChange={(e) => setActiveResponderId(e.target.value)}
            className="w-full md:w-64 bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
          >
            {responders.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.role})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Active Incidents Nearby + Protocol Cheat Sheets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Active Incidents Requiring Response */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Distress Incidents Within Your Geofence ({activeIncidents.length})
            </h3>
            <span className="text-xs text-slate-500">Live 2km Mesh Radius</span>
          </div>

          {activeIncidents.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h4 className="text-base font-bold text-white">All Clear in Farmagudi / Goa Sector</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                No active SOS distress beacons right now. You are connected as a first-responder guardian. You will be
                notified instantly with audio chime if a nearby emergency triggers.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeIncidents.map((incident) => {
                const isAssignedToMe = incident.assignedResponders.includes(currentResponder.id);
                const isCritical = incident.severity === 'critical';

                return (
                  <div
                    key={incident.id}
                    className={`border rounded-2xl p-5 transition-all shadow-xl backdrop-blur-sm ${
                      isCritical
                        ? 'bg-red-950/30 border-red-500/60'
                        : 'bg-slate-900/80 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              isCritical ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'
                            }`}
                          >
                            {incident.severity}
                          </span>
                          <span className="text-xs font-mono text-slate-400">{incident.id}</span>
                          <span className="text-[11px] text-slate-500">
                            {new Date(incident.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white mt-1.5 flex items-center gap-2">
                          <span>{incident.victimName}</span>
                          <span className="text-xs font-normal text-slate-400">({incident.victimPhone})</span>
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                          <span>{incident.location.name}</span>
                        </div>
                      </div>

                      {/* AI Threat Score Badge */}
                      <div className="text-right">
                        <div className="text-xs text-slate-400 font-medium">AI Threat Index</div>
                        <div className="text-2xl font-bold font-mono text-red-400">{incident.aiThreatScore}%</div>
                      </div>
                    </div>

                    {/* Threat Analysis & Keywords */}
                    <div className="mt-3.5 bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Type:</span>
                        <span className="font-bold text-slate-200 uppercase">{incident.type.replace('_', ' ')}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Recommended Action:</span>
                        <span className="font-bold text-amber-300">{incident.threatAnalysis.actionRequired}</span>
                      </div>
                      {incident.audioTranscript && (
                        <div className="pt-1 border-t border-slate-800 text-[11px] text-purple-300 italic">
                          " {incident.audioTranscript} "
                        </div>
                      )}
                    </div>

                    {/* Responder Action Buttons */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                        <Navigation className="w-3.5 h-3.5 text-blue-400" />
                        <span>Distance: ~{currentResponder.distanceKm} km</span>
                        <span>•</span>
                        <span>ETA: ~{currentResponder.etaMinutes} mins</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${incident.victimPhone}`}
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1"
                          title="Call Victim"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>

                        {isAssignedToMe ? (
                          <button
                            onClick={() => handleResolve(incident)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-emerald-600/30"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Mark Safely Resolved
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAccept(incident)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-blue-600/30"
                          >
                            <Shield className="w-3.5 h-3.5" />
                            Accept & Rush to Scene
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column (5 cols): Emergency Field Protocols & First-Aid Guides */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-rose-400" />
              Sankalp Setu Guardian Protocols
            </h3>
            <span className="text-[10px] text-slate-500">Field Quick-Reference</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {protocols.map((proto) => {
              const isOpen = selectedProtocol === proto.id;
              return (
                <div
                  key={proto.id}
                  className={`border rounded-2xl p-4 transition-all cursor-pointer ${
                    isOpen ? 'bg-slate-900 border-slate-700 shadow-xl' : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-900'
                  }`}
                  onClick={() => setSelectedProtocol(isOpen ? null : proto.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{proto.icon}</span>
                      <span className="font-bold text-xs text-white">{proto.title}</span>
                    </div>
                    <span className="text-xs text-slate-500 font-bold">{isOpen ? '▲' : '▼'}</span>
                  </div>

                  {isOpen && (
                    <div className="mt-3 pt-3 border-t border-slate-800 space-y-2">
                      {proto.steps.map((st, i) => (
                        <div key={i} className="text-xs text-slate-300 flex items-start gap-1.5 leading-relaxed">
                          <span>{st}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Seva Sankalp Guardian Pledge Card */}
          <div className="bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-900 border border-blue-900/50 rounded-2xl p-4 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold">
              <Award className="w-4 h-4" />
              Seva Sankalp Guardian Community
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Every verified citizen volunteer and student in Goa creates a human safety net. By bridging the critical
              first 3–7 minutes before official police/ambulances arrive, community guardians save lives and deter crime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
