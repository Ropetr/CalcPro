/**
 * Sistema Universal de Aproveitamento de Materiais
 * Padrão adaptativo para todas as calculadoras
 */

export interface MaterialPadrao {
  tipo: 'chapa' | 'placa' | 'painel' | 'perfil' | 'regua' | 'modulo'
  largura: number     // em metros
  comprimento: number // em metros
  espessura?: number  // opcional, em mm
  codigo: string      // identificação única
  descricao: string
}

export interface RecorteDisponivel {
  id: string
  materialOrigem: MaterialPadrao
  largura: number        // dimensão disponível
  comprimento: number    // dimensão disponível
  origem: {
    ambiente: string     // onde foi gerado o recorte
    parede?: string      // se aplicável
    posicao: 'largura' | 'comprimento' | 'ambas'
  }
  aproveitavel: boolean  // se é grande o suficiente para uso
  usado: boolean         // se já foi aproveitado
  ondeUsado?: {
    ambiente: string
    parede?: string
    economia: number     // valor economizado em metros ou unidades
  }
}

export interface ConfigAproveitamento {
  materialTipo: MaterialPadrao['tipo']
  aproveitamentoMinimo: {
    largura: number      // mínimo em metros para aproveitar na largura
    comprimento: number  // mínimo em metros para aproveitar no comprimento
  }
  permitirRotacao: boolean  // se pode girar a peça (largura ↔ comprimento)
  permitirEmenda: boolean   // se aceita emendas
  prioridadeUso: 'largura' | 'comprimento' | 'otima'  // qual dimensão priorizar
}

export interface SolucaoAproveitamento {
  totalMaterialNovo: number
  totalRecortesUsados: number
  economiaPercentual: number
  detalhamento: {
    ambiente: string
    parede?: string
    materiaisNovos: {
      material: MaterialPadrao
      quantidade: number
      recortesGerados: RecorteDisponivel[]
    }[]
    recortesAproveitados: RecorteDisponivel[]
    sobrasFinais: RecorteDisponivel[]
  }[]
}

export interface GerenciadorAproveitamento {
  config: ConfigAproveitamento
  recortesDisponiveis: RecorteDisponivel[]
  
  // Métodos principais
  calcularNecessidade(largura: number, comprimento: number, ambiente: string, parede?: string): {
    materiaisNecessarios: { material: MaterialPadrao; quantidade: number }[]
    recortesGerados: RecorteDisponivel[]
    recortesUsados: RecorteDisponivel[]
  }
  
  adicionarRecorte(recorte: RecorteDisponivel): void
  buscarMelhorRecorte(larguraNecessaria: number, comprimentoNecessario: number): RecorteDisponivel | null
  gerarRelatorioAproveitamento(): SolucaoAproveitamento
}

// Presets por tipo de material
export const CONFIGS_APROVEITAMENTO: Record<MaterialPadrao['tipo'], ConfigAproveitamento> = {
  painel: {
    materialTipo: 'painel',
    aproveitamentoMinimo: {
      largura: 0.30,      // 30cm mínimo
      comprimento: 0.50   // 50cm mínimo
    },
    permitirRotacao: true,
    permitirEmenda: false,
    prioridadeUso: 'otima'
  },
  
  chapa: {
    materialTipo: 'chapa',
    aproveitamentoMinimo: {
      largura: 0.40,      // 40cm mínimo
      comprimento: 0.60   // 60cm mínimo
    },
    permitirRotacao: false,  // chapas drywall têm direção
    permitirEmenda: false,
    prioridadeUso: 'comprimento'
  },
  
  placa: {
    materialTipo: 'placa',
    aproveitamentoMinimo: {
      largura: 0.20,      // 20cm mínimo
      comprimento: 0.30   // 30cm mínimo  
    },
    permitirRotacao: true,
    permitirEmenda: true,
    prioridadeUso: 'otima'
  },
  
  perfil: {
    materialTipo: 'perfil',
    aproveitamentoMinimo: {
      largura: 0.30,      // não aplicável para perfis
      comprimento: 0.80   // 80cm mínimo para perfis
    },
    permitirRotacao: false,
    permitirEmenda: true,
    prioridadeUso: 'comprimento'
  },
  
  regua: {
    materialTipo: 'regua',
    aproveitamentoMinimo: {
      largura: 0.05,      // 5cm mínimo (largura da régua)
      comprimento: 0.10   // 10cm mínimo para aproveitamento
    },
    permitirRotacao: false,
    permitirEmenda: true,
    prioridadeUso: 'comprimento'
  },
  
  modulo: {
    materialTipo: 'modulo',
    aproveitamentoMinimo: {
      largura: 0.15,      // 15cm mínimo
      comprimento: 0.15   // 15cm mínimo (módulos são quadrados/retangulares pequenos)
    },
    permitirRotacao: true,
    permitirEmenda: false,
    prioridadeUso: 'otima'
  }
}