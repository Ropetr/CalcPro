// Exporta sistema completo de cantoneiras

export * from './types'
export * from './calculator'

import { cantoneiraCalculator, CANTONEIRAS } from './calculator'

// Função utilitária para cálculo de múltiplos ambientes
export function calcularCantoneirasMultiplosAmbientes(
  ambientes: Array<{
    largura: number
    comprimento: number
    nome: string
  }>
) {
  return cantoneiraCalculator.calcularMultiplosAmbientes(ambientes)
}

// Exportar cantoneiras disponíveis
export { CANTONEIRAS }