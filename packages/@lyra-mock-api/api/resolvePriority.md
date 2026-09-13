# resolvePriority()

Verifica múltiplos indexes em ordem de prioridade.

## Uso

```js
const { resolvePriority } = stateMock();

const result = resolvePriority({
    url: '/api/login',
    indexes: ['email_necessarie', 'password_invalid', 'login_ok'],
    payload: { email: 'gui@test.com', password: '123456' }
});
```

## Parâmetros

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `url` | `string` | Sim | URL do registro |
| `indexes` | `string[]` | Sim | Lista em ordem de prioridade |
| `payload` | `Record<string, unknown>` | Não | Dados para comparação |

## Retorno

```js
// Primeiro match encontrado
{ index: string, matched: true, scenario: 'matched' }

// Nenhum match
null
```

## Comportamento

1. Itera `indexes` na ordem fornecida
2. Chama `resolve()` para cada um
3. Retorna **imediatamente** no primeiro `matched: true`
4. Se nenhum bater, retorna `null`

## Exemplo

```js
const errosLoginPriority = ['email_necessarie', 'password_invalid'];

// Nenhum erro ativo
resolvePriority({ url: '/api/login', indexes: errosLoginPriority });
// → null

// 'email_necessarie' ativo
state.register.get('/api/login').mocks.get('email_necessarie').value = true;

resolvePriority({ url: '/api/login', indexes: errosLoginPriority });
// → { index: 'email_necessarie', matched: true, scenario: 'matched' }
```

## Regras

- Verifica na **ordem exata** do array
- Retorna no **primeiro** match
- Não verifica todos — para quando encontra
