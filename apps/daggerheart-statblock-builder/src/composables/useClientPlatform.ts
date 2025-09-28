import { computed, onMounted, ref } from 'vue'

export function useClientPlatform() {
  const isBrowser = ref(false)
  const isMobileBrowser = ref(false)

  onMounted(() => {
    isBrowser.value = typeof window !== 'undefined'
    if (!isBrowser.value) return

    const userAgent = window.navigator?.userAgent ?? ''
    const platform = window.navigator?.platform ?? ''
    const mobileRegex = /android|iphone|ipad|ipod|iemobile|mobile|blackberry|webos|windows phone/i
    const appleMobilePlatforms = ['iPhone', 'iPad', 'iPod']

    const matchesMobile = mobileRegex.test(userAgent) || appleMobilePlatforms.includes(platform)
    isMobileBrowser.value = matchesMobile
  })

  const isDesktopBrowser = computed(() => isBrowser.value && !isMobileBrowser.value)

  return {
    isBrowser: computed(() => isBrowser.value),
    isMobileBrowser: computed(() => isMobileBrowser.value),
    isDesktopBrowser,
  }
}
