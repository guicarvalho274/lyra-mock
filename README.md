<p align="center">
  <h1 align="center">Lyra Mock</h1>
  <p align="center">Sistema de mocks para APIs com arquitetura em camadas.</p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/ESM-supported-green" alt="ESM">
  <img src="https://img.shields.io/badge/CJS-supported-blue" alt="CJS">
  <img src="https://img.shields.io/badge/TypeScript-types-purple" alt="TypeScript">
  <img src="https://img.shields.io/badge/License-MIT-red" alt="License">
</p>

---

## Ecossistema

| Pacote | Descrição | Status |
|---|---|---|
| [`@lyra-mock-api/core`](packages/@lyra-mock-api/) | API pura — zero dependências | ✅ Estável |
| [`@lyra-mock/core`](packages/@lyra-mock-vue/) | Plugin Vue 3 / Nuxt | 🧪 Em teste |

---

## Arquitetura

```
┌─────────────────────────────────────────┐
│  @lyra-mock/core (Vue Plugin)           │
│  UI · Shadow DOM · Toggle · CSS Vars    │
├─────────────────────────────────────────┤
│  @lyra-mock-api/core (API Pura)         │
│  register · resolve · validate · Map    │
└─────────────────────────────────────────┘
```

**Princípio:** o sistema não sabe o que são erros, prioridades ou autenticação. Ele apenas armazena, valida e busca por index. Toda lógica de negócio pertence à aplicação.

---

## Quick Start

```js
// ESM
import { stateMock } from '@lyra-mock-api/core';

// CommonJS
const { stateMock } = require('@lyra-mock-api/core');
```

```js
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
```

---

## Instalação

```bash
# API pura
npm install @lyra-mock-api/core

# Plugin Vue (em teste)
npm install @lyra-mock/core
```

---

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Build todos os pacotes
npm run build

# Pack (dry-run)
npm run pack:dry
```

---

## Documentação

- [`@lyra-mock-api/core`](packages/@lyra-mock-api/) — [Introdução](packages/@lyra-mock-api/README.md) · [Conceitos](packages/@lyra-mock-api/concepts/mocks.md) · [Guias](packages/@lyra-mock-api/guides/login.md) · [API](packages/@lyra-mock-api/api/stateMock.md) · [Referência](packages/@lyra-mock-api/reference/MockEntry.md)
- [`@lyra-mock/core`](packages/@lyra-mock-vue/) — plugin Vue (em teste)

---

## Changelog

Ver [CHANGELOG.md](./CHANGELOG.md)

---

## License

[MIT](./LICENSE)
