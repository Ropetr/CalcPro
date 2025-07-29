// Tipos para o sistema de projetos do CalcPro

export interface Cliente {
  nome: string
  email?: string
  telefone?: string
  empresa?: string
  endereco?: string
}

export interface CalculoRealizado {
  tipo: 'divisoria-drywall' | 'divisoria-naval' | 'forro-drywall' | 'forro-modular' | 'forro-pvc' | 'piso-laminado' | 'piso-vinilico' | 'piso-wall'
  dados: any // Dados específicos de cada calculadora
  resultado: any // Resultado do cálculo
  dataCalculo: string
}

export interface Projeto {
  id: string
  nome: string
  descricao?: string
  cliente?: Cliente
  tipo: 'residencial' | 'comercial' | 'industrial'
  categoria: 'divisoria' | 'forro' | 'piso' | 'misto'
  status: 'rascunho' | 'em-andamento' | 'concluido' | 'arquivado'
  
  // Metadados
  dataCriacao: string
  dataModificacao: string
  criadoPor: string // userId
  
  // Cálculos realizados
  calculos: CalculoRealizado[]
  
  // Observações e notas
  observacoes?: string
  
  // Tags para organização
  tags: string[]
  
  // Favorito
  favorito: boolean
  
  // Versioning simples
  versao: number
}

export interface TemplateProjeto {
  id: string
  nome: string
  descricao: string
  categoria: 'divisoria' | 'forro' | 'piso' | 'misto'
  tipo: 'residencial' | 'comercial' | 'industrial'
  calculosPreConfigurados: Omit<CalculoRealizado, 'resultado' | 'dataCalculo'>[]
  tags: string[]
  icone?: string
}

export interface FiltrosProjeto {
  categoria?: 'divisoria' | 'forro' | 'piso' | 'misto' | 'todos'
  status?: 'rascunho' | 'em-andamento' | 'concluido' | 'arquivado' | 'todos'
  tipo?: 'residencial' | 'comercial' | 'industrial' | 'todos'
  favoritos?: boolean
  periodo?: {
    inicio: string
    fim: string
  }
  busca?: string
}

export interface EstatisticasProjeto {
  totalProjetos: number
  projetosPorStatus: Record<string, number>
  projetosPorCategoria: Record<string, number>
  calculosMaisUsados: Array<{
    tipo: string
    quantidade: number
  }>
  produtividadeMensal: Array<{
    mes: string
    projetos: number
    calculos: number
  }>
}