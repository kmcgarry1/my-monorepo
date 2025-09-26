UI Package

Overview
- Reusable Vue 3 components aligned with Material 3 tokens, extensive variants, and motion presets.
- Components expose consistent variant and size props for easy theming and adaptive layouts.

Icon
- Props:
  - name: one of sword|arrows|dice|plus|trash|book|info|download|copy|print|x|palette
  - size: xs|sm|md|lg|xl|inline (default sm)
  - color: default|muted|accent|primary|success|danger|fg|bg (default default)
  - weight: outline|solid (default outline; Heroicons only)
- Examples:
  - <AppIcon name="info" />
  - <AppIcon name="print" weight="solid" size="lg" color="primary" />
  - <AppIcon name="palette" color="accent" size="inline" />

Field Label
- Props: label (string), icon?, tone: muted|fg|accent|primary|secondary|success, size: xs|sm|md
- Example: <AppFieldLabel label="Traits" icon="info" tone="primary" size="xs" />

Buttons
- AppButton
  - variant: filled|tonal|filled-tonal|outlined|text|ghost|surface|elevated|danger|success plus legacy aliases default|primary|secondary|accent|outline|subtle
  - size: xs|sm|md|lg, block?: boolean, loading?: boolean, disabled?: boolean
  - Example: <AppButton variant="filled" size="md">Save</AppButton>
  - Example tonal: <AppButton variant="tonal" size="sm">Secondary</AppButton>
- AppIconButton
  - name: icon name, variant: same as AppButton, size: xs|sm|md|lg
  - Example: <AppIconButton name="download" variant="outlined" size="sm" />

Inputs
- AppInput
  - variant: filled|outlined|text (outline alias), size: sm|md|lg, invalid?: boolean
  - Example: <AppInput variant="filled" size="lg" />
- AppTextarea
  - variant: filled|outlined|text, size: sm|md|lg, rows?: number
- AppSelect
  - variant: filled|outlined|text, size: sm|md|lg, options?: {label,value}[]
- AppTagInput
  - variant: filled|outlined|text, size: sm|md|lg

Card
- AppCard
  - variant: elevated|filled|surface|outlined|ghost (default elevated)
  - padding: sm|md|lg
  - Example: <AppCard title="Details" variant="outlined" padding="lg">...</AppCard>

Shared Variant Utils
- Import from package root or utils path:
  - import { cx, btnBase, btnSizes, btnVariants, iconBtnSizes } from '@my-monorepo/ui'
  - import { cx } from '@my-monorepo/ui/utils/variants'
- cx(...parts): joins class segments conditionally.
- btnBase, btnSizes, iconBtnSizes, btnVariants: used by AppButton/AppIconButton and align with Material transitions.

Motion
- Use Vue <Transition> with provided presets from `utils/motion`:
  - import { fadeScale, fadeSlideUp, fadeSlideRight, expandCollapse, pop, bottomSheet, listItem, listMoveClass, shimmerPulse } from '@my-monorepo/ui/utils/motion'
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
- Props: modelValue (string), options [{label,value}], variant same as AppButton, size: sm|md|lg
- Examples:
  - <AppButtonGroup :options="opts" :model-value="val" @update:modelValue="v => val=v" variant="filled" size="sm" />
  - <AppButtonGroup :options="opts" variant="ghost" />

Dropdown
- Props: items [{label,value,icon?}], align: left|right, buttonTitle, variant, size
- Example:
  <AppDropdown :items="[{label:'Copy',value:'copy',icon:'copy'}]" variant="outlined" size="sm">
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
  - Props: as='p|div|span|...', variant: body|muted|caption|label|title|display|mono, tone: fg|muted|accent|primary|secondary|success, size: xs|sm|md|lg
  - Example: <AppText variant="label" tone="primary">Header</AppText>

Types
- Import shared types directly from the package root:
  - import type { ButtonVariant, ButtonSize, ControlVariant, ControlSize, Tone, IconSize, IconColor, IconWeight, DropdownAlign }
    from '@my-monorepo/ui'
- These mirror the props across components to help standardize usage.

Badge
- AppBadge
  - Props: variant: surface|primary|secondary|neutral|danger|success|accent; size: xs|sm|md
  - Example: <AppBadge variant="primary" size="xs">Beta</AppBadge>
