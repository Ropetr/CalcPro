'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Save, 
  Star, 
  StarOff,
  Plus,
  Calendar,
  User,
  Building,
  Tag,
  Calculator,
  FileText,
  Download,
  Edit,
  Trash2
} from 'lucide-react'
import Link from 'next/link'
import { ProjetoService } from '@/lib/projetos'
import { Projeto, CalculoRealizado } from '@/types/projeto'

export default function ProjetoDetalhePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [projeto, setProjeto] = useState<Projeto | null>(null)
  const [editando, setEditando] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const id = searchParams.get('id')
    if (id) {
      const projetoEncontrado = ProjetoService.buscarProjeto(id)
      setProjeto(projetoEncontrado)
      setLoading(false)
      
      if (!projetoEncontrado) {
        router.push('/dashboard/projetos')
      }
    } else {
      router.push('/dashboard/projetos')
    }
  }, [searchParams, router])

  const salvarProjeto = (dadosAtualizados: Partial<Projeto>) => {
    if (!projeto) return
    
    const projetoAtualizado = { ...projeto, ...dadosAtualizados }
    ProjetoService.salvarProjeto(projetoAtualizado)
    setProjeto(projetoAtualizado)
    setEditando(false)
  }

  const alternarFavorito = () => {
    if (!projeto) return
    ProjetoService.alternarFavorito(projeto.id)
    setProjeto({ ...projeto, favorito: !projeto.favorito })
  }

  const adicionarCalculo = (calculo: CalculoRealizado) => {
    if (!projeto) return
    ProjetoService.adicionarCalculo(projeto.id, calculo)
    const projetoAtualizado = ProjetoService.buscarProjeto(projeto.id)
    if (projetoAtualizado) {
      setProjeto(projetoAtualizado)
    }
  }

  const removerCalculo = (index: number) => {
    if (!projeto) return
    const calculosAtualizados = projeto.calculos.filter((_, i) => i !== index)
    salvarProjeto({ calculos: calculosAtualizados })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'rascunho': return 'bg-gray-100 text-gray-700'
      case 'em-andamento': return 'bg-blue-100 text-blue-700'
      case 'concluido': return 'bg-green-100 text-green-700'
      case 'arquivado': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getCalculadoraLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      'divisoria-drywall': 'Divisória Drywall',
      'divisoria-naval': 'Divisória Naval',
      'forro-drywall': 'Forro Drywall',
      'forro-modular': 'Forro Modular',
      'forro-pvc': 'Forro PVC',
      'piso-laminado': 'Piso Laminado',
      'piso-vinilico': 'Piso Vinílico',
      'piso-wall': 'Piso Wall'
    }
    return labels[tipo] || tipo
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando projeto...</p>
        </div>
      </div>
    )
  }

  if (!projeto) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Projeto não encontrado</h1>
          <p className="mt-2 text-gray-600">O projeto solicitado não existe ou foi removido.</p>
          <Link
            href="/dashboard/projetos"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos Projetos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/dashboard/projetos"
                className="mr-4 p-2 text-gray-400 hover:text-gray-600"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{projeto.nome}</h1>
                <p className="text-sm text-gray-600">
                  {projeto.cliente?.nome || 'Sem cliente'} • {projeto.categoria} • {projeto.tipo}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={alternarFavorito}
                className={`p-2 rounded-md ${projeto.favorito ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
              >
                {projeto.favorito ? <Star className="h-5 w-5" /> : <StarOff className="h-5 w-5" />}
              </button>
              
              <button
                onClick={() => setEditando(!editando)}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Edit className="h-4 w-4 mr-2" />
                {editando ? 'Cancelar' : 'Editar'}
              </button>
              
              <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações do Projeto */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações do Projeto</h2>
              
              {editando ? (
                <FormEdicaoProjeto 
                  projeto={projeto} 
                  onSalvar={salvarProjeto}
                  onCancelar={() => setEditando(false)}
                />
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Descrição</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {projeto.descricao || 'Sem descrição'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(projeto.status)}`}>
                        {projeto.status.replace('-', ' ')}
                      </span>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Versão</label>
                      <p className="mt-1 text-sm text-gray-900">v{projeto.versao}</p>
                    </div>
                  </div>
                  
                  {projeto.observacoes && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Observações</label>
                      <p className="mt-1 text-sm text-gray-900">{projeto.observacoes}</p>
                    </div>
                  )}
                  
                  {projeto.tags.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                      <div className="flex flex-wrap gap-2">
                        {projeto.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cálculos Realizados */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Cálculos Realizados</h2>
                <button className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md">
                  <Plus className="h-4 w-4 mr-1" />
                  Novo Cálculo
                </button>
              </div>
              
              {projeto.calculos.length === 0 ? (
                <div className="text-center py-8">
                  <Calculator className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum cálculo realizado</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Comece adicionando seu primeiro cálculo a este projeto.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/dashboard/calculadoras"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Calculator className="h-4 w-4 mr-2" />
                      Ir para Calculadoras
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {projeto.calculos.map((calculo, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Calculator className="h-8 w-8 text-gray-400" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {getCalculadoraLabel(calculo.tipo)}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {new Date(calculo.dataCalculo).toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600">
                          <FileText className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => removerCalculo(index)}
                          className="p-2 text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informações do Cliente */}
            {projeto.cliente && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cliente</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{projeto.cliente.nome || 'Não informado'}</span>
                  </div>
                  {projeto.cliente.empresa && (
                    <div className="flex items-center">
                      <Building className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{projeto.cliente.empresa}</span>
                    </div>
                  )}
                  {projeto.cliente.email && (
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">{projeto.cliente.email}</span>
                    </div>
                  )}
                  {projeto.cliente.telefone && (
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">{projeto.cliente.telefone}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Metadados */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalhes</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Criado em:</span>
                  <span className="text-sm text-gray-900">
                    {new Date(projeto.dataCriacao).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Modificado em:</span>
                  <span className="text-sm text-gray-900">
                    {new Date(projeto.dataModificacao).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cálculos:</span>
                  <span className="text-sm text-gray-900">{projeto.calculos.length}</span>
                </div>
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações</h3>
              <div className="space-y-2">
                <Link
                  href="/dashboard/calculadoras"
                  className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Nova Calculadora
                </Link>
                <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
                  <FileText className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </button>
                <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Componente para edição do projeto
function FormEdicaoProjeto({ 
  projeto, 
  onSalvar, 
  onCancelar 
}: { 
  projeto: Projeto, 
  onSalvar: (dados: Partial<Projeto>) => void,
  onCancelar: () => void
}) {
  const [dados, setDados] = useState({
    nome: projeto.nome,
    descricao: projeto.descricao || '',
    status: projeto.status,
    observacoes: projeto.observacoes || '',
    tags: projeto.tags.join(', '),
    cliente: {
      nome: projeto.cliente?.nome || '',
      empresa: projeto.cliente?.empresa || '',
      email: projeto.cliente?.email || '',
      telefone: projeto.cliente?.telefone || ''
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const dadosAtualizados = {
      ...dados,
      tags: dados.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
      cliente: dados.cliente
    }
    onSalvar(dadosAtualizados)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Projeto</label>
        <input
          type="text"
          value={dados.nome}
          onChange={(e) => setDados({...dados, nome: e.target.value})}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
        <textarea
          value={dados.descricao}
          onChange={(e) => setDados({...dados, descricao: e.target.value})}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          value={dados.status}
          onChange={(e) => setDados({...dados, status: e.target.value as any})}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value="rascunho">Rascunho</option>
          <option value="em-andamento">Em Andamento</option>
          <option value="concluido">Concluído</option>
          <option value="arquivado">Arquivado</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
        <textarea
          value={dados.observacoes}
          onChange={(e) => setDados({...dados, observacoes: e.target.value})}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tags (separadas por vírgula)</label>
        <input
          type="text"
          value={dados.tags}
          onChange={(e) => setDados({...dados, tags: e.target.value})}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          placeholder="residencial, urgente, cliente-vip"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Cliente</label>
          <input
            type="text"
            value={dados.cliente.nome}
            onChange={(e) => setDados({...dados, cliente: {...dados.cliente, nome: e.target.value}})}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
          <input
            type="text"
            value={dados.cliente.empresa}
            onChange={(e) => setDados({...dados, cliente: {...dados.cliente, empresa: e.target.value}})}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancelar}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
        >
          <Save className="h-4 w-4 mr-2 inline" />
          Salvar Alterações
        </button>
      </div>
    </form>
  )
}