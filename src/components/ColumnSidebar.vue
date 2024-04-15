<template>
  <div v-click-outside="close" ref="sidebar" class="sidebar d-inline-block">
    <transition name="slide">
      <div v-show="isOpen" class="columns-overlay">
        <card class="h-100 overflow-auto rounded-0">
          <template #header="{ reset, close }">
            <div class="d-flex align-items-center">
              <h3 class="flex-fill mb-0">Kolommen</h3>
              <base-button type="info" size="sm" @click="reset"
                >Reset</base-button
              >
              <base-button type="warning" size="sm" @click="close"
                >Sluiten</base-button
              >
            </div>
          </template>
          <div class="d-flex justify-content-stretch flex-column">
            <slot></slot>
            <VueDraggableNext
              class="list-group"
              tag="ul"
              v-model="cache"
              v-bind="dragOptions"
              @start="drag = true"
              @end="drag = false"
            >
              <transition-group
                type="transition"
                :name="!drag ? 'flip-list' : ''"
              >
                <li
                  v-for="column in cache"
                  :key="column.order || column.label"
                  class="list-group-item p-2 d-flex align-items-center justify-content-between"
                >
                  <base-checkbox v-model="column.enabled">{{
                    column.label
                  }}</base-checkbox>
                  <badge v-if="column.isDefault" type="primary"
                    >Standaard</badge
                  >
                </li>
              </transition-group>
            </VueDraggableNext>
            <button class="btn btn-success mx-1 mt-3" @click="update">
              Toepassen
            </button>
          </div>
        </card>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineProps, defineEmits } from "vue";
import { VueDraggableNext } from "vue-draggable-next";

const props = defineProps<{
  name?: string;
  value: any[];
  headers: { label: string; isDefault: boolean }[];
}>();

const emit = defineEmits(["input", "open", "close"]);

const drag = ref(false);
const isOpen = ref(false);
const cache = ref<
  { label: string; enabled: boolean; isDefault: boolean; order?: number }[]
>([]);

const dragOptions = computed(() => ({
  animation: 200,
  group: "description",
  disabled: false,
  ghostClass: "ghost",
}));

const filterName = computed(() => "columns");

const reset = () => {
  cache.value = props.headers.map(({ label, isDefault }) => ({
    label,
    enabled: isDefault,
    isDefault,
  }));
};

const update = () => {
  emit(
    "input",
    cache.value.filter((c) => c.enabled)
  );
  save();
  close();
};

const close = () => {
  isOpen.value = false;
  emit("close");
};

const save = () => {
  if (!props.name) return;
  localStorage.setItem(filterName.value, JSON.stringify(cache.value));
};

const load = () => {
  if (!props.name) return update();
  try {
    const columns = localStorage.getItem(filterName.value);
    if (columns) cache.value = JSON.parse(columns);

    const cacheData = props.headers.map(({ label, isDefault }) => {
      const i = cache.value.findIndex((c) => c.label === label);
      const item = cache.value[i] || { label, enabled: isDefault };
      item.order = i < 0 ? cache.value.length : i;
      item.isDefault = isDefault;
      return item;
    });
    cacheData.sort((a: any, b: any) => a.order - b.order);
    cache.value = cacheData;
  } catch (error) {
    console.error(error);
    save();
  }
  update();
};

onMounted(() => {
  reset();
  load();
});
</script>

<style>
.sidebar {
  z-index: 3000;
}

.columns-overlay {
  /* padding-top: 100px; */
  /* padding: 1rem; */
  text-align: left;
  z-index: 100;
  position: fixed;
  /* background-color: white; */
  top: 0;
  right: 0;
  bottom: 0;
  width: 400px;
}

.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #afafaf;
}
.list-group {
  min-height: 10px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
</style>
