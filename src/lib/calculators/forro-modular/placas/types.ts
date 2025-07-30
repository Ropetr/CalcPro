// Tipos base para o sistema de placas do forro modular

export interface DimensoesPlaca {
  largura: number
  comprimento: number
}

export interface CalculoDimensao {
  quantidade: number
  inteiras: number
  fracao: number
  pedacoNecessario: number
  sobra: number
}

export interface RecorteInfo {
  quantidade: number
  tamanhoPorPeca: string
  sobraPorPeca: string
  aproveitavel: boolean
  detalhamentoPecas?: {
    tamanho: string
    quantidade: number
  }[]
  detalhamentoAproveitamento?: {
    placasNecessarias: number
    pecasPorPlaca: number
    totalPecas: number
    sobra: {
      tamanho: string
      aproveitavel: boolean
    }
  }
}

export interface RecortesPlaca {
  largura: RecorteInfo | null
  comprimento: RecorteInfo | null
  canto: {
    tamanho: string
    aproveitadoDaSobraLargura?: boolean
    aproveitadoDaSobraComprimento?: boolean
    precisaPlacaAdicional?: boolean
    detalhamentoPlacaAdicional?: {
      placasNecessarias: number
      tamanhoCorte: string
      sobra: string
    }
  } | null
}

export interface ResultadoCalculoPlacas {
  tipoPlaca: string
  dimensoesPlaca: DimensoesPlaca
  ambiente: {
    largura: number
    comprimento: number
    area: number
  }
  calculo: {
    largura: CalculoDimensao
    comprimento: CalculoDimensao
  }
  totalPlacas: number
  detalhamento: {
    placasInteiras: number
    placasComRecorte: number
  }
  recortes: RecortesPlaca
  observacoes: string[]
}

export interface PlacaCalculator {
  nome: string
  calcular(larguraAmbiente: number, comprimentoAmbiente: number): ResultadoCalculoPlacas
  dimensoes: DimensoesPlaca
  codigo: string
}