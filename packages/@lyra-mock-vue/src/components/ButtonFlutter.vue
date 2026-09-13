<script setup>
defineEmits(['click']);
import Icon from './Icon.vue';
</script>

<template>
  <button class="mock-button-flutter flex flex-align-center flex-justify-center" @click="$emit('click')">
    <div class="icon-type">
      <Icon iconName="button" />
    </div>
  </button>
</template>

<style scoped>
.mock-button-flutter {
  width: clamp(40px, 7.5vw, 50px);
  height: clamp(40px, 7.5vw, 50px);
  min-width: 40px;
  min-height: 40px;
  max-width: 50px;
  max-height: 50px;
  border-radius: 50%;
  background: var(--lyra-mock-color-foregound-color);
  border: 1px solid var(--lyra-mock-color-border);
  cursor: pointer;
  box-shadow: var(--lyra-mock-box-shadow-light);
  transition: background 0.2s ease, box-shadow 0.2s ease;
  padding: 0;
}

.mock-button-flutter:hover, .mock-button-flutter.active {
  background: var(--lyra-mock-color-white-bg-hover);
}

.icon-type {
  width: 50%;
  height: 50%;
  color: var(--lyra-mock-color-text-dark);
}
</style>
