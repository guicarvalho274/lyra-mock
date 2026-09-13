# Transport

## Visão Geral

Transport configura como os mocks são entregues: tipo de comunicação, URL externa (opcional) e delay (timeout). Cada URL registrada pode ter seu próprio transport.

---

## Estrutura

```js
{
    type: 'http',    // 'http' | 'socket' | 'event'
    url: null,       // URL externa (opcional)
    delay: 1000      // delay em ms (default: 1000)
}
```

| Campo | Tipo | Obrigatório | Default | Descrição |
|---|---|---|---|---|
| `type` | `string` | Sim | `'http'` | Tipo de transporte |
| `url` | `string` | Não | `null` | URL externa para proxy |
| `delay` | `number` | Não | `1000` | Delay em milissegundos |

---

## Tipos

### http

Mock HTTP padrão. Simula uma requisição HTTP com delay.

```js
register({ url: '/', mock: ..., override: [...] }, {
    type: 'http',
    delay: 1000
});
```

### socket

Mock via WebSocket. Útil para simular tempo real.

```js
register({ url: '/notifications', mock: ..., override: [...] }, {
    type: 'socket',
    url: 'ws://localhost:3001',
    delay: 500
});
```

### event

Mock via eventos internos. Útil para componentes que escutam eventos.

```js
register({ url: '/events', mock: ..., override: [...] }, {
    type: 'event',
    delay: 200
});
```

---

## Registro com Transport

```js
register(
    {
        url: '/',
        mock: errosApiLogin,
        override: [
            {
                index: 'email',
                action: 'input',
                condition: [{ field: 'email', operator: 'equals', value: 'gui@...' }]
            }
        ],
        services: ['/resend_email']
    },
    { type: 'http', delay: 1000 }  // ← transport
);
```

---

## Acessando o Transport

### Via getTransport

```js
const { getTransport } = stateMock();
const transport = getTransport({ url: '/' });

console.log(transport);
// → { type: 'http', url: null, delay: 1000 }
```

O `getTransport` retorna o objeto `transport` diretamente (não `{ transport: {...} }`).

---

## Uso do Delay

O `delay` é usado como timeout no `setTimeout` dos controllers:

```js
async function login(payload) {
    const { getTransport, resolve } = stateMock();
    const transport = getTransport({ url: '/' });
    const delay = transport?.delay || 1000;

    return new Promise((resolvePromise, reject) => {
        setTimeout(() => {
            const result = resolve({ url: '/', index: 'email', payload });
            if (result) {
                resolvePromise(loginResponse(result));
            }
        }, delay);  // ← delay do transport
    });
}
```

### Delay por controller

Cada controller pode ter seu próprio delay:

```js
// Registro para login
register({ url: '/', mock: ..., override: [...] }, { type: 'http', delay: 1000 });

// Registro para created (mais lento)
register({ url: '/criar-conta', mock: ..., override: [...] }, { type: 'http', delay: 4000 });

// Uso
const loginDelay = getTransport({ url: '/' })?.delay || 1000;      // 1000ms
const createdDelay = getTransport({ url: '/criar-conta' })?.delay || 1000;  // 4000ms
```

---

## Transport Inválido

Se o `type` não for um dos válidos, `buildTransport` retorna erro:

```js
buildTransport({ type: 'invalid' })
// → 'transport do register precisa estar entre: http ou socket ou event'
```

O mock **não é registrado** quando o transport é inválido. O erro é armazenado em `state.errors`.

---

## Registro de Services

Services também aceitam transport:

```js
registerService(
    {
        service: '/resend_email',
        mock: errosResendEmail
    },
    { type: 'http', delay: 500 }
);
```

---

## Resumo

| Tipo | Uso | Exemplo |
|---|---|---|
| `http` | Mock HTTP padrão | Simular respostas de API |
| `socket` | WebSocket | Simular tempo real |
| `event` | Eventos internos | Componentes que escutam eventos |
