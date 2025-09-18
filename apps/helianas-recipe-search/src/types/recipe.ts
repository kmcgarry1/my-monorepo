export type Component = {
  type: string
  metatag: string
  component: string
}

export type Metadata = {
  type: string
  valueGp: number | null
  rarity: 'common' | 'uncommon' | 'rare' | 'very_rare' | 'legendary' | 'artifact' | 'other' | ''
  attunement: boolean | null
  attunementNote?: string
}

export type Recipe = {
  id: string
  page?: number | null
  name: string
  metadata: Metadata
  components: Component[]
  notes?: string
  tags?: string[]
}

export type RecipeData = {
  source?: string
  version: number
  recipes: Recipe[]
}

