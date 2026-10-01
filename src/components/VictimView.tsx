import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Volume2,
  VolumeX,
  PhoneCall,
  Mic,
  MicOff,
  Navigation,
  Shield,
  Clock,
  Battery,
  MapPin,
  CheckCircle2,
  Share2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { EmergencyType, EmergencyIncident } from '../types';
import { GOA_LOCATIONS, FAKE_CALL_SCENARIOS } from '../services/mockData';
import { incidentStore } from '../services/incidentStore';
import { soundEffects } from '../services/soundEffects';
import { speechDistressService } from '../services/speechDistress';
import confetti from 'canvas-confetti';

interface VictimViewProps {
  onIncidentTriggered?: (incident: EmergencyIncident) => void;
}

export const VictimView: React.FC<VictimViewProps> = ({ onIncidentTriggered }) => {
  const [activeIncident, setActiveIncident] = useState<EmergencyIncident | null>(() =>
    incidentStore.getActiveUserIncident()
  );
  const [selectedType, setSelectedType] = useState<EmergencyType>('isolated_danger');
  const [selectedLocationIdx, setSelectedLocationIdx] = useState<number>(0);
  const [customLocationName, setCustomLocationName] = useState<string>('');
  const [victimName, setVictimName] = useState<string>('GEC Student (Campus Pass)');
  const [victimPhone, setVictimPhone] = useState<string>('+91 98224 81729');

  // SOS Countdown State
  const [countdown, setCountdown] = useState<number | null>(null);

  // Siren State
  const [isSirenActive, setIsSirenActive] = useState<boolean>(false);

  // Voice Distress Detection
  const [isVoiceListening, setIsVoiceListening] = useState<boolean>(false);
  const [detectedVoiceSnippet, setDetectedVoiceSnippet] = useState<string>('');

  // Fake Call Feature
  const [isFakeCallRinging, setIsFakeCallRinging] = useState<boolean>(false);
  const [isFakeCallAnswered, setIsFakeCallAnswered] = useState<boolean>(false);
  const [fakeCallTimer, setFakeCallTimer] = useState<number>(0);
  const [activeScenarioIdx, setActiveScenarioIdx] = useState<number>(0);

  // Safe Walk Session
  const [safeWalk, setSafeWalk] = useState(() => incidentStore.getSafeWalk());
  const [walkDestination, setWalkDestination] = useState<string>('GEC Ladies Hostel Block 3');
  const [walkMinutes, setWalkMinutes] = useState<number>(10);
  const [walkRemainingSec, setWalkRemainingSec] = useState<number>(600);

  // Sync store state
  useEffect(() => {
    const unsubscribe = incidentStore.subscribe(() => {
      setActiveIncident(incidentStore.getActiveUserIncident());
      setSafeWalk(incidentStore.getSafeWalk());
    });
    return () => unsubscribe();
  }, []);

  // Countdown timer for SOS trigger
  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      soundEffects.playBeep(900, 0.1);
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      executeImmediateSOS();
      setCountdown(null);
    }
  }, [countdown]);

  // Safe Walk Countdown
  useEffect(() => {
    if (!safeWalk.isActive || !safeWalk.checkInDueAt) return;
    const interval = setInterval(() => {
      const remainingMs = new Date(safeWalk.checkInDueAt!).getTime() - Date.now();
      const sec = Math.max(0, Math.floor(remainingMs / 1000));
      setWalkRemainingSec(sec);
      if (sec === 0 && safeWalk.status === 'walking') {
        // Auto trigger emergency
        triggerCountdownSOS();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [safeWalk]);

  // Fake Call In-Call Timer
  useEffect(() => {
    if (!isFakeCallAnswered) return;
    const timer = setInterval(() => setFakeCallTimer((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [isFakeCallAnswered]);

  // Toggle Voice Distress Listening
  const toggleVoiceDistress = () => {
    if (isVoiceListening) {
      speechDistressService.stopListening();
      setIsVoiceListening(false);
    } else {
      if (!speechDistressService.isSupported()) {
        alert('Web Speech API is not supported in this browser. Voice simulation can still be tested.');
        return;
      }
      speechDistressService.startListening((keyword, transcript) => {
        setDetectedVoiceSnippet(`Vocal Trigger Detected: "${keyword}" from speech: "${transcript}"`);
        // Immediately initiate SOS
        triggerCountdownSOS(`Voice trigger: ${transcript}`);
      });
      setIsVoiceListening(true);
    }
  };

  // Start SOS with 3-sec abort safety
  const triggerCountdownSOS = (transcript?: string) => {
    if (activeIncident) return; // already active
    if (transcript) {
      setDetectedVoiceSnippet(transcript);
    }
    setCountdown(3);
  };

  const cancelCountdown = () => {
    setCountdown(null);
  };

  const executeImmediateSOS = () => {
    const incident = incidentStore.triggerSOS({
      victimName,
      victimPhone,
      type: selectedType,
      locationIndex: selectedLocationIdx,
      audioTranscript: detectedVoiceSnippet || undefined,
      batteryLevel: 24,
    });
    setActiveIncident(incident);
    onIncidentTriggered?.(incident);
    soundEffects.playBeep(1200, 0.4);
    soundEffects.speakText(
      'Emergency SOS broadcasted. Responders in Farmagudi have been dispatched to your GPS location.'
    );
  };

  // Resolve / Cancel active SOS
  const handleResolveSOS = () => {
    if (!activeIncident) return;
    incidentStore.resolveIncident(activeIncident.id, 'User marked self as safe');
    setActiveIncident(null);
    soundEffects.speakText('Emergency resolved. Glad you are safe.');
    confetti({ particleCount: 80, spread: 60 });
  };

  // Toggle Siren
  const toggleSiren = () => {
    if (isSirenActive) {
      soundEffects.stopSiren();
      setIsSirenActive(false);
    } else {
      soundEffects.startSiren();
      setIsSirenActive(true);
    }
  };

  // Fake Call Handlers
  const triggerFakeCall = () => {
    soundEffects.startRingtone();
    setIsFakeCallRinging(true);
  };

  const answerFakeCall = () => {
    soundEffects.stopRingtone();
    setIsFakeCallRinging(false);
    setIsFakeCallAnswered(true);
    setFakeCallTimer(0);
    const scenario = FAKE_CALL_SCENARIOS[activeScenarioIdx];
    const script = scenario.dialogueScript.join('. ... ');
    soundEffects.speakText(script, 0.95);
  };

  const endFakeCall = () => {
    soundEffects.stopRingtone();
    soundEffects.stopSpeaking();
    setIsFakeCallRinging(false);
    setIsFakeCallAnswered(false);
    setFakeCallTimer(0);
  };

  // Safe Walk Start
  const handleStartSafeWalk = () => {
    incidentStore.startSafeWalk(walkDestination, walkMinutes);
    setWalkRemainingSec(walkMinutes * 60);
  };

  const handleEndSafeWalk = () => {
    incidentStore.endSafeWalk();
    confetti({ particleCount: 70, spread: 70 });
  };

  const emergencyTypeButtons: { type: EmergencyType; label: string; icon: string; desc: string }[] = [
    { type: 'harassment', label: 'Harassment / Stalker', icon: '🚨', desc: 'Threat, intimidation or stalking' },
    { type: 'isolated_danger', label: 'Isolated Stretch Fear', icon: '🌑', desc: 'Unlit road, dark area, feeling unsafe' },
    { type: 'medical', label: 'Medical Emergency', icon: '🚑', desc: 'Injury, breathing distress, sudden illness' },
    { type: 'accident', label: 'Road Accident', icon: '💥', desc: 'Vehicular collision or breakdown' },
    { type: 'coastal_hazard', label: 'Beach / Water Hazard', icon: '🌊', desc: 'Rip currents, high tide or rocky danger' },
  ];

  const currentLocation = GOA_LOCATIONS[selectedLocationIdx];

  // Direct SMS payload for offline fallback
  const offlineSmsUrl = `sms:112?body=EMERGENCY SOS: ${victimName} at ${currentLocation.name} (${currentLocation.lat}, ${currentLocation.lng}). Type: ${selectedType}. Need immediate assistance!`;

  return (
    <div className="space-y-6">
      {/* Active Incident Banner */}
      {activeIncident ? (
        <div className="bg-red-950/80 border-2 border-red-500 rounded-2xl p-5 shadow-2xl animate-pulse-fast backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-bold shadow-lg shadow-red-600/50">
                <AlertTriangle className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-red-400 font-mono text-xs font-bold uppercase tracking-wider">
                    ● SOS BROADCAST ACTIVE
                  </span>
                  <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {activeIncident.id}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Assistance Dispatched to {activeIncident.location.name}
                </h3>
                <p className="text-xs text-red-200 mt-1">
                  AI Threat Score: <strong className="text-yellow-300">{activeIncident.aiThreatScore}%</strong> |
                  Assigned Responders: <strong>{activeIncident.assignedResponders.length} Guardians en route</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleResolveSOS}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                I Am Safe Now (Cancel SOS)
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-red-900/60 text-xs text-red-200 flex flex-wrap items-center justify-between gap-2">
            <span>
              <strong>AI Action:</strong> {activeIncident.threatAnalysis.actionRequired}
            </span>
            <span className="font-mono text-yellow-300 flex items-center gap-1">
              <Battery className="w-3.5 h-3.5" /> Battery: {activeIncident.batteryLevel}%
            </span>
          </div>
        </div>
      ) : null}

      {/* Main Grid: Left Column (SOS & Triggers), Right Column (Escort & Tools) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Giant SOS Trigger & Location Setup */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Panic Button Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden backdrop-blur-sm">
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
                  Instant Personal Safety Mesh
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">Emergency SOS Beacon</h2>
              </div>

              {/* Siren Quick Toggle */}
              <button
                onClick={toggleSiren}
                className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
                  isSirenActive
                    ? 'bg-red-600 text-white border-red-400 animate-pulse'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
                title="Trigger Loud 100dB Emergency Audio Siren"
              >
                {isSirenActive ? <Volume2 className="w-4 h-4 animate-spin" /> : <VolumeX className="w-4 h-4" />}
                <span>{isSirenActive ? 'Siren Blaring!' : 'Audio Siren'}</span>
              </button>
            </div>

            {/* Giant Tactical SOS Trigger Button */}
            <div className="py-6 flex flex-col items-center justify-center">
              {countdown !== null ? (
                <div className="flex flex-col items-center">
                  <div className="relative w-44 h-44 rounded-full bg-red-600 border-4 border-yellow-300 flex flex-col items-center justify-center text-white shadow-2xl animate-pulse">
                    <span className="text-6xl font-extrabold font-mono">{countdown}</span>
                    <span className="text-xs uppercase font-bold tracking-wider mt-1">Aborting in...</span>
                  </div>
                  <button
                    onClick={cancelCountdown}
                    className="mt-5 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 rounded-xl font-bold text-sm shadow transition"
                  >
                    Tap to Cancel (False Alarm)
                  </button>
                </div>
              ) : (
                <div className="relative group cursor-pointer" onClick={() => triggerCountdownSOS()}>
                  {/* Glowing Radar Rings */}
                  <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping-slow scale-110 pointer-events-none" />
                  <div className="absolute inset-0 rounded-full bg-red-600/30 blur-xl scale-125 pointer-events-none group-hover:scale-150 transition-all duration-300" />

                  <button
                    disabled={!!activeIncident}
                    className={`relative w-48 h-48 rounded-full flex flex-col items-center justify-center text-white shadow-2xl transition-all duration-300 transform active:scale-95 ${
                      activeIncident
                        ? 'bg-slate-800 border-4 border-slate-700 cursor-not-allowed opacity-75'
                        : 'bg-gradient-to-br from-red-500 via-red-600 to-rose-700 hover:from-red-600 hover:to-rose-800 border-4 border-red-400/80 shadow-red-600/50'
                    }`}
                  >
                    <AlertTriangle className="w-12 h-12 mb-1.5 drop-shadow-md" />
                    <span className="text-3xl font-extrabold tracking-wider font-mono">SOS</span>
                    <span className="text-[10px] font-semibold text-red-100 uppercase tracking-widest mt-0.5">
                      {activeIncident ? 'Mesh Active' : 'Tap for Help'}
                    </span>
                  </button>
                </div>
              )}

              <p className="text-slate-400 text-xs text-center mt-5 max-w-sm">
                Single tap activates a 3-second safety window. Instantly transmits GPS coordinates, alerts Goa 112,
                and pings verified <strong className="text-blue-400">Sankalp Setu Guardians</strong> within 1 km.
              </p>
            </div>

            {/* Emergency Category Selector */}
            <div className="mt-4 pt-4 border-t border-slate-800">
              <label className="text-xs font-semibold text-slate-300 mb-2.5 block flex items-center justify-between">
                <span>Select Distress Nature:</span>
                <span className="text-[10px] text-slate-500">Auto-routes to corresponding responder</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {emergencyTypeButtons.map((btn) => (
                  <button
                    key={btn.type}
                    onClick={() => setSelectedType(btn.type)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedType === btn.type
                        ? 'bg-red-500/15 border-red-500 text-white shadow-sm'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-base mb-1">{btn.icon}</div>
                    <div className="font-bold text-xs text-slate-200">{btn.label}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">{btn.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Location Selector (Goa Hotspots & GPS) */}
            <div className="mt-5 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  Your Current Beacon Location:
                </label>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  GPS Fixed: ±4m
                </span>
              </div>

              <select
                value={selectedLocationIdx}
                onChange={(e) => setSelectedLocationIdx(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-red-500"
              >
                {GOA_LOCATIONS.map((loc, idx) => (
                  <option key={idx} value={idx}>
                    📍 {loc.name} — {loc.landmark}
                  </option>
                ))}
              </select>

              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
                <span>Lat: {currentLocation.lat.toFixed(4)}, Lng: {currentLocation.lng.toFixed(4)}</span>
                <span className="text-slate-500">{currentLocation.landmark}</span>
              </div>
            </div>
          </div>

          {/* Voice Distress Trigger & Offline Backup SMS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Voice Detection Box */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Mic className="w-4 h-4 text-purple-400" />
                    AI Vocal Trigger
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isVoiceListening ? 'bg-purple-600 text-white animate-pulse' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isVoiceListening ? 'LISTENING LIVE' : 'OFF'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Listens hands-free for distress phrases: <span className="text-purple-300 font-mono">"Help me"</span>,{' '}
                  <span className="text-purple-300 font-mono">"Bachao"</span>, or{' '}
                  <span className="text-purple-300 font-mono">"Emergency"</span>.
                </p>
                {detectedVoiceSnippet && (
                  <div className="mt-2 text-[10px] bg-slate-950 p-2 rounded border border-purple-900/60 text-purple-200 font-mono">
                    {detectedVoiceSnippet}
                  </div>
                )}
              </div>

              <button
                onClick={toggleVoiceDistress}
                className={`mt-4 w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                  isVoiceListening
                    ? 'bg-purple-600 hover:bg-purple-500 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                {isVoiceListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                {isVoiceListening ? 'Stop Mic Listener' : 'Enable Hands-Free Mic'}
              </button>
            </div>

            {/* Offline 0-Internet SMS Fallback */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-emerald-400" />
                  Zero-Internet SMS Fallback
                </span>
                <p className="text-[11px] text-slate-400 mt-2">
                  No 4G/5G data in Ghats or isolated stretches? Generates native encrypted SMS dispatch to Goa 112 with
                  exact coordinates.
                </p>
              </div>

              <a
                href={offlineSmsUrl}
                className="mt-4 w-full py-2 px-3 bg-emerald-700/30 hover:bg-emerald-600/40 border border-emerald-500/50 text-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                Dispatch Direct 112 SMS
              </a>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): SafeWalk Escort & Fake Call Generator */}
        <div className="lg:col-span-5 space-y-6">
          {/* Safe Walk Companion Mode (Virtual Escort) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-blue-400" />
                Safe Walk Companion
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  safeWalk.isActive ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {safeWalk.isActive ? 'ESCORT ACTIVE' : 'STANDBY'}
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Walking alone at night across campus or to the bus stand? Set a timer. If you don't check in upon
              arrival, SafeSphere automatically alerts nearby guardians.
            </p>

            {safeWalk.isActive ? (
              <div className="bg-slate-950 border border-blue-900/60 rounded-xl p-4 text-center space-y-3">
                <div className="text-xs text-blue-300 font-semibold">
                  Destination: <strong className="text-white">{safeWalk.destination}</strong>
                </div>

                <div className="text-4xl font-mono font-extrabold text-blue-400">
                  {Math.floor(walkRemainingSec / 60)}:
                  {(walkRemainingSec % 60).toString().padStart(2, '0')}
                </div>

                <div className="text-[11px] text-slate-400">
                  Time left to reach destination before emergency ping
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleEndSafeWalk}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    I Reached Safely
                  </button>
                  <button
                    onClick={() => triggerCountdownSOS('SafeWalk Timeout Escalation')}
                    className="py-2 px-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition"
                  >
                    SOS Now
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Destination:</label>
                  <input
                    type="text"
                    value={walkDestination}
                    onChange={(e) => setWalkDestination(e.target.value)}
                    placeholder="e.g. GEC Hostel Block 3 / Farmagudi Bus Stop"
                    className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Expected Walk Duration:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[5, 10, 15].map((m) => (
                      <button
                        key={m}
                        onClick={() => setWalkMinutes(m)}
                        className={`py-1.5 rounded-lg text-xs font-bold border transition ${
                          walkMinutes === m
                            ? 'bg-blue-600 text-white border-blue-400'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                        }`}
                      >
                        {m} Mins
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleStartSafeWalk}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-lg shadow-blue-600/30"
                >
                  <Navigation className="w-4 h-4" />
                  Start Safe Walk Escort
                </button>
              </div>
            )}
          </div>

          {/* Fake Call Generator (Anti-Harassment Shield) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                Anti-Harassment Fake Call Shield
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                Discreet Escape
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              Trapped in an uncomfortable conversation or being followed? Trigger a realistic incoming phone call with
              voice dialogue to excuse yourself safely.
            </p>

            {/* Scenario Picker */}
            <div className="flex gap-1.5 mb-3">
              {FAKE_CALL_SCENARIOS.map((sc, idx) => (
                <button
                  key={sc.id}
                  onClick={() => setActiveScenarioIdx(idx)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition truncate ${
                    activeScenarioIdx === idx
                      ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {sc.title}
                </button>
              ))}
            </div>

            <button
              onClick={triggerFakeCall}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-emerald-500/50 text-emerald-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              Simulate Incoming Call Now
            </button>
          </div>

          {/* Quick Goa Emergency Directory Contacts */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm text-xs">
            <div className="font-bold text-slate-300 mb-2.5 text-xs flex items-center justify-between">
              <span>Goa Emergency Speed Dials:</span>
              <span className="text-[10px] text-slate-500">One-Tap Call</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <a
                href="tel:112"
                className="bg-slate-950 hover:bg-slate-800 border border-slate-800 p-2 rounded-xl flex items-center justify-between transition text-slate-200"
              >
                <span>🚨 Goa Police / 112</span>
                <strong className="text-red-400 font-mono">112</strong>
              </a>
              <a
                href="tel:108"
                className="bg-slate-950 hover:bg-slate-800 border border-slate-800 p-2 rounded-xl flex items-center justify-between transition text-slate-200"
              >
                <span>🚑 Ambulance / 108</span>
                <strong className="text-blue-400 font-mono">108</strong>
              </a>
              <a
                href="tel:1091"
                className="bg-slate-950 hover:bg-slate-800 border border-slate-800 p-2 rounded-xl flex items-center justify-between transition text-slate-200"
              >
                <span>👩 Women Helpline</span>
                <strong className="text-pink-400 font-mono">1091</strong>
              </a>
              <a
                href="tel:08322399100"
                className="bg-slate-950 hover:bg-slate-800 border border-slate-800 p-2 rounded-xl flex items-center justify-between transition text-slate-200"
              >
                <span>🏫 GEC Security Gate</span>
                <strong className="text-emerald-400 font-mono">9100</strong>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Fake Phone Call Modal Overlay (Full Phone UI Experience) */}
      {(isFakeCallRinging || isFakeCallAnswered) && (
        <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-between min-h-[500px]">
            {/* Top Status */}
            <div className="text-center pt-6">
              <div className="text-xs text-slate-400 font-mono">
                {isFakeCallAnswered ? 'CALL IN PROGRESS' : 'INCOMING EMERGENCY CALL'}
              </div>
              <h2 className="text-2xl font-bold text-white mt-2">
                {FAKE_CALL_SCENARIOS[activeScenarioIdx].callerName}
              </h2>
              <div className="text-xs text-slate-400 mt-1 font-mono">
                {FAKE_CALL_SCENARIOS[activeScenarioIdx].callerNumber}
              </div>

              {isFakeCallAnswered && (
                <div className="mt-3 text-sm text-emerald-400 font-mono font-bold">
                  {Math.floor(fakeCallTimer / 60)}:
                  {(fakeCallTimer % 60).toString().padStart(2, '0')}
                </div>
              )}
            </div>

            {/* Middle Avatar / Wave Animation */}
            <div className="my-8 flex flex-col items-center">
              <div
                className={`w-28 h-28 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center text-4xl shadow-xl ${
                  isFakeCallRinging ? 'animate-bounce' : 'animate-pulse'
                }`}
              >
                👤
              </div>
              {isFakeCallAnswered && (
                <p className="text-xs text-slate-400 text-center mt-4 max-w-xs italic">
                  "Beta, I'm waiting outside the gate in the car with headlights on, come immediately..."
                </p>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="w-full pb-4">
              {isFakeCallRinging ? (
                <div className="flex items-center justify-around w-full">
                  <button
                    onClick={endFakeCall}
                    className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg transition"
                  >
                    <PhoneCall className="w-7 h-7 rotate-[135deg]" />
                  </button>
                  <button
                    onClick={answerFakeCall}
                    className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-lg transition animate-pulse"
                  >
                    <PhoneCall className="w-7 h-7" />
                  </button>
                </div>
              ) : (
                <div className="flex justify-center">
                  <button
                    onClick={endFakeCall}
                    className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg transition"
                  >
                    <PhoneCall className="w-7 h-7 rotate-[135deg]" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
