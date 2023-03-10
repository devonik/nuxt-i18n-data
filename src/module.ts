import { defineNuxtModule, addPlugin, createResolver, addServerHandler, addComponent } from '@nuxt/kit'
import { ofetch } from 'ofetch'
import { useHelper } from './runtime/helper'
import { i18nDataDto, I18nDataConfig, I18nDataApiConfig } from './runtime/types'
const helper = useHelper()

export default defineNuxtModule<I18nDataConfig>({
  meta: {
    name: 'nuxt-i18n-data',
    configKey: 'i18nData'
  },
  // Default configuration options of the Nuxt module
  defaults: {
    api: {

    }
  },
  setup(config, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'))
    addServerHandler({
      route: '/api/i18n',
      method: 'get',
      handler: resolver.resolve('./runtime/server/api/get.ts')
    })
    addServerHandler({
      route: '/api/i18n',
      method: 'post',
      handler: resolver.resolve('./runtime/server/api/post.ts')
    })
    addServerHandler({
      route: '/api/i18n/delete',
      handler: resolver.resolve('./runtime/server/api/delete.ts')
    })
    addComponent({
      name: 'I18nItem',
      filePath: resolver.resolve('./runtime/components/I18nItem')
    })
    addComponent({
      name: 'I18nList',
      filePath: resolver.resolve('./runtime/components/I18nList')
    })
    
    //Extend vue i18n messages initial
    nuxt.hook('i18n:extend-messages', async (additionalMessages, localeCodes) => {
      const messages = await fetchApi(config.api)
      additionalMessages.push(messages)
    })
  }
})

async function fetchApi(config: I18nDataApiConfig){
  const googleConfig = helper.getGoogleRuntimeConfig(config)
    if(!config) throw new Error('You must add runtime config "i18nData.api"')
    else if(!config.url && !googleConfig) throw new Error('You must add runtime config i18nData.api.url or i18nData.api.google')

    let headers = config.headers || null
    if(!headers && config.apiKey) {
        headers = {
            'Authorization': config.apiKey
        }
    }
        
    try{
      const url = googleConfig ? googleConfig.getUrl : config.url
      if(!url) throw new Error("Could not read build url by nuxt-i18n-data module config. Google sheet api url or any other get url must be filled")
      let apiResponse: any = null
      if(headers) apiResponse = await ofetch(url, {
          headers
      })
      else apiResponse = await ofetch(url)

      if(googleConfig){
          const spreadsheetHeaders = apiResponse.valueRanges[0]
          const spreadsheetValues = apiResponse.valueRanges[1]
          if(!spreadsheetHeaders) throw new Error("Could not read response.valueRanges[0] from fetch call in module nuxt-i18n-data /get")
          else if(!spreadsheetValues) throw new Error("Could not read response.valueRanges[1] from fetch call in module nuxt-i18n-data /get")
  
          const headerValues = spreadsheetHeaders.values[0]
          const messages: Array<i18nDataDto> = []
          headerValues.forEach((header: string, headerIndex: number) => {
              if(headerIndex === 0) return
              
              spreadsheetValues.values.forEach((values: Array<string>) => {
                  if(!values[0] || !values[headerIndex]) return
                  messages.push({
                      key: values[0],
                      value: values[headerIndex],
                      localeCode: header.toLowerCase()
                  })
              })
          })
          return helper.groupByLocalCode(messages)
      }

      return helper.groupByLocalCode(apiResponse)
    }catch (error: any){
        throw new Error("Could not read response from fetch call in module nuxt-i18n-data fetchApi: " + error)
    }
}
