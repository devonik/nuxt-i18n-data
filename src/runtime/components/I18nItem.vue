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
<script lang="ts" setup>
    import { useFetch } from "#app";
    import { reactive } from "vue";
    import { i18nDataDto } from '../types'
    import { defineEmits } from 'vue' 
    import { useNuxtApp, createError } from '#imports'  
    const nuxtApp = useNuxtApp()

    const emit = defineEmits<{
        (e: 'created', model: i18nDataDto): void
        (e: 'deleted', model: i18nDataDto): void
    }>()

    const props = defineProps<{
        item?: i18nDataDto
    }>()

    const model: i18nDataDto = reactive({
        localeCode: props.localeCode || null,
        key: null,  
        value: null,

        ...props.item
    })
    
    async function save() {
        if(model.localeCode && model.key && model.value){
            nuxtApp.$i18nData.addMessage(model.localeCode, model.key, model.value)
        }

        emit('created', model)

    }
    async function deleteByKey(item: i18nDataDto){
      await useFetch('/api/i18n/delete', { method: 'post', body: { key: item.key } })
      emit('deleted', item)
    }
</script>
