import { reactive, ref } from 'vue';
import { buildMocks, buildTransport } from '../utils/buildMock.js';

// @ts-check

/**
 * @typedef {'input' | 'toggle'} MockAction
 */

/**
 * @typedef {'equals'} ConditionOperator
 */

/**
 * @typedef {Object} MockCondition
 * @property {string} field
 * @property {ConditionOperator} operator
 * @property {string | number | boolean} value
 */

/**
 * @typedef {Object} MockUi
 * @property {string} titleUi
 * @property {string} descriptionUi
 */

/**
 * @typedef {Object} MockEntry
 * @property {string} index
 * @property {MockAction} action
 * @property {MockCondition[]} [condition]
 * @property {string} [group]
 * @property {MockUi} [ui]
 * @property {boolean} [value]
 * @property {'matched' | 'difference'} [scenario]
 */

/**
 * @typedef {'http' | 'socket' | 'event'} TransportType
 */

/**
 * @typedef {Object} Transport
 * @property {TransportType} type
 * @property {string | null} url
 * @property {number} delay
 */

/**
 * @typedef {Object} RegisterInput
 * @property {string} url
 * @property {Record<string, Partial<MockEntry>>} mock
 * @property {MockEntry[]} [override]
 * @property {string[]} [services]
 */

/**
 * @typedef {Object} RegisterServiceInput
 * @property {string} service
 * @property {Record<string, Partial<MockEntry>>} mock
 * @property {MockEntry[]} [override]
 */

/**
 * @typedef {Object} ResolveInput
 * @property {string} url
 * @property {string} index
 * @property {Record<string, unknown>} [payload]
 */

/**
 * @typedef {Object} ResolveResult
 * @property {string} index
 * @property {boolean} matched
 * @property {'matched' | 'difference'} scenario
 */


/** @type {{
 *   register: Map<string, { mocks: Map<string, MockEntry>, services: string[], transport: Omit<Transport, 'error'> }>,
 *   services: Map<string, { mocks: Map<string, MockEntry>, transport: Omit<Transport, 'error'> }>,
 *   errors: Map<string, unknown>
 * }}
 */
const state = reactive({
    register: new Map(),
    services: new Map(),
    errors: new Map()
});

/**
 * @returns {{
 *   state: typeof state,
 *   register: (input: RegisterInput, transport?: Transport) => { mocks: Map<string, MockEntry>, services: string[], transport: Omit<Transport, 'error'> },
 *   registerService: (input: RegisterServiceInput, transport?: Transport) => { mocks: Map<string, MockEntry>, transport: Omit<Transport, 'error'> },
 *   resolve: (input: ResolveInput) => ResolveResult | null,
 *   resolvePriority: (input: { url: string, indexes?: string[], payload?: Record<string, unknown> }) => ResolveResult | null,
 *   getTransport: (input: { url: string }) => Omit<Transport, 'error'> | undefined
 * }}
 */
export function stateMock() {
    /**
     * @param {RegisterInput} input
     * @param {Transport} [transport]
     * @returns {{ mocks: Map<string, MockEntry>, services: string[], transport: Omit<Transport, 'error'> }}
     */
    function register({ url, mock, override = [], services = [] }, transport = {type: 'http', url: null, delay: 1000}) {
        const { mocks, errors } = buildMocks(mock, override);
        const { error, ...t } = buildTransport(transport);

        if (error) {
            state.errors.set(url, error);
        } else {
            state.register.set(url, { mocks, services: services, transport: t });
        }

        if (errors.length) state.errors.set(url, errors);

        return { mocks, services: services, transport: t };
    }

    /**
     * @param {RegisterServiceInput} input
     * @param {Transport} [transport]
     * @returns {{ mocks: Map<string, MockEntry>, transport: Omit<Transport, 'error'> }}
     */
    function registerService({ service, mock, override = [] }, transport = {type: 'http', url: null, delay: 1000}) {
        const { mocks, errors } = buildMocks(mock, override);
        const { error, ...t } = buildTransport(transport);

        if (error) {
            state.errors.set(service, error);
        } else {
            state.services.set(service, { mocks, transport: t });
        }

        if (errors.length) state.errors.set(service, errors);

        return { mocks, transport: t };
    }

    /**
     * @param {{ url: string }} input
     * @returns {Omit<Transport, 'error'> | undefined}
     */
    function getTransport({url}){
        const stored = state.register.get(url);
        return stored?.transport;
    }

    /**
     * @param {{ url: string, index: string, payload?: Record<string, unknown> }} input
     * @returns {{index: string, matched: boolean, scenario: 'matched' | 'difference'} | null}
     */
    function resolve({ url, index, payload = {} }) {
        const stored = state.register.get(url);
        if (!stored?.mocks?.has(index)) return null;

        const mock = stored.mocks.get(index);
        if (!mock) return null;

        if (mock.action === 'input') {
            const matched = mock.condition?.every(c => payload[c.field] === c.value) ?? false;
            return { index: mock.index, matched, scenario: matched ? 'matched' : 'difference'};
        }

        if (mock.action === 'toggle') {
            const matched = Boolean(mock.value);
            return { index: mock.index, matched, scenario: matched ? 'matched' : 'difference'};
        }

        return null;
    }

    /**
     * @param {{ url: string, indexes?: string[], payload?: Record<string, unknown> }} input
     * @returns {ResolveResult | null}
     */
    function resolvePriority({url, indexes = [], payload = {}}){
         for (const index of indexes) {
            const result = resolve({
                url,
                index,
                payload
            });

            if (result?.matched) {
                return result;
            }
        }
        return null;
    }

    return {
        state,
        register,
        registerService,
        resolve,
        resolvePriority,
        getTransport
    };
}


/**
 * @typedef {'createdMock' | 'listMock' | 'editMock'} MockRoute
 */

/** @type {readonly ['createdMock', 'listMock', 'editMock']} */
export const MOCK_ROUTES = /** @type {const} */ (['createdMock', 'listMock','editMock']);

/**
 * @returns {{
 *   route: import('vue').Ref<MockRoute>,
 *   go: (next: MockRoute) => void,
 *   is: (current: MockRoute) => boolean,
 *   headerString: (current: MockRoute) => { title: string }
 * }}
 */
export function typeRouter(){
    const route = ref(/** @type {MockRoute} */ (MOCK_ROUTES[1]));

    /**@param {MockRoute} next */
    function go(next){
        route.value = next;
    }

    /**@param {MockRoute} current */
    function is(current){
        return route.value === current;
    }

    /**
     * @param {MockRoute} current
     * @returns {{ title: string }}
     */
    function headerString(current){
        /** @type {Record<MockRoute, { title: string }>} */
        const map = {
            [MOCK_ROUTES[0]]: {
                title: 'Lista de Mocks Registrados'
            },
            [MOCK_ROUTES[1]]: {
                title: 'Tools Area Application'
            },
            [MOCK_ROUTES[2]]: {
                title: 'Editar Mock'
            }
        };

        return map[current] || {title: ''};
    }

    return {
        route,
        go,
        is,
        headerString
    };
}