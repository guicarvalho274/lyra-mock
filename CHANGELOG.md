# Changelog

## 0.0.1

### Added
- `stateMock()` — factory principal com singleton
- `register()` — registro de mocks por URL com transport
- `registerService()` — registro de mocks por service
- `resolve()` — resolução por index com O(1) via Map
- `resolvePriority()` — resolução por prioridade (array de indexes)
- `getTransport()` — acesso ao transport de uma URL
- Validação completa (index, action, condition, group, scenario)
- Suporte ESM e CommonJS
- Tipos TypeScript (.d.ts) via JSDoc

### Ecosystem
- `@lyra-mock-api/core` — ✅ Estável
- `@lyra-mock/core` (Vue Plugin) — 🧪 Em teste
