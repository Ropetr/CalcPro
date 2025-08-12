// Tipos para calculadora de Forro PVC

export interface AmbientePVC {
  id: string
  largura: number
  comprimento: number
  descricao?: string
}

export interface ComodoPVC {
  id: string
  nome: string
  ambientes: AmbientePVC[]
  area: number
  tipoComodo: 'retangular' | 'em_l'
}

export interface MedidaExtraPVC {
  id: string
  nome: string
  comprimento: number
  quantidade: number
}

export interface EspecificacoesPVC {
  tipoPVC: 'branco' | 'texturizado' | 'madeirado'
  perfis: 'cantoneira' | 'perfil-h' | 'ambos'
  acabamento: 'branco' | 'colorido' | 'madeirado'
  instalacao: 'pregada' | 'encaixe' | 'colada'
}

export interface VaosPVC {
  luminárias: Array<{
    quantidade: number
    largura: number
    altura: number
  }>
  ventiladores: Array<{
    quantidade: number
    largura: number
    altura: number
  }>
  acesso: Array<{
    quantidade: number
    largura: number
    altura: number
  }>
}

// Tipos para otimização de cortes
export interface ReguaDisponivel {
  comprimento: number
  disponivel: boolean
}

export interface SolucaoCorte {
  tipo: 'simples' | 'combinacao' | 'emenda'
  reguas: Array<{
    comprimento: number
    quantidade: number
  }>
  desperdicioTotal: number
  totalReguas: number
  descricao: string
  temEmenda: boolean
}

export interface SobraAproveitavel {
  comprimento: number
  origem: string
}

export interface PlanoCorte {
  barra: number
  cortes: Record<string, number>
  sobra: number
  comprimentoUsado: number
  ambiente: string
}

export interface InstrucaoCorte {
  texto: string
  tipo: 'aproveitamento' | 'corte_novo' | 'emenda'
}

// Tipos para resultados
export interface ResultadoComodoPVC {
  nome: string
  area: number
  ambientes: AmbientePVC[]
  
  // Forro
  reguasForro: Array<{
    comprimento: number
    quantidade: number
  }>
  desperdicioForro: number
  
  // Rodaforro  
  barrasRodaforro: number
  desperdicioRodaforro: number
  instrucoesCorteRodaforro: string[]
  
  // Emendas
  emendas: number
  
  // Parafusos
  parafuso4213: number
  parafusoGN25: number
  parafusoBucha: number
  
  // Perfis
  cantoneiras: number
  perfisEmenda: number
  
  // Plano de corte
  planoCorte: PlanoCorte[]
  instrucoesCorte: InstrucaoCorte[]
}

export interface ResultadoCalculoPVC {
  comodos: ResultadoComodoPVC[]
  medidasExtras: ResultadoMedidaExtraPVC[]
  
  totais: {
    area: number
    reguasForro: Record<number, number> // comprimento -> quantidade
    barrasRodaforro: number
    desperdicioTotal: number
    
    // Parafusos (pacotes)
    parafuso4213: number
    parafusoGN25: number  
    parafusoBucha: number
    
    // Perfis (metros)
    cantoneiras: number
    perfisEmenda: number
  }
  
  resumoExecutivo: string[]
  observacoes: string[]
}

export interface ResultadoMedidaExtraPVC {
  nome: string
  comprimento: number
  quantidade: number
  solucaoCorte: SolucaoCorte | null
  instrucoesCorte: string[]
}