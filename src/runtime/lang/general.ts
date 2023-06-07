import  {H3Event, EventHandlerResponse } from 'h3'
import get from '../server/api/get'
export default defineI18nLocale(async (locale: string) => {
    console.log("try to get i18n messages for locale", locale)
    const messages = await get(undefined)
    console.log("loaded messages", messages)
  })