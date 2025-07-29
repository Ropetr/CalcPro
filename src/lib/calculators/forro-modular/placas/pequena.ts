import { BasePlacaCalculator } from './base-calculator'
import { PlacaCalculator } from './types'

/**
 * Calculadora para placas pequenas (0.625m × 0.625m)
 * Usada em: Situações específicas ou preferência do projeto
 */
export class PlacaPequenaCalculator extends BasePlacaCalculator implements PlacaCalculator {
  constructor() {
    super(
      'Placa Pequena',
      { largura: 0.625, comprimento: 0.625 },
      'pequena'
    )
  }
}

// Instância única para uso
export const placaPequena = new PlacaPequenaCalculator()