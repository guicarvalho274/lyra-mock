# Guide: Erros de API

## Objetivo

Simular diferentes tipos de erros de API: 400, 401, 403, 404, 500.

## 1. Registrar mocks

```js
const { register, resolve, state } = stateMock();

register({
    url: '/api/users',
    mock: {
        error_400: { action: 'toggle', value: false },
        error_401: { action: 'toggle', value: false },
        error_403: { action: 'toggle', value: false },
        error_404: { action: 'toggle', value: false },
        error_500: { action: 'toggle', value: false },
        success: { action: 'toggle', value: true }
    }
});
```

## 2. Mapear erros para respostas

```js
function apiResponse(result) {
    const schemas = {
        error_400: { status: 400, message: 'Bad Request' },
        error_401: { status: 401, message: 'Unauthorized' },
        error_403: { status: 403, message: 'Forbidden' },
        error_404: { status: 404, message: 'Not Found' },
        error_500: { status: 500, message: 'Internal Server Error' },
        success: { status: 200, message: 'OK' }
    };

    return schemas[result.index] || { status: 500, message: 'Unknown' };
}
```

## 3. Controller

```js
function getUsers() {
    const result = resolve({ url: '/api/users', index: 'success' });

    if (!result?.matched) {
        // Qualquer erro ativo
        const errorIndex = ['error_500', 'error_403', 'error_401', 'error_400', 'error_404']
            .find(index => state.register.get('/api/users').mocks.get(index)?.value);

        return Promise.reject(apiResponse({ index: errorIndex }));
    }

    return Promise.resolve({ status: 200, data: [...] });
}
```

## 4. Ativar erro via UI

```js
// Ativar erro 500
state.register.get('/api/users').mocks.get('error_500').value = true;

getUsers()
    .catch(err => console.log(err));  // { status: 500, message: 'Internal Server Error' }
```
