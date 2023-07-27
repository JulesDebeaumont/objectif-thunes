<script setup lang="ts">
import { IEvolution, IGrowth } from 'src/components/models';
import {
 formatTimeStampToDate,
 dateToLocalString,
 formatTimeStampToDateISO,
 playGoldSound,
} from 'src/utils/util';
import { writeEvolutionFile } from 'src/utils/evolution-manager';
import { useQuasar, uid } from 'quasar';
import { computed, ref, toRef } from 'vue';
// components
import GrowthForm from 'src/components/growth/GrowthForm.vue';
import GrowthItem from 'src/components/growth/GrowthItem.vue';

// props
const props = defineProps<{
 evolution: IEvolution;
 thuneConfigAmount: number;
}>();

// const
const $q = useQuasar();

// refs
const newGrowthMode = ref(false);
const newGrowth = ref<IGrowth>(structuredClone(generateNewGrowth()));
const evolutionRef = toRef(props, 'evolution');
const alertDeleteGrowth = ref(false);
const alertDeleteGrowthData = ref<IGrowth | null>(null);

// functions
function toggleNewGrowthMode() {
 if (newGrowthMode.value === true) {
  newGrowthMode.value = false;
 } else {
  newGrowth.value = structuredClone(generateNewGrowth());
  newGrowthMode.value = true;
 }
}
function addNewgrowth(growthArg: IGrowth) {
 evolutionRef.value.data.push(growthArg);
 saveEvolution();
 toggleNewGrowthMode();
}
function saveGrowth(growthArg: IGrowth) {
 evolutionRef.value.data = evolutionRef.value.data.map((growthMap) => {
  if (growthArg.id === growthMap.id) {
   return growthArg;
  }
  return growthMap;
 });
 saveEvolution();
}
async function saveEvolution() {
 try {
  evolutionRef.value.data.sort((growthA, growthB) => {
   return (
    formatTimeStampToDateISO(growthB.eventDate) -
    formatTimeStampToDateISO(growthA.eventDate)
   );
  });
  await writeEvolutionFile(evolutionRef.value.id, evolutionRef.value);
  $q.notify({
   type: 'positive',
   message: 'Evolution mise à jour',
  });
  playGoldSound();
 } catch (error) {
  console.error(error);
  $q.notify({
   type: 'negative',
   message: 'Une erreur est survenue',
  });
 }
}
function setupAlertDeleteGrowth(growthArg: IGrowth) {
 alertDeleteGrowthData.value = growthArg;
 alertDeleteGrowth.value = true;
}
function deleteGrowth() {
 evolutionRef.value.data = evolutionRef.value.data.filter((growth) => {
  return growth.id !== alertDeleteGrowthData.value?.id;
 });
 alertDeleteGrowthData.value = null;
 alertDeleteGrowth.value = false;
 saveEvolution();
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

// computeds
const getSumIcon = computed(() => {
 const outputIcon = {
  up: { name: 'trending_up', color: 'positive' },
  down: { name: 'trending_down', color: 'negative' },
 };
 if (configThuneWithSumGrowthAmount.value > 0) {
  return outputIcon.up;
 } else {
  return outputIcon.down;
 }
});
const sumAmountGrowth = computed(() => {
 return evolutionRef.value.data.reduce((acc, growthReduce) => {
  if (growthReduce.direction === 'down') {
   return acc - growthReduce.amount;
  } else {
   return acc + growthReduce.amount;
  }
 }, 0);
});
const configThuneWithSumGrowthAmount = computed(() => {
 return props.thuneConfigAmount + sumAmountGrowth.value;
});
</script>

<template>
 <q-item dark class="flex column items-center objectif-thune-evolution-item">
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

  <div class="flex column items-center">
   <div class="flex row no-wrap items-center q-pb-md">
    <span class="text-h6">{{ dateToLocalString(evolutionRef.createdAt) }}</span>
    <q-icon
     :name="getSumIcon.name"
     :color="getSumIcon.color"
     size="sm"
     class="q-pl-sm"
    />
    <span :class="`text-${getSumIcon.color} text-body1 q-ml-xs`">
     {{ props.thuneConfigAmount + sumAmountGrowth }}
     <q-tooltip>
      {{ props.thuneConfigAmount }} + ({{ sumAmountGrowth }}) =
      {{ Math.abs(props.thuneConfigAmount - sumAmountGrowth) }}
     </q-tooltip>
    </span>
   </div>

   <div class="q-pb-md" v-if="evolutionRef.data.length === 0">
    Pas d'évolution ce mois ci.
   </div>
   <q-item-section v-if="evolutionRef.data.length > 0" class="q-gutter-y-sm">
    <GrowthItem
     v-for="growth in evolutionRef.data"
     class="flex flex-center column"
     :key="growth.id"
     :growth="growth"
     :displayDate="true"
     @saveGrowth="saveGrowth"
     @delete-growth="setupAlertDeleteGrowth"
    />
   </q-item-section>

   <q-btn
    v-if="newGrowthMode === false"
    icon="add"
    round
    @click="toggleNewGrowthMode"
    color="accent"
    class="q-my-sm q-mt-md"
   >
    <q-tooltip>Ajouter</q-tooltip>
   </q-btn>
  </div>

  <div v-if="newGrowthMode === true">
   <GrowthForm
    @submitCallback="addNewgrowth"
    @cancelCallback="toggleNewGrowthMode"
    :growth="newGrowth"
    :displayDate="true"
   />
  </div>
 </q-item>
</template>

<style>
.objectif-thune-evolution-item {
 background-color: rgba(255, 255, 255, 0.06);
 border-radius: 3px;
}
</style>
