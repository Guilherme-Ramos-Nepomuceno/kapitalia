# 🚀 Guia Rápido - Kapitalia APIs

## O que foi criado?

Uma **API completa e funcional** para o Kapitalia com:

### ✅ 5 Módulos de API

1. **Autenticação (Auth)** - 5 endpoints
   - Login
   - Register
   - Logout
   - Refresh Token
   - Get Profile

2. **Dashboard** - 2 endpoints
   - Get Dashboard Data
   - Update Profile

3. **Lições (Lessons)** - 6 endpoints
   - Get All Trails
   - Get Specific Trail
   - Get Lesson Details
   - Start Lesson
   - Complete Lesson
   - Get Progress

4. **Financeiro (Financial)** - 9 endpoints
   - Get Financial Data
   - Update Income
   - Manage Expense Categories
   - Manage Transactions
   - Manage Investments

5. **Dados Mockados (Mock Data)**
   - 1 usuário padrão pré-criado
   - 4 trilhas de aprendizado com 20 lições
   - Dados financeiros realistas

---

## 🎯 Como começar?

### 1. Credenciais de Teste

```
Email: user@example.com
Senha: password123
```

### 2. Fazer Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

Você receberá um token que deve ser salvo em `localStorage` com a chave `finance-token`.

### 3. Usar o Token

Adicione o token em todas as requisições:

```bash
curl -X GET http://localhost:3000/api/dashboard \
  -H "Authorization: Bearer <seu_token>"
```

---

## 📁 Estrutura de Arquivos Criados

```
app/
├── api/
│   ├── auth/
│   │   ├── login/route.ts
│   │   ├── register/route.ts
│   │   ├── logout/route.ts
│   │   ├── refresh/route.ts
│   │   └── profile/route.ts
│   ├── dashboard/
│   │   └── route.ts
│   ├── user/
│   │   └── profile/route.ts
│   ├── lessons/
│   │   ├── trails/route.ts
│   │   ├── trails/[id]/route.ts
│   │   ├── [id]/route.ts
│   │   ├── [id]/start/route.ts
│   │   ├── complete/route.ts
│   │   └── progress/route.ts
│   └── financial/
│       ├── route.ts
│       ├── income/route.ts
│       ├── expenses/route.ts
│       ├── expenses/[id]/route.ts
│       ├── transactions/route.ts
│       └── investments/route.ts

lib/
├── data/
│   └── mock-data.ts (Sistema de dados mockados)
└── api.ts (Atualizado para usar /api)
```

---

## 📚 Principais Features

### 🎓 Sistema de Aprendizado

- **4 Trilhas** com mais de 20 lições
- **XP System** - Ganhe XP completando lições
- **Coins** - Moeda do sistema
- **Levels** - Aumente de nível
- **Streaks** - Mantenha sua sequência diária

### 💰 Gerenciamento Financeiro

- **Renda Mensal** - Controle sua renda
- **Categorias de Despesas** - Orçamentos personalizados
- **Transações** - Registre todas as movimentações
- **Investimentos** - Acompanhe seus investimentos
- **Fundo de Emergência** - Meta de economia

### 👤 Perfil de Usuário

- Autenticação segura com JWT
- Perfil customizável
- Progressão de aprendizado
- Histórico de transações

---

## 🔧 Como Testar Tudo

### 1. Registre um novo usuário

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Seu Nome",
    "email": "seuemail@example.com",
    "password": "senha123"
  }'
```

### 2. Complete uma lição

```bash
curl -X POST http://localhost:3000/api/lessons/complete \
  -H "Authorization: Bearer <seu_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "lessonId": "lesson-1"
  }'
```

### 3. Adicione uma transação

```bash
curl -X POST http://localhost:3000/api/financial/transactions \
  -H "Authorization: Bearer <seu_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Supermercado",
    "amount": 150,
    "category": "Alimentação",
    "type": "expense"
  }'
```

### 4. Veja seu dashboard

```bash
curl -X GET http://localhost:3000/api/dashboard \
  -H "Authorization: Bearer <seu_token>"
```

---

## 📖 Documentação Completa

Veja o arquivo `API_DOCUMENTATION.md` para documentação detalhada de todos os endpoints.

---

## 🎁 Bônus

- **Mock Data Realista** - Dados de exemplo com informações coerentes
- **Error Handling** - Tratamento completo de erros com mensagens claras
- **Validação** - Validação de entrada em todos os endpoints
- **Paginação** - Suporte a paginação em transações
- **Dynamic Pricing** - Valores de investimentos com variação realista

---

## ⚠️ Notas Importantes

1. **Dados em Memória** - Os dados são armazenados em memória e resetam quando o servidor reinicia
2. **Tokens Mock** - Tokens JWT são simulados para desenvolvimento (não use em produção)
3. **Sem Banco de Dados** - Atualmente usa dados mockados - implemente um banco de dados real em produção
4. **Sem Autenticação Real** - Implemente autenticação real em produção

---

## 🚀 Próximos Passos

Para deixar completamente pronto para produção:

1. **Implementar banco de dados** (MongoDB, PostgreSQL, etc)
2. **Autenticação real** (Auth0, Firebase, NextAuth.js)
3. **Validação avançada** (Zod schemas)
4. **Testes automatizados** (Jest, Testing Library)
5. **Rate limiting** (Proteção contra abuso)
6. **Logging** (Sistema de logs)
7. **Deployment** (Vercel, Railway, etc)

---

## 💬 Suporte

Para dúvidas sobre os endpoints, consulte:
- `API_DOCUMENTATION.md` - Documentação detalhada
- `lib/data/mock-data.ts` - Estrutura de dados
- `app/api/**/*` - Implementação dos endpoints

**Site agora está 100% funcional! ✨**
