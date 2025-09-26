<script setup lang="ts">
import { computed } from 'vue'
import { 
  InformationCircleIcon,
  BookOpenIcon,
  TrashIcon,
  PlusIcon,
  BoltIcon,
  ArrowsRightLeftIcon,
  CubeIcon,
  ArrowDownTrayIcon,
  DocumentDuplicateIcon,
  PrinterIcon,
  XMarkIcon,
  PaintBrushIcon,
} from '@heroicons/vue/24/outline'
import { 
  InformationCircleIcon as InformationCircleIconSolid,
  BookOpenIcon as BookOpenIconSolid,
  TrashIcon as TrashIconSolid,
  PlusIcon as PlusIconSolid,
  BoltIcon as BoltIconSolid,
  ArrowsRightLeftIcon as ArrowsRightLeftIconSolid,
  CubeIcon as CubeIconSolid,
  ArrowDownTrayIcon as ArrowDownTrayIconSolid,
  DocumentDuplicateIcon as DocumentDuplicateIconSolid,
  PrinterIcon as PrinterIconSolid,
  XMarkIcon as XMarkIconSolid,
  PaintBrushIcon as PaintBrushIconSolid,
} from '@heroicons/vue/24/solid'

import type { IconColor, IconSize, IconWeight } from '../types'

type IconName = 'sword'|'arrows'|'dice'|'plus'|'trash'|'book'|'info'|'download'|'copy'|'print'|'x'|'palette'

const props = withDefaults(
  defineProps<{
    name: IconName
    class?: string
    size?: IconSize
    color?: IconColor
    weight?: IconWeight
  }>(),
  { class: '', size: 'sm', color: 'default', weight: 'solid' }
)

const sizeClass = computed(() => ({
  xs: 'h-3 w-3',
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-7 w-7',
  inline: 'h-[1em] w-[1em]'
}[props.size]))

const colorClass = computed(() => ({
  default: '',
  muted: 'text-[color:var(--md-sys-color-on-surface-variant)]',
  accent: 'text-[color:var(--md-sys-color-primary)]',
  primary: 'text-[color:var(--md-sys-color-primary)]',
  danger: 'text-[color:var(--md-sys-color-error)]',
  success: 'text-[color:var(--md-sys-color-success)]',
  fg: 'text-[color:var(--md-sys-color-on-surface)]',
  bg: 'text-[color:var(--md-sys-color-surface)]',
}[props.color]))

// Provide explicit dimensions via style to avoid environments
// where utility classes are purged or unavailable.
const sizeStyle = computed(() => {
  if (props.size === 'inline') return { width: '1em', height: '1em' }
  const px = ({ xs: 12, sm: 16, md: 20, lg: 24, xl: 28 } as Record<string, number>)[props.size || 'sm'] || 16
  return { width: px + 'px', height: px + 'px' }
})

const heroMapOutline: Record<string, any> = {
  sword: BoltIcon,
  arrows: ArrowsRightLeftIcon,
  dice: CubeIcon,
  info: InformationCircleIcon,
  book: BookOpenIcon,
  trash: TrashIcon,
  plus: PlusIcon,
  download: ArrowDownTrayIcon,
  copy: DocumentDuplicateIcon,
  print: PrinterIcon,
  x: XMarkIcon,
  palette: PaintBrushIcon,
}
const heroMapSolid: Record<string, any> = {
  sword: BoltIconSolid,
  arrows: ArrowsRightLeftIconSolid,
  dice: CubeIconSolid,
  info: InformationCircleIconSolid,
  book: BookOpenIconSolid,
  trash: TrashIconSolid,
  plus: PlusIconSolid,
  download: ArrowDownTrayIconSolid,
  copy: DocumentDuplicateIconSolid,
  print: PrinterIconSolid,
  x: XMarkIconSolid,
  palette: PaintBrushIconSolid,
}

const HeroComp = computed(() => {
  const name = props.name as string
  const map = props.weight === 'solid' ? heroMapSolid : heroMapOutline
  return map[name]
})
</script>

