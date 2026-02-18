export type FormaPagamento = "PIX" | "Dinheiro" | "Cartão";

export interface Pagamento {
  id?: string | number;
  servicoId: string | number;
  valorPago: number;
  formaPagamento: FormaPagamento;
  data: string; // ISO string
}
