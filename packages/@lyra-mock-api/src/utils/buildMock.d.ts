export type MockEntry = import('../composable/state.js').MockEntry;
export type Transport = import('../composable/state.js').Transport;
export type TransportType = import('../composable/state.js').TransportType;
/**
 * @param {Record<string, Partial<MockEntry>>} source
 * @param {MockEntry[]} overrides
 * @returns {{ mocks: Map<string, MockEntry>, errors: Array<{ index: string | null, erros: string[] }> }}
 */
export declare function buildMocks(source?: Record<string, Partial<MockEntry>>, overrides?: MockEntry[]): {
    mocks: Map<string, MockEntry>;
    errors: Array<{
        index: string | null;
        erros: string[];
    }>;
};
/**
 * @param {{ type: TransportType, url?: string | null, delay?: number }} input
 * @returns {{ type: TransportType, url: string | null, delay: number, error: false } | { type: undefined, url: undefined, delay: undefined, error: string }}
 */
export declare function buildTransport({ type, url, delay }: {
    type: TransportType;
    url?: string | null;
    delay?: number;
}): {
    type: TransportType;
    url: string | null;
    delay: number;
    error: false;
} | {
    type: undefined;
    url: undefined;
    delay: undefined;
    error: string;
};
