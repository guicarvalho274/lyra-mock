# @mock — Mock System para Vue/Nuxt

## O que é?

`@mock` é um plugin genérico para aplicações Vue 3 / Nuxt que permite simular respostas de API (erros, sucesso, cenários) sem modificar o código da aplicação. Ele funciona como uma camada de interceptação: a aplicação registra mocks, e o plugin armazena, valida e resolve qual mock aplicar em tempo de execução.

**Princípio fundamental:** o plugin não sabe o que são erros, prioridades ou respostas. Ele apenas armazena, valida e busca por index. Toda lógica de negócio pertence à aplicação.

---

## Arquitetura

```
┌─────────────────────────────────────────────┐
│  PLUGIN (mock/)                             │
│                                             │
│  buildMocks()      → retorna Map<index, mock>│
│  validateMock()    → valida estrutura        │
│  stateMock()       → register, resolve,      │
│                      resolvePriority,        │
│                      getTransport            │
│                                             │
│  ❌ Não sabe quantos erros existem           │
│  ❌ Não sabe qual prioridade                 │
│  ❌ Não itera mocks                          │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│  APP (data/mock/, stores/req/auth.js)       │
│                                             │
│  Registra mocks com erros + overrides       │
│  Define prioridade de erros                 │
│  Define schemas de resposta                 │
│  Controla fluxo do controller               │
│                                             │
│  ✅ Controla fluxo                          │
│  ✅ Controla prioridade                     │
│  ✅ Só olha os erros que precisa            │
└─────────────────────────────────────────────┘
```

---

## Enums e Constantes

### ACTIONS

Define o tipo de ação de cada mock:

| Ação | Descrição | Uso |
|---|---|---|
| `toggle` | Liga/desliga um mock | Erros ativados manualmente pela UI |
| `input` | Compara payload com condição | Validação de campos (email, phone, etc.) |

### SCENARIOS

Define o cenário de retorno após resolução:

| Cenário | Descrição |
|---|---|
| `matched` | Condição atendida (payload bateu OU toggle ligado) |
| `difference` | Condição não atendida (payload não bateu OU toggle desligado) |

### OPERATORS

Define o operador de comparação para `action: 'input'`:

| Operador | Descrição |
|---|---|
| `equals` | Igualdade estrita (`===`) |

### TRANSPORT

Define o tipo de transporte do mock:

| Tipo | Descrição |
|---|---|
| `http` | Mock HTTP padrão |
| `socket` | Mock via WebSocket |
| `event` | Mock via eventos |

---

## Estrutura de um Mock

Cada mock registrado é armazenado como um objeto com esta estrutura:

```js
{
    index: 'email_invalid',       // identificador único (string)
    action: 'toggle',             // 'toggle' | 'input'
    group: 'user',                // agrupamento opcional (string)
    ui: { ... },                  // metadados UI opcionais
    condition: [                  // sempre array (AND logic)
        {
            field: 'email',       // campo do payload para comparar
            operator: 'equals',   // operador de comparação
            value: 'gui@...'      // valor esperado
        }
    ],
    scenario: 'matched',          // 'matched' | 'difference' (opcional)
    value: false                  // estado do toggle (boolean)
}
```

**Regra importante:** `condition` é **sempre um array de objetos**. Mesmo com uma única condição, deve ser um array. A resolução usa `.every()` (AND lógico) — todas as condições devem ser atendidas.

---

## Fluxo de Resolução

### 1. Registro

A aplicação registra mocks por URL:

```js
register({
    url: '/',
    mock: errosApiLogin,         // objeto com todos os erros da entidade
    override: [
        {
            index: 'email',
            action: 'input',
            condition: [          // ← array de condições (AND)
                { field: 'email', operator: 'equals', value: 'gui@...' }
            ]
        }
    ],
    services: ['/resend_email']
}, { type: 'http', delay: 1000 });
```

O `buildMocks` converte o objeto `errosApiLogin` em um `Map<index, mock>` com O(1) de acesso.

### 2. Resolução — resolve()

Busca um mock por index e retorna `{ index, matched, scenario }`:

```js
const result = resolve({ url: '/', index: 'email', payload: { email: 'gui@...' } });
// → { index: 'email', matched: true, scenario: 'matched' }
```

### 3. Resolução — resolvePriority()

