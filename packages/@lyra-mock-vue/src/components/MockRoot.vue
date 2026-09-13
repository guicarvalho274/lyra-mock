<!-- src/components/MockRoot.vue -->
<template>
  <div class="mock-page" data-lyra-mock :style="fontStyle">
    <BoxTool>
      <HeaderTool :title="headerString(routerInternal).title" />
      <ToolArea :comp="routerInternal" />
    </BoxTool>
    <ButtonFlutter @click="togglePanel" />
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { installStyles } from '../install.ts'
import { stateMock, typeRouter } from '../composable/state.js'
import ButtonFlutter from './ButtonFlutter.vue';
import HeaderTool from './HeaderTool.vue';
import BoxTool from './BoxTool.vue';
import ToolArea from './ToolArea.vue';

const { state } = stateMock();
const { route: routerInternal,headerString } = typeRouter();

const props = defineProps({
   font: {
    type: String,
    default: undefined
  }
})

const emit = defineEmits(['toggle']);

const togglePanel = () => {
  emit('toggle')
}

const fontStyle = computed(() => {
  if (!props.font) return undefined
  return { '--font-core-mock-lyra': props.font }
})

onMounted(() => {
  installStyles()
});
</script>

<style scoped>
.mock-page {
  bottom: 35px;
  right: 35px;
  position: fixed;
  width: auto;
  min-height: auto;
  z-index: 10000000;
}
</style>