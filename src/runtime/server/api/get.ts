import { defineEventHandler, getQuery } from 'h3'
import type { H3Event } from 'h3'
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
      'nuxt-i18n-data: You must add runtime config i18nData.api.url or i18nData.api.google',
    )
  }

  let headers = moduleConfig.headers || null
  if (!headers && moduleConfig.apiKey) {
    headers = {
      Authorization: moduleConfig.apiKey,
    }
  }

  const query = event ? getQuery(event) : {}

  try {
    let apiResponse: any = []
    if (moduleConfig.google) {
      apiResponse = await getI18nData(moduleConfig.google)
    }
    else {
      if (!moduleConfig.url) {
        throw new Error(
          'nuxt-i18n-data: You wanted to get translation messages but runtimeConfig i18nData.api.url seems undefined',
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
      `nuxt-i18n-data: Could not read response from sever api /get: ${error}`,
    )
  }
})
