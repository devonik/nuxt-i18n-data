import type { H3Event } from 'h3'
import { defineEventHandler, readBody } from 'h3'
import type { I18nDataApiConfig } from '../../types'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event: H3Event): Promise<any> => {
  const config = useRuntimeConfig()
  const moduleConfig: I18nDataApiConfig = config.i18nData.api
  if (!moduleConfig.url && !moduleConfig.google) {
    throw new Error(
      'nuxt-i18n-data: You must add runtime config i18nData.api.url or i18nData.api.google',
    )
  }

  let headers = moduleConfig.headers || null
  if (!headers && moduleConfig.apiKey) {
    headers = {
      Authorization: moduleConfig.apiKey,
    }
  }

  const body = await readBody(event)
  if (!body) {
    // TODO want to delete all
  }

  try {
    let apiResponse
    if (moduleConfig.google) {
      console.warn('nuxt-i18n-data: You wanted to delete translation message but there is no implementation yet for post to google provider. Consider remove runtimeConfig i18nData.api.google or wait for implementation')
      return 'Not implemented'
    }
    else {
      if (!moduleConfig.url) {
        throw new Error(
          'nuxt-i18n-data: You wanted to delete translation message but runtimeConfig i18nData.api.url seems undefined',
        )
      }
      if (headers) {
        apiResponse = await $fetch(moduleConfig.url, {
          headers,
          method: 'delete',
        })
      }
      else {
        apiResponse = await $fetch(moduleConfig.url, {
          method: 'delete',
        })
      }
    }

    return apiResponse
  }
  catch (error: any) {
    throw new Error(
      `nuxt-i18n-data: Could not read response from sever api /delete: ${error}`,
    )
  }
})
