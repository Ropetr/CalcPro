'use client'

import { useState } from 'react'
import { ArrowLeft, Calculator, Layers, TrendingUp, Scissors, CheckCircle, AlertCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { analisarCortesOtimizados, testarOtimizacao, type OpcaoCorte, type AnaliseCortes } from '@/lib/calculators/divisoria-drywall/otimizacao-cortes'

export default function SimulacaoCortesPage() {
  const [alturaParede, setAlturaParede] = useState('4.00')
  const [tipoChapa, setTipoChapa] = useState<'1.80' | '2.40'>('1.80')
  const [analise, setAnalise] = useState<AnaliseCortes | null>(null)
  const [loading, setLoading] = useState(false)

  const executarAnalise = () => {
    setLoading(true)
    try {
      const altura = parseFloat(alturaParede.replace(',', '.'))
      const resultado = analisarCortesOtimizados(altura, tipoChapa)
      setAnalise(resultado)
      
      // Executar teste no console também
      testarOtimizacao(altura, tipoChapa)
    } catch (error) {
      console.error('Erro na análise:', error)
      alert('Erro ao executar análise. Verifique os valores.')
    } finally {
      setLoading(false)
    }
  }

  const getViabilidadeIcon = (viabilidade: string) => {
    switch (viabilidade) {
      case 'ótima': return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'boa': return <CheckCircle className="h-5 w-5 text-blue-500" />
      case 'aceitável': return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default: return <XCircle className="h-5 w-5 text-red-500" />
    }
  }

  const getViabilidadeCor = (viabilidade: string) => {
    switch (viabilidade) {
      case 'ótima': return 'border-green-500 bg-green-50'
      case 'boa': return 'border-blue-500 bg-blue-50'
      case 'aceitável': return 'border-yellow-500 bg-yellow-50'
      default: return 'border-red-500 bg-red-50'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard/calculadoras/divisoria-drywall"
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Voltar
              </Link>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Scissors className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Simulação de Cortes Inteligentes</h1>
                  <p className="text-sm text-gray-600">Sistema de otimização combinatória para chapas drywall</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1">
        <div className="hidden sm:block w-4 bg-gray-100"></div>

        <div className="flex-1 p-3 sm:p-6">
          <div className="max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto">
            
            {/* Painel de Controles */}
            <div className="bg-white rounded-lg shadow mb-6 sm:mb-8">
              <div className="p-4 sm:p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Calculator className="h-5 w-5 mr-2 text-purple-600" />
                  Parâmetros da Simulação
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Altura da Parede (m)
                    </label>
                    <input
                      type="text"
                      value={alturaParede}
                      onChange={(e) => setAlturaParede(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Ex: 4,00 ou 3,70"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      Exemplos: 3,70m, 4,00m, 2,80m
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Chapa
                    </label>
                    <select
                      value={tipoChapa}
                      onChange={(e) => setTipoChapa(e.target.value as '1.80' | '2.40')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="1.80">1,20 × 1,80m (Standard)</option>
                      <option value="2.40">1,20 × 2,40m (Alta)</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      onClick={executarAnalise}
                      disabled={loading}
                      className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          Analisando...
                        </>
                      ) : (
                        <>
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Analisar Cortes
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Informações técnicas */}
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-medium text-purple-900 mb-2">💡 Como Funciona o Sistema</h3>
                  <ul className="text-sm text-purple-800 space-y-1">
                    <li>• <strong>Divisões analisadas:</strong> 1, 2, 3, 4, 5, 6... até recorte mínimo de 0,30m</li>
                    <li>• <strong>Critérios:</strong> Máximo aproveitamento + desencontro ≥ 0,30m + menor desperdício</li>
                    <li>• <strong>Amarração:</strong> Faixas ímpares vs pares com desencontro otimizado</li>
                    <li>• <strong>Análise:</strong> Algoritmo combinatório para encontrar melhor solução</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Resultados */}
            {analise && (
              <>
                {/* Recomendação Principal */}
                <div className="bg-white rounded-lg shadow mb-6">
                  <div className="p-4 sm:p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                      🏆 Melhor Solução Encontrada
                    </h2>
                    
                    <div className={`border-2 rounded-lg p-4 ${getViabilidadeCor(analise.recomendacao.viabilidade)}`}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg flex items-center">
                            {getViabilidadeIcon(analise.recomendacao.viabilidade)}
                            <span className="ml-2">Divisão {analise.recomendacao.divisao} - {analise.recomendacao.viabilidade.toUpperCase()}</span>
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{analise.recomendacao.justificativa}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{analise.recomendacao.aproveitamento.toFixed(1)}%</div>
                          <div className="text-xs text-gray-500">Aproveitamento</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-semibold">{analise.recomendacao.desencontro.toFixed(2)}m</div>
                          <div className="text-gray-600">Desencontro</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">{analise.recomendacao.desperdicio.toFixed(3)}m</div>
                          <div className="text-gray-600">Desperdício</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">{analise.recomendacao.numeroChapas}</div>
                          <div className="text-gray-600">Chapas</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold">R$ {analise.recomendacao.custoMaterial.toFixed(0)}</div>
                          <div className="text-gray-600">Custo Est.</div>
                        </div>
                      </div>
                      
                      {/* Padrão de Amarração */}
                      <div className="mt-4 p-3 bg-white bg-opacity-50 rounded">
                        <h4 className="font-medium mb-2">📐 Padrão de Amarração</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div>
                            <strong>Faixas Ímpares (1ª, 3ª, 5ª...):</strong>
                            <div className="font-mono bg-gray-100 p-1 rounded mt-1">
                              {analise.recomendacao.padrao.faixasImpares.sequencia.map(h => h.toFixed(2)).join(' + ')} = {analise.recomendacao.padrao.faixasImpares.total.toFixed(2)}m
                            </div>
                          </div>
                          <div>
                            <strong>Faixas Pares (2ª, 4ª, 6ª...):</strong>
                            <div className="font-mono bg-gray-100 p-1 rounded mt-1">
                              {analise.recomendacao.padrao.faixasPares.sequencia.map(h => h.toFixed(2)).join(' + ')} = {analise.recomendacao.padrao.faixasPares.total.toFixed(2)}m
                            </div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <strong>Juntas Horizontais:</strong> {analise.recomendacao.padrao.juntasHorizontais.map(j => j.toFixed(2)).join(', ')}m
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Todas as Opções */}
                <div className="bg-white rounded-lg shadow">
                  <div className="p-4 sm:p-6">
                    <h2 className="text-lg font-semibold mb-4 flex items-center">
                      <Layers className="h-5 w-5 mr-2 text-gray-600" />
                      Todas as Opções Analisadas ({analise.opcoes.length})
                    </h2>
                    
                    <div className="space-y-4">
                      {analise.opcoes.map((opcao, index) => (
                        <div key={opcao.id} className={`border rounded-lg p-4 ${index === 0 ? 'border-green-400 bg-green-50' : getViabilidadeCor(opcao.viabilidade)}`}>
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium flex items-center">
                              {index === 0 && <span className="text-green-600 mr-2">🏆</span>}
                              {getViabilidadeIcon(opcao.viabilidade)}
                              <span className="ml-2">Divisão {opcao.divisao}</span>
                              <span className="ml-2 text-sm text-gray-500">
                                ({opcao.alturas.map(h => h.toFixed(2)).join(' + ')}m)
                              </span>
                            </h3>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              opcao.viabilidade === 'ótima' ? 'bg-green-100 text-green-800' :
                              opcao.viabilidade === 'boa' ? 'bg-blue-100 text-blue-800' :
                              opcao.viabilidade === 'aceitável' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {opcao.viabilidade.toUpperCase()}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                            <div className="text-center">
                              <div className="font-semibold">{opcao.desencontro.toFixed(2)}m</div>
                              <div className="text-gray-600">Desencontro</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold">{opcao.aproveitamento.toFixed(1)}%</div>
                              <div className="text-gray-600">Aproveit.</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold">{opcao.desperdicio.toFixed(3)}m</div>
                              <div className="text-gray-600">Desperdício</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold">{opcao.numeroChapas}</div>
                              <div className="text-gray-600">Chapas</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold">R$ {opcao.custoMaterial.toFixed(0)}</div>
                              <div className="text-gray-600">Custo</div>
                            </div>
                          </div>
                          
                          <div className="mt-2 text-xs text-gray-600">
                            {opcao.justificativa}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}