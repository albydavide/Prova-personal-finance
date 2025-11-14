export interface Partner {
  id: number;
  name: string;
  color: string;
}

export interface Income {
  id?: number;
  partner_id: number;
  amount: number;
  date: string;
  description?: string;
}

export interface Expense {
  id?: number;
  partner_id: number;
  amount: number;
  date: string;
  category: string;
  description?: string;
  is_shared: number;
  paid_by: number;
}

export interface Investment {
  id?: number;
  partner_id: number;
  amount: number;
  date: string;
  type: string;
  symbol?: string;
  description?: string;
}

export interface InvestmentAllocation {
  id?: number;
  type: string;
  percentage: number;
  symbol?: string;
  name: string;
  color: string;
}

export interface BalanceData {
  partner1: {
    id: number;
    name: string;
    totalIncome: number;
    totalPersonalExpenses: number;
    totalSharedExpenses: number;
    totalInvestments: number;
    balance: number;
  };
  partner2: {
    id: number;
    name: string;
    totalIncome: number;
    totalPersonalExpenses: number;
    totalSharedExpenses: number;
    totalInvestments: number;
    balance: number;
  };
  sharedBalance: {
    totalSharedExpenses: number;
    partner1Paid: number;
    partner2Paid: number;
    whoOwes: string;
    amount: number;
  };
  couple: {
    totalIncome: number;
    totalExpenses: number;
    totalInvestments: number;
    balance: number;
  };
}

export interface MarketData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}
