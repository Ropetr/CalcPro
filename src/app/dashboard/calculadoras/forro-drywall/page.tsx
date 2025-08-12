'use client'

import { useState } from 'react'
import { 
  ArrowLeft, 
  Layers, 
  Calculator, 
  FileText, 
  Download,
  Settings,
  Ruler,
  Lightbulb,
  Package,
  AlertCircle,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import { useKeyboardNavigation } from '@/lib/ui-standards/navigation/useKeyboardNavigation'
import { NavigationHelp } from '@/lib/ui-standards/navigation/components/NavigationHelp'
import { autoCompleteDimension } from '@/lib/ui-standards/formatting/formatters'

export default function ForroDrywallPage() {
  const [modalidade, setModalidade] = useState<'abnt' | 'generica'>('abnt')
  const [dimensions, setDimensions] = useState({
    comprimento: '',
    largura: '',
    altura: '2.70'
  })

  const [detalhes, setDetalhes] = useState({
    sancaAberta: false,
    sancaFechada: false,
    cortineiro: false,
    iluminacaoIndireta: false
  })

  // Sistema de navegação por teclado
  const { 
    currentFocusIndex, 
    handleKeyDown, 
    focusElement,
    addItem,
    calculate 
  } = useKeyboardNavigation()

  // Função para formatação automática
  const handleDimensionBlur = (field: string, value: string) => {
    const formatted = autoCompleteDimension(value)
    setDimensions(prev => ({
      ...prev,
      [field]: formatted
    }))
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
                  <h1 className="text-xl font-bold text-gray-900">Forro Drywall</h1>
                  <p className="text-sm text-gray-600">Forros suspensos com sancas e cortineiros</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <NavigationHelp />
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
        {/* Sidebar - Formulário */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Configurações do Projeto</h2>

            {/* Modalidade */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Modalidade de Cálculo</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setModalidade('abnt')}
                  className={`p-3 text-sm border rounded-lg transition-colors ${
                    modalidade === 'abnt'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium">ABNT</div>
                  <div className="text-xs text-gray-500">Padrão técnico</div>
                </button>
                <button
                  onClick={() => setModalidade('generica')}
                  className={`p-3 text-sm border rounded-lg transition-colors ${
                    modalidade === 'generica'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="font-medium">Genérica</div>
                  <div className="text-xs text-gray-500">Flexível</div>
                </button>
              </div>
            </div>

            {/* Dimensões */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Dimensões do Ambiente</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Comprimento (m)</label>
                  <input
                    type="text"
                    value={dimensions.comprimento}
                    onChange={(e) => setDimensions({...dimensions, comprimento: e.target.value})}
                    onBlur={(e) => handleDimensionBlur('comprimento', e.target.value)}
                    onKeyDown={handleKeyDown}
                    data-nav-index={0}
                    className="input-field"
                    placeholder="Ex: 4,50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Largura (m)</label>
                  <input
                    type="text"
                    value={dimensions.largura}
                    onChange={(e) => setDimensions({...dimensions, largura: e.target.value})}
                    onBlur={(e) => handleDimensionBlur('largura', e.target.value)}
                    onKeyDown={handleKeyDown}
                    data-nav-index={1}
                    className="input-field"
                    placeholder="Ex: 3,50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Altura (m)</label>
                  <input
                    type="text"
                    value={dimensions.altura}
                    onChange={(e) => setDimensions({...dimensions, altura: e.target.value})}
                    onBlur={(e) => handleDimensionBlur('altura', e.target.value)}
                    onKeyDown={handleKeyDown}
                    data-nav-index={2}
                    className="input-field"
                    placeholder="Ex: 2,70"
                  />
                </div>
              </div>
            </div>

            {/* Configuração do Forro */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Configuração</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Tipo de Chapa</label>
                  <select className="input-field">
                    <option>Drywall Padrão 12.5mm</option>
                    <option>Drywall RU (Resistente à Umidade)</option>
                    <option>Drywall RF (Resistente ao Fogo)</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm text-gray-600">Incluir isolamento acústico</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Detalhes e Acessórios */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Detalhes e Acessórios</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300"
                    checked={detalhes.sancaAberta}
                    onChange={(e) => setDetalhes({...detalhes, sancaAberta: e.target.checked})}
                  />
                  <span className="text-sm text-gray-600">Sanca Aberta</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300"
                    checked={detalhes.sancaFechada}
                    onChange={(e) => setDetalhes({...detalhes, sancaFechada: e.target.checked})}
                  />
                  <span className="text-sm text-gray-600">Sanca Fechada</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300"
                    checked={detalhes.cortineiro}
                    onChange={(e) => setDetalhes({...detalhes, cortineiro: e.target.checked})}
                  />
                  <span className="text-sm text-gray-600">Cortineiro</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300"
                    checked={detalhes.iluminacaoIndireta}
                    onChange={(e) => setDetalhes({...detalhes, iluminacaoIndireta: e.target.checked})}
                  />
                  <span className="text-sm text-gray-600">Iluminação Indireta</span>
                </label>
              </div>
            </div>

            {/* Luminárias */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Luminárias e Pontos</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Luminárias Embutidas</label>
                  <input
                    type="number"
                    min="0"
                    className="input-field"
                    placeholder="Quantidade"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Pontos de Ar Condicionado</label>
                  <input
                    type="number"
                    min="0"
                    className="input-field"
                    placeholder="Quantidade"
                  />
                </div>
              </div>
            </div>

            {/* Botão Calcular */}
            <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
              <Calculator className="h-5 w-5 mr-2" />
              Calcular Materiais
            </button>
          </div>
        </div>

        {/* Main Content - Área de Resultados */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Cards de Informação */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <Ruler className="h-8 w-8 text-primary-600 mx-auto mb-3" />
                <div className="text-sm text-gray-600">Área do Forro</div>
                <div className="text-2xl font-bold text-gray-900">
                  {dimensions.comprimento && dimensions.largura ? 
                    (parseFloat(dimensions.comprimento) * parseFloat(dimensions.largura)).toFixed(2) : '0.00'
                  } m²
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <Layers className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <div className="text-sm text-gray-600">Chapas Necessárias</div>
                <div className="text-2xl font-bold text-gray-900">--</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <Package className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                <div className="text-sm text-gray-600">Custo Estimado</div>
                <div className="text-2xl font-bold text-gray-900">R$ --</div>
              </div>
            </div>

            {/* Área de Desenho Técnico */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Desenho Técnico do Forro</h3>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Lightbulb className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Layers className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <div className="text-gray-600">Desenho técnico será gerado após o cálculo</div>
                    <div className="text-sm text-gray-500">Inclui estrutura, sancas, cortineiros e pontos de iluminação</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de Materiais */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Lista de Materiais</h3>
              </div>
              <div className="p-6">
                <div className="text-center text-gray-500 py-8">
                  <Calculator className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                  <div>Execute o cálculo para ver a lista detalhada de materiais</div>
                  <div className="text-sm mt-1">Inclui chapas, perfis, pendurais, niveladores e acessórios</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}