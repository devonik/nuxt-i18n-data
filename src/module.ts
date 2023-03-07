import { defineNuxtModule, addPlugin, createResolver, addServerHandler, addComponent } from '@nuxt/kit'
import { ofetch } from 'ofetch'
import { useHelper } from './runtime/helper'
import { i18nDataDto } from './runtime/types'
const helper = useHelper()

// Module options TypeScript inteface definition

interface I18nDataGoogleOptions{
  apiKey?: string,
  spreadsheetId?: string
}
interface I18nDataApiOptions {
  url?: string,
  apiKey?: string,
  headers?: any,
  google?: I18nDataGoogleOptions
}
export interface I18nDataOptions {
  api: I18nDataApiOptions
}

export default defineNuxtModule<I18nDataOptions>({
  meta: {
    name: 'nuxt-i18n-data',
    configKey: 'i18nData'
  },
  // Default configuration options of the Nuxt module
  defaults: {
    api: {

    }
  },
  setup(options, nuxt) {
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
      const messages = await fetchApi(options.api)
      additionalMessages.push(messages)
    })
  }
})

async function fetchApi(config: I18nDataApiOptions){
  if(!config) throw new Error('Missing module config for "i18nData"')
    if(!config.url && !config.google) throw new Error('Missing module config key "i18nData.url" or "i18nData.google"')

    if(config.google && !config.google.apiKey) throw new Error('Missing module config key "i18nData.google.apiKey"')

    let isGoogleConfig = false
    let url = config.url
    if(config.google) {
        isGoogleConfig = true
        url = `https://sheets.googleapis.com/v4/spreadsheets/${config.google.spreadsheetId}/values:batchGet?ranges=A1:AC1&ranges=A2:AC1000&key=${config.google.apiKey}`
    }

    let headers = config.headers || null
    if(!headers && config.apiKey) {
        headers = {
            'Authorization': config.apiKey
        }
    }
        
    try{
        let apiResponse: any = null
        if(headers) apiResponse = await ofetch(url, {
            headers
        })
        else apiResponse = await ofetch(url)

        if(isGoogleConfig){
            const spreadsheetHeaders = apiResponse.valueRanges[0]
            const spreadsheetValues = apiResponse.valueRanges[1]
            if(!spreadsheetHeaders) throw new Error("Could not read response.valueRanges[0] from fetch call in module nuxt-i18n-data /get")
            else if(!spreadsheetValues) throw new Error("Could not read response.valueRanges[1] from fetch call in module nuxt-i18n-data /get")
    
            const headerValues = spreadsheetHeaders.values[0]
            const messages: Array<i18nDataDto> = []
            headerValues.forEach((header: string, headerIndex: number) => {
                if(headerIndex === 0) return
                
                spreadsheetValues.values.forEach(values => {
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
        throw new Error("Could not read response from fetch call in module nuxt-i18n-data /get: " + error)
    }
}
