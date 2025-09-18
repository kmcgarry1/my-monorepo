import type { Enemy, Environment } from '../types'

export const AcidBurrower: Enemy = {
  kind: 'enemy',
  name: 'Acid Burrower',
  tier: 1,
  description: 'A horse-sized insect with digging claws and acidic blood.',
  traits: '',
  archetype: '',
  rank: 'Solo',
  difficulty: 14,
  thresholds: '8/15',
  hp: 8,
  stress: 3,
  atkBonus: 3,
  attacks: [
    { id: 1, name: 'Claws', range: 'Very Close', details: '1d12+2 phy' },
  ],
  experience: 'Tremor Sense +2',
  tactics: 'Burrow, drag away, feed, reposition',
  features: [
    {
      id: 2,
      name: 'Relentless (3)',
      tag: 'Passive',
      cost: '',
      text: 'The Burrower can be spotlighted up to three times per GM turn. Spend Fear as usual to spotlight them.'
    },
    {
      id: 3,
      name: 'Earth Eruption',
      tag: 'Action',
      cost: 'Mark Stress',
      text: 'The Burrower bursts out of the ground. All creatures within Very Close range must succeed on an Agility Reaction Roll or be knocked over, making them Vulnerable until they next act.'
    },
    {
      id: 4,
      name: 'Spit Acid',
      tag: 'Action',
      cost: 'Spend a Fear',
      text: 'Attack all targets in front of the Burrower within Close range. On success, targets take 2d6 physical damage and must mark an Armor Slot without receiving its benefits. If they can’t, they must mark an additional HP and you gain a Fear.'
    },
    {
      id: 5,
      name: 'Acid Bath',
      tag: 'Reaction',
      cost: 'Trigger: Severe damage taken',
      text: 'All creatures within Close range take 1d10 physical damage from acidic blood. The ground within Very Close is covered; creatures other than the Burrower who move through it take 1d6 physical damage.'
    }
  ]
}

export const RagingRiver: Environment = {
  kind: 'environment',
  name: 'Raging River',
  tier: 1,
  description: 'A swift-moving river without a bridge crossing, deep enough to sweep away most people.',
  traits: '',
  archetype: '',
  category: 'Traversal',
  difficulty: 10,
  impulses: 'Bar crossing, carry away the unready, divide the land',
  potential: 'Beasts (Bear, Glass Snake), Jagged Knife Bandits (Hexer, Kneebreaker, Lackey, Lieutenant, Shadow, Sniper)',
  prompts: [
    'Have any of the PCs forded rivers like this before? Are any of them afraid of drowning?',
    'What trinkets and baubles lie along the bottom of the riverbed? Do predators swim these rivers?',
    'What treasures does the beast have in their burrow? What travelers have already fallen victim to this predator?'
  ].join('\n\n'),
  features: [
    {
      id: 6,
      name: 'Dangerous Crossing',
      tag: 'Passive',
      cost: '',
      text: 'Crossing the river requires the party to complete a Progress Countdown (4). A PC who rolls a failure with Fear is immediately targeted by the “Undertow” action without requiring a Fear to be spent on the feature.'
    },
    {
      id: 7,
      name: 'Undertow',
      tag: 'Action',
      cost: 'Spend a Fear',
      text: 'Catch a PC in the undertow. They must make an Agility Reaction Roll. On a failure, they take 1d6+1 physical damage and are moved a Close distance down the river, becoming Vulnerable until they get out. On a success, they must mark a Stress.'
    },
    {
      id: 8,
      name: 'Patient Hunter',
      tag: 'Action',
      cost: 'Spend a Fear',
      text: 'Summon a Glass Snake within Close range of a chosen PC. It appears in or near the river and immediately takes the spotlight to use “Spinning Serpent”.'
    }
  ]
}

