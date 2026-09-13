# ResolveResult

Tipo de retorno das funções `resolve()` e `resolvePriority()`.

## Definição

```ts
{
    index: string;
    matched: boolean;
    scenario: 'matched' | 'difference';
}
```

## Campos

| Campo | Tipo | Descrição |
|---|---|---|
| `index` | `string` | Index do mock que foi resolvido |
| `matched` | `boolean` | `true` se TODAS as condições foram atendidas |
| `scenario` | `'matched' \| 'difference'` | Cenário resultante |

## Valores possíveis

### matched

```js
{ index: 'email_invalid', matched: true, scenario: 'matched' }
```

- Toggle ligado: `mock.value === true`
- Input: `mock.condition.every(c => payload[c.field] === c.value)`

### difference

```js
{ index: 'email_invalid', matched: false, scenario: 'difference' }
```

- Toggle desligado: `mock.value === false`
- Input: pelo menos uma condição não atende

### null

```js
null
```

- Index não encontrado na URL
- URL não registrada
