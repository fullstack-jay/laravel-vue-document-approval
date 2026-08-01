<template>
  <div class="relative">
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :id="inputId"
      v-bind="$attrs"
      :value="modelValue"
      :type="type"
      :required="required"
      :placeholder="placeholder"
      :class="inputClasses"
      @input="onInput"
      @blur="onBlur"
    />
    <p v-if="error" class="mt-1 text-sm text-red-600 dark:text-red-400">
      {{ error }}
    </p>
    <p v-else-if="hint" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    label?: string
    type?: string
    placeholder?: string
    required?: boolean
    error?: string
    hint?: string
  }>(),
  {
    type: 'text',
    required: false,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'blur'): void
}>()

const inputId = `input-${Math.random().toString(36).substr(2, 9)}`
const touched = ref(false)

const inputClasses = computed(() => {
  const base = 'block w-full rounded-lg border px-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed'

  const normal = 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100'
  const error = 'border-red-300 bg-red-50 dark:border-red-600 dark:bg-red-900/20'

  return [base, props.error ? error : normal].join(' ')
})

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function onBlur() {
  touched.value = true
  emit('blur')
}
</script>
