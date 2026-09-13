# stateMock()

Factory principal. Retorna um singleton com todas as funções.

## Uso

```js
import { stateMock } from '@lyra-mock-api/core';

const {
    state,
    register,
    registerService,
    resolve,
    resolvePriority,
    getTransport
} = stateMock();
```

## Retorno

| Propriedade | Tipo | Descrição |
|---|---|---|
| `state` | `StateStore` | Acesso direto aos Maps |
| `register` | `function` | Registra mocks para uma URL |
| `registerService` | `function` | Registra mocks para um service |
| `resolve` | `function` | Resolve um mock por index |
| `resolvePriority` | `function` | Resolve múltiplos indexes por prioridade |
| `getTransport` | `function` | Retorna transport de uma URL |

## Singleton

Todas as chamadas de `stateMock()` compartilham o mesmo estado interno:

```js
const a = stateMock();
const b = stateMock();

a.register({ url: '/api/login', mock: { x: { action: 'toggle' } } });

b.state.register.has('/api/login');  // true — mesmo estado
```
