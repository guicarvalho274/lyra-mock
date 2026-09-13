# MockCondition

Tipo de uma condição de comparação.

## Definição

```ts
{
    field: string;
    operator: 'equals';
    value: string | number | boolean;
}
```

## Campos

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `field` | `string` | Sim | Campo do payload para comparar |
| `operator` | `'equals'` | Sim | Operador de comparação |
| `value` | `string \| number \| boolean` | Sim | Valor esperado |

## Exemplos

### String

```js
{ field: 'email', operator: 'equals', value: 'gui@test.com' }
```

### Número

```js
{ field: 'age', operator: 'equals', value: 18 }
```

### Boolean

```js
{ field: 'active', operator: 'equals', value: true }
```

## Operadores

| Operador | Descrição | Exemplo |
|---|---|---|
| `equals` | Igualdade estrita (`===`) | `{ field: 'email', operator: 'equals', value: 'a@b.com' }` |

## Validação

| Campo | Obrigatório | Validação |
|---|---|---|
| `field` | Sim | String não vazia |
| `operator` | Sim | `'equals'` |
| `value` | Sim | Qualquer (não `undefined`) |
