/**
 * Funções de formatação padronizada
 * Centraliza toda lógica de formatação do sistema
 */

import { FormatConfig, FormattedValue } from './types'

/**
 * Formatar valor conforme configuração
 */
export const formatValue = (
  input: string, 
  config: FormatConfig
): FormattedValue => {
  // Limpar input - remover tudo exceto números, vírgulas e pontos
  const cleanInput = input.replace(/[^\d,.,-]/g, '')
  
  // Converter . para , (padrão brasileiro)
  const normalizedInput = cleanInput.replace('.', ',')
  
  // Extrair número
  const numericValue = parseFloat(normalizedInput.replace(',', '.')) || 0
  
  // Validações
  const validation = validateValue(numericValue, config)
  if (!validation.isValid) {
    return {
      raw: input,
      formatted: input,
      numeric: numericValue,
      isValid: false,
      error: validation.error
    }
  }
  
  // Aplicar arredondamento
  const decimals = config.decimals ?? 2
  const roundedValue = Math.round(numericValue * Math.pow(10, decimals)) / Math.pow(10, decimals)
  
  // Formatar para exibição
  const formatted = formatForDisplay(roundedValue, config)
  
  return {
    raw: input,
    formatted,
    numeric: roundedValue,
    isValid: true
  }
}

/**
 * Validar valor conforme regras
 */
export const validateValue = (
  value: number, 
  config: FormatConfig
): { isValid: boolean; error?: string } => {
  // Verificar NaN
  if (isNaN(value)) {
    return { isValid: false, error: 'Valor inválido' }
  }
  
  // Verificar valores negativos
  if (!config.allowNegative && value < 0) {
    return { isValid: false, error: 'Valor não pode ser negativo' }
  }
  
  // Verificar valor mínimo
  if (config.min !== undefined && value < config.min) {
    return { isValid: false, error: `Valor mínimo: ${config.min}` }
  }
  
  // Verificar valor máximo
  if (config.max !== undefined && value > config.max) {
    return { isValid: false, error: `Valor máximo: ${config.max}` }
  }
  
  return { isValid: true }
}

/**
 * Formatar número para exibição
 */
export const formatForDisplay = (value: number, config: FormatConfig): string => {
  const decimals = config.decimals ?? 2
  
  // Formatar com casas decimais
  const formatted = value.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
  
  // Adicionar prefixo e sufixo
  const prefix = config.prefix || ''
  const suffix = config.suffix || ''
  
  return `${prefix}${formatted}${suffix}`
}

/**
 * Extrair apenas o número de um valor formatado
 */
export const extractNumericValue = (formattedValue: string): number => {
  // Remover tudo exceto números, vírgulas e pontos
  const cleaned = formattedValue.replace(/[^\d,.,-]/g, '')
  // Converter para formato americano e parsear
  const normalized = cleaned.replace(',', '.')
  return parseFloat(normalized) || 0
}

/**
 * Presets comuns de formatação
 */
export const formatPresets = {
  // Dimensões (metros)
  dimension: {
    type: 'dimension' as const,
    decimals: 2,
    min: 0,
    suffix: '',
    allowNegative: false,
    formatOnInput: false
  },
  
  // Moeda brasileira
  currency: {
    type: 'currency' as const,
    decimals: 2,
    min: 0,
    prefix: 'R$ ',
    allowNegative: false,
    formatOnInput: true
  },
  
  // Porcentagem
  percentage: {
    type: 'percentage' as const,
    decimals: 1,
    min: 0,
    max: 100,
    suffix: '%',
    allowNegative: false,
    formatOnInput: true
  },
  
  // Área (metros quadrados)
  area: {
    type: 'area' as const,
    decimals: 2,
    min: 0,
    suffix: ' m²',
    allowNegative: false,
    formatOnInput: false
  }
}

/**
 * Formatar especificamente para medidas de construção
 */
export const formatDimension = (input: string): FormattedValue => {
  return formatValue(input, formatPresets.dimension)
}

/**
 * Formatar especificamente para moeda
 */
export const formatCurrency = (input: string): FormattedValue => {
  return formatValue(input, formatPresets.currency)
}

/**
 * Auto-completar zeros para medidas
 * Exemplo: "1" → "1,00", "3,5" → "3,50"
 */
export const autoCompleteDimension = (input: string): string => {
  if (!input.trim()) return input
  
  const formatted = formatDimension(input)
  if (formatted.isValid) {
    // Retornar formato simples sem prefixo/sufixo para edição
    return formatted.numeric.toFixed(2).replace('.', ',')
  }
  
  return input
}