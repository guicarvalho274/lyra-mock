<script setup>
import { defineProps } from "vue";
import { getComponentsMock } from "./tool.js"
const { get } = getComponentsMock();

const props = defineProps({
    comp: {
        type: String,
        required: true
    }
})

const currentComponent = () => get(props.comp)
</script>

<template>
    <component :is="currentComponent()" />
</template>
