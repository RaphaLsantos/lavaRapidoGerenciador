// Serviço de localStorage para persistência de dados no frontend

interface StorageData {
  clientes: any[];
  veiculos: any[];
  servicos: any[];
  pagamentos: any[];
  agendamentos: any[];
  despesas: any[];
  precosServicos: any[];
}

const STORAGE_KEY = 'lava-rapido-data';

// Dados iniciais padrão
const initialData: StorageData = {
  clientes: [],
  veiculos: [],
  servicos: [],
  pagamentos: [],
  agendamentos: [],
  despesas: [],
  precosServicos: [
    { id: 1, nome: 'Lavagem Simples', preco: 50 },
    { id: 2, nome: 'Lavagem Completa', preco: 100 },
    { id: 3, nome: 'Polimento', preco: 150 },
    { id: 4, nome: 'Enceramento', preco: 200 },
  ]
};

// Obter dados do localStorage
export function getStorageData(): StorageData {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { ...initialData };
  } catch (error) {
    console.error('Erro ao ler localStorage:', error);
    return { ...initialData };
  }
}

// Salvar dados no localStorage
export function saveStorageData(data: StorageData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Erro ao salvar localStorage:', error);
  }
}

// Gerar ID único
export function generateId(): number {
  return Date.now();
}

// Obter próximo ID para uma coleção
export function getNextId(collection: any[]): number {
  if (collection.length === 0) return 1;
  const maxId = Math.max(...collection.map(item => Number(item.id) || 0));
  return maxId + 1;
}

// Inicializar dados se estiverem vazios
export function initializeData(): void {
  const data = getStorageData();
  if (data.clientes.length === 0) {
    saveStorageData(data);
  }
}
