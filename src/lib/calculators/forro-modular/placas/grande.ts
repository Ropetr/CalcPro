import { BasePlacaCalculator } from './base-calculator'
import { PlacaCalculator } from './types'

/**
 * Calculadora para placas grandes (0.625m × 1.25m)
 * Usada em: Isopor, PVC, Gesso, Mineral, FID, Rockfon
 */
export class PlacaGrandeCalculator extends BasePlacaCalculator implements PlacaCalculator {
  constructor() {
    super(
      'Placa Grande',
      { largura: 0.625, comprimento: 1.25 },
      'grande'
    )
  }
}

// Instância única para uso
export const placaGrande = new PlacaGrandeCalculator()