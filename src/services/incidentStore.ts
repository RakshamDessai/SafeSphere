import { EmergencyIncident, EmergencyType, CommunityResponder, SafeWalkSession } from '../types';
import { GOA_LOCATIONS, INITIAL_RESPONDERS } from './mockData';

const INCIDENTS_KEY = 'safesphere_incidents';
const RESPONDERS_KEY = 'safesphere_responders';
const ACTIVE_INCIDENT_KEY = 'safesphere_active_user_incident';
const SAFEWALK_KEY = 'safesphere_safewalk';

export interface ThreatAnalysisResult {
  urgency: string;
  threatScore: number;
  actionRequired: string;
  detectedKeywords: string[];
  sentiment: string;
}

class IncidentStoreService {
  private channel: BroadcastChannel | null = null;
  private listeners: Array<() => void> = [];

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel('safesphere_sync_mesh');
      this.channel.onmessage = () => {
        this.notifyListeners();
      };
    }
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((l) => l());
  }

  private broadcastChange() {
    this.notifyListeners();
    try {
      this.channel?.postMessage({ type: 'SYNC_UPDATE', timestamp: Date.now() });
    } catch (e) {
      console.warn('Broadcast channel postMessage error:', e);
    }
  }

  getIncidents(): EmergencyIncident[] {
    const data = localStorage.getItem(INCIDENTS_KEY);
    if (!data) {
      // Seed with initial realistic scenario in Farmagudi
      const sampleIncident: EmergencyIncident = {
        id: 'INC-GOA-101',
        victimName: 'Ananya Sharma',
        victimPhone: '+91 98224 81729',
        location: GOA_LOCATIONS[0], // GEC Farmagudi Campus
        type: 'isolated_danger',
        severity: 'high',
        status: 'dispatched',
        timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
        aiThreatScore: 84,
        threatAnalysis: {
          urgency: 'HIGH PRIORITY',
          actionRequired: 'Dispatch Campus Security & alert nearest Student Guardian',
          detectedKeywords: ['alone in dark stretch', 'unregistered motorcycle circling', 'low phone battery'],
          sentiment: 'High Fear & Agitation'
        },
        audioTranscript: 'Someone is following near the electrical substation... lights are not working',
        batteryLevel: 22,
        assignedResponders: ['resp-1', 'resp-3'],
        notes: ['Campus Security unit en route with patrol torch', 'ETA 2 mins']
      };
      localStorage.setItem(INCIDENTS_KEY, JSON.stringify([sampleIncident]));
      return [sampleIncident];
    }
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  getActiveUserIncident(): EmergencyIncident | null {
    const data = localStorage.getItem(ACTIVE_INCIDENT_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  getResponders(): CommunityResponder[] {
    const data = localStorage.getItem(RESPONDERS_KEY);
    if (!data) {
      localStorage.setItem(RESPONDERS_KEY, JSON.stringify(INITIAL_RESPONDERS));
      return INITIAL_RESPONDERS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_RESPONDERS;
    }
  }

  // AI Threat Evaluation logic based on input parameters
  analyzeThreat(type: EmergencyType, transcript?: string, battery = 85): ThreatAnalysisResult {
    let score = 60;
    let urgency = 'MODERATE';
    let action = 'Notify nearby verified community volunteers';
    const detectedKeywords: string[] = [];
    let sentiment = 'Anxious';

    if (type === 'harassment') {
      score = 92;
      urgency = 'CRITICAL CODE RED';
      action = 'Immediate Police PCR Van 112 & nearest crowd guardian dispatch';
      detectedKeywords.push('stalker', 'intimidation', 'hostile encounter');
      sentiment = 'Severe Distress / Panic';
    } else if (type === 'medical') {
      score = 88;
      urgency = 'URGENT MEDICAL';
      action = 'Dispatch EMT Volunteer & Alert Ponda District Hospital Trauma team';
      detectedKeywords.push('cardiac / breathing difficulty', 'unresponsive', 'physical trauma');
      sentiment = 'Acute Physical Distress';
    } else if (type === 'accident') {
      score = 86;
      urgency = 'ROAD HAZARD / COLLISION';
      action = 'Alert Goa 108 Ambulance and traffic control unit';
      detectedKeywords.push('vehicle collision', 'road obstacle');
      sentiment = 'Shock / Disorientation';
    } else if (type === 'coastal_hazard') {
      score = 90;
      urgency = 'COASTAL RIP-CURRENT';
      action = 'Alert Drishti Marine Lifeguards and Coastal Police Outpost';
      detectedKeywords.push('drowning risk', 'high tide current');
      sentiment = 'Imminent Peril';
    } else {
      score = 75;
      urgency = 'HIGH PRECAUTIONARY';
      action = 'Dispatch Campus Night Patrol & Activate Safe Walk Monitor';
      detectedKeywords.push('isolated area', 'unlit pathway');
      sentiment = 'Heightened Apprehension';
    }

    if (transcript) {
      const lower = transcript.toLowerCase();
      if (lower.includes('help') || lower.includes('bachao')) {
        score = Math.min(100, score + 10);
        detectedKeywords.push('Vocal plea for rescue');
      }
      if (lower.includes('weapon') || lower.includes('knife') || lower.includes('blood')) {
        score = 99;
        urgency = 'EXTREME DANGER';
        detectedKeywords.push('Weapon / Bleeding mention');
      }
    }

    if (battery < 15) {
      score = Math.min(100, score + 8);
      detectedKeywords.push('Critical Battery Expiration Risk (<15%)');
    }

    return {
      threatScore: score,
      urgency,
      actionRequired: action,
      detectedKeywords,
      sentiment
    };
  }

  // Trigger New SOS
  triggerSOS(params: {
    victimName: string;
    victimPhone: string;
    type: EmergencyType;
    locationIndex: number;
    customLat?: number;
    customLng?: number;
    audioTranscript?: string;
    batteryLevel?: number;
  }): EmergencyIncident {
    const loc = GOA_LOCATIONS[params.locationIndex] || GOA_LOCATIONS[0];
    const finalLocation = {
      ...loc,
      lat: params.customLat ?? loc.lat,
      lng: params.customLng ?? loc.lng,
    };

    const battery = params.batteryLevel ?? Math.floor(Math.random() * 40) + 15;
    const analysis = this.analyzeThreat(params.type, params.audioTranscript, battery);

    // Pick top 2 closest responders automatically
    const responders = this.getResponders();
    const assignedIds = responders.slice(0, 2).map((r) => r.id);

    const newIncident: EmergencyIncident = {
      id: `SOS-GOA-${Math.floor(1000 + Math.random() * 9000)}`,
      victimName: params.victimName || 'GEC Student',
      victimPhone: params.victimPhone || '+91 98221 55678',
      location: finalLocation,
      type: params.type,
      severity: analysis.threatScore > 85 ? 'critical' : analysis.threatScore > 70 ? 'high' : 'moderate',
      status: 'active',
      timestamp: new Date().toISOString(),
      aiThreatScore: analysis.threatScore,
      threatAnalysis: analysis,
      audioTranscript: params.audioTranscript || 'Instant One-Touch Panic Activation',
      batteryLevel: battery,
      assignedResponders: assignedIds,
      notes: [
        `Incident initiated at ${finalLocation.name}`,
        `AI Threat Engine evaluated score: ${analysis.threatScore}/100`,
        `Automated SOS Broadcast sent to Goa 112 & Community Mesh`
      ]
    };

    const incidents = [newIncident, ...this.getIncidents()];
    localStorage.setItem(INCIDENTS_KEY, JSON.stringify(incidents));
    localStorage.setItem(ACTIVE_INCIDENT_KEY, JSON.stringify(newIncident));

    // Update assigned responders status
    const updatedResponders = responders.map((r) => {
      if (assignedIds.includes(r.id)) {
        return { ...r, currentStatus: 'responding' as const };
      }
      return r;
    });
    localStorage.setItem(RESPONDERS_KEY, JSON.stringify(updatedResponders));

    this.broadcastChange();
    return newIncident;
  }

  // Cancel or resolve active SOS
  resolveIncident(incidentId: string, resolutionNote = 'Resolved safely by verified guardian') {
    const incidents = this.getIncidents().map((inc) => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status: 'resolved' as const,
          notes: [...inc.notes, `Closed at ${new Date().toLocaleTimeString()}: ${resolutionNote}`]
        };
      }
      return inc;
    });
    localStorage.setItem(INCIDENTS_KEY, JSON.stringify(incidents));

    const active = this.getActiveUserIncident();
    if (active && active.id === incidentId) {
      localStorage.removeItem(ACTIVE_INCIDENT_KEY);
    }

    // Reset responders
    const responders = this.getResponders().map((r) => ({
      ...r,
      currentStatus: 'available' as const
    }));
    localStorage.setItem(RESPONDERS_KEY, JSON.stringify(responders));

    this.broadcastChange();
  }

  // Responder accepts assignment
  acceptIncidentByResponder(responderId: string, incidentId: string) {
    const incidents = this.getIncidents().map((inc) => {
      if (inc.id === incidentId) {
        const assigned = inc.assignedResponders.includes(responderId)
          ? inc.assignedResponders
          : [...inc.assignedResponders, responderId];
        return {
          ...inc,
          status: 'dispatched' as const,
          assignedResponders: assigned,
          notes: [...inc.notes, `Responder #${responderId} accepted call at ${new Date().toLocaleTimeString()}`]
        };
      }
      return inc;
    });
    localStorage.setItem(INCIDENTS_KEY, JSON.stringify(incidents));

    const responders = this.getResponders().map((r) => {
      if (r.id === responderId) {
        return { ...r, currentStatus: 'responding' as const };
      }
      return r;
    });
    localStorage.setItem(RESPONDERS_KEY, JSON.stringify(responders));

    this.broadcastChange();
  }

  // Safe Walk Session Controls
  getSafeWalk(): SafeWalkSession {
    const data = localStorage.getItem(SAFEWALK_KEY);
    if (!data) {
      return {
        isActive: false,
        destination: 'GEC Ladies Hostel Block 3',
        expectedMinutes: 10,
        startedAt: null,
        checkInDueAt: null,
        status: 'completed'
      };
    }
    try {
      return JSON.parse(data);
    } catch {
      return {
        isActive: false,
        destination: 'GEC Ladies Hostel Block 3',
        expectedMinutes: 10,
        startedAt: null,
        checkInDueAt: null,
        status: 'completed'
      };
    }
  }

  startSafeWalk(destination: string, minutes: number) {
    const now = new Date();
    const due = new Date(now.getTime() + minutes * 60 * 1000);
    const session: SafeWalkSession = {
      isActive: true,
      destination,
      expectedMinutes: minutes,
      startedAt: now.toISOString(),
      checkInDueAt: due.toISOString(),
      status: 'walking'
    };
    localStorage.setItem(SAFEWALK_KEY, JSON.stringify(session));
    this.broadcastChange();
  }

  endSafeWalk() {
    const session: SafeWalkSession = {
      isActive: false,
      destination: '',
      expectedMinutes: 0,
      startedAt: null,
      checkInDueAt: null,
      status: 'completed'
    };
    localStorage.setItem(SAFEWALK_KEY, JSON.stringify(session));
    this.broadcastChange();
  }
}

export const incidentStore = new IncidentStoreService();
