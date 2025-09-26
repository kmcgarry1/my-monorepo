const easeOut = 'cubic-bezier(0, 0, 0.2, 1)'
const easeIn = 'cubic-bezier(0.4, 0, 1, 1)'
const easeEmphasized = 'cubic-bezier(0.05, 0.7, 0.1, 1)'

// Simple motion presets usable with Vue <Transition>
export const fadeScale = {
  enterActiveClass: `transition ${easeOut} duration-[var(--transition-short)]`,
  enterFromClass: 'opacity-0 scale-95',
  enterToClass: 'opacity-100 scale-100',
  leaveActiveClass: `transition ${easeIn} duration-[var(--transition-micro)]`,
  leaveFromClass: 'opacity-100 scale-100',
  leaveToClass: 'opacity-0 scale-95'
}

export const fadeSlideUp = {
  enterActiveClass: `transition ${easeOut} duration-[var(--transition-short)]`,
  enterFromClass: 'opacity-0 translate-y-2',
  enterToClass: 'opacity-100 translate-y-0',
  leaveActiveClass: `transition ${easeIn} duration-[var(--transition-micro)]`,
  leaveFromClass: 'opacity-100 translate-y-0',
  leaveToClass: 'opacity-0 translate-y-2'
}

export const expandCollapse = {
  enterActiveClass: `transition-[max-height,opacity] ${easeEmphasized} duration-[var(--transition-medium)]`,
  enterFromClass: 'max-h-0 opacity-0',
  enterToClass: 'max-h-[40rem] opacity-100',
  leaveActiveClass: `transition-[max-height,opacity] ${easeIn} duration-[var(--transition-short)]`,
  leaveFromClass: 'max-h-[40rem] opacity-100',
  leaveToClass: 'max-h-0 opacity-0'
}

export const fadeSlideRight = {
  enterActiveClass: `transition ${easeOut} duration-[var(--transition-short)]`,
  enterFromClass: 'opacity-0 -translate-x-2',
  enterToClass: 'opacity-100 translate-x-0',
  leaveActiveClass: `transition ${easeIn} duration-[var(--transition-micro)]`,
  leaveFromClass: 'opacity-100 translate-x-0',
  leaveToClass: 'opacity-0 -translate-x-2'
}

export const listItem = {
  enterActiveClass: `transition ${easeOut} duration-[var(--transition-short)]`,
  enterFromClass: 'opacity-0 -translate-y-1',
  enterToClass: 'opacity-100 translate-y-0',
  leaveActiveClass: `transition ${easeIn} duration-[var(--transition-micro)]`,
  leaveFromClass: 'opacity-100 translate-y-0',
  leaveToClass: 'opacity-0 -translate-y-1'
}

export const listMoveClass = 'transition-transform duration-[var(--transition-short)] ease-[cubic-bezier(0.2,0,0,1)]'

export const pop = {
  enterActiveClass: `transition ${easeEmphasized} duration-[var(--transition-short)]`,
  enterFromClass: 'opacity-0 scale-90',
  enterToClass: 'opacity-100 scale-100',
  leaveActiveClass: `transition ${easeIn} duration-[var(--transition-micro)]`,
  leaveFromClass: 'opacity-100 scale-100',
  leaveToClass: 'opacity-0 scale-95'
}

export const bottomSheet = {
  enterActiveClass: `transition-transform ${easeEmphasized} duration-[var(--transition-long)]`,
  enterFromClass: 'translate-y-full',
  enterToClass: 'translate-y-0',
  leaveActiveClass: `transition-transform ${easeIn} duration-[var(--transition-medium)]`,
  leaveFromClass: 'translate-y-0',
  leaveToClass: 'translate-y-full'
}

export const shimmerPulse = 'animate-[pulse_1.2s_ease-in-out_infinite]'
