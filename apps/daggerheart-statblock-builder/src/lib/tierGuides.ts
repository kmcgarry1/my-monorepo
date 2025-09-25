import type { Enemy, Environment } from '../types'

type EnemyRank = Exclude<Enemy['rank'], ''>
type EnvironmentCategory = Exclude<Environment['category'], ''>

type StatBand = { min: number; max: number; default: number; units?: string }

type EnemyTierDetails = {
  difficulty: StatBand
  hp: StatBand
  stress: StatBand
  atkBonus: StatBand
  thresholds: string
  experience: string
  tactics: string
  features: string
}

type EnvironmentTierDetails = {
  difficulty: StatBand
  impulses: string
  potential: string
  prompts: string
  features: string
}

export type TierGuide = {
  tier: number
  title: string
  summary: string
  enemyFocus: string
  environmentFocus: string
  enemy: Record<EnemyRank, EnemyTierDetails>
  environment: Record<EnvironmentCategory, EnvironmentTierDetails>
}

const tierGuides: TierGuide[] = [
  {
    tier: 0,
    title: 'Tier 0 — Novice Threats',
    summary:
      'Small, local threats that introduce rules and give new characters room to learn. Keep consequences pointed but survivable.',
    enemyFocus:
      'Leverage straightforward stat lines that showcase a single mechanic. Encourage teamwork rather than punishing mistakes.',
    environmentFocus:
      'Offer one clear obstacle or hazard that can be understood at a glance. Use clocks and costs sparingly.',
    enemy: {
      Minion: {
        difficulty: { min: 8, max: 10, default: 9 },
        hp: { min: 2, max: 3, default: 3 },
        stress: { min: 0, max: 1, default: 0 },
        atkBonus: { min: 0, max: 1, default: 1 },
        thresholds: 'Stage 3 / Severe 6',
        experience: 'Give a single memorable detail that reinforces the minion’s role in the scene.',
        tactics: 'Operate in small groups, helping spotlight the heroes’ moves more than threatening them outright.',
        features: 'One short passive or action that models a core mechanic (marking Stress, simple status, etc.).'
      },
      Standard: {
        difficulty: { min: 9, max: 11, default: 10 },
        hp: { min: 4, max: 5, default: 5 },
        stress: { min: 1, max: 1, default: 1 },
        atkBonus: { min: 1, max: 2, default: 2 },
        thresholds: 'Stage 5 / Severe 10',
        experience: 'Highlight how the foe interacts with a location or faction close to the PCs.',
        tactics: 'Lean on positioning tricks and teamwork with minions rather than raw damage.',
        features: 'Two simple options (often one action and one passive) that establish their specialty.'
      },
      Elite: {
        difficulty: { min: 10, max: 12, default: 11 },
        hp: { min: 6, max: 7, default: 7 },
        stress: { min: 1, max: 2, default: 2 },
        atkBonus: { min: 2, max: 3, default: 3 },
        thresholds: 'Stage 6 / Severe 12',
        experience: 'Reward bold plans—offer clues, leverage, or knowledge for interacting with higher tiers.',
        tactics: 'Introduce a notable defensive trick or way to escalate when the party hesitates.',
        features: 'Two to three options. Give them a signature move and a reaction or defensive tool.'
      },
      Boss: {
        difficulty: { min: 11, max: 13, default: 12 },
        hp: { min: 7, max: 9, default: 8 },
        stress: { min: 2, max: 3, default: 3 },
        atkBonus: { min: 2, max: 3, default: 3 },
        thresholds: 'Stage 7 / Severe 14',
        experience: 'Tie them directly to the heroes’ origin or a pressing local mystery.',
        tactics: 'Spotlight one big move that spends Fear or Stress to change the arena.',
        features: 'Three strong options. One should change the battlefield, one should punish clustered heroes.'
      },
      Solo: {
        difficulty: { min: 12, max: 14, default: 13 },
        hp: { min: 8, max: 10, default: 9 },
        stress: { min: 3, max: 4, default: 3 },
        atkBonus: { min: 3, max: 4, default: 4 },
        thresholds: 'Stage 8 / Severe 16',
        experience: 'Demonstrate how a single foe can drive an entire session, but still offer outs for clever play.',
        tactics: 'Give them tools to reposition heroes and weather a focus-fire assault.',
        features: 'Three to four moves. Mix in reactions that trigger on Stage or Severe thresholds.'
      }
    },
    environment: {
      Traversal: {
        difficulty: { min: 8, max: 10, default: 9 },
        impulses: 'Test movement and timing without overwhelming the group. Offer multiple approaches.',
        potential: 'Name two or three complications or denizens that might appear if things escalate.',
        prompts: 'Ask how the party prepared for similar journeys or what local guides warn about.',
        features: 'One feature with a short clock or single spend of Fear.'
      },
      Hazard: {
        difficulty: { min: 9, max: 11, default: 10 },
        impulses: 'Present a persistent pressure such as spreading fire or collapsing ground.',
        potential: 'Point to the next danger that might be unleashed if the PCs ignore it.',
        prompts: 'Invite players to describe safety measures or past close calls.',
        features: 'Two small features—one passive condition and one action to escalate.'
      },
      Encounter: {
        difficulty: { min: 10, max: 12, default: 11 },
        impulses: 'Reinforce why the scene matters right now: protect, evacuate, negotiate.',
        potential: 'List simple adversaries or twists that arrive when clocks advance.',
        prompts: 'Frame questions around NPC stakes and community fallout.',
        features: 'Two to three features. Keep costs gentle so the party learns pacing.'
      }
    }
  },
  {
    tier: 1,
    title: 'Tier 1 — Adventurer Threats',
    summary:
      'Established heroes protect regions or topple feared lieutenants. Threats hit harder and string together multiple mechanics.',
    enemyFocus:
      'Expect coordinated opponents with enough resilience to challenge a seasoned band. Fear becomes an explicit resource.',
    environmentFocus:
      'Layer hazards and branching consequences. Pressure the party to split attention or spend precious resources.',
    enemy: {
      Minion: {
        difficulty: { min: 11, max: 13, default: 12 },
        hp: { min: 3, max: 5, default: 4 },
        stress: { min: 0, max: 1, default: 1 },
        atkBonus: { min: 2, max: 3, default: 2 },
        thresholds: 'Stage 4 / Severe 8',
        experience: 'Show how the faction operates—gear, battle cries, or teamwork tactics.',
        tactics: 'Enable elites or bosses by pinning targets and fueling Fear spends.',
        features: 'One punchy action plus a passive bonus when near allied leaders.'
      },
      Standard: {
        difficulty: { min: 12, max: 14, default: 13 },
        hp: { min: 6, max: 8, default: 7 },
        stress: { min: 2, max: 3, default: 2 },
        atkBonus: { min: 3, max: 4, default: 3 },
        thresholds: 'Stage 6 / Severe 12',
        experience: 'Deliver information about the region, revealing new objectives or dangers.',
        tactics: 'Cycle between a reliable attack and a once-per-scene flourish that spends Fear.',
        features: 'Three options: a signature action, a defensive reaction, and a supportive passive.'
      },
      Elite: {
        difficulty: { min: 13, max: 15, default: 14 },
        hp: { min: 8, max: 10, default: 9 },
        stress: { min: 2, max: 3, default: 3 },
        atkBonus: { min: 4, max: 5, default: 4 },
        thresholds: 'Stage 8 / Severe 15',
        experience: 'Offer leverage or bargaining chips tied to the faction’s leadership.',
        tactics: 'Open with a scene-framing move, then pivot into calculated retreats or set pieces.',
        features: 'Three to four moves with at least one reaction. Encourage interplay with terrain.'
      },
      Boss: {
        difficulty: { min: 14, max: 16, default: 15 },
        hp: { min: 10, max: 12, default: 11 },
        stress: { min: 3, max: 4, default: 3 },
        atkBonus: { min: 4, max: 5, default: 4 },
        thresholds: 'Stage 9 / Severe 17',
        experience: 'Tie their defeat to a major narrative pivot or community reward.',
        tactics: 'Spend Fear to reshape the battlefield or summon reinforcements mid-fight.',
        features: 'Four features. Blend area control, summon or bolster effects, and a desperate reaction.'
      },
      Solo: {
        difficulty: { min: 15, max: 17, default: 16 },
        hp: { min: 12, max: 14, default: 13 },
        stress: { min: 4, max: 5, default: 4 },
        atkBonus: { min: 5, max: 6, default: 5 },
        thresholds: 'Stage 10 / Severe 20',
        experience: 'Define what makes the solo legendary in the area and what they guard.',
        tactics: 'Cycle spotlight multiple times per GM turn; punish inaction with escalating effects.',
        features: 'Four to five moves including at least one “phase change” or transformation.'
      }
    },
    environment: {
      Traversal: {
        difficulty: { min: 11, max: 13, default: 12 },
        impulses: 'Challenge logistics—perilous climbs, wide gaps, or hostile weather.',
        potential: 'Reveal connected threats such as patrols, wild predators, or arcane anomalies.',
        prompts: 'Ask who knows the safe path and what it costs to take it.',
        features: 'Two linked features that force trade-offs between speed and safety.'
      },
      Hazard: {
        difficulty: { min: 12, max: 14, default: 13 },
        impulses: 'Escalate rapidly if ignored (lava surges, cursed blooms, unstable rituals).',
        potential: 'Show how the hazard mutates or empowers allied foes.',
        prompts: 'Probe what the PCs are willing to risk or sacrifice to contain it.',
        features: 'Three features mixing persistent pressure with moments to counteract it.'
      },
      Encounter: {
        difficulty: { min: 13, max: 15, default: 14 },
        impulses: 'Split the party’s focus between saving innocents, capturing objectives, and self-preservation.',
        potential: 'List reinforcements, political complications, or collateral damage outcomes.',
        prompts: 'Ask about allies, debts, and the stakes of failure at this scale.',
        features: 'Three to four features, often including a countdown or bargain.'
      }
    }
  },
  {
    tier: 2,
    title: 'Tier 2 — Champion Threats',
    summary:
      'Heroes confront nation-shaking plots and terrifying monsters. Opposition wields layered defenses and decisive alpha strikes.',
    enemyFocus:
      'Expect complex battlefields with multiple victory conditions. Resource attrition and Fear loops are front and center.',
    environmentFocus:
      'Scenes reshape the campaign map. Hazards can permanently alter factions or regions if left unchecked.',
    enemy: {
      Minion: {
        difficulty: { min: 13, max: 15, default: 14 },
        hp: { min: 4, max: 6, default: 5 },
        stress: { min: 1, max: 2, default: 1 },
        atkBonus: { min: 3, max: 4, default: 3 },
        thresholds: 'Stage 5 / Severe 10',
        experience: 'Demonstrate the champion tier faction’s reach—exotic gear, loyal retainers, or uncanny tactics.',
        tactics: 'Enable elite combos or serve as mobile hazards that set up big swings.',
        features: 'Two features that punish complacency—grapples, forced movement, draining conditions.'
      },
      Standard: {
        difficulty: { min: 15, max: 17, default: 16 },
        hp: { min: 8, max: 10, default: 9 },
        stress: { min: 3, max: 4, default: 3 },
        atkBonus: { min: 5, max: 6, default: 5 },
        thresholds: 'Stage 8 / Severe 16',
        experience: 'Expose secrets about ancient powers or grand conspiracies.',
        tactics: 'Chain spotlight turns via reactions; punish repeated tactics from the party.',
        features: 'Four features, often including battlefield control, burst damage, and support.'
      },
      Elite: {
        difficulty: { min: 16, max: 18, default: 17 },
        hp: { min: 11, max: 13, default: 12 },
        stress: { min: 3, max: 5, default: 4 },
        atkBonus: { min: 6, max: 7, default: 6 },
        thresholds: 'Stage 10 / Severe 19',
        experience: 'Provide campaign-altering revelations or bargaining chips.',
        tactics: 'Escalate each stage—unlock new reactions at Severe damage or when stress is marked.',
        features: 'Four to five features including layered defenses and an ultimate move.'
      },
      Boss: {
        difficulty: { min: 17, max: 19, default: 18 },
        hp: { min: 14, max: 16, default: 15 },
        stress: { min: 4, max: 6, default: 5 },
        atkBonus: { min: 6, max: 7, default: 6 },
        thresholds: 'Stage 12 / Severe 22',
        experience: 'Their defeat shifts a kingdom, guild, or planar frontier.',
        tactics: 'Run multi-phase fights with scripted triggers when thresholds break.',
        features: 'Five features with strong scene-editing tools and retaliatory reactions.'
      },
      Solo: {
        difficulty: { min: 18, max: 20, default: 19 },
        hp: { min: 16, max: 18, default: 17 },
        stress: { min: 5, max: 6, default: 5 },
        atkBonus: { min: 7, max: 8, default: 7 },
        thresholds: 'Stage 14 / Severe 26',
        experience: 'Define what saving the world looks like right now and who begs for the party’s aid.',
        tactics: 'Loop through multiple spotlights each GM turn, pressuring every PC in turn.',
        features: 'Five to six features with environment manipulation, summons, and devastating finishers.'
      }
    },
    environment: {
      Traversal: {
        difficulty: { min: 14, max: 16, default: 15 },
        impulses: 'Make the journey itself a session highlight—shifting terrain, hostile weather spirits, or planar bleed.',
        potential: 'Show which powers contest the route and what happens if the heroes falter.',
        prompts: 'Ask what legendary travelers left behind and who guides the way now.',
        features: 'Three features that combine skill tests, clocks, and narrative sacrifices.'
      },
      Hazard: {
        difficulty: { min: 15, max: 17, default: 16 },
        impulses: 'Force the party to triage between multiple cascading failures.',
        potential: 'Reveal cross-tier fallout—kingdoms fall, armies scatter, portals open.',
        prompts: 'Probe personal costs or who must be saved first.',
        features: 'Three to four features with layered costs and opportunities to vent pressure.'
      },
      Encounter: {
        difficulty: { min: 16, max: 18, default: 17 },
        impulses: 'Stage multiple simultaneous objectives that reshape the campaign’s political map.',
        potential: 'Name rival champions, siege engines, or magical catastrophes that join the fray.',
        prompts: 'Ask what alliances are strained or forged in the moment.',
        features: 'Four to five features with clocks, bargains, and triggerable twists.'
      }
    }
  },
  {
    tier: 3,
    title: 'Tier 3 — Legendary Threats',
    summary:
      'World-defining stakes. Victories rewrite history; failures end civilizations. Every scene should feel mythic.',
    enemyFocus:
      'Opposition wields sweeping influence and backup plans. Expect layered immunities, devastating finishers, and bold narrative swings.',
    environmentFocus:
      'Set pieces warp reality itself. Locations might be alive, sentient, or collapsing across planes.',
    enemy: {
      Minion: {
        difficulty: { min: 15, max: 17, default: 16 },
        hp: { min: 5, max: 7, default: 6 },
        stress: { min: 1, max: 2, default: 2 },
        atkBonus: { min: 4, max: 5, default: 4 },
        thresholds: 'Stage 6 / Severe 12',
        experience: 'Even the fodder hints at impossible power—describe legendary origins or uncanny abilities.',
        tactics: 'Serve as extensions of the villain, relaying commands instantly or acting as conduits.',
        features: 'Two dramatic features that bend physics, spread status, or self-destruct spectacularly.'
      },
      Standard: {
        difficulty: { min: 18, max: 20, default: 19 },
        hp: { min: 10, max: 12, default: 11 },
        stress: { min: 4, max: 5, default: 4 },
        atkBonus: { min: 6, max: 7, default: 6 },
        thresholds: 'Stage 10 / Severe 20',
        experience: 'Foreshadow the ultimate villain’s plans or bargains that could save the world.',
        tactics: 'Combine unstoppable pressure with battlefield rewriting each time they are spotlighted.',
        features: 'Five features, heavy on reactions and irreversible choices.'
      },
      Elite: {
        difficulty: { min: 19, max: 21, default: 20 },
        hp: { min: 14, max: 16, default: 15 },
        stress: { min: 4, max: 6, default: 5 },
        atkBonus: { min: 7, max: 8, default: 7 },
        thresholds: 'Stage 12 / Severe 24',
        experience: 'Reveal cosmic truths or bargains that tempt heroes toward sacrifice.',
        tactics: 'Trigger catastrophic reactions when thresholds are broken; bend the rules of engagement.',
        features: 'Five to six features including immunity phases or narrative-altering ultimates.'
      },
      Boss: {
        difficulty: { min: 20, max: 22, default: 21 },
        hp: { min: 18, max: 20, default: 19 },
        stress: { min: 5, max: 7, default: 6 },
        atkBonus: { min: 7, max: 9, default: 8 },
        thresholds: 'Stage 14 / Severe 28',
        experience: 'The battle decides the fate of nations or planes—make the stakes explicit.',
        tactics: 'Operate across multiple fronts at once, threatening allies, sanctuaries, or artifacts.',
        features: 'Six features including multi-stage transformations and campaign-defining reactions.'
      },
      Solo: {
        difficulty: { min: 21, max: 23, default: 22 },
        hp: { min: 20, max: 24, default: 22 },
        stress: { min: 6, max: 8, default: 7 },
        atkBonus: { min: 8, max: 9, default: 8 },
        thresholds: 'Stage 16 / Severe 32',
        experience: 'Their downfall reshapes reality—decide what legacy or scar they leave behind.',
        tactics: 'Command the spotlight repeatedly, rewriting the scene each time the heroes push them to the edge.',
        features: 'Six or more features spanning legendary resistances, planar effects, and apocalyptic finishers.'
      }
    },
    environment: {
      Traversal: {
        difficulty: { min: 17, max: 19, default: 18 },
        impulses: 'Travel itself breaks the laws of nature—time loops, gravity storms, sentient landscapes.',
        potential: 'Consequences ripple across continents; name the factions or spirits that react.',
        prompts: 'Ask what myth the party is re-enacting and who remembers it differently.',
        features: 'Four features intertwining clocks, sacrifices, and reality-warping costs.'
      },
      Hazard: {
        difficulty: { min: 18, max: 20, default: 19 },
        impulses: 'Threaten the fabric of existence unless the heroes intervene immediately.',
        potential: 'Outline planar breaches, mass evacuations, or divine reprisals that follow.',
        prompts: 'Press the heroes on what they will trade to save the world.',
        features: 'Four to five features with devastating spends and slim chances to vent pressure.'
      },
      Encounter: {
        difficulty: { min: 19, max: 21, default: 20 },
        impulses: 'Every beat should feel climactic—alliances shatter, gods intervene, armies clash.',
        potential: 'Call out legendary allies or foes who may arrive depending on the heroes’ choices.',
        prompts: 'Ask what final promises are made and which debts come due.',
        features: 'Five or more features layering massive clocks, reality shifts, and narrative bargains.'
      }
    }
  }
]

export function listTierGuides(): TierGuide[] {
  return tierGuides
}

export function getTierGuide(tier: number | null): TierGuide | null {
  if (tier == null) return null
  return tierGuides.find((guide) => guide.tier === tier) ?? null
}

export function getEnemyTierGuidance(tier: number | null, rank: Enemy['rank']) {
  if (rank === '' || rank == null) return null
  const guide = getTierGuide(tier)
  if (!guide) return null
  const details = guide.enemy[rank as EnemyRank]
  if (!details) return null
  return { ...details, tierTitle: guide.title, summary: guide.summary }
}

export function getEnvironmentTierGuidance(tier: number | null, category: Environment['category']) {
  if (category === '' || category == null) return null
  const guide = getTierGuide(tier)
  if (!guide) return null
  const details = guide.environment[category as EnvironmentCategory]
  if (!details) return null
  return { ...details, tierTitle: guide.title, summary: guide.summary }
}
