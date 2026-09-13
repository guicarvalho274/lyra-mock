# Conditions

## O que é uma Condition?

Conditions são as regras de comparação para mocks com `action: 'input'`. Cada condition compara um campo do payload com um valor esperado.

## Estrutura

```js
{
    field: 'email',                    // campo do payload
    operator: 'equals',                // operador de comparação
    value: 'gui@test.com'             // valor esperado
}
```

## Condition é sempre um array

Mesmo com uma única condição, deve ser um array. A resolução usa `.every()` (AND lógico) — **todas** as condições devem ser atendidas.

```js
// Uma condição
condition: [
    { field: 'email', operator: 'equals', value: 'gui@test.com' }
]

// Múltiplas condições (AND)
condition: [
    { field: 'email', operator: 'equals', value: 'gui@test.com' },
    { field: 'password', operator: 'equals', value: '123456' }
]
```

## Lógica AND

```js
condition: [
    { field: 'email', operator: 'equals', value: 'gui@test.com' },
    { field: 'password', operator: 'equals', value: '123456' }
]

// Ambos batem → matched: true
resolve({ url: '/api/login', index: 'x', payload: { email: 'gui@test.com', password: '123456' } });
// → matched: true

// Só um bate → matched: false
resolve({ url: '/api/login', index: 'x', payload: { field: 'email', operator: 'equals', value: 'gui@test.com', password: 'errado' } });
// → matched: false

// Nenhum bate → matched: false
resolve({ url: '/api/login', index: 'x', payload: { email: 'outro@test.com', password: 'errado' } });
// → matched: false
```

## Operadores

| Operador | Descrição | Exemplo |
|---|---|---|
| `equals` | Igualdade estrita (`===`) | `{ field: 'email', operator: 'equals', value: 'gui@test.com' }` |

## Campos do payload

O `field` da condition deve existir no `payload` passado ao `resolve()`:

```js
// Condition
condition: [{ field: 'email', operator: 'equals', value: 'gui@test.com' }]

// Payload deve conter 'email'
resolve({ url: '/api/login', index: 'x', payload: { email: 'gui@test.com' } });
```

## Validação

| Campo | Obrigatório | Validação |
|---|---|---|
| `field` | Sim | String não vazia |
| `operator` | Sim | `'equals'` |
| `value` | Sim | Qualquer (não `undefined`) |
