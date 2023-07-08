<script setup lang="ts">
import { IGrowth } from 'src/components/models';
import { toRef } from 'vue';

// props
const props = defineProps<{
 growth: IGrowth;
 displayDate: boolean;
}>();

// emits
const emits = defineEmits<{
 (e: 'submitCallback', growth: IGrowth): void;
 (e: 'cancelCallback'): void;
}>();

// refs
const growthRef = toRef(props, 'growth');
</script>

<template>
 <q-form
  @submit="emits('submitCallback', growthRef)"
  class="flex row items-center q-gutter-md q-pa-sm"
 >
  <q-input
   label="Titre"
   v-model="growthRef.label"
   required
   hide-bottom-space
   filled
   dark
  />
  <q-input
   label="Montant"
   suffix="€"
   filled
   v-model.number="growthRef.amount"
   required
   type="number"
   hide-bottom-space
   dark
   :rules="[(val) => val > 0 || 'Valeur positive uniquement']"
  />
  <q-toggle
   v-model="growthRef.direction"
   checked-icon="add"
   unchecked-icon="remove"
   true-value="up"
   false-value="down"
   dark
   color="positive"
  />
  <q-input
   v-if="props.displayDate === true"
   filled
   dark
   v-model="growthRef.eventDate"
  >
   <template v-slot:append>
    <q-icon name="event" class="cursor-pointer">
     <q-popup-proxy cover transition-show="scale" transition-hide="scale">
      <q-date v-model="growthRef.eventDate" mask="DD-MM-YYYY">
       <div class="row items-center justify-end">
        <q-btn v-close-popup label="Fermer" color="primary" flat />
       </div>
      </q-date>
     </q-popup-proxy>
    </q-icon>
   </template>
  </q-input>

  <div class="flex row q-gutter-x-sm">
   <q-btn label="Enregister" type="submit" color="accent" />
   <q-btn label="Annuler" @click="emits('cancelCallback')" color="secondary" />
  </div>
 </q-form>
</template>
