<template>
  <div id="accordion" role="tablist" aria-multiselectable="true" class="accordion">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { ref, provide, watch, onMounted, useSlots, defineProps } from 'vue';

const props = defineProps({
  animationDuration: {
    type: Number,
    default: 250,
    description: 'Collapse animation duration',
  },
  multipleActive: {
    type: Boolean,
    default: true,
    description: 'Whether you can have multiple collapse items opened at the same time',
  },
  activeIndex: {
    type: Number,
    default: -1,
    description: 'Active collapse item index',
  },
});

interface CollapseItem {
  active: boolean;
  $vnode: any;
}

const items = ref<CollapseItem[]>([]);
const slots = useSlots();

const addItem = (item: CollapseItem) => {
  const index = slots.default?.().indexOf(item.$vnode);
  if (index !== -1) {
    items.value.splice(Number(index), 0, item);
  }
};

const removeItem = (item: CollapseItem) => {
  const index = items.value.indexOf(item);
  if (index > -1) {
    items.value.splice(index, 1);
  }
};

const deactivateAll = () => {
  items.value.forEach((item) => {
    item.active = false;
  });
};

const activateItem = () => {
  if (props.activeIndex !== -1) {
    items.value[props.activeIndex].active = true;
  }
};

provide('animationDuration', props.animationDuration);
provide('multipleActive', props.multipleActive);
provide('addItem', addItem);
provide('removeItem', removeItem);
provide('deactivateAll', deactivateAll);

onMounted(() => {
  activateItem();
});

watch(
  () => props.activeIndex,
  () => {
    activateItem();
  }
);
</script>

<style scoped></style>
