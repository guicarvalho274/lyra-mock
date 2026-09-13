# Enums

Constantes usadas pelo sistema de validação.

## ACTIONS

```js
export const ACTIONS = ['toggle', 'input'];
```

Define o tipo de ação de cada mock.

| Valor | Descrição |
|---|---|
| `toggle` | Liga/desliga mock |
| `input` | Compara payload com conditions |

## SCENARIOS

```js
export const SCENARIOS = ['matched', 'difference'];
```

Define o cenário de retorno após resolução.

| Valor | Descrição |
|---|---|
| `matched` | Condição atendida |
| `difference` | Condição não atendida |

## OPERATORS

```js
export const OPERATORS = ['equals'];
```

Define o operador de comparação para `action: 'input'`.

| Valor | Descrição |
|---|---|
| `equals` | Igualdade estrita (`===`) |

## TRANSPORT

```js
export const TRANSPORT = ['http', 'socket', 'event'];
```

Define o tipo de transporte do mock.

| Valor | Descrição |
|---|---|
| `http` | Mock HTTP padrão |
| `socket` | Mock via WebSocket |
| `event` | Mock via eventos internos |
