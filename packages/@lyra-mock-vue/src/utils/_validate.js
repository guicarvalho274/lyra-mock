import { ACTIONS, SCENARIOS, OPERATORS } from "./_enums";

/**
 * @param {unknown} mock
 * @returns {{ index: null, erros: string[] } | null}
 */
export function validateMockStructure(mock){
    if(typeof mock !== 'object' || mock === null || Array.isArray(mock)){
        return {
            index: null,
            erros: ['Mock deve ser um objeto']
        }
    }
    return null;
}

/**
 * @param {{ index?: unknown }} mock
 * @returns {string | null}
 */
export function validateMockIndex(mock){
    if(typeof mock.index !== 'string' || !mock.index.trim()){
        return 'index deve ser uma string não vázia';
    }

    return null;
}

/**
 * @param {{ index?: string, action?: unknown }} mock
 * @returns {string | null}
 */
export function validateMockAction(mock){
    if(!ACTIONS.includes(mock?.action)){
        return `${mock.index} deve conter o dtos de ações em "${ACTIONS.join(' ou ')}"`;
    }

    return null;
}

/**
 * @param {{ index?: string, group?: unknown }} mock
 * @returns {string | null}
 */
export function validateMockGroup(mock){
    if ( mock.group !== undefined && mock.group !== null && (typeof mock.group !== 'string' || !mock.group.trim()) ) { 
        return `${mock.index} group deve ser uma string não vazia`;
    }

    return null;
}

/**
 * @param {{ index?: string, action?: string, condition?: unknown }} mock
 * @returns {string | null}
 */
export function validateMockCondition(mock){
    if(mock.action === 'input' && mock.condition === undefined) {
        return `${mock.index} condition é obrigatória para action:input`;
    }

    return null;
}

/**
 * @param {{ condition?: unknown, index?: string }} mock
 * @param {string} [prefix]
 * @returns {string | null}
 */
export function validateConditionItem(mock, prefix = '') {
    if(!Array.isArray(mock.condition)){
        return `mock.condition deve ser um array`;
    }

    for (let i = 0; i < mock.condition.length; i++) {
        const item = mock.condition[i];
        const p = `${prefix}condition[${i}].`;

        if (typeof item !== 'object' || item === null || Array.isArray(item)) {
            return `${p}deve ser um objeto`;
        }
        if (typeof item.field !== 'string' || !item.field.trim()) {
            return `${p}field deve ser uma string não vazia`;
        }
        if (!OPERATORS.includes(item.operator)) {
            return `${p}operator deve ser "${OPERATORS.join(' ou ')}"`;
        }
        if (item.value === undefined) {
            return `${p}value é obrigatório`;
        }
    }

    return null;
}

/**
 * @param {{ index?: string, scenario?: unknown }} mock
 * @returns {string | null}
 */
export function validateScenario(mock){
    if (mock.scenario !== undefined && !SCENARIOS.includes(mock.scenario)) {
        return `${mock.index} scenario deve ser "${SCENARIOS.join(' ou ')}"`;
    }

    return null;
}
