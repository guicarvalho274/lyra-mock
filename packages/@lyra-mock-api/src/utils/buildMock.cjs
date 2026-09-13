// @ts-check

// @ts-ignore
const { ACTIONS, TRANSPORT } = require("./_enums.cjs");


const {
    // @ts-ignore
    validateMockStructure, 
    // @ts-ignore
    validateMockIndex,
    // @ts-ignore
    validateMockAction,
    // @ts-ignore
    validateMockGroup,
    // @ts-ignore
    validateMockCondition,
    // @ts-ignore
    validateConditionItem,
    // @ts-ignore
    validateScenario
} = require('./_validate.cjs');

/**
 * @param {Record<string, Partial<import('../composable/state.cjs').MockEntry>>} mock
 * @returns {{ index: string | null, erros: string[] } | null}
 */
function validateMock(mock){
    const erros = [];

    const validate = validateMockStructure(mock);
    if(validate) return validate;

    const indexError = validateMockIndex(mock);
    if(indexError){
        erros.push(indexError);
    }

    const actionError = validateMockAction(mock);
    if(actionError){
        erros.push(actionError);
    }

    const groupError = validateMockGroup(mock);
    if(groupError){
        erros.push(groupError);
    }

    const conditionError = validateMockCondition(mock);
    if(conditionError){
        erros.push(conditionError);
    }

     if (mock.condition !== undefined) {
        const conditionStrucutreError = validateConditionItem(mock)
        if(conditionStrucutreError){
            erros.push(conditionStrucutreError)
        }
    }

    const scenarioError = validateScenario(mock);
    if(scenarioError){
        erros.push(scenarioError);
    }

    return erros.length ? { index: mock.index ?? null, erros } : null;
}

/**
 * @param {Record<string, Partial<import('../composable/state.cjs').MockEntry>>} source
 * @param {import('../composable/state.cjs').MockEntry[]} overrides
 * @returns {{ mocks: Map<string, import('../composable/state.cjs').MockEntry>, errors: Array<{ index: string | null, erros: string[] }> }}
 */
function buildMocks(source = {}, overrides = []) {
    const errors = [];
    const mocks = new Map(); 


    Object.keys(source).forEach(index => {
        /** @type {import('../composable/state.cjs').MockEntry} */
        const mock = {
            index,
            action: ACTIONS.includes(/** @type {any} */ (source[index]?.action)) ? source[index].action : 'toggle',
            group: source[index]?.group,
            ui: source[index]?.ui,
            condition: source[index]?.condition,
            value: source[index]?.value ?? false
        };

        const validationError = validateMock(mock);
        if (validationError) {
            errors.push(validationError);
            return;
        }

        mocks.set(index, mock); 
    });

    overrides.forEach(override => {
        const validationError = validateMock(override);
        if (validationError) { errors.push(validationError); return; }

        if (mocks.has(override.index)) {
            Object.assign(mocks.get(override.index), override);
        } else {
            mocks.set(override.index, override);
        }
    });

    return { mocks, errors };

}

/**
 * @param {{ type: import('../composable/state.cjs').TransportType, url?: string | null, delay?: number }} input
 * @returns {{ type: import('../composable/state.cjs').TransportType, url: string | null, delay: number, error: false } | { type: undefined, url: undefined, delay: undefined, error: string }}
 */
function buildTransport({type, url = null, delay = 1000}){

    if(!TRANSPORT.includes(/** @type {any} */ (type))){
        return { type: undefined, url: undefined, delay: undefined, error: `Error: transport do register precisa estar entre: ${TRANSPORT.join(' ou ')}` }
    }
    
    return {
        type,
        url,
        delay,
        error: false
    }
}

module.exports = { buildMocks, buildTransport };
