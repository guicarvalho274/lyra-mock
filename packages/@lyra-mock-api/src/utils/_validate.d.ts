/**
 * @param {unknown} mock
 * @returns {{ index: null, erros: string[] } | null}
 */
export declare function validateMockStructure(mock: unknown): {
    index: null;
    erros: string[];
} | null;
/**
 * @param {{ index?: unknown }} mock
 * @returns {string | null}
 */
export declare function validateMockIndex(mock: {
    index?: unknown;
}): string | null;
/**
 * @param {{ index?: string, action?: unknown }} mock
 * @returns {string | null}
 */
export declare function validateMockAction(mock: {
    index?: string;
    action?: unknown;
}): string | null;
/**
 * @param {{ index?: string, group?: unknown }} mock
 * @returns {string | null}
 */
export declare function validateMockGroup(mock: {
    index?: string;
    group?: unknown;
}): string | null;
/**
 * @param {{ index?: string, action?: string, condition?: unknown }} mock
 * @returns {string | null}
 */
export declare function validateMockCondition(mock: {
    index?: string;
    action?: string;
    condition?: unknown;
}): string | null;
/**
 * @param {{ condition?: unknown, index?: string }} mock
 * @param {string} [prefix]
 * @returns {string | null}
 */
export declare function validateConditionItem(mock: {
    condition?: unknown;
    index?: string;
}, prefix?: string): string | null;
/**
 * @param {{ index?: string, scenario?: unknown }} mock
 * @returns {string | null}
 */
export declare function validateScenario(mock: {
    index?: string;
    scenario?: unknown;
}): string | null;
