import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { EmergencyIncident, CommunityResponder, SafeHavenZone } from '../types';
import { Shield, AlertCircle, Phone, Navigation } from 'lucide-react';

interface EmergencyMapProps {
  incidents: EmergencyIncident[];
  responders: CommunityResponder[];
  safeHavens: SafeHavenZone[];
  center?: [number, number];
  zoom?: number;
  highlightIncidentId?: string;
}

// Controller component to smoothly fly map to active target
const MapViewController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
};

// Create custom DOM HTML Leaflet icons with slick glowing rings
const createVictimIcon = (severity: string, isPulsing = true) => {
  const color = severity === 'critical' ? '#ef4444' : severity === 'high' ? '#f97316' : '#eab308';
  return L.divIcon({
    className: 'custom-sos-marker',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px;">
        ${isPulsing ? `<div style="position: absolute; width: 44px; height: 44px; border-radius: 9999px; background: ${color}; opacity: 0.35; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>` : ''}
        <div style="width: 32px; height: 32px; border-radius: 9999px; background: ${color}; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; box-shadow: 0 0 15px ${color}; border: 2px solid white; z-index: 2;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22],
  });
};

const createResponderIcon = (role: string, isResponding: boolean) => {
  const bg = isResponding ? '#2563eb' : '#059669';
  return L.divIcon({
    className: 'custom-responder-marker',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px;">
        ${isResponding ? `<div style="position: absolute; width: 36px; height: 36px; border-radius: 9999px; background: ${bg}; opacity: 0.4; animation: ping 2s infinite;"></div>` : ''}
        <div style="width: 28px; height: 28px; border-radius: 9999px; background: ${bg}; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; box-shadow: 0 0 10px rgba(0,0,0,0.5); border: 2px solid white; z-index: 2;" title="${role}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        </div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

const createHavenIcon = (type: string) => {
  const bg = type === 'police' ? '#1e40af' : type === 'hospital' ? '#dc2626' : '#15803d';
  return L.divIcon({
    className: 'custom-haven-marker',
    html: `
      <div style="width: 24px; height: 24px; border-radius: 6px; background: ${bg}; display: flex; align-items: center; justify-content: center; color: white; border: 1.5px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.4);">
        <span style="font-size: 11px; font-weight: 800;">${type === 'hospital' ? '+' : type === 'police' ? 'P' : 'H'}</span>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

export const EmergencyMap: React.FC<EmergencyMapProps> = ({
  incidents,
  responders,
  safeHavens,
  center = [15.4227, 74.0089], // GEC Farmagudi default
  zoom = 15,
  highlightIncidentId,
}) => {
  const activeIncidents = incidents.filter((i) => i.status !== 'resolved');

  return (
    <div className="w-full h-full min-h-[420px] rounded-xl overflow-hidden relative border border-slate-800 shadow-2xl">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <MapViewController center={center} zoom={zoom} />

        {/* High-contrast dark tile layer from OpenStreetMap / CartoDB */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> | OpenStreetMap'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Render Safe Havens */}
        {safeHavens.map((haven) => (
          <Marker
            key={haven.id}
            position={[haven.lat, haven.lng]}
            icon={createHavenIcon(haven.type)}
          >
            <Popup>
              <div className="text-slate-900 p-1">
                <div className="font-bold text-sm flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-600 inline" />
                  {haven.name}
                </div>
                <div className="text-xs text-slate-600 mt-1">{haven.description}</div>
                {haven.contactNumber && (
                  <div className="text-xs font-semibold text-blue-600 mt-1 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {haven.contactNumber}
                  </div>
                )}
                <div className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded mt-1.5 inline-block">
                  Verified Safe Haven 24/7
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render Responders */}
        {responders.map((resp) => (
          <Marker
            key={resp.id}
            position={[resp.lat, resp.lng]}
            icon={createResponderIcon(resp.role, resp.currentStatus === 'responding')}
          >
            <Popup>
              <div className="text-slate-900 p-1">
                <div className="font-bold text-sm flex items-center gap-1">
                  <span>{resp.name}</span>
                  {resp.verified && <span className="text-xs text-blue-500 font-bold">✓</span>}
                </div>
                <div className="text-xs text-slate-600 font-medium">{resp.role}</div>
                <div className="flex items-center gap-2 mt-1.5 text-xs">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    resp.currentStatus === 'responding' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {resp.currentStatus.toUpperCase()}
                  </span>
                  <span className="text-slate-500">★ {resp.rating}</span>
                </div>
                <div className="mt-2 text-xs font-mono text-slate-700">
                  {resp.phone}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render Active Incidents */}
        {activeIncidents.map((incident) => {
          const isSelected = incident.id === highlightIncidentId;
          return (
            <React.Fragment key={incident.id}>
              {/* Radar Geo-fence radius circle */}
              <Circle
                center={[incident.location.lat, incident.location.lng]}
                radius={isSelected ? 350 : 200}
                pathOptions={{
                  color: incident.severity === 'critical' ? '#ef4444' : '#f97316',
                  fillColor: incident.severity === 'critical' ? '#ef4444' : '#f97316',
                  fillOpacity: isSelected ? 0.22 : 0.12,
                  weight: isSelected ? 2 : 1,
                  dashArray: '4, 4'
                }}
              />
              <Marker
                position={[incident.location.lat, incident.location.lng]}
                icon={createVictimIcon(incident.severity, incident.status === 'active')}
              >
                <Popup>
                  <div className="text-slate-900 p-1 min-w-[200px]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-red-600 text-sm flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" /> {incident.type.toUpperCase()}
                      </span>
                      <span className="text-[10px] bg-red-100 text-red-700 px-1 rounded font-bold">
                        Score: {incident.aiThreatScore}%
                      </span>
                    </div>
                    <div className="font-semibold text-xs mt-1 text-slate-800">
                      {incident.victimName} ({incident.victimPhone})
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      {incident.location.name}
                    </div>
                    <div className="text-[11px] bg-slate-100 p-1.5 rounded mt-2 border border-slate-200">
                      <strong>AI Triage:</strong> {incident.threatAnalysis.actionRequired}
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-mono">Battery: {incident.batteryLevel}%</span>
                      <span className="font-bold text-blue-600 flex items-center gap-0.5">
                        <Navigation className="w-3 h-3" /> {incident.status}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* Floating Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 z-[1000] shadow-lg flex flex-col gap-1.5 pointer-events-auto">
        <div className="font-bold text-[11px] text-slate-400 uppercase tracking-wider mb-0.5">Map Legend</div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 ring-2 ring-red-400/50 animate-pulse"></div>
          <span>Active SOS Victim</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
          <span>Setu Community Guardian</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-emerald-700"></div>
          <span>Verified Safe Haven / Gate</span>
        </div>
      </div>
    </div>
  );
};
