<template>
  <div>
    <div class="px-3 d-flex justify-content-between align-items-center mb-2">
      <p class="pt-4" @click="() => updateParams()">
        <span v-if="loadingStep">
          <i class="fa fa-redo fa-spin mr-2" />
          {{ loadingStep }}
        </span>
        <template v-else>
          Er zijn in totaal {{ items.length || totalItems }} resultaten
          <template v-if="selected.length > 0"
            >({{ selected.length }} geselecteerd)</template
          >
        </template>
      </p>
      <ColumnSidebar
        v-model="selectedHeaders"
        :headers="props.headers"
        :name="name"
        ref="columns"
      />
      <div class="d-flex align-items-center">
        <slot name="header" />
        <el-tooltip v-if="exportable" effect="dark" content="Data Exporteren">
          <base-button
            :disabled="selected.length === 0"
            target="_blank"
            size="md"
            type="primary"
            outline
            @click="showExport"
            ><i class="fa fa-download"></i
          ></base-button>
        </el-tooltip>
        <label v-if="!noFilters" class="d-flex aling-items-center mt-3 mx-4">
          <div class="mr-1">Filters</div>
          <base-switch
            ref="switch"
            v-model="filtersEnabled"
            on-text="Aan"
            off-text="Uit"
          ></base-switch>
        </label>
        <base-input
          v-if="!noSearch"
          v-model="searchValue"
          prepend-icon="fa fa-search"
          placeholder="Type om te zoeken"
          hide-feedback
          @keypress.enter.prevent
        ></base-input>
      </div>
    </div>
    <div class="overflow-x-auto max-w-100">
      <div
        class="d-inline-block"
        style="position: relative"
        v-loading="loading || loadingStep"
      >
        <div class="d-inline-flex min-w-100">
          <div class="virtual__header" v-if="selectable">
            <input type="checkbox" @change="selectAll" class="mx-2" />
          </div>
          <div v-if="isDev" class="virtual__header" style="width: 50px">
            ###
          </div>
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
        <div
          v-if="!loading && (!items.length || items.length > maxItems)"
          class="d-flex flex-column justify-content-center"
          style="
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            min-width: 100%;
            width: 100%;
            padding-left: 15vw;
          "
        >
          <h2 v-if="items.length > maxItems || totalItems > maxItems">
            Het is niet aan te raden om meer dan {{ maxItems }} resultaten te
            tonen omdat hierdoor je browser of zelfs hele computer vast kan
            lopen.<br />Gebruik de filters of een zoekterm om de resultaten te
            beperken
          </h2>
          <h2 v-else-if="hasNoFilters">
            Er zijn geen filters ingesteld of de zoekterm is te kort.<br />Klik
            op de knop 'Filters' rechtsboven om te beginnen.
          </h2>
          <h2 v-else>Er zijn geen resultaten gevonden</h2>
          <button

            class="btn btn-primary"
            @click="() => handleSwitchRef"
          >
            Filters uitschakelen
          </button>
        </div>

        <div style="height: 620px">
          <DynamicScroller
            :items="items"
            :min-item-size="27"
            :buffer="500"
            @scroll="hideModal"
            class="scroller"
            style="height: 620px"
            v-if="items.length <= maxItems"
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
                  <div v-if="isDev" class="virtual__column" style="width: 50px">
                    <p>{{ index + 1 }}</p>
                  </div>
                  <virtual-column
                    v-for="header in sortedHeaders"
                    :key="header.label"
                    :column="header"
                    :item="item"
                    :style="`width:${header.width || minWidth};`"
                    @input="
                      (v: any) => emits('input', { [header.prop]: v, id: item.id })
                    "
                  />
                </div>
              </DynamicScrollerItem>
            </template>
          </DynamicScroller>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineProps, defineEmits, Ref } from "vue";
import ColumnSidebar from '@/components/ColumnSidebar.vue';
import { BaseButton, BaseSwitch } from "@/components/argon-core"
import { useRouter } from "vue-router";
import { Header } from "@/types";
import { isValid, parseISO } from 'date-fns';
import downloadString, { dateTimeFormat} from "@/utils/functions"


