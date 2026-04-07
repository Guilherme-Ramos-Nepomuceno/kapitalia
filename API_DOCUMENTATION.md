# Kapitalia - API Documentation

## Overview

This document describes all available API endpoints for the Kapitalia financial education platform. All endpoints are protected with JWT authentication (except for login and register).

## Base URL

```
/api
```

## Authentication

All endpoints except `/auth/login` and `/auth/register` require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

Tokens are stored in `localStorage` with the key `finance-token` and are automatically included in all API requests.

---

## Auth Endpoints

### 1. Login
**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user-1",
    "name": "João Silva",
    "email": "user@example.com",
    "level": 5,
    "xp": 2450,
    "xpToNextLevel": 3000,
    "streak": 12,
    "isPro": false,
    "totalCoins": 450
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Test Credentials:**
- Email: `user@example.com`
- Password: `password123`

---

### 2. Register
**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "name": "Nova Pessoa",
  "email": "newuser@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "user-1712516400000",
    "name": "Nova Pessoa",
    "email": "newuser@example.com",
    "level": 1,
    "xp": 0,
    "xpToNextLevel": 1000,
    "streak": 0,
    "isPro": false,
    "totalCoins": 0
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 3. Logout
**Endpoint:** `POST /api/auth/logout`

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 4. Refresh Token
**Endpoint:** `POST /api/auth/refresh`

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 5. Get Profile
**Endpoint:** `GET /api/auth/profile`

**Response:**
```json
{
  "id": "user-1",
  "name": "João Silva",
  "email": "user@example.com",
  "level": 5,
  "xp": 2450,
  "xpToNextLevel": 3000,
  "streak": 12,
  "isPro": false,
  "totalCoins": 450
}
```

---

## Dashboard Endpoints

### 1. Get Dashboard Data
**Endpoint:** `GET /api/dashboard`

**Response:**
```json
{
  "user": {
    "id": "user-1",
    "name": "João Silva",
    "email": "user@example.com",
    "level": 5,
    "xp": 2450,
    "xpToNextLevel": 3000,
    "streak": 12,
    "isPro": false,
    "totalCoins": 450,
    "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=user1",
    "joinedAt": "2024-01-15"
  },
  "stats": {
    "totalLessonsCompleted": 4,
    "currentLevel": 5,
    "totalXp": 2450,
    "streakDays": 12
  },
  "recentTransactions": [...],
  "trails": [...],
  "financialSummary": {
    "monthlyIncome": 3500,
    "monthlyExpenses": 2280,
    "emergencyFundGoal": 10000,
    "emergencyFundCurrent": 4200,
    "emergencyFundPercentage": "42.0"
  }
}
```

---

### 2. Submit Onboarding
**Endpoint:** `POST /api/dashboard` (with onboarding data)

**Request:**
```json
{
  "name": "João Silva",
  "age": "25+",
  "goal": "investir",
  "experience": "basica"
}
```

**Response:**
```json
{
  "success": true
}
```

---

### 3. Update Profile
**Endpoint:** `PATCH /api/user/profile`

**Request:**
```json
{
  "name": "João Silva Atualizado",
  "avatar": "https://..."
}
```

**Response:**
```json
{
  "id": "user-1",
  "name": "João Silva Atualizado",
  "email": "user@example.com",
  "avatar": "https://...",
  "level": 5,
  "xp": 2450,
  "xpToNextLevel": 3000,
  "streak": 12,
  "isPro": false,
  "totalCoins": 450
}
```

---

## Lessons Endpoints

### 1. Get All Trails
**Endpoint:** `GET /api/lessons/trails`

**Response:**
```json
[
  {
    "id": "trail-1",
    "title": "Fundamentos Financeiros",
    "description": "Aprenda os conceitos básicos de finanças pessoais",
    "icon": "PiggyBank",
    "color": "#FF6B6B",
    "isPro": false,
    "totalLessons": 5,
    "completedLessons": 4,
    "lessons": [...]
  },
  ...
]
```

---

### 2. Get Specific Trail
**Endpoint:** `GET /api/lessons/trails/{trailId}`

**Response:**
```json
{
  "id": "trail-1",
  "title": "Fundamentos Financeiros",
  "description": "Aprenda os conceitos básicos de finanças pessoais",
  "icon": "PiggyBank",
  "color": "#FF6B6B",
  "isPro": false,
  "totalLessons": 5,
  "completedLessons": 4,
  "lessons": [
    {
      "id": "lesson-1",
      "title": "O que é Educação Financeira",
      "description": "Entenda a importância de gerenciar suas finanças",
      "duration": "8 min",
      "xpReward": 100,
      "isCompleted": true,
      "isLocked": false,
      "isPro": false,
      "icon": "BookOpen",
      "category": "Basics"
    },
    ...
  ]
}
```

---

### 3. Get Lesson Details
**Endpoint:** `GET /api/lessons/{lessonId}`

**Response:**
```json
{
  "id": "lesson-1",
  "title": "O que é Educação Financeira",
  "description": "Entenda a importância de gerenciar suas finanças",
  "duration": "8 min",
  "xpReward": 100,
  "isCompleted": true,
  "isLocked": false,
  "isPro": false,
  "icon": "BookOpen",
  "category": "Basics"
}
```

---

### 4. Start Lesson
**Endpoint:** `POST /api/lessons/{lessonId}/start`

