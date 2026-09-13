# Lyra Mock

Sistema de mocks para APIs com arquitetura em camadas. Duas camadas independentes que trabalham juntas.

## Pacotes

| Pacote | Descrição | Status |
|---|---|---|
| [`@lyra-mock-api/core`](packages/@lyra-mock-api/) | API pura — zero dependências | ✅ Publicado |
| [`@lyra-mock/core`](packages/@lyra-mock-vue/) | Plugin Vue 3 / Nuxt | 🧪 Em teste |

## Visão Geral

┌─────────────────────────────────────────┐
│  @lyra-mock/core (Vue Plugin)           │
│  UI · Shadow DOM · Toggle · CSS Vars    │
├─────────────────────────────────────────┤
│  @lyra-mock-api/core (API Pura)         │
│  register · resolve · validate · Map    │
└─────────────────────────────────────────┘

## Quick Start

```js
// ESM
import { stateMock } from '@lyra-mock-api/core';

// CommonJS
const { stateMock } = require('@lyra-mock-api/core');
const { register, resolve, resolvePriority, getTransport } = stateMock();

register({
    url: '/api/login',
    mock: {
        email_invalid: { action: 'toggle', value: false },
        login_ok: { action: 'toggle', value: true }
    }
}, { type: 'http', delay: 1000 });

const result = resolve({ url: '/api/login', index: 'login_ok' });
// → { index: 'login_ok', matched: true, scenario: 'matched' }
Princípio
O sistema não sabe o que são erros, prioridades ou autenticação. Ele apenas armazena, valida e busca por index. Toda lógica de negócio pertence à aplicação.
License
MIT

---