Verifica múltiplos indexes em ordem de prioridade. Retorna o primeiro com `matched: true`:

```js
const priority = resolvePriority({ url: '/', indexes: errosLoginPriority, payload });
// → { index: 'email_necessarie', matched: true, scenario: 'matched' } ou null
```

### 4. Uso do resultado

A aplicação consome o resultado como quiser:

```js
// Erro ativo → rejeita
if (result?.matched) {
    return Promise.reject(loginResponse(result));
}

// Sucesso → resolve
return new Promise(r => setTimeout(() => r(loginResponse(result)), delay));
```

---

## Separação de Responsabilidades

### Plugin (`mock/`)

| Responsabilidade | O que faz |
|---|---|
| Armazenar mocks | `state.register` (Map de Maps) |
| Validar mocks | `validateMock()` — index, action, condition, operator |
| Buscar mock por index | `resolve()` — O(1) via `Map.get()` |
| Verificar prioridade | `resolvePriority()` — itera indexes, retorna primeiro matched |
| Transport | `buildTransport()` — type, url, delay |

### Aplicação (`data/mock/`, `stores/`)

| Responsabilidade | O que faz |
|---|---|
| Definir quais mocks registrar | `data/mock/index.js` |
| Definir prioridade de erros | `response.js: errosLoginPriority` |
| Definir schemas de resposta | `response.js: loginSchema` |
| Controlar fluxo do controller | `stores/req/auth.js: login()` |
| Togglear mocks pela UI | `BoxTool.vue` → `stateMock()` |

---

## Matches vs Differences

### Matched (condição atendida)

- **Toggle:** `mock.value === true` → mock está ativo
- **Input:** `mock.condition.every(c => payload[c.field] === c.value)` → TODAS as condições atendidas

Exemplo de matched:
```js
// Toggle ativo
resolve({ url: '/', index: 'email_invalid' })
// → { index: 'email_invalid', matched: true, scenario: 'matched' }

// Input com payload bate (condition é array AND)
resolve({ url: '/', index: 'email', payload: { email: 'gui@...' } })
// → { index: 'email', matched: true, scenario: 'matched' }
```

### Difference (condição não atendida)

- **Toggle:** `mock.value === false` → mock está inativo
- **Input:** `mock.condition.every(...)` retorna `false` → pelo menos uma condição não atende

Exemplo de difference:
```js
// Toggle inativo
resolve({ url: '/', index: 'email_invalid' })
// → { index: 'email_invalid', matched: false, scenario: 'difference' }

// Input com payload diferente
resolve({ url: '/', index: 'email', payload: { email: 'outro@...' } })
// → { index: 'email', matched: false, scenario: 'difference' }
```

---

## Transport

Cada URL registrada pode ter um transport configurável:

```js
register({ url: '/', mock: ..., override: [...] }, {
    type: 'http',    // 'http' | 'socket' | 'event'
    url: null,       // URL externa (opcional)
    delay: 1000      // delay em ms (default: 1000)
})
```

O `delay` é usado como timeout no `setTimeout` dos controllers:

```js
const { getTransport } = stateMock();
const transport = getTransport({ url: '/' });
const delay = transport?.delay || 1000;

return new Promise((resolve, reject) => {
    setTimeout(() => {
        // lógica do controller
    }, delay);
});
```

---

## Validação

O `validateMock()` valida cada mock com as seguintes regras:

| Campo | Obrigatório | Validação |
|---|---|---|
| `index` | Sim | String não vazia |
| `action` | Sim | Deve ser `'toggle'` ou `'input'` |
| `group` | Não | Se presente, deve ser string |
| `condition` | Sim (para `input`) | **Array** de objetos, cada um com `field` (string), `operator` (OPERATORS), `value` (qualquer) |
| `scenario` | Não | Se presente, deve ser `'matched'` ou `'difference'` |

Erros de validação são armazenados em `state.errors` e podem ser consultados.

---

## Próximos Documentos

- **`resolve.md`** — Como usar resolve(), resolvePriority(), toggles, inputs e cenários
- **`transport.md`** — Configuração de transport (http, socket, event)
- **`validation.md`** — Regras de validação e tratamento de erros
- **`integration.md`** — Como integrar com Pinia stores e controllers
- **`components.md`** — UI components (BoxTool, ButtonFlutter)
