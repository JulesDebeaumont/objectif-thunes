<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { IEssentialLink } from 'src/components/models';
import { checkOrCreateAppDataFolder } from 'src/utils/file-manager';
// components
import EssentialLink from 'src/components/layout/EssentialLink.vue';
import GoldIcon from 'src/components/other/GoldIcon.vue';

// consts
const essentialLinks: IEssentialLink[] = [
 {
  title: 'Tableau de bord',
  icon: 'dashboard',
  route: { name: 'home' },
 },
 {
  title: 'Configuation',
  icon: 'settings',
  route: { name: 'config' },
 },
 {
  title: 'À propos',
  icon: 'help',
  route: { name: 'about' },
 },
];

// refs
const leftDrawerOpen = ref(false);

// functions
function toggleLeftDrawer() {
 leftDrawerOpen.value = !leftDrawerOpen.value;
}

// lifeCycle
onMounted(async () => {
 await checkOrCreateAppDataFolder();
});
</script>

<template>
 <q-layout view="lHh Lpr lFf">
  <q-header elevated>
   <q-toolbar class="bg-info">
    <q-btn
     flat
     dense
     round
     icon="menu"
     aria-label="Menu"
     @click="toggleLeftDrawer"
    />

    <q-toolbar-title>
     <GoldIcon size="md" :amount="9999" />
     Objectif Thunes
    </q-toolbar-title>
   </q-toolbar>
  </q-header>

  <q-drawer v-model="leftDrawerOpen" show-if-above bordered dark>
   <q-list class="bg-info">
    <q-item-label header class="text-grey-6"> Menu principal </q-item-label>

    <EssentialLink
     v-for="link in essentialLinks"
     :key="link.title"
     :essentialLink="link"
    />
   </q-list>
  </q-drawer>

  <q-page-container id="objectif-thune-page-container">
   <q-page class="q-pa-sm text-white q-pt-lg">
     <router-view />
   </q-page>
  </q-page-container>
 </q-layout>
</template>

<style>
#objectif-thune-page-container {
 background-image: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)),
  url('/images/bg.jpg');
 background-position: center;
 background-repeat: no-repeat;
 background-size: cover;
 background-attachment: fixed;
}
</style>
