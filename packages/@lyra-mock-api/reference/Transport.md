# Transport

Tipo de transporte de um mock.

## Definição

```ts
{
    type: 'http' | 'socket' | 'event';
    url: string | null;
    delay: number;
}
```

## Campos

| Campo | Tipo | Default | Descrição |
|---|---|---|---|
| `type` | `'http' \| 'socket' \| 'event'` | `'http'` | Tipo de transporte |
| `url` | `string \| null` | `null` | URL externa (proxy) |
| `delay` | `number` | `1000` | Delay em milissegundos |

## Tipos

| Tipo | Descrição |
|---|---|
| `http` | Mock HTTP padrão |
| `socket` | Mock via WebSocket |
| `event` | Mock via eventos internos |

## Exemplos

### HTTP padrão

```js
{ type: 'http', url: null, delay: 1000 }
```

### WebSocket

```js
{ type: 'socket', url: 'ws://localhost:3001', delay: 500 }
```

### Eventos

```js
{ type: 'event', url: null, delay: 200 }
```
