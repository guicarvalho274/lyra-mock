# resolve()

## Visão Geral

`resolve()` e `resolvePriority()` são as funções centrais do plugin. `resolve()` busca um mock específico por `index` e retorna o resultado da resolução. `resolvePriority()` verifica múltiplos indexes em ordem de prioridade.

A aplicação controla qual index resolver, em que ordem, e o que fazer com o resultado.

---

## resolve()

### Assinatura

```js
const { resolve } = stateMock();

const result = resolve({ url: string, index: string, payload?: object });
```

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `url` | `string` | Sim | URL do registro |
| `index` | `string` | Sim | Index do mock a resolver |
| `payload` | `object` | Não | Dados para comparação (action: `input`) |

**Retorno:** `{ index, matched, scenario }` ou `null`

### Retorno

```js
{
    index: 'email_necessarie',     // index do mock resolvido
    matched: true,                  // condição atendida?
    scenario: 'matched'             // 'matched' | 'difference'
}
```

| Campo | Tipo | Descrição |
|---|---|---|
| `index` | `string` | Index do mock que foi resolvido |
| `matched` | `boolean` | `true` se TODAS as condições foram atendidas |
| `scenario` | `string` | `'matched'` se atendido, `'difference'` se não |

### Fluxo de Resolução

```
resolve({ url: '/', index: 'email_necessarie', payload })
    ↓
state.register.get(url)  →  { mocks: Map, services: [...], transport: {...} }
    ↓
stored.mocks.has(index)?  →  sim ↓  não → null
    ↓
stored.mocks.get(index)  →  mock individual
    ↓
mock.action === 'input'?  →  mock.condition.every(c => payload[c.field] === c.value)
mock.action === 'toggle'? →  verifica mock.value (true/false)
    ↓
retorna { index, matched, scenario }
```

### A Lógica AND em condition

`condition` é **sempre um array**. O resolve usa `.every()` — **todas** as condições devem ser atendidas para que `matched` seja `true`.

```js
// Condition com uma única condição
condition: [{ field: 'email', operator: 'equals', value: 'gui@...' }]

// Resolve com payload que bate
resolve({ url: '/', index: 'email', payload: { email: 'gui@...' } })
// → { index: 'email', matched: true, scenario: 'matched' }

// Resolve com payload que não bate
resolve({ url: '/', index: 'email', payload: { email: 'outro@...' } })
// → { index: 'email', matched: false, scenario: 'difference' }
```

```js
// Condition com múltiplas condições (AND)
condition: [
    { field: 'email', operator: 'equals', value: 'gui@...' },
    { field: 'password', operator: 'equals', value: '123456' }
]

// Resolve com payload que bate em AMBAS
resolve({ url: '/', index: 'login_successfly', payload: { email: 'gui@...', password: '123456' } })
// → { index: 'login_successfly', matched: true, scenario: 'matched' }

// Resolve com payload que bate só em uma
resolve({ url: '/', index: 'login_successfly', payload: { email: 'gui@...', password: 'errado' } })
// → { index: 'login_successfly', matched: false, scenario: 'difference' }
```

---

## resolvePriority()

### Assinatura

```js
const { resolvePriority } = stateMock();

const result = resolvePriority({ url: string, indexes: string[], payload?: object });
```

| Parâmetro | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `url` | `string` | Sim | URL do registro |
| `indexes` | `string[]` | Sim | Lista de indexes em ordem de prioridade |
| `payload` | `object` | Não | Dados para comparação |

**Retorno:** `{ index, matched, scenario }` ou `null`

### Comportamento

Verifica cada index na ordem fornecida. Retorna **imediatamente** no primeiro com `matched: true`. Se nenhum bater, retorna `null`.

```js
const errosLoginPriority = ['email_necessarie', 'password_invalid'];

// Nenhum erro ativo
const priority = resolvePriority({ url: '/', indexes: errosLoginPriority });
// → null

// 'email_necessarie' ativo (toggle ligado)
state.register.get('/').mocks.get('email_necessarie').value = true;
const priority = resolvePriority({ url: '/', indexes: errosLoginPriority });
// → { index: 'email_necessarie', matched: true, scenario: 'matched' }
```

