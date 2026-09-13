<template>
    <div class="box-tool">
        <slot/>
    </div>
</template>

<style scoped>
.box-tool{
    width: clamp(340px, 3.2vw, 320px);
    border-radius: 13px;
    border: 1px solid var(--lyra-mock-color-border);
    background:var(--lyra-mock-color-foregound-color);
    height: fit-content;
    overflow-y: auto;
    box-shadow: var(--lyra-mock-box-shadow-light);
    position:absolute;
    bottom: 60px;
    right: 0px;
    max-height:clamp(420px, 5.2vw, 380px);
    padding-bottom: 3px;
}
</style>