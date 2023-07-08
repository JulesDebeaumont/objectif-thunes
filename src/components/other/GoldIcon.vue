<script setup lang="ts">
// props
const props = defineProps<{
 size: 'sm' | 'md' | 'lg';
 amount: number;
}>();

// functions
function getSizeFromProps() {
 const outputSize = {
  sm: 20,
  md: 32,
  lg: 50,
 };
 return outputSize[props.size];
}
function getImageFromProps() {
 let imageUrl = '/images/bronzes.jpg';
 if (props.amount > 10) {
  imageUrl = '/images/silvers.jpg';
 }
 if (props.amount > 50) {
  imageUrl = '/images/golds.jpg';
 }
 return imageUrl;
}
</script>

<template>
 <q-img
  :src="getImageFromProps()"
  style="border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 3px"
  :style="`height: ${getSizeFromProps()}px; width: ${getSizeFromProps()}px`"
 />
</template>
