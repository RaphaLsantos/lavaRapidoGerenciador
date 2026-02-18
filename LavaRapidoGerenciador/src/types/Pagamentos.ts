export interface Pagamento {
  id?: number;
  servicoId: number;
  valorPago: number;
  forma: "PIX" | "Dinheiro" | "Cartão";
  data: string;
}
