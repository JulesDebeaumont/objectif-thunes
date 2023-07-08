<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useQuasar } from 'quasar';
import {
 readAllEvolutions,
 readEvolutionById,
 createEvolutionFile,
} from 'src/utils/evolution-manager';
import { readThuneConfig } from 'src/utils/thune-config-manager';
import { IEvolution, IThuneConfig } from 'src/components/models';
import { generateEvolutionId } from 'src/utils/util';
// components
import EvolutionItem from 'src/components/evolutions/EvolutionItem.vue';

// consts
const $q = useQuasar();

// refs
const isLoading = ref(false);
const evolutions = ref<IEvolution[]>([]);
const thuneConfig = ref<IThuneConfig | null>(null);
const alertNoThuneConfig = ref(false);

// functions
async function getEvolutionsFromFiles() {
 isLoading.value = true;
 try {
  evolutions.value = await readAllEvolutions();
  evolutions.value = evolutions.value.sort((evoA, evoB) => {
   return new Date(evoB.createdAt) - new Date(evoA.createdAt);
  });
 } catch (error) {
  console.error(error);
  $q.notify({
   type: 'negative',
   message: 'Une erreur est survenue',
  });
 } finally {
  isLoading.value = false;
 }
}
async function checkEvolutionThisMonth() {
 const monthEvolution = await readEvolutionById(generateEvolutionId());
 if (monthEvolution.length === 0) {
  await createEvolutionFile(generateEvolutionId());
 }
}
async function getThuneConfig() {
 const readConfig = await readThuneConfig();
 if (readConfig === null) {
  alertNoThuneConfig.value = true;
 } else {
  thuneConfig.value = readConfig;
 }
}

// computeds
const sumOfGrowthConfig = computed(() => {
 return (
  thuneConfig.value?.data.reduce((acc, growthReduce) => {
   if (growthReduce.direction === 'down') {
    return acc - growthReduce.amount;
   } else {
    return acc + growthReduce.amount;
   }
  }, 0) ?? 0
 );
});

// lifeCycle
onMounted(async () => {
 await checkEvolutionThisMonth();
 await getEvolutionsFromFiles();
 await getThuneConfig();
});
</script>

<template>
 <div class="q-pa-md text-center">
  <div class="text-h4">Tableau de bord</div>

  <q-dialog v-model="alertNoThuneConfig" persistent>
   <q-card dark>
    <q-card-section class="text-center text-h6">
     Vous devez créer une configuration de vos dépenses et de votre objectif
     dans un premier temps.
    </q-card-section>

    <q-card-actions align="center">
     <q-btn flat label="Suivant" color="primary" :to="{ name: 'config' }" />
    </q-card-actions>
   </q-card>
  </q-dialog>

  <div
   class="flex column items-center q-gutter-y-xl q-py-xl"
   v-if="thuneConfig !== null"
  >
   <EvolutionItem
    v-for="evolution in evolutions"
    :evolution="evolution"
    :thuneConfigAmount="sumOfGrowthConfig"
    :key="evolution.id"
   />
  </div>

  <div class="column flex justify-center q-px-sm">
   <template v-if="isLoading === false"> </template>
   <q-spinner
    v-show="isLoading === true"
    color="primary"
    size="3em"
    :thickness="2"
   />
  </div>
 </div>
</template>
