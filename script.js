// Data structure
let data = {
    partner1: {
        salaries: [],
        expenses: []
    },
    partner2: {
        salaries: [],
        expenses: []
    },
    shared: [],
    investments: []
};

// Load data from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
    loadData();
    updateAllDisplays();
    fetchMarketData();
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(input => {
        input.value = today;
    });
    
    // Set current month as default
    const currentMonth = new Date().toISOString().slice(0, 7);
    document.querySelectorAll('input[type="month"]').forEach(input => {
        input.value = currentMonth;
    });
});

// Tab navigation
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Update displays when switching tabs
    updateAllDisplays();
}

// Add salary
function addSalary(partner) {
    const monthInput = document.getElementById(`${partner === 'partner1' ? 'p1' : 'p2'}-salary-month`);
    const amountInput = document.getElementById(`${partner === 'partner1' ? 'p1' : 'p2'}-salary-amount`);
    
    const month = monthInput.value;
    const amount = parseFloat(amountInput.value);
    
    if (!month || !amount || amount <= 0) {
        alert('Per favore compila tutti i campi con valori validi');
        return;
    }
    
    data[partner].salaries.push({
        month: month,
        amount: amount,
        date: new Date().toISOString()
    });
    
    saveData();
    updateAllDisplays();
    
    // Clear inputs
    amountInput.value = '';
}

// Add expense
function addExpense(partner) {
    const prefix = partner === 'partner1' ? 'p1' : 'p2';
    const descInput = document.getElementById(`${prefix}-expense-desc`);
    const amountInput = document.getElementById(`${prefix}-expense-amount`);
    const dateInput = document.getElementById(`${prefix}-expense-date`);
    
    const description = descInput.value;
    const amount = parseFloat(amountInput.value);
    const date = dateInput.value;
    
    if (!description || !amount || amount <= 0 || !date) {
        alert('Per favore compila tutti i campi con valori validi');
        return;
    }
    
    data[partner].expenses.push({
        description: description,
        amount: amount,
        date: date
    });
    
    saveData();
    updateAllDisplays();
    
    // Clear inputs
    descInput.value = '';
    amountInput.value = '';
}

// Add shared expense
function addSharedExpense() {
    const descInput = document.getElementById('shared-expense-desc');
    const amountInput = document.getElementById('shared-expense-amount');
    const payerInput = document.getElementById('shared-expense-payer');
    const dateInput = document.getElementById('shared-expense-date');
    
    const description = descInput.value;
    const amount = parseFloat(amountInput.value);
    const payer = payerInput.value;
    const date = dateInput.value;
    
    if (!description || !amount || amount <= 0 || !date) {
        alert('Per favore compila tutti i campi con valori validi');
        return;
    }
    
    data.shared.push({
        description: description,
        amount: amount,
        payer: payer,
        date: date
    });
    
    saveData();
    updateAllDisplays();
    
    // Clear inputs
    descInput.value = '';
    amountInput.value = '';
}

// Add investment
function addInvestment() {
    const monthInput = document.getElementById('invest-month');
    const categoryInput = document.getElementById('invest-category');
    const amountInput = document.getElementById('invest-amount');
    const descInput = document.getElementById('invest-desc');
    
    const month = monthInput.value;
    const category = categoryInput.value;
    const amount = parseFloat(amountInput.value);
    const description = descInput.value;
    
    if (!month || !category || !amount || amount <= 0 || !description) {
        alert('Per favore compila tutti i campi con valori validi');
        return;
    }
    
    data.investments.push({
        month: month,
        category: category,
        amount: amount,
        description: description,
        date: new Date().toISOString()
    });
    
    saveData();
    updateAllDisplays();
    
    // Clear inputs
    amountInput.value = '';
    descInput.value = '';
}

// Calculate totals
function calculateTotals(partner) {
    const salaryTotal = data[partner].salaries.reduce((sum, item) => sum + item.amount, 0);
    const expenseTotal = data[partner].expenses.reduce((sum, item) => sum + item.amount, 0);
    const balance = salaryTotal - expenseTotal;
    
    return { salaryTotal, expenseTotal, balance };
}

// Update displays
function updateAllDisplays() {
    updatePartnerDisplay('partner1', 'p1');
    updatePartnerDisplay('partner2', 'p2');
    updateSharedDisplay();
    updateInvestmentDisplay();
}

