// @ts-check
import { MOCK_ROUTES } from "../composable/state.js";
import { defineAsyncComponent } from 'vue';

/**
 * @typedef { (typeof MOCK_ROUTES)[number] } MockRoutes
 */

/**
 * @returns {{
 *   components: Record<MockRoutes, import('vue').Component>,
 *   get: (key: MockRoutes) => import('vue').Component | null,
 *   routes: typeof MOCK_ROUTES
 * }}
 */
export function getComponentsMock() {
    /** @type {Record<MockRoutes, import('vue').Component>} */
    const components = {
        [MOCK_ROUTES[0]]: defineAsyncComponent(() => import('./mock/CreatedMock.vue')),
        [MOCK_ROUTES[1]]: defineAsyncComponent(() => import('./mock/ListMock.vue')),
        [MOCK_ROUTES[2]]: defineAsyncComponent(() => import('./mock/EditMock.vue'))
    }

    /**
     * @param {MockRoutes} key
     * @returns {import('vue').Component | null}
     */
    const get = (key) => components[key] || null;

    return {
        components,
        get,
        routes: MOCK_ROUTES
    }
}
