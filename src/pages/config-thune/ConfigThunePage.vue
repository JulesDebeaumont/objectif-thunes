<script setup lang="ts">
import { IThuneConfig, IGrowth } from 'src/components/models';
import {
 writeThuneConfig,
 readThuneConfig,
} from 'src/utils/thune-config-manager';
import { useQuasar, uid } from 'quasar';
import { computed, onMounted, ref } from 'vue';
import { formatTimeStampToDate, playGoldSound } from 'src/utils/util';
// components
import GrowthForm from 'src/components/growth/GrowthForm.vue';
import GrowthItem from 'src/components/growth/GrowthItem.vue';

// const
const $q = useQuasar();
const defaultThuneConfig: IThuneConfig = {
 id: uid(),
 saving: 100,
 data: [],
};

// refs
const thuneConfig = ref<IThuneConfig>(structuredClone(defaultThuneConfig));
const addGrowthMode = ref(false);
const newGrowth = ref<IGrowth>(structuredClone(generateNewGrowth()));
const alertDeleteGrowth = ref(false);
const alertDeleteGrowthData = ref<IGrowth | null>(null);

// functions
async function saveThuneConfig() {
 try {
  await writeThuneConfig(thuneConfig.value);
  $q.notify({
   type: 'positive',
   message: 'Configuration mise à jour',
  });
  playGoldSound()
 } catch (error) {
  console.error(error);
  $q.notify({
   type: 'negative',
   message: 'Une erreur est survenue',
  });
 }
}
function addGrowthToThuneConfig() {
 thuneConfig.value.data.push(newGrowth.value);
 toggleNewGrowthMode();
 saveThuneConfig();
}
function saveGrowthToThuneConfig(growthArg: IGrowth) {
 thuneConfig.value.data = thuneConfig.value.data.map((growthMap) => {
  if (growthArg.id === growthMap.id) {
   return growthArg;
  }
  return growthMap;
 });
 saveThuneConfig();
}
function toggleNewGrowthMode() {
 if (addGrowthMode.value === true) {
  addGrowthMode.value = false;
 } else {
  newGrowth.value = structuredClone(generateNewGrowth());
  addGrowthMode.value = true;
 }
}
function setupAlertDeleteGrowth(growthArg: IGrowth) {
 alertDeleteGrowthData.value = growthArg;
 alertDeleteGrowth.value = true;
}
function deleteGrowth() {
 thuneConfig.value.data = thuneConfig.value.data.filter((growthFilter) => {
  return growthFilter.id !== alertDeleteGrowthData.value?.id;
 });
 alertDeleteGrowthData.value = null;
 alertDeleteGrowth.value = false;
 saveThuneConfig();
}
function generateNewGrowth() {
 const defaultNewGrowth: IGrowth = {
  id: uid(),
  label: '',
  direction: 'down',
  amount: 0,
  eventDate: formatTimeStampToDate(new Date()),
 };
 return defaultNewGrowth;
}
function getSumIcon() {
 const outputIcon = {
  up: { name: 'trending_up', color: 'positive' },
  down: { name: 'trending_down', color: 'negative' },
 };
 if (sumOfGrowthConfig.value > 0) {
  return outputIcon.up;
 } else {
  return outputIcon.down;
 }
}

// computeds
const sumOfGrowthConfig = computed(() => {
 return thuneConfig.value.data.reduce((acc, growthReduce) => {
  if (growthReduce.direction === 'down') {
   return acc - growthReduce.amount;
  } else {
   return acc + growthReduce.amount;
  }
 }, 0);
});

// lifeCycle
onMounted(async () => {
 const readConfig = await readThuneConfig();
 if (readConfig !== null) {
  thuneConfig.value = readConfig;
 }
});
</script>

<template>
 <div class="flex column flex-center q-pa-md text-center">
  <div class="text-h4">Configuration</div>

  <q-dialog v-model="alertDeleteGrowth">
   <q-card dark>
    <q-card-section class="text-center text-h6">
     Voulez-vous vraiment supprimer cet item ?
    </q-card-section>

    <q-card-actions align="around">
     <q-btn flat label="Annuler" color="primary" v-close-popup />
     <q-btn flat label="Supprimer" color="primary" @click="deleteGrowth" />
    </q-card-actions>
   </q-card>
  </q-dialog>

  <div class="q-pt-lg text-h6 flex row no-wrap items-center">
   <span>Bilan mensuel : </span>
   <q-icon
    :name="getSumIcon().name"
    :color="getSumIcon().color"
    class="q-pl-sm"
   />
   <span :class="`text-${getSumIcon().color}`">
    {{ Math.abs(sumOfGrowthConfig) }}
   </span>
  </div>

  <div
   class="flex column flex-center q-mt-lg q-py-sm q-px-md objectif-thune-config-thune-item"
  >
   <q-form
    @submit="saveThuneConfig"
    class="flex row flex-center q-gutter-x-md q-pb-lg q-pt-sm"
   >
    <q-input
     v-model.number="thuneConfig.saving"
     label="Epargne mensuelle visée"
     filled
     dark
     required
     hide-bottom-space
     type="number"
     :rules="[(val) => val > 0 || 'Valeur positive uniquement']"
    />
    <q-btn label="Enregister" type="submit" color="accent" />
   </q-form>

   <q-separator class="q-mb-lg" />

   <div class="flex column flex-center">
    <span v-if="thuneConfig.data.length === 0 && addGrowthMode === false"
     >Aucune dépense mensuelles</span
    >
    <div
     v-if="thuneConfig.data.length > 0"
     class="q-gutter-y-md flex flex-center column"
    >
     <GrowthItem
      v-for="growth in thuneConfig.data"
      :key="growth.id"
      :growth="growth"
      :displayDate="false"
      @saveGrowth="saveGrowthToThuneConfig"
      @deleteGrowth="setupAlertDeleteGrowth"
     />
    </div>

    <div v-if="addGrowthMode === true">
     <GrowthForm
      @submitCallback="addGrowthToThuneConfig"
      @cancelCallback="toggleNewGrowthMode"
      :growth="newGrowth"
      :displayDate="false"
     />
    </div>

    <q-btn
     v-if="addGrowthMode === false"
     @click="toggleNewGrowthMode"
     icon="add"
     color="accent"
     class="q-ma-sm q-mt-md"
     round
    >
     <q-tooltip>Ajouter</q-tooltip>
    </q-btn>
   </div>
  </div>
 </div>
</template>

<style>
.objectif-thune-config-thune-item {
 background-color: rgba(255, 255, 255, 0.06);
 border-radius: 3px;
}
</style>