function updatePartnerDisplay(partner, prefix) {
    const { salaryTotal, expenseTotal, balance } = calculateTotals(partner);
    
    document.getElementById(`${prefix}-total-salary`).textContent = `€${salaryTotal.toFixed(2)}`;
    document.getElementById(`${prefix}-total-expenses`).textContent = `€${expenseTotal.toFixed(2)}`;
    document.getElementById(`${prefix}-balance`).textContent = `€${balance.toFixed(2)}`;
    
    // Update history
    const historyDiv = document.getElementById(`${prefix}-history`);
    historyDiv.innerHTML = '';
    
    // Combine salaries and expenses for history
    const allItems = [
        ...data[partner].salaries.map(item => ({ ...item, type: 'salary' })),
        ...data[partner].expenses.map(item => ({ ...item, type: 'expense' }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    allItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'history-item';
        
        if (item.type === 'salary') {
            itemDiv.innerHTML = `
                <p class="description">💰 Stipendio</p>
                <p class="amount">+€${item.amount.toFixed(2)}</p>
                <p class="date">Mese: ${item.month}</p>
            `;
        } else {
            itemDiv.innerHTML = `
                <p class="description">${item.description}</p>
                <p class="amount">-€${item.amount.toFixed(2)}</p>
                <p class="date">${new Date(item.date).toLocaleDateString('it-IT')}</p>
            `;
        }
        
        historyDiv.appendChild(itemDiv);
    });
    
    if (allItems.length === 0) {
        historyDiv.innerHTML = '<p style="color: #6c757d; text-align: center;">Nessun movimento registrato</p>';
    }
}

function updateSharedDisplay() {
    const totalShared = data.shared.reduce((sum, item) => sum + item.amount, 0);
    const p1Paid = data.shared.filter(item => item.payer === 'partner1').reduce((sum, item) => sum + item.amount, 0);
    const p2Paid = data.shared.filter(item => item.payer === 'partner2').reduce((sum, item) => sum + item.amount, 0);
    
    document.getElementById('shared-total').textContent = `€${totalShared.toFixed(2)}`;
    document.getElementById('p1-paid').textContent = `€${p1Paid.toFixed(2)}`;
    document.getElementById('p2-paid').textContent = `€${p2Paid.toFixed(2)}`;
    
    // Calculate who owes whom
    const halfTotal = totalShared / 2;
    const p1Balance = p1Paid - halfTotal;
    const p2Balance = p2Paid - halfTotal;
    
    const balanceInfoDiv = document.getElementById('balance-info');
    
    if (Math.abs(p1Balance) < 0.01) {
        balanceInfoDiv.textContent = '✅ I conti sono in pari!';
        balanceInfoDiv.className = 'balance-info';
    } else if (p1Balance > 0) {
        balanceInfoDiv.textContent = `Partner 2 deve dare €${Math.abs(p2Balance).toFixed(2)} a Partner 1`;
        balanceInfoDiv.className = 'balance-info';
    } else {
        balanceInfoDiv.textContent = `Partner 1 deve dare €${Math.abs(p1Balance).toFixed(2)} a Partner 2`;
        balanceInfoDiv.className = 'balance-info';
    }
    
    // Update history
    const historyDiv = document.getElementById('shared-history');
    historyDiv.innerHTML = '';
    
    const sortedItems = [...data.shared].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'history-item';
        itemDiv.innerHTML = `
            <p class="description">${item.description}</p>
            <p class="amount">€${item.amount.toFixed(2)}</p>
            <p class="date">${new Date(item.date).toLocaleDateString('it-IT')} - Pagato da ${item.payer === 'partner1' ? 'Partner 1' : 'Partner 2'}</p>
        `;
        historyDiv.appendChild(itemDiv);
    });
    
    if (sortedItems.length === 0) {
        historyDiv.innerHTML = '<p style="color: #6c757d; text-align: center;">Nessuna spesa condivisa registrata</p>';
    }
}

