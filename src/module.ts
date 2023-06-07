import {
  addComponent,
  addPlugin,
  addServerHandler,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit'
import { ofetch } from 'ofetch'
import { defu } from 'defu'
import { useHelper } from './runtime/util/helper'
import type {
  I18nDataApiConfig,
  I18nDataConfig,
} from './runtime/types'

import { getI18nData } from './runtime/util/google-spreadsheet'

const helper = useHelper()

export default defineNuxtModule<I18nDataConfig>({
  meta: {
    name: 'nuxt-i18n-data',
    configKey: 'i18nData',
  },
  // Default configuration options of the Nuxt module
  defaults: {
    api: {},
  },
  setup(config, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolver.resolve('./runtime/plugin'))

    // TODO temporary disabled because it cannot be resolved. bug is known here https://github.com/nuxt/nuxt/issues/18909
    addServerHandler({
      route: '/api/i18n',
      handler: resolver.resolve('./runtime/server/api/get'),
      lazy: true,
    })
    /* addServerHandler({
      route: '/api/i18n',
      handler: resolver.resolve('./runtime/server/api/post'),
    }) */
    /* addServerHandler({
      route: '/api/i18n/delete',
      handler: resolver.resolve('./runtime/server/api/delete'),
      lazy: true
    }) */
    addComponent({
      name: 'I18nItem',
      filePath: resolver.resolve('./runtime/components/I18nItem'),
    })
    addComponent({
      name: 'I18nList',
      filePath: resolver.resolve('./runtime/components/I18nList'),
    })

    nuxt.hook('i18n:registerModule', (register: any) => {
      register({
        // langDir path needs to be resolved
        langDir: resolver.resolve('./runtime/lang'),
        experimental: {
          jsTsFormatResource: true
        },
        locales: [
          {
            code: 'de',
            file: 'general.ts',
          },
          {
            code: 'en',
            file: 'general.ts',
          },
        ]
      })
    })

    // Assign module options to run time cause we need it in server handler
    nuxt.options.runtimeConfig.i18nData = defu(nuxt.options.runtimeConfig.i18nData, config)
  },
})

async function fetchApi(config: I18nDataApiConfig) {
  /* const googleConfig = helper.getGoogleRuntimeConfig(config);
  if (!config) throw new Error('You must add runtime config "i18nData.api"'); */
  if (!config.url && !config.google) {
    throw new Error(
      'You must add runtime config i18nData.api.url or i18nData.api.google',
    )
  }

  let headers = config.headers || null
  if (!headers && config.apiKey) {
    headers = {
      Authorization: config.apiKey,
    }
  }

  try {
    let apiResponse: any = []
    if (config.google) {
      apiResponse = await getI18nData(config.google)
    }
    else {
      if (!config.url) {
        throw new Error(
          'Could not read build url by nuxt-i18n-data module config. Google config or any other get url must be filled',
        )
      }

      if (headers) {
        apiResponse = await ofetch(config.url, {
          headers,
        })
      }
      else { apiResponse = await ofetch(config.url) }
    }

    return helper.groupByLocalCode(apiResponse)
  }
  catch (error: any) {
    throw new Error(
      `Could not read response from fetch call in module nuxt-i18n-data fetchApi: ${
        error}`,
    )
  }
}
