# Guide: Frontend Antes do Backend

## Objetivo

Desenvolver o frontend completo quando a API ainda não está pronta. O mock simula todas as respostas.

## 1. Registrar mocks da API

```js
const { register, resolve, getTransport } = stateMock();

// API de usuários (ainda não existe)
register({
    url: '/api/users',
    mock: {
        list_success: { action: 'toggle', value: true },
        create_success: { action: 'toggle', value: true },
        delete_success: { action: 'toggle', value: true }
    }
}, { type: 'http', delay: 500 });

// API de pedidos (ainda não existe)
register({
    url: '/api/orders',
    mock: {
        list_success: { action: 'toggle', value: true },
        create_success: { action: 'toggle', value: true }
    }
}, { type: 'http', delay: 800 });
```

## 2. Service layer

```js
async function fetchUsers() {
    const delay = getTransport({ url: '/api/users' })?.delay || 500;

    return new Promise((resolve) => {
        setTimeout(() => {
            const result = resolve({ url: '/api/users', index: 'list_success' });
            if (result?.matched) {
                resolve({ data: [{ id: 1, name: 'Usuário 1' }] });
            }
        }, delay);
    });
}

async function fetchOrders() {
    const delay = getTransport({ url: '/api/orders' })?.delay || 800;

    return new Promise((resolve) => {
        setTimeout(() => {
            const result = resolve({ url: '/api/orders', index: 'list_success' });
            if (result?.matched) {
                resolve({ data: [{ id: 1, product: 'Produto 1' }] });
            }
        }, delay);
    });
}
```

## 3. Componente

```js
// Funciona igual com API real
const users = await fetchUsers();
const orders = await fetchOrders();
```

## 4. Trocar para API real

Quando o backend estiver pronto, basta trocar o service layer:

```js
// Antes (mock)
async function fetchUsers() {
    const delay = getTransport({ url: '/api/users' })?.delay || 500;
    return new Promise((resolve) => {
        setTimeout(() => {
            const result = resolve({ url: '/api/users', index: 'list_success' });
            if (result?.matched) resolve({ data: [...] });
        }, delay);
    });
}

// Depois (API real)
async function fetchUsers() {
    const response = await fetch('/api/users');
    return response.json();
}
```

## Vantagens

- Frontend desenvolvido independente do backend
- Testes automatizados funcionam com mocks
- Troca transparente quando a API estiver pronta