---

## Action: toggle

Para mocks com `action: 'toggle'`, a resolução verifica se o mock está ligado ou desligado.

### Mock registrado

```js
register({
    url: '/criar-conta',
    mock: errosApi,
    override: [
        { index: 'email_necessarie', action: 'toggle', group: 'user' }
    ]
});
```

### Estado do mock no Map

```js
// state.register.get('/criar-conta').mocks
Map {
    'email_necessarie' => {
        index: 'email_necessarie',
        action: 'toggle',
        value: false,        // ← desligado por padrão
        group: 'user'
    }
}
```

### Resolução com toggle desligado

```js
resolve({ url: '/criar-conta', index: 'email_necessarie' })
// → { index: 'email_necessarie', matched: false, scenario: 'difference' }
```

### Resolução com toggle ligado (UI ativou)

```js
// UI altera o estado
state.register.get('/criar-conta').mocks.get('email_necessarie').value = true;

resolve({ url: '/criar-conta', index: 'email_necessarie' })
// → { index: 'email_necessarie', matched: true, scenario: 'matched' }
```

---

## Action: input

Para mocks com `action: 'input'`, a resolução compara o payload com **todas** as condições do array (AND).

### Mock registrado

```js
register({
    url: '/',
    mock: errosApiLogin,
    override: [
        {
            index: 'email',
            action: 'input',
            condition: [
                { field: 'email', operator: 'equals', value: 'gui@...' }
            ],
            group: 'user'
        }
    ]
});
```

### Estado do mock no Map

```js
// state.register.get('/').mocks
Map {
    'email' => {
        index: 'email',
        action: 'input',
        condition: [
            { field: 'email', operator: 'equals', value: 'gui@...' }
        ],
        group: 'user'
    }
}
```

### Resolução com payload que bate (matched)

```js
resolve({
    url: '/',
    index: 'email',
    payload: { email: 'gui@...' }
})
// → { index: 'email', matched: true, scenario: 'matched' }
```

### Resolução com payload que não bate (difference)

```js
resolve({
    url: '/',
    index: 'email',
    payload: { email: 'outro@example.com' }
})
// → { index: 'email', matched: false, scenario: 'difference' }
```

### Exemplo com múltiplas condições (AND)

```js
// Mock com 2 condições
register({
    url: '/',
    mock: errosApiLogin,
    override: [
        {
            index: 'login_successfly',
            action: 'input',
            condition: [
                { field: 'email', operator: 'equals', value: 'gui@...' },
                { field: 'password', operator: 'equals', value: '123456' }
            ]
        }
    ]
});

// AMBOS batem → matched
resolve({ url: '/', index: 'login_successfly', payload: { email: 'gui@...', password: '123456' } })
// → { index: 'login_successfly', matched: true, scenario: 'matched' }

// SÓ UM bate → difference
resolve({ url: '/', index: 'login_successfly', payload: { email: 'gui@...', password: 'errado' } })
// → { index: 'login_successfly', matched: false, scenario: 'difference' }

// NENHUM bate → difference
resolve({ url: '/', index: 'login_successfly', payload: { email: 'outro@...', password: 'errado' } })
// → { index: 'login_successfly', matched: false, scenario: 'difference' }
```

---

## Data Mapper — Mapeando resultado para resposta

O `resolve()` retorna dados genéricos (`{ index, matched, scenario }`). A aplicação mapeia isso para respostas específicas usando um **data mapper**.

### Exemplo: Login

```js
// data/mock/auth/response.js
function loginResponse(result) {
    const loginSchema = {
        email_necessarie: {
            matched: () => ({
                error: true,
                success: false,
                message: 'auth_err',
                data: 'email_necessarie'
            }),
            difference: () => null
        },
        login_successfly: {
            matched: () => ({
                error: false,
                success: true,
                message: 'login_success',
                data: { token: '...', user_id: '...' }
            }),
            difference: () => ({
                error: true,
                success: false,
                message: 'auth_err',
                data: 'email_necessarie'
            })
        }
    };

    const schema = loginSchema?.[result.index]?.[result.scenario];
    if (!schema) return { data: { error: true, success: false, message: 'auth_err', data: result.index } };

    return schema();
}
```

