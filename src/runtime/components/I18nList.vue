<script lang="ts" setup>
import { useHelper } from '../util/helper'
import { useFetch } from '#app'

const helper = useHelper()
const { data: rawData }: any = await useFetch('/api/i18n?raw=true')
const i18nData = helper.groupBy(rawData.value, 'localeCode')

function deleteAll() {
  useFetch('/api/i18n/delete', { method: 'post' })
}

function removeItemFromList(item) {
  i18nData.value[item.localeCode].splice(0, 1)
}

function addItemToList(newItem) {
  if (!i18nData.value[newItem.localeCode])
    i18nData.value[newItem.localeCode] = []
  i18nData.value[newItem.localeCode].push(newItem)
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
