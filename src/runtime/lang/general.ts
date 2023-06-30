import type { Locale } from '@nuxtjs/i18n/dist/runtime/composables'

export default defineI18nLocale(async (locale: Locale) => {
  console.log('defineI18nLocal for language', locale)
  // const messages = await get(undefined)
  return {
    goodDay: 'Guten Tag',
  }
})
