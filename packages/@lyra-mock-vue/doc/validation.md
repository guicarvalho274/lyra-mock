# Validação

## Visão Geral

O `validateMock()` valida a estrutura de cada mock antes de armazená-lo. Erros de validação são coletados e armazenados em `state.errors`, acessíveis via URL ou service.

---

## Função de Validação

```js
function validateMock(mock) {
    // retorna null se válido
    // retorna { index, erros } se inválido
}
```

**Retorno válido:** `null`

**Retorno inválido:**
```js
{
    index: 'email_invalid',   // index do mock com erro (ou null)
    erros: [                   // array de mensagens de erro
        'index deve ser uma string não vázia',
        'condition é obrigatória para action:input'
    ]
}
```

---

## Regras de Validação

### index

| Campo | Obrigatório | Tipo | Validação |
|---|---|---|---|
| `index` | Sim | `string` | Não pode ser vazio ou só espaços |

```js
// ✅ Válido
{ index: 'email_invalid', action: 'toggle' }

// ❌ Inválido
{ index: '', action: 'toggle' }
{ index: '   ', action: 'toggle' }
{ index: 123, action: 'toggle' }
```

### action

| Campo | Obrigatório | Tipo | Validação |
|---|---|---|---|
| `action` | Sim | `string` | Deve ser `'toggle'` ou `'input'` |

```js
// ✅ Válido
{ index: 'x', action: 'toggle' }
{ index: 'x', action: 'input' }

// ❌ Inválido
{ index: 'x', action: 'click' }
{ index: 'x', action: '' }
```

### group

| Campo | Obrigatório | Tipo | Validação |
|---|---|---|---|
| `group` | Não | `string` | Se presente, deve ser string não vazia |

```js
// ✅ Válido
{ index: 'x', action: 'toggle', group: 'user' }

// ✅ Opcional (sem group)
{ index: 'x', action: 'toggle' }

// ❌ Inválido
{ index: 'x', action: 'toggle', group: 123 }
```

### condition (obrigatório para action: input)

| Campo | Obrigatório | Tipo | Validação |
|---|---|---|---|
| `condition` | Sim (input) | `Array` | Deve ser **array de objetos** |

**Regra:** `condition` é **sempre um array**. Mesmo com uma única condição, deve ser um array.

```js
// ✅ Válido (uma condição)
{ index: 'x', action: 'input', condition: [{ field: 'email', operator: 'equals', value: 'a@b.com' }] }

// ✅ Válido (múltiplas condições - AND)
{ index: 'x', action: 'input', condition: [
    { field: 'email', operator: 'equals', value: 'gui@...' },
    { field: 'password', operator: 'equals', value: '123456' }
] }

// ❌ Inválido (condition ausente)
{ index: 'x', action: 'input' }

// ❌ Inválido (condition não é array)
{ index: 'x', action: 'input', condition: { field: 'email', operator: 'equals', value: 'a@b.com' } }
{ index: 'x', action: 'input', condition: 'string' }
{ index: 'x', action: 'input', condition: null }

// ❌ Inválido (array vazio)
{ index: 'x', action: 'input', condition: [] }
```

### condition[].field

| Campo | Obrigatório | Tipo | Validação |
|---|---|---|---|
| `condition[].field` | Sim | `string` | Não pode ser vazio |

```js
// ✅ Válido
condition: [{ field: 'email', operator: 'equals', value: 'a@b.com' }]

// ❌ Inválido
condition: [{ field: '', operator: 'equals', value: 'a@b.com' }]
condition: [{ field: 123, operator: 'equals', value: 'a@b.com' }]
```

### condition[].operator

| Campo | Obrigatório | Tipo | Validação |
|---|---|---|---|
| `condition[].operator` | Sim | `string` | Deve ser um dos OPERATORS (`'equals'`) |

```js
// ✅ Válido
condition: [{ field: 'email', operator: 'equals', value: 'a@b.com' }]

// ❌ Inválido
condition: [{ field: 'email', operator: 'contains', value: 'a@b.com' }]
condition: [{ field: 'email', operator: '', value: 'a@b.com' }]
```

### condition[].value

| Campo | Obrigatório | Tipo | Validação |
|---|---|---|---|
| `condition[].value` | Sim | Qualquer | Não pode ser `undefined` |

