# Actions

## O que é uma Action?

A action define **como** um mock é resolvido. Cada mock tem uma action que determina a lógica de comparação.

## Actions disponíveis

| Action | Descrição | Compara |
|---|---|---|
| `toggle` | Liga/desliga mock | `mock.value` (boolean) |
| `input` | Compara payload | `mock.condition` (array AND) |

## toggle

Mock ligado/desligado. A resolução verifica se `mock.value` é `true` ou `false`.

```js
register({
    url: '/api/login',
    mock: {
        email_invalid: { action: 'toggle', value: false }
    }
});

// Desligado → matched: false
resolve({ url: '/api/login', index: 'email_invalid' });
// → { index: 'email_invalid', matched: false, scenario: 'difference' }

// Ligado → matched: true
state.register.get('/api/login').mocks.get('email_invalid').value = true;

resolve({ url: '/api/login', index: 'email_invalid' });
// → { index: 'email_invalid', matched: true, scenario: 'matched' }
```

**Padrão:** `value` inicia como `false` (desligado). A aplicação controla quando ativar.

## input

Compara o payload com as conditions do mock. Usa `.every()` — **todas** as condições devem ser atendidas.

```js
register({
    url: '/api/login',
    mock: {},
    override: [{
        index: 'email_exact',
        action: 'input',
        condition: [{ field: 'email', operator: 'equals', value: 'gui@test.com' }]
    }]
});

// matched (email bate)
resolve({ url: '/api/login', index: 'email_exact', payload: { email: 'gui@test.com' } });
// → { index: 'email_exact', matched: true, scenario: 'matched' }

// difference (email não bate)
resolve({ url: '/api/login', index: 'email_exact', payload: { email: 'outro@test.com' } });
// → { index: 'email_exact', matched: false, scenario: 'difference' }
```

## Qual usar?

| Situação | Action |
|---|---|
| Ativar/desativar erro pela UI | `toggle` |
| Validar campo específico do formulário | `input` |
| Simular cenário fixo | `toggle` |
| Simular cenário dependente do payload | `input` |
