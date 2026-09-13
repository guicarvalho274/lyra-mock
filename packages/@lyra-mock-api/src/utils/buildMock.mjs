import { ACTIONS, TRANSPORT } from "./_enums.mjs";
import {
    validateMockStructure,
    validateMockIndex,
    validateMockAction,
    validateMockGroup,
    validateMockCondition,
    validateConditionItem,
    validateScenario
} from './_validate.mjs';

/**
 * @typedef {import('../composable/state.mjs').MockEntry} MockEntry
 * @typedef {import('../composable/state.mjs').Transport} Transport
 * @typedef {import('../composable/state.mjs').TransportType} TransportType
 */

/**
 * @param {Record<string, Partial<MockEntry>>} mock
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
 * @param {Record<string, Partial<MockEntry>>} source
 * @param {MockEntry[]} overrides
 * @returns {{ mocks: Map<string, MockEntry>, errors: Array<{ index: string | null, erros: string[] }> }}
 */
export function buildMocks(source = {}, overrides = []) {
    const errors = [];
    const mocks = new Map(); 


    Object.keys(source).forEach(index => {
        /** @type {MockEntry} */
        const mock = {
            index,
            action: ACTIONS.includes(source[index]?.action) ? source[index].action : 'toggle',
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
 * @param {{ type: TransportType, url?: string | null, delay?: number }} input
 * @returns {{ type: TransportType, url: string | null, delay: number, error: false } | { type: undefined, url: undefined, delay: undefined, error: string }}
 */
export function buildTransport({type, url = null, delay = 1000}){

    if(!TRANSPORT.includes(type)){
        return { type: undefined, url: undefined, delay: undefined, error: `Error: transport do register precisa estar entre: ${TRANSPORT.join(' ou ')}` }
    }
    
    return {
        type,
        url,
        delay,
        error: false
    }
}
