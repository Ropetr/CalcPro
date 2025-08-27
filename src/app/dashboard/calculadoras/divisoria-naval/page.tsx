'use client'

import { useState, useEffect } from 'react'
import { 
  ArrowLeft, 
  Waves, 
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
import { DivisoriaNavalCalculator, type MedidaDivisoria, type ResultadoCalculoDivisoriaNaval } from '@/lib/calculators/divisoria-naval'

interface Medida {
  id: string
  altura: string
  largura: string
  quantidade: number  // ✨ Nova propriedade para multiplicação
  descricao: string
  area: number
  especificacoes: {
    tipoPanel: '35' | '45' | '55'
    perfilJuncao: 'padrao' | 'cromado' | 'anodizado'
    perfilRequadramento: 'padrao' | 'cromado' | 'anodizado'
    acabamento: 'melaminico' | 'texturizado' | 'formica' | 'verniz'
    preenchido: boolean
  }
  vaos: {
    vidros: {
      quantidade: string
      largura: string
      altura: string
    }
    portas: {
      quantidade: string
      largura: string
      altura: string
    }
    preenchido: boolean
  }
}

export default function DivisoriaNavalPage() {
  const [modalidade, setModalidade] = useState<'abnt' | 'basica'>('basica')
  const [activeTab, setActiveTab] = useState<'medidas' | 'desenho' | 'materiais'>('medidas')
  const [searchTerm, setSearchTerm] = useState('')
  const [modalAberto, setModalAberto] = useState<{tipo: 'especificacoes' | 'vaos' | null, medidaId: string | null}>({tipo: null, medidaId: null})
  const [especificacoesPadrao, setEspecificacoesPadrao] = useState<{
    tipoPanel: '35' | '45' | '55'
    perfilJuncao: 'padrao' | 'cromado' | 'anodizado'
    perfilRequadramento: 'padrao' | 'cromado' | 'anodizado'
    acabamento: 'melaminico' | 'texturizado' | 'formica' | 'verniz'
  } | null>(null)
  const [resultadoCalculo, setResultadoCalculo] = useState<ResultadoCalculoDivisoriaNaval | null>(null)
  const [calculadora] = useState(new DivisoriaNavalCalculator())
  
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
      altura: '',
      largura: '',
      quantidade: 1,  // ✨ Padrão: 1 parede
      descricao: '',
      area: 0,
      especificacoes: {
        tipoPanel: '35' as const,
        perfilJuncao: 'padrao' as const,
        perfilRequadramento: 'padrao' as const,
        acabamento: 'melaminico' as const,
        preenchido: false
      },
      vaos: {
        vidros: {
          quantidade: '0',
          largura: '1.20',
          altura: '1.05'
        },
        portas: {
          quantidade: '0',
          largura: '0.80',
          altura: '2.10'
        },
        preenchido: false
      }
    }
  ])
  
  // Configurações gerais do projeto
  const [espessura, setEspessura] = useState('35')

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
      // Converter medidas da interface para o formato da calculadora
      const medidasParaCalculadora: MedidaDivisoria[] = medidas
        .filter(medida => 
          parseFloat(medida.altura.replace(',', '.')) > 0 && 
          parseFloat(medida.largura.replace(',', '.')) > 0
        )
        .map(medida => ({
          id: medida.id,
          altura: parseFloat(medida.altura.replace(',', '.')),
          largura: parseFloat(medida.largura.replace(',', '.')),
          quantidade: medida.quantidade,
          descricao: medida.descricao,
          area: parseFloat(medida.altura.replace(',', '.')) * parseFloat(medida.largura.replace(',', '.')) * medida.quantidade,
          especificacoes: {
            tipoPanel: medida.especificacoes.tipoPanel,
            perfilJuncao: medida.especificacoes.perfilJuncao,
            perfilRequadramento: medida.especificacoes.perfilRequadramento,
            acabamento: medida.especificacoes.acabamento,
            preenchido: medida.especificacoes.preenchido
          },
          vaos: {
            vidros: {
              quantidade: parseInt(medida.vaos.vidros.quantidade) || 0,
              largura: parseFloat(medida.vaos.vidros.largura.replace(',', '.')) || 0,
              altura: parseFloat(medida.vaos.vidros.altura.replace(',', '.')) || 0
            },
            portas: {
              quantidade: parseInt(medida.vaos.portas.quantidade) || 0,
              largura: parseFloat(medida.vaos.portas.largura.replace(',', '.')) || 0,
              altura: parseFloat(medida.vaos.portas.altura.replace(',', '.')) || 0
            },
            preenchido: medida.vaos.preenchido
          }
        }))
      
      if (medidasParaCalculadora.length === 0) {
        alert('Adicione pelo menos uma medida válida para calcular')
        return
      }
      
      // USAR O ENGINE REAL DE CÁLCULO
      const resultado = calculadora.calcular(medidasParaCalculadora)
      setResultadoCalculo(resultado)
      setActiveTab('materiais')
      
      console.log('Cálculo realizado com sistema robusto:', resultado)
    } catch (error) {
      console.error('Erro ao calcular materiais:', error)
      alert('Erro ao calcular materiais. Verifique os dados inseridos.')
    }
  }

  const adicionarMedida = () => {
    const novaId = (medidas.length + 1).toString()
    const novoItem: Medida = {
      id: novaId,
      altura: alturaFixaAtivada ? ultimaAlturaUsada : '', // ✨ Altura fixa se ativada
      largura: '', // Largura sempre vazia para nova parede
      quantidade: 1, // ✨ Padrão: 1 parede
      descricao: '',
      area: 0,
      especificacoes: especificacoesPadrao ? {
        tipoPanel: especificacoesPadrao.tipoPanel,
        perfilJuncao: especificacoesPadrao.perfilJuncao,
        perfilRequadramento: especificacoesPadrao.perfilRequadramento,
        acabamento: especificacoesPadrao.acabamento,
        preenchido: true // Já vem preenchida com o padrão
      } : {
        tipoPanel: '35' as const,
        perfilJuncao: 'padrao' as const,
        perfilRequadramento: 'padrao' as const,
        acabamento: 'melaminico' as const,
        preenchido: false
      },
      vaos: {
        vidros: {
          quantidade: '0',
          largura: '1.20',
          altura: '1.05'
        },
        portas: {
          quantidade: '0',
          largura: '0.80',
          altura: '2.10'
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
  const totalDivisorias = medidas.reduce((total, medida) => total + medida.quantidade, 0)

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
      medida.especificacoes.tipoPanel === especificacoesPadrao.tipoPanel &&
      medida.especificacoes.perfilJuncao === especificacoesPadrao.perfilJuncao &&
      medida.especificacoes.perfilRequadramento === especificacoesPadrao.perfilRequadramento &&
      medida.especificacoes.acabamento === especificacoesPadrao.acabamento

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
    const temInformacoes = parseInt(medida.vaos.vidros.quantidade) > 0 || 
                          parseInt(medida.vaos.portas.quantidade) > 0

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
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                  <Waves className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Divisória Naval</h1>
                  <p className="text-sm text-gray-600">Painéis de madeira com miolo colmeia</p>
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
                <Ruler className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                <div className="text-sm text-gray-600">Área Total</div>
                <div className="text-2xl font-bold text-gray-900">
                  {areaTotal.toFixed(2)} m²
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {medidas.length} medida{medidas.length !== 1 ? 's' : ''}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4 sm:p-6 text-center">
                <Waves className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <div className="text-sm text-gray-600">Divisórias</div>
                <div className="text-2xl font-bold text-gray-900">{totalDivisorias}</div>
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
                                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-orange-600">{displayNumber}</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                  {medida.area.toFixed(2)} m² {medida.quantidade > 1 ? `(${medida.quantidade}× divisórias)` : ''}
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
                                      : medida.especificacoes.tipoPanel === especificacoesPadrao.tipoPanel &&
                                        medida.especificacoes.perfilJuncao === especificacoesPadrao.perfilJuncao &&
                                        medida.especificacoes.perfilRequadramento === especificacoesPadrao.perfilRequadramento &&
                                        medida.especificacoes.acabamento === especificacoesPadrao.acabamento
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
                                    : parseInt(medida.vaos.vidros.quantidade) > 0 || parseInt(medida.vaos.portas.quantidade) > 0
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
                                  title="Quantidade de divisórias iguais (deixe vazio para 1 divisória)"
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
                                  title="Usar última altura inserida nas próximas divisórias"
                                  tabIndex={-1}
                                />
                                <span className="text-xs text-gray-500" title="Usar última altura inserida nas próximas divisórias">fixar</span>
                              </div>
                            </div>
                            <input
                              type="text"
                              value={medida.altura}
                              onChange={(e) => {
                                atualizarMedida(medida.id, 'altura', e.target.value)
                                // Salvar altura para próximas divisórias se checkbox ativado
                                if (alturaFixaAtivada && e.target.value.trim()) {
                                  setUltimaAlturaUsada(e.target.value)
                                }
                              }}
                              onBlur={(e) => {
                                const formatted = handleDimensionBlur('altura', e.target.value)
                                atualizarMedida(medida.id, 'altura', formatted)
                                // Salvar altura formatada para próximas divisórias se checkbox ativado
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
                              placeholder="Ex: Sala, Recepção..."
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
                          <Waves className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <div className="text-gray-600">Desenho técnico será gerado após o cálculo</div>
                          <div className="text-sm text-gray-500">Inclui posicionamento de perfis H/U e detalhes de montagem</div>
                          <div className="text-xs text-gray-500 mt-2">
                            Total: {areaTotal.toFixed(2)} m² ({medidas.length} medida{medidas.length !== 1 ? 's' : ''})
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="h-64 bg-gray-50 border border-gray-300 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <Waves className="h-12 w-12 text-orange-600 mx-auto mb-3" />
                            <div className="text-gray-600">Desenhos técnicos das divisórias navais</div>
                            <div className="text-sm text-gray-500">Sistema de montagem com perfis H e U</div>
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
                        <div className="text-sm mt-1">Inclui painéis navais, perfis H/U, kits de porta e acessórios de vidro</div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Resumo do Cálculo */}
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-orange-900">Resumo do Cálculo</h3>
                            <div className="text-xs text-orange-700">Sistema robusto com aproveitamento</div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="text-center">
                              <div className="text-lg font-bold text-orange-900">{resultadoCalculo.resumo.area_liquida.toFixed(2)}</div>
                              <div className="text-orange-700">m² líquidos</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-orange-900">{resultadoCalculo.resumo.total_paredes}</div>
                              <div className="text-orange-700">divisórias</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-orange-900">
                                {(resultadoCalculo.materiais.paineis.painel_1_20 + resultadoCalculo.materiais.paineis.painel_0_82)}
                              </div>
                              <div className="text-orange-700">painéis</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-orange-900">
                                {(resultadoCalculo.materiais.perfis_h.h_3_00 + resultadoCalculo.materiais.perfis_h.h_2_15 + resultadoCalculo.materiais.perfis_h.h_1_18)}
                              </div>
                              <div className="text-orange-700">perfis H</div>
                            </div>
                          </div>
                        </div>

                        {/* Painéis */}
                        <div className="bg-white border border-gray-200 rounded-lg">
                          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
                            <h3 className="font-semibold text-gray-900 flex items-center">
                              <Package className="h-5 w-5 mr-2 text-gray-600" />
                              Painéis Navais
                            </h3>
                          </div>
                          <div className="p-4">
                            <div className="space-y-3">
                              {resultadoCalculo.materiais.paineis.painel_1_20 > 0 && (
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900">Painel Naval 1,20m × 2,10m</div>
                                    <div className="text-sm text-gray-600">Painel com miolo colmeia e laminado melamínico</div>
                                    <div className="text-xs text-gray-500 mt-1">Otimizado com sistema de aproveitamento</div>
                                  </div>
                                  <div className="text-right ml-4">
                                    <div className="font-semibold text-gray-900">{resultadoCalculo.materiais.paineis.painel_1_20} un</div>
                                  </div>
                                </div>
                              )}
                              {resultadoCalculo.materiais.paineis.painel_0_82 > 0 && (
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900">Painel Naval 0,82m × 2,10m</div>
                                    <div className="text-sm text-gray-600">Painel com miolo colmeia e laminado melamínico</div>
                                    <div className="text-xs text-gray-500 mt-1">Usado para otimização de cortes</div>
                                  </div>
                                  <div className="text-right ml-4">
                                    <div className="font-semibold text-gray-900">{resultadoCalculo.materiais.paineis.painel_0_82} un</div>
                                  </div>
                                </div>
                              )}
                              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex justify-between items-center">
                                  <div className="text-sm text-green-800 font-medium">Aproveitamento</div>
                                  <div className="text-sm text-green-600">
                                    {(100 - resultadoCalculo.materiais.paineis.desperdicio_paineis).toFixed(1)}% eficiência
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Perfis */}
                        <div className="bg-white border border-gray-200 rounded-lg">
                          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
                            <h3 className="font-semibold text-gray-900 flex items-center">
                              <Ruler className="h-5 w-5 mr-2 text-gray-600" />
                              Perfis de Alumínio
                            </h3>
                          </div>
                          <div className="p-4">
                            <div className="space-y-3">
                              {resultadoCalculo.materiais.perfis_h.h_3_00 > 0 && (
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900">Perfil H 3,00m</div>
                                    <div className="text-sm text-gray-600">Para alturas até 3,00m - usado em pé</div>
                                    <div className="text-xs text-gray-500 mt-1">Junção entre painéis verticais</div>
                                  </div>
                                  <div className="text-right ml-4">
                                    <div className="font-semibold text-gray-900">{resultadoCalculo.materiais.perfis_h.h_3_00} un</div>
                                  </div>
                                </div>
                              )}
                              {resultadoCalculo.materiais.perfis_h.h_2_15 > 0 && (
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900">Perfil H 2,15m</div>
                                    <div className="text-sm text-gray-600">Para alturas até 2,10m - usado em pé</div>
                                    <div className="text-xs text-gray-500 mt-1">Junção entre painéis verticais</div>
                                  </div>
                                  <div className="text-right ml-4">
                                    <div className="font-semibold text-gray-900">{resultadoCalculo.materiais.perfis_h.h_2_15} un</div>
                                  </div>
                                </div>
                              )}
                              {resultadoCalculo.materiais.perfis_h.h_1_18 > 0 && (
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900">Perfil H 1,18m</div>
                                    <div className="text-sm text-gray-600">Usado deitado - entre camadas</div>
                                    <div className="text-xs text-gray-500 mt-1">Junção horizontal painel/recorte</div>
                                  </div>
                                  <div className="text-right ml-4">
                                    <div className="font-semibold text-gray-900">{resultadoCalculo.materiais.perfis_h.h_1_18} un</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Perfis U */}
                        <div className="bg-white border border-gray-200 rounded-lg">
                          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
                            <h3 className="font-semibold text-gray-900 flex items-center">
                              <Ruler className="h-5 w-5 mr-2 text-gray-600" />
                              Perfis U - Requadramento
                            </h3>
                          </div>
                          <div className="p-4">
                            <div className="space-y-3">
                              {resultadoCalculo.materiais.perfis_u.u_3_00 > 0 && (
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900">Perfil U 3,00m</div>
                                    <div className="text-sm text-gray-600">Para requadramento - piso, teto e laterais</div>
                                    <div className="text-xs text-gray-500 mt-1">Sistema de aproveitamento otimizado</div>
                                  </div>
                                  <div className="text-right ml-4">
                                    <div className="font-semibold text-gray-900">{resultadoCalculo.materiais.perfis_u.u_3_00} un</div>
                                  </div>
                                </div>
                              )}
                              {resultadoCalculo.materiais.perfis_u.u_2_15 > 0 && (
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900">Perfil U 2,15m</div>
                                    <div className="text-sm text-gray-600">Para alturas menores - laterais</div>
                                    <div className="text-xs text-gray-500 mt-1">Requadramento otimizado</div>
                                  </div>
                                  <div className="text-right ml-4">
                                    <div className="font-semibold text-gray-900">{resultadoCalculo.materiais.perfis_u.u_2_15} un</div>
                                  </div>
                                </div>
                              )}
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
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">Kit de Fixação</div>
                                  <div className="text-sm text-gray-600">Parafusos, buchas e tarugos completos</div>
                                  <div className="text-xs text-gray-500 mt-1">Por divisória instalada</div>
                                </div>
                                <div className="text-right ml-4">
                                  <div className="font-semibold text-gray-900">{resultadoCalculo.materiais.acessorios.kit_fixacao} kit</div>
                                </div>
                              </div>
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">Parafuso 4,2 × 13mm</div>
                                  <div className="text-sm text-gray-600">Para fixação dos painéis</div>
                                  <div className="text-xs text-gray-500 mt-1">Estimativa baseada em área</div>
                                </div>
                                <div className="text-right ml-4">
                                  <div className="font-semibold text-gray-900">{resultadoCalculo.materiais.acessorios.parafusos_4_2_13} un</div>
                                </div>
                              </div>
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">Buchas</div>
                                  <div className="text-sm text-gray-600">Para fixação na estrutura</div>
                                  <div className="text-xs text-gray-500 mt-1">Estimativa por divisória</div>
                                </div>
                                <div className="text-right ml-4">
                                  <div className="font-semibold text-gray-900">{resultadoCalculo.materiais.acessorios.buchas} un</div>
                                </div>
                              </div>
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
                  <h3 className="text-lg font-semibold">Especificações da Divisória</h3>
                  {medida.especificacoes.preenchido && especificacoesPadrao && (
                    <div className="text-sm text-gray-600 mt-1">
                      {medida.especificacoes.tipoPanel === especificacoesPadrao.tipoPanel &&
                       medida.especificacoes.perfilJuncao === especificacoesPadrao.perfilJuncao &&
                       medida.especificacoes.perfilRequadramento === especificacoesPadrao.perfilRequadramento &&
                       medida.especificacoes.acabamento === especificacoesPadrao.acabamento
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
                  medida.especificacoes.tipoPanel !== especificacoesPadrao.tipoPanel ||
                  medida.especificacoes.perfilJuncao !== especificacoesPadrao.perfilJuncao ||
                  medida.especificacoes.perfilRequadramento !== especificacoesPadrao.perfilRequadramento ||
                  medida.especificacoes.acabamento !== especificacoesPadrao.acabamento
                ) && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-green-800">
                        Aplicar especificações padrão do projeto?
                      </div>
                      <button
                        onClick={() => {
                          atualizarMedida(medida.id, 'especificacoes', {
                            tipoPanel: especificacoesPadrao.tipoPanel,
                            perfilJuncao: especificacoesPadrao.perfilJuncao,
                            perfilRequadramento: especificacoesPadrao.perfilRequadramento,
                            acabamento: especificacoesPadrao.acabamento
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
                    value={medida.especificacoes.tipoPanel}
                    onChange={(e) => atualizarMedida(medida.id, 'especificacoes', { tipoPanel: e.target.value })}
                  >
                    <option value="35">35mm - Padrão</option>
                    <option value="45">45mm - Reforçado</option>
                    <option value="55">55mm - Extra Resistente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Perfil de Junção</label>
                  <select 
                    className="input-field"
                    value={medida.especificacoes.perfilJuncao}
                    onChange={(e) => atualizarMedida(medida.id, 'especificacoes', { perfilJuncao: e.target.value })}
                  >
                    <option value="padrao">Perfil H - Padrão</option>
                    <option value="cromado">Perfil H - Cromado</option>
                    <option value="anodizado">Perfil H - Anodizado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Perfil de Requadramento</label>
                  <select 
                    className="input-field"
                    value={medida.especificacoes.perfilRequadramento}
                    onChange={(e) => atualizarMedida(medida.id, 'especificacoes', { perfilRequadramento: e.target.value })}
                  >
                    <option value="padrao">Perfil U - Padrão</option>
                    <option value="cromado">Perfil U - Cromado</option>
                    <option value="anodizado">Perfil U - Anodizado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Acabamento</label>
                  <select 
                    className="input-field"
                    value={medida.especificacoes.acabamento}
                    onChange={(e) => atualizarMedida(medida.id, 'especificacoes', { acabamento: e.target.value })}
                  >
                    <option value="melaminico">Laminado Melamínico</option>
                    <option value="texturizado">Laminado Texturizado</option>
                    <option value="formica">Fórmica</option>
                    <option value="verniz">Verniz Natural</option>
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
                        tipoPanel: medida.especificacoes.tipoPanel,
                        perfilJuncao: medida.especificacoes.perfilJuncao,
                        perfilRequadramento: medida.especificacoes.perfilRequadramento,
                        acabamento: medida.especificacoes.acabamento
                      })
                    }
                    
                    setModalAberto({tipo: null, medidaId: null})
                  }}
                  className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
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
                      {parseInt(medida.vaos.vidros.quantidade) > 0 || parseInt(medida.vaos.portas.quantidade) > 0
                        ? "🟢 Divisória com vãos configurados"
                        : "🔴 Divisória sem dados de vãos"}
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
                
                {/* Vidros */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Vãos de Vidro</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Quantidade</label>
                      <input
                        type="number"
                        min="0"
                        className="input-field"
                        placeholder="0"
                        value={medida.vaos.vidros.quantidade}
                        onChange={(e) => atualizarMedida(medida.id, 'vaos', { 
                          vidros: { ...medida.vaos.vidros, quantidade: e.target.value } 
                        })}
                      />
                    </div>
                    
                    {parseInt(medida.vaos.vidros.quantidade) > 0 && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Largura Total (m)</label>
                          <input
                            type="text"
                            className="input-field"
                            placeholder="1.20"
                            value={medida.vaos.vidros.largura}
                            onChange={(e) => atualizarMedida(medida.id, 'vaos', { 
                              vidros: { ...medida.vaos.vidros, largura: e.target.value } 
                            })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Altura (m)</label>
                          <input
                            type="text"
                            className="input-field"
                            placeholder="1.05"
                            value={medida.vaos.vidros.altura}
                            onChange={(e) => atualizarMedida(medida.id, 'vaos', { 
                              vidros: { ...medida.vaos.vidros, altura: e.target.value } 
                            })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Portas */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Kits de Porta</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Quantidade</label>
                      <input
                        type="number"
                        min="0"
                        className="input-field"
                        placeholder="0"
                        value={medida.vaos.portas.quantidade}
                        onChange={(e) => atualizarMedida(medida.id, 'vaos', { 
                          portas: { ...medida.vaos.portas, quantidade: e.target.value } 
                        })}
                      />
                    </div>
                    
                    {parseInt(medida.vaos.portas.quantidade) > 0 && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Largura (m)</label>
                          <input
                            type="text"
                            className="input-field"
                            placeholder="0.80"
                            value={medida.vaos.portas.largura}
                            onChange={(e) => atualizarMedida(medida.id, 'vaos', { 
                              portas: { ...medida.vaos.portas, largura: e.target.value } 
                            })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Altura (m)</label>
                          <input
                            type="text"
                            className="input-field"
                            placeholder="2.10"
                            value={medida.vaos.portas.altura}
                            onChange={(e) => atualizarMedida(medida.id, 'vaos', { 
                              portas: { ...medida.vaos.portas, altura: e.target.value } 
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
                  className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
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