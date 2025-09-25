// Simple motion presets usable with Vue <Transition>

export const fadeScale = {
  enterActiveClass: 'transition ease-out duration-150',
  enterFromClass: 'opacity-0 scale-95',
  enterToClass: 'opacity-100 scale-100',
  leaveActiveClass: 'transition ease-in duration-100',
  leaveFromClass: 'opacity-100 scale-100',
  leaveToClass: 'opacity-0 scale-95',
}

export const fadeSlideUp = {
  enterActiveClass: 'transition ease-out duration-150',
  enterFromClass: 'opacity-0 translate-y-1',
  enterToClass: 'opacity-100 translate-y-0',
  leaveActiveClass: 'transition ease-in duration-100',
  leaveFromClass: 'opacity-100 translate-y-0',
  leaveToClass: 'opacity-0 translate-y-1',
}

export const listItem = {
  enterActiveClass: 'transition duration-150 ease-out',
  enterFromClass: 'opacity-0 -translate-y-1',
  enterToClass: 'opacity-100 translate-y-0',
  leaveActiveClass: 'transition duration-100 ease-in',
  leaveFromClass: 'opacity-100 translate-y-0',
  leaveToClass: 'opacity-0 -translate-y-1',
}

export const listMoveClass = 'transition-transform duration-150';

