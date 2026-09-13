# Guide: Substituindo uma API Real

## Objetivo

Substituir uma API real por mocks sem alterar o código da aplicação.

## 1. Identificar chamadas API

```js
// Código existente
const response = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
});
const data = await response.json();
```

## 2. Criar mock equivalente

```js
const { register, resolve, getTransport } = stateMock();

register({
    url: '/api/login',
    mock: {
        login_success: { action: 'toggle', value: true },
        login_error: { action: 'toggle', value: false }
    }
}, { type: 'http', delay: 1000 });
```

## 3. Criar service layer

```js
async function loginAPI(email, password) {
    const delay = getTransport({ url: '/api/login' })?.delay || 1000;

    return new Promise((resolvePromise, reject) => {
        setTimeout(() => {
            const result = resolve({
                url: '/api/login',
                index: 'login_success',
                payload: { email, password }
            });

            if (result?.matched) {
                resolvePromise({ token: 'mock-token', user: { email } });
            } else {
                reject({ error: 'Credenciais inválidas' });
            }
        }, delay);
    });
}
```

## 4. Substituir na aplicação

```js
// Antes
const response = await fetch('/api/login', { method: 'POST', body: ... });
const data = await response.json();

// Depois
const data = await loginAPI(email, password);
```

## 5. Alternância entre mock e real

```js
const USE_MOCK = true;

async function login(email, password) {
    if (USE_MOCK) {
        return loginAPI(email, password);
    }

    const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
    return response.json();
}
```

## Checklist

- [ ] Identificar todas as chamadas API
- [ ] Criar mocks para cada endpoint
- [ ] Criar service layer equivalente
- [ ] Testar com mocks
- [ ] Trocar para API real quando disponível
- [ ] Remover mocks em produção
