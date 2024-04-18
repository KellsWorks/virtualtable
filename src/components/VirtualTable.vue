<template>
  <div class="shadow rounded">
    <div class="w-full p-4 border-b flex items-center justify-between">
      <h3 class="text-lg">Er zijn in totaal 659 resultaten</h3>
      <div class="flex items-center space-x-3"></div>
    </div>
    <div class="w-100 flex items-center">
      <div class="virtual__header" v-if="selectable">
        <input type="checkbox" @change="selectAll" class="mx-2" />
      </div>
      <div v-if="isDev()" class="virtual__header" style="width: 50px">###</div>
      <div
        v-for="header in sortedHeaders"
        :key="header.label"
        class="virtual__header"
        :class="{ sortable: header.sort }"
        :style="`width:${header.width || minWidth};`"
        @click="
          () => {
            if (header.sort) sortBy(header.sort || header.prop);
          }
        "
      >
        <span>{{ header.label }}</span>
        <template v-if="header.prop && header.prop === sort.prop">
          <i
            class="fa mx-2"
            :class="{
              'fa-chevron-up': sort.direction === 'ASC',
              'fa-chevron-down': sort.direction !== 'ASC',
            }"
          />
        </template>
      </div>
    </div>
    <DynamicScroller
      :items="props.items"
      :min-item-size="27"
      :buffer="500"
      class="scroller"
      style="height: 620px"
    >
      <template v-slot="{ item, index, active }">
        <DynamicScrollerItem
          :item="item"
          :active="active"
          :size-dependencies="[item.items, item.image, item.products]"
          :data-index="item.id || index"
        >
          <div class="virtual__row">
            <div
              class="virtual__column"
              v-if="selectable"
              @click="select(item)"
            >
              <input
                type="checkbox"
                class="mx-2"
                v-model="selected"
                :value="item.id"
              />
            </div>
            <div v-if="isDev()" class="virtual__column" style="width: 50px">
              <p>{{ index + 1 }}</p>
            </div>
            <virtual-column
              v-for="header in sortedHeaders"
              :key="header.label"
              :column="header"
              :item="item"
              :style="`width:${header.width || minWidth};`"
              @input="(v: any) => emits('input', { [header.prop]: v, id: item.id })"
            />
          </div>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>

<script setup lang="ts">
import { Header } from "@/types";
import { defineProps, defineEmits, computed, ref } from "vue";
import VirtualColumn from "./VirtualColumn.vue";

const emits = defineEmits(["update:sort", "update:selected", "input"]);
const props = defineProps({
  name: String,
  noSearch: Boolean,
  noFilters: Boolean,
  hasNoFilters: Boolean,
  search: String,
  loading: Boolean,
  loadingStep: String,
  noResultsText: String,
  totalItems: {
    type: Number,
    default: () => 0,
  },
  maxItems: {
    type: Number,
    default: () => 5000,
  },
  selectable: {
    type: Boolean,
    default: () => true,
  },
  exportable: Boolean,
  headers: {
    type: Array,
    default: () => [{ label: "ID" }],
  },
  selectedHeaders: {
    type: Array,
    default: () => [],
    required: false,
  },
  items: {
    type: Array,
    default: () =>
      new Array(100000).fill(null).map((item, index) => "Item " + (index + 1)),
  },
  params: {
    type: Object,
    default: () => ({}),
  },
  filters: {
    type: Object,
    default: () => ({}),
  },
  sort: {
    type: Object,
    default: () => ({
      prop: "id",
      direction: "ASC",
    }),
  },
});

const selected = ref();

const sortedHeaders = computed(() => {
  const findHeader = (headerLabel: string) => {
    return (
      props.headers.find((header: any) => header.label === headerLabel) || {}
    );
  };

  return props.selectedHeaders.map((headerLabel) =>
    findHeader(String(headerLabel))
  ) as Header[];
});

const minWidth = computed(() => {
  return (1 / props.headers.length) * 100 + "%;";
});

const isDev = (): Boolean => {
  return process.env.NODE_ENV !== "production";
};

const sortBy = (prop: any) => {
  const direction =
    prop === props.sort.prop
      ? props.sort.direction === "ASC"
        ? "DESC"
        : "ASC"
      : props.sort.direction;
  const sort = {
    direction,
    prop,
  };
  emits("update:sort", sort);
};

const selectAll = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.checked) {
    selected.value = props.items.map((i: any) => i.id);
  } else {
    selected.value = [];
  }
};

const select = (item: any): void => {
  const index = selected.value.indexOf(item.id);
  if (index > -1) selected.value.splice(index, 1);
  else selected.value.push(item.id);

  emits("update:selected", selected.value);
};
</script>

<style>
.virtual__header {
  padding: 0.4rem 0.2rem;
  background-color: rgb(235, 235, 235);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.virtual__header.sortable:hover {
  cursor: pointer;
  background-color: rgb(211, 211, 211);
}

.virtual__row {
  overflow: visible;
  z-index: 0;
  min-width: 100%;
  display: inline-flex;
  align-items: stretch;
}

.viewport {
  background: #fefefe;
  overflow-y: auto;
}

.min-w-100 {
  min-width: 100%;
}
</style>
