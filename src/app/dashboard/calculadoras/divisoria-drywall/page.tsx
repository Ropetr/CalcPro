'use client'

import { useState, useEffect } from 'react'
import { 
  ArrowLeft, 
  Building2, 
  Calculator, 
  FileText, 
  Download,
  Settings,
  Ruler,
  Layers,
  Package,
  AlertCircle,
  Plus,
  Trash2,
  Edit3,
  Search,
  Flag,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'
import { DrywallCalculator, type MedidaParede as MedidaParedeType, type ResultadoCalculoDrywall } from '@/lib/calculators/divisoria-drywall'
import DrywallDrawing from '@/components/DrywallDrawing'

interface Medida {
  id: string
  nome: string
  altura: string
  largura: string
  descricao: string
  area: number
  especificacoes: {
    tipoChapa: '1.80' | '2.40'
    tipoMontante: '48' | '70' | '90'
    chapasPorLado: 'simples' | 'duplo' | 'quadruplo'
    incluirIsolamento: boolean
    preenchido: boolean
  }
  vaos: {
    porta: {
      tipo: 'nenhuma' | 'comum' | 'passagem'
      largura: string
      altura: string
    }
    janelas: {
      quantidade: string
      largura: string
      altura: string
    }
    preenchido: boolean
  }
}

export default function DivisoriaDrywallPage() {
  const [modalidade, setModalidade] = useState<'abnt' | 'basica'>('abnt')
  const [activeTab, setActiveTab] = useState<'medidas' | 'desenho' | 'materiais'>('medidas')
  const [searchTerm, setSearchTerm] = useState('')
  const [modalAberto, setModalAberto] = useState<{tipo: 'especificacoes' | 'vaos' | null, medidaId: string | null}>({tipo: null, medidaId: null})
  const [especificacoesPadrao, setEspecificacoesPadrao] = useState<{
    tipoChapa: '1.80' | '2.40'
    tipoMontante: '48' | '70' | '90'
    chapasPorLado: 'simples' | 'duplo' | 'quadruplo'
    incluirIsolamento: boolean
  } | null>(null)
  const [resultadoCalculo, setResultadoCalculo] = useState<ResultadoCalculoDrywall | null>(null)
  const [calculadora] = useState(new DrywallCalculator())
  const [medidas, setMedidas] = useState<Medida[]>([
    {
      id: '1',
      nome: 'Parede 01',
      altura: '',
      largura: '',
      descricao: '',
      area: 0,
      especificacoes: {
        tipoChapa: '1.80' as const,
        tipoMontante: '48' as const,
        chapasPorLado: 'simples' as const,
        incluirIsolamento: false,
        preenchido: false
      },
      vaos: {
        porta: {
          tipo: 'nenhuma' as const,
          largura: '0.80',
          altura: '2.10'
        },
        janelas: {
          quantidade: '0',
          largura: '1.20',
          altura: '1.05'
        },
        preenchido: false
      }
    }
  ])
  
  // Configurações gerais do projeto
  const [espessura, setEspessura] = useState('70')

  // Atalhos de teclado: TAB (nova medida) e ENTER (calcular)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLInputElement
      
      // Se está no campo descrição e pressionou TAB
      if (target?.getAttribute('data-field') === 'descricao' && event.key === 'Tab') {
        event.preventDefault()
        // Salvar o valor atual antes de adicionar nova medida
        const medidaId = target.closest('[data-medida-id]')?.getAttribute('data-medida-id')
        if (medidaId && target.value) {
          atualizarMedida(medidaId, 'descricao', target.value)
        }
        adicionarMedida()
        // Focar no primeiro campo (largura) da nova medida após um pequeno delay
        setTimeout(() => {
          const novoInput = document.querySelector('[data-medida-id]:first-child input[type="number"]') as HTMLInputElement
          if (novoInput) {
            novoInput.focus()
          }
        }, 100)
      }
      
      // Se está no campo descrição e pressionou ENTER
      if (target?.getAttribute('data-field') === 'descricao' && event.key === 'Enter') {
        event.preventDefault()
        calcularMateriais()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [medidas])

  const calcularMateriais = () => {
    try {
      // Converter medidas para o formato esperado pela calculadora
      const paredesParaCalculo: MedidaParedeType[] = medidas
        .filter(medida => parseFloat(medida.altura) > 0 && parseFloat(medida.largura) > 0)
        .map(medida => ({
          id: medida.id,
          nome: medida.nome,
          altura: parseFloat(medida.altura),
          largura: parseFloat(medida.largura),
          descricao: medida.descricao,
          area: parseFloat(medida.altura) * parseFloat(medida.largura),
          especificacoes: {
            tipoChapa: medida.especificacoes.tipoChapa,
            tipoMontante: medida.especificacoes.tipoMontante,
            chapasPorLado: medida.especificacoes.chapasPorLado,
            incluirIsolamento: medida.especificacoes.incluirIsolamento,
            preenchido: medida.especificacoes.preenchido
          },
          vaos: {
            porta: {
              tipo: medida.vaos.porta.tipo,
              largura: medida.vaos.porta.tipo !== 'nenhuma' ? parseFloat(medida.vaos.porta.largura) : undefined,
              altura: medida.vaos.porta.tipo !== 'nenhuma' ? parseFloat(medida.vaos.porta.altura) : undefined
            },
            janelas: {
              quantidade: parseInt(medida.vaos.janelas.quantidade) || 0,
              largura: parseFloat(medida.vaos.janelas.largura) || 1.20,
              altura: parseFloat(medida.vaos.janelas.altura) || 1.05
            },
            preenchido: medida.vaos.preenchido
          }
        }))
      
      if (paredesParaCalculo.length === 0) {
        alert('Adicione pelo menos uma medida válida para calcular')
        return
      }
      
      const resultado = calculadora.calcular(paredesParaCalculo, modalidade)
      setResultadoCalculo(resultado)
      setActiveTab('materiais')
      
      console.log('Cálculo realizado com sucesso:', resultado)
    } catch (error) {
      console.error('Erro ao calcular materiais:', error)
      alert('Erro ao calcular materiais. Verifique os dados inseridos.')
    }
  }

  const adicionarMedida = () => {
    const novaId = (medidas.length + 1).toString()
    const novoItem: Medida = {
      id: novaId,
      nome: `Parede ${novaId.padStart(2, '0')}`,
      altura: '',
      largura: '',
      descricao: '',
      area: 0,
      especificacoes: especificacoesPadrao ? {
        tipoChapa: especificacoesPadrao.tipoChapa,
        tipoMontante: especificacoesPadrao.tipoMontante,
        chapasPorLado: especificacoesPadrao.chapasPorLado,
        incluirIsolamento: especificacoesPadrao.incluirIsolamento,
        preenchido: true // Já vem preenchida com o padrão
      } : {
        tipoChapa: '1.80' as const,
        tipoMontante: '48' as const,
        chapasPorLado: 'simples' as const,
        incluirIsolamento: false,
        preenchido: false
      },
      vaos: {
        porta: {
          tipo: 'nenhuma' as const,
          largura: '0.80',
          altura: '2.10'
        },
        janelas: {
          quantidade: '0',
          largura: '1.20',
          altura: '1.05'
        },
        preenchido: false
      }
    }
    setMedidas([...medidas, novoItem])
    setActiveTab('medidas')
  }

  const removerMedida = (id: string) => {
    if (medidas.length > 1) {
      setMedidas(medidas.filter(m => m.id !== id))
    }
  }

  const atualizarMedida = (id: string, campo: keyof Medida, valor: any) => {
    setMedidas(medidas.map(medida => {
      if (medida.id === id) {
        if (campo === 'especificacoes') {
          return {
            ...medida,
            especificacoes: { ...medida.especificacoes, ...valor }
          }
        } else if (campo === 'vaos') {
          return {
            ...medida,
            vaos: { ...medida.vaos, ...valor }
          }
        } else {
          const updated = { ...medida, [campo]: valor }
          
          // Calcular área automaticamente
          if (campo === 'altura' || campo === 'largura') {
            const altura = parseFloat(campo === 'altura' ? valor : updated.altura) || 0
            const largura = parseFloat(campo === 'largura' ? valor : updated.largura) || 0
            updated.area = altura * largura
          }
          return updated
        }
      }
      return medida
    }))
  }

  const areaTotal = medidas.reduce((total, medida) => total + medida.area, 0)

  // Função para determinar a cor da flag de especificações
  const getCorFlagEspecificacoes = (medida: Medida) => {
    if (!medida.especificacoes.preenchido) {
      return 'bg-red-500 text-white' // Vermelha - não configurada ainda
    }

    if (!especificacoesPadrao) {
      return 'bg-green-500 text-white' // Verde - primeira a ser configurada (tem informações)
    }

    // Verificar se é igual ao padrão
    const igualPadrao = 
      medida.especificacoes.tipoChapa === especificacoesPadrao.tipoChapa &&
      medida.especificacoes.tipoMontante === especificacoesPadrao.tipoMontante &&
      medida.especificacoes.chapasPorLado === especificacoesPadrao.chapasPorLado &&
      medida.especificacoes.incluirIsolamento === especificacoesPadrao.incluirIsolamento

    return igualPadrao 
      ? 'bg-green-500 text-white'  // Verde - tem informações (padrão)
      : 'bg-yellow-400 text-gray-800'   // Amarela - foi modificada/personalizada
  }

  // Função para determinar a cor da flag de vãos e aberturas
  const getCorFlagVaos = (medida: Medida) => {
    // Se não foi configurada, permanece vermelha
    if (!medida.vaos.preenchido) {
      return 'bg-red-500 text-white' // Vermelha - não configurada ainda
    }

    // Verificar se tem informações preenchidas
    const temInformacoes = medida.vaos.porta.tipo !== 'nenhuma' || 
                          (medida.vaos.janelas.quantidade && medida.vaos.janelas.quantidade !== '0')

    // Se tem vãos = verde, se não tem vãos = continua vermelha (sem dados)
    return temInformacoes 
      ? 'bg-green-500 text-white'  // Verde - usuário adicionou vãos
      : 'bg-red-500 text-white'    // Vermelha - sem dados/vãos
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard/calculadoras"
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar
              </Link>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center mr-3">
                  <Building2 className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Divisória Drywall</h1>
                  <p className="text-sm text-gray-600">Otimização de projetos com paredes leves</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="btn-secondary flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Salvar Projeto
              </button>
              <button className="btn-primary flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Gerar PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar - Removido conforme especificação */}
        <div className="w-4 bg-gray-100"></div>

        {/* Main Content - Área de Resultados */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Cards de Informação */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <Settings className="h-8 w-8 text-primary-600 mx-auto mb-3" />
                <div className="text-sm text-gray-600 mb-3">Modalidade de Cálculo</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setModalidade('abnt')}
                    className={`px-3 py-2 text-xs font-medium rounded transition-colors ${
                      modalidade === 'abnt'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    ABNT
                  </button>
                  <button
                    onClick={() => setModalidade('basica')}
                    className={`px-3 py-2 text-xs font-medium rounded transition-colors ${
                      modalidade === 'basica'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    BÁSICA
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <Ruler className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                <div className="text-sm text-gray-600">Área Total</div>
                <div className="text-2xl font-bold text-gray-900">
                  {areaTotal.toFixed(2)} m²
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {medidas.length} medida{medidas.length !== 1 ? 's' : ''}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <Building2 className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <div className="text-sm text-gray-600">Paredes</div>
                <div className="text-2xl font-bold text-gray-900">{medidas.length}</div>
                <div className="text-xs text-gray-500 mt-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">Tab</kbd> nova medida
                  <br />
                  <kbd className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">Enter</kbd> calcular
                </div>
              </div>
            </div>

            {/* Área de Desenho Técnico com Abas */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="border-b border-gray-200">
                <div className="flex items-center justify-between p-6 pb-0">
                  <div className="flex space-x-8">
                    <button
                      onClick={() => setActiveTab('medidas')}
                      className={`pb-4 text-sm font-medium transition-colors border-b-2 ${
                        activeTab === 'medidas'
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Medidas ({medidas.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('desenho')}
                      className={`pb-4 text-sm font-medium transition-colors border-b-2 ${
                        activeTab === 'desenho'
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Desenho Técnico
                    </button>
                    <button
                      onClick={() => setActiveTab('materiais')}
                      className={`pb-4 text-sm font-medium transition-colors border-b-2 ${
                        activeTab === 'materiais'
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Lista de Materiais
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    {activeTab === 'medidas' && (
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="text"
                          placeholder="Buscar medidas..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-48"
                        />
                      </div>
                    )}
                    {activeTab === 'desenho' && (
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="text"
                          placeholder="Buscar medidas..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-48"
                        />
                      </div>
                    )}
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Conteúdo das Abas */}
              <div className="p-6">
                {activeTab === 'medidas' && (
                  <div className="space-y-4">
                    {medidas.length === 0 && (
                      <div className="text-center py-8">
                        <Ruler className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <div className="text-gray-600">Nenhuma medida adicionada</div>
                        <button
                          onClick={adicionarMedida}
                          className="mt-3 btn-primary"
                        >
                          Adicionar Primeira Medida
                        </button>
                      </div>
                    )}
                    
                    <div className="max-h-96 overflow-y-auto space-y-4">
                      {medidas.slice().reverse().map((medida, reverseIndex) => {
                        const displayNumber = medidas.length - reverseIndex;
                        return (
                          <div key={medida.id} className="border border-gray-200 rounded-lg p-4" data-medida-id={medida.id}>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-primary-600">{displayNumber}</span>
                                </div>
                            <input
                              type="text"
                              value={medida.nome}
                              onChange={(e) => atualizarMedida(medida.id, 'nome', e.target.value)}
                              className="text-sm font-medium bg-transparent border-none focus:ring-0 p-0"
                              placeholder="Nome da parede"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1 mr-3">
                              <button
                                onClick={() => setModalAberto({tipo: 'especificacoes', medidaId: medida.id})}
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${getCorFlagEspecificacoes(medida)}`}
                                title={
                                  !medida.especificacoes.preenchido 
                                    ? "🔴 Especificações - Não configurada"
                                    : !especificacoesPadrao 
                                      ? "🟢 Especificações - Configurada"
                                      : medida.especificacoes.tipoChapa === especificacoesPadrao.tipoChapa &&
                                        medida.especificacoes.tipoMontante === especificacoesPadrao.tipoMontante &&
                                        medida.especificacoes.chapasPorLado === especificacoesPadrao.chapasPorLado &&
                                        medida.especificacoes.incluirIsolamento === especificacoesPadrao.incluirIsolamento
                                        ? "🟢 Especificações - Padrão do projeto"
                                        : "🟡 Especificações - Modificada/Personalizada"
                                }
                              >
                                <Flag className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => setModalAberto({tipo: 'vaos', medidaId: medida.id})}
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${getCorFlagVaos(medida)}`}
                                title={
                                  !medida.vaos.preenchido 
                                    ? "🔴 Vãos e Aberturas - Não configurada"
                                    : medida.vaos.porta.tipo !== 'nenhuma' || (medida.vaos.janelas.quantidade && medida.vaos.janelas.quantidade !== '0')
                                      ? "🟢 Vãos e Aberturas - Tem vãos"
                                      : "🔴 Vãos e Aberturas - Sem dados"
                                }
                              >
                                <Flag className="h-3 w-3" />
                              </button>
                            </div>
                            <div className="text-sm text-gray-600">
                              {medida.area.toFixed(2)} m²
                            </div>
                            {medidas.length > 1 && (
                              <button
                                onClick={() => removerMedida(medida.id)}
                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Largura (m)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={medida.largura}
                              onChange={(e) => atualizarMedida(medida.id, 'largura', e.target.value)}
                              className="input-field text-sm"
                              placeholder="3.50"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Altura (m)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={medida.altura}
                              onChange={(e) => atualizarMedida(medida.id, 'altura', e.target.value)}
                              className="input-field text-sm"
                              placeholder="2.70"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Descrição</label>
                            <input
                              type="text"
                              value={medida.descricao}
                              onChange={(e) => atualizarMedida(medida.id, 'descricao', e.target.value)}
                              className="input-field text-sm"
                              placeholder="Ex: Sala, Quarto..."
                              data-field="descricao"
                            />
                          </div>
                        </div>
                          </div>
                        )
                      })}
                    </div>
                    
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          Total de {medidas.length} medida{medidas.length !== 1 ? 's' : ''}
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {areaTotal.toFixed(2)} m²
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Pressione <kbd className="px-1 py-0.5 bg-white text-gray-600 text-xs rounded">Tab</kbd> para nova medida ou <kbd className="px-1 py-0.5 bg-white text-gray-600 text-xs rounded">Enter</kbd> para calcular
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'desenho' && (
                  <div className="space-y-4">
                    {!resultadoCalculo ? (
                      <div className="h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <div className="text-gray-600">Desenho técnico será gerado após o cálculo</div>
                          <div className="text-sm text-gray-500">Inclui plano de corte e manual de montagem</div>
                          <div className="text-xs text-gray-500 mt-2">
                            Total: {areaTotal.toFixed(2)} m² ({medidas.length} medida{medidas.length !== 1 ? 's' : ''})
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Desenhos Técnicos das Paredes */}
                        <div className="space-y-6">
                          {resultadoCalculo.paredes.map((parede, index) => (
                            <DrywallDrawing key={parede.id} parede={parede} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'materiais' && (
                  <div className="space-y-6">
                    {!resultadoCalculo ? (
                      <div className="text-center text-gray-500 py-8">
                        <Calculator className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                        <div>Execute o cálculo para ver a lista detalhada de materiais</div>
                        <div className="text-sm mt-1">Inclui chapas, perfis, parafusos, massa e fita</div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Resumo do Cálculo */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-blue-900">Resumo do Cálculo</h3>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              Modalidade: {resultadoCalculo.modalidade.toUpperCase()}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-900">{resultadoCalculo.areaTotal.toFixed(2)}</div>
                              <div className="text-blue-700">m² líquidos</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-900">{resultadoCalculo.resumo.totalChapas}</div>
                              <div className="text-blue-700">chapas</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-900">{resultadoCalculo.resumo.totalPerfis}</div>
                              <div className="text-blue-700">perfis</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-blue-900">{resultadoCalculo.resumo.totalParafusos}</div>
                              <div className="text-blue-700">parafusos</div>
                            </div>
                          </div>
                        </div>

                        {/* Chapas */}
                        <div className="bg-white border border-gray-200 rounded-lg">
                          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
                            <h3 className="font-semibold text-gray-900 flex items-center">
                              <Package className="h-5 w-5 mr-2 text-gray-600" />
                              Chapas Drywall
                            </h3>
                          </div>
                          <div className="p-4">
                            <div className="space-y-3">
                              {resultadoCalculo.materiais.chapas.map((item, index) => (
                                <div key={index} className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900">{item.item}</div>
                                    <div className="text-sm text-gray-600">{item.descricao}</div>
                                    {item.observacoes && (
                                      <div className="text-xs text-gray-500 mt-1">{item.observacoes}</div>
                                    )}
                                  </div>
                                  <div className="text-right ml-4">
                                    <div className="font-semibold text-gray-900">{item.quantidade} {item.unidade}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Perfis */}
                        <div className="bg-white border border-gray-200 rounded-lg">
                          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
                            <h3 className="font-semibold text-gray-900 flex items-center">
                              <Ruler className="h-5 w-5 mr-2 text-gray-600" />
                              Perfis Metálicos
                            </h3>
                          </div>
                          <div className="p-4">
                            <div className="space-y-3">
                              {resultadoCalculo.materiais.perfis.map((item, index) => (
                                <div key={index} className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900">{item.item}</div>
                                    <div className="text-sm text-gray-600">{item.descricao}</div>
                                    {item.observacoes && (
                                      <div className="text-xs text-gray-500 mt-1">{item.observacoes}</div>
                                    )}
                                  </div>
                                  <div className="text-right ml-4">
                                    <div className="font-semibold text-gray-900">{item.quantidade} {item.unidade}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Fixação */}
                        <div className="bg-white border border-gray-200 rounded-lg">
                          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
                            <h3 className="font-semibold text-gray-900 flex items-center">
                              <Settings className="h-5 w-5 mr-2 text-gray-600" />
                              Fixação
                            </h3>
                          </div>
                          <div className="p-4">
                            <div className="space-y-3">
                              {resultadoCalculo.materiais.fixacao.map((item, index) => (
                                <div key={index} className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900">{item.item}</div>
                                    <div className="text-sm text-gray-600">{item.descricao}</div>
                                    {item.observacoes && (
                                      <div className="text-xs text-gray-500 mt-1">{item.observacoes}</div>
                                    )}
                                  </div>
                                  <div className="text-right ml-4">
                                    <div className="font-semibold text-gray-900">{item.quantidade} {item.unidade}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Acabamento */}
                        <div className="bg-white border border-gray-200 rounded-lg">
                          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
                            <h3 className="font-semibold text-gray-900 flex items-center">
                              <Layers className="h-5 w-5 mr-2 text-gray-600" />
                              Acabamento
                            </h3>
                          </div>
                          <div className="p-4">
                            <div className="space-y-3">
                              {resultadoCalculo.materiais.acabamento.map((item, index) => (
                                <div key={index} className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900">{item.item}</div>
                                    <div className="text-sm text-gray-600">{item.descricao}</div>
                                    {item.observacoes && (
                                      <div className="text-xs text-gray-500 mt-1">{item.observacoes}</div>
                                    )}
                                  </div>
                                  <div className="text-right ml-4">
                                    <div className="font-semibold text-gray-900">{item.quantidade} {item.unidade}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Modal para Especificações */}
      {modalAberto.tipo === 'especificacoes' && modalAberto.medidaId && (() => {
        const medida = medidas.find(m => m.id === modalAberto.medidaId)
        if (!medida) return null
        
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-md">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Especificações da Parede</h3>
                  {medida.especificacoes.preenchido && especificacoesPadrao && (
                    <div className="text-sm text-gray-600 mt-1">
                      {medida.especificacoes.tipoMontante === especificacoesPadrao.tipoMontante &&
                       medida.especificacoes.chapasPorLado === especificacoesPadrao.chapasPorLado &&
                       medida.especificacoes.incluirIsolamento === especificacoesPadrao.incluirIsolamento
                        ? "🟢 Usando especificações padrão do projeto"
                        : "🟡 Especificações modificadas"}
                    </div>
                  )}
                  {!medida.especificacoes.preenchido && (
                    <div className="text-sm text-gray-600 mt-1">
                      🔴 Especificações não configuradas
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setModalAberto({tipo: null, medidaId: null})}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4">
                {especificacoesPadrao && (
                  medida.especificacoes.tipoChapa !== especificacoesPadrao.tipoChapa ||
                  medida.especificacoes.tipoMontante !== especificacoesPadrao.tipoMontante ||
                  medida.especificacoes.chapasPorLado !== especificacoesPadrao.chapasPorLado ||
                  medida.especificacoes.incluirIsolamento !== especificacoesPadrao.incluirIsolamento
                ) && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-green-800">
                        Aplicar especificações padrão do projeto?
                      </div>
                      <button
                        onClick={() => {
                          atualizarMedida(medida.id, 'especificacoes', {
                            tipoChapa: especificacoesPadrao.tipoChapa,
                            tipoMontante: especificacoesPadrao.tipoMontante,
                            chapasPorLado: especificacoesPadrao.chapasPorLado,
                            incluirIsolamento: especificacoesPadrao.incluirIsolamento
                          })
                        }}
                        className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Aplicar
                      </button>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Medida de Chapa</label>
                  <select 
                    className="input-field"
                    value={medida.especificacoes.tipoChapa}
                    onChange={(e) => atualizarMedida(medida.id, 'especificacoes', { tipoChapa: e.target.value })}
                  >
                    <option value="1.80">1,20 x 1,80m (Padrão)</option>
                    <option value="2.40">1,20 x 2,40m</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Montante</label>
                  <select 
                    className="input-field"
                    value={medida.especificacoes.tipoMontante}
                    onChange={(e) => atualizarMedida(medida.id, 'especificacoes', { tipoMontante: e.target.value })}
                  >
                    <option value="48">48mm (Padrão)</option>
                    <option value="70">70mm (Reforçado)</option>
                    <option value="90">90mm (Extra Reforçado)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Chapeamento</label>
                  <select 
                    className="input-field"
                    value={medida.especificacoes.chapasPorLado}
                    onChange={(e) => atualizarMedida(medida.id, 'especificacoes', { chapasPorLado: e.target.value })}
                  >
                    <option value="simples">Simples</option>
                    <option value="duplo">Duplo</option>
                    <option value="quadruplo">Quadruplo</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300"
                      checked={medida.especificacoes.incluirIsolamento}
                      onChange={(e) => atualizarMedida(medida.id, 'especificacoes', { incluirIsolamento: e.target.checked })}
                    />
                    <span className="text-sm text-gray-600">Incluir isolamento acústico</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  onClick={() => setModalAberto({tipo: null, medidaId: null})}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    // Salvar as especificações
                    atualizarMedida(medida.id, 'especificacoes', { preenchido: true })
                    
                    // Se é a primeira especificação configurada, definir como padrão
                    if (!especificacoesPadrao) {
                      setEspecificacoesPadrao({
                        tipoChapa: medida.especificacoes.tipoChapa,
                        tipoMontante: medida.especificacoes.tipoMontante,
                        chapasPorLado: medida.especificacoes.chapasPorLado,
                        incluirIsolamento: medida.especificacoes.incluirIsolamento
                      })
                    }
                    
                    setModalAberto({tipo: null, medidaId: null})
                  }}
                  className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Modal para Vãos e Aberturas */}
      {modalAberto.tipo === 'vaos' && modalAberto.medidaId && (() => {
        const medida = medidas.find(m => m.id === modalAberto.medidaId)
        if (!medida) return null
        
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-md">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Vãos e Aberturas</h3>
                  {medida.vaos.preenchido ? (
                    <div className="text-sm text-gray-600 mt-1">
                      {medida.vaos.porta.tipo !== 'nenhuma' || (medida.vaos.janelas.quantidade && medida.vaos.janelas.quantidade !== '0')
                        ? "🟢 Parede com vãos configurados"
                        : "🔴 Parede sem dados de vãos"}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-600 mt-1">
                      🔴 Vãos não configurados
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setModalAberto({tipo: null, medidaId: null})}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-xs text-blue-800">
                    💡 <strong>Sistema de cores:</strong> 🔴 Sem dados/configurar → 🟢 Com vãos
                  </div>
                </div>
                
                {/* Porta */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Porta</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Tipo</label>
                      <select 
                        className="input-field"
                        value={medida.vaos.porta.tipo}
                        onChange={(e) => atualizarMedida(medida.id, 'vaos', { 
                          porta: { 
                            ...medida.vaos.porta, 
                            tipo: e.target.value as 'nenhuma' | 'comum' | 'passagem'
                          } 
                        })}
                      >
                        <option value="nenhuma">Nenhuma</option>
                        <option value="comum">Porta Comum</option>
                        <option value="passagem">Vão de Passagem</option>
                      </select>
                    </div>
                    
                    {medida.vaos.porta.tipo !== 'nenhuma' && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Largura (m)</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="input-field"
                            placeholder="0.80"
                            value={medida.vaos.porta.largura}
                            onChange={(e) => atualizarMedida(medida.id, 'vaos', { 
                              porta: { ...medida.vaos.porta, largura: e.target.value } 
                            })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Altura (m)</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="input-field"
                            placeholder="2.10"
                            value={medida.vaos.porta.altura}
                            onChange={(e) => atualizarMedida(medida.id, 'vaos', { 
                              porta: { ...medida.vaos.porta, altura: e.target.value } 
                            })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Janelas */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Janelas</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Quantidade</label>
                      <input
                        type="number"
                        min="0"
                        className="input-field"
                        placeholder="0"
                        value={medida.vaos.janelas.quantidade}
                        onChange={(e) => atualizarMedida(medida.id, 'vaos', { 
                          janelas: { ...medida.vaos.janelas, quantidade: e.target.value } 
                        })}
                      />
                    </div>
                    
                    {medida.vaos.janelas.quantidade && medida.vaos.janelas.quantidade !== '0' && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Largura Total (m)</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="input-field"
                            placeholder="1.20"
                            value={medida.vaos.janelas.largura}
                            onChange={(e) => atualizarMedida(medida.id, 'vaos', { 
                              janelas: { ...medida.vaos.janelas, largura: e.target.value } 
                            })}
                          />
                          <div className="text-xs text-gray-500 mt-1">
                            {medida.vaos.janelas.quantidade && parseInt(medida.vaos.janelas.quantidade) > 1 && 
                              `${(parseFloat(medida.vaos.janelas.largura || '0') / parseInt(medida.vaos.janelas.quantidade)).toFixed(2)}m por janela`
                            }
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Altura (m)</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            className="input-field"
                            placeholder="1.05"
                            value={medida.vaos.janelas.altura}
                            onChange={(e) => atualizarMedida(medida.id, 'vaos', { 
                              janelas: { ...medida.vaos.janelas, altura: e.target.value } 
                            })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  onClick={() => setModalAberto({tipo: null, medidaId: null})}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => {
                    atualizarMedida(medida.id, 'vaos', { preenchido: true })
                    setModalAberto({tipo: null, medidaId: null})
                  }}
                  className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}