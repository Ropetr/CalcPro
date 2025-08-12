'use client'

import { useState, useEffect } from 'react'
import { 
  ArrowLeft, 
  Ruler, 
  Calculator, 
  FileText, 
  Download,
  Settings,
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
import { useKeyboardNavigation } from '@/lib/ui-standards/navigation/useKeyboardNavigation'
import { NavigationHelp } from '@/lib/ui-standards/navigation/components/NavigationHelp'
import { autoCompleteDimension } from '@/lib/ui-standards/formatting/formatters'

interface Medida {
  id: string
  nome: string
  altura: string
  largura: string
  descricao: string
  area: number
  especificacoes: {
    tipoVinil: 'SPC' | 'LVT' | 'WPC'
    instalacao: 'click' | 'colado'
    cola: 'poliuretano' | 'acrilica'
    rodape: 'mdf' | 'pvc'
    preenchido: boolean
  }
  vaos: {
    registros: {
      quantidade: string
      largura: string
      altura: string
    }
    ralos: {
      quantidade: string
      largura: string
      altura: string
    }
    transicoes: {
      quantidade: string
      largura: string
      altura: string
    }
    preenchido: boolean
  }
}

export default function PisoVinicilicoPage() {
  const [modalidade, setModalidade] = useState<'abnt' | 'basica'>('basica')
  const [activeTab, setActiveTab] = useState<'medidas' | 'desenho' | 'materiais'>('medidas')
  const [searchTerm, setSearchTerm] = useState('')
  const [modalAberto, setModalAberto] = useState<{tipo: 'especificacoes' | 'vaos' | null, medidaId: string | null}>({tipo: null, medidaId: null})
  const [especificacoesPadrao, setEspecificacoesPadrao] = useState<{
    tipoVinil: 'SPC' | 'LVT' | 'WPC'
    instalacao: 'click' | 'colado'
    cola: 'poliuretano' | 'acrilica'
    rodape: 'mdf' | 'pvc'
  } | null>(null)
  const [resultadoCalculo, setResultadoCalculo] = useState<any | null>(null)
  
  // Sistema de navegação por teclado
  const navigation = useKeyboardNavigation()
  const { 
    handleKeyDown,
    addItem,
    calculate 
  } = navigation

  // Função para formatação automática
  const handleDimensionBlur = (field: string, value: string) => {
    const formatted = autoCompleteDimension(value)
    return formatted
  }
  const [medidas, setMedidas] = useState<Medida[]>([
    {
      id: '1',
      nome: 'Ambiente 01',
      altura: '',
      largura: '',
      descricao: '',
      area: 0,
      especificacoes: {
        tipoVinil: 'SPC' as const,
        instalacao: 'click' as const,
        cola: 'poliuretano' as const,
        rodape: 'mdf' as const,
        preenchido: false
      },
      vaos: {
        registros: {
          quantidade: '0',
          largura: '0.10',
          altura: '0.10'
        },
        ralos: {
          quantidade: '0',
          largura: '0.10',
          altura: '0.10'
        },
        transicoes: {
          quantidade: '0',
          largura: '1.00',
          altura: '0.05'
        },
        preenchido: false
      }
    }
  ])

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
          const novoInput = document.querySelector('[data-medida-id]:first-child input[type="text"]') as HTMLInputElement
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
      // Simular cálculo de materiais para piso vinílico
      const medidasValidas = medidas.filter(medida => 
        parseFloat(medida.altura.replace(',', '.')) > 0 && 
        parseFloat(medida.largura.replace(',', '.')) > 0
      )
      
      if (medidasValidas.length === 0) {
        alert('Adicione pelo menos uma medida válida para calcular')
        return
      }
      
      // Resultado fictício para demonstrar a estrutura
      const resultado = {
        areaTotal: medidasValidas.reduce((total, medida) => 
          total + (parseFloat(medida.altura.replace(',', '.')) * parseFloat(medida.largura.replace(',', '.'))), 0
        ),
        resumo: {
          totalPiso: Math.ceil(medidasValidas.length * 1.1),
          totalCola: Math.ceil(medidasValidas.length * 0.5),
          totalRodape: medidasValidas.reduce((total, medida) => 
            total + ((parseFloat(medida.altura.replace(',', '.')) + parseFloat(medida.largura.replace(',', '.'))) * 2), 0
          )
        },
        materiais: {
          pisos: [
            {
              item: "Piso Vinílico SPC",
              descricao: "Piso vinílico rígido com núcleo de pedra",
              quantidade: Math.ceil(medidasValidas.reduce((total, medida) => 
                total + (parseFloat(medida.altura.replace(',', '.')) * parseFloat(medida.largura.replace(',', '.'))), 0
              ) * 1.1),
              unidade: "m²",
              observacoes: "Inclui 10% de perda"
            }
          ],
          colas: [
            {
              item: "Cola Poliuretano",
              descricao: "Adesivo de contato para piso vinílico",
              quantidade: Math.ceil(medidasValidas.reduce((total, medida) => 
                total + (parseFloat(medida.altura.replace(',', '.')) * parseFloat(medida.largura.replace(',', '.'))), 0
              ) / 25),
              unidade: "galão",
              observacoes: "Rendimento: 25m²/galão"
            }
          ],
          acessorios: [
            {
              item: "Rodapé MDF",
              descricao: "Rodapé em MDF com 7cm de altura",
              quantidade: Math.ceil(medidasValidas.reduce((total, medida) => 
                total + ((parseFloat(medida.altura.replace(',', '.')) + parseFloat(medida.largura.replace(',', '.'))) * 2), 0
              )),
              unidade: "m",
              observacoes: "Perímetro dos ambientes"
            }
          ]
        }
      }
      
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
      nome: `Ambiente ${novaId.padStart(2, '0')}`,
      altura: '',
      largura: '',
      descricao: '',
      area: 0,
      especificacoes: especificacoesPadrao ? {
        tipoVinil: especificacoesPadrao.tipoVinil,
        instalacao: especificacoesPadrao.instalacao,
        cola: especificacoesPadrao.cola,
        rodape: especificacoesPadrao.rodape,
        preenchido: true // Já vem preenchida com o padrão
      } : {
        tipoVinil: 'SPC' as const,
        instalacao: 'click' as const,
        cola: 'poliuretano' as const,
        rodape: 'mdf' as const,
        preenchido: false
      },
      vaos: {
        registros: {
          quantidade: '0',
          largura: '0.10',
          altura: '0.10'
        },
        ralos: {
          quantidade: '0',
          largura: '0.10',
          altura: '0.10'
        },
        transicoes: {
          quantidade: '0',
          largura: '1.00',
          altura: '0.05'
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
            const altura = parseFloat((campo === 'altura' ? valor : updated.altura).replace(',', '.')) || 0
            const largura = parseFloat((campo === 'largura' ? valor : updated.largura).replace(',', '.')) || 0
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
      medida.especificacoes.tipoVinil === especificacoesPadrao.tipoVinil &&
      medida.especificacoes.instalacao === especificacoesPadrao.instalacao &&
      medida.especificacoes.cola === especificacoesPadrao.cola &&
      medida.especificacoes.rodape === especificacoesPadrao.rodape

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
    const temInformacoes = parseInt(medida.vaos.registros.quantidade) > 0 || 
                          parseInt(medida.vaos.ralos.quantidade) > 0 ||
                          parseInt(medida.vaos.transicoes.quantidade) > 0

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
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Ruler className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Piso Vinílico</h1>
                  <p className="text-sm text-gray-600">SPC, LVT e WPC com instalação click ou colado</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <NavigationHelp navigation={navigation} />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <Ruler className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <div className="text-sm text-gray-600">Área Total</div>
                <div className="text-2xl font-bold text-gray-900">
                  {areaTotal.toFixed(2)} m²
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {medidas.length} ambiente{medidas.length !== 1 ? 's' : ''}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <Package className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <div className="text-sm text-gray-600">Ambientes</div>
                <div className="text-2xl font-bold text-gray-900">{medidas.length}</div>
                <div className="text-xs text-gray-500 mt-1">
                  <kbd className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">Tab</kbd> novo ambiente
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
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-purple-600">{displayNumber}</span>
                                </div>
                            <input
                              type="text"
                              value={medida.nome}
                              onChange={(e) => atualizarMedida(medida.id, 'nome', e.target.value)}
                              className="text-sm font-medium bg-transparent border-none focus:ring-0 p-0"
                              placeholder="Nome do ambiente"
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
                                      : medida.especificacoes.tipoVinil === especificacoesPadrao.tipoVinil &&
                                        medida.especificacoes.instalacao === especificacoesPadrao.instalacao &&
                                        medida.especificacoes.cola === especificacoesPadrao.cola &&
                                        medida.especificacoes.rodape === especificacoesPadrao.rodape
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
                                    : parseInt(medida.vaos.registros.quantidade) > 0 || parseInt(medida.vaos.ralos.quantidade) > 0 || parseInt(medida.vaos.transicoes.quantidade) > 0
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
                              type="text"
                              value={medida.largura}
                              onChange={(e) => atualizarMedida(medida.id, 'largura', e.target.value)}
                              onBlur={(e) => {
                                const formatted = handleDimensionBlur('largura', e.target.value)
                                atualizarMedida(medida.id, 'largura', formatted)
                              }}
                              onKeyDown={handleKeyDown}
                              className="input-field text-sm"
                              placeholder="3,50"
                              data-nav-index={0}
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Altura (m)</label>
                            <input
                              type="text"
                              value={medida.altura}
                              onChange={(e) => atualizarMedida(medida.id, 'altura', e.target.value)}
                              onBlur={(e) => {
                                const formatted = handleDimensionBlur('altura', e.target.value)
                                atualizarMedida(medida.id, 'altura', formatted)
                              }}
                              onKeyDown={handleKeyDown}
                              className="input-field text-sm"
                              placeholder="2,70"
                              data-nav-index={1}
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Descrição</label>
                            <input
                              type="text"
                              value={medida.descricao}
                              onChange={(e) => atualizarMedida(medida.id, 'descricao', e.target.value)}
                              className="input-field text-sm"
                              placeholder="Ex: Sala, Cozinha..."
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
                          Total de {medidas.length} ambiente{medidas.length !== 1 ? 's' : ''}
                        </div>
                        <div className="text-lg font-semibold text-gray-900">
                          {areaTotal.toFixed(2)} m²
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Pressione <kbd className="px-1 py-0.5 bg-white text-gray-600 text-xs rounded">Tab</kbd> para novo ambiente ou <kbd className="px-1 py-0.5 bg-white text-gray-600 text-xs rounded">Enter</kbd> para calcular
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'desenho' && (
                  <div className="space-y-4">
                    {!resultadoCalculo ? (
                      <div className="h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Ruler className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <div className="text-gray-600">Desenho técnico será gerado após o cálculo</div>
                          <div className="text-sm text-gray-500">Inclui plano de instalação e sentido das réguas</div>
                          <div className="text-xs text-gray-500 mt-2">
                            Total: {areaTotal.toFixed(2)} m² ({medidas.length} ambiente{medidas.length !== 1 ? 's' : ''})
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="h-64 bg-gray-50 border border-gray-300 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <Ruler className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                            <div className="text-gray-600">Plano de instalação do piso vinílico</div>
                            <div className="text-sm text-gray-500">Sentido das réguas e pontos de início</div>
                          </div>
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
                        <div className="text-sm mt-1">Inclui piso vinílico, cola, rodapé e acessórios</div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Resumo do Cálculo */}
                        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-purple-900">Resumo do Cálculo</h3>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div className="text-center">
                              <div className="text-lg font-bold text-purple-900">{resultadoCalculo.areaTotal.toFixed(2)}</div>
                              <div className="text-purple-700">m² líquidos</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-purple-900">{resultadoCalculo.resumo.totalPiso}</div>
                              <div className="text-purple-700">m² piso</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-purple-900">{resultadoCalculo.resumo.totalRodape.toFixed(2)}</div>
                              <div className="text-purple-700">m rodapé</div>
                            </div>
                          </div>
                        </div>

                        {/* Pisos */}
                        <div className="bg-white border border-gray-200 rounded-lg">
                          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
                            <h3 className="font-semibold text-gray-900 flex items-center">
                              <Package className="h-5 w-5 mr-2 text-gray-600" />
                              Piso Vinílico
                            </h3>
                          </div>
                          <div className="p-4">
                            <div className="space-y-3">
                              {resultadoCalculo.materiais.pisos.map((item: any, index: number) => (
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

                        {/* Colas */}
                        <div className="bg-white border border-gray-200 rounded-lg">
                          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
                            <h3 className="font-semibold text-gray-900 flex items-center">
                              <Settings className="h-5 w-5 mr-2 text-gray-600" />
                              Adesivos e Colas
                            </h3>
                          </div>
                          <div className="p-4">
                            <div className="space-y-3">
                              {resultadoCalculo.materiais.colas.map((item: any, index: number) => (
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

                        {/* Acessórios */}
                        <div className="bg-white border border-gray-200 rounded-lg">
                          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
                            <h3 className="font-semibold text-gray-900 flex items-center">
                              <Ruler className="h-5 w-5 mr-2 text-gray-600" />
                              Rodapés e Acessórios
                            </h3>
                          </div>
                          <div className="p-4">
                            <div className="space-y-3">
                              {resultadoCalculo.materiais.acessorios.map((item: any, index: number) => (
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

      {/* Botão Flutuante para Adicionar Medida */}
      {activeTab === 'medidas' && (
        <button
          onClick={adicionarMedida}
          className="fixed bottom-8 right-8 w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
          title="Adicionar novo ambiente"
        >
          <Plus className="h-6 w-6" />
        </button>
      )}

      {/* Modal para Especificações */}
      {modalAberto.tipo === 'especificacoes' && modalAberto.medidaId && (() => {
        const medida = medidas.find(m => m.id === modalAberto.medidaId)
        if (!medida) return null
        
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-md">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Especificações do Piso</h3>
                  {medida.especificacoes.preenchido && especificacoesPadrao && (
                    <div className="text-sm text-gray-600 mt-1">
                      {medida.especificacoes.tipoVinil === especificacoesPadrao.tipoVinil &&
                       medida.especificacoes.instalacao === especificacoesPadrao.instalacao &&
                       medida.especificacoes.cola === especificacoesPadrao.cola &&
                       medida.especificacoes.rodape === especificacoesPadrao.rodape
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
                  medida.especificacoes.tipoVinil !== especificacoesPadrao.tipoVinil ||
                  medida.especificacoes.instalacao !== especificacoesPadrao.instalacao ||
                  medida.especificacoes.cola !== especificacoesPadrao.cola ||
                  medida.especificacoes.rodape !== especificacoesPadrao.rodape
                ) && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-green-800">
                        Aplicar especificações padrão do projeto?
                      </div>
                      <button
                        onClick={() => {
                          atualizarMedida(medida.id, 'especificacoes', {
                            tipoVinil: especificacoesPadrao.tipoVinil,
                            instalacao: especificacoesPadrao.instalacao,
                            cola: especificacoesPadrao.cola,
                            rodape: especificacoesPadrao.rodape
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
                  <label className="block text-sm text-gray-600 mb-1">Tipo de Vinil</label>
                  <select 
                    className="input-field"
                    value={medida.especificacoes.tipoVinil}
                    onChange={(e) => atualizarMedida(medida.id, 'especificacoes', { tipoVinil: e.target.value })}
                  >
                    <option value="SPC">SPC - Stone Plastic Composite</option>
                    <option value="LVT">LVT - Luxury Vinyl Tile</option>
                    <option value="WPC">WPC - Wood Plastic Composite</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Tipo de Instalação</label>
                  <select 
                    className="input-field"
                    value={medida.especificacoes.instalacao}
                    onChange={(e) => atualizarMedida(medida.id, 'especificacoes', { instalacao: e.target.value })}
                  >
                    <option value="click">Click - Encaixe</option>
                    <option value="colado">Colado - Adesivo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Tipo de Cola</label>
                  <select 
                    className="input-field"
                    value={medida.especificacoes.cola}
                    onChange={(e) => atualizarMedida(medida.id, 'especificacoes', { cola: e.target.value })}
                  >
                    <option value="poliuretano">Poliuretano - Premium</option>
                    <option value="acrilica">Acrílica - Padrão</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Tipo de Rodapé</label>
                  <select 
                    className="input-field"
                    value={medida.especificacoes.rodape}
                    onChange={(e) => atualizarMedida(medida.id, 'especificacoes', { rodape: e.target.value })}
                  >
                    <option value="mdf">MDF - Padrão</option>
                    <option value="pvc">PVC - Resistente</option>
                  </select>
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
                        tipoVinil: medida.especificacoes.tipoVinil,
                        instalacao: medida.especificacoes.instalacao,
                        cola: medida.especificacoes.cola,
                        rodape: medida.especificacoes.rodape
                      })
                    }
                    
                    setModalAberto({tipo: null, medidaId: null})
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
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
                      {parseInt(medida.vaos.registros.quantidade) > 0 || parseInt(medida.vaos.ralos.quantidade) > 0 || parseInt(medida.vaos.transicoes.quantidade) > 0
                        ? "🟢 Ambiente com vãos configurados"
                        : "🔴 Ambiente sem dados de vãos"}
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
                
                {/* Registros */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Registros</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Quantidade</label>
                      <input
                        type="number"
                        min="0"
                        className="input-field"
                        placeholder="0"
                        value={medida.vaos.registros.quantidade}
                        onChange={(e) => atualizarMedida(medida.id, 'vaos', { 
                          registros: { ...medida.vaos.registros, quantidade: e.target.value } 
                        })}
                      />
                    </div>
                    
                    {parseInt(medida.vaos.registros.quantidade) > 0 && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Largura (m)</label>
                          <input
                            type="text"
                            className="input-field"
                            placeholder="0.10"
                            value={medida.vaos.registros.largura}
                            onChange={(e) => atualizarMedida(medida.id, 'vaos', { 
                              registros: { ...medida.vaos.registros, largura: e.target.value } 
                            })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Altura (m)</label>
                          <input
                            type="text"
                            className="input-field"
                            placeholder="0.10"
                            value={medida.vaos.registros.altura}
                            onChange={(e) => atualizarMedida(medida.id, 'vaos', { 
                              registros: { ...medida.vaos.registros, altura: e.target.value } 
                            })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ralos */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Ralos</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Quantidade</label>
                      <input
                        type="number"
                        min="0"
                        className="input-field"
                        placeholder="0"
                        value={medida.vaos.ralos.quantidade}
                        onChange={(e) => atualizarMedida(medida.id, 'vaos', { 
                          ralos: { ...medida.vaos.ralos, quantidade: e.target.value } 
                        })}
                      />
                    </div>
                    
                    {parseInt(medida.vaos.ralos.quantidade) > 0 && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Largura (m)</label>
                          <input
                            type="text"
                            className="input-field"
                            placeholder="0.10"
                            value={medida.vaos.ralos.largura}
                            onChange={(e) => atualizarMedida(medida.id, 'vaos', { 
                              ralos: { ...medida.vaos.ralos, largura: e.target.value } 
                            })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Altura (m)</label>
                          <input
                            type="text"
                            className="input-field"
                            placeholder="0.10"
                            value={medida.vaos.ralos.altura}
                            onChange={(e) => atualizarMedida(medida.id, 'vaos', { 
                              ralos: { ...medida.vaos.ralos, altura: e.target.value } 
                            })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Transições */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Transições</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Quantidade</label>
                      <input
                        type="number"
                        min="0"
                        className="input-field"
                        placeholder="0"
                        value={medida.vaos.transicoes.quantidade}
                        onChange={(e) => atualizarMedida(medida.id, 'vaos', { 
                          transicoes: { ...medida.vaos.transicoes, quantidade: e.target.value } 
                        })}
                      />
                    </div>
                    
                    {parseInt(medida.vaos.transicoes.quantidade) > 0 && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Largura (m)</label>
                          <input
                            type="text"
                            className="input-field"
                            placeholder="1.00"
                            value={medida.vaos.transicoes.largura}
                            onChange={(e) => atualizarMedida(medida.id, 'vaos', { 
                              transicoes: { ...medida.vaos.transicoes, largura: e.target.value } 
                            })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Altura (m)</label>
                          <input
                            type="text"
                            className="input-field"
                            placeholder="0.05"
                            value={medida.vaos.transicoes.altura}
                            onChange={(e) => atualizarMedida(medida.id, 'vaos', { 
                              transicoes: { ...medida.vaos.transicoes, altura: e.target.value } 
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
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
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