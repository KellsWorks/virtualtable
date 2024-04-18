<template>
  <div>
    lorem ipsum dolor sit
    <VirtualTable :headers="headers" :selectedHeaders="selectedHeaders" :items="items"/>
  </div>
</template>

<script setup lang="ts">
import VirtualTable from "@/components/VirtualTable.vue";
import "./style.css";
import { ref, onMounted } from "vue";
import axios from "axios";

const headers = [
  {
    isDefault: true,
    width: "350px",
    label: "Naam",
    sort: "name",
    prop: "name",
    url: "/products/:id",
  },
  {
    isDefault: true,
    width: "150px",
    label: "SKU",
    sort: "sku",
    prop: "sku",
    url: "/products/:id",
  },
  {
    isDefault: true,
    width: "100px",
    label: "Dozen",
    sort: "boxes",
    prop: "boxes",
  },
  {
    editable: true,
    isDefault: true,
    width: "150px",
    label: "Categorie",
    sort: "category",
    prop: "category",
  },
  {
    editable: true,
    isDefault: true,
    width: "100px",
    label: "Publiek",
    sort: "public",
    prop: "public",
    type: "boolean",
  },
  {
    isDefault: true,
    width: "100px",
    label: "Voorraad: Totaal",
    sort: "availableInStock",
    prop: "availableInStock",
  },
  {
    isDefault: true,
    width: "100px",
    label: "Voorraad: Gereserveerd",
    sort: "amountReserved",
    prop: "amountReserved",
  },
  {
    isDefault: true,
    width: "100px",
    label: "Voorraad: Beschikbaar",
    sort: "amountAvailable",
    prop: "amountAvailable",
  },
  {
    isDefault: false,
    width: "100px",
    label: "Onderweg: Gereserveerd",
    sort: "incomingReserved",
    prop: "incomingReserved",
  },
  {
    isDefault: false,
    width: "100px",
    label: "Onderweg: Beschikbaar",
    sort: "incomingAvailable",
    prop: "incomingAvailable",
  },
  {
    isDefault: false,
    width: "100px",
    label: "Besteld: Gereserveerd",
    sort: "orderedReserved",
    prop: "orderedReserved",
  },
  {
    isDefault: false,
    width: "100px",
    label: "Besteld: Beschikbaar",
    sort: "orderedAvailable",
    prop: "orderedAvailable",
  },
  {
    isDefault: true,
    width: "200px",
    label: "Volgende Levering",
    sort: "nextPurchase.delivery_date",
    prop: "nextPurchase",
  },
  {
    editable: true,
    isDefault: true,
    type: "currency",
    width: "100px",
    label: "Product Prijs",
    sort: "default_price",
    prop: "default_price",
  },
  {
    editable: true,
    width: "120px",
    label: "Afmeting",
    sort: "details.size",
    prop: "details.size",
  },
  {
    editable: true,
    width: "120px",
    label: "Gewicht",
    sort: "details.weight",
    prop: "details.weight",
  },
  {
    editable: true,
    width: "120px",
    label: "Materiaal",
    sort: "details.material",
    prop: "details.material",
  },
  {
    editable: true,
    width: "120px",
    type: "currency",
    label: "Levering:start",
    sort: "default_delivery_fee",
    prop: "default_delivery_fee",
  },
  {
    editable: true,
    width: "120px",
    type: "currency",
    label: "Levering:vervolg",
    sort: "dropship_full_price",
    prop: "dropship_full_price",
  },
  {
    editable: true,
    width: "120px",
    type: "currency",
    label: "Handelingskosten",
    sort: "default_handling_fee",
    prop: "default_handling_fee",
  },
  {
    editable: true,
    width: "120px",
    type: "currency",
    label: "Montagekosten",
    sort: "b2b_full_price",
    prop: "b2b_full_price",
  },
];
const selectedHeaders = ["Naam", "SKU", "Montagekosten", "Handelingskosten"];
const items = ref([]);
const loading = ref<boolean>(false);
const loadingStep = ref<string>("");
async function load() {
  const params = {};
  loading.value = true;
  loadingStep.value = "Producten aan het laden";

  const { data: products } = await axios.get(
    "https://delivery.nu/products.php",
    { params }
  );
  loading.value = false;
  loadingStep.value = "Afbeeldingen aan het laden";

  items.value = products.map((p: any) => {
    // const upload = uploads.find(u => u.collectionId === p.id);
    // p.image = upload ? `${this.$axios.defaults.baseURL}/upload/${upload.id}/download` : null;
    return p;
  });
}

onMounted(() => {
  load();
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
