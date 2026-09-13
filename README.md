<p align="center">
  <h1 align="center">@lyra-mock-api/core</h1>
  <p align="center">API pura (zero dependências) para registro, validação e resolução de mocks.</p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/ESM-supported-green" alt="ESM">
  <img src="https://img.shields.io/badge/CJS-supported-blue" alt="CJS">
  <img src="https://img.shields.io/badge/TypeScript-types-purple" alt="TypeScript">
  <img src="https://img.shields.io/badge/Dependencies-zero-red" alt="Zero Dependencies">
  <img src="https://img.shields.io/badge/Status-stable-brightgreen" alt="Stable">
</p>

> Parte do ecossistema **Lyra Mock**.

---

## Ecossistema

| Pacote | Descrição | Status |
|---|---|---|
| `@lyra-mock-api/core` | API pura — zero dependências | ✅ Estável |
| `@lyra-mock/core` | Plugin Vue 3 / Nuxt | 🧪 Em teste |

---

## Índice

- [Ecossistema](#ecossistema)
- [Instalação](#instalação)
- [Uso](#uso)
- [API](#api)
- [Types](#types)
- [Enums](#enums)
- [Exemplo Completo](#exemplo-completo)
- [Changelog](#changelog)

---

## Instalação

```bash
npm install @lyra-mock-api/core
```

---

## Uso

### ESM

```js
import { stateMock } from '@lyra-mock-api/core';
```

### CommonJS

```js
const { stateMock } = require('@lyra-mock-api/core');
```

### Subimports

```js
// ESM
import { stateMock } from '@lyra-mock-api/core/src/composable/state.mjs';

// CommonJS
const { stateMock } = require('@lyra-mock-api/core/src/composable/state.cjs');
```

---

## API

### `stateMock()`

Factory principal. Retorna um singleton com todas as funções.

```js
const {
    state,           // StateStore — acesso direto aos Maps
    register,        // Registra mocks para uma URL
    registerService, // Registra mocks para um service
    resolve,         // Resolve um mock por index
    resolvePriority, // Resolve múltiplos indexes por prioridade
    getTransport     // Retorna transport de uma URL
} = stateMock();
```

---

### `register(input, transport?)`

Registra mocks para uma URL.

```js
register({
    url: '/api/login',
    mock: {
        email_invalid: { action: 'toggle', value: false },
        password_wrong: { action: 'toggle', value: false }
    },
    override: [
        {
            index: 'email_exact',
            action: 'input',
            condition: [{ field: 'email', operator: 'equals', value: 'gui@test.com' }]
        }
    ],
    services: ['/api/resend-email']
}, { type: 'http', delay: 1000 });
```

**Parâmetros:**

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `url` | `string` | Sim | Identificador da URL |
| `mock` | `Record<string, Partial<MockEntry>>` | Sim | Mocks indexados por key |
| `override` | `MockEntry[]` | Não | Overrides que sobrescrevem/adicionam mocks |
| `services` | `string[]` | Não | Services associados à URL |

**Transport (2º argumento):**

| Campo | Tipo | Default | Descrição |
|---|---|---|---|
| `type` | `'http' \| 'socket' \| 'event'` | `'http'` | Tipo de transporte |
| `url` | `string \| null` | `null` | URL externa (proxy) |
| `delay` | `number` | `1000` | Delay em ms |

**Retorno:** `{ mocks, services, transport }`

---

### `registerService(input, transport?)`

Registra mocks para um service isolado.

```js
registerService({
    service: '/api/resend-email',
    mock: {
        user_not_found: { action: 'toggle', value: false },
        rate_limited: { action: 'toggle', value: false }
    }
}, { type: 'http', delay: 500 });
```

**Retorno:** `{ mocks, transport }`

---

### `resolve(input)`

Busca um mock por index. Retorna `{ index, matched, scenario }` ou `null`.

```js
const result = resolve({
    url: '/api/login',
    index: 'email_exact',
    payload: { email: 'gui@test.com' }
});
// → { index: 'email_exact', matched: true, scenario: 'matched' }
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `url` | `string` | Sim | URL do registro |
| `index` | `string` | Sim | Index do mock |
| `payload` | `Record<string, unknown>` | Não | Dados para comparação (action: `input`) |

---

### `resolvePriority(input)`

Verifica múltiplos indexes em ordem de prioridade. Retorna o primeiro com `matched: true`.

```js
const result = resolvePriority({
    url: '/api/login',
    indexes: ['email_necessarie', 'password_invalid', 'login_ok'],
    payload: { email: 'gui@test.com', password: '123456' }
});
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `url` | `string` | Sim | URL do registro |
| `indexes` | `string[]` | Sim | Lista em ordem de prioridade |
| `payload` | `Record<string, unknown>` | Não | Dados para comparação |

---

### `getTransport(input)`

Retorna o transport de uma URL registrada.

```js
const transport = getTransport({ url: '/api/login' });
// → { type: 'http', url: null, delay: 1000 }
```

---

### `state`

Acesso direto ao estado interno.

```js
const { state } = stateMock();

// Listar URLs registradas
state.register.keys();

// Verificar se URL existe
state.register.has('/api/login');

// Acesso direto ao Map de mocks
state.register.get('/api/login').mocks;

// Mutar toggle
state.register.get('/api/login').mocks.get('email_invalid').value = true;
```

---

## Types

### MockEntry

```ts
{
    index: string;
    action: 'toggle' | 'input';
    condition?: MockCondition[];
    group?: string;
    ui?: { titleUi: string; descriptionUi: string };
    value?: boolean;
    scenario?: 'matched' | 'difference';
}
```

### MockCondition

```ts
{
    field: string;
    operator: 'equals';
    value: string | number | boolean;
}
```

### Transport

```ts
{
    type: 'http' | 'socket' | 'event';
    url: string | null;
    delay: number;
}
```

### ResolveResult

```ts
{
    index: string;
    matched: boolean;
    scenario: 'matched' | 'difference';
}
```

---

## Enums

```js
export const ACTIONS    = ['toggle', 'input'];
export const SCENARIOS  = ['matched', 'difference'];
export const OPERATORS  = ['equals'];
export const TRANSPORT  = ['http', 'socket', 'event'];
```

---

## Action: toggle

Mock ligado/desligado. Resolução verifica `mock.value`.

```js
register({
    url: '/api/login',
    mock: { email_invalid: { action: 'toggle', value: false } }
});

// Desligado → difference
resolve({ url: '/api/login', index: 'email_invalid' });
// → { index: 'email_invalid', matched: false, scenario: 'difference' }

// Ligado → matched
state.register.get('/api/login').mocks.get('email_invalid').value = true;

resolve({ url: '/api/login', index: 'email_invalid' });
// → { index: 'email_invalid', matched: true, scenario: 'matched' }
```

---

## Action: input

Compara payload com conditions (array AND). Usa `.every()`.

```js
register({
    url: '/api/login',
    mock: {},
    override: [{
        index: 'email_exact',
        action: 'input',
        condition: [{ field: 'email', operator: 'equals', value: 'gui@test.com' }]
    }]
});

// matched
resolve({ url: '/api/login', index: 'email_exact', payload: { email: 'gui@test.com' } });
// → { index: 'email_exact', matched: true, scenario: 'matched' }

// difference
resolve({ url: '/api/login', index: 'email_exact', payload: { email: 'outro@test.com' } });
// → { index: 'email_exact', matched: false, scenario: 'difference' }
```

### Múltiplas condições (AND)

```js
condition: [
    { field: 'email', operator: 'equals', value: 'gui@test.com' },
    { field: 'password', operator: 'equals', value: '123456' }
]

// Ambos batem → matched
resolve({ url: '/api/login', index: 'x', payload: { email: 'gui@test.com', password: '123456' } });
// → matched: true

// Só um bate → difference
resolve({ url: '/api/login', index: 'x', payload: { email: 'gui@test.com', password: 'errado' } });
// → matched: false
```

---

## Validação

| Campo | Obrigatório | Validação |
|---|---|---|
| `index` | Sim | String não vazia |
| `action` | Sim | `'toggle'` ou `'input'` |
| `group` | Não | Se presente, string não vazia |
| `condition` | Sim (para `input`) | **Array** de objetos |
| `condition[].field` | Sim | String não vazia |
| `condition[].operator` | Sim | `'equals'` |
| `condition[].value` | Sim | Qualquer (não `undefined`) |
| `scenario` | Não | `'matched'` ou `'difference'` |

### Acessando erros

```js
const { state } = stateMock();

// Erros por URL
state.errors.get('/api/login');

// Erros de transport
// → 'Error: transport do register precisa estar entre: http ou socket ou event'
```

---

## Exemplo Completo

```js
import { stateMock } from '@lyra-mock-api/core';

const { register, resolve, resolvePriority, getTransport, state } = stateMock();

// --- Registro ---
const errosLogin = {
    email_necessarie: { action: 'toggle', group: 'auth' },
    password_invalid: { action: 'toggle', group: 'auth' },
    login_ok: { action: 'toggle', value: true }
};

register({
    url: '/api/login',
    mock: errosLogin,
    override: [
        {
            index: 'email_necessarie',
            action: 'input',
            condition: [{ field: 'email', operator: 'equals', value: '' }],
            group: 'auth'
        }
    ],
    services: ['/api/resend-email']
}, { type: 'http', delay: 1000 });

// --- Resolução com prioridade ---
const errosLoginPriority = ['email_necessarie', 'password_invalid'];

function login(payload) {
    const delay = getTransport({ url: '/api/login' })?.delay || 1000;

    return new Promise((resolvePromise, reject) => {
        setTimeout(() => {
            const priority = resolvePriority({
                url: '/api/login',
                indexes: errosLoginPriority,
                payload
            });
            if (priority?.matched) {
                reject({ error: true, index: priority.index });
                return;
            }

            const result = resolve({
                url: '/api/login',
                index: 'login_ok',
                payload
            });

            if (result?.matched) {
                resolvePromise({ success: true, token: 'abc123' });
            } else {
                reject({ error: true, index: 'unknown' });
            }
        }, delay);
    });
}

// --- Uso ---
login({ email: 'gui@test.com', password: '123456' })
    .then(console.log)
    .catch(console.error);

// Ativar erro via toggle
state.register.get('/api/login').mocks.get('email_necessarie').value = true;

login({ email: 'gui@test.com', password: '123456' })
    .then(console.log)
    .catch(console.error);
```

---

## Changelog

Ver [CHANGELOG.md](./CHANGELOG.md)

---

## License

[MIT](./LICENSE)
