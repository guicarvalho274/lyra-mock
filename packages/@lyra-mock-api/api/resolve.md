# resolve()

Busca um mock por index dentro de uma URL registrada.

## Uso

```js
const { resolve } = stateMock();

const result = resolve({
    url: '/api/login',
    index: 'email_invalid',
    payload: { email: 'gui@test.com' }
});
```

## Parâmetros

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `url` | `string` | Sim | URL do registro |
| `index` | `string` | Sim | Index do mock |
| `payload` | `Record<string, unknown>` | Não | Dados para comparação (action: `input`) |

## Retorno

```js
// Encontrado
{ index: string, matched: boolean, scenario: 'matched' | 'difference' }

// Não encontrado
null
```

## Fluxo interno

```
resolve({ url, index, payload })
  → state.register.get(url)
  → stored.mocks.has(index)?  → não: return null
  → stored.mocks.get(index)
  → action === 'input'?  → condition.every(c => payload[c.field] === c.value)
  → action === 'toggle'? → Boolean(mock.value)
  → return { index, matched, scenario }
```

## Exemplos

### Toggle desligado

```js
resolve({ url: '/api/login', index: 'email_invalid' });
// → { index: 'email_invalid', matched: false, scenario: 'difference' }
```

### Toggle ligado

```js
state.register.get('/api/login').mocks.get('email_invalid').value = true;

resolve({ url: '/api/login', index: 'email_invalid' });
// → { index: 'email_invalid', matched: true, scenario: 'matched' }
```

### Input com payload

```js
resolve({
    url: '/api/login',
    index: 'email_exact',
    payload: { email: 'gui@test.com' }
});
// → { index: 'email_exact', matched: true, scenario: 'matched' }
```
