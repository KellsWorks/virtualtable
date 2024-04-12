<template>
  <component
    :is="tag"
    :type="tag === 'button' ? nativeType : ''"
    :disabled="isDisabled"
    @click="handleClick"
    class="btn"
    :class="buttonClasses"
  >
    <slot name="loading">
      <i v-if="loading" class="fas fa-spinner fa-spin"></i>
    </slot>
    <template v-if="link">
      <nuxt-link :to="link"><slot /></nuxt-link>
    </template>
    <template v-else>
      <slot />
    </template>
  </component>
</template>

<script setup>
import { computed, defineProps, defineEmits } from 'vue';

const props = defineProps({
  tag: {
    type: String,
    default: 'button',
  },
  round: Boolean,
  icon: Boolean,
  block: Boolean,
  loading: Boolean,
  wide: Boolean,
  disabled: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'default',
  },
  nativeType: {
    type: String,
    default: 'button',
  },
  size: {
    type: String,
    default: '',
  },
  outline: Boolean,
  link: String,
});

const emit = defineEmits(['click']);

const isDisabled = computed(() => props.disabled || props.loading);
const buttonClasses = computed(() => [
  { 'rounded-circle': props.round },
  { 'btn-block': props.block },
  { 'btn-wd': props.wide },
  { 'btn-icon btn-fab': props.icon },
  { [`btn-${props.type}`]: props.type && !props.outline },
  { [`btn-${props.size}`]: props.size },
  { [`btn-outline-${props.type}`]: props.outline && props.type },
  { disabled: props.disabled && props.tag !== 'button' },
]);

const handleClick = (evt) => {
  emit('click', evt);
};
</script>

<style scoped lang="scss">
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  :deep(i) {
    padding: 0 3px;
  }
}
</style>
