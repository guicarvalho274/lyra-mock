// @ts-check

import { buildMocks, buildTransport } from '../utils/buildMock.js';

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

/**
 * @typedef {Object} StateStore
 * @property {Map<string, { mocks: Map<string, MockEntry>, services: string[], transport: Transport }>} register
 * @property {Map<string, { mocks: Map<string, MockEntry>, transport: Transport }>} services
 * @property {Map<string, unknown>} errors
 */

/** @type {StateStore} */
const state = {
    register: new Map(),
    services: new Map(),
    errors: new Map()
};

/**
 * @returns {{
 *   state: StateStore,
 *   register: (input: RegisterInput, transport?: Transport) => { mocks: Map<string, MockEntry>, services: string[], transport: Transport },
 *   registerService: (input: RegisterServiceInput, transport?: Transport) => { mocks: Map<string, MockEntry>, transport: Transport },
 *   resolve: (input: ResolveInput) => ResolveResult | null,
 *   resolvePriority: (input: { url: string, indexes?: string[], payload?: Record<string, unknown> }) => ResolveResult | null,
 *   getTransport: (input: { url: string }) => Transport | null
 * }}
 */
export function stateMock() {
    /**
     * @param {RegisterInput} input
     * @param {Transport} [transport]
     * @returns {{ mocks: Map<string, MockEntry>, services: string[], transport: Transport }}
     */
    function register({ url, mock, override = [], services = [] }, transport = {type: 'http', url: null, delay: 1000}) {
        const { mocks, errors } = buildMocks(mock, override);
        const { error, type, url: tUrl, delay } = buildTransport(transport);
        
        /** @type {Transport} */
        const t = { 
            type: /** @type {import('./state.js').TransportType} */ (type || 'http'), 
            url: tUrl || null, 
            delay: delay || 1000 
        };

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
     * @returns {{ mocks: Map<string, MockEntry>, transport: Transport }}
     */
    function registerService({ service, mock, override = [] }, transport = {type: 'http', url: null, delay: 1000}) {
        const { mocks, errors } = buildMocks(mock, override);
        const { error, type, url: tUrl, delay } = buildTransport(transport);

        /** @type {Transport} */
        const t = { 
            type: /** @type {import('./state.js').TransportType} */ (type || 'http'), 
            url: tUrl || null, 
            delay: delay || 1000 
        };

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
     * @returns {Transport | null}
     */
    function getTransport({url}){
        const stored = state.register.get(url);
        return stored?.transport || null;
    }

    /**
     * @param {{ url: string, index: string, payload?: Record<string, unknown> }} input
     * @returns {ResolveResult | null}
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
