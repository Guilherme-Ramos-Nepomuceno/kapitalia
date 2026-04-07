/**
 * Kapitalia API - Quick Test Suite
 * Copie e cole este código no console do navegador para testar os endpoints
 * 
 * Certifique-se de que o servidor está rodando em http://localhost:3000
 */

// ============================================
// 1. LOGIN - Obter Token
// ============================================

async function testLogin() {
  console.log("📝 Testando Login...");
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "user@example.com",
        password: "password123",
      }),
    });

    const data = await response.json();
    if (response.ok) {
      // Salvar token
      localStorage.setItem("finance-token", data.token);
      console.log("✅ Login bem-sucedido!");
      console.log("Token salvo:", data.token.substring(0, 20) + "...");
      console.log("Usuário:", data.user);
      return data.token;
    } else {
      console.error("❌ Erro no login:", data.error);
    }
  } catch (error) {
    console.error("❌ Erro na requisição:", error);
  }
}

// ============================================
// 2. DASHBOARD - Obter Data do Dashboard
// ============================================

async function testGetDashboard() {
  console.log("📊 Buscando Dashboard...");
  try {
    const token = localStorage.getItem("finance-token");
    if (!token) {
      console.error("❌ Token não encontrado. Execute testLogin() primeiro!");
      return;
    }

    const response = await fetch("/api/dashboard", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    if (response.ok) {
      console.log("✅ Dashboard recuperado!");
      console.log("Usuário:", data.user);
      console.log("Stats:", data.stats);
      console.log("Resumo Financeiro:", data.financialSummary);
    } else {
      console.error("❌ Erro:", data.error);
    }
  } catch (error) {
    console.error("❌ Erro na requisição:", error);
  }
}

// ============================================
// 3. LIÇÕES - Obter Trilhas
// ============================================

async function testGetTrails() {
  console.log("🎓 Buscando Trilhas de Aprendizado...");
  try {
    const token = localStorage.getItem("finance-token");
    if (!token) {
      console.error("❌ Token não encontrado. Execute testLogin() primeiro!");
      return;
    }

    const response = await fetch("/api/lessons/trails", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const trails = await response.json();
    if (response.ok) {
      console.log("✅ Trilhas recuperadas!");
      trails.forEach((trail) => {
        console.log(
          `📚 ${trail.title} - ${trail.completedLessons}/${trail.totalLessons} lições`
        );
        trail.lessons.forEach((lesson) => {
          console.log(
            `  └─ ${lesson.title} (${lesson.duration}) - ${
              lesson.isCompleted ? "✅ Completa" : "⏳ Pendente"
            }`
          );
        });
      });
    } else {
      console.error("❌ Erro:", trails.error);
    }
  } catch (error) {
    console.error("❌ Erro na requisição:", error);
  }
}

// ============================================
// 4. LIÇÕES - Completar Lição
// ============================================

async function testCompleteLesson(lessonId = "lesson-4") {
  console.log(`✏️ Completando lição ${lessonId}...`);
  try {
    const token = localStorage.getItem("finance-token");
    if (!token) {
      console.error("❌ Token não encontrado. Execute testLogin() primeiro!");
      return;
    }

    const response = await fetch("/api/lessons/complete", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lessonId }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log("✅ Lição completada!");
      console.log(`🎁 Recompensas:`);
      console.log(`  • XP Ganho: +${data.xpGained}`);
      console.log(`  • Moedas: +${data.coinsGained}`);
      if (data.newLevel) {
        console.log(`  • 🎉 NOVA LEVEL: ${data.newLevel}!`);
      }
    } else {
      console.error("❌ Erro:", data.error);
    }
  } catch (error) {
    console.error("❌ Erro na requisição:", error);
  }
}

// ============================================
// 5. LIÇÕES - Obter Progresso
// ============================================

async function testGetProgress() {
  console.log("📈 Buscando Progresso...");
  try {
    const token = localStorage.getItem("finance-token");
    if (!token) {
      console.error("❌ Token não encontrado. Execute testLogin() primeiro!");
      return;
    }

    const response = await fetch("/api/lessons/progress", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    if (response.ok) {
      console.log("✅ Progresso obtido!");
      console.log(`📚 Lições Completadas: ${data.completedLessons.length}`);
      console.log(`🔥 Streak Atual: ${data.currentStreak} dias`);
      console.log(`⭐ XP Total: ${data.totalXp}`);
    } else {
      console.error("❌ Erro:", data.error);
    }
  } catch (error) {
    console.error("❌ Erro na requisição:", error);
  }
}

// ============================================
// 6. FINANCEIRO - Obter Dados Financeiros
// ============================================

async function testGetFinancial() {
  console.log("💰 Buscando Dados Financeiros...");
  try {
    const token = localStorage.getItem("finance-token");
    if (!token) {
      console.error("❌ Token não encontrado. Execute testLogin() primeiro!");
      return;
    }

    const response = await fetch("/api/financial", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    if (response.ok) {
      console.log("✅ Dados financeiros obtidos!");
      console.log(`💵 Renda Mensal: R$ ${data.monthlyIncome}`);
      console.log("📊 Categorias de Despesa:");
      data.expenses.forEach((exp) => {
        const percentage = ((exp.spent / exp.budgeted) * 100).toFixed(1);
        console.log(
          `  • ${exp.name}: R$ ${exp.spent} / R$ ${exp.budgeted} (${percentage}%)`
        );
      });
      console.log(`🏦 Fundo de Emergência: R$ ${data.emergencyFundCurrent} / R$ ${data.emergencyFundGoal}`);
    } else {
      console.error("❌ Erro:", data.error);
    }
  } catch (error) {
    console.error("❌ Erro na requisição:", error);
  }
}

// ============================================
// 7. FINANCEIRO - Adicionar Transação
// ============================================

async function testAddTransaction() {
  console.log("➕ Adicionando Transação...");
  try {
    const token = localStorage.getItem("finance-token");
    if (!token) {
      console.error("❌ Token não encontrado. Execute testLogin() primeiro!");
      return;
    }

    const response = await fetch("/api/financial/transactions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: "Almoço no restaurante",
        amount: 45.5,
        category: "Alimentação",
        type: "expense",
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log("✅ Transação adicionada!");
      console.log(`📝 ${data.description}`);
      console.log(`💸 R$ ${data.amount}`);
      console.log(`📅 Data: ${data.date}`);
    } else {
      console.error("❌ Erro:", data.error);
    }
  } catch (error) {
    console.error("❌ Erro na requisição:", error);
  }
}

// ============================================
// 8. FINANCEIRO - Listar Transações
// ============================================

async function testGetTransactions() {
  console.log("📋 Listando Transações...");
  try {
    const token = localStorage.getItem("finance-token");
    if (!token) {
      console.error("❌ Token não encontrado. Execute testLogin() primeiro!");
      return;
    }

    const response = await fetch("/api/financial/transactions?page=1&limit=10", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    if (response.ok) {
      console.log("✅ Transações obtidas!");
      console.log(`Total: ${data.total} transações`);
      data.transactions.forEach((trans) => {
        const symbol = trans.type === "income" ? "➕" : "➖";
        console.log(
          `${symbol} ${trans.description} (${trans.category}) - R$ ${trans.amount} - ${trans.date}`
        );
      });
    } else {
      console.error("❌ Erro:", data.error);
    }
  } catch (error) {
    console.error("❌ Erro na requisição:", error);
  }
}

// ============================================
// 9. FINANCEIRO - Adicionar Investimento
// ============================================

async function testAddInvestment() {
  console.log("💎 Adicionando Investimento...");
  try {
    const token = localStorage.getItem("finance-token");
    if (!token) {
      console.error("❌ Token não encontrado. Execute testLogin() primeiro!");
      return;
    }

    const response = await fetch("/api/financial/investments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Tesouro Selic 2025",
        type: "tesouro",
        invested: 1000,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log("✅ Investimento adicionado!");
      console.log(`📊 ${data.name}`);
      console.log(`💰 Investido: R$ ${data.invested}`);
      console.log(`📈 Valorização: R$ ${data.currentValue}`);
    } else {
      console.error("❌ Erro:", data.error);
    }
  } catch (error) {
    console.error("❌ Erro na requisição:", error);
  }
}

// ============================================
// 10. REGISTRAR NOVO USUÁRIO
// ============================================

async function testRegister(email, name, password) {
  console.log(`👤 Registrando novo usuário: ${email}...`);
  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name,
        password,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      console.log("✅ Usuário registrado com sucesso!");
      console.log("Token:", data.token.substring(0, 20) + "...");
      return data.token;
    } else {
      console.error("❌ Erro:", data.error);
    }
  } catch (error) {
    console.error("❌ Erro na requisição:", error);
  }
}

// ============================================
// SUITE DE TESTES COMPLETA
// ============================================

async function runFullTestSuite() {
  console.clear();
  console.log("🚀 INICIANDO SUITE DE TESTES KAPITALIA API\n");

  // 1. Login
  console.log("=".repeat(50));
  await testLogin();

  // 2. Dashboard
  console.log("\n" + "=".repeat(50));
  await testGetDashboard();

  // 3. Trilhas
  console.log("\n" + "=".repeat(50));
  await testGetTrails();

  // 4. Progresso
  console.log("\n" + "=".repeat(50));
  await testGetProgress();

  // 5. Dados Financeiros
  console.log("\n" + "=".repeat(50));
  await testGetFinancial();

  // 6. Transações
  console.log("\n" + "=".repeat(50));
  await testGetTransactions();

  console.log("\n" + "=".repeat(50));
  console.log("✅ SUITE DE TESTES CONCLUÍDA!\n");
  console.log("Próximos testes que você pode fazer:");
  console.log("  • testCompleteLesson('lesson-4')");
  console.log("  • testAddTransaction()");
  console.log("  • testAddInvestment()");
  console.log("  • testRegister('novo@email.com', 'Novo Usuário', 'senha')");
}

console.log("✅ Funções de teste carregadas!");
console.log("\n📚 Funções disponíveis:");
console.log("  • testLogin()");
console.log("  • testGetDashboard()");
console.log("  • testGetTrails()");
console.log("  • testGetProgress()");
console.log("  • testGetFinancial()");
console.log("  • testGetTransactions()");
console.log("  • testCompleteLesson(lessonId)");
console.log("  • testAddTransaction()");
console.log("  • testAddInvestment()");
console.log("  • testRegister(email, name, password)");
console.log("  • runFullTestSuite() - Executa todos os testes\n");
