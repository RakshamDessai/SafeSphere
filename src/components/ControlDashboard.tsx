import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Radio,
  Users,
  Clock,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sparkles,
  MapPin,
  Flame,
  PlusCircle,
  Eye,
  Filter
} from 'lucide-react';
import { EmergencyIncident, CommunityResponder } from '../types';
import { SAFE_HAVENS, GOA_LOCATIONS } from '../services/mockData';
import { incidentStore } from '../services/incidentStore';
import { EmergencyMap } from './EmergencyMap';
import { soundEffects } from '../services/soundEffects';

interface ControlDashboardProps {
  onSelectIncident?: (incident: EmergencyIncident) => void;
}

export const ControlDashboard: React.FC<ControlDashboardProps> = () => {
  const [incidents, setIncidents] = useState<EmergencyIncident[]>(() => incidentStore.getIncidents());
  const [responders, setResponders] = useState<CommunityResponder[]>(() => incidentStore.getResponders());
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(() => {
    const list = incidentStore.getIncidents();
    return list.length > 0 ? list[0].id : null;
  });
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    const unsubscribe = incidentStore.subscribe(() => {
      setIncidents(incidentStore.getIncidents());
      setResponders(incidentStore.getResponders());
    });
    return () => unsubscribe();
  }, []);

  const activeIncidents = incidents.filter((i) => i.status !== 'resolved');
  const selectedIncident = incidents.find((i) => i.id === selectedIncidentId) || incidents[0] || null;

  // Filtered incidents
  const displayedIncidents = incidents.filter((i) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'active') return i.status !== 'resolved';
    if (filterStatus === 'critical') return i.severity === 'critical';
    if (filterStatus === 'resolved') return i.status === 'resolved';
    return true;
  });

  // Simulate a new high-priority incoming incident for the judges
  const handleSimulateNewIncident = () => {
    const types = ['harassment', 'medical', 'accident', 'coastal_hazard'] as const;
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomLocIdx = Math.floor(Math.random() * GOA_LOCATIONS.length);
    const names = ['Pooja Kamat', 'Rahul Dessai', 'Sneha Velingkar', 'Vikram Prabhu'];
    const randomName = names[Math.floor(Math.random() * names.length)];

    const incident = incidentStore.triggerSOS({
      victimName: randomName,
      victimPhone: `+91 9822${Math.floor(10000 + Math.random() * 90000)}`,
      type: randomType,
      locationIndex: randomLocIdx,
      batteryLevel: Math.floor(Math.random() * 30) + 12,
      audioTranscript: 'Live emergency dispatch simulation triggered by Control Room',
    });

    setSelectedIncidentId(incident.id);
    soundEffects.playBeep(1100, 0.3);
  };

  const handleResolveIncident = (incidentId: string) => {
    incidentStore.resolveIncident(incidentId, 'Control Room operator verified resolution with PCR squad');
  };

  // Center map on selected incident or default GEC
  const mapCenter: [number, number] = selectedIncident
    ? [selectedIncident.location.lat, selectedIncident.location.lng]
    : [15.4227, 74.0089];

  return (
    <div className="space-y-6">
      {/* Top Tactical Stat Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm shadow-lg flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center font-bold">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white">{activeIncidents.length}</div>
            <div className="text-xs text-slate-400 font-medium">Active Distresses</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm shadow-lg flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white">
              {responders.filter((r) => r.currentStatus === 'available').length} / {responders.length}
            </div>
            <div className="text-xs text-slate-400 font-medium">Setu Guardians Available</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm shadow-lg flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white">2.8 min</div>
            <div className="text-xs text-slate-400 font-medium">Avg Guardian ETA (Goa)</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm shadow-lg flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-white">99.4%</div>
            <div className="text-xs text-slate-400 font-medium">AI Triage Accuracy</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column (Map & Tactical Queue), Right Column (Incident Details & AI Triage) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Map & Incident Queue */}
        <div className="lg:col-span-7 space-y-6">
          {/* Tactical Map Container */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm shadow-xl">
            <div className="flex items-center justify-between mb-3 px-1">
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping inline-block" />
                  Live GIS Operations Grid
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">Goa Sector Real-Time Response Map</h3>
              </div>

              <button
                onClick={handleSimulateNewIncident}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-lg shadow-red-600/30"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Simulate Distress (Judge Demo)
              </button>
            </div>

            <div className="h-[400px] w-full">
              <EmergencyMap
                incidents={incidents}
                responders={responders}
                safeHavens={SAFE_HAVENS}
                center={mapCenter}
                zoom={14}
                highlightIncidentId={selectedIncidentId || undefined}
              />
            </div>
          </div>

          {/* Incident Queue List */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                Emergency Operations Queue ({displayedIncidents.length})
              </h3>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                {(['all', 'active', 'critical', 'resolved'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold capitalize transition ${
                      filterStatus === st
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {displayedIncidents.map((inc) => {
                const isSelected = inc.id === selectedIncidentId;
                const isResolved = inc.status === 'resolved';

                return (
                  <div
                    key={inc.id}
                    onClick={() => setSelectedIncidentId(inc.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-blue-950/40 border-blue-500 shadow-md ring-1 ring-blue-500/50'
                        : isResolved
                        ? 'bg-slate-950/40 border-slate-800/80 opacity-60 hover:opacity-90'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                          inc.severity === 'critical'
                            ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                            : inc.severity === 'high'
                            ? 'bg-amber-600/20 text-amber-400 border border-amber-500/30'
                            : 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {inc.severity === 'critical' ? 'CRIT' : inc.severity === 'high' ? 'HIGH' : 'WARN'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white">{inc.victimName}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{inc.id}</span>
                          {isResolved && (
                            <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.2 rounded font-bold">
                              RESOLVED
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-red-400" />
                          <span className="line-clamp-1">{inc.location.name}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end gap-1">
                      <span className="text-xs font-mono font-bold text-red-400">{inc.aiThreatScore}% Threat</span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(inc.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): AI Triage Dossier & Dispatch Controls */}
        <div className="lg:col-span-5 space-y-6">
          {selectedIncident ? (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    AI Threat Triage Engine
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">{selectedIncident.id}</h3>
                </div>

                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                    selectedIncident.status === 'resolved'
                      ? 'bg-emerald-600 text-white'
                      : selectedIncident.severity === 'critical'
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-amber-600 text-white'
                  }`}
                >
                  {selectedIncident.status}
                </span>
              </div>

              {/* Threat Gauge */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-semibold">Distress Threat Level:</span>
                  <span className="text-lg font-mono font-extrabold text-red-400">
                    {selectedIncident.aiThreatScore} / 100
                  </span>
                </div>

                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      selectedIncident.aiThreatScore > 80
                        ? 'bg-gradient-to-r from-amber-500 to-red-600'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${selectedIncident.aiThreatScore}%` }}
                  />
                </div>

                <div className="pt-2 border-t border-slate-900 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Triage Urgency:</span>
                    <strong className="text-yellow-300">{selectedIncident.threatAnalysis.urgency}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Sentiment Mood:</span>
                    <strong className="text-purple-300">{selectedIncident.threatAnalysis.sentiment}</strong>
                  </div>
                </div>
              </div>

              {/* Victim Profile Details */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Victim Identity:</span>
                  <strong className="text-white">{selectedIncident.victimName}</strong>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Phone Contact:</span>
                  <span className="font-mono text-blue-400">{selectedIncident.victimPhone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Device Battery:</span>
                  <span className="font-mono text-yellow-400">{selectedIncident.batteryLevel}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Exact Coordinates:</span>
                  <span className="font-mono text-slate-300">
                    {selectedIncident.location.lat.toFixed(4)}, {selectedIncident.location.lng.toFixed(4)}
                  </span>
                </div>
              </div>

              {/* Detected Trigger Keywords */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  AI Extracted NLP Keywords:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {selectedIncident.threatAnalysis.detectedKeywords.map((kw, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-red-950/60 border border-red-800 text-red-300 px-2 py-0.5 rounded-lg font-medium"
                    >
                      🏷️ {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Recommended */}
              <div className="bg-purple-950/30 border border-purple-800/60 rounded-xl p-3.5 text-xs text-purple-200">
                <div className="font-bold text-purple-300 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  Prescribed Dispatch Protocol:
                </div>
                <p className="leading-relaxed">{selectedIncident.threatAnalysis.actionRequired}</p>
              </div>

              {/* Incident Notes Log */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Audit Timeline:</div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1 max-h-24 overflow-y-auto">
                  {selectedIncident.notes.map((n, i) => (
                    <div key={i} className="text-[10px] text-slate-400 font-mono">
                      • {n}
                    </div>
                  ))}
                </div>
              </div>

              {/* Dispatch / Close Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                {selectedIncident.status !== 'resolved' ? (
                  <button
                    onClick={() => handleResolveIncident(selectedIncident.id)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Verify & Close Incident
                  </button>
                ) : (
                  <div className="w-full py-2 text-center text-xs text-emerald-400 font-bold bg-emerald-950/40 rounded-xl border border-emerald-800">
                    ✓ Closed and Logged to State Safety Repository
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
              Select an incident from the queue to view full AI triage dossier.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
