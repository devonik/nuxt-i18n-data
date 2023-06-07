import type { Locale } from '@nuxtjs/i18n/dist/runtime/composables'
import get from '../server/api/get'

export default defineI18nLocale(async (locale: Locale) => {
  const messages = await get(undefined)
})
