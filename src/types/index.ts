export type Transaction = {
  id: string;
  sender: 'Meruputhiga' | 'Pikachu';
  amount: number;
  description: string;
  timestamp: string; // Use ISO string for localStorage compatibility
};
