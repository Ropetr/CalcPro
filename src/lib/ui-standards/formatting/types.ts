/**
 * Tipos para o sistema de formatação padronizada
 * Usado em todas as calculadoras do sistema
 */

export interface FormatConfig {
  /** Tipo de formatação */
  type: 'dimension' | 'currency' | 'percentage' | 'number'
  /** Número de casas decimais */
  decimals?: number
  /** Valor mínimo permitido */
  min?: number
  /** Valor máximo permitido */
  max?: number
  /** Prefixo (ex: 'R$ ') */
  prefix?: string
  /** Sufixo (ex: ' m', ' %') */
  suffix?: string
  /** Permitir valores negativos */
  allowNegative?: boolean
  /** Formatar durante digitação (onInput) ou só ao sair (onBlur) */
  formatOnInput?: boolean
}

export interface FormattedValue {
  /** Valor original inserido pelo usuário */
  raw: string
  /** Valor formatado para exibição */
  formatted: string
  /** Valor numérico para cálculos */
  numeric: number
  /** Se o valor é válido */
  isValid: boolean
  /** Mensagem de erro se inválido */
  error?: string
}

export interface AutoFormatHook {
  /** Valor atual formatado */
  value: FormattedValue
  /** Função para atualizar valor */
  setValue: (newValue: string) => void
  /** Props para aplicar no input */
  inputProps: {
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => void
  }
  /** Resetar valor */
  reset: () => void
}

export interface FormatPresets {
  dimension: FormatConfig
  currency: FormatConfig
  percentage: FormatConfig
  area: FormatConfig
}