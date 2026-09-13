# Guide: Respostas Condicionais

## Objetivo

Retornar respostas diferentes baseadas no payload usando `action: 'input'`.

## 1. Registrar mocks

```js
const { register, resolve } = stateMock();

register({
    url: '/api/search',
    mock: {},
    override: [
        {
            index: 'results_found',
            action: 'input',
            condition: [{ field: 'query', operator: 'equals', value: 'mock' }]
        },
        {
            index: 'no_results',
            action: 'input',
            condition: [{ field: 'query', operator: 'equals', value: 'vazio' }]
        }
    ]
});
```

## 2. Controller

```js
function search(query) {
    const result = resolve({
        url: '/api/search',
        index: 'results_found',
        payload: { query }
    });

    if (result?.matched) {
        return { results: [{ id: 1, name: 'Mock Result' }] };
    }

    const noResult = resolve({
        url: '/api/search',
        index: 'no_results',
        payload: { query }
    });

    if (noResult?.matched) {
        return { results: [], message: 'Nenhum resultado encontrado' };
    }

    // Padrão
    return { results: [] };
}
```

## 3. Uso

```js
search('mock');
// → { results: [{ id: 1, name: 'Mock Result' }] }

search('vazio');
// → { results: [], message: 'Nenhum resultado encontrado' }

search('qualquer');
// → { results: [] }
```

## Múltiplas condições

```js
override: [{
    index: 'admin_search',
    action: 'input',
    condition: [
        { field: 'query', operator: 'equals', value: 'admin' },
        { field: 'role', operator: 'equals', value: 'admin' }
    ]
}]

// Só retorna matched se AMBOS conditions atendidas
resolve({
    url: '/api/search',
    index: 'admin_search',
    payload: { query: 'admin', role: 'admin' }
});
// → matched: true
```
