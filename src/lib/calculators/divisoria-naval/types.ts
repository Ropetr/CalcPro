// Tipos para Calculadora de Divisória Naval
// Sistema de painéis com miolo colmeia - Divilux/Eucatex

export interface MedidaDivisoria {
  id: string
  altura: number // metros
  largura: number // metros  
  quantidade: number
  descricao: string
  area: number
  especificacoes: {
    tipoPanel: '35' | '45' | '55' // espessura em mm
    perfilJuncao: 'padrao' | 'cromado' | 'anodizado' // Perfil H
    perfilRequadramento: 'padrao' | 'cromado' | 'anodizado' // Perfil U
    acabamento: 'melaminico' | 'texturizado' | 'formica' | 'verniz'
    preenchido: boolean
  }
  vaos: {
    vidros: {
      quantidade: number
      largura: number // metros
      altura: number // metros
    }
    portas: {
      quantidade: number
      largura: number // metros
      altura: number // metros
    }
    preenchido: boolean
  }
}

// Painéis disponíveis (sempre usados em pé)
export interface PainelDisponivel {
  largura: number // 1.20 ou 0.82
  altura: number // sempre 2.10
  tipo: 'grande' | 'pequeno'
}

// Perfis H disponíveis
export interface PerfilHDisponivel {
  comprimento: number // 3.00, 2.15, 1.18
  orientacao: 'pe' | 'deitado' // H 1.18 sempre deitado, outros em pé
  tipo: 'vertical' | 'horizontal'
}

// Perfis U disponíveis  
export interface PerfilUDisponivel {
  comprimento: number // 3.00, 2.15
  tipo: 'requadramento'
}

// Painel necessário para uma parede
export interface PainelNecessario {
  id: string
  largura: number
  altura: number
  posicao: 'inteiro' | 'recorte_largura' | 'recorte_altura' | 'recorte_ambos'
  camada: 'inferior' | 'superior' // para alturas > 2.10m
  origem: 'painel_1_20' | 'painel_0_82' // qual painel será usado
  aproveitado: boolean // se veio de uma sobra
}

// Perfil H necessário
export interface PerfilHNecessario {
  id: string
  comprimento: number
  orientacao: 'pe' | 'deitado'
  tipo: 'vertical' | 'horizontal'
  posicao: string // descrição da localização
  aproveitado: boolean
}

// Perfil U necessário
export interface PerfilUNecessario {
  id: string
  comprimento: number
  posicao: 'piso' | 'teto' | 'lateral_esquerda' | 'lateral_direita'
  aproveitado: boolean
}

// Sobras para aproveitamento
export interface SobraPainel {
  largura: number
  altura: number
  origem: 'painel_1_20' | 'painel_0_82'
  disponivel: boolean
}

export interface SobraPerfilH {
  comprimento: number
  origem: '3_00' | '2_15' | '1_18'
  orientacao: 'pe' | 'deitado'
  disponivel: boolean
}

export interface SobraPerfilU {
  comprimento: number
  origem: '3_00' | '2_15'
  disponivel: boolean
}

// Pools de aproveitamento
export interface PoolsAproveitamento {
  paineis: {
    altura_integral: SobraPainel[] // painéis com altura 2.10m completa
    recortes_altura: SobraPainel[] // recortes de altura customizada
  }
  perfis_h: SobraPerfilH[]
  perfis_u: SobraPerfilU[]
}

// Resultado do cálculo de uma parede
export interface ResultadoParedeDivisoria {
  medida: MedidaDivisoria
  paineis: {
    necessarios: PainelNecessario[]
    paineis_1_20_usados: number
    paineis_0_82_usados: number
    sobras_geradas: SobraPainel[]
  }
  perfis_h: {
    necessarios: PerfilHNecessario[]
    perfis_3_00_usados: number
    perfis_2_15_usados: number
    perfis_1_18_usados: number
    sobras_geradas: SobraPerfilH[]
  }
  perfis_u: {
    necessarios: PerfilUNecessario[]
    perfis_3_00_usados: number
    perfis_2_15_usados: number
    sobras_geradas: SobraPerfilU[]
  }
  area_liquida: number // área descontando vãos
  area_vaos: number
}

// Resultado completo do cálculo
export interface ResultadoCalculoDivisoriaNaval {
  paredes: ResultadoParedeDivisoria[]
  resumo: {
    area_total: number
    area_vaos: number
    area_liquida: number
    total_paredes: number
  }
  materiais: {
    paineis: {
      painel_1_20: number
      painel_0_82: number
      desperdicio_paineis: number // %
    }
    perfis_h: {
      h_3_00: number
      h_2_15: number
      h_1_18: number
      desperdicio_h: number // %
    }
    perfis_u: {
      u_3_00: number
      u_2_15: number
      desperdicio_u: number // %
    }
    acessorios: {
      kit_fixacao: number
      parafusos_4_2_13: number
      buchas: number
    }
  }
  aproveitamento: {
    paineis_aproveitados: number
    perfis_h_aproveitados: number
    perfis_u_aproveitados: number
    economia_total: number // valor em R$ ou %
  }
}

// Constantes do sistema
export const PAINEIS_DISPONIVEIS: PainelDisponivel[] = [
  { largura: 1.20, altura: 2.10, tipo: 'grande' },
  { largura: 0.82, altura: 2.10, tipo: 'pequeno' }
]

export const PERFIS_H_DISPONIVEIS: PerfilHDisponivel[] = [
  { comprimento: 3.00, orientacao: 'pe', tipo: 'vertical' },
  { comprimento: 2.15, orientacao: 'pe', tipo: 'vertical' },
  { comprimento: 1.18, orientacao: 'deitado', tipo: 'horizontal' }
]

export const PERFIS_U_DISPONIVEIS: PerfilUDisponivel[] = [
  { comprimento: 3.00, tipo: 'requadramento' },
  { comprimento: 2.15, tipo: 'requadramento' }
]

// Tamanhos mínimos para aproveitamento
export const APROVEITAMENTO_MINIMO = {
  painel_largura: 0.10, // 10cm
  painel_altura: 0.30, // 30cm  
  perfil_h: 0.20, // 20cm
  perfil_u: 0.30 // 30cm
}