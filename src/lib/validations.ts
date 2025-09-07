import { z } from 'zod';

// Função para validar CPF
const isValidCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, '');
  
  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  const digits = cleanCPF.split('').map(Number);
  
  // Validação do primeiro dígito
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * (10 - i);
  }
  let remainder = 11 - (sum % 11);
  if (remainder >= 10) remainder = 0;
  if (remainder !== digits[9]) return false;
  
  // Validação do segundo dígito
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += digits[i] * (11 - i);
  }
  remainder = 11 - (sum % 11);
  if (remainder >= 10) remainder = 0;
  if (remainder !== digits[10]) return false;
  
  return true;
};

// Função para validar CEP
const isValidCEP = (cep: string): boolean => {
  const cleanCEP = cep.replace(/\D/g, '');
  return cleanCEP.length === 8;
};

export const enderecoSchema = z.object({
  cep: z.string()
    .min(8, 'CEP deve ter 8 dígitos')
    .refine(isValidCEP, 'CEP inválido'),
  logradouro: z.string()
    .min(2, 'Logradouro deve ter pelo menos 2 caracteres')
    .max(100, 'Logradouro deve ter no máximo 100 caracteres'),
  numero: z.string()
    .min(1, 'Número é obrigatório')
    .max(10, 'Número deve ter no máximo 10 caracteres'),
  complemento: z.string().optional(),
  bairro: z.string()
    .min(2, 'Bairro deve ter pelo menos 2 caracteres')
    .max(50, 'Bairro deve ter no máximo 50 caracteres'),
  cidade: z.string()
    .min(2, 'Cidade deve ter pelo menos 2 caracteres')
    .max(50, 'Cidade deve ter no máximo 50 caracteres'),
  estado: z.string()
    .length(2, 'Estado deve ter 2 caracteres (UF)')
    .toUpperCase()
});

export const cadastroSchema = z.object({
  nome: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Nome deve conter apenas letras e espaços'),
  email: z.string()
    .email('Email inválido')
    .max(100, 'Email deve ter no máximo 100 caracteres'),
  telefone: z.string()
    .min(10, 'Telefone deve ter pelo menos 10 dígitos')
    .max(15, 'Telefone deve ter no máximo 15 dígitos')
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Formato de telefone inválido'),
  cpf: z.string()
    .refine(isValidCPF, 'CPF inválido'),
  endereco: enderecoSchema,
  dataNascimento: z.string()
    .refine((date) => {
      const parsedDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - parsedDate.getFullYear();
      return age >= 0 && age <= 120;
    }, 'Data de nascimento inválida'),
  status: z.enum(['ativo', 'inativo'], {
    errorMap: () => ({ message: 'Status deve ser ativo ou inativo' })
  }),
  observacoes: z.string().optional()
});

export type CadastroFormData = z.infer<typeof cadastroSchema>;