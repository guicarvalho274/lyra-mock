# Scenarios

## O que é um Scenario?

O scenario indica o resultado da resolução de um mock. Sempre retorna `matched` ou `difference`.

## Scenarios

| Scenario | Significado |
|---|---|
| `matched` | Condição atendida (toggle ligado OU payload bateu) |
| `difference` | Condição não atendida (toggle desligado OU payload não bateu) |

## Como é determinado

O scenario é calculado automaticamente pelo `resolve()`:

```js
// Toggle
matched = Boolean(mock.value);
scenario = matched ? 'matched' : 'difference';

// Input
matched = mock.condition?.every(c => payload[c.field] === c.value) ?? false;
scenario = matched ? 'matched' : 'difference';
```

## Retorno

```js
{
    index: 'email_invalid',        // index do mock
    matched: false,                 // condição atendida?
    scenario: 'difference'          // cenário resultante
}
```

## Uso na aplicação

A aplicação usa o scenario para decidir o que fazer:

```js
const result = resolve({ url: '/api/login', index: 'email_invalid' });

if (result?.matched) {
    // Erro ativo → rejeita
    reject(loginResponse(result));
} else {
    // Erro inativo → continua
    resolvePromise(loginResponse(result));
}
```

## Scenario forçado

É possível forçar o scenario no registro, mas o `resolve()` sempre recalcula baseado na action:

```js
// Isso NÃO força o scenario
{ index: 'x', action: 'toggle', value: false, scenario: 'matched' }

// O resolve() vai retornar matched: false (porque value é false)
```

O campo `scenario` no `MockEntry` é apenas informativo — o cálculo real é feito na resolução.
