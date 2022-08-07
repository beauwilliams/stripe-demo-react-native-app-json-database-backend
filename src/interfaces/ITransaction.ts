interface Transaction {
  id: number;
  transaction_id: string;
  created_at: number;
  paid_to: string;
  amount: number;
  currency: string
  payment_method: string
}

export { Transaction };
