const easeStandard = "ease-[var(--motion-easing-standard)]"
const easeDecelerate = "ease-[var(--motion-easing-decelerate)]"
const easeAccelerate = "ease-[var(--motion-easing-accelerate)]"
const easeEmphasizedDecelerate = "ease-[var(--motion-easing-emphasized-decelerate)]"
const easeEmphasizedAccelerate = "ease-[var(--motion-easing-emphasized-accelerate)]"

const durationXS = 'duration-[var(--motion-duration-xs)]'
const durationSM = 'duration-[var(--motion-duration-sm)]'
const durationMD = 'duration-[var(--motion-duration-md)]'
const durationLG = 'duration-[var(--motion-duration-lg)]'

// Simple motion presets usable with Vue <Transition>
export const fadeScale = {
  enterActiveClass: `transition ${easeDecelerate} ${durationSM}`,
  enterFromClass: 'opacity-0 scale-95',
  enterToClass: 'opacity-100 scale-100',
  leaveActiveClass: `transition ${easeAccelerate} ${durationXS}`,
  leaveFromClass: 'opacity-100 scale-100',
  leaveToClass: 'opacity-0 scale-95'
}

export const fadeSlideUp = {
  enterActiveClass: `transition ${easeDecelerate} ${durationSM}`,
  enterFromClass: 'opacity-0 translate-y-2',
  enterToClass: 'opacity-100 translate-y-0',
  leaveActiveClass: `transition ${easeAccelerate} ${durationXS}`,
  leaveFromClass: 'opacity-100 translate-y-0',
  leaveToClass: 'opacity-0 translate-y-2'
}

export const expandCollapse = {
  enterActiveClass: `transition-[max-height,opacity] ${easeEmphasizedDecelerate} ${durationMD}`,
  enterFromClass: 'max-h-0 opacity-0',
  enterToClass: 'max-h-[40rem] opacity-100',
  leaveActiveClass: `transition-[max-height,opacity] ${easeAccelerate} ${durationSM}`,
  leaveFromClass: 'max-h-[40rem] opacity-100',
  leaveToClass: 'max-h-0 opacity-0'
}

export const fadeSlideRight = {
  enterActiveClass: `transition ${easeDecelerate} ${durationSM}`,
  enterFromClass: 'opacity-0 -translate-x-2',
  enterToClass: 'opacity-100 translate-x-0',
  leaveActiveClass: `transition ${easeAccelerate} ${durationXS}`,
  leaveFromClass: 'opacity-100 translate-x-0',
  leaveToClass: 'opacity-0 -translate-x-2'
}

export const listItem = {
  enterActiveClass: `transition ${easeDecelerate} ${durationSM}`,
  enterFromClass: 'opacity-0 -translate-y-1',
  enterToClass: 'opacity-100 translate-y-0',
  leaveActiveClass: `transition ${easeAccelerate} ${durationXS}`,
  leaveFromClass: 'opacity-100 translate-y-0',
  leaveToClass: 'opacity-0 -translate-y-1'
}

export const listMoveClass = `transition-transform ${durationSM} ${easeStandard}`

export const pop = {
  enterActiveClass: `transition ${easeEmphasizedDecelerate} ${durationSM}`,
  enterFromClass: 'opacity-0 scale-90',
  enterToClass: 'opacity-100 scale-100',
  leaveActiveClass: `transition ${easeAccelerate} ${durationXS}`,
  leaveFromClass: 'opacity-100 scale-100',
  leaveToClass: 'opacity-0 scale-95'
}

export const bottomSheet = {
  enterActiveClass: `transition-transform ${easeEmphasizedDecelerate} ${durationLG}`,
  enterFromClass: 'translate-y-full',
  enterToClass: 'translate-y-0',
  leaveActiveClass: `transition-transform ${easeEmphasizedAccelerate} ${durationMD}`,
  leaveFromClass: 'translate-y-0',
  leaveToClass: 'translate-y-full'
}

export const shimmerPulse = 'animate-[pulse_1.2s_ease-in-out_infinite]'
