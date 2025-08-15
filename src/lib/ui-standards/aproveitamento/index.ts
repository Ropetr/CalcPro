/**
 * Sistema Universal de Aproveitamento de Materiais
 * Exportações principais para uso em todas as calculadoras
 */

export * from './types'
export * from './engine'

// Helper functions para integração rápida
export { criarEngineAproveitamento } from './engine'

// Exemplos de uso para documentação
export const EXEMPLOS_USO = {
  // Piso Wall
  pisoWall: {
    materiaisPadrao: [
      {
        tipo: 'painel' as const,
        largura: 1.2,
        comprimento: 2.5,
        espessura: 30,
        codigo: 'PW30',
        descricao: 'Painel Wall 30mm - 1,20 x 2,50m'
      }
    ],
    config: {
      materialTipo: 'painel' as const,
      aproveitamentoMinimo: {
        largura: 0.30,
        comprimento: 0.50
      },
      permitirRotacao: true,
      permitirEmenda: false,
      prioridadeUso: 'otima' as const
    }
  },
  
  // Divisória Drywall  
  drywall: {
    materiaisPadrao: [
      {
        tipo: 'chapa' as const,
        largura: 1.20,
        comprimento: 2.44,
        codigo: 'CH12',
        descricao: 'Chapa Drywall 1,20 x 2,44m'
      }
    ],
    config: {
      materialTipo: 'chapa' as const,
      aproveitamentoMinimo: {
        largura: 0.40,
        comprimento: 0.60
      },
      permitirRotacao: false,
      permitirEmenda: false,
      prioridadeUso: 'comprimento' as const
    }
  }
} as const