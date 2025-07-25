'use client'

import { useState } from 'react'
import { 
  ArrowLeft, 
  Square, 
  Calculator, 
  FileText, 
  Download,
  Settings,
  Ruler,
  Package,
  Scissors,
  Zap
} from 'lucide-react'
import Link from 'next/link'

export default function ForroPVCPage() {
  const [dimensions, setDimensions] = useState({
    comprimento: '',
    largura: ''
  })

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
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                  <Square className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Forro PVC</h1>
                  <p className="text-sm text-gray-600">Otimização de comprimentos em réguas</p>
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
        {/* Sidebar - Formulário */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Configurações do Projeto</h2>

            {/* Tipo de Régua */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de Régua PVC</label>
              <select className="input-field">
                <option>PVC Branco 200mm</option>
                <option>PVC Branco 250mm</option>
                <option>PVC Texturizado 200mm</option>
                <option>PVC Texturizado 250mm</option>
                <option>PVC Madeirado 200mm</option>
                <option>PVC Madeirado 250mm</option>
              </select>
            </div>

            {/* Comprimentos Disponíveis */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Comprimentos Comerciais</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                  <span className="text-sm text-gray-600">3,00m</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                  <span className="text-sm text-gray-600">4,00m</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-gray-300" defaultChecked />
                  <span className="text-sm text-gray-600">5,00m</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-sm text-gray-600">6,00m</span>
                </label>
              </div>
            </div>

            {/* Dimensões do Ambiente */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Dimensões do Ambiente</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Comprimento (m)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={dimensions.comprimento}
                    onChange={(e) => setDimensions({...dimensions, comprimento: e.target.value})}
                    className="input-field"
                    placeholder="Ex: 4.50"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Largura (m)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={dimensions.largura}
                    onChange={(e) => setDimensions({...dimensions, largura: e.target.value})}
                    className="input-field"
                    placeholder="Ex: 3.50"
                  />
                </div>
              </div>
            </div>

            {/* Perfis de Acabamento */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Perfis de Acabamento</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Cantoneira de Parede</label>
                  <select className="input-field">
                    <option>Cantoneira PVC Branca</option>
                    <option>Cantoneira PVC Colorida</option>
                    <option>Cantoneira Alumínio</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-sm text-gray-600">Incluir perfis H para emendas</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Configurações de Corte */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Otimização de Cortes</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Perda por Corte (cm)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    defaultValue="2"
                    className="input-field"
                    placeholder="2"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Aproveitamento Mínimo (cm)</label>
                  <input
                    type="number"
                    min="10"
                    max="100"
                    defaultValue="30"
                    className="input-field"
                    placeholder="30"
                  />
                </div>
              </div>
            </div>

            {/* Botão Calcular */}
            <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
              <Calculator className="h-5 w-5 mr-2" />
              Calcular e Otimizar
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
                <Square className="h-8 w-8 text-red-600 mx-auto mb-3" />
                <div className="text-sm text-gray-600">Réguas Necessárias</div>
                <div className="text-2xl font-bold text-gray-900">--</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <Scissors className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <div className="text-sm text-gray-600">% Aproveitamento</div>
                <div className="text-2xl font-bold text-gray-900">--%</div>
              </div>
            </div>

            {/* Área de Plano de Corte */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Plano de Corte Otimizado</h3>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Scissors className="h-4 w-4" />
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
                    <Scissors className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <div className="text-gray-600">Plano de corte otimizado será gerado após o cálculo</div>
                    <div className="text-sm text-gray-500">Mostra como cortar as réguas para minimizar desperdício</div>
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
                  <div className="text-sm mt-1">Inclui réguas PVC, cantoneiras e perfis de acabamento</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}