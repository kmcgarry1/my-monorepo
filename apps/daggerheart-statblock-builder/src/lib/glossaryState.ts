import { ref } from 'vue'

export const glossaryOpen = ref(false)
export const glossaryTerm = ref<string | null>(null)

export function openGlossary(term?: string) {
  glossaryTerm.value = term ?? null
  glossaryOpen.value = true
}

export function closeGlossary() {
  glossaryOpen.value = false
}

