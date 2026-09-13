# Transport

## O que é Transport?

Transport configura **como** os mocks são entregues: tipo de comunicação, URL externa (opcional) e delay (timeout). Cada URL registrada pode ter seu próprio transport.

## Estrutura

```js
{
    type: 'http',     // 'http' | 'socket' | 'event'
    url: null,         // URL externa (opcional)
    delay: 1000        // delay em ms
}
```

## Campos

| Campo | Tipo | Default | Descrição |
|---|---|---|---|
| `type` | `'http' \| 'socket' \| 'event'` | `'http'` | Tipo de transporte |
| `url` | `string \| null` | `null` | URL externa para proxy |
| `delay` | `number` | `1000` | Delay em milissegundos |

## Tipos

### http

Mock HTTP padrão. Simula uma requisição HTTP com delay.

```js
register({ url: '/api/login', mock: ... }, {
    type: 'http',
    delay: 1000
});
```

### socket

Mock via WebSocket. Útil para simular tempo real.

```js
register({ url: '/api/notifications', mock: ... }, {
    type: 'socket',
    url: 'ws://localhost:3001',
    delay: 500
});
```

### event

Mock via eventos internos. Útil para componentes que escutam eventos.

```js
register({ url: '/api/events', mock: ... }, {
    type: 'event',
    delay: 200
});
```

## Delay por controller

Cada URL pode ter seu próprio delay:

```js
register({ url: '/api/login', mock: ... }, { type: 'http', delay: 800 });
register({ url: '/api/signup', mock: ... }, { type: 'http', delay: 3000 });

getTransport({ url: '/api/login' })?.delay;   // 800
getTransport({ url: '/api/signup' })?.delay;  // 3000
```

## Uso do delay

O delay é usado como timeout no `setTimeout` dos controllers:

```js
const { getTransport, resolve } = stateMock();
const transport = getTransport({ url: '/api/login' });
const delay = transport?.delay || 1000;

return new Promise((resolve, reject) => {
    setTimeout(() => {
        const result = resolve({ url: '/api/login', index: 'email', payload });
        // ...
    }, delay);
});
```

## Transport inválido

Se o `type` não for um dos válidos, o mock **não é registrado**:

```js
buildTransport({ type: 'invalid' })
// → { error: 'Error: transport do register precisa estar entre: http ou socket ou event' }
```

O erro é armazenado em `state.errors`.
