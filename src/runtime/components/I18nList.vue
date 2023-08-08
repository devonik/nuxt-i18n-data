<script lang="ts" setup>
import { reactive } from 'vue'
import { useHelper } from '../util/helper'
import type { I18nDataRaw } from '../types'
import { useFetch } from '#app'

const helper = useHelper()
const { data: rawData }: any = await useFetch('/api/i18n?raw=true')
const i18nData = reactive<Record<string, any>>(helper.groupBy(rawData.value, 'localeCode'))

function deleteAll() {
  useFetch('/api/i18n/delete', { method: 'post' })
}

function removeItemFromList(item: I18nDataRaw) {
  if (!item.localeCode)
    return
  i18nData[item.localeCode].splice(0, 1)
}

function addItemToList(newItem: I18nDataRaw) {
  if (!newItem.localeCode)
    return
  if (!i18nData[newItem.localeCode])
    i18nData[newItem.localeCode] = []
  i18nData[newItem.localeCode].push(newItem)
}
</script>

<template>
  <div>
    Neu:
    <I18nItem @created="addItemToList($event)" />
    <div v-for="localeCode in Object.keys(i18nData)" :key="localeCode">
      <h1 v-text="localeCode" />
      <ul>
        <li v-for="(item, index) in i18nData[localeCode]" :key="index">
          <I18nItem :item="item" @deleted="removeItemFromList($event)" />
        </li>
      </ul>
    </div>
    <button @click="deleteAll()">
      Delete all
    </button>
  </div>
</template>
