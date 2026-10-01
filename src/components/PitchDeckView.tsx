import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  Award,
  Cpu,
  Users,
  Compass,
  CheckCircle2,
  Lock,
  Target,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

export const PitchDeckView: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const slides = [
    {
      badge: 'SANKALP SETU 2026 • GEC INSTITUTION ROUND',
      title: 'SafeSphere: AI-Powered Personal Safety & Community Emergency Response Mesh',
      subtitle: 'Seva Sankalp Abhiyan — Engage • Empower • Innovate • Implement',
      points: [
        'Team: Raksham (RD), Gangavarapu Kaarthikeya, Prathamesh Naik',
        'Institution: Goa College of Engineering (GEC), Farmagudi, Ponda',
        'Theme: Safety, Disaster Management & Community Resilience (Track 7)',
        'Core Objective: Rapid 3-minute crowdsourced first-response mesh powered by Edge AI and Goa 112 integration.'
      ],
      footerNote: 'Bridging the critical 15-minute emergency response gap in Goa.'
    },
    {
      badge: 'EVALUATION PILLAR 1 • 25 POINTS',
      title: 'Public-Service Challenge in Goa: The 15-Minute Response Gap',
      subtitle: 'Why current emergency systems fail in vulnerable Goan terrains',
      points: [
        'Geographic Vulnerability: Isolated stretches across Ponda hills, Western Ghat curves, and sprawling campus areas like GEC Farmagudi have scarce lighting and sporadic patrols.',
        'The Response Lag: While Goa Police 112 & 108 Ambulances do their best, peak traffic or rural terrain results in 15–25 minute arrival times.',
        'Victim Freeze Paradox: During real assaults or medical shocks, unlocking a phone, opening dial pads, and dictating GPS landmarks is nearly impossible.',
        'High-Risk Demographics: 25,000+ collegiate students traveling late evening, millions of tourists on coastal beaches facing rip currents, and solitary workers.'
      ],
      footerNote: 'Target: Reduce emergency response time from 18 minutes to under 3.5 minutes.'
    },
    {
      badge: 'EVALUATION PILLAR 2 • 20 POINTS',
      title: 'Innovation & Responsible AI: Multi-Modal Distress Intelligence',
      subtitle: 'Beyond passive tracking — Active real-time AI threat evaluation',
      points: [
        'Edge Vocal Distress Listener: In-browser Web Speech AI running locally listening for distress keywords ("Help me", "Bachao", "Emergency") without sending continuous audio streams to external servers.',
        'Contextual NLP Threat Triage: Instant classification of incident severity (Critical Code Red, Blue Medical, Amber Caution) factoring ambient sound, battery drain rate, time of day, and geographic isolation.',
        'Anti-Harassment Fake Call Shield: AI automated voice dialogue synthesizer that simulates convincing incoming rescue calls ("Dad outside in car") enabling safe de-escalation and escape.',
        'Smart Virtual Escort (SafeWalk): AI countdown companion that monitors journey legs and auto-triggers escalation if user goes dark.'
      ],
      footerNote: 'Real-time contextual triage instead of noisy false-positive alarms.'
    },
    {
      badge: 'EVALUATION PILLAR 3 • 25 POINTS',
      title: 'Three-Tier Prototype Architecture & Feasibility',
      subtitle: 'Engineered for zero-latency, high reliability, and zero-internet fallback',
      points: [
        'Tier 1 — Citizen / Student Companion: 1-Tap SOS with 3s abort timer, dual-frequency 100dB audio deterrent siren, zero-internet encrypted SMS dispatch with exact GPS coordinates.',
        'Tier 2 — Sankalp Setu Guardian Network: Verified civilian mesh (campus marshals, NSS volunteers, taxi operators, local residents) alerted within 500m–2km geofence.',
        'Tier 3 — Command & Control Tactical Dashboard: Real-time Leaflet GIS ops center for Goa Police / GEC Security with live threat meters, responder dispatching, and audit trails.',
        'Cross-Mesh Sync: Real-time broadcast channel architecture synchronizing victims, responders, and dispatchers simultaneously.'
      ],
      footerNote: 'Fully functional working prototype with instant live demonstration.'
    },
    {
      badge: 'EVALUATION PILLAR 4 • 15 POINTS',
      title: 'Scalability & Adoption: Roadmap for Goa',
      subtitle: 'Path to statewide deployment across educational & public bodies',
      points: [
        'Higher Education Pilot: Immediate deployment across Goa College of Engineering (GEC), Goa University, and affiliated colleges for student transit safety.',
        'Goa 112 & Drishti Marine Integration: Webhook API gateway forwarding structured incident packets with geocoded coordinates directly into State ERSS (Emergency Response Support System).',
        'Village Panchayat & Shack Union Mesh: Onboarding local shack staff, coastal shacks, and taxi unions as verified tourist safety champions.',
        'Low Infrastructure Cost: Zero proprietary hardware required — runs on existing student smartphones and control room web browsers.'
      ],
      footerNote: 'Minimal municipal expenditure, maximum community empowerment.'
    },
    {
      badge: 'EVALUATION PILLAR 5 • 10 POINTS',
      title: 'Responsible AI, Privacy & Ethics',
      subtitle: 'Zero citizen surveillance, high integrity, and strict ethical guardrails',
      points: [
        'Zero Passive Tracking: User location is ONLY accessed and broadcasted during an explicit active SOS or opted-in SafeWalk session.',
        'Local Edge Processing: Audio distress recognition processes speech snippets entirely on device; no citizen voice recordings are stored or monetized.',
        'Anti-Prank & Reputation Scoring: 3-second abort window prevents accidental triggers; repeat false alarms are penalized via verified volunteer confirmation.',
        'Synthetic Compliance: Prototype runs exclusively on synthetic test data, compliant with Hackathon Code of Conduct and DPDP Act 2023.'
      ],
      footerNote: 'Safety and human dignity without compromising digital privacy.'
    },
    {
      badge: 'EVALUATION PILLAR 6 • 5 POINTS',
      title: 'Implementation Roadmap & Team Execution',
      subtitle: 'From College Hackathon to Goa AI Conclave 2026',
      points: [
        'Phase 1 (Today — 1 Oct): College Round prototype demonstration and feature freeze at GEC.',
        'Phase 2 (5–12 Oct): Cluster Showcase at Ponda (Rajiv Gandhi Kala Mandir) with campus pilot validation.',
        'Phase 3 (13–16 Oct): Mentor compliance, API integration with Goa 112 mock dispatch server.',
        'Phase 4 (22–23 Oct): Goa AI Conclave Finale presentation with statewide deployment proposal.',
        'Team: Raksham (RD), Gangavarapu Kaarthikeya, Prathamesh Naik — Passionate GEC innovators building for Goa!'
      ],
      footerNote: 'Seva Sankalp Abhiyan — Engage • Empower • Innovate • Implement.'
    }
  ];

  const current = slides[currentSlide];

  return (
    <div className="space-y-6">
      {/* Presentation Controller Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">SafeSphere Official Hackathon Pitch Deck</h3>
            <div className="text-xs text-slate-400">
              Slide {currentSlide + 1} of {slides.length} • Tailored for 100-Point Evaluation Rubric
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
            className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 rounded-xl transition"
            title="Previous Slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-1.5 px-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === idx ? 'w-6 bg-purple-500' : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
            disabled={currentSlide === slides.length - 1}
            className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 rounded-xl transition"
            title="Next Slide"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Slide Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-md min-h-[480px] flex flex-col justify-between">
        {/* Glow Effects */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div>
          <div className="inline-block bg-purple-950/80 border border-purple-800/80 text-purple-300 font-mono text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            {current.badge}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            {current.title}
          </h2>

          <p className="text-sm sm:text-base font-medium text-slate-300 mt-2">
            {current.subtitle}
          </p>
        </div>

        {/* Bullet Points */}
        <div className="my-8 space-y-4">
          {current.points.map((pt, idx) => (
            <div key={idx} className="flex items-start gap-3.5 bg-slate-950/60 border border-slate-800/80 p-3.5 rounded-2xl">
              <div className="w-6 h-6 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                {idx + 1}
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
                {pt}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-2 text-purple-300 font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{current.footerNote}</span>
          </div>

          <div className="font-mono text-slate-500 text-[11px]">
            Goa College of Engineering • SANKALP SETU 2026
          </div>
        </div>
      </div>
    </div>
  );
};
