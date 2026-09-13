import { ACTIONS, TRANSPORT } from "./_enums";
import {
    validateMockStructure,
    validateMockIndex,
    validateMockAction,
    validateMockGroup,
    validateMockCondition,
    validateConditionItem,
    validateScenario
} from './_validate';

/**
 * @typedef {import('../composable/state.js').MockEntry} MockEntry
 * @typedef {import('../composable/state.js').Transport} Transport
 * @typedef {import('../composable/state.js').TransportType} TransportType
 */

/**
 * @param {Record<string, Partial<MockEntry>>} mock
 * @returns {{ index: string | null, erros: string[] } | null}
 */
function validateMock(mock){
    /** @type {string[]} */
    const erros = [];

    const validate = validateMockStructure(mock);
    if(validate) return validate;

    const key = Object.keys(mock)[0] || null;
    const entry = key ? mock[key] : null;

    const indexError = validateMockIndex(entry || mock);
    if(indexError){
        erros.push(indexError);
    }

    const actionError = validateMockAction(entry || mock);
    if(actionError){
        erros.push(actionError);
    }

    const groupError = validateMockGroup(entry || mock);
    if(groupError){
        erros.push(groupError);
    }

    const conditionError = validateMockCondition(entry || mock);
    if(conditionError){
        erros.push(conditionError);
    }

     if (entry?.condition !== undefined) {
        const conditionStrucutreError = validateConditionItem(/** @type {{ condition?: unknown, index?: string }} */ (entry))
        if(conditionStrucutreError){
            erros.push(conditionStrucutreError)
        }
    }

    const scenarioError = validateScenario(entry || mock);
    if(scenarioError){
        erros.push(scenarioError);
    }

    return erros.length ? { index: key, erros } : null;
}

/**
 * @param {Record<string, Partial<MockEntry>>} source
 * @param {MockEntry[]} overrides
 * @returns {{ mocks: Map<string, MockEntry>, errors: Array<{ index: string | null, erros: string[] }> }}
 */
export function buildMocks(source = {}, overrides = []) {
    /** @type {Array<{ index: string | null, erros: string[] }>} */
    const errors = [];
    const mocks = new Map(); 


    Object.keys(source).forEach(index => {
        const sourceMock = source[index];
        /** @type {MockEntry} */
        const mock = {
            index,
            // @ts-ignore - ACTIONS.includes validates the type
            action: ACTIONS.includes(sourceMock?.action) ? sourceMock?.action : 'toggle',
            group: sourceMock?.group,
            ui: sourceMock?.ui,
            condition: sourceMock?.condition,
            value: sourceMock?.value ?? false
        };

        const validationError = validateMock({ [index]: mock });
        if (validationError) {
            errors.push(validationError);
            return;
        }

        mocks.set(index, mock); 
    });

    overrides.forEach(override => {
        const validationError = validateMock({ [override.index]: override });
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
