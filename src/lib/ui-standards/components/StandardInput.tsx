/**
 * Input padronizado que combina navegação + formatação
 * Componente unificado para todas as calculadoras
 */

import React, { forwardRef } from 'react'
import { useDimensionFormat, useCurrencyFormat, usePercentageFormat } from '../formatting/useAutoFormat'
import { FormatConfig } from '../formatting/types'

interface StandardInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  /** Tipo de formatação */
  formatType?: 'dimension' | 'currency' | 'percentage' | 'none'
  /** Configuração customizada de formatação */
  formatConfig?: FormatConfig
  /** Valor inicial */
  initialValue?: string
  /** Callback quando valor muda (recebe o valor numérico) */
  onValueChange?: (numericValue: number, formattedValue: string) => void
  /** Callback quando valor é inválido */
  onValidationError?: (error: string) => void
  /** Campo obrigatório para navegação por teclado */
  required?: boolean
  /** Label para mostrar em caso de erro */
  label?: string
  /** Mostrar indicador de erro */
  showError?: boolean
}

export const StandardInput = forwardRef<HTMLInputElement, StandardInputProps>(
  ({
    formatType = 'dimension',
    formatConfig,
    initialValue = '',
    onValueChange,
    onValidationError,
    required = false,
    label,
    showError = true,
    className = '',
    ...props
  }, ref) => {
    
    // Selecionar hook de formatação baseado no tipo
    const dimensionFormat = useDimensionFormat(initialValue)
    const currencyFormat = useCurrencyFormat(initialValue)
    const percentageFormat = usePercentageFormat(initialValue)
    
    const formatHook = formatType === 'currency' ? currencyFormat :
                      formatType === 'percentage' ? percentageFormat :
                      formatType === 'dimension' ? dimensionFormat :
                      null
    
    // Callback para mudanças de valor
    React.useEffect(() => {
      if (formatHook && onValueChange) {
        onValueChange(formatHook.value.numeric, formatHook.value.formatted)
      }
    }, [formatHook?.value.numeric, formatHook?.value.formatted, onValueChange])
    
    // Callback para erros de validação
    React.useEffect(() => {
      if (formatHook && !formatHook.value.isValid && formatHook.value.error && onValidationError) {
        onValidationError(formatHook.value.error)
      }
    }, [formatHook?.value.isValid, formatHook?.value.error, onValidationError])
    
    // Classes CSS baseadas no estado
    const inputClasses = `
      ${className}
      ${!formatHook?.value.isValid && showError ? 
        'border-red-300 bg-red-50 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500' : 
        'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
      }
    `.trim()
    
    // Se não há formatação, usar input normal
    if (formatType === 'none' || !formatHook) {
      return (
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
      )
    }
    
    return (
      <div className="relative">
        <input
          ref={ref}
          {...formatHook.inputProps}
          {...props}
          className={inputClasses}
        />
        
        {/* Indicador de erro */}
        {!formatHook.value.isValid && showError && formatHook.value.error && (
          <div className="absolute -bottom-5 left-0 text-xs text-red-600">
            {label ? `${label}: ${formatHook.value.error}` : formatHook.value.error}
          </div>
        )}
        
        {/* Indicador de valor válido */}
        {formatHook.value.isValid && formatHook.value.numeric > 0 && (
          <div className="absolute -right-2 top-1/2 -translate-y-1/2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        )}
      </div>
    )
  }
)

StandardInput.displayName = 'StandardInput'

/**
 * Input específico para dimensões (largura, comprimento, altura)
 */
export const DimensionInput = forwardRef<HTMLInputElement, Omit<StandardInputProps, 'formatType'>>(
  (props, ref) => (
    <StandardInput 
      ref={ref} 
      formatType="dimension" 
      placeholder="Ex: 3,50"
      {...props} 
    />
  )
)

DimensionInput.displayName = 'DimensionInput'

/**
 * Input específico para valores monetários
 */
export const CurrencyInput = forwardRef<HTMLInputElement, Omit<StandardInputProps, 'formatType'>>(
  (props, ref) => (
    <StandardInput 
      ref={ref} 
      formatType="currency" 
      placeholder="Ex: 150,00"
      {...props} 
    />
  )
)

CurrencyInput.displayName = 'CurrencyInput'

/**
 * Input específico para percentuais
 */
export const PercentageInput = forwardRef<HTMLInputElement, Omit<StandardInputProps, 'formatType'>>(
  (props, ref) => (
    <StandardInput 
      ref={ref} 
      formatType="percentage" 
      placeholder="Ex: 15,5"
      {...props} 
    />
  )
)

PercentageInput.displayName = 'PercentageInput'