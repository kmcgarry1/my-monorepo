UI Package

Overview
- Reusable Vue 3 components styled via CSS variables and utility classes.
- Components expose consistent variant and size props for easy theming.

Icon
- Props:
  - name: one of sword|arrows|dice|plus|trash|book|info|download|copy|print|x|palette
  - size: xs|sm|md|lg|xl|inline (default sm)
  - color: default|muted|accent|danger|fg|bg (default default)
  - weight: outline|solid (default outline; Heroicons only)
- Examples:
  - <AppIcon name="info" />
  - <AppIcon name="print" weight="solid" size="lg" />
  - <AppIcon name="palette" color="accent" size="inline" />

Field Label
- Props: label (string), icon?, tone: muted|fg|accent, size: xs|sm|md
- Example: <AppFieldLabel label="Traits" icon="info" tone="fg" size="xs" />

Buttons
- AppButton
  - variant: default|primary|secondary|danger|ghost|outline|subtle|accent (alias of primary)
  - size: xs|sm|md|lg, block?: boolean, loading?: boolean, disabled?: boolean
  - Example: <AppButton variant="primary" size="md">Save</AppButton>
- AppIconButton
  - name: icon name, variant: same as AppButton, size: xs|sm|md|lg
  - Example: <AppIconButton name="download" variant="outline" size="sm" />

Inputs
- AppInput
  - variant: outline|filled|ghost, size: sm|md|lg, invalid?: boolean
  - Example: <AppInput variant="filled" size="lg" />
- AppTextarea
  - variant: outline|filled|ghost, size: sm|md|lg, rows?: number
- AppSelect
  - variant: outline|filled|ghost, size: sm|md|lg, options?: {label,value}[]
- AppTagInput
  - variant: outline|filled|ghost, size: sm|md|lg

Card
- AppCard
  - variant: default|elevated|ghost
  - padding: sm|md|lg
  - Example: <AppCard title="Details" variant="elevated" padding="lg">...</AppCard>

Shared Variant Utils
- Import from package root or utils path:
  - import { cx, btnBase, btnSizes, btnVariants, iconBtnSizes } from '@my-monorepo/ui'
  - import { cx } from '@my-monorepo/ui/utils/variants'
- cx(...parts): joins class segments conditionally.
- btnBase, btnSizes, iconBtnSizes, btnVariants: used by AppButton/AppIconButton.

Notes
- Heroicons are integrated for common names; custom inline SVGs remain for sword/arrows/dice.
- Icons always set explicit width/height so they don’t balloon without utilities.

Motion
- Use Vue <Transition> with provided presets from `utils/motion`:
  - import { fadeScale, fadeSlideUp, listItem, listMoveClass } from '@my-monorepo/ui/utils/motion'
  - Example (menu):
    <Transition
      :enter-active-class="fadeScale.enterActiveClass"
      :enter-from-class="fadeScale.enterFromClass"
      :enter-to-class="fadeScale.enterToClass"
      :leave-active-class="fadeScale.leaveActiveClass"
      :leave-from-class="fadeScale.leaveFromClass"
      :leave-to-class="fadeScale.leaveToClass"
    >
      <div v-if="open">...</div>
    </Transition>
  - Example (list):
    <TransitionGroup
      tag="div"
      :enter-active-class="listItem.enterActiveClass"
      :enter-from-class="listItem.enterFromClass"
      :enter-to-class="listItem.enterToClass"
      :leave-active-class="listItem.leaveActiveClass"
      :leave-from-class="listItem.leaveFromClass"
      :leave-to-class="listItem.leaveToClass"
      :move-class="listMoveClass"
    >
      <div v-for="it in items" :key="it.id">...</div>
    </TransitionGroup>

Button Group
- Props: modelValue (string), options [{label,value}], variant: default|primary|secondary|danger|ghost|outline|subtle|accent, size: sm|md|lg
- Examples:
  - <AppButtonGroup :options="opts" :model-value="val" @update:modelValue="v => val=v" variant="primary" size="sm" />
  - <AppButtonGroup :options="opts" variant="ghost" />

Dropdown
- Props: items [{label,value,icon?}], align: left|right, buttonTitle, variant, size
- Example:
  <AppDropdown :items="[{label:'Copy',value:'copy',icon:'copy'}]" variant="outline" size="sm">
    <template #button>
      <AppIcon name="plus" />
      <span>Actions</span>
    </template>
  </AppDropdown>

Layout
- AppRow
  - Props: cols: 1|2|3|4, align: start|center|end, gap: xs|sm|md|lg
  - Example: <AppRow :cols="3" gap="lg" align="center">...</AppRow>
- AppCol
  - Props: span: 1|2|3|4 (responsive mappings baked in)
  - Example: <AppCol :span="2">...</AppCol>

Text
- AppText
  - Props: as='p|div|span|...', variant: body|muted|caption|mono|small|lead, tone: fg|muted|accent, size: xs|sm|md|lg
  - Example: <AppText variant="caption" tone="accent">Header</AppText>

Types
- Import shared types directly from the package root:
  - import type { ButtonVariant, ButtonSize, ControlVariant, ControlSize, Tone, IconSize, IconColor, IconWeight, DropdownAlign } from '@my-monorepo/ui'
- These mirror the props across components to help standardize usage.

Badge
- AppBadge
  - Props: variant: default|accent|neutral|danger|success; size: xs|sm|md
  - Example: <AppBadge variant="accent" size="xs">Beta</AppBadge>
