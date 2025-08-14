// Tipos para calculadora de Piso Wall
export interface EspecificacaoPainel {
  espessura: number // em mm (30, 40, 40)
  largura: number   // em mm (1200)
  comprimento: number // em mm (2500, 2500, 3000) 
  peso: number      // em kg (80, 90, 108)
  apoios: number    // número de apoios por painel (4, 3, 4)
  cargaMaxima: number // kg/m² (500 para todos)
  codigo: 'PW30' | 'PW40-2500' | 'PW40-3000'
  descricao: string
  parafusosPorPainel: number // 12 para 2,50m ou 16 para 3,00m
}

export interface MedidaPisoWall {
  id: string
  largura: number // em metros
  comprimento: number // em metros
  area: number
  especificacao: EspecificacaoPainel
}

export interface ResultadoCalculo {
  areaTotal: number
  paineis: {
    especificacao: EspecificacaoPainel
    quantidade: number
    area: number
  }[]
  apoios: {
    total: number
    porPainel: number
  }
  resumo: {
    totalChapas: number
    totalParafusos: number
    totalAcessorios: number
  }
  materiais: {
    paineis: MaterialItem[]
    fixacao: MaterialItem[]
  }
}

export interface MaterialItem {
  item: string
  descricao: string
  quantidade: number
  unidade: string
  observacoes?: string
}

export interface PlanoCorte {
  painel: EspecificacaoPainel
  posicoes: {
    x: number
    y: number
    largura: number
    comprimento: number
    rotacionado?: boolean
  }[]
  aproveitamento: number // percentual
  sobras: {
    largura: number
    comprimento: number
    aproveitavel: boolean
  }[]
}

// Especificações dos painéis disponíveis
export const ESPECIFICACOES_PAINEIS: EspecificacaoPainel[] = [
  {
    espessura: 30,
    largura: 1200,
    comprimento: 2500,
    peso: 80,
    apoios: 4,
    cargaMaxima: 500,
    codigo: 'PW30',
    descricao: 'Painel Wall 30mm - 1,20 x 2,50m',
    parafusosPorPainel: 12 // 12 parafusos por painel 2,50m
  },
  {
    espessura: 40,
    largura: 1200,
    comprimento: 2500,
    peso: 90,
    apoios: 3,
    cargaMaxima: 500,
    codigo: 'PW40-2500',
    descricao: 'Painel Wall 40mm - 1,20 x 2,50m (Padrão)',
    parafusosPorPainel: 12 // 12 parafusos por painel 2,50m
  },
  {
    espessura: 40,
    largura: 1200,
    comprimento: 3000,
    peso: 108,
    apoios: 4,
    cargaMaxima: 500,
    codigo: 'PW40-3000',
    descricao: 'Painel Wall 40mm - 1,20 x 3,00m',
    parafusosPorPainel: 16 // 16 parafusos por painel 3,00m
  }
]