export function average(nums: number[]): number | null {
  const arr = nums.filter(n => Number.isFinite(n))
  if (!arr.length) return null
  return +(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2)
}

export function median(nums: number[]): number | null {
  const arr = nums.filter(n => Number.isFinite(n)).slice().sort((a, b) => a - b)
  if (!arr.length) return null
  const mid = Math.floor(arr.length / 2)
  if (arr.length % 2) return arr[mid]
  return +(((arr[mid - 1] + arr[mid]) / 2).toFixed(2))
}

export function mode<T>(values: T[]): { value: T; count: number } | null {
  if (!values.length) return null
  const counts = new Map<T, number>()
  for (const v of values) counts.set(v, (counts.get(v) || 0) + 1)
  let best: { value: T; count: number } | null = null
  for (const [v, c] of counts) {
    if (!best || c > best.count) best = { value: v, count: c }
  }
  return best
}