```js
// ✅ Válido
condition: [{ field: 'email', operator: 'equals', value: 'a@b.com' }]
condition: [{ field: 'email', operator: 'equals', value: 0 }]
condition: [{ field: 'email', operator: 'equals', value: false }]

// ❌ Inválido
condition: [{ field: 'email', operator: 'equals' }]
```

### scenario

| Campo | Obrigatório | Tipo | Validação |
|---|---|---|---|
| `scenario` | Não | `string` | Se presente, deve ser `'matched'` ou `'difference'` |

```js
// ✅ Válido
{ index: 'x', action: 'toggle', scenario: 'matched' }
{ index: 'x', action: 'toggle', scenario: 'difference' }

// ✅ Opcional (sem scenario)
{ index: 'x', action: 'toggle' }

// ❌ Inválido
{ index: 'x', action: 'toggle', scenario: 'custom' }
```

---

## Validação de Overrides

Overrides passam pela mesma validação. Se um override for inválido, ele é descartado mas o mock original continua válido.

```js
// Registro com override inválido
register({
    url: '/',
    mock: errosApiLogin,
    override: [
        { index: 'email', action: 'input' },  // ← condition ausente
        { index: 'password_invalid', action: 'toggle' }  // ← válido
    ]
});

// Resultado:
// - 'email' → descartado (condition obrigatória para input)
// - 'password_invalid' → registrado normalmente
// - state.errors.get('/') → [{ index: 'email', erros: ['condition é obrigatória para action:input'] }]
```

### Override com condition como objeto (inválido)

```js
// Registro com condition como objeto (deveria ser array)
register({
    url: '/',
    mock: errosApiLogin,
    override: [
        {
            index: 'email',
            action: 'input',
            condition: { field: 'email', operator: 'equals', value: 'gui@...' }  // ❌ objeto
        }
    ]
});

// Resultado:
// - 'email' → descartado (condition deve ser array)
// - state.errors.get('/') → [{ index: 'email', erros: ['condition deve ser um array'] }]
```

### Override com condition como array (válido)

```js
// Registro com condition como array
register({
    url: '/',
    mock: errosApiLogin,
    override: [
        {
            index: 'email',
            action: 'input',
            condition: [{ field: 'email', operator: 'equals', value: 'gui@...' }]  // ✅ array
        }
    ]
});

// Resultado:
// - 'email' → registrado normalmente
```

---

## Acessando Erros de Validação

### state.errors

```js
const { state } = stateMock();

// Erros por URL
const errorsByUrl = state.errors.get('/');
// → [{ index: 'email', erros: [...] }, ...]

// Erros por service
const errorsByService = state.errors.get('/resend_email');
// → [{ index: 'user_not_found', erros: [...] }, ...]
```

### Via register (retorno)

```js
const result = register({ url: '/', mock: errosApiLogin, override: [...] });

// result.errors → array de erros de validação
console.log(result.errors);
// → [{ index: 'email', erros: ['condition é obrigatória para action:input'] }]
```

---

## Exemplo Completo

### source (errosApiLogin)

```js
const errosApiLogin = {
    email_invalid: { /* dados do erro */ },
    password_invalid: { /* dados do erro */ },
    user_not_found: { /* dados do erro */ }
};
```

### override com erro

```js
override: [
    { index: 'email', action: 'input' },  // ← inválido (sem condition)
    { index: 'email_invalid', action: 'toggle' }  // ← válido
]
```

### Resultado

```js
// buildMocks retorna:
{
    mocks: Map {
        'email_invalid' => { index: 'email_invalid', action: 'toggle', value: false },
        'password_invalid' => { index: 'password_invalid', action: 'toggle', value: false },
        'user_not_found' => { index: 'user_not_found', action: 'toggle', value: false }
    },
    errors: [
        { index: 'email', erros: ['condition é obrigatória para action:input'] }
    ]
}

// 'email' do override foi descartado
// Os 3 mocks do source foram registrados como toggle
```

---

## Resumo

| Campo | Obrigatório | Validação Principal |
|---|---|---|
| `index` | Sim | String não vazia |
| `action` | Sim | `'toggle'` ou `'input'` |
| `group` | Não | String (se presente) |
| `condition` | Sim (input) | **Array** de objetos com field, operator, value |
| `condition[].field` | Sim | String não vazia |
| `condition[].operator` | Sim | `'equals'` (OPERATORS) |
| `condition[].value` | Sim | Qualquer (não undefined) |
| `scenario` | Não | `'matched'` ou `'difference'` (se presente) |