### Uso no controller

```js
async login(axios, { payload }) {
    const { loginResponse, errosLoginPriority } = loginMock();
    const { resolve, resolvePriority, getTransport } = stateMock();

    const delay = getTransport({ url: '/' })?.delay || 1000;

    return new Promise((resolvePromise, reject) => {
        setTimeout(() => {
            // 1. Verifica prioridade de erros
            const priority = resolvePriority({ url: '/', indexes: errosLoginPriority, payload });
            if (priority) {
                reject(loginResponse(priority));
                return;
            }

            // 2. Verifica email
            const resultEmail = resolve({ url: '/', index: 'email', payload });
            if (resultEmail?.matched) {
                resolvePromise(loginResponse(resultEmail));
                return;
            }

            // 3. Verifica login
            const resultLogin = resolve({ url: '/', index: 'login_successfly', payload });
            if (resultLogin) {
                resultLogin.matched
                    ? resolvePromise(loginResponse(resultLogin))
                    : reject(loginResponse(resultLogin));
                return;
            }
        }, delay);
    });
}
```

---

## Possíveis Caminhos

### 1. Erro ativado (toggle + matched)

```
UI ativa 'email_necessarie' = true
    ↓
resolvePriority({ url: '/', indexes: [...], payload })
    → matched: true, scenario: 'matched'
    ↓
loginResponse({ index: 'email_necessarie', scenario: 'matched' })
    → { error: true, success: false, message: 'auth_err', data: 'email_necessarie' }
    ↓
Promise.reject(...)
```

### 2. Payload bate (input + matched)

```
resolve({ url: '/', index: 'email', payload: { email: 'gui@...' } })
    → matched: true, scenario: 'matched'
    ↓
loginResponse({ index: 'email', scenario: 'matched' })
    → { error: false, success: true, message: 'login_success', data: { email_valid: false, ... } }
```

### 3. Payload não bate (input + difference)

```
resolve({ url: '/', index: 'email', payload: { email: 'outro@...' } })
    → matched: false, scenario: 'difference'
    ↓
loginResponse({ index: 'email', scenario: 'difference' })
    → null (continua para próxima verificação)
```

### 4. Múltiplas condições (AND)

```
resolve({ url: '/', index: 'login_successfly', payload: { email: 'gui@...', password: '123456' } })
    → condition.every(c => payload[c.field] === c.value) → true
    → { index: 'login_successfly', matched: true, scenario: 'matched' }
    ↓
loginResponse({ index: 'login_successfly', scenario: 'matched' })
    → { error: false, success: true, message: 'login_success', data: { token: '...', ... } }
```

### 5. Mock não encontrado

```
resolve({ url: '/', index: 'inexistente' })
    → null
    ↓
Controller trata como "sem mock" → pode chamar API real ou retornar erro padrão
```

---

## Sem Pinia / Sem Store

O `resolve()` não depende de Pinia ou store. Pode ser usado diretamente:

```js
// Composable puro
const { resolve, resolvePriority, getTransport } = stateMock();

async function login(payload) {
    const errosLoginPriority = ['email_necessarie', 'password_invalid'];

    const priority = resolvePriority({ url: '/', indexes: errosLoginPriority, payload });
    if (priority) throw new Error(priority.index);

    const result = resolve({ url: '/', index: 'email', payload });
    if (result?.matched) return { success: true, scenario: result.scenario };

    const resultLogin = resolve({ url: '/', index: 'login_successfly', payload });
    return resultLogin ? { success: resultLogin.matched } : { error: 'unknown' };
}
```

---

## Resumo

| Ação | Input | Resultado |
|---|---|---|
| `toggle` ligado | — | `matched: true` |
| `toggle` desligado | — | `matched: false` |
| `input` todas condições batem | `condition.every(c => payload[c.field] === c.value)` | `matched: true` |
| `input` pelo menos uma não bate | `!condition.every(...)` | `matched: false` |
| `resolvePriority` primeiro matched | `indexes[i]` com `matched: true` | retorna imediatamente |
| `resolvePriority` nenhum matched | todos com `matched: false` | `null` |
| index não existe | — | `null` |
