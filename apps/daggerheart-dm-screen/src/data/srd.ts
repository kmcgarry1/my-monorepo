export interface SRDCondition {
  name: string;
  effect: string;
}

export interface SRDChallengeRating {
  label: string;
  targetNumber: number;
  notes: string;
}

export interface SRDDomain {
  name: string;
  description: string;
}

export const conditions: SRDCondition[] = [
  { name: 'Bleeding', effect: 'You lose 1 Vitality at the end of each of your turns until the condition is cleared.' },
  { name: 'Confused', effect: 'You cannot aid allies and Disadvantage applies to rolls that require focus or precision.' },
  { name: 'Dazed', effect: 'You can only take one action on your turn and you grant Advantage to attackers adjacent to you.' },
  { name: 'Exhausted', effect: 'You suffer Disadvantage on physical actions and reduce your Guard by 1.' },
  { name: 'Grappled', effect: 'Your Speed becomes 0 and leaving the grappler\'s reach requires a Challenge roll.' },
  { name: 'Shaken', effect: 'You cannot gain Momentum and you roll with Disadvantage on social actions.' },
  { name: 'Staggered', effect: 'You cannot take reactions and you lose any held Momentum.' },
  { name: 'Stunned', effect: 'You drop whatever you are holding, cannot move, and fail Strength and Grace Challenges.' }
];

export const challengeRatings: SRDChallengeRating[] = [
  { label: 'Routine', targetNumber: 6, notes: 'Tasks common to professional adventurers.' },
  { label: 'Risky', targetNumber: 10, notes: 'Consequences loom but with good odds of success.' },
  { label: 'Perilous', targetNumber: 14, notes: 'Requires planning, tools, or luck to avoid danger.' },
  { label: 'Heroic', targetNumber: 18, notes: 'Pushes the limits of mortal ability.' },
  { label: 'Legendary', targetNumber: 22, notes: 'Impossible for the unprepared or unlucky.' }
];

export const domains: SRDDomain[] = [
  { name: 'Strength', description: 'Force, might, athletics, and raw physical power.' },
  { name: 'Grace', description: 'Agility, acrobatics, reflexes, and speed.' },
  { name: 'Wits', description: 'Lore, deduction, investigation, and instinct.' },
  { name: 'Spirit', description: 'Magic, empathy, willpower, and divine influence.' },
  { name: 'Heart', description: 'Presence, leadership, inspiration, and connections.' }
];

export const damageTypes = [
  'Keen',
  'Brutal',
  'Elemental',
  'Psychic',
  'Radiant',
  'Shadow'
];

export const progressTracks = [
  { name: 'Tension', description: 'Measures rising stakes or looming threats in a scene.' },
  { name: 'Time', description: 'Counts down to a deadline, ritual, or cataclysm.' },
  { name: 'Discovery', description: 'Tracks breakthroughs when researching or solving mysteries.' },
  { name: 'Influence', description: 'Captures a faction\'s attitude or political leverage.' }
];

export const boonExamples = [
  { title: 'Blessing of the Dawnforge', detail: '+1 Guard until you next take a Full Rest.' },
  { title: 'Seer\'s Glimpse', detail: 'Hold 1 Momentum you can spend on any roll before the next sunrise.' },
  { title: 'Stormbrand Echo', detail: 'Your next Keen or Elemental attack deals +2 damage.' }
];

export const consequenceExamples = [
  { title: 'Armor Sundered', detail: 'Reduce Guard by 2 until repaired.' },
  { title: 'Arcane Backlash', detail: 'Suffer 2 Stress and become Dazed until the end of your next turn.' },
  { title: 'Frightened Witnesses', detail: 'Lose 1 Influence in the current settlement.' }
];
