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

---

## Introdução

`@lyra-mock-api/core` é uma API pura (zero dependências) para registro, validação e resolução de mocks. Funciona em qualquer runtime JavaScript — Node.js, browser, Deno, Bun.

**Princípio:** o sistema não sabe o que são erros, prioridades ou autenticação. Ele apenas armazena, valida e busca por index. Toda lógica de negócio pertence à aplicação.

---

## Instalação

```bash
npm install @lyra-mock-api/core
```

---

## Quick Start

### ESM

```js
import { stateMock } from '@lyra-mock-api/core';
```

### CommonJS

```js
const { stateMock } = require('@lyra-mock-api/core');
```

### Exemplo

```js
const { register, resolve, resolvePriority, getTransport } = stateMock();

// Registrar mocks
register({
    url: '/api/login',
    mock: {
        email_invalid: { action: 'toggle', value: false },
        login_ok: { action: 'toggle', value: true }
    }
}, { type: 'http', delay: 1000 });

// Resolver
const result = resolve({ url: '/api/login', index: 'login_ok' });
// → { index: 'login_ok', matched: true, scenario: 'matched' }
```

---

## Documentação

### Conceitos

- [Mocks](concepts/mocks.md) — o que são mocks e como são armazenados
- [Actions](concepts/actions.md) — toggle vs input
- [Conditions](concepts/conditions.md) — condition array, lógica AND
- [Scenarios](concepts/scenarios.md) — matched vs difference
- [Priority](concepts/priority.md) — resolvePriority
- [Transport](concepts/transport.md) — type, url, delay

### Guias

- [Login](guides/login.md) — exemplo: login completo
- [Validação de Formulário](guides/form-validation.md) — exemplo: validação de campos
- [Erros de API](guides/api-errors.md) — exemplo: simular erros HTTP
- [Respostas Condicionais](guides/conditional-responses.md) — exemplo: respostas baseadas no payload
- [Frontend Antes do Backend](guides/frontend-before-backend.md) — exemplo: desenvolvimento independente
- [Substituindo API Real](guides/replacing-real-api.md) — exemplo: trocar API por mocks

### API

- [stateMock()](api/stateMock.md) — factory principal
- [register()](api/register.md) — registro por URL
- [registerService()](api/registerService.md) — registro por service
- [resolve()](api/resolve.md) — resolução por index
- [resolvePriority()](api/resolvePriority.md) — resolução por prioridade
- [getTransport()](api/getTransport.md) — acesso ao transport

### Referência

- [MockEntry](reference/MockEntry.md) — tipo completo de um mock
- [MockCondition](reference/MockCondition.md) — tipo de condição
- [Transport](reference/Transport.md) — tipo de transporte
- [ResolveResult](reference/ResolveResult.md) — tipo de retorno
- [Enums](reference/Enums.md) — ACTIONS, SCENARIOS, OPERATORS, TRANSPORT

---

## Changelog

Ver [CHANGELOG.md](./CHANGELOG.md)

---

## License

[MIT](./LICENSE)
