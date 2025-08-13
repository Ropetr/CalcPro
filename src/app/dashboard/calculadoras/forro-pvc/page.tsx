'use client'

import { useState, useEffect } from 'react'
import { 
  ArrowLeft, 
  Layers, 
  Calculator, 
  FileText, 
  Download,
  Settings,
  Ruler,
  Package,
  AlertCircle,
  Plus,
  Trash2,
  Edit3,
  Search,
  Flag,
  CheckCircle,
  Square,
  Scissors
} from 'lucide-react'
import Link from 'next/link'
import { useKeyboardNavigation } from '@/lib/ui-standards/navigation/useKeyboardNavigation'
import { NavigationHelp } from '@/lib/ui-standards/navigation/components/NavigationHelp'
import { autoCompleteDimension } from '@/lib/ui-standards/formatting/formatters'
import { ForroPVCCalculator } from '@/lib/calculators/forro-pvc/calculator'
import type { 
  ComodoPVC, 
  AmbientePVC, 
  EspecificacoesPVC, 
  VaosPVC,
  ResultadoCalculoPVC 
} from '@/lib/calculators/forro-pvc/types'

interface Medida {
  id: string
  nome: string
  altura: string
  largura: string
  quantidade: number  // ✨ Nova propriedade para multiplicação
  descricao: string
  area: number
  especificacoes: {
    tipoPVC: 'branco' | 'texturizado' | 'madeirado'
    perfis: 'cantoneira' | 'perfil-h' | 'ambos'
    acabamento: 'branco' | 'colorido' | 'madeirado'
    instalacao: 'pregada' | 'encaixe' | 'colada'
    preenchido: boolean
  }
  vaos: {
    luminárias: {
      quantidade: string
      largura: string
      altura: string
    }
    ventiladores: {
      quantidade: string
      largura: string
      altura: string
    }
    acesso: {
      quantidade: string
      largura: string
      altura: string
    }
    preenchido: boolean
  }
}

// Instância da calculadora
const calculator = new ForroPVCCalculator()

