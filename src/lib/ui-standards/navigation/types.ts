/**
 * Tipos para o sistema de navegação padronizado
 * Usado em todas as calculadoras do sistema
 */

export interface NavigationField {
  /** Nome do campo (ex: 'largura', 'comprimento', 'descricao') */
  name: string
  /** Seletor do campo ou elemento */
  selector: string
  /** Se é um campo obrigatório para cálculo */
  required?: boolean
  /** Validação customizada */
  validation?: (value: any) => boolean
}

export interface NavigationConfig {
  /** Campos que respondem aos atalhos de teclado */
  fields: NavigationField[]
  /** Função chamada ao pressionar TAB no último campo */
  onTabAction: () => void
  /** Função chamada ao pressionar ENTER com dados válidos */
  onEnterAction: () => void
  /** Função para validar se pode calcular */
  canCalculate?: () => boolean
  /** Mensagem de ajuda personalizada */
  helpText?: {
    tab: string
    enter: string
  }
}

export interface KeyboardNavigationHook {
  /** Configuração ativa */
  config: NavigationConfig | null
  /** Ativar/desativar navegação */
  setConfig: (config: NavigationConfig | null) => void
  /** Status se pode calcular */
  canCalculate: boolean
  /** Handler de teclado */
  handleKeyDown: (e: React.KeyboardEvent) => void
  /** Função para adicionar item (TAB) */
  addItem: () => void
  /** Função para calcular (ENTER) */
  calculate: () => void
}