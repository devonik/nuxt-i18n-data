<script setup>
import { useI18n } from '#imports'

const i18n = useI18n()
</script>

<template>
  <div>
    Nuxt module playground!
    <I18nList />
    i18n: <pre>{{ i18n.messages }}</pre>
    <button @click="$i18nData.refreshAllMessages()">
      Refresh all messages
    </button>
  </div>
</template>