const props = defineProps({
  name: {
    type: String,
    required: false,
  },
  noSearch: {
    type: Boolean,
    required: false,
  },
  noFilters: {
    type: Boolean,
    required: false,
  },
  hasNoFilters: {
    type: Boolean,
    required: false,
  },
  search: {
    type: String,
    required: false,
  },
  loading: {
    type: Boolean,
    required: false,
  },
  loadingStep: {
    type: String,
    required: false,
  },
  noResultsText: {
    type: String,
    required: false,
  },
  totalItems: {
    type: Number,
    default: 0,
  },
  maxItems: {
    type: Number,
    default: 5000,
  },
  selectable: {
    type: Boolean,
    default: true,
  },
  exportable: Boolean,
  headers: {
    type: Array,
    default: () => [{ label: "ID" }],
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
  }
});

const emits = defineEmits([
  'params',
  'selected',
  'sort',
  'update:sort',
  'input'
]);

const router = useRouter();

const filtersEnabled = ref(true);
const searchValue = ref("");
const selected: Ref<string[]> = ref([]);
const selectedHeaders = ref([]);
const columns = ref()
const switchRef = ref();

const handleSwitchRef = () => {
  if (switchRef.value) {
    switchRef.value.click();
  }
};

const sortedHeaders = computed((): any[] => {
  const findHeader = (header: Header) =>
    props.headers.find((label) => header.label == label.label) || {};
  return selectedHeaders.value.map(findHeader);
});


const itemsAsCSV = () => {
  let csv = sortedHeaders.value.map((header) => header.label).join(",") + "\n";
  const rows = selected.value.map((id) => {
    const item: any = props.items.find((i: any) => i.id === id);
    const columns = sortedHeaders.value.map((h) => {
      const column = h.toColumn ? h.toColumn(item) : getProp(h.prop, item);
      return `"${formatColumn(column)}"`;
    });
    return columns.join(",");
  });
  csv += rows.join("\n");
  return csv;
};



// const formatColumnItem = (column: string, index: number) => {
//   try {
//     const date = parseISO(column);
//     if (isValid(date)) return dateTimeFormat(date);
//   } catch (error) {
//     console.error("format column error", error);
//   }
//   if (column === null) return "";
//   if (Array.isArray(column)) {
//     return column[index].split("x ")[1];
//   }
//   if (typeof column === "object")
//     return JSON.stringify(column).replace(/"/g, '""');
//   if (typeof column === "number") return column;
//   return typeof column === "string" ? column : "onbekend";
// };

const formatColumn = (column: string | any[]) => {
  try {
    const date = parseISO(String(column));
    if (isValid(date)) return dateTimeFormat(date);
  } catch (error) {
    console.error("format column error", error);
  }
  if (column === null) return "";
  if (Array.isArray(column)) return column.join("\n");
  if (typeof column === "object")
    return JSON.stringify(column).replace(/"/g, '""');
  if (typeof column === "number") return column;
  return typeof column === "string" ? column : "onbekend";
};

const getProp = (name: string, prop: { [x: string]: any }): any => {
  if (!name) return prop;
  if (!prop) return "";
  const keys: string[] = name.split(".") || [];
  const key = keys.length > 0 ? keys.shift() : undefined;
  const value = key !== undefined ? prop[key] : undefined;

  return keys.length === 0 ? value : getProp(keys.join("."), value);
};

const showExport = () => {
  downloadString(itemsAsCSV());
};


const updateParams = () => {
  const params = filtersEnabled.value ? Object.assign({}, props.filters) : {};

  params.search = searchValue;
  params.sort = props.sort.prop;
  params.order = props.sort.direction;


  emits('params', params)
  selected.value = [];
  emits('selected', [])

  updateRoute();
};

const sortBy = (prop: any) => {
  const direction =
    prop === props.sort.value.prop
      ? props.sort.value.direction === "ASC"
        ? "DESC"
        : "ASC"
      : props.sort.value.direction;
  const sort = {
    direction,
    prop,
  };
  emits('update:sort', sort);
  updateParams();
};


const selectAll = (event: Event) => {
  const isChecked = (event.target as HTMLInputElement).checked;
  selected.value = isChecked
    ? props.items.map((item: any) => item.id)
    : [];
  emits("selected", selected.value);
};


const select = (item: { id: number; }) => {
  const index = selected.value.indexOf(String(item.id));
  if (index > -1) selected.value.splice(index, 1);
  else selected.value.push(String(item.id));
  emits("selected", selected);
};

const isDev = computed(() => process.env.NODE_ENV !== "production");
const minWidth = computed(() => (1 / props.headers.length) * 100 + "%;");

const hideModal = () => {
  // store.dispatch("modal/hide")
};

const updateRoute = () => {
  router.push({
    query: {
      search: searchValue.value,
      filters: String(filtersEnabled.value),
    },
  });
};

onMounted(() => {});
</script>

<style scoped lang="css"></style>
