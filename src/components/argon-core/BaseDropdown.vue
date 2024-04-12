<template>
  <component
    :is="tag"
    :class="dropdownClasses"
    @click="toggleDropDown"
    v-click-outside="closeDropDown"
  >
    <slot name="title-container" :is-open="isOpen.value">
      <component
        :is="titleTag"
        class="btn-rotate"
        :class="[{ 'dropdown-toggle': hasToggle }, titleClasses]"
        :aria-expanded="isOpen.value"
        data-toggle="dropdown"
      >
        <slot name="title" :is-open="isOpen.value">
          <i :class="icon"></i> {{ title }}
        </slot>
      </component>
    </slot>
    <ul class="dropdown-menu" :class="menuClassesComputed">
      <slot></slot>
    </ul>
  </component>
</template>

<script setup>
import { ref, computed, defineProps } from "vue";
import { useClickOutside } from "vue-composable";

const props = defineProps({
  tag: {
    type: String,
    default: "div",
  },
  titleTag: {
    type: String,
    default: "button",
  },
  title: String,
  direction: {
    type: String,
    default: "down",
  },
  icon: String,
  titleClasses: [String, Object, Array],
  menuClasses: [String, Object],
  menuOnRight: Boolean,
  hasToggle: {
    type: Boolean,
    default: true,
  },
});

const isOpen = ref(false);

const dropdownClasses = computed(() => [
  { show: isOpen.value },
  `drop${props.direction}`,
]);
const menuClassesComputed = computed(() => [
  { show: isOpen.value },
  { "dropdown-menu-right": props.menuOnRight },
  props.menuClasses,
]);

const toggleDropDown = () => {
  isOpen.value = !isOpen.value;
  defineEmits(["change"])(isOpen.value);
};

const closeDropDown = () => {
  isOpen.value = false;
  defineEmits(["change"])(false);
};
const { el } = useClickOutside(closeDropDown);
</script>

<style lang="scss" scoped>
.dropdown {
  cursor: pointer;
  user-select: none;
}
</style>
