// Tipos para o sistema de cantoneiras do forro modular

export interface CantoneiraInfo {
  tamanho: number // 3.00m padrão
  codigo: string
  nome: string
}

export interface ParedeProjeto {
  medida: number
  ambiente: string
  tipo: 'largura' | 'comprimento'
}

export interface ResultadoCantoneira {
  inteiras: number
  recortes: number
  total: number
  detalhamento: {
    barrasInteiras: number
    barrasParaRecortes: number
    aproveitamento: Array<{
      barra: number
      uso1: {
        medida: number
        parede: string
      }
      uso2?: {
        medida: number
        parede: string
      }
      sobra?: number
    }>
  }
}

export interface ResultadoCantoneiras {
  cantoneira300: ResultadoCantoneira
  resumo: {
    totalBarras300: number
  }
}