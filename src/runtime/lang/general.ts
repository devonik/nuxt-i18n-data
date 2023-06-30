import type { Locale } from '@nuxtjs/i18n/dist/runtime/composables'

export default defineI18nLocale(async (locale: Locale) => {
  // const messages = await get(undefined)
  return {
    goodDay: 'Guten Tag',
  }
})
