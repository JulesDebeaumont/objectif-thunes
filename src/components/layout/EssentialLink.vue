<script setup lang="ts">
import { IEssentialLink } from 'src/components/models'

const props = defineProps<{
  essentialLink: IEssentialLink
}>()
</script>

<template>
  <q-item clickable :to="props.essentialLink.route">
    <q-item-section
      v-if="props.essentialLink.icon"
      avatar
    >
      <q-icon :name="props.essentialLink.icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ props.essentialLink.title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>
