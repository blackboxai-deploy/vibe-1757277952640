"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cadastroSchema } from "@/lib/validations";
import { createCadastro, updateCadastro } from "@/lib/cadastros";
import { Cadastro, CadastroFormData } from "@/types/cadastro";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CadastroFormProps {
  cadastro?: Cadastro;
  isEditing?: boolean;
}

export function CadastroForm({ cadastro, isEditing = false }: CadastroFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: cadastro ? {
      nome: cadastro.nome,
      email: cadastro.email,
      telefone: cadastro.telefone,
      cpf: cadastro.cpf,
      endereco: cadastro.endereco,
      dataNascimento: cadastro.dataNascimento,
      status: cadastro.status,
      observacoes: cadastro.observacoes || '',
    } : {
      status: 'ativo',
    },
  });

  const status = watch('status');

  // Função para aplicar máscara de CPF
  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  // Função para aplicar máscara de telefone
  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  // Função para aplicar máscara de CEP
  const formatCEP = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  };

  const onSubmit = async (data: CadastroFormData) => {
    setLoading(true);
    try {
      if (isEditing && cadastro) {
        await updateCadastro(cadastro.id, data);
        toast.success('Cadastro atualizado com sucesso!');
      } else {
        await createCadastro(data);
        toast.success('Cadastro criado com sucesso!');
      }
      router.push('/cadastros');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar cadastro');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Informações Pessoais */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                {...register('nome')}
                placeholder="Digite o nome completo"
                className={errors.nome ? 'border-red-500' : ''}
              />
              {errors.nome && (
                <p className="text-sm text-red-500 mt-1">{errors.nome.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="Digite o email"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="telefone">Telefone *</Label>
              <Input
                id="telefone"
                {...register('telefone')}
                placeholder="(11) 99999-9999"
                className={errors.telefone ? 'border-red-500' : ''}
                onChange={(e) => {
                  const formatted = formatPhone(e.target.value);
                  setValue('telefone', formatted);
                }}
                maxLength={15}
              />
              {errors.telefone && (
                <p className="text-sm text-red-500 mt-1">{errors.telefone.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                {...register('cpf')}
                placeholder="123.456.789-00"
                className={errors.cpf ? 'border-red-500' : ''}
                onChange={(e) => {
                  const formatted = formatCPF(e.target.value);
                  setValue('cpf', formatted);
                }}
                maxLength={14}
              />
              {errors.cpf && (
                <p className="text-sm text-red-500 mt-1">{errors.cpf.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
              <Input
                id="dataNascimento"
                type="date"
                {...register('dataNascimento')}
                className={errors.dataNascimento ? 'border-red-500' : ''}
              />
              {errors.dataNascimento && (
                <p className="text-sm text-red-500 mt-1">{errors.dataNascimento.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="status">Status *</Label>
              <Select value={status} onValueChange={(value) => setValue('status', value as 'ativo' | 'inativo')}>
                <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Endereço */}
      <Card>
        <CardHeader>
          <CardTitle>Endereço</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="cep">CEP *</Label>
              <Input
                id="cep"
                {...register('endereco.cep')}
                placeholder="12345-678"
                className={errors.endereco?.cep ? 'border-red-500' : ''}
                onChange={(e) => {
                  const formatted = formatCEP(e.target.value);
                  setValue('endereco.cep', formatted);
                }}
                maxLength={9}
              />
              {errors.endereco?.cep && (
                <p className="text-sm text-red-500 mt-1">{errors.endereco.cep.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="logradouro">Logradouro *</Label>
              <Input
                id="logradouro"
                {...register('endereco.logradouro')}
                placeholder="Rua, avenida, etc."
                className={errors.endereco?.logradouro ? 'border-red-500' : ''}
              />
              {errors.endereco?.logradouro && (
                <p className="text-sm text-red-500 mt-1">{errors.endereco.logradouro.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="numero">Número *</Label>
              <Input
                id="numero"
                {...register('endereco.numero')}
                placeholder="123"
                className={errors.endereco?.numero ? 'border-red-500' : ''}
              />
              {errors.endereco?.numero && (
                <p className="text-sm text-red-500 mt-1">{errors.endereco.numero.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="complemento">Complemento</Label>
              <Input
                id="complemento"
                {...register('endereco.complemento')}
                placeholder="Apto, sala, etc."
              />
            </div>

            <div>
              <Label htmlFor="bairro">Bairro *</Label>
              <Input
                id="bairro"
                {...register('endereco.bairro')}
                placeholder="Nome do bairro"
                className={errors.endereco?.bairro ? 'border-red-500' : ''}
              />
              {errors.endereco?.bairro && (
                <p className="text-sm text-red-500 mt-1">{errors.endereco.bairro.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="cidade">Cidade *</Label>
              <Input
                id="cidade"
                {...register('endereco.cidade')}
                placeholder="Nome da cidade"
                className={errors.endereco?.cidade ? 'border-red-500' : ''}
              />
              {errors.endereco?.cidade && (
                <p className="text-sm text-red-500 mt-1">{errors.endereco.cidade.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="estado">Estado *</Label>
              <Input
                id="estado"
                {...register('endereco.estado')}
                placeholder="SP"
                className={errors.endereco?.estado ? 'border-red-500' : ''}
                maxLength={2}
                onChange={(e) => {
                  setValue('endereco.estado', e.target.value.toUpperCase());
                }}
              />
              {errors.endereco?.estado && (
                <p className="text-sm text-red-500 mt-1">{errors.endereco.estado.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Observações */}
      <Card>
        <CardHeader>
          <CardTitle>Observações</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="observacoes">Observações Adicionais</Label>
          <Textarea
            id="observacoes"
            {...register('observacoes')}
            placeholder="Informações adicionais sobre o cadastro..."
            rows={3}
          />
          {errors.observacoes && (
            <p className="text-sm text-red-500 mt-1">{errors.observacoes.message}</p>
          )}
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {isEditing ? 'Atualizar' : 'Criar'} Cadastro
        </Button>
      </div>
    </form>
  );
}