<template>
  <component
    v-if="HeroComp"
    :is="HeroComp"
    :class="[sizeClass, colorClass, props.class]"
    :style="sizeStyle"
  />
  <svg v-else-if="props.name==='sword'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" :class="[sizeClass, colorClass, props.class]" :style="sizeStyle">
    <path d="M11.25 3.75a.75.75 0 0 1 .75-.75h2.69a.75.75 0 0 1 .53.22l4.56 4.56a.75.75 0 0 1 .22.53v2.69a.75.75 0 0 1-.75.75h-2.25v5.25a2.25 2.25 0 0 1-2.25 2.25H6.75a.75.75 0 0 1-.53-.22l-3-3a.75.75 0 0 1 0-1.06l8.03-8.03V3.75Z"/>
  </svg>
  <svg v-else-if="props.name==='arrows'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" :class="[sizeClass, colorClass, props.class]" :style="sizeStyle">
    <path d="M3.22 7.22a.75.75 0 0 1 1.06 0L8.5 11.44l2.22-2.22a.75.75 0 1 1 1.06 1.06l-2.75 2.75a.75.75 0 0 1-1.06 0L3.22 8.28a.75.75 0 0 1 0-1.06ZM12.22 12.78a.75.75 0 1 1 1.06-1.06l3.22 3.22 2.22-2.22a.75.75 0 1 1 1.06 1.06l-2.75 2.75a.75.75 0 0 1-1.06 0l-3.75-3.75Z"/>
  </svg>
  <svg v-else-if="props.name==='dice'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" :class="[sizeClass, colorClass, props.class]" :style="sizeStyle">
    <path d="M4.5 12a7.5 7.5 0 1 1 15 0 7.5 7.5 0 0 1-15 0Zm7.5-5.25a.75.75 0 0 0-.75.75v3.69l-2.2 2.2a.75.75 0 1 0 1.06 1.06l2.35-2.35a.75.75 0 0 0 .22-.53V7.5a.75.75 0 0 0-.75-.75Z"/>
  </svg>
  <svg v-else-if="props.name==='plus'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" :class="[sizeClass, colorClass, props.class]" :style="sizeStyle">
    <path d="M10 3a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H4a1 1 0 1 1 0-2h5V4a1 1 0 0 1 1-1Z"/>
  </svg>
  <svg v-else-if="props.name==='trash'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" :class="[sizeClass, colorClass, props.class]" :style="sizeStyle">
    <path d="M9 3.75A1.75 1.75 0 0 1 10.75 2h2.5A1.75 1.75 0 0 1 15 3.75V5h3.25a.75.75 0 0 1 0 1.5H5.75a.75.75 0 0 1 0-1.5H9V3.75ZM6.75 7.25h10.5l-.68 11.08A2.25 2.25 0 0 1 14.33 20H9.67a2.25 2.25 0 0 1-2.24-1.67L6.75 7.25Z"/>
  </svg>
  <svg v-else-if="props.name==='book'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" :class="[sizeClass, colorClass, props.class]" :style="sizeStyle">
    <path d="M3.75 5.25A2.25 2.25 0 0 1 6 3h11.25a.75.75 0 0 1 .75.75V18a.75.75 0 0 1-.75.75H6A2.25 2.25 0 0 1 3.75 16.5V5.25Z"/>
  </svg>
  <svg v-else-if="props.name==='info'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" :class="[sizeClass, colorClass, props.class]" :style="sizeStyle">
    <path d="M12 2.25a9.75 9.75 0 1 0 0 19.5 9.75 9.75 0 0 0 0-19.5Zm.75 4.5a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM10.5 10.5h1.5v6h-1.5v-6Zm0 0h3v1.5h-3V10.5Z"/>
  </svg>
  <svg v-else-if="props.name==='download'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" :class="[sizeClass, colorClass, props.class]" :style="sizeStyle">
    <path d="M12 3.75a.75.75 0 0 1 .75.75v8.19l2.47-2.47a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0l-3.75-3.75a.75.75 0 1 1 1.06-1.06l2.47 2.47V4.5a.75.75 0 0 1 .75-.75Z"/>
    <path d="M4.5 18a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 0-1.5 0v3h-12v-3A.75.75 0 0 0 4.5 15v3Z"/>
  </svg>
  <svg v-else-if="props.name==='copy'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" :class="[sizeClass, colorClass, props.class]" :style="sizeStyle">
    <path d="M8.25 4.5A2.25 2.25 0 0 1 10.5 2.25h7.25A2.25 2.25 0 0 1 20 4.5V12a2.25 2.25 0 0 1-2.25 2.25H10.5A2.25 2.25 0 0 1 8.25 12V4.5Z"/>
    <path d="M4 8.25A2.25 2.25 0 0 1 6.25 6h.5a.75.75 0 0 1 0 1.5h-.5a.75.75 0 0 0-.75.75V18a.75.75 0 0 0 .75.75H16a.75.75 0 0 0 .75-.75v-.5A.75.75 0 0 1 18.25 16v.5A2.25 2.25 0 0 1 16 18.75H6.25A2.25 2.25 0 0 1 4 16.5V8.25Z"/>
  </svg>
  <svg v-else-if="props.name==='print'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" :class="[sizeClass, colorClass, props.class]" :style="sizeStyle">
    <path d="M6 3.75A.75.75 0 0 1 6.75 3h10.5a.75.75 0 0 1 .75.75V7.5H6V3.75ZM6 9h12a3 3 0 0 1 3 3v3.75a.75.75 0 0 1-.75.75H18v3.75a.75.75 0 0 1-.75.75H6.75A.75.75 0 0 1 6 20.25V16.5H3.75A.75.75 0 0 1 3 15.75V12a3 3 0 0 1 3-3Zm2.25 7.5h7.5V12h-7.5v4.5Z"/>
  </svg>
  <svg v-else-if="props.name==='x'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" :class="[sizeClass, colorClass, props.class]" :style="sizeStyle">
    <path d="M6.225 4.811a.75.75 0 0 1 1.06 0L12 9.525l4.715-4.714a.75.75 0 1 1 1.06 1.06L13.06 10.586l4.715 4.714a.75.75 0 1 1-1.06 1.061L12 11.646l-4.715 4.715a.75.75 0 0 1-1.06-1.061L10.94 10.586 6.225 5.872a.75.75 0 0 1 0-1.061Z"/>
  </svg>
  <svg v-else-if="props.name==='palette'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" :class="[sizeClass, colorClass, props.class]" :style="sizeStyle">
    <path d="M12 3.75a8.25 8.25 0 1 0 8.25 8.25c0-.414-.336-.75-.75-.75h-2.25a2.25 2.25 0 1 1 0-4.5h.659A8.236 8.236 0 0 0 12 3.75Zm-4.5 6.75a1.125 1.125 0 1 1 0-2.25 1.125 1.125 0 0 1 0 2.25Zm3-3a1.125 1.125 0 1 1 0-2.25 1.125 1.125 0 0 1 0 2.25Zm3 0a1.125 1.125 0 1 1 0-2.25 1.125 1.125 0 0 1 0 2.25Z"/>
  </svg>
</template>
