# getTransport()

Retorna o transport de uma URL registrada.

## Uso

```js
const { getTransport } = stateMock();

const transport = getTransport({ url: '/api/login' });
// → { type: 'http', url: null, delay: 1000 }
```

## Parâmetros

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `url` | `string` | Sim | URL do registro |

## Retorno

```js
// Encontrado
{ type: 'http' | 'socket' | 'event', url: string | null, delay: number }

// Não encontrado
undefined
```

## Exemplo com delay

```js
const { getTransport, resolve } = stateMock();

function login(payload) {
    const transport = getTransport({ url: '/api/login' });
    const delay = transport?.delay || 1000;

    return new Promise((resolvePromise, reject) => {
        setTimeout(() => {
            const result = resolve({ url: '/api/login', index: 'email', payload });
            // ...
        }, delay);
    });
}
```

## Delay por controller

```js
register({ url: '/api/login', mock: ... }, { type: 'http', delay: 800 });
register({ url: '/api/signup', mock: ... }, { type: 'http', delay: 3000 });

getTransport({ url: '/api/login' })?.delay;   // 800
getTransport({ url: '/api/signup' })?.delay;  // 3000
```
