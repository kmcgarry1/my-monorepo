export type Base = {
  name: string
  tier: number | null
  description: string
  traits: string
  archetype: string
}

export type Attack = { id: number; name: string; range: string; details: string }

export type FeatureTag = 'Passive' | 'Action' | 'Reaction'
export type Feature = { id: number; name: string; tag: FeatureTag; cost?: string; text: string }

export type Enemy = Base & {
  kind: 'enemy'
  rank: 'Minion' | 'Standard' | 'Elite' | 'Boss' | 'Solo' | ''
  difficulty: number | null
  thresholds: string
  hp: number | null
  stress: number | null
  atkBonus: number | null
  attacks: Attack[]
  experience: string
  tactics: string
  features: Feature[]
}

export type Environment = Base & {
  kind: 'environment'
  category: 'Traversal' | 'Hazard' | 'Encounter' | ''
  difficulty: number | null
  impulses: string
  potential: string
  prompts: string
  features: Feature[]
}

