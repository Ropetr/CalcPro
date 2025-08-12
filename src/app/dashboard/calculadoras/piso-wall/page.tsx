'use client'

import { useState } from 'react'
import { 
  ArrowLeft, 
  Package, 
  Calculator, 
  FileText, 
  Download,
  Settings,
  Ruler,
  Hammer,
  Volume2,
  Layers
} from 'lucide-react'
import Link from 'next/link'
import { useKeyboardNavigation } from '@/lib/ui-standards/navigation/useKeyboardNavigation'
import { NavigationHelp } from '@/lib/ui-standards/navigation/components/NavigationHelp'
import { autoCompleteDimension } from '@/lib/ui-standards/formatting/formatters'

export default function PisoWallPage() {
  const [dimensions, setDimensions] = useState({
    comprimento: '',
    largura: ''
  })

  const [incluirBandaAcustica, setIncluirBandaAcustica] = useState(false)

  // Sistema de navegação por teclado
  const navigation = useKeyboardNavigation()

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
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                  <Package className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Piso Wall</h1>
                  <p className="text-sm text-gray-600">Simplicidade e eficiência com chapas</p>
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
        {/* Sidebar - Formulário */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Configurações do Projeto</h2>

            {/* Especificações da Chapa */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Especificações</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Dimensões da Chapa</label>
                  <select className="input-field">
                    <option>1200 x 2400mm - Padrão</option>
                    <option>1220 x 2440mm - Importada</option>
                    <option>1250 x 2500mm - Especial</option>
                    <option>Dimensão Personalizada</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Espessura</label>
                  <select className="input-field">
                    <option>18mm - Padrão</option>
                    <option>15mm - Econômico</option>
                    <option>20mm - Reforçado</option>
                    <option>25mm - Super Reforçado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Acabamento</label>
                  <select className="input-field">
                    <option>Laminado Melamínico</option>
                    <option>Laminado Texturizado</option>
                    <option>BP (Baixa Pressão)</option>
                    <option>Verniz UV</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Dimensões do Ambiente */}
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
                    onKeyDown={navigation.handleKeyDown}
                    className="input-field"
                    placeholder="Ex: 4,50"
                    data-nav-index={0}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Largura (m)</label>
                  <input
                    type="text"
                    value={dimensions.largura}
                    onChange={(e) => setDimensions({...dimensions, largura: e.target.value})}
                    onBlur={(e) => handleDimensionBlur('largura', e.target.value)}
                    onKeyDown={navigation.handleKeyDown}
                    className="input-field"
                    placeholder="Ex: 3,50"
                    data-nav-index={1}
                  />
                </div>
              </div>
            </div>

            {/* Detalhes de Fixação */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Sistema de Fixação</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Tipo de Parafuso</label>
                  <select className="input-field">
                    <option>Autoatarrachante 25mm</option>
                    <option>Autoatarrachante 32mm</option>
                    <option>Autoperfurante 25mm</option>
                    <option>Autoperfurante 32mm</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Espaçamento dos Parafusos</label>
                  <select className="input-field">
                    <option>30cm x 30cm - Padrão</option>
                    <option>25cm x 25cm - Reforçado</option>
                    <option>40cm x 40cm - Econômico</option>
                  </select>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="text-xs text-gray-700">
                    <strong>Nota:</strong> O cálculo seguirá as recomendações do fabricante para amarração das chapas.
                  </div>
                </div>
              </div>
            </div>

            {/* Isolamento Acústico */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Isolamento Acústico</h3>
              <div className="space-y-4">
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300"
                    checked={incluirBandaAcustica}
                    onChange={(e) => setIncluirBandaAcustica(e.target.checked)}
                  />
                  <span className="text-sm text-gray-600">Incluir Banda Acústica</span>
                </label>
                
                {incluirBandaAcustica && (
                  <div className="ml-6 space-y-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Tipo de Banda</label>
                      <select className="input-field text-sm">
                        <option>Banda EVA 5mm</option>
                        <option>Banda EVA 10mm</option>
                        <option>Banda Butílica</option>
                        <option>Banda Poliuretano</option>
                      </select>
                    </div>
                    <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                      <div className="text-xs text-blue-800">
                        A banda acústica será colada na estrutura metálica existente.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Perda por Corte */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Configurações de Corte</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Perda por Corte (%)</label>
                  <input
                    type="number"
                    min="5"
                    max="20"
                    defaultValue="10"
                    className="input-field"
                    placeholder="10"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Aproveitamento Mínimo (cm)</label>
                  <input
                    type="number"
                    min="20"
                    max="100"
                    defaultValue="40"
                    className="input-field"
                    placeholder="40"
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
                <div className="text-sm text-gray-600">Área Total</div>
                <div className="text-2xl font-bold text-gray-900">
                  {dimensions.comprimento && dimensions.largura ? 
                    (parseFloat(dimensions.comprimento) * parseFloat(dimensions.largura)).toFixed(2) : '0.00'
                  } m²
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <Package className="h-8 w-8 text-gray-600 mx-auto mb-3" />
                <div className="text-sm text-gray-600">Chapas Necessárias</div>
                <div className="text-2xl font-bold text-gray-900">--</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <Hammer className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                <div className="text-sm text-gray-600">Parafusos</div>
                <div className="text-2xl font-bold text-gray-900">--</div>
              </div>
            </div>

            {/* Área de Desenho Técnico */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Plano de Corte</h3>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Layers className="h-4 w-4" />
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
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <div className="text-gray-600">Plano de corte será gerado após o cálculo</div>
                    <div className="text-sm text-gray-500">Mostra aproveitamento otimizado das chapas</div>
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
                  <div className="text-sm mt-1">Inclui chapas Wall, parafusos e banda acústica (se selecionada)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}