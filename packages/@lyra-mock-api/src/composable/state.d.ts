export type MockAction = 'input' | 'toggle';
export type ConditionOperator = 'equals';
export type MockCondition = {
    field: string;
    operator: ConditionOperator;
    value: string | number | boolean;
};
export type MockUi = {
    titleUi: string;
    descriptionUi: string;
};
export type MockEntry = {
    index: string;
    action: MockAction;
    condition?: MockCondition[];
    group?: string;
    ui?: MockUi;
    value?: boolean;
    scenario?: 'matched' | 'difference';
};
export type TransportType = 'http' | 'socket' | 'event';
export type Transport = {
    type: TransportType;
    url: string | null;
    delay: number;
};
export type RegisterInput = {
    url: string;
    mock: Record<string, Partial<MockEntry>>;
    override?: MockEntry[];
    services?: string[];
};
export type RegisterServiceInput = {
    service: string;
    mock: Record<string, Partial<MockEntry>>;
    override?: MockEntry[];
};
export type ResolveInput = {
    url: string;
    index: string;
    payload?: Record<string, unknown>;
};
export type ResolveResult = {
    index: string;
    matched: boolean;
    scenario: 'matched' | 'difference';
};
export type StateStore = {
    register: Map<string, {
        mocks: Map<string, MockEntry>;
        services: string[];
        transport: Transport;
    }>;
    services: Map<string, {
        mocks: Map<string, MockEntry>;
        transport: Transport;
    }>;
    errors: Map<string, unknown>;
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
export declare function stateMock(): {
    state: StateStore;
    register: (input: RegisterInput, transport?: Transport) => {
        mocks: Map<string, MockEntry>;
        services: string[];
        transport: Transport;
    };
    registerService: (input: RegisterServiceInput, transport?: Transport) => {
        mocks: Map<string, MockEntry>;
        transport: Transport;
    };
    resolve: (input: ResolveInput) => ResolveResult | null;
    resolvePriority: (input: {
        url: string;
        indexes?: string[];
        payload?: Record<string, unknown>;
    }) => ResolveResult | null;
    getTransport: (input: {
        url: string;
    }) => Transport | null;
};
