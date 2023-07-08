<script setup lang="ts">
import {
 deleteAllResourceFolder,
 checkOrCreateAppDataFolder,
} from 'src/utils/file-manager';
import { useQuasar } from 'quasar';
import { ref } from 'vue';

// consts
const $q = useQuasar();

// refs
const dialogResetAll = ref(false);

// functions
async function resetAllData() {
 await deleteAllResourceFolder();
 await checkOrCreateAppDataFolder();
 $q.notify({
  type: 'positive',
  message: 'Données réinitialisées',
 });
}
</script>

<template>
 <div class="q-pa-md text-center">
  <q-dialog v-model="dialogResetAll">
   <q-card dark>
    <q-card-section class="text-center text-h6">
     Voulez-vous vraiment tout réinitialiser ?
    </q-card-section>

    <q-card-actions align="around">
     <q-btn flat label="Annuler" color="primary" v-close-popup />
     <q-btn flat label="Réinitialiser" color="primary" @click="resetAllData" />
    </q-card-actions>
   </q-card>
  </q-dialog>

  <div class="text-h4">À propos</div>

  <div class="q-pt-md">Application créer par Jules Debeaumont</div>

  <div class="q-pt-md">
   <q-btn
    color="primary"
    label="Réinitialiser les données"
    @click="dialogResetAll = true"
   />
  </div>
 </div>
</template>
