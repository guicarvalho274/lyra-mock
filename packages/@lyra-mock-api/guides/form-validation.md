# Guide: Validação de Formulário

## Objetivo

Validar campos de formulário individualmente usando `action: 'input'` com conditions.

## 1. Registrar mocks

```js
const { register, resolve } = stateMock();

register({
    url: '/api/signup',
    mock: {},
    override: [
        {
            index: 'email_required',
            action: 'input',
            condition: [{ field: 'email', operator: 'equals', value: '' }]
        },
        {
            index: 'email_invalid',
            action: 'input',
            condition: [{ field: 'email', operator: 'equals', value: 'invalido' }]
        },
        {
            index: 'password_short',
            action: 'input',
            condition: [{ field: 'password', operator: 'equals', value: '123' }]
        }
    ]
});
```

## 2. Validar campo email

```js
function validateEmail(email) {
    const result = resolve({
        url: '/api/signup',
        index: 'email_required',
        payload: { email }
    });

    if (result?.matched) {
        return { error: 'email é obrigatório' };
    }

    const resultInvalid = resolve({
        url: '/api/signup',
        index: 'email_invalid',
        payload: { email }
    });

    if (resultInvalid?.matched) {
        return { error: 'email inválido' };
    }

    return null;
}
```

## 3. Validar campo password

```js
function validatePassword(password) {
    const result = resolve({
        url: '/api/signup',
        index: 'password_short',
        payload: { password }
    });

    if (result?.matched) {
        return { error: 'senha muito curta' };
    }

    return null;
}
```

## 4. Uso

```js
const emailError = validateEmail('');
if (emailError) console.log(emailError.error);  // "email é obrigatório"

const passwordError = validatePassword('123');
if (passwordError) console.log(passwordError.error);  // "senha muito curta"
```

## Vantagens

- Cada regra é um mock independente
- Fácil de ativar/desativar pela UI
- Mesma lógica funciona para testes automatizados
