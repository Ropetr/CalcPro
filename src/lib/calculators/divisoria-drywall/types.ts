// Tipos para calculadora de divisória Drywall

export interface MedidaParede {
  id: string
  nome: string
  altura: number
  largura: number
  descricao: string
  area: number
  especificacoes: {
    tipoChapa: '1.80' | '2.40'
    tipoMontante: '48' | '70' | '90'
    espacamentoMontante: '0.30' | '0.40' | '0.60'
    chapasPorLado: 'simples' | 'duplo' | 'quadruplo'
    tratamentoAcustico: 'nenhum' | 'la_pet' | 'la_vidro' | 'la_rocha'
    preenchido: boolean
  }
  vaos: {
    porta: {
      tipo: 'nenhuma' | 'comum' | 'passagem'
      largura?: number  // em metros
      altura?: number   // em metros
    }
    janelas: {
      quantidade: number
      largura: number   // largura total das janelas em metros
      altura: number    // altura padrão 1.05m
    }
    preenchido: boolean
  }
}

export interface CalculoMaterial {
  item: string
  descricao: string
  quantidade: number
  unidade: string
  observacoes?: string
}

export interface ResultadoCalculoDrywall {
  modalidade: 'abnt' | 'basica'
  paredes: MedidaParede[]
  areaTotal: number
  materiais: {
    chapas: CalculoMaterial[]
    perfis: CalculoMaterial[]
    fixacao: CalculoMaterial[]
    acabamento: CalculoMaterial[]
  }
  resumo: {
    totalChapas: number
    totalPerfis: number
    totalParafusos: number
    custoEstimado?: number
  }
}

export interface ConfiguracaoABNT {
  montante48: {
    chapasPorLado: 1
    isolamento: boolean
    perfilGuia: '48mm'
    perfilMontante: '48mm'
  }
  montante70: {
    chapasPorLado: 1 | 2
    isolamento: boolean
    perfilGuia: '70mm'
    perfilMontante: '70mm'
  }
  montante90: {
    chapasPorLado: 2
    isolamento: boolean
    perfilGuia: '90mm'
    perfilMontante: '90mm'
  }
}