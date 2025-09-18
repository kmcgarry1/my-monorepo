import type { Enemy, Environment } from '../types'

export function toJSONBlob(sbType: 'enemy'|'environment', enemy: Enemy, environment: Environment): Blob {
  const data = { version: 1, sbType, enemy, environment }
  return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function toMarkdown(sbType: 'enemy'|'environment', enemy: Enemy, environment: Environment): string {
  if (sbType === 'enemy') {
    const atkLines = enemy.attacks.map(a => `- ${a.name || '—'}: ${a.range || '—'} | ${a.details || '—'}`).join('\n')
    const features = enemy.features.map(f => {
      const header = `- ${f.name || '—'} — ${f.tag}` + (f.cost ? ` — ${f.cost}` : '')
      const body = f.text ? `\n  ${f.text}` : ''
      return header + body
    }).join('\n')

    return `# ${enemy.name || 'New Enemy'}\n\n` +
      `${enemy.tier ? `Tier ${enemy.tier} ` : ''}${enemy.rank || ''}`.trim() + `\n\n` +
      `${enemy.description ? enemy.description + '\n\n' : ''}` +
      `${enemy.tactics ? `Motives & Tactics: ${enemy.tactics}\n\n` : ''}` +
      `Difficulty: ${enemy.difficulty ?? '—'} | Thresholds: ${enemy.thresholds || '—'} | HP: ${enemy.hp ?? '—'} | Stress: ${enemy.stress ?? '—'}\n\n` +
      `${enemy.atkBonus != null ? `ATK: +${enemy.atkBonus}\n` : ''}` +
      `${atkLines ? `\nAttacks\n${atkLines}\n` : ''}` +
      `${enemy.experience ? `\nExperience: ${enemy.experience}\n` : ''}` +
      `${features ? `\nFeatures\n${features}\n` : ''}`
  }

  // environment
  const fLines = environment.features.map(f => {
    const header = `- ${f.name || '—'} — ${f.tag}` + (f.cost ? ` — ${f.cost}` : '')
    const body = f.text ? `\n  ${f.text}` : ''
    return header + body
  }).join('\n')

  return `# ${environment.name || 'New Environment'}\n\n` +
    `${environment.tier ? `Tier ${environment.tier} ` : ''}${environment.category || ''}`.trim() + `\n\n` +
    `${environment.description ? environment.description + '\n\n' : ''}` +
    `Impulses: ${environment.impulses || '—'}\n\n` +
    `Difficulty: ${environment.difficulty ?? '—'}\n\n` +
    `${environment.potential ? `Potential Adversaries: ${environment.potential}\n\n` : ''}` +
    `${fLines ? `Features\n${fLines}\n\n` : ''}` +
    `${environment.prompts ? `Prompts\n${environment.prompts}\n` : ''}`
}

