export interface NPCArchetype {
  name: string;
  role: string;
  specialty: string;
}

export interface LoomingThreat {
  name: string;
  omens: string[];
}

export const heroCallings = [
  'Beacon of the Free',
  'Chronicle Seeker',
  'Dawnblade Adept',
  'Oathbound Protector',
  'Stormmarked',
  'Veilwalker'
];

export const heroOrigins = [
  'Fugitive from the Coalition',
  'Scion of the Dawnforge',
  'Village Thornspeaker',
  'Sky-Sail Cartographer',
  'Traveling Hearthwarden',
  'Reformed Shadowbinder'
];

export const npcArchetypes: NPCArchetype[] = [
  { name: 'Archivist of the Echo Vault', role: 'Sage', specialty: 'Secrets of lost civilizations and extraplanar bargains.' },
  { name: 'Glimmerstreet Broker', role: 'Fixer', specialty: 'Information trading and smuggling relics through city wards.' },
  { name: 'Tidebound Warden', role: 'Guardian', specialty: 'Protects coastal communities from abyssal horrors.' },
  { name: 'Ironroot Envoy', role: 'Diplomat', specialty: 'Negotiates uneasy truces between the Verdant Courts.' },
  { name: 'Starfall Skald', role: 'Bard', specialty: 'Chronicles heroes and can sway crowds with cosmic ballads.' }
];

export const loomingThreats: LoomingThreat[] = [
  {
    name: 'The Withered Choir',
    omens: [
      'Chilling harmonies drifting through empty streets at dusk.',
      'Shrines found draped in desiccated vines that whisper in the wind.',
      'Dreams of silver eyes watching from the rafters of every home.'
    ]
  },
  {
    name: 'The Emberfall Compact',
    omens: [
      'Coal branded sigils appearing on doorways overnight.',
      'Rumors of mercenary battalions that do not sleep.',
      'A crimson comet smearing the horizon for seven nights.'
    ]
  },
  {
    name: 'Hunger of the Deep Hour',
    omens: [
      'Timepieces slipping seconds during the witching hour.',
      'Echoing footsteps following travelers along empty roads.',
      'A wellspring of ink-black water seeping up through cobblestones.'
    ]
  }
];

export const complicationPrompts = [
  'What rumor reaches the heroes at the worst possible time?',
  'Which ally demands a costly favor in the middle of the mission?',
  'How does the environment suddenly become treacherous?',
  'Who remembers the heroes from a previous disaster?'
];

export const treasureDiscoveries = [
  'Resonant gemstone storing a spell of your choice.',
  'Tideglass compass that points toward the nearest portal.',
  'Singing blade that hums louder when Momentum is high.',
  'Bundle of duskpetal draughts that restore 3 Vitality.'
];
