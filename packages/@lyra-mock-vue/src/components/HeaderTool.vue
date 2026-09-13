<script setup>
import Icon from './Icon.vue';

const props = defineProps({
    title: {
        type: String,
        required: true,
        default: 'Tools Area Application'
    }
});
</script>

<template>
    <div class="item header perm">
        <div class="internal flex flex-align-center flex-justify-start">
            <h4 data-lyra-mock-title class="title">{{ title }}</h4>
            <div class="icon-type">
                <Icon iconName="info" />
            </div>
        </div>
    </div>
</template>

<style scoped>
@import url('../styles/tool.css');
</style>