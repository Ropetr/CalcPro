'use client'

import { useState } from 'react'
import { calcularForroModularCompleto } from '@/lib/calculators/forro-modular'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function TestForroPage() {
  const [largura, setLargura] = useState('3.80')
  const [comprimento, setComprimento] = useState('2.70')
  const [tipoPlaca, setTipoPlaca] = useState<'grande' | 'pequena'>('grande')
  const [resultado, setResultado] = useState<any>(null)

  const calcular = () => {
    try {
      const result = calcularForroModularCompleto(
        parseFloat(largura), 
        parseFloat(comprimento), 
        tipoPlaca
      )
      setResultado(result)
      console.log('Resultado completo:', result)
    } catch (error) {
      console.error('Erro no cálculo:', error)
      alert('Erro no cálculo: ' + error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard/calculadoras"
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Teste - Sistema de Cálculo Forro Modular</h1>
          <p className="text-gray-600">Testando o novo sistema modular de placas e perfis T</p>
        </div>

        {/* Formulário de Teste */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Dados do Ambiente</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Largura (m)</label>
              <input
                type="number"
                step="0.01"
                value={largura}
                onChange={(e) => setLargura(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Comprimento (m)</label>
              <input
                type="number"
                step="0.01"
                value={comprimento}
                onChange={(e) => setComprimento(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">Tipo de Placa</label>
              <select
                value={tipoPlaca}
                onChange={(e) => setTipoPlaca(e.target.value as 'grande' | 'pequena')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="grande">Grande (0,625m × 1,25m)</option>
                <option value="pequena">Pequena (0,625m × 0,625m)</option>
              </select>
            </div>
          </div>
          
          <button
            onClick={calcular}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Calcular Materiais
          </button>
        </div>

        {/* Resultados */}
        {resultado && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Resultados</h2>
            
            {/* Resumo */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{resultado.resumoMateriais.totalPlacas}</div>
                <div className="text-sm text-blue-600">Placas</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{resultado.resumoMateriais.perfil312}</div>
                <div className="text-sm text-green-600">Perfil T 3,12m</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">{resultado.resumoMateriais.perfil125}</div>
                <div className="text-sm text-orange-600">Perfil T 1,25m</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">{resultado.resumoMateriais.perfil0625}</div>
                <div className="text-sm text-purple-600">Perfil T 0,625m</div>
              </div>
            </div>

            {/* Detalhes das Placas */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">📋 Detalhes das Placas</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Placas Inteiras:</strong> {resultado.placas.detalhamento.placasInteiras}
                  </div>
                  <div>
                    <strong>Placas com Recorte:</strong> {resultado.placas.detalhamento.placasComRecorte}
                  </div>
                </div>
                {resultado.placas.observacoes.length > 0 && (
                  <div className="mt-2">
                    <strong>Observações:</strong>
                    <ul className="text-sm text-gray-600 ml-4">
                      {resultado.placas.observacoes.map((obs: string, i: number) => (
                        <li key={i}>• {obs}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Detalhes dos Perfis */}
            <div>
              <h3 className="font-semibold mb-2">🔧 Detalhes dos Perfis</h3>
              
              {/* Perfil 3,12m */}
              {resultado.resumoMateriais.perfil312 > 0 && (
                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium text-green-800 mb-2">Perfil T 3,12m</h4>
                  <div className="text-sm text-green-700">
                    <div>Inteiras: {resultado.perfis.perfil312.inteiras}</div>
                    <div>Para recortes: {resultado.perfis.perfil312.detalhamento.barrasParaRecortes}</div>
                    <div>Total: {resultado.perfis.perfil312.total}</div>
                  </div>
                </div>
              )}

              {/* Perfil 1,25m */}
              {resultado.resumoMateriais.perfil125 > 0 && (
                <div className="bg-orange-50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium text-orange-800 mb-2">Perfil T 1,25m</h4>
                  <div className="text-sm text-orange-700">
                    <div>Inteiras: {resultado.perfis.perfil125.inteiras}</div>
                    <div>Para recortes: {resultado.perfis.perfil125.detalhamento.barrasParaRecortes}</div>
                    <div>Total: {resultado.perfis.perfil125.total}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}