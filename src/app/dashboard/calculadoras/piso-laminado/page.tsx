'use client'

import { useState } from 'react'
import { 
  ArrowLeft, 
  Ruler, 
  Calculator, 
  FileText, 
  Download,
  Settings,
  Package,
  Layers,
  Home,
  Building
} from 'lucide-react'
import Link from 'next/link'
import { useKeyboardNavigation } from '@/lib/ui-standards/navigation/useKeyboardNavigation'
import { NavigationHelp } from '@/lib/ui-standards/navigation/components/NavigationHelp'
import { autoCompleteDimension } from '@/lib/ui-standards/formatting/formatters'

export default function PisoLaminadoPage() {
  const [dimensions, setDimensions] = useState({
    comprimento: '',
    largura: ''
  })

  const [uso, setUso] = useState<'residencial' | 'comercial'>('residencial')

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
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
                  <Ruler className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Piso Laminado</h1>
                  <p className="text-sm text-gray-600">Variedade completa para todos os projetos</p>
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
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setUso('residencial')}
                  className={`p-3 text-sm border rounded-lg transition-colors ${
                    uso === 'residencial'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Home className="h-5 w-5 mx-auto mb-1" />
                  <div className="font-medium">Residencial</div>
                </button>
                <button
                  onClick={() => setUso('comercial')}
                  className={`p-3 text-sm border rounded-lg transition-colors ${
                    uso === 'comercial'
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <Building className="h-5 w-5 mx-auto mb-1" />
                  <div className="font-medium">Comercial</div>
                </button>
              </div>
            </div>

            {/* Especificações do Piso */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Especificações</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Resistência à Abrasão</label>
                  <select className="input-field">
                    <option value="ac3">AC3 - Residencial</option>
                    <option value="ac4">AC4 - Comercial Leve</option>
                    <option value="ac5">AC5 - Comercial Intenso</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Espessura</label>
                  <select className="input-field">
                    <option>7mm - Básico</option>
                    <option>8mm - Padrão</option>
                    <option>10mm - Confort</option>
                    <option>12mm - Premium</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Dimensão da Régua</label>
                  <select className="input-field">
                    <option>1215 x 197mm</option>
                    <option>1380 x 193mm</option>
                    <option>1845 x 244mm</option>
                    <option>Personalizada</option>
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

            {/* Padrão de Instalação */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Padrão de Instalação</h3>
              <select className="input-field">
                <option>Reto (Paralelo)</option>
                <option>Diagonal (45°)</option>
                <option>Espinha de Peixe</option>
              </select>
            </div>

            {/* Acessórios */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Acessórios</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                  <span className="text-sm text-gray-600">Manta Acústica</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                  <span className="text-sm text-gray-600">Rodapé</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-sm text-gray-600">Perfis de Transição</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-sm text-gray-600">Cantoneiras</span>
                </label>
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
                <Package className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
                <div className="text-sm text-gray-600">Caixas Necessárias</div>
                <div className="text-2xl font-bold text-gray-900">--</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <Layers className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <div className="text-sm text-gray-600">Custo Estimado</div>
                <div className="text-2xl font-bold text-gray-900">R$ --</div>
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
                    <Ruler className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <div className="text-gray-600">Plano de instalação será gerado após o cálculo</div>
                    <div className="text-sm text-gray-500">Inclui padrão de assentamento e cortes otimizados</div>
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
                  <div className="text-sm mt-1">Inclui piso laminado, manta, rodapé e perfis de acabamento</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}