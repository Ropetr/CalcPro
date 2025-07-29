// Exporta todos os calculadores de placas e tipos

export * from './types'
export * from './base-calculator'
export * from './grande'
export * from './pequena'

import { placaGrande } from './grande'
import { placaPequena } from './pequena'
import { PlacaCalculator } from './types'

// Mapeamento de tipos de placas disponíveis
export const TIPOS_PLACAS = {
  'grande': placaGrande,
  'pequena': placaPequena
} as const

export type TipoPlaca = keyof typeof TIPOS_PLACAS

// Função utilitária para obter calculadora por tipo
export function getCalculadoraPlaca(tipo: TipoPlaca): PlacaCalculator {
  const calculadora = TIPOS_PLACAS[tipo]
  if (!calculadora) {
    throw new Error(`Tipo de placa não encontrado: ${tipo}`)
  }
  return calculadora
}

// Função utilitária para listar todos os tipos disponíveis
export function listarTiposPlacas(): Array<{codigo: string, nome: string, dimensoes: string}> {
  return Object.entries(TIPOS_PLACAS).map(([codigo, calc]) => ({
    codigo,
    nome: calc.nomeCalculator,
    dimensoes: `${calc.dimensoesPlaca.largura}m × ${calc.dimensoesPlaca.comprimento}m`
  }))
}

// Função principal para cálculo - mantém compatibilidade com código original
export function calcularPlacas(
  larguraAmbiente: number, 
  comprimentoAmbiente: number, 
  tipoPlaca: TipoPlaca
) {
  const calculadora = getCalculadoraPlaca(tipoPlaca)
  return calculadora.calcular(larguraAmbiente, comprimentoAmbiente)
}