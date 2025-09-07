"use client";

import { Navbar } from "@/components/layout/Navbar";
import { CadastroForm } from "@/components/cadastros/CadastroForm";

export default function NovoCadastroPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Novo Cadastro</h1>
          <p className="text-gray-600">
            Preencha as informações abaixo para criar um novo cadastro no sistema.
          </p>
        </div>

        {/* Formulário */}
        <CadastroForm />
      </main>
    </div>
  );
}