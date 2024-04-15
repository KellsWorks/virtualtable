<template>
  <component
    :is="tag"
    :class="[{ show: isOpen }, `drop${direction}`]"
    @click="toggleDropDown"
    v-click-outside="closeDropDown"
  >
    <slot name="title-container" :is-open="isOpen">
      <component
        :is="props.titleTag"
        class="btn-rotate"
        :class="[{ 'dropdown-toggle': hasToggle }, titleClasses]"
        :aria-expanded="isOpen"
        data-toggle="dropdown"
      >
        <slot name="title" :is-open="isOpen">
          <i :class="icon"></i>
          {{ title }}
        </slot>
      </component>
    </slot>
    <ul
      class="dropdown-menu"
      :class="[
        { show: isOpen },
        { 'dropdown-menu-right': menuOnRight },
        menuClasses,
      ]"
    >
      <slot></slot>
    </ul>
  </component>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps({
  tag: {
    type: String,
    default: "div",
    description: "Dropdown html tag (e.g div, ul etc)",
  },
  titleTag: {
    type: String,
    default: "button",
    description: "Dropdown title (toggle) html tag",
  },
  title: {
    type: String,
    description: "Dropdown title",
  },
  direction: {
    type: String,
    default: "down",
    description: "Dropdown menu direction (up|down)",
  },
  icon: {
    type: String,
    description: "Dropdown icon",
  },
  titleClasses: {
    type: [String, Object, Array],
    description: "Title css classes",
  },
  menuClasses: {
    type: [String, Object],
    description: "Menu css classes",
  },
  menuOnRight: {
    type: Boolean,
    description: "Whether menu should appear on the right",
  },
  hasToggle: {
    type: Boolean,
    description: "Whether dropdown has arrow icon shown",
    default: true,
  },
});

const isOpen = ref<boolean>(false);

const toggleDropDown = () => {
  isOpen.value = !isOpen.value;
  emit("change", isOpen.value);
};

const closeDropDown = () => {
  isOpen.value = false;
  emit("change", false);
};

const emit = defineEmits(["change"]);
</script>

<style lang="scss" scoped>
.dropdown {
  cursor: pointer;
  user-select: none;
}
</style>
