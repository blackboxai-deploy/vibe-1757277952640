export interface Endereco {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
}

export interface Cadastro {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco: Endereco;
  dataNascimento: string;
  status: 'ativo' | 'inativo';
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CadastroFormData {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  endereco: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
  dataNascimento: string;
  status: 'ativo' | 'inativo';
  observacoes?: string;
}

export interface CadastroFilters {
  search?: string;
  status?: 'ativo' | 'inativo' | 'todos';
}

export interface CadastroStats {
  total: number;
  ativos: number;
  inativos: number;
  novosMes: number;
}