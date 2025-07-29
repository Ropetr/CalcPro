// Sistema completo de cálculo para forro modular

export * from './placas'
export * from './perfis'

import { calcularPlacas } from './placas'
import { calcularPerfisT } from './perfis'

/**
 * Função principal que calcula um projeto completo de forro modular
 */
export function calcularForroModularCompleto(
  larguraAmbiente: number,
  comprimentoAmbiente: number,
  tipoPlaca: 'grande' | 'pequena' = 'grande'
) {
  // Calcular placas
  const resultadoPlacas = calcularPlacas(larguraAmbiente, comprimentoAmbiente, tipoPlaca)
  
  // Calcular perfis T usando as dimensões da placa escolhida
  const resultadoPerfis = calcularPerfisT(
    larguraAmbiente, 
    comprimentoAmbiente, 
    resultadoPlacas.dimensoesPlaca
  )
  
  return {
    placas: resultadoPlacas,
    perfis: resultadoPerfis,
    ambiente: {
      largura: larguraAmbiente,
      comprimento: comprimentoAmbiente,
      area: larguraAmbiente * comprimentoAmbiente,
      tipoPlaca
    },
    resumoMateriais: {
      totalPlacas: resultadoPlacas.totalPlacas,
      perfil312: resultadoPerfis.resumo.totalBarras312,
      perfil125: resultadoPerfis.resumo.totalBarras125,
      perfil0625: resultadoPerfis.resumo.totalBarras0625
    }
  }
}

/**
 * Função para múltiplos ambientes
 */
export function calcularMultiplosAmbientesCompleto(
  ambientes: Array<{
    largura: number
    comprimento: number
    nome: string
    tipoPlaca?: 'grande' | 'pequena'
  }>
) {
  const resultados = ambientes.map(ambiente => {
    const tipoPlaca = ambiente.tipoPlaca || 'grande'
    return {
      nome: ambiente.nome,
      ...calcularForroModularCompleto(ambiente.largura, ambiente.comprimento, tipoPlaca)
    }
  })
  
  // Consolidar totais
  const totaisConsolidados = {
    totalPlacas: resultados.reduce((sum, r) => sum + r.resumoMateriais.totalPlacas, 0),
    totalPerfil312: resultados.reduce((sum, r) => sum + r.resumoMateriais.perfil312, 0),
    totalPerfil125: resultados.reduce((sum, r) => sum + r.resumoMateriais.perfil125, 0),
    totalPerfil0625: resultados.reduce((sum, r) => sum + r.resumoMateriais.perfil0625, 0),
    areaTotal: resultados.reduce((sum, r) => sum + r.ambiente.area, 0)
  }
  
  return {
    ambientes: resultados,
    totais: totaisConsolidados
  }
}