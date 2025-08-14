'use client'

import { useState, useEffect } from 'react'
import { 
  ArrowLeft, 
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
import { useKeyboardNavigation } from '@/lib/ui-standards/navigation/useKeyboardNavigation'
import { NavigationHelp } from '@/lib/ui-standards/navigation/components/NavigationHelp'
import { autoCompleteDimension } from '@/lib/ui-standards/formatting/formatters'
import PisoWallDrawing from '@/components/PisoWallDrawing'
import { 
  calcularMateriais as calcularMateriaisPisoWall,
  calcularMateriaisComAproveitamento,
  ESPECIFICACOES_PAINEIS,
  type MedidaPisoWall,
  type EspecificacaoPainel,
  type ResultadoCalculo
} from '@/lib/calculators/piso-wall'

interface Medida {
  id: string
  nome: string
  altura: string // comprimento (para manter compatibilidade com UI)
  largura: string
  quantidade: number  // ✨ Nova propriedade para multiplicação
  descricao: string
  area: number
  especificacoes: {
    codigoPainel: 'PW30' | 'PW40-2500' | 'PW40-3000'
    preenchido: boolean
  }
  espacamentoApoios: '1.25' | '0.625' // distância entre apoios em metros
}

export default function PisoWallPage() {
  const [modalidade, setModalidade] = useState<'abnt' | 'basica'>('basica')
  const [activeTab, setActiveTab] = useState<'medidas' | 'desenho' | 'materiais'>('medidas')
  const [searchTerm, setSearchTerm] = useState('')
  const [modalAberto, setModalAberto] = useState<{tipo: 'especificacoes' | null, medidaId: string | null}>({tipo: null, medidaId: null})
  const [especificacoesPadrao, setEspecificacoesPadrao] = useState<{
    codigoPainel: 'PW30' | 'PW40-2500' | 'PW40-3000'
  } | null>(null)
  const [resultadoCalculo, setResultadoCalculo] = useState<ResultadoCalculo | null>(null)
  
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
  // Estados para auto-preenchimento opcional (ativado pelo usuário)
  const [alturaFixaAtivada, setAlturaFixaAtivada] = useState<boolean>(false)
  const [ultimaAlturaUsada, setUltimaAlturaUsada] = useState<string>('')

  const [medidas, setMedidas] = useState<Medida[]>([
    {
      id: '1',
      nome: '',
      altura: '', // comprimento
      largura: '',
      quantidade: 1,  // ✨ Padrão: 1 ambiente
      descricao: '',
      area: 0,
      especificacoes: {
        codigoPainel: 'PW40-2500' as const, // Padrão: 40mm - 2,50m
        preenchido: false
      },
      vaos: {
        registros: {
          quantidade: '0',
          largura: '0.10',
          altura: '0.10'
        },
        soleiras: {
          quantidade: '0',
          largura: '0.80',
          altura: '0.05'
        },
        transicoes: {
          quantidade: '0',
          largura: '1.00',
          altura: '0.05'
        },
        preenchido: false
      },
      espacamentoApoios: '1.25'
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
          const novoInput = document.querySelector('[data-medida-id]:last-child input[type="text"]') as HTMLInputElement
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
      const medidasPisoWall: MedidaPisoWall[] = medidas
        .filter(medida => parseFloat(medida.altura.replace(',', '.')) > 0 && parseFloat(medida.largura.replace(',', '.')) > 0)
        .flatMap(medida => {
          const especificacao = ESPECIFICACOES_PAINEIS.find(e => e.codigo === medida.especificacoes.codigoPainel)!
          
          const medidaBase: MedidaPisoWall = {
            id: medida.id,
            largura: parseFloat(medida.largura.replace(',', '.')),
            comprimento: parseFloat(medida.altura.replace(',', '.')), // altura é comprimento na UI
            area: parseFloat(medida.altura.replace(',', '.')) * parseFloat(medida.largura.replace(',', '.')),
            especificacao
          }
          
          // Expandir para múltiplos ambientes se quantidade > 1
          return Array(medida.quantidade).fill(medidaBase).map((base, index) => ({
            ...base,
            id: `${medida.id}-${index + 1}`
          }))
        })
      
      if (medidasPisoWall.length === 0) {
        alert('Adicione pelo menos uma medida válida para calcular')
        return
      }
      
      // Calcular materiais com aproveitamento inteligente
      const resultado = calcularMateriaisComAproveitamento(medidasPisoWall)
      
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
      nome: '',
      altura: alturaFixaAtivada ? ultimaAlturaUsada : '', // comprimento
      largura: '', // Largura sempre vazia para novo ambiente
      quantidade: 1, // ✨ Padrão: 1 ambiente
      descricao: '',
      area: 0,
      especificacoes: especificacoesPadrao ? {
        codigoPainel: especificacoesPadrao.codigoPainel,
        preenchido: true // Já vem preenchida com o padrão
      } : {
        codigoPainel: 'PW40-2500' as const,
        preenchido: false
      },
      vaos: {
        registros: {
          quantidade: '0',
          largura: '0.10',
          altura: '0.10'
        },
        soleiras: {
          quantidade: '0',
          largura: '0.80',
          altura: '0.05'
        },
        transicoes: {
          quantidade: '0',
          largura: '1.00',
          altura: '0.05'
        },
        preenchido: false
      },
      espacamentoApoios: '1.25'
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
        } else {
          const updated = { ...medida, [campo]: valor }
          
          // Calcular área automaticamente (incluindo quantidade)
          if (campo === 'altura' || campo === 'largura' || campo === 'quantidade') {
            const altura = parseFloat((campo === 'altura' ? valor : updated.altura).replace(',', '.')) || 0
            const largura = parseFloat((campo === 'largura' ? valor : updated.largura).replace(',', '.')) || 0
            const quantidade = campo === 'quantidade' ? valor : updated.quantidade
            updated.area = altura * largura * quantidade
          }
          return updated
        }
      }
      return medida
    }))
  }

  const areaTotal = medidas.reduce((total, medida) => total + medida.area, 0)
  const totalAmbientes = medidas.reduce((total, medida) => total + medida.quantidade, 0)

  // Função para determinar a cor da flag de especificações
  const getCorFlagEspecificacoes = (medida: Medida) => {
    if (!medida.especificacoes.preenchido) {
      return 'bg-red-500 text-white' // Vermelha - não configurada ainda
    }

    if (!especificacoesPadrao) {
      return 'bg-green-500 text-white' // Verde - primeira a ser configurada (tem informações)
    }

    // Verificar se é igual ao padrão
    const igualPadrao = medida.especificacoes.codigoPainel === especificacoesPadrao.codigoPainel

    return igualPadrao 
      ? 'bg-green-500 text-white'  // Verde - tem informações (padrão)
      : 'bg-yellow-400 text-gray-800'   // Amarela - foi modificada/personalizada
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
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                  <Layers className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Piso Wall</h1>
                  <p className="text-sm text-gray-600">Chapas de madeira reconstituída para revestimento</p>
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
                <Layers className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <div className="text-sm text-gray-600">Ambientes</div>
                <div className="text-2xl font-bold text-gray-900">{totalAmbientes}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {medidas.length} medida{medidas.length !== 1 ? 's' : ''}
                  <br />
                  <kbd className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">Tab</kbd> nova • <kbd className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">Enter</kbd> calcular
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
                  <div className="flex items-center space-x-2 pb-4">
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
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-gray-600">{displayNumber}</span>
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
                                    ? "🔴 Tipo de Painel - Não configurado"
                                    : !especificacoesPadrao 
                                      ? "🟢 Tipo de Painel - Configurado"
                                      : medida.especificacoes.codigoPainel === especificacoesPadrao.codigoPainel
                                        ? "🟢 Tipo de Painel - Padrão do projeto"
                                        : "🟡 Tipo de Painel - Modificado/Personalizado"
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
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-xs text-gray-600">Comprimento (m)</label>
                              <div className="flex items-center space-x-1">
                                <span className="text-xs text-gray-500">×</span>
                                <input
                                  type="number"
                                  min="1"
                                  max="99"
                                  value={medida.quantidade === 1 ? '' : medida.quantidade}
                                  onChange={(e) => atualizarMedida(medida.id, 'quantidade', parseInt(e.target.value) || 1)}
                                  className="w-14 h-5 text-xs border border-gray-300 rounded pl-1 pr-1 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                                  placeholder=""
                                  title="Quantidade de ambientes iguais (deixe vazio para 1 ambiente)"
                                  tabIndex={-1}
                                />
                              </div>
                            </div>
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
                            <div className="flex items-center justify-between mb-1">
                              <label className="block text-xs text-gray-600">Largura (m)</label>
                              <div className="flex items-center space-x-1">
                                <input
                                  type="checkbox"
                                  checked={alturaFixaAtivada}
                                  onChange={(e) => setAlturaFixaAtivada(e.target.checked)}
                                  className="w-3 h-3 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                                  title="Usar última largura inserida nos próximos ambientes"
                                  tabIndex={-1}
                                />
                                <span className="text-xs text-gray-500" title="Usar última largura inserida nos próximos ambientes">fixar</span>
                              </div>
                            </div>
                            <input
                              type="text"
                              value={medida.altura}
                              onChange={(e) => {
                                atualizarMedida(medida.id, 'altura', e.target.value)
                                // Salvar largura para próximos ambientes se checkbox ativado
                                if (alturaFixaAtivada && e.target.value.trim()) {
                                  setUltimaAlturaUsada(e.target.value)
                                }
                              }}
                              onBlur={(e) => {
                                const formatted = handleDimensionBlur('altura', e.target.value)
                                atualizarMedida(medida.id, 'altura', formatted)
                                // Salvar largura formatada para próximos ambientes se checkbox ativado
                                if (formatted.trim()) {
                                  setUltimaAlturaUsada(formatted)
                                }
                              }}
                              onKeyDown={handleKeyDown}
                              className="input-field text-sm"
                              placeholder="3,20"
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
                    
                  </div>
                )}

                {activeTab === 'desenho' && (
                  <div className="space-y-4">
                    {medidas.filter(m => m.largura && m.altura).length === 0 ? (
                      <div className="h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <div className="text-gray-600">Adicione medidas para ver o desenho técnico</div>
                          <div className="text-sm text-gray-500">Mostra amarração das chapas Wall com apoios</div>
                          <div className="text-xs text-gray-500 mt-2">
                            Total: {areaTotal.toFixed(2)} m² ({medidas.length} medida{medidas.length !== 1 ? 's' : ''})
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {medidas
                          .filter(medida => parseFloat(medida.largura.replace(',', '.')) > 0 && parseFloat(medida.altura.replace(',', '.')) > 0)
                          .slice().reverse()
                          .map((medida, reverseIndex) => {
                            const especificacao = ESPECIFICACOES_PAINEIS.find(e => e.codigo === medida.especificacoes.codigoPainel)!
                            const displayNumber = medidas.filter(m => parseFloat(m.largura.replace(',', '.')) > 0 && parseFloat(m.altura.replace(',', '.')) > 0).length - reverseIndex
                            
                            const medidaPisoWall: MedidaPisoWall = {
                              id: medida.id,
                              largura: parseFloat(medida.largura.replace(',', '.')),
                              comprimento: parseFloat(medida.altura.replace(',', '.')),
                              area: parseFloat(medida.altura.replace(',', '.')) * parseFloat(medida.largura.replace(',', '.')),
                              especificacao
                            }
                            
                            return (
                              <PisoWallDrawing
                                key={medida.id}
                                medidas={[medidaPisoWall]}
                                especificacao={especificacao}
                                numeroAmbiente={displayNumber}
                                showDimensions={true}
                                apoios={{
                                  distancia: parseFloat(medida.espacamentoApoios),
                                  mostrar: true
                                }}
                              />
                            )
                          })
                        }
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
                        <div className="text-sm mt-1">Inclui chapas wall, parafusos e acessórios de acabamento</div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Resumo do Cálculo */}
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-orange-900">Resumo do Cálculo</h3>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="text-center">
                              <div className="text-lg font-bold text-orange-900">{resultadoCalculo.areaTotal.toFixed(2)}</div>
                              <div className="text-orange-700">m² líquidos</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-orange-900">{resultadoCalculo.resumo.totalChapas}</div>
                              <div className="text-orange-700">chapas</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-orange-900">{resultadoCalculo.resumo.totalParafusos}</div>
                              <div className="text-orange-700">parafusos</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-orange-900">{resultadoCalculo.resumo.totalAcessorios || 0}</div>
                              <div className="text-orange-700">acessórios</div>
                            </div>
                          </div>
                        </div>

                        {/* Relatório de Aproveitamento */}
                        {(resultadoCalculo as any).relatorioAproveitamento && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-semibold text-green-900">Relatório de Aproveitamento</h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div className="text-center">
                                <div className="text-lg font-bold text-green-900">{(resultadoCalculo as any).relatorioAproveitamento.totalMaterialNovo}</div>
                                <div className="text-green-700">painéis novos</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-green-900">{(resultadoCalculo as any).relatorioAproveitamento.totalSobrasGeradas}</div>
                                <div className="text-green-700">sobras geradas</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-green-900">{(resultadoCalculo as any).relatorioAproveitamento.totalSobrasAproveitadas}</div>
                                <div className="text-green-700">sobras aproveitadas</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-green-900">{(resultadoCalculo as any).relatorioAproveitamento.economiaPercentual.toFixed(1)}%</div>
                                <div className="text-green-700">economia</div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Detalhamento por Ambiente */}
                        {(resultadoCalculo as any).planosCorte && (resultadoCalculo as any).planosCorte.length > 0 && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="bg-blue-100 px-4 py-3 border-b border-blue-200 rounded-t-lg">
                              <h3 className="font-semibold text-blue-900">Análise por Ambiente</h3>
                            </div>
                            <div className="p-4 space-y-4">
                              {(resultadoCalculo as any).planosCorte.map((plano: any, index: number) => (
                                <div key={index} className="bg-white border border-blue-200 rounded p-3">
                                  <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-medium text-blue-900">{plano.ambiente}</h4>
                                    <span className="text-sm text-blue-600">
                                      {plano.medidaOriginal.largura.toFixed(2).replace('.', ',')}m × {plano.medidaOriginal.comprimento.toFixed(2).replace('.', ',')}m
                                    </span>
                                  </div>
                                  
                                  <div className="grid grid-cols-3 gap-4 text-xs">
                                    <div>
                                      <div className="font-medium text-gray-700">Materiais Novos</div>
                                      {plano.materiaisNovos.map((mat: any, i: number) => (
                                        <div key={i} className="text-gray-600">
                                          {mat.quantidade}× {mat.material.descricao}
                                        </div>
                                      ))}
                                    </div>
                                    
                                    <div>
                                      <div className="font-medium text-gray-700">Sobras Aproveitadas</div>
                                      {plano.recortesUsados.length > 0 ? (
                                        plano.recortesUsados.map((sobra: any, i: number) => (
                                          <div key={i} className="text-green-600">
                                            {sobra.largura.toFixed(2).replace('.', ',')}×{sobra.comprimento.toFixed(2).replace('.', ',')}m
                                            <span className="text-xs"> (de {sobra.origem.ambiente})</span>
                                          </div>
                                        ))
                                      ) : (
                                        <div className="text-gray-400">Nenhuma</div>
                                      )}
                                    </div>
                                    
                                    <div>
                                      <div className="font-medium text-gray-700">Sobras Geradas</div>
                                      {plano.sobrasGeradas.length > 0 ? (
                                        plano.sobrasGeradas.map((sobra: any, i: number) => (
                                          <div key={i} className="text-orange-600">
                                            {sobra.largura.toFixed(2).replace('.', ',')}×{sobra.comprimento.toFixed(2).replace('.', ',')}m
                                            {sobra.usado && <span className="text-xs text-green-500"> ✓</span>}
                                          </div>
                                        ))
                                      ) : (
                                        <div className="text-gray-400">Nenhuma</div>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {plano.aproveitamentoInterno > 0 && (
                                    <div className="mt-2 pt-2 border-t border-blue-200">
                                      <span className="text-xs text-blue-600">
                                        Aproveitamento interno: {plano.aproveitamentoInterno.toFixed(1)}%
                                      </span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Painéis */}
                        <div className="bg-white border border-gray-200 rounded-lg">
                          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
                            <h3 className="font-semibold text-gray-900 flex items-center">
                              <Package className="h-5 w-5 mr-2 text-gray-600" />
                              Painéis Wall
                            </h3>
                          </div>
                          <div className="p-4">
                            <div className="space-y-3">
                              {resultadoCalculo.materiais.paineis.map((item: any, index: number) => (
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


                        {/* Parafusos */}
                        <div className="bg-white border border-gray-200 rounded-lg">
                          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
                            <h3 className="font-semibold text-gray-900 flex items-center">
                              <Package className="h-5 w-5 mr-2 text-gray-600" />
                              Parafusos
                            </h3>
                          </div>
                          <div className="p-4">
                            <div className="space-y-3">
                              {resultadoCalculo.materiais.fixacao.map((item: any, index: number) => (
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
                  <h3 className="text-lg font-semibold">Tipo de Painel Wall</h3>
                  {medida.especificacoes.preenchido && especificacoesPadrao && (
                    <div className="text-sm text-gray-600 mt-1">
                      {medida.especificacoes.codigoPainel === especificacoesPadrao.codigoPainel
                        ? "🟢 Usando painel padrão do projeto"
                        : "🟡 Painel diferente do padrão"}
                    </div>
                  )}
                  {!medida.especificacoes.preenchido && (
                    <div className="text-sm text-gray-600 mt-1">
                      🔴 Tipo de painel não configurado
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
                  medida.especificacoes.codigoPainel !== especificacoesPadrao.codigoPainel
                ) && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-green-800">
                        Aplicar painel padrão do projeto?
                      </div>
                      <button
                        onClick={() => {
                          atualizarMedida(medida.id, 'especificacoes', {
                            codigoPainel: especificacoesPadrao.codigoPainel
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
                  <label className="block text-sm text-gray-600 mb-1">Tipo de Painel</label>
                  <select 
                    className="input-field"
                    value={medida.especificacoes.codigoPainel}
                    onChange={(e) => atualizarMedida(medida.id, 'especificacoes', { codigoPainel: e.target.value })}
                  >
                    {ESPECIFICACOES_PAINEIS.map(painel => (
                      <option key={painel.codigo} value={painel.codigo}>
                        {painel.descricao}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1">Espaçamento entre Apoios</label>
                  <select 
                    className="input-field"
                    value={medida.espacamentoApoios}
                    onChange={(e) => atualizarMedida(medida.id, 'espacamentoApoios', e.target.value as '1.25' | '0.625')}
                  >
                    <option value="1.25">1,25m (Padrão)</option>
                    <option value="0.625">0,625m (Alta Densidade)</option>
                  </select>
                  <div className="text-xs text-gray-500 mt-1">
                    Apoios fixos nas bordas (1cm para dentro) + apoios intermediários conforme espaçamento. Intermediários têm 7cm cada.
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
                    // Salvar as especificações
                    atualizarMedida(medida.id, 'especificacoes', { preenchido: true })
                    
                    // Se é a primeira especificação configurada, definir como padrão
                    if (!especificacoesPadrao) {
                      setEspecificacoesPadrao({
                        codigoPainel: medida.especificacoes.codigoPainel
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
    </div>
  )
}
