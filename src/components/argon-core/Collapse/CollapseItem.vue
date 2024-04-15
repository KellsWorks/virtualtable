<template>
  <div class="card">
    <div role="tab" class="card-header" :aria-expanded="active">
      <a
        data-toggle="collapse"
        data-parent="#accordion"
        :href="`#${itemId}`"
        @click.prevent="activate"
        :aria-controls="`content-${itemId}`"
      >
        <slot name="title">
          {{ title }}
        </slot>
        <i class="tim-icons icon-minimal-down"></i>
      </a>
    </div>
    <collapse-transition :duration="animationDuration">
      <div
        v-show="active"
        :id="`content-${itemId}`"
        role="tabpanel"
        :aria-labelledby="title"
        class="collapsed"
      >
        <div class="card-body">
          <slot></slot>
        </div>
      </div>
    </collapse-transition>
  </div>
</template>

<script lang="ts" setup>
import { ref, inject, onMounted, onUnmounted, computed, defineProps } from "vue";
import { CollapseTransition } from "vue3-transitions";

const props = defineProps({
  title: {
    type: String,
    default: "",
    description: "Collapse item title",
  },
  id: String,
});

const animationDuration = inject("animationDuration", 250);
const multipleActive = inject("multipleActive", false);
const addItem = inject("addItem", () => {});
const removeItem = inject("removeItem", () => {});
const deactivateAll = inject("deactivateAll", () => {});

const itemId = computed(() => props.id || props.title);
const active = ref(false);

const activate = () => {
  let wasActive = active.value;
  if (!multipleActive) {
    deactivateAll();
  }
  active.value = !wasActive;
};

onMounted(() => {
  addItem({ active: active.value, $vnode: null });
});

onUnmounted(() => {
  removeItem({ active: active.value, $vnode: null });
});
</script>

<style></style>
