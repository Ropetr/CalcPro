'use client'

import { useState } from 'react'
import { 
  ArrowLeft, 
  Grid3X3, 
  Calculator, 
  FileText, 
  Download,
  Settings,
  Ruler,
  Package,
  Layers,
  Zap
} from 'lucide-react'
import Link from 'next/link'

export default function ForroModularPage() {
  const [dimensions, setDimensions] = useState({
    comprimento: '',
    largura: ''
  })

  const [tipoPlaca, setTipoPlaca] = useState('pvc')
  const [dimensaoPlaca, setDimensaoPlaca] = useState('1243x618')

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
                  <Grid3X3 className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Forro Modular</h1>
                  <p className="text-sm text-gray-600">Versátil para múltiplos materiais</p>
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

            {/* Tipo de Material */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de Placa</label>
              <select 
                value={tipoPlaca}
                onChange={(e) => setTipoPlaca(e.target.value)}
                className="input-field"
              >
                <option value="pvc">PVC Modular</option>
                <option value="isopor">Isopor</option>
                <option value="gesso">Gesso Modular</option>
                <option value="mineral">Fibra Mineral</option>
                <option value="fid">FID (Fibra Industrial)</option>
                <option value="rockfon">Rockfon</option>
              </select>
              <div className="mt-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="text-xs text-purple-800">
                  A estrutura de perfis T se mantém similar independente do material da placa.
                </div>
              </div>
            </div>

            {/* Dimensões das Placas */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Dimensões das Placas</label>
              <select 
                value={dimensaoPlaca}
                onChange={(e) => setDimensaoPlaca(e.target.value)}
                className="input-field"
              >
                <option value="1243x618">1,243 x 0,618 m (Padrão)</option>
                <option value="618x618">0,618 x 0,618 m (Quadrada)</option>
                <option value="1200x600">1,200 x 0,600 m</option>
                <option value="600x600">0,600 x 0,600 m</option>
                <option value="custom">Dimensão Personalizada</option>
              </select>
              
              {dimensaoPlaca === 'custom' && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Comprimento (m)</label>
                    <input
                      type="number"
                      step="0.001"
                      className="input-field text-sm"
                      placeholder="1.200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Largura (m)</label>
                    <input
                      type="number"
                      step="0.001"
                      className="input-field text-sm"
                      placeholder="0.600"
                    />
                  </div>
                </div>
              )}
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

            {/* Estrutura */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Configuração da Estrutura</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Perfil T Principal</label>
                  <select className="input-field">
                    <option>Perfil T 24mm Padrão</option>
                    <option>Perfil T 24mm Reforçado</option>
                    <option>Perfil T 15mm (Slim)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Perfil T Secundário</label>
                  <select className="input-field">
                    <option>Perfil T 24mm Padrão</option>
                    <option>Perfil T 24mm Reforçado</option>
                    <option>Perfil T 15mm (Slim)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Sistema de Suspensão</label>
                  <select className="input-field">
                    <option>Pendurais com Niveladores</option>
                    <option>Pendurais Simples</option>
                    <option>Sistema de Molas</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Vãos e Recortes */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Vãos e Recortes</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Luminárias</label>
                  <input
                    type="number"
                    min="0"
                    className="input-field"
                    placeholder="Quantidade"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Difusores de Ar</label>
                  <input
                    type="number"
                    min="0"
                    className="input-field"
                    placeholder="Quantidade"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Sprinklers</label>
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
                <Grid3X3 className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <div className="text-sm text-gray-600">Placas Necessárias</div>
                <div className="text-2xl font-bold text-gray-900">--</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <Package className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <div className="text-sm text-gray-600">Custo Estimado</div>
                <div className="text-2xl font-bold text-gray-900">R$ --</div>
              </div>
            </div>

            {/* Área de Desenho Técnico */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Plano de Modulação</h3>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Zap className="h-4 w-4" />
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
                    <Grid3X3 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <div className="text-gray-600">Plano de modulação será gerado após o cálculo</div>
                    <div className="text-sm text-gray-500">Inclui disposição das placas, perfis T e pontos de recorte</div>
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
                  <div className="text-sm mt-1">Inclui placas modulares, perfis T, cantoneiras e pendurais</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}