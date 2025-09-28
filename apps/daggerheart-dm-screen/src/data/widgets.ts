import type { WidgetState } from '../types';

export const widgetComponents = [
  'EncounterTimeline',
  'MomentumTracker',
  'ConditionsQuickRef',
  'SRDLibrary',
  'DiceOracle',
  'ThreatsAndHooks'
] as const;

export type WidgetComponentName = (typeof widgetComponents)[number];

const baseZ = 10;

export function createInitialWidgets(): WidgetState[] {
  return [
    {
      id: 'encounter-timeline',
      title: 'Encounter Timeline',
      icon: '⏳',
      accent: 'linear-gradient(135deg, rgba(255, 138, 92, 0.6), rgba(255, 90, 90, 0.4))',
      description: 'Track initiative, rounds, and spotlight moments.',
      position: { x: 48, y: 132 },
      size: { width: 400, height: 360 },
      component: 'EncounterTimeline',
      zIndex: baseZ
    },
    {
      id: 'momentum-tracker',
      title: 'Momentum & Stress',
      icon: '💠',
      accent: 'linear-gradient(135deg, rgba(86, 196, 255, 0.6), rgba(86, 132, 255, 0.4))',
      description: 'Manage the party\'s shared resources.',
      position: { x: 500, y: 120 },
      size: { width: 320, height: 280 },
      component: 'MomentumTracker',
      zIndex: baseZ - 1
    },
    {
      id: 'conditions-ref',
      title: 'Conditions Reference',
      icon: '📖',
      accent: 'linear-gradient(135deg, rgba(168, 255, 120, 0.55), rgba(65, 211, 168, 0.35))',
      description: 'Daggerheart conditions at a glance.',
      position: { x: 880, y: 140 },
      size: { width: 320, height: 340 },
      component: 'ConditionsQuickRef',
      zIndex: baseZ - 2
    },
    {
      id: 'srd-library',
      title: 'SRD Library',
      icon: '📚',
      accent: 'linear-gradient(135deg, rgba(255, 216, 102, 0.6), rgba(255, 164, 90, 0.35))',
      description: 'Domains, damage, boons, and consequences.',
      position: { x: 104, y: 520 },
      size: { width: 440, height: 320 },
      component: 'SRDLibrary',
      zIndex: baseZ - 3
    },
    {
      id: 'dice-oracle',
      title: 'Dice & Oracles',
      icon: '🎲',
      accent: 'linear-gradient(135deg, rgba(255, 120, 221, 0.55), rgba(162, 92, 255, 0.35))',
      description: 'Generate rolls and improv prompts.',
      position: { x: 588, y: 456 },
      size: { width: 360, height: 320 },
      component: 'DiceOracle',
      zIndex: baseZ - 4
    },
    {
      id: 'threats-hooks',
      title: 'Threats & Hooks',
      icon: '🕸️',
      accent: 'linear-gradient(135deg, rgba(92, 255, 208, 0.55), rgba(92, 164, 255, 0.35))',
      description: 'NPCs, looming dangers, and treasure sparks.',
      position: { x: 964, y: 488 },
      size: { width: 360, height: 340 },
      component: 'ThreatsAndHooks',
      zIndex: baseZ - 5
    }
  ];
}
