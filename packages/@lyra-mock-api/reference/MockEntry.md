# MockEntry

Tipo completo de um mock registrado.

## Definição

```ts
{
    index: string;
    action: 'toggle' | 'input';
    condition?: MockCondition[];
    group?: string;
    ui?: { titleUi: string; descriptionUi: string };
    value?: boolean;
    scenario?: 'matched' | 'difference';
}
```

## Campos

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `index` | `string` | Sim | Identificador único do mock |
| `action` | `'toggle' \| 'input'` | Sim | Tipo de resolução |
| `condition` | `MockCondition[]` | Sim (para `input`) | Regras de comparação |
| `group` | `string` | Não | Agrupamento opcional |
| `ui` | `{ titleUi: string, descriptionUi: string }` | Não | Metadados para UI |
| `value` | `boolean` | Não | Estado do toggle (default: `false`) |
| `scenario` | `'matched' \| 'difference'` | Não | Cenário forçado (informativo) |

## Exemplos

### Toggle

```js
{
    index: 'email_invalid',
    action: 'toggle',
    group: 'auth',
    value: false
}
```

### Input

```js
{
    index: 'email_exact',
    action: 'input',
    condition: [
        { field: 'email', operator: 'equals', value: 'gui@test.com' }
    ],
    group: 'auth'
}
```