**Response:**
```json
{
  "success": true
}
```

---

### 5. Complete Lesson
**Endpoint:** `POST /api/lessons/complete`

**Request:**
```json
{
  "lessonId": "lesson-1",
  "answers": {} // Optional: Quiz answers if applicable
}
```

**Response:**
```json
{
  "success": true,
  "xpGained": 100,
  "coinsGained": 10,
  "newLevel": null
}
```

---

### 6. Get User Progress
**Endpoint:** `GET /api/lessons/progress`

**Response:**
```json
{
  "completedLessons": ["lesson-1", "lesson-2", "lesson-3"],
  "currentStreak": 12,
  "totalXp": 2450
}
```

---

## Financial Endpoints

### 1. Get Financial Data
**Endpoint:** `GET /api/financial`

**Response:**
```json
{
  "monthlyIncome": 3500,
  "expenses": [
    {
      "id": "exp-1",
      "name": "Alimentação",
      "budgeted": 800,
      "spent": 650,
      "color": "#FF6B6B"
    },
    ...
  ],
  "transactions": [...],
  "investments": [...],
  "emergencyFundGoal": 10000,
  "emergencyFundCurrent": 4200
}
```

---

### 2. Update Monthly Income
**Endpoint:** `PATCH /api/financial/income`

**Request:**
```json
{
  "monthlyIncome": 4500
}
```

**Response:**
```json
{
  "success": true
}
```

---

### 3. Add Expense Category
**Endpoint:** `POST /api/financial/expenses`

**Request:**
```json
{
  "name": "Alimentação",
  "budgeted": 800,
  "color": "#FF6B6B"
}
```

**Response:**
```json
{
  "id": "exp-1",
  "name": "Alimentação",
  "budgeted": 800,
  "spent": 0,
  "color": "#FF6B6B"
}
```

---

### 4. Update Expense Category
**Endpoint:** `PATCH /api/financial/expenses/{categoryId}`

**Request:**
```json
{
  "budgeted": 900,
  "spent": 650
}
```

**Response:**
```json
{
  "id": "exp-1",
  "name": "Alimentação",
  "budgeted": 900,
  "spent": 650,
  "color": "#FF6B6B"
}
```

---

### 5. Delete Expense Category
**Endpoint:** `DELETE /api/financial/expenses/{categoryId}`

**Response:**
```json
{
  "success": true
}
```

---

### 6. Add Transaction
**Endpoint:** `POST /api/financial/transactions`

**Request:**
```json
{
  "description": "Supermercado",
  "amount": 250,
  "category": "Alimentação",
  "type": "expense"
}
```

**Response:**
```json
{
  "id": "trans-1",
  "description": "Supermercado",
  "amount": 250,
  "category": "Alimentação",
  "date": "2024-04-07",
  "type": "expense"
}
```

---

### 7. Get Transactions
**Endpoint:** `GET /api/financial/transactions?page=1&limit=50`

**Response:**
```json
{
  "transactions": [...],
  "total": 150,
  "page": 1,
  "limit": 50
}
```

---

### 8. Add Investment
**Endpoint:** `POST /api/financial/investments`

**Request:**
```json
{
  "name": "Tesouro IPCA+ 2045",
  "type": "tesouro",
  "invested": 2000
}
```

**Response:**
```json
{
  "id": "inv-1",
  "name": "Tesouro IPCA+ 2045",
  "type": "tesouro",
  "invested": 2000,
  "currentValue": 2150,
  "lastUpdate": "2024-04-07"
}
```

---

### 9. Get Investments
**Endpoint:** `GET /api/financial/investments`

**Response:**
```json
[
  {
    "id": "inv-1",
    "name": "Tesouro IPCA+ 2045",
    "type": "tesouro",
    "invested": 2000,
    "currentValue": 2150,
    "lastUpdate": "2024-04-07"
  },
  ...
]
```

---

## Error Handling

All endpoints return appropriate HTTP status codes:

- **200** - OK
- **201** - Created
- **400** - Bad Request (validation error)
- **401** - Unauthorized (missing or invalid token)
- **404** - Not Found
- **409** - Conflict (e.g., user already exists)
- **500** - Internal Server Error

Error responses have the format:
```json
{
  "error": "Error message describing what went wrong"
}
```

---

## Testing

### Example cURL Requests

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Get Dashboard (with token):**
```bash
curl -X GET http://localhost:3000/api/dashboard \
  -H "Authorization: Bearer <token>"
```

**Complete Lesson:**
```bash
curl -X POST http://localhost:3000/api/lessons/complete \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "lessonId": "lesson-1"
  }'
```

---

## Key Features

✅ **Complete Authentication System** - Login, Register, Token Management  
✅ **Learning Trails** - 4 learning paths with 20+ lessons  
✅ **Progress Tracking** - XP, coins, levels, and streaks  
✅ **Financial Management** - Income, expenses, transactions, investments  
✅ **User Dashboard** - Comprehensive overview of progress and finances  
✅ **Mock Data** - Pre-populated with realistic financial education content  

---

## Notes

- All timestamps are in ISO 8601 format (YYYY-MM-DD)
- Tokens are valid for 24 hours
- Mock data is stored in memory (resets on server restart)
- Investment values are dynamically calculated with ±5% variation
- XP progression requires 1.2x multiplier for each level
