<template>
    <div v-html="icon" class="icon"></div>
</template>

<script setup>
import {computed} from 'vue';
import { getIcon } from '../composable/icon';
const props = defineProps({
    iconName: {
        type: String,
        default: null
    }
});

const {renderIcon} = getIcon();

const icon = computed(()=>{
    return renderIcon(props.iconName);
});

</script>

<style scoped>
.icon{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon svg{
    width: 100%;
    height: 100%;
}
</style>