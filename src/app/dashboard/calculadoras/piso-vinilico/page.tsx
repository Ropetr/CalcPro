'use client'

import { useState } from 'react'
import { 
  ArrowLeft, 
  Waves, 
  Calculator, 
  FileText, 
  Download,
  Settings,
  Ruler,
  Package,
  Droplets,
  Layers
} from 'lucide-react'
import Link from 'next/link'
import { useKeyboardNavigation } from '@/lib/ui-standards/navigation/useKeyboardNavigation'
import { NavigationHelp } from '@/lib/ui-standards/navigation/components/NavigationHelp'
import { autoCompleteDimension } from '@/lib/ui-standards/formatting/formatters'

export default function PisoVinicilicoPage() {
  const [dimensions, setDimensions] = useState({
    comprimento: '',
    largura: ''
  })

  const [uso, setUso] = useState('residencial')

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
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                  <Waves className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Piso Vinílico</h1>
                  <p className="text-sm text-gray-600">Inclui autonivelante e hidrofugante</p>
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

            {/* Tipo de Uso */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de Uso</label>
              <select 
                value={uso}
                onChange={(e) => setUso(e.target.value)}
                className="input-field"
              >
                <option value="residencial">Residencial</option>
                <option value="comercial">Comercial</option>
                <option value="industrial">Industrial</option>
              </select>
            </div>

            {/* Especificações do Piso */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Especificações</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Espessura Total</label>
                  <select className="input-field">
                    <option>2mm - Básico</option>
                    <option>3mm - Padrão</option>
                    <option>4mm - Premium</option>
                    <option>5mm - Super Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Capa de Uso (Wear Layer)</label>
                  <select className="input-field">
                    <option>0.1mm - Residencial Leve</option>
                    <option>0.2mm - Residencial</option>
                    <option>0.3mm - Comercial Leve</option>
                    <option>0.5mm - Comercial</option>
                    <option>0.7mm - Industrial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Tipo de Instalação</label>
                  <select className="input-field">
                    <option>Cola - Tradicional</option>
                    <option>Click - Flutuante</option>
                    <option>Autoportante</option>
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
              </div>
            </div>

            {/* Preparo da Base */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Preparo da Base</h3>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                    <span className="text-sm text-gray-600">Autonivelante</span>
                  </label>
                  <div className="ml-6 mt-2">
                    <label className="block text-xs text-gray-500 mb-1">Espessura (mm)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      defaultValue="3"
                      className="input-field text-sm"
                      placeholder="3"
                    />
                  </div>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm text-gray-600">Hidrofugante</span>
                  </label>
                  <div className="ml-6 mt-1 text-xs text-gray-500">
                    Recomendado para áreas úmidas
                  </div>
                </div>
              </div>
            </div>

            {/* Adesivos e Colas */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Adesivos</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Tipo de Cola</label>
                  <select className="input-field">
                    <option>Cola Base Água</option>
                    <option>Cola PU (Poliuretano)</option>
                    <option>Cola Acrilica</option>
                    <option>Cola Epóxi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Rendimento (m²/galão)</label>
                  <input
                    type="number"
                    min="10"
                    max="50"
                    defaultValue="25"
                    className="input-field"
                    placeholder="25"
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                <Package className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
                <div className="text-sm text-gray-600">Piso Vinílico</div>
                <div className="text-2xl font-bold text-gray-900">-- m²</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <Layers className="h-8 w-8 text-gray-600 mx-auto mb-3" />
                <div className="text-sm text-gray-600">Autonivelante</div>
                <div className="text-2xl font-bold text-gray-900">-- kg</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <Droplets className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <div className="text-sm text-gray-600">Cola</div>
                <div className="text-2xl font-bold text-gray-900">-- L</div>
              </div>
            </div>

            {/* Área de Desenho Técnico */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Plano de Instalação</h3>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Settings className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Waves className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <div className="text-gray-600">Plano de instalação será gerado após o cálculo</div>
                    <div className="text-sm text-gray-500">Inclui preparo da base e sequência de aplicação</div>
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
                  <div className="text-sm mt-1">Inclui piso vinílico, autonivelante, hidrofugante e adesivos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}