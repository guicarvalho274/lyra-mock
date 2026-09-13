# Mocks

## O que é um Mock?

Um mock é uma simulação de comportamento de API. Em vez de fazer uma requisição real, a aplicação consulta o estado interno do mock e retorna uma resposta pré-configurada.

## Estrutura

Cada mock é armazenado como um objeto com esta estrutura:

```js
{
    index: 'email_invalid',       // identificador único (string)
    action: 'toggle',             // 'toggle' | 'input'
    group: 'user',                // agrupamento opcional
    ui: { ... },                  // metadados UI opcionais
    condition: [                  // sempre array (AND logic)
        {
            field: 'email',       // campo do payload para comparar
            operator: 'equals',   // operador de comparação
            value: 'gui@...'      // valor esperado
        }
    ],
    scenario: 'matched',          // 'matched' | 'difference'
    value: false                  // estado do toggle (boolean)
}
```

## Como são armazenados

Mocks são convertidos em `Map<index, MockEntry>` com acesso O(1):

```js
// Registro
register({
    url: '/api/login',
    mock: {
        email_invalid: { action: 'toggle', value: false },
        password_wrong: { action: 'toggle', value: false }
    }
});

// Internamente vira:
Map {
    'email_invalid' => { index: 'email_invalid', action: 'toggle', value: false },
    'password_wrong' => { index: 'password_wrong', action: 'toggle', value: false }
}
```

## Dois formatos de registro

### Objeto indexado (mock)

```js
mock: {
    email_invalid: { action: 'toggle', value: false },
    password_wrong: { action: 'toggle', value: false }
}
```

### Array de overrides

```js
override: [
    { index: 'email_invalid', action: 'input', condition: [...] }
]
```

O `override` sobrescreve mocks existentes ou adiciona novos.

## Validação

Todo mock passa por validação antes de ser armazenado. Campos obrigatórios:

| Campo | Obrigatório | Validação |
|---|---|---|
| `index` | Sim | String não vazia |
| `action` | Sim | `'toggle'` ou `'input'` |
| `group` | Não | Se presente, string não vazia |
| `condition` | Sim (para `input`) | Array de objetos |
| `scenario` | Não | `'matched'` ou `'difference'` |

Mock inválido → descartado + erro em `state.errors`.
