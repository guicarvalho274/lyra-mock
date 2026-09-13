# Priority

## O que é Priority?

Priority define a ordem em que múltiplos mocks são verificados. O `resolvePriority()` verifica cada index na ordem fornecida e retorna o **primeiro** com `matched: true`.

## Por que usar?

Em cenários reais, você pode ter vários erros possíveis. A prioridade define qual erro é mais importante:

```js
// Prioridade: email primeiro, depois password, depois login
const errosLoginPriority = ['email_necessarie', 'password_invalid', 'login_ok'];
```

## Como funciona

```js
resolvePriority({ url: '/api/login', indexes: ['A', 'B', 'C'], payload })
```

```
Verifica 'A' → matched: false ↓
Verifica 'B' → matched: true  → retorna { index: 'B', matched: true, scenario: 'matched' }
'C' nunca é verificado
```

## Exemplo completo

```js
const { register, resolvePriority, state } = stateMock();

register({
    url: '/api/login',
    mock: {
        email_necessarie: { action: 'toggle', value: false },
        password_invalid: { action: 'toggle', value: false },
        login_ok: { action: 'toggle', value: true }
    }
});

const errosLoginPriority = ['email_necessarie', 'password_invalid', 'login_ok'];

// Nenhum erro ativo
resolvePriority({ url: '/api/login', indexes: errosLoginPriority });
// → null (nenhum matched)

// Ativar erro de email
state.register.get('/api/login').mocks.get('email_necessarie').value = true;

resolvePriority({ url: '/api/login', indexes: errosLoginPriority });
// → { index: 'email_necessarie', matched: true, scenario: 'matched' }
```

## Regras

- Verifica na **ordem exata** do array
- Retorna **imediatamente** no primeiro `matched: true`
- Se nenhum bater, retorna `null`
- Não verifica todos — para no primeiro match

## Prioridade vs resolve isolado

| Método | Uso |
|---|---|
| `resolve()` | Verifica um mock específico |
| `resolvePriority()` | Verifica múltiplos em ordem, retorna o primeiro match |
