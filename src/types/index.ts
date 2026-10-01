export type EmergencyType = 'harassment' | 'medical' | 'accident' | 'isolated_danger' | 'coastal_hazard';

export type EmergencySeverity = 'critical' | 'high' | 'moderate';

export type IncidentStatus = 'triggering' | 'active' | 'dispatched' | 'responder_on_scene' | 'resolved' | 'cancelled';

export interface LocationCoordinate {
  lat: number;
  lng: number;
  name: string;
  landmark?: string;
}

export interface EmergencyIncident {
  id: string;
  victimName: string;
  victimPhone: string;
  location: LocationCoordinate;
  type: EmergencyType;
  severity: EmergencySeverity;
  status: IncidentStatus;
  timestamp: string;
  aiThreatScore: number; // 0 - 100
  threatAnalysis: {
    urgency: string;
    actionRequired: string;
    detectedKeywords: string[];
    sentiment: string;
  };
  audioTranscript?: string;
  batteryLevel: number;
  assignedResponders: string[]; // Responder IDs
  notes: string[];
}

export interface CommunityResponder {
  id: string;
  name: string;
  role: 'Campus Security' | 'Student Guardian' | 'Local Resident' | 'EMT Volunteer' | 'Goa Police Cadet';
  phone: string;
  lat: number;
  lng: number;
  currentStatus: 'available' | 'responding' | 'offline';
  rating: number;
  distanceKm?: number;
  etaMinutes?: number;
  verified: boolean;
  avatar: string;
}

export interface SafeHavenZone {
  id: string;
  name: string;
  type: 'police' | 'hospital' | 'campus_post' | 'safe_business' | 'rip_current_danger';
  lat: number;
  lng: number;
  description: string;
  open24x7: boolean;
  contactNumber?: string;
}

export interface SafeWalkSession {
  isActive: boolean;
  destination: string;
  expectedMinutes: number;
  startedAt: string | null;
  checkInDueAt: string | null;
  status: 'walking' | 'warning' | 'alert_triggered' | 'completed';
}

export interface FakeCallScenario {
  id: string;
  title: string;
  callerName: string;
  callerNumber: string;
  dialogueScript: string[];
}
