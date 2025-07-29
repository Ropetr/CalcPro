// Exporta sistema completo de perfis T

export * from './types'
export * from './calculator'

import { perfilTCalculator, PERFIS_T } from './calculator'

// Função utilitária para cálculo simples
export function calcularPerfisT(
  larguraAmbiente: number,
  comprimentoAmbiente: number,
  dimensoesPlaca: { largura: number; comprimento: number } = { largura: 0.625, comprimento: 1.25 }
) {
  return perfilTCalculator.calcularAmbiente(larguraAmbiente, comprimentoAmbiente, dimensoesPlaca)
}

// Função para múltiplos ambientes
export function calcularPerfisMultiplosAmbientes(
  ambientes: Array<{
    largura: number
    comprimento: number
    nome: string
  }>,
  dimensoesPlaca: { largura: number; comprimento: number } = { largura: 0.625, comprimento: 1.25 }
) {
  return perfilTCalculator.calcularMultiplosAmbientes(ambientes, dimensoesPlaca)
}

// Exportar perfis disponíveis
export { PERFIS_T }