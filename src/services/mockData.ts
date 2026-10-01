import { CommunityResponder, SafeHavenZone, FakeCallScenario, LocationCoordinate } from '../types';

export const GOA_LOCATIONS: LocationCoordinate[] = [
  {
    name: 'GEC Farmagudi Campus, Ponda',
    landmark: 'Civil Engineering Dept / Hostel Quad',
    lat: 15.4227,
    lng: 74.0089,
  },
  {
    name: 'Ponda Old Bus Stand & Market',
    landmark: 'Near Tisk Junction',
    lat: 15.4026,
    lng: 74.0152,
  },
  {
    name: 'Miramar Beach & Coastal Promenade, Panjim',
    landmark: 'Near Youth Hostel',
    lat: 15.4862,
    lng: 73.8078,
  },
  {
    name: 'Calangute Tourist Belt & Beach',
    landmark: 'North Goa Coastal Police Outpost',
    lat: 15.5439,
    lng: 73.7553,
  },
  {
    name: 'Goa Medical College (GMC), Bambolim',
    landmark: 'Emergency Trauma Ward Gate',
    lat: 15.4619,
    lng: 73.8560,
  },
  {
    name: 'Margao Railway Station Junction',
    landmark: 'Platform 1 South Goa Exit',
    lat: 15.2736,
    lng: 73.9582,
  },
  {
    name: 'Khandepar - Curti Hill Stretch',
    landmark: 'Isolated Highway Curve',
    lat: 15.4295,
    lng: 74.0321,
  }
];

export const INITIAL_RESPONDERS: CommunityResponder[] = [
  {
    id: 'resp-1',
    name: 'Rohan Naik',
    role: 'Campus Security',
    phone: '+91 98221 44512',
    lat: 15.4235,
    lng: 74.0098,
    currentStatus: 'available',
    rating: 4.9,
    distanceKm: 0.2,
    etaMinutes: 2,
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces'
  },
  {
    id: 'resp-2',
    name: 'Dr. Shruti Sawant',
    role: 'EMT Volunteer',
    phone: '+91 97645 88210',
    lat: 15.4215,
    lng: 74.0062,
    currentStatus: 'available',
    rating: 5.0,
    distanceKm: 0.4,
    etaMinutes: 3,
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1594824813627-81d3f9b2d398?w=100&h=100&fit=crop&crop=faces'
  },
  {
    id: 'resp-3',
    name: 'Jared Furtado',
    role: 'Student Guardian',
    phone: '+91 98230 11984',
    lat: 15.4248,
    lng: 74.0112,
    currentStatus: 'available',
    rating: 4.8,
    distanceKm: 0.6,
    etaMinutes: 4,
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces'
  },
  {
    id: 'resp-4',
    name: 'Head Constable Parab',
    role: 'Goa Police Cadet',
    phone: '+91 94220 33451',
    lat: 15.4180,
    lng: 74.0120,
    currentStatus: 'available',
    rating: 4.9,
    distanceKm: 1.1,
    etaMinutes: 5,
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces'
  },
  {
    id: 'resp-5',
    name: 'Aniket Vernekar',
    role: 'Local Resident',
    phone: '+91 98812 77432',
    lat: 15.4050,
    lng: 74.0140,
    currentStatus: 'available',
    rating: 4.7,
    distanceKm: 1.8,
    etaMinutes: 7,
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop&crop=faces'
  }
];

export const SAFE_HAVENS: SafeHavenZone[] = [
  {
    id: 'sh-1',
    name: 'GEC Main Security Control Gate',
    type: 'campus_post',
    lat: 15.4222,
    lng: 74.0075,
    description: '24/7 Security Booth with CCTV & emergency intercom',
    open24x7: true,
    contactNumber: '0832-2399100'
  },
  {
    id: 'sh-2',
    name: 'Ponda Sub-District Hospital',
    type: 'hospital',
    lat: 15.4060,
    lng: 74.0180,
    description: 'Full emergency casualty, 4 ICU beds, trauma triage',
    open24x7: true,
    contactNumber: '0832-2312225'
  },
  {
    id: 'sh-3',
    name: 'Ponda Police Station (Control Room)',
    type: 'police',
    lat: 15.4010,
    lng: 74.0165,
    description: 'Goa Police 112 emergency squad base station',
    open24x7: true,
    contactNumber: '0832-2312121'
  },
  {
    id: 'sh-4',
    name: 'Farmagudi 24x7 Fuel Station & Store',
    type: 'safe_business',
    lat: 15.4280,
    lng: 74.0105,
    description: 'Well-lit convenience zone with staff on duty',
    open24x7: true
  },
  {
    id: 'sh-5',
    name: 'Calangute Rocky Outcrop (Rip Current Zone)',
    type: 'rip_current_danger',
    lat: 15.5460,
    lng: 73.7540,
    description: 'High hazard rip current alert! Red flag zone',
    open24x7: false
  }
];

export const FAKE_CALL_SCENARIOS: FakeCallScenario[] = [
  {
    id: 'fc-father',
    title: 'Dad Calling',
    callerName: 'Dad (Home)',
    callerNumber: '+91 98221 00214',
    dialogueScript: [
      'Beta, where are you? I have reached outside the gate in the car.',
      'Are you coming right now? Come to the car, headlights are on.',
      'Hurry up, I am waiting right here outside.'
    ]
  },
  {
    id: 'fc-police',
    title: 'Police PCR Patrol',
    callerName: 'Goa Police Patrol Unit 4',
    callerNumber: '112-GOA-PCR',
    dialogueScript: [
      'This is PCR Van 4 on patrol duty near your junction.',
      'We are monitoring the CCTV feed. Are you safe?',
      'Stay right where you are, our vehicle is turning into your lane in 30 seconds.'
    ]
  },
  {
    id: 'fc-friend',
    title: 'Friend / Roommate',
    callerName: 'Sanika (Hostel)',
    callerNumber: '+91 94033 12908',
    dialogueScript: [
      'Hey! Where are you stuck? We are all waiting at the canteen entrance.',
      'We are walking over towards your path now. See you in a minute!'
    ]
  }
];
