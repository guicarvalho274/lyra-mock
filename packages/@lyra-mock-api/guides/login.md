# Guide: Login

## Objetivo

Simular diferentes cenários de login: erros de validação, sucesso, e erros genéricos.

## 1. Registrar mocks

```js
import { stateMock } from '@lyra-mock-api/core';

const { register, resolve, resolvePriority, getTransport, state } = stateMock();

const errosLogin = {
    email_necessarie: { action: 'toggle', group: 'auth' },
    password_invalid: { action: 'toggle', group: 'auth' },
    login_ok: { action: 'toggle', value: true }
};

register({
    url: '/api/login',
    mock: errosLogin,
    override: [
        {
            index: 'email_necessarie',
            action: 'input',
            condition: [{ field: 'email', operator: 'equals', value: '' }],
            group: 'auth'
        }
    ],
    services: ['/api/resend-email']
}, { type: 'http', delay: 1000 });
```

## 2. Definir prioridade

```js
const errosLoginPriority = ['email_necessarie', 'password_invalid'];
```

## 3. Controller

```js
function login(payload) {
    const delay = getTransport({ url: '/api/login' })?.delay || 1000;

    return new Promise((resolvePromise, reject) => {
        setTimeout(() => {
            // 1. Verifica prioridade de erros
            const priority = resolvePriority({
                url: '/api/login',
                indexes: errosLoginPriority,
                payload
            });
            if (priority?.matched) {
                reject({ error: true, index: priority.index });
                return;
            }

            // 2. Verifica login
            const result = resolve({
                url: '/api/login',
                index: 'login_ok',
                payload
            });

            if (result?.matched) {
                resolvePromise({ success: true, token: 'abc123' });
            } else {
                reject({ error: true, index: 'unknown' });
            }
        }, delay);
    });
}
```

## 4. Uso

```js
// Login com sucesso
login({ email: 'gui@test.com', password: '123456' })
    .then(console.log)   // { success: true, token: 'abc123' }
    .catch(console.error);

// Ativar erro de email
state.register.get('/api/login').mocks.get('email_necessarie').value = true;

login({ email: '', password: '123456' })
    .then(console.log)
    .catch(console.error);  // { error: true, index: 'email_necessarie' }
```

## Fluxo

```
login(payload)
  → resolvePriority({ indexes: ['email_necessarie', 'password_invalid'], payload })
  → matched: true? → reject
  → resolve({ index: 'login_ok', payload })
  → matched: true? → resolve
  → reject
```
