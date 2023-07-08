<script setup lang="ts">
import { IGrowth } from 'src/components/models';
import { ref, onMounted } from 'vue';
// components
import GrowthForm from 'src/components/growth/GrowthForm.vue';
import GoldIcon from 'src/components/other/GoldIcon.vue';

// props
const props = defineProps<{
 growth: IGrowth;
 displayDate: boolean;
}>();

// emits
const emits = defineEmits<{
 (e: 'saveGrowth', growth: IGrowth): void;
 (e: 'deleteGrowth', growth: IGrowth): void;
}>();

// refs
const growthEditMode = ref(false);
const growthRef = ref<IGrowth | null>(null);
const backupGrowthIfCancel = ref<IGrowth | null>(null);

// functions
function toggleGrowthEditMode() {
 growthEditMode.value = !growthEditMode.value;
}
function cancelGrowthChanges() {
 if (backupGrowthIfCancel.value !== null) {
  growthRef.value = { ...backupGrowthIfCancel.value };
 }
 toggleGrowthEditMode();
}
function saveGrowthConfig(growthArg: IGrowth) {
 emits('saveGrowth', growthArg);
 if (growthRef.value !== null && backupGrowthIfCancel.value !== null) {
  backupGrowthIfCancel.value = { ...growthRef.value };
 }
 toggleGrowthEditMode();
}
function getGrowthIcon() {
 const outputIcon = {
  up: { name: 'trending_up', color: 'positive' },
  down: { name: 'trending_down', color: 'negative' },
 };
 if (growthRef.value !== null) {
  return outputIcon[growthRef.value.direction];
 }
 return {};
}

// lifeCycle
onMounted(() => {
 growthRef.value = props.growth;
 backupGrowthIfCancel.value = { ...growthRef.value };
});
</script>

<template>
 <div class="flex row items-center full-width objectif-thune-growth-item">
  <template v-if="growthRef !== null">
   <div
    v-if="growthEditMode === false"
    class="q-gutter-x-sm flex row items-center justify-between full-width text-body2 text-bold"
   >
    <GoldIcon size="sm" :amount="growthRef.amount" />
    <q-icon
     :name="getGrowthIcon().name"
     :color="getGrowthIcon().color"
     size="sm"
    />
    <span
     :class="`text-${getGrowthIcon().color} flex row no-wrap justify-between`"
     style="width: 50px"
    >
     <span class="q-mr-xs">{{ growthRef.amount }}</span>
    </span>
    <span style="width: 260px" class="ellipsis">{{ growthRef.label }} </span>
    <span v-if="props.displayDate === true" class="text-weight-light">{{
     growthRef.eventDate
    }}</span>

    <div class="flex row items-center q-gutter-x-xs">
     <q-icon
      @click="toggleGrowthEditMode"
      name="edit"
      color="warning"
      size="sm"
      class="cursor-pointer"
     >
      <q-tooltip>Editer</q-tooltip>
     </q-icon>
     <q-icon
      @click="emits('deleteGrowth', growthRef)"
      name="delete"
      color="negative"
      size="sm"
      class="cursor-pointer"
     >
      <q-tooltip>Supprimer</q-tooltip>
     </q-icon>
    </div>
   </div>

   <div v-else>
    <GrowthForm
     @submitCallback="saveGrowthConfig"
     @cancelCallback="cancelGrowthChanges"
     :growth="growthRef"
     :displayDate="props.displayDate"
    />
   </div>
  </template>
 </div>
</template>

<style>
.objectif-thune-growth-item {
 transition: all 0.1s;
}

.objectif-thune-growth-item:hover {
 background-color: rgba(255, 255, 255, 0.2);
}
</style>
