<script setup>
import { ref, useFetch, useI18n } from '#imports'

const i18n = useI18n()
const localData = ref()
async function getAllMessagesByCode() {
  const { data: messages } = await useFetch('/api/i18n?localeCode=de')
  localData.value = messages.value
}
getAllMessagesByCode()
</script>

<template>
  <div>
    Nuxt module playground!
    <I18nList />
    i18n: <pre>{{ i18n.messages }}</pre>
    <button @click="$i18nData.refreshAllMessages()">
      Refresh all messages
    </button>
    localData: <pre>{{ localData }}</pre>
  </div>
</template>
