<script lang="ts" setup>
import { defineEmits, reactive } from 'vue'
import type { I18nDataRaw } from '../types'
import { useFetch } from '#app'

import { useNuxtApp } from '#imports'

const props = defineProps<{
  item?: I18nDataRaw
}>()

const emit = defineEmits<{
  (e: 'created', model: I18nDataRaw): void
  (e: 'deleted', model: I18nDataRaw): void
}>()

const nuxtApp = useNuxtApp()

const model: I18nDataRaw = reactive({
  localeCode: props.localeCode || null,
  key: null,
  value: null,

  ...props.item,
})

async function save() {
  if (model.localeCode && model.key && model.value)
    nuxtApp.$i18nData.addMessage(model.localeCode, model.key, model.value)

  emit('created', model)
}
async function deleteByKey(item: I18nDataRaw) {
  await useFetch('/api/i18n/delete', { method: 'post', body: { key: item.key } })
  emit('deleted', item)
}
</script>

<template>
  <div>
    LocaleCode <select v-model="model.localeCode">
      <option value="de">
        Deutsch
      </option>
      <option value="en">
        Englisch
      </option>
    </select>
    Key: <input v-model="model.key">
    Value: <input v-model="model.value">
    <button @click="save">
      Save
    </button>
    <button
      v-if="item"
      @click="deleteByKey(model)"
    >
      Delete
    </button>
  </div>
</template>
