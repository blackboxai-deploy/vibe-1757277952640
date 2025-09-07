import { Cadastro, CadastroFormData, CadastroFilters, CadastroStats } from '@/types/cadastro';

const STORAGE_KEY = 'app_cadastros';

// Funções auxiliares
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Funções de persistência
export const getCadastrosFromStorage = (): Cadastro[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao carregar cadastros:', error);
    return [];
  }
};

export const saveCadastrosToStorage = (cadastros: Cadastro[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cadastros));
  } catch (error) {
    console.error('Erro ao salvar cadastros:', error);
    throw new Error('Erro ao salvar dados');
  }
};

// Operações CRUD
export const getAllCadastros = async (filters?: CadastroFilters): Promise<Cadastro[]> => {
  await delay(300); // Simula delay de API
  
  let cadastros = getCadastrosFromStorage();
  
  if (filters) {
    // Filtrar por busca
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      cadastros = cadastros.filter(cadastro => 
        cadastro.nome.toLowerCase().includes(searchTerm) ||
        cadastro.email.toLowerCase().includes(searchTerm) ||
        cadastro.cpf.includes(searchTerm)
      );
    }
    
    // Filtrar por status
    if (filters.status && filters.status !== 'todos') {
      cadastros = cadastros.filter(cadastro => cadastro.status === filters.status);
    }
  }
  
  // Ordenar por data de criação (mais recentes primeiro)
  return cadastros.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getCadastroById = async (id: string): Promise<Cadastro | null> => {
  await delay(200);
  
  const cadastros = getCadastrosFromStorage();
  return cadastros.find(cadastro => cadastro.id === id) || null;
};

export const createCadastro = async (data: CadastroFormData): Promise<Cadastro> => {
  await delay(500);
  
  const cadastros = getCadastrosFromStorage();
  
  // Verificar se email já existe
  const emailExists = cadastros.some(cadastro => cadastro.email === data.email);
  if (emailExists) {
    throw new Error('Email já cadastrado');
  }
  
  // Verificar se CPF já existe
  const cpfExists = cadastros.some(cadastro => cadastro.cpf === data.cpf);
  if (cpfExists) {
    throw new Error('CPF já cadastrado');
  }
  
  const now = new Date().toISOString();
  const novoCadastro: Cadastro = {
    id: generateId(),
    ...data,
    createdAt: now,
    updatedAt: now
  };
  
  cadastros.push(novoCadastro);
  saveCadastrosToStorage(cadastros);
  
  return novoCadastro;
};

export const updateCadastro = async (id: string, data: CadastroFormData): Promise<Cadastro> => {
  await delay(500);
  
  const cadastros = getCadastrosFromStorage();
  const index = cadastros.findIndex(cadastro => cadastro.id === id);
  
  if (index === -1) {
    throw new Error('Cadastro não encontrado');
  }
  
  // Verificar se email já existe (exceto no próprio registro)
  const emailExists = cadastros.some(cadastro => 
    cadastro.email === data.email && cadastro.id !== id
  );
  if (emailExists) {
    throw new Error('Email já cadastrado');
  }
  
  // Verificar se CPF já existe (exceto no próprio registro)
  const cpfExists = cadastros.some(cadastro => 
    cadastro.cpf === data.cpf && cadastro.id !== id
  );
  if (cpfExists) {
    throw new Error('CPF já cadastrado');
  }
  
  const cadastroAtualizado: Cadastro = {
    ...cadastros[index],
    ...data,
    updatedAt: new Date().toISOString()
  };
  
  cadastros[index] = cadastroAtualizado;
  saveCadastrosToStorage(cadastros);
  
  return cadastroAtualizado;
};

export const deleteCadastro = async (id: string): Promise<void> => {
  await delay(300);
  
  const cadastros = getCadastrosFromStorage();
  const index = cadastros.findIndex(cadastro => cadastro.id === id);
  
  if (index === -1) {
    throw new Error('Cadastro não encontrado');
  }
  
  cadastros.splice(index, 1);
  saveCadastrosToStorage(cadastros);
};

// Estatísticas
export const getCadastroStats = async (): Promise<CadastroStats> => {
  await delay(200);
  
  const cadastros = getCadastrosFromStorage();
  const now = new Date();
  const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const stats: CadastroStats = {
    total: cadastros.length,
    ativos: cadastros.filter(c => c.status === 'ativo').length,
    inativos: cadastros.filter(c => c.status === 'inativo').length,
    novosMes: cadastros.filter(c => new Date(c.createdAt) >= inicioMes).length
  };
  
  return stats;
};

// Função para inicializar dados de exemplo
export const initializeSampleData = (): void => {
  if (typeof window === 'undefined') return;
  
  const existingData = getCadastrosFromStorage();
  if (existingData.length > 0) return; // Já tem dados
  
  const sampleCadastros: Cadastro[] = [
    {
      id: '1',
      nome: 'Maria Silva Santos',
      email: 'maria.silva@email.com',
      telefone: '(11) 99999-9999',
      cpf: '123.456.789-00',
      endereco: {
        cep: '01310-100',
        logradouro: 'Av. Paulista',
        numero: '1000',
        complemento: 'Apto 101',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        estado: 'SP'
      },
      dataNascimento: '1990-05-15',
      status: 'ativo' as const,
      observacoes: 'Cliente preferencial',
      createdAt: new Date(2024, 0, 15).toISOString(),
      updatedAt: new Date(2024, 0, 15).toISOString()
    },
    {
      id: '2',
      nome: 'João Carlos Oliveira',
      email: 'joao.carlos@email.com',
      telefone: '(11) 88888-8888',
      cpf: '987.654.321-00',
      endereco: {
        cep: '04038-001',
        logradouro: 'R. Vergueiro',
        numero: '2000',
        bairro: 'Vila Mariana',
        cidade: 'São Paulo',
        estado: 'SP'
      },
      dataNascimento: '1985-08-22',
      status: 'ativo' as const,
      createdAt: new Date(2024, 1, 10).toISOString(),
      updatedAt: new Date(2024, 1, 10).toISOString()
    },
    {
      id: '3',
      nome: 'Ana Paula Costa',
      email: 'ana.paula@email.com',
      telefone: '(11) 77777-7777',
      cpf: '456.789.123-00',
      endereco: {
        cep: '05406-000',
        logradouro: 'R. Harmonia',
        numero: '500',
        complemento: 'Casa 2',
        bairro: 'Vila Madalena',
        cidade: 'São Paulo',
        estado: 'SP'
      },
      dataNascimento: '1992-12-03',
      status: 'inativo' as const,
      observacoes: 'Contato suspenso temporariamente',
      createdAt: new Date(2024, 2, 5).toISOString(),
      updatedAt: new Date(2024, 2, 20).toISOString()
    }
  ];
  
  saveCadastrosToStorage(sampleCadastros);
};