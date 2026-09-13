# registerService()

Registra mocks para um service isolado.

## Uso

```js
const { registerService } = stateMock();

registerService({
    service: '/api/resend-email',
    mock: {
        user_not_found: { action: 'toggle', value: false },
        rate_limited: { action: 'toggle', value: false }
    }
}, { type: 'http', delay: 500 });
```

## Parâmetros

### 1º argumento: input

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `service` | `string` | Sim | Identificador do service |
| `mock` | `Record<string, Partial<MockEntry>>` | Sim | Mocks indexados por key |
| `override` | `MockEntry[]` | Não | Overrides |

### 2º argumento: transport

| Campo | Tipo | Default | Descrição |
|---|---|---|---|
| `type` | `'http' \| 'socket' \| 'event'` | `'http'` | Tipo de transporte |
| `url` | `string \| null` | `null` | URL externa |
| `delay` | `number` | `1000` | Delay em ms |

## Retorno

```js
{
    mocks: Map<string, MockEntry>,
    transport: Transport
}
```

## Diferença de register

| Método | Armazena em | Chave |
|---|---|---|
| `register()` | `state.register` | URL |
| `registerService()` | `state.services` | Service |
