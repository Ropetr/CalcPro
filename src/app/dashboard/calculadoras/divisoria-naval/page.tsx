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
  Layers,
  Package,
  AlertCircle,
  Eye
} from 'lucide-react'
import Link from 'next/link'
import { useKeyboardNavigation } from '@/lib/ui-standards/navigation/useKeyboardNavigation'
import { NavigationHelp } from '@/lib/ui-standards/navigation/components/NavigationHelp'
import { autoCompleteDimension } from '@/lib/ui-standards/formatting/formatters'

export default function DivisoriaNavalPage() {
  const [dimensions, setDimensions] = useState({
    altura: '',
    largura: '',
    espessura: '35'
  })

  const [vaos, setVaos] = useState({
    vidros: 0,
    portas: 0
  })

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
        {/* Sidebar - Formulário */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Configurações do Projeto</h2>

            {/* Tipo de Painel */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de Painel</label>
              <select className="input-field">
                <option value="35">35mm - Padrão</option>
                <option value="45">45mm - Reforçado</option>
                <option value="55">55mm - Extra Resistente</option>
              </select>
              <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-xs text-blue-800">
                  Painéis com miolo colmeia oferecem excelente isolamento acústico e leveza estrutural.
                </div>
              </div>
            </div>

            {/* Dimensões */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Dimensões da Parede</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Altura (m)</label>
                  <input
                    type="text"
                    value={dimensions.altura}
                    onChange={(e) => setDimensions({...dimensions, altura: e.target.value})}
                    onBlur={(e) => handleDimensionBlur('altura', e.target.value)}
                    onKeyDown={navigation.handleKeyDown}
                    data-nav-index={0}
                    className="input-field"
                    placeholder="Ex: 2,70"
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
                    data-nav-index={1}
                    className="input-field"
                    placeholder="Ex: 3,50"
                  />
                </div>
              </div>
            </div>

            {/* Perfis e Acabamentos */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Perfis e Acabamentos</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Perfil de Junção</label>
                  <select className="input-field">
                    <option>Perfil H - Padrão</option>
                    <option>Perfil H - Cromado</option>
                    <option>Perfil H - Anodizado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Perfil de Requadramento</label>
                  <select className="input-field">
                    <option>Perfil U - Padrão</option>
                    <option>Perfil U - Cromado</option>
                    <option>Perfil U - Anodizado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Acabamento do Painel</label>
                  <select className="input-field">
                    <option>Laminado Melamínico</option>
                    <option>Laminado Texturizado</option>
                    <option>Fórmica</option>
                    <option>Verniz Natural</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Vãos e Aberturas */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Vãos e Aberturas</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Vãos de Vidro</label>
                  <input
                    type="number"
                    min="0"
                    value={vaos.vidros}
                    onChange={(e) => setVaos({...vaos, vidros: parseInt(e.target.value) || 0})}
                    className="input-field"
                    placeholder="Quantidade"
                  />
                  {vaos.vidros > 0 && (
                    <div className="mt-2 text-xs text-gray-600">
                      Inclui perfis de leito, baguetes e tarugos específicos
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Kits de Porta</label>
                  <input
                    type="number"
                    min="0"
                    value={vaos.portas}
                    onChange={(e) => setVaos({...vaos, portas: parseInt(e.target.value) || 0})}
                    className="input-field"
                    placeholder="Quantidade"
                  />
                  {vaos.portas > 0 && (
                    <div className="mt-2 text-xs text-gray-600">
                      Inclui dobradiças, fechaduras e maçanetas
                    </div>
                  )}
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
                  {dimensions.altura && dimensions.largura ? 
                    (parseFloat(dimensions.altura) * parseFloat(dimensions.largura)).toFixed(2) : '0.00'
                  } m²
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <Layers className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                <div className="text-sm text-gray-600">Painéis Necessários</div>
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
                  <h3 className="text-lg font-medium text-gray-900">Desenho Técnico e Plano de Corte</h3>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600">
                      <Eye className="h-4 w-4" />
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
                    <Waves className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <div className="text-gray-600">Desenho técnico e plano de corte serão gerados após o cálculo</div>
                    <div className="text-sm text-gray-500">Inclui posicionamento de perfis H, U e detalhes de montagem</div>
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
                  <div className="text-sm mt-1">Inclui painéis, perfis H/U, kits de porta, acessórios de vidro</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}