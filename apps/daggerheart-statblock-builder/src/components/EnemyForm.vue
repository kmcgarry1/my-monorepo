<script setup lang="ts">
import { computed } from 'vue'
import type { Enemy } from '../types'
import AttackEditorList from './AttackEditorList.vue'
import FeatureEditorList from './FeatureEditorList.vue'
import { openGlossary } from '../lib/glossaryState'
import AppCard from './ui/AppCard.vue'
import AppRow from './ui/AppRow.vue'
import AppCol from './ui/AppCol.vue'
import AppInput from './ui/AppInput.vue'
import AppSelect from './ui/AppSelect.vue'
import AppFieldLabel from './ui/AppFieldLabel.vue'
import AppIconButton from './ui/AppIconButton.vue'

const props = defineProps<{ enemy: Enemy }>()

const thresholdsOk = computed(() => !props.enemy.thresholds || /^\s*\d+\s*\/\s*\d+\s*$/.test(props.enemy.thresholds))
</script>

<template>
  <AppCard title="Enemy">
    <AppRow :cols="3">
      <AppCol>
        <AppFieldLabel label="Rank" />
        <AppSelect :model-value="props.enemy.rank" @update:modelValue="v => props.enemy.rank = v as any" :options="[{label:'', value:''}, {label:'Minion', value:'Minion'},{label:'Standard',value:'Standard'},{label:'Elite',value:'Elite'},{label:'Boss',value:'Boss'},{label:'Solo',value:'Solo'}]" />
      </AppCol>
      <AppCol>
        <AppFieldLabel label="Difficulty" />
        <AppInput type="number" :model-value="props.enemy.difficulty" @update:modelValue="v => props.enemy.difficulty = v" min="0" placeholder="e.g., 14" />
      </AppCol>
      <AppCol>
        <AppFieldLabel label="Thresholds">
          <AppIconButton name="info" variant="ghost" size="xs" title="Thresholds" @click="openGlossary('thresholds')" />
        </AppFieldLabel>
        <AppInput :model-value="props.enemy.thresholds" @update:modelValue="v => props.enemy.thresholds = v" placeholder="e.g., 8/15" :invalid="!thresholdsOk" />
        <small v-if="!thresholdsOk" style="color:#e11d48;">Use format like 8/15 (Stage/Severe)</small>
      </AppCol>
    </AppRow>

    <AppRow :cols="3" class="mt-3">
      <AppCol>
        <AppFieldLabel label="HP">
          <AppIconButton name="info" variant="ghost" size="xs" title="Health" @click="openGlossary('hp')" />
        </AppFieldLabel>
        <AppInput type="number" :model-value="props.enemy.hp" @update:modelValue="v => props.enemy.hp = v" min="0" placeholder="e.g., 8" />
      </AppCol>
      <AppCol>
        <AppFieldLabel label="Stress">
          <AppIconButton name="info" variant="ghost" size="xs" title="Stress" @click="openGlossary('stress')" />
        </AppFieldLabel>
        <AppInput type="number" :model-value="props.enemy.stress" @update:modelValue="v => props.enemy.stress = v" min="0" placeholder="e.g., 3" />
      </AppCol>
      <AppCol>
        <AppFieldLabel label="ATK Bonus">
          <AppIconButton name="info" variant="ghost" size="xs" title="Attack" @click="openGlossary('attack')" />
        </AppFieldLabel>
        <AppInput type="number" :model-value="props.enemy.atkBonus" @update:modelValue="v => props.enemy.atkBonus = v" placeholder="e.g., 3" />
      </AppCol>
    </AppRow>

    <AttackEditorList v-model="props.enemy.attacks" />

    <div class="mt-3">
      <AppFieldLabel label="Experience" />
      <AppInput :model-value="props.enemy.experience" @update:modelValue="v => props.enemy.experience = v" placeholder="e.g., Tremor Sense +2" />
    </div>

    <div class="mt-3">
      <AppFieldLabel label="Motives & Tactics">
        <AppIconButton name="info" variant="ghost" size="xs" title="Tactics" @click="openGlossary('tactics')" />
      </AppFieldLabel>
      <AppInput :model-value="props.enemy.tactics" @update:modelValue="v => props.enemy.tactics = v" placeholder="e.g., Burrow, drag away, feed, reposition" />
    </div>

    <FeatureEditorList v-model="props.enemy.features" />
  </AppCard>
</template>