export default function ForroPVCPage() {
  const [modalidade, setModalidade] = useState<'abnt' | 'basica'>('basica')
  const [activeTab, setActiveTab] = useState<'medidas' | 'desenho' | 'materiais'>('medidas')
  const [searchTerm, setSearchTerm] = useState('')
  const [modalAberto, setModalAberto] = useState<{tipo: 'especificacoes' | 'vaos' | null, medidaId: string | null}>({tipo: null, medidaId: null})
  const [especificacoesPadrao, setEspecificacoesPadrao] = useState<{
    tipoPVC: 'branco' | 'texturizado' | 'madeirado'
    perfis: 'cantoneira' | 'perfil-h' | 'ambos'
    acabamento: 'branco' | 'colorido' | 'madeirado'
    instalacao: 'pregada' | 'encaixe' | 'colada'
  } | null>(null)
  const [resultadoCalculo, setResultadoCalculo] = useState<ResultadoCalculoPVC | null>(null)
  
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
      quantidade: 1,  // ✨ Padrão: 1 ambiente
      descricao: '',
      area: 0,
      especificacoes: {
        tipoPVC: 'branco' as const,
        perfis: 'cantoneira' as const,
        acabamento: 'branco' as const,
        instalacao: 'pregada' as const,
        preenchido: false
      },
      vaos: {
        luminárias: {
          quantidade: '0',
          largura: '0.20',
          altura: '0.20'
        },
        ventiladores: {
          quantidade: '0',
          largura: '0.60',
          altura: '0.60'
        },
        acesso: {
          quantidade: '0',
          largura: '0.40',
          altura: '0.40'
        },
        preenchido: false
      }
    }
  ])
  
  // Configurações gerais do projeto
  const [espessura, setEspessura] = useState('200')

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
      // Converter medidas para o formato esperado pela calculadora
      // ✨ Expandir ambientes com quantidade > 1 em múltiplos ambientes individuais
      const ambientesParaCalculo: ComodoPVC[] = medidas
        .filter(medida => parseFloat(medida.altura.replace(',', '.')) > 0 && parseFloat(medida.largura.replace(',', '.')) > 0)
        .flatMap(medida => {
          const ambienteBase: ComodoPVC = {
            id: medida.id,
            nome: medida.nome,
            ambientes: [{
              id: medida.id,
              largura: parseFloat(medida.largura.replace(',', '.')),
              comprimento: parseFloat(medida.altura.replace(',', '.')),
              descricao: medida.descricao
            }],
            area: parseFloat(medida.altura.replace(',', '.')) * parseFloat(medida.largura.replace(',', '.')),  // ✨ Área individual
            tipoComodo: 'retangular'
          }
          
          // ✨ Gerar array com N ambientes iguais baseado na quantidade
          return Array(medida.quantidade).fill(null).map((_, index) => ({
            ...ambienteBase,
            id: `${medida.id}-${index + 1}`,  // IDs únicos: "1-1", "1-2", "1-3", "1-4"
            nome: medida.quantidade > 1 ? `${medida.nome} (${index + 1}/${medida.quantidade})` : medida.nome
          }))
        })
      
      if (ambientesParaCalculo.length === 0) {
        alert('Adicione pelo menos uma medida válida para calcular')
        return
      }
      
      // Preparar especificações (usar da primeira medida configurada)
      const medidaComEspec = medidas.find(m => m.especificacoes.preenchido)
      const especificacoes: EspecificacoesPVC = medidaComEspec ? {
        tipoPVC: medidaComEspec.especificacoes.tipoPVC,
        perfis: medidaComEspec.especificacoes.perfis,
        acabamento: medidaComEspec.especificacoes.acabamento,
        instalacao: medidaComEspec.especificacoes.instalacao
      } : {
        tipoPVC: 'branco',
        perfis: 'cantoneira',
        acabamento: 'branco',
        instalacao: 'pregada'
      }
      
      // Preparar vãos (somar todos os vãos configurados)
      const vaos: VaosPVC = {
        luminárias: [],
        ventiladores: [],
        acesso: []
      }
      
      medidas.forEach(medida => {
        if (medida.vaos.preenchido) {
          const qtdLum = parseInt(medida.vaos.luminárias.quantidade)
          const qtdVent = parseInt(medida.vaos.ventiladores.quantidade)
          const qtdAcess = parseInt(medida.vaos.acesso.quantidade)
          
          if (qtdLum > 0) {
            vaos.luminárias.push({
              quantidade: qtdLum,
              largura: parseFloat(medida.vaos.luminárias.largura.replace(',', '.')),
              altura: parseFloat(medida.vaos.luminárias.altura.replace(',', '.'))
            })
          }
          
          if (qtdVent > 0) {
            vaos.ventiladores.push({
              quantidade: qtdVent,
              largura: parseFloat(medida.vaos.ventiladores.largura.replace(',', '.')),
              altura: parseFloat(medida.vaos.ventiladores.altura.replace(',', '.'))
            })
          }
          
          if (qtdAcess > 0) {
            vaos.acesso.push({
              quantidade: qtdAcess,
              largura: parseFloat(medida.vaos.acesso.largura.replace(',', '.')),
              altura: parseFloat(medida.vaos.acesso.altura.replace(',', '.'))
            })
          }
        }
      })
      
      // Executar cálculo real
      const resultado = calculator.calcular(
        ambientesParaCalculo,
        [], // Medidas extras (implementar depois)
        especificacoes,
        vaos
      )
      
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
      largura: '', // Largura sempre vazia para novo ambiente
      quantidade: 1, // ✨ Padrão: 1 ambiente
      descricao: '',
      area: 0,
      especificacoes: especificacoesPadrao ? {
        tipoPVC: especificacoesPadrao.tipoPVC,
        perfis: especificacoesPadrao.perfis,
        acabamento: especificacoesPadrao.acabamento,
        instalacao: especificacoesPadrao.instalacao,
        preenchido: true // Já vem preenchida com o padrão
      } : {
        tipoPVC: 'branco' as const,
        perfis: 'cantoneira' as const,
        acabamento: 'branco' as const,
        instalacao: 'pregada' as const,
        preenchido: false
      },
      vaos: {
        luminárias: {
          quantidade: '0',
          largura: '0.20',
          altura: '0.20'
        },
        ventiladores: {
          quantidade: '0',
          largura: '0.60',
          altura: '0.60'
        },
        acesso: {
          quantidade: '0',
          largura: '0.40',
          altura: '0.40'
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
    const igualPadrao = 
      medida.especificacoes.tipoPVC === especificacoesPadrao.tipoPVC &&
      medida.especificacoes.perfis === especificacoesPadrao.perfis &&
      medida.especificacoes.acabamento === especificacoesPadrao.acabamento &&
      medida.especificacoes.instalacao === especificacoesPadrao.instalacao

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
                          parseInt(medida.vaos.ventiladores.quantidade) > 0 ||
                          parseInt(medida.vaos.acesso.quantidade) > 0

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
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <Layers className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Forro PVC</h1>
                  <p className="text-sm text-gray-600">Forros suspensos com réguas de PVC</p>
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
                                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-medium text-primary-600">{displayNumber}</span>
                                </div>
                                <div className="text-sm text-gray-600">
                                  {medida.area.toFixed(2)} m² {medida.quantidade > 1 ? `(${medida.quantidade}× ambientes)` : ''}
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
                                          : medida.especificacoes.tipoPVC === especificacoesPadrao.tipoPVC &&
                                            medida.especificacoes.perfis === especificacoesPadrao.perfis &&
                                            medida.especificacoes.acabamento === especificacoesPadrao.acabamento &&
                                            medida.especificacoes.instalacao === especificacoesPadrao.instalacao
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
                                        : parseInt(medida.vaos.luminárias.quantidade) > 0 || parseInt(medida.vaos.ventiladores.quantidade) > 0 || parseInt(medida.vaos.acesso.quantidade) > 0
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
                                  <label className="block text-xs text-gray-600">Altura (m)</label>
                                  <div className="flex items-center space-x-1">
                                    <input
                                      type="checkbox"
                                      checked={alturaFixaAtivada}
                                      onChange={(e) => setAlturaFixaAtivada(e.target.checked)}
                                      className="w-3 h-3 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500"
                                      title="Usar última altura inserida nos próximos ambientes"
                                      tabIndex={-1}
                                    />
                                    <span className="text-xs text-gray-500" title="Usar última altura inserida nos próximos ambientes">fixar</span>
                                  </div>
                                </div>
                                <input
                                  type="text"
                                  value={medida.altura}
                                  onChange={(e) => {
                                    atualizarMedida(medida.id, 'altura', e.target.value)
                                    // Salvar altura para próximos ambientes se checkbox ativado
                                    if (alturaFixaAtivada && e.target.value.trim()) {
                                      setUltimaAlturaUsada(e.target.value)
                                    }
                                  }}
                                  onBlur={(e) => {
                                    const formatted = handleDimensionBlur('altura', e.target.value)
                                    atualizarMedida(medida.id, 'altura', formatted)
                                    // Salvar altura formatada para próximos ambientes se checkbox ativado
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
                                  placeholder="Ex: Sala, Quarto..."
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
                          <Layers className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <div className="text-gray-600">Desenho técnico será gerado após o cálculo</div>
                          <div className="text-sm text-gray-500">Inclui disposição das réguas e pontos de fixação</div>
                          <div className="text-xs text-gray-500 mt-2">
                            Total: {areaTotal.toFixed(2)} m² ({medidas.length} medida{medidas.length !== 1 ? 's' : ''})
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="h-64 bg-gray-50 border border-gray-300 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <Layers className="h-12 w-12 text-green-600 mx-auto mb-3" />
                            <div className="text-gray-600">Desenhos técnicos dos forros PVC</div>
                            <div className="text-sm text-gray-500">Sistema de montagem com cantoneiras</div>
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
                        <div className="text-sm mt-1">Inclui réguas PVC, rodaforro, cantoneiras e parafusos</div>
                        <button 
                          onClick={calcularMateriais}
                          className="mt-4 btn-primary flex items-center mx-auto"
                        >
                          <Calculator className="h-4 w-4 mr-2" />
                          Calcular Agora
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Resumo do Cálculo */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-green-900">Resumo do Cálculo</h3>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div className="text-center">
                              <div className="text-lg font-bold text-green-900">{resultadoCalculo.totais.area.toFixed(2)}</div>
                              <div className="text-green-700">m² líquidos</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-green-900">
                                {Object.values(resultadoCalculo.totais.reguasForro).reduce((a: number, b: number) => a + b, 0)}
                              </div>
                              <div className="text-green-700">réguas (m)</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-green-900">{resultadoCalculo.totais.cantoneiras}</div>
                              <div className="text-green-700">perfis (m)</div>
                            </div>
                          </div>
                        </div>

                        {/* Réguas */}
                        <div className="bg-white border border-gray-200 rounded-lg">
                          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
                            <h3 className="font-semibold text-gray-900 flex items-center">
                              <Package className="h-5 w-5 mr-2 text-gray-600" />
                              Réguas PVC
                            </h3>
                          </div>
                          <div className="p-4">
                            <div className="space-y-3">
                              {Object.entries(resultadoCalculo.totais.reguasForro).map(([comprimento, quantidade]) => (
                                <div key={comprimento} className="flex justify-between items-center">
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900">Régua PVC {comprimento}m</div>
                                    <div className="text-sm text-gray-600">Régua de forro suspenso</div>
                                    <div className="text-xs text-gray-500 mt-1">Largura 200mm</div>
                                  </div>
                                  <div className="text-right ml-4">
                                    <div className="font-semibold text-gray-900">{quantidade} un</div>
                                    <div className="text-xs text-gray-500">{(parseFloat(comprimento) * quantidade).toFixed(1)}m total</div>
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
                              Perfis de Acabamento
                            </h3>
                          </div>
                          <div className="p-4">
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">Cantoneiras PVC</div>
                                  <div className="text-sm text-gray-600">Perfil de acabamento perimetral</div>
                                  <div className="text-xs text-gray-500 mt-1">Barras de 2,50m</div>
                                </div>
                                <div className="text-right ml-4">
                                  <div className="font-semibold text-gray-900">{resultadoCalculo.totais.cantoneiras}m</div>
                                </div>
                              </div>
                              
                              {resultadoCalculo.totais.perfisEmenda > 0 && (
                                <div className="flex justify-between items-center">
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900">Perfis de Emenda</div>
                                    <div className="text-sm text-gray-600">Para junção de réguas</div>
                                    <div className="text-xs text-gray-500 mt-1">Necessário para emendas</div>
                                  </div>
                                  <div className="text-right ml-4">
                                    <div className="font-semibold text-gray-900">{resultadoCalculo.totais.perfisEmenda}m</div>
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
                              {resultadoCalculo.totais.parafuso4213 > 0 && (
                                <div className="flex justify-between items-center">
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900">Parafuso 4,2x13mm</div>
                                    <div className="text-sm text-gray-600">Fixação das réguas na estrutura</div>
                                    <div className="text-xs text-gray-500 mt-1">Pacotes de 500 unidades</div>
                                  </div>
                                  <div className="text-right ml-4">
                                    <div className="font-semibold text-gray-900">{resultadoCalculo.totais.parafuso4213} pacotes</div>
                                    <div className="text-xs text-gray-500">{resultadoCalculo.totais.parafuso4213 * 500} unidades</div>
                                  </div>
                                </div>
                              )}
                              
                              {resultadoCalculo.totais.parafusoGN25 > 0 && (
                                <div className="flex justify-between items-center">
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900">Parafuso GN25</div>
                                    <div className="text-sm text-gray-600">Fixação de perfis e cantoneiras</div>
                                    <div className="text-xs text-gray-500 mt-1">Pacotes de 100 unidades</div>
                                  </div>
                                  <div className="text-right ml-4">
                                    <div className="font-semibold text-gray-900">{resultadoCalculo.totais.parafusoGN25} pacotes</div>
                                    <div className="text-xs text-gray-500">{resultadoCalculo.totais.parafusoGN25 * 100} unidades</div>
                                  </div>
                                </div>
                              )}
                              
                              {resultadoCalculo.totais.parafusoBucha > 0 && (
                                <div className="flex justify-between items-center">
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900">Parafuso com Bucha</div>
                                    <div className="text-sm text-gray-600">Fixação de cantoneiras na parede</div>
                                    <div className="text-xs text-gray-500 mt-1">Pacotes de 50 unidades</div>
                                  </div>
                                  <div className="text-right ml-4">
                                    <div className="font-semibold text-gray-900">{resultadoCalculo.totais.parafusoBucha} pacotes</div>
                                    <div className="text-xs text-gray-500">{resultadoCalculo.totais.parafusoBucha * 50} unidades</div>
                                  </div>
                                </div>
                              )}
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
                  <h3 className="text-lg font-semibold">Especificações do Ambiente</h3>
                  {medida.especificacoes.preenchido && especificacoesPadrao && (
                    <div className="text-sm text-gray-600 mt-1">
                      {medida.especificacoes.tipoPVC === especificacoesPadrao.tipoPVC &&
                       medida.especificacoes.perfis === especificacoesPadrao.perfis &&
                       medida.especificacoes.acabamento === especificacoesPadrao.acabamento &&
                       medida.especificacoes.instalacao === especificacoesPadrao.instalacao
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
                  medida.especificacoes.tipoPVC !== especificacoesPadrao.tipoPVC ||
                  medida.especificacoes.perfis !== especificacoesPadrao.perfis ||
                  medida.especificacoes.acabamento !== especificacoesPadrao.acabamento ||
                  medida.especificacoes.instalacao !== especificacoesPadrao.instalacao
                ) && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-green-800">
                        Aplicar especificações padrão do projeto?
                      </div>
                      <button
                        onClick={() => {
                          atualizarMedida(medida.id, 'especificacoes', {
                            tipoPVC: especificacoesPadrao.tipoPVC,
                            perfis: especificacoesPadrao.perfis,
                            acabamento: especificacoesPadrao.acabamento,
                            instalacao: especificacoesPadrao.instalacao
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
                  <label className="block text-sm text-gray-600 mb-1">Tipo PVC</label>
                  <select 
                    className="input-field"
                    value={medida.especificacoes.tipoPVC}
                    onChange={(e) => atualizarMedida(medida.id, 'especificacoes', { tipoPVC: e.target.value })}
                  >
                    <option value="branco">PVC Branco</option>
                    <option value="texturizado">PVC Texturizado</option>
                    <option value="madeirado">PVC Madeirado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Perfis</label>
                  <select 
                    className="input-field"
                    value={medida.especificacoes.perfis}
                    onChange={(e) => atualizarMedida(medida.id, 'especificacoes', { perfis: e.target.value })}
                  >
                    <option value="cantoneira">Cantoneira</option>
                    <option value="perfil-h">Perfil H</option>
                    <option value="ambos">Ambos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Acabamento</label>
                  <select 
                    className="input-field"
                    value={medida.especificacoes.acabamento}
                    onChange={(e) => atualizarMedida(medida.id, 'especificacoes', { acabamento: e.target.value })}
                  >
                    <option value="branco">Branco</option>
                    <option value="colorido">Colorido</option>
                    <option value="madeirado">Madeirado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Instalação</label>
                  <select 
                    className="input-field"
                    value={medida.especificacoes.instalacao}
                    onChange={(e) => atualizarMedida(medida.id, 'especificacoes', { instalacao: e.target.value })}
                  >
                    <option value="pregada">Pregada</option>
                    <option value="encaixe">Encaixe</option>
                    <option value="colada">Colada</option>
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
                        tipoPVC: medida.especificacoes.tipoPVC,
                        perfis: medida.especificacoes.perfis,
                        acabamento: medida.especificacoes.acabamento,
                        instalacao: medida.especificacoes.instalacao
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
                  <h3 className="text-lg font-semibold">Luminárias e Ventiladores</h3>
                  {medida.vaos.preenchido ? (
                    <div className="text-sm text-gray-600 mt-1">
                      {parseInt(medida.vaos.luminárias.quantidade) > 0 || parseInt(medida.vaos.ventiladores.quantidade) > 0 || parseInt(medida.vaos.acesso.quantidade) > 0
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
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="text-xs text-green-800">
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

                {/* Ventiladores */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Ventiladores</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Quantidade</label>
                      <input
                        type="number"
                        min="0"
                        className="input-field"
                        placeholder="0"
                        value={medida.vaos.ventiladores.quantidade}
                        onChange={(e) => atualizarMedida(medida.id, 'vaos', { 
                          ventiladores: { ...medida.vaos.ventiladores, quantidade: e.target.value } 
                        })}
                      />
                    </div>
                    
                    {parseInt(medida.vaos.ventiladores.quantidade) > 0 && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Largura (m)</label>
                          <input
                            type="text"
                            className="input-field"
                            placeholder="0.60"
                            value={medida.vaos.ventiladores.largura}
                            onChange={(e) => atualizarMedida(medida.id, 'vaos', { 
                              ventiladores: { ...medida.vaos.ventiladores, largura: e.target.value } 
                            })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Altura (m)</label>
                          <input
                            type="text"
                            className="input-field"
                            placeholder="0.60"
                            value={medida.vaos.ventiladores.altura}
                            onChange={(e) => atualizarMedida(medida.id, 'vaos', { 
                              ventiladores: { ...medida.vaos.ventiladores, altura: e.target.value } 
                            })}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Acesso */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Acesso</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Quantidade</label>
                      <input
                        type="number"
                        min="0"
                        className="input-field"
                        placeholder="0"
                        value={medida.vaos.acesso.quantidade}
                        onChange={(e) => atualizarMedida(medida.id, 'vaos', { 
                          acesso: { ...medida.vaos.acesso, quantidade: e.target.value } 
                        })}
                      />
                    </div>
                    
                    {parseInt(medida.vaos.acesso.quantidade) > 0 && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Largura (m)</label>
                          <input
                            type="text"
                            className="input-field"
                            placeholder="0.40"
                            value={medida.vaos.acesso.largura}
                            onChange={(e) => atualizarMedida(medida.id, 'vaos', { 
                              acesso: { ...medida.vaos.acesso, largura: e.target.value } 
                            })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">Altura (m)</label>
                          <input
                            type="text"
                            className="input-field"
                            placeholder="0.40"
                            value={medida.vaos.acesso.altura}
                            onChange={(e) => atualizarMedida(medida.id, 'vaos', { 
                              acesso: { ...medida.vaos.acesso, altura: e.target.value } 
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