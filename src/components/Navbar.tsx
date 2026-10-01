import React, { useState, useEffect } from 'react';
import {
  Shield,
  Smartphone,
  Radio,
  Presentation,
  AlertTriangle,
  Award,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { incidentStore } from '../services/incidentStore';
import { EmergencyIncident } from '../types';

export type ActiveTab = 'victim' | 'responder' | 'control' | 'pitch';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const [activeIncidentCount, setActiveIncidentCount] = useState<number>(0);

  useEffect(() => {
    const update = () => {
      const active = incidentStore.getIncidents().filter((i) => i.status !== 'resolved');
      setActiveIncidentCount(active.length);
    };
    update();
    const unsubscribe = incidentStore.subscribe(update);
    return () => unsubscribe();
  }, []);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'victim',
      label: 'Citizen Companion',
      icon: <Smartphone className="w-4 h-4" />,
    },
    {
      id: 'responder',
      label: 'Setu Guardians',
      icon: <Shield className="w-4 h-4" />,
    },
    {
      id: 'control',
      label: 'Command Center',
      icon: <Radio className="w-4 h-4" />,
      badge: activeIncidentCount > 0 ? `${activeIncidentCount}` : undefined,
    },
    {
      id: 'pitch',
      label: 'Pitch Deck & Jury',
      icon: <Presentation className="w-4 h-4" />,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Hackathon Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-red-600/30 font-bold border border-red-400/40">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">SafeSphere</span>
                <span className="text-[10px] font-bold bg-red-950/80 text-red-400 border border-red-800/80 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  GOA MESH
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                Sankalp Setu • Goa College of Engineering (GEC)
              </div>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`relative px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-red-600 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Team Tag */}
          <div className="flex items-center gap-2.5">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-[11px] font-bold text-slate-200">Team SafeSphere</span>
              <span className="text-[10px] text-slate-400">Raksham • Kaarthikeya • Prathamesh</span>
            </div>

            <div className="p-1.5 bg-slate-900 rounded-xl border border-slate-800 text-amber-400 flex items-center gap-1 text-xs font-bold">
              <Award className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Track 7</span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800/60 overflow-x-auto gap-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex-1 py-1.5 px-2 rounded-xl text-[11px] font-bold flex flex-col items-center gap-1 transition ${
                  isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
