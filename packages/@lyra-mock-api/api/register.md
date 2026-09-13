# register()

Registra mocks para uma URL.

## Uso

```js
const { register } = stateMock();

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

## Parâmetros

### 1º argumento: input

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `url` | `string` | Sim | Identificador da URL |
| `mock` | `Record<string, Partial<MockEntry>>` | Sim | Mocks indexados por key |
| `override` | `MockEntry[]` | Não | Overrides que sobrescrevem/adicionam mocks |
| `services` | `string[]` | Não | Services associados à URL |

### 2º argumento: transport

| Campo | Tipo | Default | Descrição |
|---|---|---|---|
| `type` | `'http' \| 'socket' \| 'event'` | `'http'` | Tipo de transporte |
| `url` | `string \| null` | `null` | URL externa (proxy) |
| `delay` | `number` | `1000` | Delay em ms |

## Retorno

```js
{
    mocks: Map<string, MockEntry>,
    services: string[],
    transport: Transport
}
```

## Comportamento

1. `buildMocks(mock, override)` converte o objeto em `Map<index, MockEntry>`
2. `buildTransport(transport)` valida o tipo
3. Se válido, armazena em `state.register`
4. Erros de validação → `state.errors`