function updateInvestmentDisplay() {
    const totalInvested = data.investments.reduce((sum, item) => sum + item.amount, 0);
    
    document.getElementById('invest-total').textContent = `€${totalInvested.toFixed(2)}`;
    
    // Calculate by category
    const byCategory = {};
    data.investments.forEach(item => {
        if (!byCategory[item.category]) {
            byCategory[item.category] = 0;
        }
        byCategory[item.category] += item.amount;
    });
    
    const categoryDiv = document.getElementById('invest-by-category');
    categoryDiv.innerHTML = '<h4 style="margin-bottom: 10px; color: #495057;">Diversificazione per Categoria:</h4>';
    
    Object.keys(byCategory).forEach(category => {
        const percentage = ((byCategory[category] / totalInvested) * 100).toFixed(1);
        const categoryItem = document.createElement('div');
        categoryItem.className = 'category-item';
        categoryItem.innerHTML = `
            <span class="category-name">${category} (${percentage}%)</span>
            <span class="category-amount">€${byCategory[category].toFixed(2)}</span>
        `;
        categoryDiv.appendChild(categoryItem);
    });
    
    if (Object.keys(byCategory).length === 0) {
        categoryDiv.innerHTML += '<p style="color: #6c757d; text-align: center; margin-top: 10px;">Nessuna categoria disponibile</p>';
    }
    
    // Update history
    const historyDiv = document.getElementById('invest-history');
    historyDiv.innerHTML = '';
    
    const sortedItems = [...data.investments].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    sortedItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'history-item';
        itemDiv.innerHTML = `
            <p class="description">${item.description} (${item.category})</p>
            <p class="amount">€${item.amount.toFixed(2)}</p>
            <p class="date">Mese: ${item.month}</p>
        `;
        historyDiv.appendChild(itemDiv);
    });
    
    if (sortedItems.length === 0) {
        historyDiv.innerHTML = '<p style="color: #6c757d; text-align: center;">Nessun investimento registrato</p>';
    }
}

// Fetch market data (using a free API)
async function fetchMarketData() {
    const marketDataDiv = document.getElementById('market-data');
    
    try {
        // Using free API for gold and ETF data
        // Note: This is a demo implementation. For production, you'd need proper API keys
        
        marketDataDiv.innerHTML = `
            <h4 style="margin-bottom: 15px; color: #495057;">Dati di Mercato</h4>
            <div class="market-item">
                <span class="market-name">🏆 Oro (USD/oz)</span>
                <span class="market-value">$2,035.50</span>
                <span class="market-change positive">+1.2%</span>
            </div>
            <div class="market-item">
                <span class="market-name">📈 S&P 500 ETF (SPY)</span>
                <span class="market-value">$445.20</span>
                <span class="market-change positive">+0.8%</span>
            </div>
            <div class="market-item">
                <span class="market-name">🌍 MSCI World ETF</span>
                <span class="market-value">$285.40</span>
                <span class="market-change positive">+0.5%</span>
            </div>
            <div class="market-item">
                <span class="market-name">🇪🇺 Euro Stoxx 50</span>
                <span class="market-value">$42.15</span>
                <span class="market-change negative">-0.3%</span>
            </div>
            <div class="market-item">
                <span class="market-name">💎 Vanguard Total World Stock (VT)</span>
                <span class="market-value">$98.75</span>
                <span class="market-change positive">+0.6%</span>
            </div>
            <p style="margin-top: 15px; color: #6c757d; font-size: 12px; text-align: center;">
                <em>Nota: Dati dimostrativi. Per dati reali in tempo reale, è necessario integrare API specifiche (es: Alpha Vantage, Yahoo Finance, o Metals API)</em>
            </p>
        `;
        
        // For a real implementation, you would fetch from actual APIs:
        /*
        // Example with Alpha Vantage (requires API key)
        const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=GLD&apikey=YOUR_API_KEY`);
        const goldData = await response.json();
        
        // Example with Metals API for gold (requires API key)
        const goldResponse = await fetch(`https://metals-api.com/api/latest?access_key=YOUR_API_KEY&base=USD&symbols=XAU`);
        const goldPriceData = await goldResponse.json();
        */
        
    } catch (error) {
        console.error('Errore nel recupero dei dati di mercato:', error);
        marketDataDiv.innerHTML = `
            <p style="color: #dc3545;">
                ❌ Impossibile recuperare i dati di mercato. 
                Per integrare dati reali, è necessario configurare API keys per servizi come:
            </p>
            <ul style="margin-top: 10px; margin-left: 20px; color: #6c757d;">
                <li>Alpha Vantage (per ETF e azioni)</li>
                <li>Metals API (per oro e metalli preziosi)</li>
                <li>Yahoo Finance API</li>
            </ul>
        `;
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('financeData', JSON.stringify(data));
}

// Load data from localStorage
function loadData() {
    const savedData = localStorage.getItem('financeData');
    if (savedData) {
        data = JSON.parse(savedData);
    }
}
