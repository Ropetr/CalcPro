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
import { useKeyboardNavigation } from '@/lib/ui-standards/navigation/useKeyboardNavigation'
import { NavigationHelp } from '@/lib/ui-standards/navigation/components/NavigationHelp'
import { autoCompleteDimension } from '@/lib/ui-standards/formatting/formatters'

interface Medida {
  id: string
  nome: string
  altura: string
  largura: string
  quantidade: number  // ✨ Nova propriedade para multiplicação
  descricao: string
  area: number
  especificacoes: {
    tipoChapa: 'standard' | 'ru' | 'rf'
    tipoMontante: 'f530' | 'f550'
    espacamento: '400' | '600'
    tratamentoAcustico: boolean
    preenchido: boolean
  }
  vaos: {
    luminárias: {
      quantidade: string
      largura: string
      altura: string
    }
    sprinklers: {
      quantidade: string
      largura: string
      altura: string
    }
    difusores: {
      quantidade: string
      largura: string
      altura: string
    }
    preenchido: boolean
  }
}

export default function ForroDrywallPage() {
  const [modalidade, setModalidade] = useState<'abnt' | 'basica'>('basica')
  const [activeTab, setActiveTab] = useState<'medidas' | 'desenho' | 'materiais'>('medidas')
  const [searchTerm, setSearchTerm] = useState('')
  const [modalAberto, setModalAberto] = useState<{tipo: 'especificacoes' | 'vaos' | null, medidaId: string | null}>({tipo: null, medidaId: null})
  const [especificacoesPadrao, setEspecificacoesPadrao] = useState<{
    tipoChapa: 'standard' | 'ru' | 'rf'
    tipoMontante: 'f530' | 'f550'
    espacamento: '400' | '600'
    tratamentoAcustico: boolean
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

  // Estados para auto-preenchimento opcional (ativado pelo usuário)
  const [alturaFixaAtivada, setAlturaFixaAtivada] = useState<boolean>(false)
  const [ultimaAlturaUsada, setUltimaAlturaUsada] = useState<string>('')

  const [medidas, setMedidas] = useState<Medida[]>([
    {
      id: '1',
      nome: '',
      altura: '',
      largura: '',
      quantidade: 1,  // ✨ Padrão: 1 forro
      descricao: '',
      area: 0,
      especificacoes: {
        tipoChapa: 'standard' as const,
        tipoMontante: 'f530' as const,
        espacamento: '400' as const,
        tratamentoAcustico: false,
        preenchido: false
      },
      vaos: {
        luminárias: {
          quantidade: '0',
          largura: '0.20',
          altura: '0.20'
        },
        sprinklers: {
          quantidade: '0',
          largura: '0.15',
          altura: '0.15'
        },
        difusores: {
          quantidade: '0',
          largura: '0.60',
          altura: '0.60'
        },
        preenchido: false
      }
    }
  ])
  
  // Configurações gerais do projeto
  const [espessura, setEspessura] = useState('12.5')

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
          const novoInput = document.querySelector('[data-medida-id]:last-child input[data-nav-index="0"]') as HTMLInputElement
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
      // Simular cálculo de materiais para forro drywall
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
          totalChapas: Math.ceil(medidasValidas.reduce((total, medida) => 
            total + (parseFloat(medida.altura.replace(',', '.')) * parseFloat(medida.largura.replace(',', '.'))) / 3.0, 0
          )),
          totalPerfis: Math.ceil(medidasValidas.length * 3.5),
          totalAcessorios: medidasValidas.reduce((total, medida) => 
            total + parseInt(medida.vaos.luminárias.quantidade) + parseInt(medida.vaos.sprinklers.quantidade) + parseInt(medida.vaos.difusores.quantidade), 0
          )
        },
        materiais: {
          chapas: [
            {
              item: `Chapa Drywall ${espessura}mm`,
              descricao: "Chapa de gesso para forro suspenso",
              quantidade: Math.ceil(medidasValidas.reduce((total, medida) => 
                total + (parseFloat(medida.altura.replace(',', '.')) * parseFloat(medida.largura.replace(',', '.'))) / 3.0, 0
              )),
              unidade: "un",
              observacoes: "Placas 1,20 x 2,50m"
            }
          ],
          perfis: [
            {
              item: "Perfil F530 (Guia)",
              descricao: "Perfil guia para fixação perimetral",
              quantidade: Math.ceil(medidasValidas.length * 2.0),
              unidade: "m",
              observacoes: "Barras de 3,00m"
            },
            {
              item: "Perfil F530 (Montante)",
              descricao: "Perfil montante estrutural",
              quantidade: Math.ceil(medidasValidas.length * 1.5),
              unidade: "m",
              observacoes: "Espaçamento 400mm"
            }
          ],
          acessorios: [
            {
              item: "Pendural",
              descricao: "Pendural regulável para suspensão",
              quantidade: Math.ceil(medidasValidas.reduce((total, medida) => 
                total + (parseFloat(medida.altura.replace(',', '.')) * parseFloat(medida.largura.replace(',', '.'))) / 1.0, 0
              )),
              unidade: "un",
              observacoes: "Por m²"
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
      nome: '',
      altura: alturaFixaAtivada ? ultimaAlturaUsada : '', // ✨ Altura fixa se ativada
      largura: '', // Largura sempre vazia para novo forro
      quantidade: 1, // ✨ Padrão: 1 forro
      descricao: '',
      area: 0,
      especificacoes: especificacoesPadrao ? {
        tipoChapa: especificacoesPadrao.tipoChapa,
        tipoMontante: especificacoesPadrao.tipoMontante,
        espacamento: especificacoesPadrao.espacamento,
        tratamentoAcustico: especificacoesPadrao.tratamentoAcustico,
        preenchido: true // Já vem preenchida com o padrão
      } : {
        tipoChapa: 'standard' as const,
        tipoMontante: 'f530' as const,
        espacamento: '400' as const,
        tratamentoAcustico: false,
        preenchido: false
      },
      vaos: {
        luminárias: {
          quantidade: '0',
          largura: '0.20',
          altura: '0.20'
        },
        sprinklers: {
          quantidade: '0',
          largura: '0.15',
          altura: '0.15'
        },
        difusores: {
          quantidade: '0',
          largura: '0.60',
          altura: '0.60'
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
  const totalForros = medidas.reduce((total, medida) => total + medida.quantidade, 0)

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
      medida.especificacoes.espacamento === especificacoesPadrao.espacamento &&
      medida.especificacoes.tratamentoAcustico === especificacoesPadrao.tratamentoAcustico

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
    const temInformacoes = parseInt(medida.vaos.luminárias.quantidade) > 0 || 
                          parseInt(medida.vaos.sprinklers.quantidade) > 0 ||
                          parseInt(medida.vaos.difusores.quantidade) > 0

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
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Forro Drywall</h1>
                  <p className="text-sm text-gray-600">Forros suspensos com estrutura metálica</p>
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
        <div className="hidden sm:block w-4 bg-gray-100"></div>

        {/* Main Content - Área de Resultados */}
        <div className="flex-1 p-3 sm:p-6">
          <div className="max-w-4xl mx-auto">
            {/* Cards de Informação */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-lg shadow p-4 sm:p-6 text-center">
                <Ruler className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <div className="text-sm text-gray-600">Área Total</div>
                <div className="text-2xl font-bold text-gray-900">
                  {areaTotal.toFixed(2)} m²
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {medidas.length} medida{medidas.length !== 1 ? 's' : ''}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 sm:p-6 text-center">
                <Building2 className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <div className="text-sm text-gray-600">Forros</div>
                <div className="text-2xl font-bold text-gray-900">{totalForros}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {medidas.length} medida{medidas.length !== 1 ? 's' : ''}
                  <br />
                  <kbd className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">Tab</kbd> nova • <kbd className="px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">Enter</kbd> calcular
                </div>
              </div>
            </div>

            {/* Área de Desenho Técnico com Abas */}
            <div className="bg-white rounded-lg shadow mb-6 sm:mb-8">
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
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">{displayNumber}</span>
                              </div>
                              <div className="text-sm text-gray-600">
                                {medida.area.toFixed(2)} m² {medida.quantidade > 1 ? `(${medida.quantidade}× forros)` : ''}
                              </div>
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
                                        medida.especificacoes.espacamento === especificacoesPadrao.espacamento &&
                                        medida.especificacoes.tratamentoAcustico === especificacoesPadrao.tratamentoAcustico
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
                                    : parseInt(medida.vaos.luminárias.quantidade) > 0 || parseInt(medida.vaos.sprinklers.quantidade) > 0 || parseInt(medida.vaos.difusores.quantidade) > 0
                                      ? "🟢 Vãos e Aberturas - Tem vãos"
                                      : "🔴 Vãos e Aberturas - Sem dados"
                                }
                              >
                                <Flag className="h-3 w-3" />
                              </button>
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
                              <label className="block text-xs text-gray-600">Largura (m)</label>
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
                                  title="Quantidade de forros iguais (deixe vazio para 1 forro)"
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
                              <label className="block text-xs text-gray-600">Altura (m)</label>
                              <div className="flex items-center space-x-1">
                                <input
                                  type="checkbox"
                                  checked={alturaFixaAtivada}
                                  onChange={(e) => setAlturaFixaAtivada(e.target.checked)}
                                  className="w-3 h-3 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                                  title="Usar última altura inserida nos próximos forros"
                                  tabIndex={-1}
                                />
                                <span className="text-xs text-gray-500" title="Usar última altura inserida nos próximos forros">fixar</span>
                              </div>
                            </div>
                            <input
                              type="text"
                              value={medida.altura}
                              onChange={(e) => {
                                atualizarMedida(medida.id, 'altura', e.target.value)
                                // Salvar altura para próximos forros se checkbox ativado
                                if (alturaFixaAtivada && e.target.value.trim()) {
                                  setUltimaAlturaUsada(e.target.value)
                                }
                              }}
                              onBlur={(e) => {
                                const formatted = handleDimensionBlur('altura', e.target.value)
                                atualizarMedida(medida.id, 'altura', formatted)
                                // Salvar altura formatada para próximos forros se checkbox ativado
                                if (formatted.trim()) {
                                  setUltimaAlturaUsada(formatted)
                                }
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
                    
                  </div>
                )}

                {activeTab === 'desenho' && (
                  <div className="space-y-4">
                    {!resultadoCalculo ? (
                      <div className="h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <div className="text-gray-600">Desenho técnico será gerado após o cálculo</div>
                          <div className="text-sm text-gray-500">Inclui estrutura de perfis, fixações e pontos de iluminação</div>
                          <div className="text-xs text-gray-500 mt-2">
                            Total: {areaTotal.toFixed(2)} m² ({medidas.length} medida{medidas.length !== 1 ? 's' : ''})
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="h-64 bg-gray-50 border border-gray-300 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                            <div className="text-gray-600">Desenhos técnicos dos forros drywall</div>
                            <div className="text-sm text-gray-500">Sistema de montagem com perfis F530</div>
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
                        <div className="text-sm mt-1">Inclui chapas drywall, perfis F530, pendurais e acessórios</div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Resumo do Cálculo */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-blue-900">Resumo do Cálculo</h3>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
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
                              <div className="text-blue-700">perfis (m)</div>
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
                              {resultadoCalculo.materiais.chapas.map((item: any, index: number) => (
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
                              {resultadoCalculo.materiais.perfis.map((item: any, index: number) => (
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
                              <Settings className="h-5 w-5 mr-2 text-gray-600" />
                              Acessórios e Fixação
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


      {/* Modal para Especificações */}
      {modalAberto.tipo === 'especificacoes' && modalAberto.medidaId && (() => {
        const medida = medidas.find(m => m.id === modalAberto.medidaId)
        if (!medida) return null
        
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-md">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Especificações do Forro</h3>
                  {medida.especificacoes.preenchido && especificacoesPadrao && (
                    <div className="text-sm text-gray-600 mt-1">
                      {medida.especificacoes.tipoChapa === especificacoesPadrao.tipoChapa &&
                       medida.especificacoes.tipoMontante === especificacoesPadrao.tipoMontante &&
                       medida.especificacoes.espacamento === especificacoesPadrao.espacamento &&
                       medida.especificacoes.tratamentoAcustico === especificacoesPadrao.tratamentoAcustico
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
                  medida.especificacoes.espacamento !== especificacoesPadrao.espacamento ||
                  medida.especificacoes.tratamentoAcustico !== especificacoesPadrao.tratamentoAcustico
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
                            espacamento: especificacoesPadrao.espacamento,
                            tratamentoAcustico: especificacoesPadrao.tratamentoAcustico
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
                  <label className="block text-sm text-gray-600 mb-1">Tipo de Chapa</label>
                  <select 
                    className="input-field"
                    value={medida.especificacoes.tipoChapa}
                    onChange={(e) => atualizarMedida(medida.id, 'especificacoes', { tipoChapa: e.target.value })}
                  >
                    <option value="standard">Drywall Padrão 12.5mm</option>
                    <option value="ru">Drywall RU (Resistente à Umidade)</option>
                    <option value="rf">Drywall RF (Resistente ao Fogo)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Tipo de Montante</label>
                  <select 
                    className="input-field"
                    value={medida.especificacoes.tipoMontante}
                    onChange={(e) => atualizarMedida(medida.id, 'especificacoes', { tipoMontante: e.target.value })}
                  >
                    <option value="f530">F530 - Padrão</option>
                    <option value="f550">F550 - Reforçado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Espaçamento</label>
                  <select 
                    className="input-field"
                    value={medida.especificacoes.espacamento}
                    onChange={(e) => atualizarMedida(medida.id, 'especificacoes', { espacamento: e.target.value })}
                  >
                    <option value="400">400mm</option>
                    <option value="600">600mm</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="checkbox"
                      checked={medida.especificacoes.tratamentoAcustico}
                      onChange={(e) => atualizarMedida(medida.id, 'especificacoes', { tratamentoAcustico: e.target.checked })}
                      className="rounded border-gray-300" 
                    />
                    <span className="text-sm text-gray-600">Tratamento Acústico</span>
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
                        espacamento: medida.especificacoes.espacamento,
                        tratamentoAcustico: medida.especificacoes.tratamentoAcustico
                      })
                    }
                    
                    setModalAberto({tipo: null, medidaId: null})
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
                  <h3 className="text-lg font-semibold">Luminárias e Difusores</h3>
                  {medida.vaos.preenchido ? (
                    <div className="text-sm text-gray-600 mt-1">
                      {parseInt(medida.vaos.luminárias.quantidade) > 0 || parseInt(medida.vaos.sprinklers.quantidade) > 0 || parseInt(medida.vaos.difusores.quantidade) > 0
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
                
                {/* Luminárias */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Luminárias</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Quantidade</label>
                      <input
                        type="number"
                        min="0"
                        className="input-field"
                        placeholder="0"
                        value={medida.vaos.luminárias.quantidade}
                        onChange={(e) => atualizarMedida(medida.id, 'vaos', { 
                          luminárias: { ...medida.vaos.luminárias, quantidade: e.target.value } 
                        })}
                      />
                    </div>
                    
                    {parseInt(medida.vaos.luminárias.quantidade) > 0 && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Largura (m)</label>
                          <input
                            type="text"
                            className="input-field"
                            placeholder="0.20"
                            value={medida.vaos.luminárias.largura}
                            onChange={(e) => atualizarMedida(medida.id, 'vaos', { 
                              luminárias: { ...medida.vaos.luminárias, largura: e.target.value } 
                            })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Altura (m)</label>
                          <input
                            type="text"
                            className="input-field"
                            placeholder="0.20"
                            value={medida.vaos.luminárias.altura}
                            onChange={(e) => atualizarMedida(medida.id, 'vaos', { 
                              luminárias: { ...medida.vaos.luminárias, altura: e.target.value } 
                            })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sprinklers */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Sprinklers</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Quantidade</label>
                      <input
                        type="number"
                        min="0"
                        className="input-field"
                        placeholder="0"
                        value={medida.vaos.sprinklers.quantidade}
                        onChange={(e) => atualizarMedida(medida.id, 'vaos', { 
                          sprinklers: { ...medida.vaos.sprinklers, quantidade: e.target.value } 
                        })}
                      />
                    </div>
                    
                    {parseInt(medida.vaos.sprinklers.quantidade) > 0 && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Largura (m)</label>
                          <input
                            type="text"
                            className="input-field"
                            placeholder="0.15"
                            value={medida.vaos.sprinklers.largura}
                            onChange={(e) => atualizarMedida(medida.id, 'vaos', { 
                              sprinklers: { ...medida.vaos.sprinklers, largura: e.target.value } 
                            })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Altura (m)</label>
                          <input
                            type="text"
                            className="input-field"
                            placeholder="0.15"
                            value={medida.vaos.sprinklers.altura}
                            onChange={(e) => atualizarMedida(medida.id, 'vaos', { 
                              sprinklers: { ...medida.vaos.sprinklers, altura: e.target.value } 
                            })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Difusores */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Difusores</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Quantidade</label>
                      <input
                        type="number"
                        min="0"
                        className="input-field"
                        placeholder="0"
                        value={medida.vaos.difusores.quantidade}
                        onChange={(e) => atualizarMedida(medida.id, 'vaos', { 
                          difusores: { ...medida.vaos.difusores, quantidade: e.target.value } 
                        })}
                      />
                    </div>
                    
                    {parseInt(medida.vaos.difusores.quantidade) > 0 && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Largura (m)</label>
                          <input
                            type="text"
                            className="input-field"
                            placeholder="0.60"
                            value={medida.vaos.difusores.largura}
                            onChange={(e) => atualizarMedida(medida.id, 'vaos', { 
                              difusores: { ...medida.vaos.difusores, largura: e.target.value } 
                            })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Altura (m)</label>
                          <input
                            type="text"
                            className="input-field"
                            placeholder="0.60"
                            value={medida.vaos.difusores.altura}
                            onChange={(e) => atualizarMedida(medida.id, 'vaos', { 
                              difusores: { ...medida.vaos.difusores, altura: e.target.value } 
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
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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