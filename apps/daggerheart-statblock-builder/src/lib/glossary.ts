export type GlossaryEntry = {
  id: string
  title: string
  description: string
  aliases?: string[]
}

export const GLOSSARY: GlossaryEntry[] = [
  {
    id: 'attack',
    title: 'Attack',
    description:
      'An action to harm a target. Attacks list a range band and the effect (often damage dice). The GM sets difficulty; PCs or adversaries roll accordingly.',
    aliases: ['attacks'],
  },
  {
    id: 'range',
    title: 'Range Bands',
    description:
      'Common bands include Very Close (melee), Close (nearby), Far (across a room/field), and Distant (farther away). Features and attacks specify which band applies.',
    aliases: ['range band', 'very close', 'close', 'far', 'distant'],
  },
  {
    id: 'dice',
    title: 'Dice / Damage Notation',
    description:
      'Use NdX+Y format (e.g., 1d6, 2d8+2). Daggerheart features and attacks often use physical (phy) or other damage tags. Example: 1d12+2 phy.',
    aliases: ['damage', 'roll', 'dice notation'],
  },
  {
    id: 'thresholds',
    title: 'Thresholds',
    description:
      'Stage/Severe thresholds indicated as A/B (e.g., 8/15). Meeting or exceeding these values escalates results per the SRD.',
    aliases: ['stage', 'severe'],
  },
  {
    id: 'stress',
    title: 'Stress',
    description:
      'Represents mounting pressure on an adversary or the environment. Some features require marking Stress as a cost.',
  },
  {
    id: 'fear',
    title: 'Fear',
    description:
      'A GM resource spent to spotlight adversaries or trigger powerful features. Some features require spending a Fear.',
  },
  {
    id: 'spotlight',
    title: 'Spotlight',
    description:
      'Spotlighting allows an adversary to act during the GM turn. Some features modify how often an adversary can be spotlighted.',
  },
  {
    id: 'vulnerable',
    title: 'Vulnerable',
    description:
      'A condition that leaves a target exposed until they act again, often applied by knockdown or control effects.',
  },
  {
    id: 'progress-countdown',
    title: 'Progress Countdown',
    description:
      'Tracks progress toward a goal as a small clock (e.g., (4)). On failures with Fear, some features may trigger immediate consequences.',
    aliases: ['countdown'],
  },
  {
    id: 'action',
    title: 'Action',
    description:
      'A feature used on the user\'s spotlight to do something significant (attack, move, create effect). Some actions require a cost like spending Fear or marking Stress.',
    aliases: ['actions'],
  },
  {
    id: 'reaction',
    title: 'Reaction',
    description:
      'A feature that triggers in response to a condition (e.g., taking Severe damage). Reactions do not require taking the spotlight unless stated.',
    aliases: ['reactions'],
  },
  {
    id: 'passive',
    title: 'Passive',
    description:
      'A feature that is always on or modifies rules continuously (e.g., additional spotlight uses).',
    aliases: ['passives'],
  },
  {
    id: 'environment-category',
    title: 'Environment Category',
    description:
      'Broad grouping for environments: Traversal (obstacles/terrain), Hazard (ongoing danger), Encounter (interactive threat or challenge).',
    aliases: ['category'],
  },
  {
    id: 'impulses',
    title: 'Impulses',
    description:
      'Short statements that describe how an environment behaves or escalates (e.g., Bar crossing, carry away the unready).',
    aliases: ['impulse'],
  },
  {
    id: 'potential-adversaries',
    title: 'Potential Adversaries',
    description:
      'Examples of foes that may appear in or around the environment. Use as inspiration when escalating scenes.',
    aliases: ['adversaries', 'enemies'],
  },
  {
    id: 'gm-prompts',
    title: 'GM Prompts',
    description:
      'Questions to spark fiction and inform how the scene evolves. Use prompts to tailor the encounter to the party.',
    aliases: ['prompts'],
  },
  {
    id: 'difficulty',
    title: 'Difficulty',
    description:
      'Target number for rolls against this adversary or environment. Higher difficulty makes success less likely.',
  },
  {
    id: 'hp',
    title: 'Health (HP)',
    description:
      'Represents how much harm an adversary can take before being defeated or altered by features that trigger on damage thresholds.',
    aliases: ['health'],
  },
  {
    id: 'armor-slot',
    title: 'Armor Slot',
    description:
      'Represents protective gear that can be marked to reduce or absorb damage. Some effects force marking without benefit.',
    aliases: ['armor'],
  },
  {
    id: 'tactics',
    title: 'Motives & Tactics',
    description:
      'Brief notes on how an adversary acts: goals, movement, and priorities. Use to guide spotlight choices.',
    aliases: ['motives'],
  },
]

export function findEntries(query: string) {
  const q = query.trim().toLowerCase()
  if (!q) return GLOSSARY
  return GLOSSARY.filter(e =>
    e.title.toLowerCase().includes(q) ||
    e.description.toLowerCase().includes(q) ||
    (e.aliases || []).some(a => a.toLowerCase().includes(q))
  )
}
