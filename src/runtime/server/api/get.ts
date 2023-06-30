import type { H3Event } from 'h3'
import { getQuery } from 'h3'
import { useHelper } from '../../util/helper'
import type { I18nDataApiConfig, I18nDataRaw } from '../../types'
import { getI18nData } from '../../util/google-spreadsheet'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event: H3Event | undefined): Promise<Array<I18nDataRaw> | Array<Record<string, I18nDataRaw>>> => {
  const helper = useHelper()
  const config = useRuntimeConfig()
  const moduleConfig: I18nDataApiConfig = config.i18nData.api
  if (!moduleConfig.url && !moduleConfig.google) {
    throw new Error(
      'You must add runtime config i18nData.api.url or i18nData.api.google',
    )
  }

  let headers = moduleConfig.headers || null
  if (!headers && moduleConfig.apiKey) {
    headers = {
      Authorization: moduleConfig.apiKey,
    }
  }

  const query = event ? await getQuery(event) : {}

  try {
    let apiResponse: any = []
    if (moduleConfig.google) {
      apiResponse = await getI18nData(moduleConfig.google)
    }
    else {
      if (!moduleConfig.url) {
        throw new Error(
          'Could not read build url by nuxt-i18n-data module config. Google config or any other get url must be filled',
        )
      }
      if (headers) {
        apiResponse = await $fetch(moduleConfig.url, {
          headers,
        })
      }
      else {
        apiResponse = await $fetch(moduleConfig.url)
      }
    }

    return query.raw ? apiResponse : helper.groupByLocalCode(apiResponse)
  }
  catch (error: any) {
    throw new Error(
      `Could not read response from fetch call in module nuxt-i18n-data /get: ${error}`,
    )
  }
})
