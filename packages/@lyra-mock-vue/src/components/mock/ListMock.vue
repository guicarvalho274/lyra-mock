<template>
    <div class="mock-container w100">
        <div class="mock-side">
            <h2 data-lyra-mock-subtitle class="subtitle-mock">Passwords</h2>

            <ul class="list-mock flex-column">
                <li class="flex action-line">
                    <div class="flex mock-action w100">
                        <div class="inline-flex flex-align-center content-action">
                            <h2 data-lyra-mock-title-action class="title-mock-action">Senha inválida</h2>
                            <div data-lyra-mock-tag-action class="tag">
                                <span>code: password_invalid</span>
                            </div>
                        </div>

                        <div class="toogle" data-lyra-mock-toogle></div>
                    </div>
                </li>
                <li class="flex action-line">
                    <div class="flex mock-action w100">
                        <div class="inline-flex flex-align-center content-action">
                            <h2 data-lyra-mock-title-action class="title-mock-action">Senha muito curta</h2>
                            <div data-lyra-mock-tag-action class="tag">
                                <span>code: password_min_length jnjnjnk nknknkn</span>
                            </div>
                        </div>

                        <div class="toogle" data-lyra-mock-toogle></div>
                    </div>
                </li>
                <li class="flex action-line">
                    <div class="flex mock-action w100">
                        <div class="inline-flex flex-align-center content-action">
                            <h2 data-lyra-mock-title-action class="title-mock-action">Letra maiúscula necessária</h2>
                            <div data-lyra-mock-tag-action class="tag">
                                <span>code: password_necessarie_upper_character</span>
                            </div>
                        </div>

                        <div class="toogle" data-lyra-mock-toogle></div>
                    </div>
                </li>
                <li class="flex action-line">
                    <div class="flex mock-action w100">
                        <div class="inline-flex flex-align-center content-action">
                            <h2 data-lyra-mock-title-action class="title-mock-action">Letra minúscula necessária</h2>
                            <div data-lyra-mock-tag-action class="tag">
                                <span>code: password_necessarie_low...</span>
                            </div>
                        </div>

                        <div class="toogle" data-lyra-mock-toogle></div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
@import url('../../styles/toogle.css');
@import url('../../styles/tag.css');

.mock-side{
    padding: 12px 0px;
    border-bottom: 1px solid var(--lyra-mock-color-border);
}

.mock-side:last-child{
    border-bottom: none;
}

.list-mock{
    margin-top: 6px;
    list-style-type: none;
    list-style-position: inside;
}

.action-line{
    padding-block: 8px;
    padding-inline: 16px;
}

.mock-action{
    gap: 12px;
}

.content-action{
    gap: 6px;
    flex: 1;
    min-width: 0;
    overflow: hidden;

}
</style>