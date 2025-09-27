<script setup lang="ts">
import { AppCard, AppCol, AppFieldLabel, AppInput, AppRow, AppTagInput, AppTextarea } from '@my-monorepo/ui'

const props = defineProps<{
  name: string
  archetype: string
  description: string
  traits: string
}>()

const emit = defineEmits<{
  (e: 'update:name', v: string): void
  (e: 'update:archetype', v: string): void
  (e: 'update:description', v: string): void
  (e: 'update:traits', v: string): void
}>()
</script>

<template>
  <AppCard
    variant="surface"
    overline="Identity"
    title="Who are we meeting?"
    subtitle="Establish who this statblock is and the impression it should leave."
  >
    <section class="form-section">
      <AppRow :cols="2" class="form-row">
        <AppCol>
          <AppFieldLabel icon="sword" label="Name" />
          <AppInput
            :model-value="props.name"
            @update:modelValue="v => emit('update:name', v)"
            placeholder="e.g., Acid Burrower"
          />
        </AppCol>
        <AppCol>
          <AppFieldLabel icon="book" label="Archetype" />
          <AppInput
            :model-value="props.archetype"
            @update:modelValue="v => emit('update:archetype', v)"
            placeholder="e.g., Ancient Burrowing Horror"
          />
        </AppCol>
      </AppRow>
    </section>

    <section class="form-section">
      <div class="field-stack">
        <AppFieldLabel icon="book" label="Description" />
        <AppTextarea
          :model-value="props.description"
          @update:modelValue="v => emit('update:description', v)"
          placeholder="Short descriptive blurb"
          :rows="2"
          variant="filled"
        />
      </div>
    </section>

    <section class="form-section">
      <div class="field-stack">
        <AppFieldLabel icon="info" label="Traits" />
        <AppTagInput
          :model-value="props.traits"
          @update:modelValue="v => emit('update:traits', v)"
          placeholder="Type a trait and press Enter"
        />
      </div>
    </section>
  </AppCard>
</template>
<style scoped>
.form-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: 1.1rem 1.2rem;
  border-radius: 1.1rem;
  background: color-mix(in srgb, var(--surface-veil) 66%, transparent);
  border: 1px solid color-mix(in srgb, var(--border) 26%, transparent);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.45);
}

.form-section + .form-section {
  margin-top: var(--space-md);
}

.form-row {
  gap: var(--space-md);
}

.field-stack {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
</style>
